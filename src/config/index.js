
// 棋盤線數
export const BOARD_SIZE = 9

// 一維座標 轉 二維
export const coordinate = index => ({
    row: Math.floor(index/BOARD_SIZE),
    col: index%BOARD_SIZE
  })