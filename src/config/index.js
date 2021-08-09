
// 棋盤線數
export const BOARD_SIZE = 9
// 連珠勝利條件
export const WIN_SIZE = 5
// 計算勝負用陣列
export const NEIGHBOR_LIST = Array(WIN_SIZE-1).fill(null).map((_,i) => i + 1)

// 一維座標 轉 二維
export const coordinate = index => ({
    row: Math.floor(index/BOARD_SIZE),
    col: index%BOARD_SIZE
  })