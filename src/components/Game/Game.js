import React from "react";
import classNames from "classnames";
import Axios from "axios";
import { BOARD_SIZE } from "../../config";
import Board from "../../components/Board";
import Piece from "../../components/Piece";
import GameRecord from "../../components/GameRecord";
import './Game.scss';

// 遊戲狀態
const GameInfo = ({ round, player, isWin }) => (
  <div className="game-info">
    <Piece className="piece" value={player} />
    <div className="text">
      {isWin ? 'Win' : `Round ${round + 1}`}
    </div>
  </div>
)

const Game = () => {
  const [gameInfo, setGameInfo] = React.useState({ player: 1, round: 0, isWin: false});
  const [gameRecord, setGameRecord] = React.useState([]);
  const gameRecordRef = React.useRef(null); 
  const [squares, setSquares] = React.useState(
    Array(BOARD_SIZE*BOARD_SIZE).fill({ player: null, round: null, isBlur: false})
  );

  // 遊戲紀錄scroll保持在最末
  React.useEffect(()=> {
    if(gameRecordRef.current) {
      gameRecordRef.current.scrollLeft = gameRecordRef.current.scrollWidth;
    }
  }, [gameRecord.length])

  // 更新盤面狀態 執棋者 回合數 輸贏
  const updateGameInfo = (nowRound, newSquares) => {
      Axios.post(
        `http://${location.hostname}:3000/calculateWinner`,
        {
          squares: newSquares
        })
      .then(function (response) {
        const { winner } = response.data

        if(winner) {
          setGameInfo({player: winner, round: nowRound, isWin: true})
        } else {
          const newRound = nowRound + 1
          setGameInfo({ player: newRound % 2 + 1, round: newRound, isWin: false})
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  // 點擊棋盤空位 下棋
  const handleSquareClick = index => {
    const { round, isWin } = gameInfo
    const { player } = squares[index]
    if(!player && !isWin) {
      const newPlayer = round % 2 + 1
    
      const newSquares = [...squares]
      newSquares[index] = { player: newPlayer, round }
      setSquares(newSquares)
    
      const newGameRecord = [...gameRecord].concat({player: newPlayer, round, index})
      setGameRecord(newGameRecord)

      updateGameInfo(round, newSquares)
    }
  }

  // 預看紀錄 呈現記錄點盤面
  const handleRecordHover = round => {
    const newSquares = [...squares]
    setSquares(newSquares.map(item => {
      const { round: itemRound  } = item
      return {
        ...item,
        isBlur: round !== null && itemRound > round
      }
    }))
  }

  // 點選紀錄 盤面退回記錄點
  const handleRecordClick = round => {
    const newSquares = [...squares].map(item => {
      const { round: itemRound  } = item
      if(itemRound <= round) {
        return item
      }
      return { player: null, round: null, isBlur: false}
    })
    setSquares(newSquares)

    const newGameRecord = [...gameRecord].filter(
      ({ round: itemRound }) => itemRound <= round
    )
    setGameRecord(newGameRecord)

    updateGameInfo(round, newSquares)
  }

  const { player, isWin } = gameInfo

  return (
    <div className={classNames(
      "game",
      {"black-round": !isWin && player === 1,
        "white-round": !isWin && player === 2 }
      )} 
      >
      <GameInfo {...gameInfo} />
      <Board
        squares={squares}
        onSquareClick={handleSquareClick}
      />
      <GameRecord 
        ref={gameRecordRef} 
        list={gameRecord}
        onRecordHover={handleRecordHover}
        onRecordClick={handleRecordClick}
      />
    </div>
  );
}

export default Game;
