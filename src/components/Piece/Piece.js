import React from "react";
import classNames from "classnames";
import './Piece.scss';

// 棋子
const Piece = ({ className, isBlur, value }) => (
  <div 
    className={classNames(
      "piece",
      {
       "none": !value,
       "black": value === 1, 
       "white": value === 2,
       "blur": isBlur
      }, 
      className
    )} 
  />
)

export default Piece;
