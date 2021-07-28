import React from "react";
import ReactDOM from "react-dom";
import Main from "./components/Main";

const wrapper = document.getElementById("root");
wrapper ? ReactDOM.render(<Main />, wrapper) : false;