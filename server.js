const express = require('express')
const app = express()
const port = 3000
const cors = require("cors");

app.use(cors());
app.use(
  express.urlencoded({
    extended: true
  })
)
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/calculateWinner', (req, res) => {
    let winner = calculateWinner(req.body.squares);
    res.send({ winner });
    res.end();
})

app.post('/bye', (req, res) => {
    
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

// 棋盤線數
const BOARD_SIZE = 9
// 連珠勝利條件
const WIN_SIZE = 5
// 計算勝負用陣列
const NEIGHBOR_LIST = Array(WIN_SIZE-1).fill(null).map((_,i) => i + 1)

// 一維座標 轉 二維
const coordinate = index => ({
    row: Math.floor(index/BOARD_SIZE),
    col: index%BOARD_SIZE
  })

// 計算勝負
const calculateWinner = squares => {
    let winner = null
    squares.some((item,index,array) => {
    const { player } = item
    //格子不為空
    if(player) { 
        const {row , col } = coordinate(index)
        //右方
        let hasRight = col <= (BOARD_SIZE - WIN_SIZE) &&
        NEIGHBOR_LIST.every(i => {
            const { player: neighbor } = array[index+i]
            return neighbor === player
        })
        
        //下方
        let hasDown = row <= (BOARD_SIZE - WIN_SIZE) &&
        NEIGHBOR_LIST.every(i => {
            const { player: neighbor } = array[index+BOARD_SIZE*i]
            return neighbor === player
        })
        
        //右下
        let hasRightDown = col <= (BOARD_SIZE - WIN_SIZE) && 
        row <= (BOARD_SIZE - WIN_SIZE) &&
        NEIGHBOR_LIST.every(i => {
            const { player: neighbor } = array[index+i+BOARD_SIZE*i]
            return neighbor === player
        })

        //左下
        let hasLeftDown = col >= WIN_SIZE - 1  &&
        row <= (BOARD_SIZE - WIN_SIZE) &&
        NEIGHBOR_LIST.every(i => {
            const { player: neighbor } = array[index-i+BOARD_SIZE*i]
            return neighbor === player
        })

        if(hasRight || hasDown || hasRightDown || hasLeftDown) {
        winner=player
        return true
        }
    }
    })
    return winner;
}