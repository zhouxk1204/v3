export type Face = "smile" | "surprise" | "failed" | "success";

export interface Cell {
  row: number;
  col: number;
  status: string; // 显示用 "covered" | "flag" | "mine-hit" | "question" | "opened" | "mines-0"
  isMine: boolean; // 是否是地雷
  around: number; //  -1:默认值; 0: 安全区; 1～8 周围雷数
  isActive: boolean; // true:
}

// 点击时
// 1.如果是地雷，即踩中地雷，显示所有地雷的位置
// 2.如果不是地雷，显示周围地雷数目
