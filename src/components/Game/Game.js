import React, { useState, useRef } from "react";
import classNames from "classnames";
import Axios from "axios";
import { BOARD_SIZE } from "../../config";
import Board from "../../components/Board";
import Piece from "../../components/Piece";
import GameRecord from "../../components/GameRecord";
import ChooseColorPopup from "../../components/Popup/ChooseColorPopup";
import WinnerPopup from "../../components/Popup/WinnerPopup";
import './Game.scss';

const API_URL = 'https://jklqwe44.de.r.appspot.com'; // 'http://localhost:3000'

// 遊戲狀態
const GameInfo = ({ round, player, isWin }) => (
  <div className="game-info">
    <Piece className="piece" value={player} />
    <div className="text">
      {isWin ? 'Win' : `Round ${round + 1}`}
    </div>
  </div>
)

// 一維座標 轉 二維
const coordinate = index => ({
  row: Math.floor(index/BOARD_SIZE),
  col: index%BOARD_SIZE
})

const Game = () => {
  const [gameInfo, setGameInfo] = useState({ player: 1, round: 0, lastIndex: -1, isWin: false});
  const [playerColor, setPlayerColor] = useState(-1);
  const [gameRecord, setGameRecord] = useState([]);
  const gameRecordRef = useRef(null); 
  const [isLoading, setIsLoading] = useState(false);
  const [isCloseWinner, setIsCloseWinner] = useState(false);
  const [squares, setSquares] = useState(
    Array(BOARD_SIZE*BOARD_SIZE).fill({ player: null, round: null, isBlur: false})
  );

  // 遊戲紀錄scroll保持在最末
  React.useEffect(()=> {
    if(gameRecordRef.current) {
      gameRecordRef.current.scrollLeft = gameRecordRef.current.scrollWidth;
    }
  }, [gameRecord.length])

  React.useEffect(()=> {
    if(playerColor > 0 && gameInfo.player !== playerColor){
      newStep(gameInfo.player, squares);
    }
  }, [gameInfo.round, playerColor])

  // React.useEffect(()=> {
  //   if(gameInfo.player === 1 && gameInfo.round > 1){
  //     newStep(gameInfo.player, squares);
  //   }
  // }, [gameInfo.round])

  const handleChooseColor = color => {
    setPlayerColor(color);
  }

  // 關閉 勝利彈窗
  const handleCloseWinner = () => {
    setIsCloseWinner(true);
  }

  const handleRestart = () => {
    setIsCloseWinner(false);
    setPlayerColor(-1);
    setGameInfo({ player: 1, round: 0, lastIndex: -1, isWin: false});
    setGameRecord([]);
    setSquares(Array(BOARD_SIZE*BOARD_SIZE).fill({ player: null, round: null, isBlur: false}))
  }

  // 更新盤面狀態 執棋者 回合數 輸贏
  const updateGameInfo = (nowRound, newSquares, lastIndex) => {
    let playerSquares = newSquares.map(item => item.player);
      Axios.post(
        `${API_URL}/gomoku/calculateSituation`,
        {
          playerSquares
        })
      .then(function (response) {
        const { winner } = response.data

        if(winner > 0) {
          setGameInfo({player: winner, round: nowRound, lastIndex, isWin: true})
        } else {
          const newRound = nowRound + 1
          setGameInfo({ player: newRound % 2 + 1, round: newRound, lastIndex, isWin: false})
          
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  const newStep = (player, newSquares) => {
    let playerSquares = newSquares.map(item => item.player);
    setIsLoading(true);
    Axios.post(
      `${API_URL}/gomoku/alphaBetaCut`,
      {
        player,
        playerSquares,
        depth: 3
      })
    .then(function (response) {
      setIsLoading(false);
      let { stepIndex, stepScore, totalCalculate } = response.data;
      let { row, col } = coordinate(stepIndex)
      handleSquareClick(stepIndex)
      console.info(
        'step (' + String.fromCharCode(col + 65) + ',' + (row + 1) + ')',
        'score ', stepScore , ' cal ', String(totalCalculate).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
    })
    .catch(function (error) {
      setIsLoading(false);
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

      updateGameInfo(round, newSquares, index)
    }

    setIsCloseWinner(false);
  }

  // 預看紀錄 呈現記錄點盤面
  const handleRecordHover = round => {
    const newSquares = [...squares]
    setSquares(newSquares.map(item => {
      const { round: itemRound  } = item
      return {
        ...item,
        isBlur: round !== null && itemRound > round,
        isActive: round !== null && itemRound === round,
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

    let lastIndex = -1

    const newGameRecord = [...gameRecord].filter(
      ({ round: itemRound, index: itemIndex }) => {
        if(itemRound === round) {
          lastIndex = itemIndex
        }
        return itemRound <= round
      }
    )
    setGameRecord(newGameRecord)
    updateGameInfo(round, newSquares, lastIndex)
  }

  const { player, isWin, lastIndex } = gameInfo

  return (
    <div className={classNames(
      "game",
      {"black-round": !isWin && player === 1,
        "white-round": !isWin && player === 2 }
      )} 
      >
      {isLoading && <div className="loading" >Loading...</div>}
      <GameInfo {...gameInfo} />
      <Board
        squares={squares}
        lastIndex={lastIndex}
        onSquareClick={handleSquareClick}
      />
      <GameRecord 
        ref={gameRecordRef} 
        list={gameRecord}
        onRecordHover={handleRecordHover}
        onRecordClick={handleRecordClick}
      />
      {playerColor === -1 && <ChooseColorPopup handleChooseColor={handleChooseColor}/>}
      {isWin && !isCloseWinner && <WinnerPopup winner={player} onClose={handleCloseWinner} onRestart={handleRestart}/>}
    </div>
  );
}

export default Game;
