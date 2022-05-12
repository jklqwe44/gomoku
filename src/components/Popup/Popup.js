import React from "react";
import classNames from "classnames";
import './Popup.scss';

const Popup = ({ className, children }) => (
  <div className={classNames("popup",className)}>
    <div className="content">
      {children}
    </div>
  </div>
)

export default Popup;
