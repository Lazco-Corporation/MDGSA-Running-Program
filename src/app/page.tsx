// pages/index.js
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/Home/Home.module.css';

export default function HomePage() {
    return (
        <div>
            <div className={styles.progressWrapper}>
                <div className={styles.container}>
                    <section className={styles.progressSection}>
                        <h2 className={styles.progressTitle}>目前進度</h2>
                        <div className={styles.progressInfo}>
                            <div className={styles.progressStat}>
                                <h3>累計總里程</h3>
                                <p>24,901 公里</p>
                            </div>
                            <div className={styles.progressStat}>
                                <h3>目前位置</h3>
                                <p className={styles.destination}>環繞地球一圈</p>
                            </div>
                            <div className={styles.progressStat}>
                                <h3>下個目標</h3>
                                <p className={styles.destination}>地球到月球</p>
                            </div>
                            <div className={styles.progressStat}>
                                <h3>畢業班數量</h3>
                                <p>53 班</p>
                            </div>
                        </div>

                        <div className={styles.progressBarContainer}>
                            <div className={styles.progressBar}></div>
                        </div>

                        <p className={styles.progressMessage}>恭喜！我們已經環繞地球一圈了！下一站：月球（距離：384,400 公里）</p>

                        <Link href="/record" className={styles.joinButton}>記錄我的跑步</Link>
                    </section>
                </div>
            </div>

            <div className={styles.rankingWrapper}>
                <div className={styles.container}>
                    <section className={styles.rankingSection}>
                        <h2 className={styles.rankingTitle}>班級排名</h2>
                        <table className={styles.rankingTable}>
                            <thead>
                                <tr>
                                    <th>排名</th>
                                    <th>班級</th>
                                    <th>累計里程</th>
                                    <th>平均每人</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className={`${styles.rank} ${styles.rank1}`}>1</td>
                                    <td className={styles.className}>高二3班</td>
                                    <td className={styles.distance}>2,145 公里</td>
                                    <td>53.6 公里</td>
                                </tr>
                                <tr>
                                    <td className={`${styles.rank} ${styles.rank2}`}>2</td>
                                    <td className={styles.className}>高一5班</td>
                                    <td className={styles.distance}>1,963 公里</td>
                                    <td>49.1 公里</td>
                                </tr>
                                <tr>
                                    <td className={`${styles.rank} ${styles.rank3}`}>3</td>
                                    <td className={styles.className}>高三1班</td>
                                    <td className={styles.distance}>1,879 公里</td>
                                    <td>47.0 公里</td>
                                </tr>
                                <tr>
                                    <td className={styles.rank}>4</td>
                                    <td className={styles.className}>高一2班</td>
                                    <td className={styles.distance}>1,752 公里</td>
                                    <td>43.8 公里</td>
                                </tr>
                                <tr>
                                    <td className={styles.rank}>5</td>
                                    <td className={styles.className}>高二8班</td>
                                    <td className={styles.distance}>1,645 公里</td>
                                    <td>41.1 公里</td>
                                </tr>
                                <tr>
                                    <td className={styles.rank}>6</td>
                                    <td className={styles.className}>高三4班</td>
                                    <td className={styles.distance}>1,589 公里</td>
                                    <td>39.7 公里</td>
                                </tr>
                                <tr>
                                    <td className={styles.rank}>7</td>
                                    <td className={styles.className}>高二1班</td>
                                    <td className={styles.distance}>1,487 公里</td>
                                    <td>37.2 公里</td>
                                </tr>
                            </tbody>
                        </table>
                        {/* 
                        <div className={styles.viewMoreContainer}>
                            <Link href="/ranking" className={styles.viewMoreLink}>
                                查看完整排名
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div> */}
                    </section>
                </div>
            </div>

            <div className={styles.featuresWrapper}>
                <div className={styles.container}>
                    <section className={styles.featuresSection}>
                        <h2 className={styles.sectionTitle}>活動特色</h2>

                        <div className={styles.featuresGrid}>
                            <div className={styles.featureCard}>
                                <div className={styles.featureIcon}>🏃</div>
                                <h3 className={styles.featureTitle}>個人成長</h3>
                                <p className={styles.featureDescription}>
                                    每一步都是自我突破，記錄個人成長歷程，挑戰自己的極限。
                                </p>
                            </div>

                            <div className={styles.featureCard}>
                                <div className={styles.featureIcon}>🤝</div>
                                <h3 className={styles.featureTitle}>團隊合作</h3>
                                <p className={styles.featureDescription}>
                                    班級共同努力，累積里程，培養團隊合作精神與集體榮譽感。
                                </p>
                            </div>

                            <div className={styles.featureCard}>
                                <div className={styles.featureIcon}>🌍</div>
                                <h3 className={styles.featureTitle}>全球視野</h3>
                                <p className={styles.featureDescription}>
                                    透過虛擬旅程，環繞地球甚至到達太空，拓展學生的國際視野。
                                </p>
                            </div>

                            <div className={styles.featureCard}>
                                <div className={styles.featureIcon}>🏆</div>
                                <h3 className={styles.featureTitle}>健康生活</h3>
                                <p className={styles.featureDescription}>
                                    養成規律運動習慣，促進身心健康，建立積極正向的生活態度。
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}