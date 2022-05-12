import React from "react";
import classNames from "classnames";
import Piece from "../../components/Piece";
import Popup from './Popup';
import './WinnerPopup.scss';

const WinnerPopup = ({ winner, onRestart, onClose }) => {
  return (
    <Popup className="winner-popup">
      <div className="result">
        <Piece className="piece" value={winner} />
        {winner === 1 ? 'Black Win!': 'White Win!'}
      </div>
      <div className="button-group">
        <div
          className="button"
          onClick={onRestart}
        >
          Restart
        </div>
        <div
          className="button"
          onClick={onClose}
        >
          Continue
        </div>
      </div>
    </Popup>
  )
}

export default WinnerPopup;
