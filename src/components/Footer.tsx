import styles from "@/styles/Global/Footer.module.css";

// 選項1：垂直排列
export default function Footer3() {
    return (
        <footer className={styles.footer}>
            <div className={styles.copyright}>
                <div className={styles.creditsContainer}>
                    <div className={styles.nameWrapper}>
                        <div className={styles.nameWrapper2}>
                            <p className={styles.creditName + " " + styles.creditTitle}>圖像設計</p>
                            <div className={styles.verticalLine}></div>
                            <div className={styles.horizenLine}></div>
                            <p className={styles.creditName + " " + styles.creditContent}>黃楨芸</p>
                        </div>
                        <div className={styles.verticalLineMiddle}></div>
                        <div className={styles.nameWrapper2}>
                            <p className={styles.creditName + " " + styles.creditTitle}>網頁開發</p>
                            <div className={styles.verticalLine}></div>
                            <div className={styles.horizenLine}></div>
                            <p className={styles.creditName + " " + styles.creditContent}>
                                <a
                                    href="https://www.instagram.com/jason_lin_0222"
                                    target="_blank"
                                    rel="noreferrer"
                                    className={styles.link}
                                >
                                    林杰陞
                                </a>
                                、
                                <a
                                    href="https://www.instagram.com/oncloud125252"
                                    target="_blank"
                                    rel="noreferrer"
                                    className={styles.link}
                                >
                                    廖耿鋒
                                </a>
                                、
                                <a
                                    href="https://www.instagram.com/pn0818x"
                                    target="_blank"
                                    rel="noreferrer"
                                    className={styles.link}
                                >
                                    葉柏辰
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
                <p>
                    {"版權所有 © "}
                    <a
                        href="https://www.instagram.com/2025mdgsa_"
                        target="_blank"
                        rel="noreferrer"
                        className={styles.link}
                    >
                        2025 明道中學畢業班級聯誼會
                    </a>
                </p>
            </div >
        </footer >
    )
}