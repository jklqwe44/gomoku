const express = require('express')
const app = express()
const port = 8080
const cors = require("cors");

app.use(cors());
app.use(
  express.urlencoded({
    extended: true
  })
)
app.use(express.json())

app.get('/', (req, res) => {
    res.send('GOMOKU test');
});

app.post('/calculateSituation', (req, res) => {
    let { playerSquares } = req.body;
    let result = calculateSituation(playerSquares);
    res.send(result);
    res.end();
})

app.post('/getStep', (req, res) => {
    let { playerSquares, player } = req.body;
    let { stepIndex, stepScore } = minMaxTree(playerSquares, player, 1)
    console.warn('', stepIndex, stepScore);
    res.send({ stepIndex, stepScore });
    res.end();
})

const server = app.listen(port, () => {
    const host = server.address().address;
    const port = server.address().port;

    console.log(`Example app listening at http://${host}:${port}`);
});

// 分數權重
const SCORE_WEIGHT = [0, 1, 10, 100, 1000, 100000];
// 棋盤線數
const BOARD_SIZE = 9
// 連珠勝利條件
const WIN_SIZE = 5
// 計算勝負用陣列
const NEIGHBOR_LIST = Array(WIN_SIZE).fill(null).map((_,i) => i)
// 深度
const DEPTH = 3

// 一維座標 轉 二維
const coordinate = index => ({
    row: Math.floor(index/BOARD_SIZE),
    col: index%BOARD_SIZE
  })

const calculateLineScore = (playerScores, playerTotalScores, playerWinner) => {
    if(playerScores[1] > 0 && playerScores[2] === 0) {
        if(playerScores[1] >= 5) {
            playerWinner[1]++;
        }
        playerTotalScores[1] += SCORE_WEIGHT[playerScores[1]];
    } else if(playerScores[2] > 0 && playerScores[1] === 0) {
        if(playerScores[2] >= 5) {
            playerWinner[2]++;
        }
        playerTotalScores[2] += SCORE_WEIGHT[playerScores[2]];
    } 
}

// 計算勝負
const calculateSituation = playerSquares => {
    let playerWinner = [0, 0, 0];
    let playerTotalScores = [0, 0, 0];
    playerSquares.forEach((_,index,array) => {
        const { row , col } = coordinate(index);

        //右方
        if(col <= (BOARD_SIZE - WIN_SIZE)) {
            let playerScores = [0, 0, 0];
            NEIGHBOR_LIST.forEach(i => {
                const player = array[index+i];
                playerScores[player || 0]++;
            });
            calculateLineScore(playerScores, playerTotalScores, playerWinner);
        }
        
        //下方
        if(row <= (BOARD_SIZE - WIN_SIZE)) {
            let playerScores = [0, 0, 0];
            NEIGHBOR_LIST.forEach(i => {
                const player = array[index+BOARD_SIZE*i]
                playerScores[player || 0]++;
            })
            calculateLineScore(playerScores, playerTotalScores, playerWinner);
        }
        
        //右下
        if(col <= (BOARD_SIZE - WIN_SIZE) && row <= (BOARD_SIZE - WIN_SIZE)) {
            let playerScores = [0, 0, 0];
            NEIGHBOR_LIST.forEach(i => {
                const player = array[index+i+BOARD_SIZE*i]
                playerScores[player || 0]++;
            })
            calculateLineScore(playerScores, playerTotalScores, playerWinner);
        }

        //左下
        if(col >= WIN_SIZE - 1  && row <= (BOARD_SIZE - WIN_SIZE)) {
            let playerScores = [0, 0, 0];
            NEIGHBOR_LIST.forEach(i => {
                const player = array[index-i+BOARD_SIZE*i]
                playerScores[player || 0]++;
            })
            calculateLineScore(playerScores, playerTotalScores, playerWinner);
        }
    })

    let winner = 0;
    if(playerWinner[1] > 0 && playerWinner[2] > 0) {
        winner = -1; // 兩邊都有五子 不合理
    }
    if(playerWinner[1] > 0 && playerWinner[2] === 0) {
        winner = 1; // 黑有五子
    }
    if(playerWinner[2] > 0 && playerWinner[1] === 0) {
        winner = 2; // 白有五子
    }
    return { scores: playerTotalScores, winner };
}

const isRemote = (array, index) => {
    const { row , col } = coordinate(index);
    // 右
    if(col <= BOARD_SIZE - 1 && array[index+1]) {
        return false;
    }
    // 左
    if(col >= 1 && array[index-1]) {
        return false;
    }
    // 下
    if(row <= BOARD_SIZE - 1 && array[index+BOARD_SIZE]) {
        return false;
    }
    // 上
    if(row >= 1 && array[index-BOARD_SIZE]) {
        return false;
    }
    //右下
    if(col <= BOARD_SIZE - 1 && row <= BOARD_SIZE - 1 && array[index + 1 + BOARD_SIZE]) {
        return false;
    }
    //右上
    if(col <= BOARD_SIZE - 1 && row >= 1 &&  array[index + 1 - BOARD_SIZE]) {
        return false;
    }
    //左下
    if(col >= 1 && row <= BOARD_SIZE - 1 && array[index - 1 + BOARD_SIZE]) {
        return false;
    }
    //左上
    if(col >= 1 && row >= 1 && array[index - 1 - BOARD_SIZE]) {
        return false;
    }
    return true;
}

const minMaxTree = (playerSquares, player, depth) => {
    let stepIndex = -1;
    let stepScore = 0;
    let stepSquares = [];
    let stepWinner = 0;
    playerSquares.forEach((_,index,array) => {
        let stepArray = [...array];
        if(!stepArray[index] && !isRemote(stepArray, index)) {
            stepArray[index] = player;
            let { scores, winner } = calculateSituation(stepArray);
            let newScore = 0
            if(depth <= DEPTH && winner === 0) {
               let subResult = minMaxTree(stepArray, 3-player, depth+1);
               subScore = subResult.stepScore;
               newScore = -subScore;
            } else {
                newScore = scores[player] - scores[3-player];
            }
            if(newScore > stepScore || stepIndex === -1) {
                stepScore = newScore;
                stepIndex = index;
                stepSquares = stepArray;
                stepWinner = winner;
            }
        }
    });
    return { stepScore, stepIndex, stepSquares, stepWinner };
}