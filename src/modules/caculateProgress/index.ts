// @/modules/caculateProgress/index.ts

// 定義路線點的類型
interface RoutePoint {
  name: string;
  distance: string;
}

// 定義進度返回值的類型
interface ProgressResult {
  current: string;
  next: string;
  currentDistance: number;
  nextDistance: number;
  progressPercentage: number;
}

/**
 * 計算當前位置、下一個目標和進度百分比
 * @param totalDistance 累計總距離（公里）
 * @param routes 路線配置陣列
 * @returns 當前位置、下一個目標、當前距離、下一個目標距離和進度百分比
 */
function calculateProgress(totalDistance: number, routes: RoutePoint[]): ProgressResult {
  // 如果沒有總距離或路線，返回默認值
  if (!totalDistance || !routes || routes.length === 0) {
    return {
      current: "",
      next: "",
      currentDistance: 0,
      nextDistance: 0,
      progressPercentage: 0
    };
  }

  // 如果總距離為0，表示還在起點
  if (totalDistance === 0) {
    return {
      current: routes[0].name,
      next: routes.length > 1 ? routes[1].name : "",
      currentDistance: 0,
      nextDistance: routes.length > 1 ? parseFloat(routes[1].distance) : 0,
      progressPercentage: 0
    };
  }

  // 找出當前位置和下一個目標
  let currentIndex = 0;
  
  for (let i = 0; i < routes.length; i++) {
    if (parseFloat(routes[i].distance) <= totalDistance) {
      currentIndex = i;
    } else {
      break;
    }
  }

  // 計算當前位置
  const current = routes[currentIndex].name;
  const currentDistance = parseFloat(routes[currentIndex].distance);
  
  // 計算下一個目標
  const hasNextTarget = currentIndex < routes.length - 1;
  const next = hasNextTarget ? routes[currentIndex + 1].name : "已到達終點";
  const nextDistance = hasNextTarget ? parseFloat(routes[currentIndex + 1].distance) : currentDistance;
  
  // 計算進度百分比
  let progressPercentage = 0;
  
  if (hasNextTarget) {
    // 計算從當前點到下一個點的進度百分比
    const segmentDistance = nextDistance - currentDistance;
    const progressInSegment = totalDistance - currentDistance;
    
    if (segmentDistance > 0) {
      // 計算在當前段落的進度比例
      const segmentProgress = progressInSegment / segmentDistance;
      // 限制在 0-1 之間
      const clampedSegmentProgress = Math.min(1, Math.max(0, segmentProgress));
      
      // 計算整體進度百分比
      // 公式: (當前點的索引 + 當前段進度) / (總點數 - 1) * 100
      progressPercentage = (currentIndex + clampedSegmentProgress) / (routes.length - 1) * 100;
    } else {
      // 如果兩點距離為0，計算基於當前索引的百分比
      progressPercentage = currentIndex / (routes.length - 1) * 100;
    }
  } else {
    // 如果已經到達最後一個點，進度為100%
    progressPercentage = 100;
  }

  return {
    current,
    next,
    currentDistance,
    nextDistance,
    progressPercentage
  };
}

export default calculateProgress;