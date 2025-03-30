import React, { useRef, useEffect, useState } from 'react';
import styles from '@/styles/Home/Home.module.css';

// 定義路線點的型別
interface RoutePoint {
    name: string;
    distance: string;
    total: string;
}

// 擴展路線點型別，加入已訪問狀態
interface RoutePointWithStatus extends RoutePoint {
    visited: boolean;
}

// 定義元件的 props 型別
interface RouteProgressIndicatorProps {
    routes: RoutePoint[];
    totalDistance: number;
}

/**
 * 路線進度指示器元件 - 直接解決方案
 */
const RouteProgressIndicator: React.FC<RouteProgressIndicatorProps> = ({ routes, totalDistance }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // 決定哪些點已經被訪問
    const getVisitedStatus = (routes: RoutePoint[], totalDistance: number): RoutePointWithStatus[] => {
        return routes.map(route => ({
            ...route,
            visited: parseFloat(route.total) <= totalDistance
        }));
    };

    const routesWithStatus: RoutePointWithStatus[] = getVisitedStatus(routes, totalDistance);

    // 計算每個路段是否應該顯示進度顏色
    const segmentsShouldBeColored = calculateSegmentsColored(routesWithStatus);

    // 計算當前進行中的段落進度
    const { currentSegmentIndex, progressInSegment } = calculateCurrentProgress(routesWithStatus, totalDistance);

    return (
        <div className={styles.routeIndicatorWrapper}>
            <div className={styles.routeIndicatorContent}>
                <div ref={containerRef} className={styles.routePointsContainer}>
                    {/* 路線段落 */}
                    {routesWithStatus.slice(0, -1).map((startPoint, index) => {
                        const endPoint = routesWithStatus[index + 1];
                        const isCurrentSegment = index === currentSegmentIndex;
                        const isCompleted = segmentsShouldBeColored[index];

                        return (
                            <div
                                key={`segment-${index}`}
                                className={styles.routeSegment}
                                style={{
                                    left: `${(index / (routesWithStatus.length - 1)) * 100}%`,
                                    width: `${(1 / (routesWithStatus.length - 1)) * 100}%`,
                                    zIndex: 1
                                }}
                            >
                                {/* 段落背景 */}
                                <div className={styles.routeSegmentBackground}></div>

                                {/* 段落進度 - 只在當前段落或已完成段落顯示 */}
                                {(isCompleted || isCurrentSegment) && (
                                    <div
                                        className={styles.routeSegmentProgress}
                                        style={{
                                            width: isCurrentSegment ? `${progressInSegment * 100}%` : '100%'
                                        }}
                                    ></div>
                                )}
                            </div>
                        );
                    })}

                    {/* 路線點 */}
                    {routesWithStatus.map((route, index) => (
                        <div
                            key={`point-${index}`}
                            className={styles.routePoint}
                            style={{
                                left: `${(index / (routesWithStatus.length - 1)) * 100}%`,
                                transform: 'translateX(-50%)'
                            }}
                        >
                            {/* 圓形數字 */}
                            <div
                                className={`${styles.routeDot} ${route.visited ? styles.routeDotVisited : styles.routeDotUnvisited
                                    }`}
                                title={`${route.name}: ${route.total} 公里`}
                            >
                                {index + 1}
                            </div>

                            {/* 點位名稱 */}
                            <div
                                className={`${styles.routePointName} ${route.visited ? styles.routePointNameVisited : styles.routePointNameUnvisited
                                    }`}
                                title={route.name}
                            >
                                {route.name}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

/**
 * 計算每個路段是否應該被著色
 * @returns 布爾值數組，表示每個路段是否應該著色
 */
function calculateSegmentsColored(routesWithStatus: RoutePointWithStatus[]): boolean[] {
    if (routesWithStatus.length <= 1) {
        return [];
    }

    const segmentColors: boolean[] = [];

    // 遍歷所有路段
    for (let i = 0; i < routesWithStatus.length - 1; i++) {
        const startPoint = routesWithStatus[i];
        const endPoint = routesWithStatus[i + 1];

        // 如果起點已被訪問，則該段應該著色
        // 即使終點未被訪問，也應該著色
        segmentColors.push(startPoint.visited);
    }

    return segmentColors;
}

/**
 * 計算當前進行中的段落和進度
 */
function calculateCurrentProgress(routesWithStatus: RoutePointWithStatus[], totalDistance: number) {
    if (routesWithStatus.length <= 1) {
        return { currentSegmentIndex: -1, progressInSegment: 0 };
    }

    // 找到當前位置所處的路段
    let currentIndex = -1;
    for (let i = 0; i < routesWithStatus.length; i++) {
        if (parseFloat(routesWithStatus[i].total) <= totalDistance) {
            currentIndex = i;
        } else {
            break;
        }
    }

    // 如果是最後一個點或未到第一個點
    if (currentIndex === routesWithStatus.length - 1 || currentIndex < 0) {
        return { currentSegmentIndex: -1, progressInSegment: 0 };
    }

    // 計算當前段落的進度
    const currentDistance = parseFloat(routesWithStatus[currentIndex].total);
    const nextDistance = parseFloat(routesWithStatus[currentIndex + 1].total);
    const segmentTotal = nextDistance - currentDistance;
    const segmentProgress = totalDistance - currentDistance;
    const progress = segmentTotal > 0 ? segmentProgress / segmentTotal : 0;

    return {
        currentSegmentIndex: currentIndex,
        progressInSegment: Math.min(1, Math.max(0, progress))
    };
}

export default RouteProgressIndicator;