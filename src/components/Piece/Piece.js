import React from "react";
import classNames from "classnames";
import './Piece.scss';

// 棋子
const Piece = ({ className, isBlur, isActive, value }) => (
  <div 
    className={classNames(
      "piece",
      {
       "none": !value,
       "black": value === 1, 
       "white": value === 2,
       "blur": isBlur,
       "active": isActive
      }, 
      className
    )} 
  />
)

export default Piece;
