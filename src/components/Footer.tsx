import styles from "@/styles/Global/Footer.module.css";

// 選項1：垂直排列
export default function Footer3() {
    return (
        <footer className={styles.footer}>
            <div className={styles.copyright}>
                <div className={styles.creditsContainer}>
                    <p className={styles.creditName}>圖像設計</p>
                    <div className={styles.verticalLine}></div>
                    <p className={styles.creditName}>黃楨芸</p>
                    <div className={styles.verticalLine}></div>
                    <p className={styles.creditName}>網頁開發</p>
                    <div className={styles.verticalLine}></div>
                    <p className={styles.creditName}>林杰陞、廖耿鋒、葉伯辰</p>
                </div>
                <p>版權所有 © 2025 明道中學畢業班級聯合會</p>
            </div>
        </footer>
    )
}