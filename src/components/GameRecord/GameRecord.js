import React, { forwardRef } from "react";
import { coordinate } from "../../config";
import Piece from "../Piece";
import './GameRecord.scss';

// 遊戲紀錄軸 可移入呈現 與 點擊跳轉 紀錄的盤面
// eslint-disable-next-line react/display-name
const GameRecord = forwardRef(({ list, onRecordHover, onRecordClick }, ref) => (
  <div className="game-record" ref={ref}>
    {list.map(item => {
      const {player, index, round} = item
      const {row , col } = coordinate(index)
      return (
        <div 
          className="game-record-item" 
          key={`game-record-${index}`}
          role="button"
          onMouseOver={() => onRecordHover(round)}
          onMouseOut={() => onRecordHover(null)}
          onClick={() => onRecordClick(round)}
        >
          <div className="round">
            {round + 1}
          </div>
          <div className="info">
            <Piece className="piece" value={player} />
            {`${String.fromCharCode(col + 65)},${row + 1}`}
          </div>
        </div>
      )
    })}
  </div>
))

export default GameRecord;
