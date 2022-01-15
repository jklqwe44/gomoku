import React from "react";
import classNames from "classnames";
import { BOARD_SIZE } from "../../config";
import Piece from "../../components/Piece";
import './Board.scss';

// 下棋格 與 底線、座標 
const Square = ({ children, row, col, onClick }) => (
  <div 
    className={classNames(
      "square",
      {'has-backline': row < BOARD_SIZE-1 && col < BOARD_SIZE-1 }
    )} 
    role="button"
    onClick={onClick}
  >
    {children}
    {row === 0 && <div className='coordinate col'>{String.fromCharCode(col + 65)}</div>}
    {col === 0 && <div className='coordinate row'>{row + 1}</div>}
  </div>
)

// 棋盤
const Board = ({ squares, lastIndex, onSquareClick }) => (
  <div className="board-width-container">
    <div className="board-container">
      <div className="board">
        {Array(BOARD_SIZE).fill(null).map((_, i) => 
          <div key={`row-${i}`} className="row">
            {Array(BOARD_SIZE).fill(null).map((_, j) => 
              {
                const index = i*BOARD_SIZE + j
                const { player, isBlur, isActive } = squares[index]
                return (
                  <Square
                    key={`square-${index}`}
                    row={i}
                    col={j}
                    onClick={() => onSquareClick(index)}
                  >
                    <Piece 
                      isBlur={isBlur} 
                      value={player} 
                      isActive={lastIndex===index || isActive}
                    />
                  </Square>
                )
              }
            )}
          </div>
        )}
      </div>
    </div>
  </div>
)

export default Board;
