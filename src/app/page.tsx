"use client";

// Module
import Link from "next/link";
import { useState, useEffect } from "react";
import calculateProgress from "@/modules/caculateProgress";
import RouteProgressIndicator from "@/components/Home/RouteProgressIndicator";

// Style
import styles from "@/styles/Home/Home.module.css";

// Type
import type { ListAllClassesResponse } from "@/app/api/class/list-all/types";

// Config
import route from "@/config/route";

// 定義路線點類型
interface RoutePoint {
  name: string;
  distance: string;
  total: string;
}

export default function HomePage() {
  const [listAllClasses, setListAllClasses] = useState<ListAllClassesResponse | undefined>();
  const [totalLaps, setTotalLaps] = useState<number>(0);
  const [targetNow, setTargetNow] = useState<string>("");
  const [targetNext, setTargetNext] = useState<string>("");
  const [currentDistance, setCurrentDistance] = useState<number>(0);
  const [nextDistance, setNextDistance] = useState<number>(0);
  const [progressPercentage, setProgressPercentage] = useState<number>(0);
  const [routeData, setRouteData] = useState<RoutePoint[]>([]);
  const [graduateQuantity, setGraduateQuantity] = useState<number>(0);

  useEffect(() => {
    // 獲取路線配置數據
    const routes = route();
    setRouteData(routes);

    fetch("/api/class/list-all")
      .then((res) => res.json())
      .then((data: ListAllClassesResponse) => setListAllClasses(data));

    fetch("/api/class/total-laps")
      .then((res) => res.json())
      .then((data: { totalLaps: number }) => {
        const laps = data.totalLaps;
        const totalDistance = laps * 0.4;
        const progress = calculateProgress(totalDistance, routes);

        setTotalLaps(laps);
        setTargetNow(progress.current);
        setTargetNext(progress.next);
        setCurrentDistance(progress.currentDistance);
        setNextDistance(progress.nextDistance);
        setProgressPercentage(progress.progressPercentage);
      });

    fetch("/api/class/graduate-quantity")
      .then((res) => res.json())
      .then((data: { graduateClassesQuantity: number }) => setGraduateQuantity(data.graduateClassesQuantity));

  }, []);

  // 計算總距離
  const totalDistance = totalLaps * 0.4;

  // 為下方進度條計算基於實際距離的進度百分比
  const calculateDistanceProgressPercentage = () => {
    // 動態獲取起始和結束距離
    if (!routeData || routeData.length < 2) {
      return 0; // 如果沒有足夠的路線數據，返回0
    }

    // 從路線數據中找到最近的兩個點
    let startPointIndex = 0;
    let endPointIndex = 0;

    // 找到當前所在的區間
    for (let i = 0; i < routeData.length - 1; i++) {
      const currentPointDistance = parseFloat(routeData[i].total);
      const nextPointDistance = parseFloat(routeData[i + 1].total);

      if (currentPointDistance <= totalDistance && totalDistance < nextPointDistance) {
        startPointIndex = i;
        endPointIndex = i + 1;
        break;
      }
    }

    // 如果已經超過了最後一個點
    if (totalDistance >= parseFloat(routeData[routeData.length - 1].total)) {
      startPointIndex = routeData.length - 2;
      endPointIndex = routeData.length - 1;
    }

    // 如果還沒到第一個點
    if (totalDistance < parseFloat(routeData[0].total)) {
      startPointIndex = 0;
      endPointIndex = 1;
    }

    // 獲取起始和結束點的距離
    const startDistance = parseFloat(routeData[startPointIndex].total);
    const endDistance = parseFloat(routeData[endPointIndex].total);

    // 計算在給定範圍內的進度
    if (totalDistance <= startDistance) {
      return 0; // 還沒到起點
    } else if (totalDistance >= endDistance) {
      return 100; // 已經超過終點
    } else {
      // 計算在範圍內的百分比
      const rangeProgress = ((totalDistance - startDistance) / (endDistance - startDistance)) * 100;
      return rangeProgress;
    }
  };

  // 獲取實際距離的進度百分比以及當前區間的起始和結束距離
  const { percentage: distanceProgressPercentage, start: currentStartDistance, end: currentEndDistance } = (() => {
    if (!routeData || routeData.length < 2) {
      return { percentage: 0, start: 0, end: 0 };
    }

    // 找到當前所在的區間
    let startPointIndex = 0;
    let endPointIndex = 0;

    for (let i = 0; i < routeData.length - 1; i++) {
      const currentPointDistance = parseFloat(routeData[i].total);
      const nextPointDistance = parseFloat(routeData[i + 1].total);

      if (currentPointDistance <= totalDistance && totalDistance < nextPointDistance) {
        startPointIndex = i;
        endPointIndex = i + 1;
        break;
      }
    }

    // 如果已經超過了最後一個點
    if (totalDistance >= parseFloat(routeData[routeData.length - 1].total)) {
      startPointIndex = routeData.length - 2;
      endPointIndex = routeData.length - 1;
    }

    // 如果還沒到第一個點
    if (totalDistance < parseFloat(routeData[0].total)) {
      startPointIndex = 0;
      endPointIndex = 1;
    }

    // 獲取起始和結束點的距離
    const startDistance = parseFloat(routeData[startPointIndex].total);
    const endDistance = parseFloat(routeData[endPointIndex].total);

    // 計算百分比
    let percentage = 0;
    if (totalDistance <= startDistance) {
      percentage = 0;
    } else if (totalDistance >= endDistance) {
      percentage = 100;
    } else {
      percentage = ((totalDistance - startDistance) / (endDistance - startDistance)) * 100;
    }

    return {
      percentage: percentage,
      start: startDistance,
      end: endDistance
    };
  })();

  return (
    <div>
      <div className={styles.progressWrapper}>
        <div className={styles.container}>
          <section className={styles.progressSection}>
            <h2 className={styles.progressTitle}>目前進度</h2>
            <div className={styles.progressInfo}>
              <div className={styles.progressStat}>
                <h3>累計總里程</h3>
                <p>
                  {totalDistance.toLocaleString("zh-TW")} 公里
                </p>
              </div>
              <div className={styles.progressStat}>
                <h3>目前位置</h3>
                <p className={styles.destination}>{targetNow}</p>
              </div>
              <div className={styles.progressStat}>
                <h3>下個目標</h3>
                <p className={styles.destination}>{targetNext}</p>
              </div>
              <div className={styles.progressStat}>
                <h3>畢業班數量</h3>
                <p>{graduateQuantity} 班</p>
              </div>
            </div>

            {/* 路線進度指示器 */}
            {routeData.length > 0 && (
              <RouteProgressIndicator
                routes={routeData}
                totalDistance={totalDistance}
              />
            )}

            {/* 修改後的距離進度條 - 使用動態獲取的起始和結束距離 */}
            <div className={styles.progressBarWrapper}>
              <div className={styles.progressBarLabel}>
                <p>{targetNow}</p>
                {currentStartDistance.toLocaleString("zh-TW")} 公里
              </div>
              <div className={styles.progressBarContainer}>
                <div
                  className={styles.progressBar}
                  style={{ width: `${distanceProgressPercentage}%` }}
                ></div>
              </div>
              <div className={styles.progressBarLabel}>
                <p>{targetNext}</p>
                {currentEndDistance.toLocaleString("zh-TW")} 公里
              </div>
            </div>

            <Link href="/record" className={styles.joinButton}>
              記錄跑步
            </Link>
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
              <tbody className={styles.scrollBody}>
                {listAllClasses?.allClasses.map((classItem, index) => (
                  <tr key={index}>
                    <td
                      className={`${styles.rank} ${index < 3 ? styles[`rank${index + 1}`] : ""}`}
                    >
                      {index + 1}
                    </td>
                    <td className={styles.className}>{classItem.name}</td>
                    <td className={styles.distance}>
                      {(classItem.laps * 0.4).toLocaleString("zh-TW")}{" "}
                      公里
                    </td>
                    <td>
                      {classItem.name === "行政團隊"
                        ? "都很努力🙂‍↕️"
                        : `${((classItem.laps * 0.4) / 45).toFixed(2)} 公里`}
                    </td>
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
                <h3 className={styles.featureTitle}>計分方式</h3>
                <p className={styles.featureDescription}>
                  統計每個班級每位同學的跑步圈數，依照總公里數進行班級排名。
                </p>
              </div>

              {/* <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🤝</div>
                <h3 className={styles.featureTitle}>加碼挑戰</h3>
                <p className={styles.featureDescription}>
                  高級部舉辦大隊接力賽，各班組隊挑戰接力跑。<br />
                  國中部設計趣味闖關活動，累積額外圈數。
                </p>
              </div> */}

              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🌍</div>
                <h3 className={styles.featureTitle}>總里程累積</h3>
                <p className={styles.featureDescription}>
                  全校總圈數將轉換為總公里數，挑戰設定的里程目標。
                </p>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🏆</div>
                <h3 className={styles.featureTitle}>獎勵機制</h3>
                <p className={styles.featureDescription}>
                  全校總公里數達標即可解鎖對應獎勵，表現優異的班級會獲得額外榮譽獎項。
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}