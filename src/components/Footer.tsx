import styles from "@/styles/Global/Footer.module.css";

<<<<<<< HEAD
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
=======
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div>
        <div>
          <p>
            美術設計：黃楨芸　|　網頁開發：
            <a
              href="https://www.instagram.com/jason_lin_0222"
              target="_blank"
              rel="noreferrer"
            >
              林杰陞
            </a>
            、
            <a
              href="https://www.instagram.com/oncloud125252"
              target="_blank"
              rel="noreferrer"
            >
              廖耿鋒
            </a>
            、
            <a
              href="https://www.instagram.com/pn0818x"
              target="_blank"
              rel="noreferrer"
            >
              葉伯辰
            </a>
          </p>
        </div>
        {/* <div>
          <p></p>
        </div> */}
      </div>
      <div className={styles.copyright}>
        <p>
          {"版權所有 © "}
          <a
            href="https://www.instagram.com/2025mdgsa_"
            target="_blank"
            rel="noreferrer"
          >
            2025 明道中學畢業班級聯誼會
          </a>
        </p>
      </div>
    </footer>
  );
}
>>>>>>> 10f302c4c7bf3705ae3e83e30311bf4271befeca
