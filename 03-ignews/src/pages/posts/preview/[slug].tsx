import {GetStaticProps} from "next";
import {getSession, useSession} from "next-auth/client";
import {getPrismicClient} from "../../../service/primisc";
import {RichText} from "prismic-dom";
import Head from "next/head";

import styles from '../Post.module.scss'
import Link from "next/link";
import {useEffect} from "react";
import {useRouter} from "next/router";


interface PostPreViewProps {
    post:{
        slug: string;
        title: string;
        content: string;
        updateAt: string;
    }
}

export default function Post({ post }: PostPreViewProps) {

    const [session] = useSession()
    const router = useRouter()

    useEffect(() => {
        if(session?.activeSubscription) {
            router.push(`/posts/${post.slug}`)
        }
    }, [session])

    return (
        <>
            <Head>
                <title>{post.title} | Ignews</title>
            </Head>
            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updateAt}</time>
                    <div className={`${styles.postContent} ${styles.previewContent}`} dangerouslySetInnerHTML={{__html: post.content}} />
                    <div className={styles.continueReading}>
                        Wanna continue reading?
                        <Link href="/">
                            <a>Subscribe Now</a>
                        </Link>
                    </div>
                </article>
            </main>
        </>
    )
}

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async ({params}) => {

    const { slug } = params

    const prismic = getPrismicClient()

    const response = await prismic.getByUID('publications', String(slug), {})

    const post = {
        slug,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content.splice(0, 3)),
        updateAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    }

    return {
        props: {
            post
        },
        redirect: 60 * 30,
    }
}
