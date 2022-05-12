import React from "react";
import classNames from "classnames";
import Piece from "../../components/Piece";
import Popup from './Popup';
import './ChooseColorPopup.scss';

const ChooseColorPopup = ({ handleChooseColor }) => {
  return (
    <Popup>
      <div className="button-group">
        <div
          className="button"
          onClick={() => handleChooseColor(1)}
        >
          <Piece className="piece" value={1} />Black
        </div>
        <div
          className="button"
          onClick={() => handleChooseColor(2)}
        >
          <Piece className="piece" value={2} />White
        </div>
      </div>
    </Popup>
  )
}

export default ChooseColorPopup;
