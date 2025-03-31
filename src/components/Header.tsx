// Module
import Image from "next/image";
import Link from "next/link";

// Style
import styles from "@/styles/Global/Header.module.css"

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div className={styles.logoContainer}>
                    <Link href="/">
                        <Image
                            src="/logos/logo.png"
                            alt="明道中學「為夢想而跑」活動Logo"
                            width={180}
                            height={45}
                            priority
                        />
                    </Link>
                </div>
                <div className={styles.actionButton}>
                    <Link href="/record" className={styles.loginButton}>
                        記錄跑步
                    </Link>
                </div>
            </div>
        </header>
    )
}