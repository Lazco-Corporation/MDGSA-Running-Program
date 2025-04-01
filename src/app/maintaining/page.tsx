import styles from "@/styles/Global/Maintaining.module.css";

export default function Maintaining() {
  return (
    <div className={styles.center}>
      <h1>
        我們正在努力為您更新網頁。
        <br />
        請稍後再查看。
      </h1>
      <img
        src="/images/ill-be-back.gif"
        alt="我們正在努力為您更新網頁。請稍後再查看。"
      />
    </div>
  );
}
