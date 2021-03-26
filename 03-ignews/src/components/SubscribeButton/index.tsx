import styles from './styles.module.scss'
import { useSession, signIn } from "next-auth/client";
import { api } from "../../service/api";
import { getStripeJs } from "../../service/stripe-js";
import {useRouter} from "next/router";


interface SubscribeButtonProps {
    priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {

    const [ session ] = useSession()
    const router = useRouter()

    async function handleSubscription() {
        if(!session) {
            signIn('github')
            return
        }

        if(session.activeSubscription) {
            router.push(`/posts`)
            return
        }


        try {
            const response = await api.post('/subscribe')
            const { sessionId } = response.data

            const stripe = await getStripeJs()

            await stripe.redirectToCheckout({ sessionId })

        } catch (e) {
            alert(e.message)
        }
    }

    return (
        <button
            type="button"
            className={styles.subScribeButton}
            onClick={handleSubscription}
        >
            Subscribe Now
        </button>
    )
}
