"use client";

// Module
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Style
import styles from '@/styles/Home/Home.module.css';

// Type
import type { ListAllClassesResponse } from "@/app/api/class/list-all/route"

export default function HomePage() {

    const [listAllClasses, setListAllClasses] = useState<ListAllClassesResponse>();
    const [totalKM, setTotalKM] = useState<number>(0);

    useEffect(() => {
        fetch("/api/class/list-all").then(res => res.json()).then(data => setListAllClasses(data));
    }, [])

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
                                <p>56 班</p>
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
                                {listAllClasses?.allClasses.map((classItem, index) => (
                                    <tr key={index}>
                                        <td className={`${styles.rank} ${styles[`rank${index + 1}`]}`}>{index + 1}</td>
                                        <td className={styles.className}>{classItem.name}</td>
                                        <td className={styles.distance}>{(classItem.laps * 0.4).toLocaleString('zh-TW')} 公里</td>
                                        <td>{((classItem.laps * 0.4) / 40).toFixed(1)} 公里</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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