import styles from './header.module.scss'
import {SignInButton} from "../SignInButton";
import {ActiveLink} from "../ActiveLink";

export function Header() {
    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <img src='/images/logo.svg' alt="Logo"/>
                <nav>
                    <ActiveLink activeClassName={styles.active} href={'/'}>
                        <a>
                            Home
                        </a>
                    </ActiveLink>
                    <ActiveLink activeClassName={styles.active} href={'/posts'}>
                        <a>
                            Post
                        </a>
                    </ActiveLink>
                </nav>
                <SignInButton/>
            </div>
        </header>
    )

}
