import {NextApiRequest, NextApiResponse} from "next";
import { Readable } from 'stream'
import { Stripe } from "stripe";
import {stripe} from "../../service/stripe";
import { SaveSubscription } from "./_lib/ManageSubscriptions";

async function buffer(readdle: Readable) {
    const chunks = []

    for await(const chunk of readdle) {
        chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk)
    }
    return Buffer.concat(chunks)
}

export const config = {
    api: {
        bodyParser: false
    }
}

const relevantEvents = new Set([
    'checkout.session.completed',
    'customer.subscription.updated',
    'customer.subscription.deleted'

])

export default async (req: NextApiRequest, res: NextApiResponse) => {

    if(req.method === "POST") {
        const buf = await buffer(req)
        const secret = req.headers['stripe-signature']

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOK_SECRET)
        } catch (e) {
            return res.status(400).send(`webhook error: ${e.message}`)
        }

        const { type } = event

        if(relevantEvents.has(type)) {
            try {
                switch (type) {
                    case 'customer.subscription.updated':
                    case 'customer.subscription.deleted':
                        const subscription = event.data.object as Stripe.Subscription

                        await SaveSubscription(
                            subscription.id,
                            subscription.customer.toString(),
                            false
                        )

                        break;
                    case 'checkout.session.completed':
                        console.log('function')
                        const checkoutSession = event.data.object as Stripe.Checkout.Session

                        await SaveSubscription(
                            checkoutSession.subscription.toString(),
                            checkoutSession.customer.toString(),
                            true
                        )
                        break;
                    default:
                        throw new Error('unhandled event')
                }
            } catch (e) {
                return res.json({error: 'Webhook handler error'})
            }
        }

        res.json({ok: true})
    } else {
        res.setHeader('Allow', 'POST')
        res.status(405).end('Method Not Allowed')
    }
}
