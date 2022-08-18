/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/popup/popup.scss":
/*!***********************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/popup/popup.scss ***!
  \***********************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vscode_codicons_dist_codicon_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!../../node_modules/@vscode/codicons/dist/codicon.css */ "./node_modules/css-loader/dist/cjs.js!./node_modules/@vscode/codicons/dist/codicon.css");
// Imports



var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_node_modules_vscode_codicons_dist_codicon_css__WEBPACK_IMPORTED_MODULE_2__["default"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "/*\n    This file is part of d-comments.\n\n    d-comments is free software: you can redistribute it and/or modify\n    it under the terms of the GNU General Public License as published by\n    the Free Software Foundation, either version 3 of the License, or\n    (at your option) any later version.\n\n    d-comments is distributed in the hope that it will be useful,\n    but WITHOUT ANY WARRANTY; without even the implied warranty of\n    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\n    GNU General Public License for more details.\n\n    You should have received a copy of the GNU General Public License\n    along with d-comments.  If not, see <https://www.gnu.org/licenses/>.\n*/\n:root {\n  box-sizing: border-box;\n  user-select: none;\n  -webkit-font-smoothing: subpixel-antialiased;\n  text-rendering: optimizeLegibility;\n  word-break: break-word;\n  word-wrap: break-word;\n}\n@media only screen and (-webkit-min-device-pixel-ratio: 2), (min-resolution: 2dppx) {\n  :root {\n    -webkit-font-smoothing: antialiased;\n  }\n}\n:root :any-link {\n  text-decoration: none;\n  color: rgb(6, 7, 133);\n}\n\n/*\n    This file is part of d-comments.\n\n    d-comments is free software: you can redistribute it and/or modify\n    it under the terms of the GNU General Public License as published by\n    the Free Software Foundation, either version 3 of the License, or\n    (at your option) any later version.\n\n    d-comments is distributed in the hope that it will be useful,\n    but WITHOUT ANY WARRANTY; without even the implied warranty of\n    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\n    GNU General Public License for more details.\n\n    You should have received a copy of the GNU General Public License\n    along with d-comments.  If not, see <https://www.gnu.org/licenses/>.\n*/\n#root {\n  width: 400px;\n  height: 580px;\n  max-width: 480px;\n  max-height: 580px;\n  min-width: 400px;\n  min-height: 580px;\n}\n#root::-webkit-scrollbar {\n  display: none;\n}\n#root .btn {\n  margin: 0px;\n  overflow: hidden;\n  border-radius: 7px;\n  background-color: rgb(236, 236, 236);\n  display: inline-block;\n  color: black;\n  cursor: pointer;\n}\n#root .btn:hover {\n  animation: swing 1s ease;\n  animation-iteration-count: 1;\n}\n@keyframes swing {\n  15% {\n    transform: translateX(5px);\n  }\n  30% {\n    transform: translateX(-5px);\n  }\n  50% {\n    transform: translateX(3px);\n  }\n  80% {\n    transform: translateX(2px);\n  }\n  90% {\n    transform: translateX(1px);\n  }\n  100% {\n    transform: translateX(0px);\n  }\n}\n#root .btn-option {\n  margin: 0px;\n  overflow: hidden;\n  padding: 6px 8px;\n  border-radius: 100%;\n  background-color: rgb(236, 236, 236);\n  color: black;\n  position: absolute;\n  top: 10px;\n  right: 15px;\n  display: inline-block;\n  cursor: pointer;\n}\n#root .btn-option span {\n  position: relative;\n  transition: color 0.6s cubic-bezier(0.53, 0.21, 0, 1);\n}\n#root .btn-option span i {\n  font-size: 25px;\n}\n#root .btn-option:before {\n  content: \"\";\n  display: block;\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: hsl(0deg, 0%, 49%);\n  transform: scaleX(0);\n  transform-origin: 100% 100%;\n  transition: transform 0.6s cubic-bezier(0.53, 0.21, 0, 1);\n}\n#root .btn-option:hover:before {\n  transform-origin: 0 0;\n  transform: scaleX(1);\n}\n#root .btn-option:hover span {\n  color: white;\n}\n#root input {\n  width: 240px;\n  height: 32px;\n  border: none;\n  border-radius: 8px;\n  padding: 8px;\n  margin: 0px;\n  font-size: 20px;\n  font-weight: bolder;\n  background-color: rgb(236, 236, 236);\n}\n#root input:focus {\n  outline: none;\n}\n#root label {\n  font-size: large;\n  font-weight: bold;\n  display: flex;\n  flex-direction: column;\n  padding: 0 24px;\n}\n#root label div {\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  align-items: center;\n}\n#root label div .btn-draw {\n  padding: 10px 20px;\n}\n#root label div .btn-search {\n  padding: 10px 25px;\n}\n#root label div .btn-search i {\n  font-size: 24px;\n  font-weight: bold;\n}\n#root .result {\n  list-style: none;\n  padding: 0;\n  border: 2px solid rgb(187, 187, 187);\n  overflow-x: hidden;\n  overflow-y: scroll;\n  height: 350px;\n  font-weight: bolder;\n}\n#root .result :not(:last-child) li {\n  border-bottom: 5px solid rgb(181, 181, 181);\n}\n#root .result li {\n  background-color: rgb(248, 248, 248);\n}\n#root .result li:not(:last-child) {\n  border-bottom: 5px solid rgb(181, 181, 181);\n}\n#root .result li .title {\n  height: 24px;\n  text-align: center;\n  overflow: hidden;\n}\n#root .result li .title span {\n  font-size: 14px;\n  font-weight: bold;\n  margin: 0px;\n  padding: 8px 0px 0px 100%;\n  display: inline-block;\n  white-space: nowrap;\n  line-height: 1em;\n  animation: scroll 15s linear infinite;\n}\n@keyframes scroll {\n  0% {\n    transform: translateX(0);\n  }\n  100% {\n    transform: translateX(-100%);\n  }\n}\n#root .result li .wrapper {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  padding: 10px;\n}\n#root .result li .wrapper img {\n  width: 130px;\n}\n#root .result li .wrapper .info {\n  margin-left: 20px;\n  font-size: 16px;\n  display: flex;\n  flex-direction: column;\n}\n#root .result li .wrapper .info .owner {\n  display: flex;\n  white-space: nowrap;\n  margin-bottom: 5px;\n}\n#root .result li .wrapper .info .owner img {\n  width: 32px;\n  height: 32px;\n  margin-right: 5px;\n}\n#root .result li .wrapper .info p {\n  margin: auto;\n}\n#root .error {\n  display: flex;\n  flex-direction: row;\n}\n#root .error span {\n  display: inline-block;\n  text-align: center;\n}\n#root .error span i {\n  padding: 16px 0;\n  font-size: 48px;\n  color: rgb(51, 51, 51);\n  overflow: hidden;\n}\n#root .error a {\n  margin: auto 1em;\n  font-size: 16px;\n}", "",{"version":3,"sources":["webpack://./src/global.scss","webpack://./src/popup/popup.scss"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;;CAAA;AAmBA;EACE,sBAAA;EACA,iBAAA;EACA,4CAAA;EACA,kCAAA;EAOA,sBAAA;EACA,qBAAA;ACPF;ADCE;EANF;IAQI,mCAAA;ECCF;AACF;ADIE;EACE,qBAAA;EACA,qBAAA;ACFJ;;AAjCA;;;;;;;;;;;;;;;CAAA;AAmBA;EACE,YAAA;EACA,aAAA;EACA,gBAAA;EACA,iBAAA;EACA,gBAAA;EACA,iBAAA;AAiCF;AA/BE;EACE,aAAA;AAiCJ;AA9BE;EACE,WAAA;EACA,gBAAA;EACA,kBAAA;EACA,oCAAA;EACA,qBAAA;EACA,YAAA;EACA,eAAA;AAgCJ;AA9BI;EACE,wBAAA;EACA,4BAAA;AAgCN;AA7BI;EACE;IACE,0BAAA;EA+BN;EA5BI;IACE,2BAAA;EA8BN;EA3BI;IACE,0BAAA;EA6BN;EA1BI;IACE,0BAAA;EA4BN;EAzBI;IACE,0BAAA;EA2BN;EAxBI;IACE,0BAAA;EA0BN;AACF;AAtBE;EACE,WAAA;EACA,gBAAA;EACA,gBAAA;EACA,mBAAA;EACA,oCAAA;EACA,YAAA;EACA,kBAAA;EACA,SAAA;EACA,WAAA;EACA,qBAAA;EACA,eAAA;AAwBJ;AAtBI;EACE,kBAAA;EACA,qDAAA;AAwBN;AAtBM;EACE,eAAA;AAwBR;AApBI;EACE,WAAA;EACA,cAAA;EACA,kBAAA;EACA,MAAA;EACA,OAAA;EACA,WAAA;EACA,YAAA;EACA,8BAAA;EACA,oBAAA;EACA,2BAAA;EACA,yDAAA;AAsBN;AAlBM;EACE,qBAAA;EACA,oBAAA;AAoBR;AAjBM;EACE,YAAA;AAmBR;AAdE;EACE,YAAA;EACA,YAAA;EACA,YAAA;EACA,kBAAA;EACA,YAAA;EACA,WAAA;EACA,eAAA;EACA,mBAAA;EACA,oCAAA;AAgBJ;AAdI;EACE,aAAA;AAgBN;AAZE;EACE,gBAAA;EACA,iBAAA;EACA,aAAA;EACA,sBAAA;EACA,eAAA;AAcJ;AAZI;EACE,aAAA;EACA,mBAAA;EACA,8BAAA;EACA,mBAAA;AAcN;AAZM;EACE,kBAAA;AAcR;AAXM;EACE,kBAAA;AAaR;AAXQ;EACE,eAAA;EACA,iBAAA;AAaV;AAPE;EACE,gBAAA;EACA,UAAA;EACA,oCAAA;EACA,kBAAA;EACA,kBAAA;EACA,aAAA;EACA,mBAAA;AASJ;AANM;EACE,2CAAA;AAQR;AAJI;EACE,oCAAA;AAMN;AAJM;EACE,2CAAA;AAMR;AAHM;EACE,YAAA;EACA,kBAAA;EACA,gBAAA;AAKR;AAHQ;EACE,eAAA;EACA,iBAAA;EACA,WAAA;EACA,yBAAA;EACA,qBAAA;EACA,mBAAA;EACA,gBAAA;EACA,qCAAA;AAKV;AAHU;EACE;IACE,wBAAA;EAKZ;EAFU;IACE,4BAAA;EAIZ;AACF;AACM;EACE,aAAA;EACA,mBAAA;EACA,mBAAA;EACA,aAAA;AACR;AACQ;EACE,YAAA;AACV;AAEQ;EACE,iBAAA;EAkBA,eAAA;EACA,aAAA;EACA,sBAAA;AAjBV;AADU;EACE,aAAA;EACA,mBAAA;EACA,kBAAA;AAGZ;AADY;EACE,WAAA;EACA,YAAA;EACA,iBAAA;AAGd;AACU;EACE,YAAA;AACZ;AAUE;EACE,aAAA;EACA,mBAAA;AARJ;AAUI;EACE,qBAAA;EACA,kBAAA;AARN;AAUM;EACE,eAAA;EACA,eAAA;EACA,sBAAA;EACA,gBAAA;AARR;AAYI;EACE,gBAAA;EACA,eAAA;AAVN","sourcesContent":["/*\r\n    This file is part of d-comments.\r\n\r\n    d-comments is free software: you can redistribute it and/or modify\r\n    it under the terms of the GNU General Public License as published by\r\n    the Free Software Foundation, either version 3 of the License, or\r\n    (at your option) any later version.\r\n\r\n    d-comments is distributed in the hope that it will be useful,\r\n    but WITHOUT ANY WARRANTY; without even the implied warranty of\r\n    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\r\n    GNU General Public License for more details.\r\n\r\n    You should have received a copy of the GNU General Public License\r\n    along with d-comments.  If not, see <https://www.gnu.org/licenses/>.\r\n*/\r\n\r\n@import \"~@vscode/codicons/dist/codicon.css\";\r\n\r\n:root {\r\n  box-sizing: border-box;\r\n  user-select: none;\r\n  -webkit-font-smoothing: subpixel-antialiased;\r\n  text-rendering: optimizeLegibility;\r\n\r\n  @media only screen and (-webkit-min-device-pixel-ratio: 2),\r\n    (min-resolution: 2dppx) {\r\n    -webkit-font-smoothing: antialiased;\r\n  }\r\n\r\n  word-break: break-word;\r\n  word-wrap: break-word;\r\n\r\n  :any-link {\r\n    text-decoration: none;\r\n    color: rgb(6, 7, 133);\r\n  }\r\n}\r\n","/*\r\n    This file is part of d-comments.\r\n\r\n    d-comments is free software: you can redistribute it and/or modify\r\n    it under the terms of the GNU General Public License as published by\r\n    the Free Software Foundation, either version 3 of the License, or\r\n    (at your option) any later version.\r\n\r\n    d-comments is distributed in the hope that it will be useful,\r\n    but WITHOUT ANY WARRANTY; without even the implied warranty of\r\n    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\r\n    GNU General Public License for more details.\r\n\r\n    You should have received a copy of the GNU General Public License\r\n    along with d-comments.  If not, see <https://www.gnu.org/licenses/>.\r\n*/\r\n\r\n@use \"../global.scss\";\r\n\r\n#root {\r\n  width: 400px;\r\n  height: 580px;\r\n  max-width: 480px;\r\n  max-height: 580px;\r\n  min-width: 400px;\r\n  min-height: 580px;\r\n\r\n  &::-webkit-scrollbar {\r\n    display: none;\r\n  }\r\n\r\n  .btn {\r\n    margin: 0px;\r\n    overflow: hidden;\r\n    border-radius: 7px;\r\n    background-color: rgb(236 236 236);\r\n    display: inline-block;\r\n    color: black;\r\n    cursor: pointer;\r\n\r\n    &:hover {\r\n      animation: swing 1s ease;\r\n      animation-iteration-count: 1;\r\n    }\r\n\r\n    @keyframes swing {\r\n      15% {\r\n        transform: translateX(5px);\r\n      }\r\n\r\n      30% {\r\n        transform: translateX(-5px);\r\n      }\r\n\r\n      50% {\r\n        transform: translateX(3px);\r\n      }\r\n\r\n      80% {\r\n        transform: translateX(2px);\r\n      }\r\n\r\n      90% {\r\n        transform: translateX(1px);\r\n      }\r\n\r\n      100% {\r\n        transform: translateX(0px);\r\n      }\r\n    }\r\n  }\r\n\r\n  .btn-option {\r\n    margin: 0px;\r\n    overflow: hidden;\r\n    padding: 6px 8px;\r\n    border-radius: 100%;\r\n    background-color: rgb(236 236 236);\r\n    color: black;\r\n    position: absolute;\r\n    top: 10px;\r\n    right: 15px;\r\n    display: inline-block;\r\n    cursor: pointer;\r\n\r\n    span {\r\n      position: relative;\r\n      transition: color 0.6s cubic-bezier(0.53, 0.21, 0, 1);\r\n\r\n      i {\r\n        font-size: 25px;\r\n      }\r\n    }\r\n\r\n    &:before {\r\n      content: \"\";\r\n      display: block;\r\n      position: absolute;\r\n      top: 0;\r\n      left: 0;\r\n      width: 100%;\r\n      height: 100%;\r\n      background: hsl(0, 0%, 49%);\r\n      transform: scaleX(0);\r\n      transform-origin: 100% 100%;\r\n      transition: transform 0.6s cubic-bezier(0.53, 0.21, 0, 1);\r\n    }\r\n\r\n    &:hover {\r\n      &:before {\r\n        transform-origin: 0 0;\r\n        transform: scaleX(1);\r\n      }\r\n\r\n      span {\r\n        color: white;\r\n      }\r\n    }\r\n  }\r\n\r\n  input {\r\n    width: 240px;\r\n    height: 32px;\r\n    border: none;\r\n    border-radius: 8px;\r\n    padding: 8px;\r\n    margin: 0px;\r\n    font-size: 20px;\r\n    font-weight: bolder;\r\n    background-color: rgb(236 236 236);\r\n\r\n    &:focus {\r\n      outline: none;\r\n    }\r\n  }\r\n\r\n  label {\r\n    font-size: large;\r\n    font-weight: bold;\r\n    display: flex;\r\n    flex-direction: column;\r\n    padding: 0 24px;\r\n\r\n    div {\r\n      display: flex;\r\n      flex-direction: row;\r\n      justify-content: space-between;\r\n      align-items: center;\r\n\r\n      .btn-draw {\r\n        padding: 10px 20px;\r\n      }\r\n\r\n      .btn-search {\r\n        padding: 10px 25px;\r\n\r\n        i {\r\n          font-size: 24px;\r\n          font-weight: bold;\r\n        }\r\n      }\r\n    }\r\n  }\r\n\r\n  .result {\r\n    list-style: none;\r\n    padding: 0;\r\n    border: 2px solid rgb(187 187 187);\r\n    overflow-x: hidden;\r\n    overflow-y: scroll;\r\n    height: 350px;\r\n    font-weight: bolder;\r\n\r\n    :not(:last-child) {\r\n      li {\r\n        border-bottom: 5px solid rgb(181 181 181);\r\n      }\r\n    }\r\n\r\n    li {\r\n      background-color: rgb(248 248 248);\r\n\r\n      &:not(:last-child) {\r\n        border-bottom: 5px solid rgb(181 181 181);\r\n      }\r\n\r\n      .title {\r\n        height: 24px;\r\n        text-align: center;\r\n        overflow: hidden;\r\n\r\n        span {\r\n          font-size: 14px;\r\n          font-weight: bold;\r\n          margin: 0px;\r\n          padding: 8px 0px 0px 100%;\r\n          display: inline-block;\r\n          white-space: nowrap;\r\n          line-height: 1em;\r\n          animation: scroll 15s linear infinite;\r\n\r\n          @keyframes scroll {\r\n            0% {\r\n              transform: translateX(0);\r\n            }\r\n\r\n            100% {\r\n              transform: translateX(-100%);\r\n            }\r\n          }\r\n        }\r\n      }\r\n\r\n      .wrapper {\r\n        display: flex;\r\n        flex-direction: row;\r\n        align-items: center;\r\n        padding: 10px;\r\n\r\n        img {\r\n          width: 130px;\r\n        }\r\n\r\n        .info {\r\n          margin-left: 20px;\r\n\r\n          .owner {\r\n            display: flex;\r\n            white-space: nowrap;\r\n            margin-bottom: 5px;\r\n\r\n            img {\r\n              width: 32px;\r\n              height: 32px;\r\n              margin-right: 5px;\r\n            }\r\n          }\r\n\r\n          p {\r\n            margin: auto;\r\n          }\r\n\r\n          font-size: 16px;\r\n          display: flex;\r\n          flex-direction: column;\r\n        }\r\n      }\r\n    }\r\n  }\r\n\r\n  .error {\r\n    display: flex;\r\n    flex-direction: row;\r\n\r\n    span {\r\n      display: inline-block;\r\n      text-align: center;\r\n\r\n      i {\r\n        padding: 16px 0;\r\n        font-size: 48px;\r\n        color: rgb(51 51 51);\r\n        overflow: hidden;\r\n      }\r\n    }\r\n\r\n    a {\r\n      margin: auto 1em;\r\n      font-size: 16px;\r\n    }\r\n  }\r\n}\r\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./src/popup/popup.scss":
/*!******************************!*\
  !*** ./src/popup/popup.scss ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_popup_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./popup.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/popup/popup.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_popup_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_popup_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_popup_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_popup_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/content_script/localStorage.ts":
/*!********************************************!*\
  !*** ./src/content_script/localStorage.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports) => {


/*
    This file is part of d-comments.

    d-comments is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    d-comments is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with d-comments.  If not, see <https://www.gnu.org/licenses/>.
*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getOption = exports.getAllOptions = exports.defaultOptions = void 0;
exports.defaultOptions = {
    ポップアップを開いたとき最後に入力した動画IDを表示する: true,
    ポップアップを開いたとき自動で動画検索を開始する: true,
    自動検索が無効のとき前回の検索結果を表示する: true,
};
/**
 * Chrome.storage.local に保存されている設定を取得し、callback を呼び出す。
 * @param callback callback(options)
 */
const getAllOptions = (callback) => {
    chrome.storage.local.get(null, (result) => {
        Object.keys(exports.defaultOptions).map((key) => {
            if (result[key] === undefined) {
                result[key] = exports.defaultOptions[key];
            }
        });
        Object.keys(result).map((key) => {
            if (!(key in exports.defaultOptions)) {
                delete result[key];
                chrome.storage.local.remove(key);
            }
        });
        return callback(result);
    });
};
exports.getAllOptions = getAllOptions;
/**
 * 設定を取得し、Callback を呼び出す
 * @param key 設定キー
 * @param callback 設定値を取得した後に呼ばれる関数
 */
const getOption = (key, callback) => {
    chrome.storage.local.get(key, (result) => {
        callback(result[key] ?? exports.defaultOptions[key]);
    });
};
exports.getOption = getOption;


/***/ }),

/***/ "./src/popup/popup.tsx":
/*!*****************************!*\
  !*** ./src/popup/popup.tsx ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*
    This file is part of d-comments.

    d-comments is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    d-comments is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with d-comments.  If not, see <https://www.gnu.org/licenses/>.
*/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const react_1 = __importDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
const ReactDOM = __importStar(__webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js"));
const Storage = __importStar(__webpack_require__(/*! ../content_script/localStorage */ "./src/content_script/localStorage.ts"));
__webpack_require__(/*! ./popup.scss */ "./src/popup/popup.scss");
const Popup = () => {
    const [movieId, setMovieId] = react_1.default.useState("");
    const [word, setWord] = react_1.default.useState("");
    const [result, setResult] = react_1.default.useState();
    const [owner, setOwner] = react_1.default.useState();
    const [isActive, setIsActive] = react_1.default.useState(false);
    /**
     * 作品視聴ページか判定
     * @param href window.location.href
     * @returns boolean
     */
    const isWatchPage = (href) => {
        return href.match(/https:\/\/animestore\.docomo\.ne\.jp\/animestore\/sc_d_pc\?partId=\d+/)
            ? true
            : false;
    };
    /**
     * 視聴ページでコメントを表示する
     */
    const sendMessage = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            isWatchPage(tabs[0]?.url ?? "") &&
                chrome.tabs.sendMessage(tabs[0].id, {
                    type: "showComments",
                    movieId: movieId,
                }),
                (response) => {
                    console.log(response);
                };
        });
    };
    const handler = (value) => {
        window.localStorage.setItem("movieId", value);
        setMovieId(value);
    };
    /**
     * 動画投稿者の名前、アイコンURLを取得
     * @param contentId 動画ID
     * @param ownerId ユーザーID または チャンネルID
     * @param isUser ユーザーかチャンネルか
     * @returns 動画投稿者の名前、アイコンURL
     */
    const getOwnerInfo = (contentId, ownerId, isUser) => {
        const res = [];
        chrome.runtime.sendMessage({
            type: isUser ? "user" : "channel",
            id: ownerId,
            UserAgent: navigator.userAgent ?? "",
        }, (response) => {
            if (response.meta.status === 200) {
                const setOwnerInfo = async () => {
                    res.push({
                        contentId: contentId,
                        ownerId: ownerId,
                        ownerName: isUser
                            ? response.data.user.nickname
                            : response.data.channel.name,
                        ownerIconUrl: isUser
                            ? response.data.user.icons.small
                            : response.data.channel.thumbnailSmallUrl,
                    });
                };
                setOwnerInfo().then(() => {
                    setOwner((owner) => (owner ? [...owner, ...res] : res));
                    window.localStorage.setItem("owner", JSON.stringify(res ?? []));
                });
            }
            else {
                return;
            }
        });
        return res;
    };
    /**
     * スナップショットAPIを使ってキーワードで動画を検索
     * @param word キーワード
     * @returns 動画情報
     * @see https://site.nicovideo.jp/search-api-docs/snapshot
     */
    const search = async (word) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            isWatchPage(tabs[0]?.url ?? "") &&
                chrome.runtime.sendMessage({
                    type: "search",
                    word: word,
                    UserAgent: navigator.userAgent ?? "",
                }, (response) => {
                    console.log("検索結果", response);
                    window.localStorage.setItem("searchResult", JSON.stringify(response));
                    setResult(response);
                    response.data.forEach((item) => {
                        const isUser = item.userId ? true : false;
                        getOwnerInfo(item.contentId, isUser ? item.userId : item.channelId, isUser ? true : false);
                    });
                });
        });
    };
    react_1.default.useEffect(() => {
        const init = (title) => {
            Storage.getOption("ポップアップを開いたとき最後に入力した動画IDを表示する", (value) => {
                if (value === true) {
                    setMovieId(window.localStorage.getItem("movieId") ?? "");
                }
            });
            Storage.getOption("ポップアップを開いたとき自動で動画検索を開始する", (value) => {
                if (value === true) {
                    setWord(title);
                    search(title);
                }
                else {
                    Storage.getOption("自動検索が無効のとき前回の検索結果を表示する", (value) => {
                        if (value === true) {
                            setResult(JSON.parse(window.localStorage.getItem("searchResult") ?? "") ?? "");
                            setOwner(JSON.parse(window.localStorage.getItem("owner") ?? "") ?? "");
                        }
                    });
                }
            });
        };
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            console.log(tabs[0]?.url);
            isWatchPage(tabs[0]?.url ?? "")
                ? (setIsActive(true), init(tabs[0]?.title ?? ""))
                : setIsActive(false);
        });
    }, []);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("a", { href: "options.html", className: "btn-option", target: "_blank", rel: "noopener noreferrer" },
            react_1.default.createElement("span", null,
                react_1.default.createElement("i", { className: "codicon codicon-settings-gear" }))),
        isActive ? (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("label", null,
                react_1.default.createElement("p", null,
                    "\u52D5\u753BID",
                    react_1.default.createElement("a", { href: "https://dic.nicovideo.jp/a/id", target: "_blank", rel: "noopener noreferrer" }, "\u3010\u8A73\u7D30\u3011")),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("input", { value: movieId, onChange: (e) => handler(e.target.value) }),
                    react_1.default.createElement("a", { className: "btn btn-draw", onClick: () => {
                            sendMessage();
                        } }, "\u8868\u793A"))),
            react_1.default.createElement("label", null,
                react_1.default.createElement("p", null, "\u691C\u7D22\u30EF\u30FC\u30C9"),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("input", { value: word, onChange: (e) => setWord(e.target.value) }),
                    react_1.default.createElement("a", { className: "btn btn-search", onClick: () => {
                            search(word);
                        } },
                        react_1.default.createElement("span", null,
                            react_1.default.createElement("i", { className: "codicon codicon-search" }))))),
            react_1.default.createElement("ul", { className: "result" }, result?.meta?.status === 200 &&
                result?.data?.map((item, index) => (react_1.default.createElement("li", { key: index, onClick: () => {
                        handler(item.contentId);
                    } },
                    react_1.default.createElement("a", { className: "title" },
                        react_1.default.createElement("span", null, item.title)),
                    react_1.default.createElement("div", { className: "wrapper" },
                        react_1.default.createElement("img", { src: item.thumbnailUrl, alt: item.title }),
                        react_1.default.createElement("div", { className: "info" },
                            react_1.default.createElement("p", null, "\u52D5\u753B\u60C5\u5831"),
                            owner?.map((ownerItem) => {
                                if (ownerItem.contentId === item.contentId) {
                                    return (react_1.default.createElement("div", { className: "owner", key: ownerItem.ownerId },
                                        react_1.default.createElement("img", { src: ownerItem.ownerIconUrl, alt: ownerItem.ownerName }),
                                        react_1.default.createElement("p", null, ownerItem.ownerName)));
                                }
                            }),
                            react_1.default.createElement("a", null,
                                "\u518D\u751F\u6570\u2003\u2003\u00A0:\u00A0",
                                item.viewCounter),
                            react_1.default.createElement("a", null,
                                "\u30B3\u30E1\u30F3\u30C8\u6570\u00A0:\u00A0",
                                item.commentCounter),
                            react_1.default.createElement("a", null,
                                "\u52D5\u753B\u306E\u5C3A\u2003\u00A0:\u00A0",
                                Math.floor(item.lengthSeconds / 3600) > 0
                                    ? `${Math.floor(item.lengthSeconds / 3600)}時間`
                                    : "",
                                Math.floor(item.lengthSeconds / 60) > 0
                                    ? `${Math.floor(item.lengthSeconds / 60)}分`
                                    : "",
                                item.lengthSeconds % 60,
                                "\u79D2"))))))))) : (react_1.default.createElement("p", { className: "error" },
            react_1.default.createElement("span", { className: "inner" },
                react_1.default.createElement("i", { className: "codicon codicon-info" })),
            react_1.default.createElement("a", null, "\u73FE\u5728\u4F7F\u7528\u4E2D\u306E\u30BF\u30D6\u3067\u306F\u4F7F\u7528\u3067\u304D\u307E\u305B\u3093\u3002")))));
};
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(react_1.default.createElement(Popup, null));


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"popup": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkd_comments"] = self["webpackChunkd_comments"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendor"], () => (__webpack_require__("./src/popup/popup.tsx")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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V0FBVyxXQUFXLFVBQVUsVUFBVSxNQUFNLE1BQU0sV0FBVyxXQUFXLE1BQU0sTUFBTSxLQUFLLFdBQVcsTUFBTSxNQUFNLFdBQVcsTUFBTSxNQUFNLFdBQVcsTUFBTSxNQUFNLFdBQVcsTUFBTSxNQUFNLFdBQVcsTUFBTSxNQUFNLFdBQVcsTUFBTSxLQUFLLE1BQU0sVUFBVSxXQUFXLFdBQVcsV0FBVyxXQUFXLFVBQVUsV0FBVyxVQUFVLFVBQVUsV0FBVyxVQUFVLE1BQU0sTUFBTSxXQUFXLFdBQVcsTUFBTSxNQUFNLFVBQVUsTUFBTSxNQUFNLFVBQVUsVUFBVSxXQUFXLFVBQVUsVUFBVSxVQUFVLFVBQVUsV0FBVyxXQUFXLFdBQVcsV0FBVyxNQUFNLE1BQU0sV0FBVyxXQUFXLE1BQU0sTUFBTSxVQUFVLE1BQU0sS0FBSyxVQUFVLFVBQVUsVUFBVSxXQUFXLFVBQVUsVUFBVSxVQUFVLFdBQVcsV0FBVyxNQUFNLEtBQUssVUFBVSxNQUFNLEtBQUssV0FBVyxXQUFXLFVBQVUsV0FBVyxVQUFVLEtBQUssS0FBSyxVQUFVLFdBQVcsV0FBVyxXQUFXLEtBQUssS0FBSyxXQUFXLEtBQUssS0FBSyxXQUFXLEtBQUssS0FBSyxVQUFVLFdBQVcsS0FBSyxLQUFLLFdBQVcsVUFBVSxXQUFXLFdBQVcsV0FBVyxVQUFVLFdBQVcsS0FBSyxLQUFLLFdBQVcsS0FBSyxLQUFLLFdBQVcsS0FBSyxLQUFLLFdBQVcsS0FBSyxLQUFLLFVBQVUsV0FBVyxXQUFXLEtBQUssS0FBSyxVQUFVLFdBQVcsVUFBVSxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsS0FBSyxLQUFLLEtBQUssV0FBVyxLQUFLLEtBQUssV0FBVyxLQUFLLEtBQUssS0FBSyxVQUFVLFdBQVcsV0FBVyxVQUFVLEtBQUssS0FBSyxVQUFVLEtBQUssS0FBSyxXQUFXLFdBQVcsVUFBVSxXQUFXLE1BQU0sS0FBSyxVQUFVLFdBQVcsV0FBVyxLQUFLLEtBQUssVUFBVSxVQUFVLFdBQVcsS0FBSyxLQUFLLFVBQVUsS0FBSyxLQUFLLFVBQVUsV0FBVyxLQUFLLEtBQUss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QUNBOzs7OztXQzNCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsR0FBRztXQUNIO1dBQ0E7V0FDQSxDQUFDOzs7OztXQ1BEOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7V0NOQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7OztXQ0pBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7OztXQ2ZBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxNQUFNLHFCQUFxQjtXQUMzQjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTs7Ozs7V0NoREE7Ozs7O1VFQUE7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2QtY29tbWVudHMvLi9zcmMvcG9wdXAvcG9wdXAuc2NzcyIsIndlYnBhY2s6Ly9kLWNvbW1lbnRzLy4vc3JjL3BvcHVwL3BvcHVwLnNjc3M/NGJhOCIsIndlYnBhY2s6Ly9kLWNvbW1lbnRzLy4vc3JjL2NvbnRlbnRfc2NyaXB0L2xvY2FsU3RvcmFnZS50cyIsIndlYnBhY2s6Ly9kLWNvbW1lbnRzLy4vc3JjL3BvcHVwL3BvcHVwLnRzeCIsIndlYnBhY2s6Ly9kLWNvbW1lbnRzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2QtY29tbWVudHMvd2VicGFjay9ydW50aW1lL2NodW5rIGxvYWRlZCIsIndlYnBhY2s6Ly9kLWNvbW1lbnRzL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2QtY29tbWVudHMvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2QtY29tbWVudHMvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9kLWNvbW1lbnRzL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZC1jb21tZW50cy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2QtY29tbWVudHMvd2VicGFjay9ydW50aW1lL25vZGUgbW9kdWxlIGRlY29yYXRvciIsIndlYnBhY2s6Ly9kLWNvbW1lbnRzL3dlYnBhY2svcnVudGltZS9wdWJsaWNQYXRoIiwid2VicGFjazovL2QtY29tbWVudHMvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vZC1jb21tZW50cy93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vZC1jb21tZW50cy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2QtY29tbWVudHMvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2QtY29tbWVudHMvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVRfUlVMRV9JTVBPUlRfMF9fXyBmcm9tIFwiLSEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuLi8uLi9ub2RlX21vZHVsZXMvQHZzY29kZS9jb2RpY29ucy9kaXN0L2NvZGljb24uY3NzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5pKF9fX0NTU19MT0FERVJfQVRfUlVMRV9JTVBPUlRfMF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgXCIvKlxcbiAgICBUaGlzIGZpbGUgaXMgcGFydCBvZiBkLWNvbW1lbnRzLlxcblxcbiAgICBkLWNvbW1lbnRzIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcXG4gICAgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcXG4gICAgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcXG4gICAgKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cXG5cXG4gICAgZC1jb21tZW50cyBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxcbiAgICBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxcbiAgICBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXFxuICAgIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXFxuXFxuICAgIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXFxuICAgIGFsb25nIHdpdGggZC1jb21tZW50cy4gIElmIG5vdCwgc2VlIDxodHRwczovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXFxuKi9cXG46cm9vdCB7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XFxuICAtd2Via2l0LWZvbnQtc21vb3RoaW5nOiBzdWJwaXhlbC1hbnRpYWxpYXNlZDtcXG4gIHRleHQtcmVuZGVyaW5nOiBvcHRpbWl6ZUxlZ2liaWxpdHk7XFxuICB3b3JkLWJyZWFrOiBicmVhay13b3JkO1xcbiAgd29yZC13cmFwOiBicmVhay13b3JkO1xcbn1cXG5AbWVkaWEgb25seSBzY3JlZW4gYW5kICgtd2Via2l0LW1pbi1kZXZpY2UtcGl4ZWwtcmF0aW86IDIpLCAobWluLXJlc29sdXRpb246IDJkcHB4KSB7XFxuICA6cm9vdCB7XFxuICAgIC13ZWJraXQtZm9udC1zbW9vdGhpbmc6IGFudGlhbGlhc2VkO1xcbiAgfVxcbn1cXG46cm9vdCA6YW55LWxpbmsge1xcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbiAgY29sb3I6IHJnYig2LCA3LCAxMzMpO1xcbn1cXG5cXG4vKlxcbiAgICBUaGlzIGZpbGUgaXMgcGFydCBvZiBkLWNvbW1lbnRzLlxcblxcbiAgICBkLWNvbW1lbnRzIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcXG4gICAgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcXG4gICAgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcXG4gICAgKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cXG5cXG4gICAgZC1jb21tZW50cyBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxcbiAgICBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxcbiAgICBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXFxuICAgIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXFxuXFxuICAgIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXFxuICAgIGFsb25nIHdpdGggZC1jb21tZW50cy4gIElmIG5vdCwgc2VlIDxodHRwczovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXFxuKi9cXG4jcm9vdCB7XFxuICB3aWR0aDogNDAwcHg7XFxuICBoZWlnaHQ6IDU4MHB4O1xcbiAgbWF4LXdpZHRoOiA0ODBweDtcXG4gIG1heC1oZWlnaHQ6IDU4MHB4O1xcbiAgbWluLXdpZHRoOiA0MDBweDtcXG4gIG1pbi1oZWlnaHQ6IDU4MHB4O1xcbn1cXG4jcm9vdDo6LXdlYmtpdC1zY3JvbGxiYXIge1xcbiAgZGlzcGxheTogbm9uZTtcXG59XFxuI3Jvb3QgLmJ0biB7XFxuICBtYXJnaW46IDBweDtcXG4gIG92ZXJmbG93OiBoaWRkZW47XFxuICBib3JkZXItcmFkaXVzOiA3cHg7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMjM2LCAyMzYsIDIzNik7XFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxuICBjb2xvcjogYmxhY2s7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcbiNyb290IC5idG46aG92ZXIge1xcbiAgYW5pbWF0aW9uOiBzd2luZyAxcyBlYXNlO1xcbiAgYW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudDogMTtcXG59XFxuQGtleWZyYW1lcyBzd2luZyB7XFxuICAxNSUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoNXB4KTtcXG4gIH1cXG4gIDMwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtNXB4KTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgzcHgpO1xcbiAgfVxcbiAgODAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDJweCk7XFxuICB9XFxuICA5MCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMXB4KTtcXG4gIH1cXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMHB4KTtcXG4gIH1cXG59XFxuI3Jvb3QgLmJ0bi1vcHRpb24ge1xcbiAgbWFyZ2luOiAwcHg7XFxuICBvdmVyZmxvdzogaGlkZGVuO1xcbiAgcGFkZGluZzogNnB4IDhweDtcXG4gIGJvcmRlci1yYWRpdXM6IDEwMCU7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMjM2LCAyMzYsIDIzNik7XFxuICBjb2xvcjogYmxhY2s7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0b3A6IDEwcHg7XFxuICByaWdodDogMTVweDtcXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuI3Jvb3QgLmJ0bi1vcHRpb24gc3BhbiB7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICB0cmFuc2l0aW9uOiBjb2xvciAwLjZzIGN1YmljLWJlemllcigwLjUzLCAwLjIxLCAwLCAxKTtcXG59XFxuI3Jvb3QgLmJ0bi1vcHRpb24gc3BhbiBpIHtcXG4gIGZvbnQtc2l6ZTogMjVweDtcXG59XFxuI3Jvb3QgLmJ0bi1vcHRpb246YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFwiO1xcbiAgZGlzcGxheTogYmxvY2s7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0b3A6IDA7XFxuICBsZWZ0OiAwO1xcbiAgd2lkdGg6IDEwMCU7XFxuICBoZWlnaHQ6IDEwMCU7XFxuICBiYWNrZ3JvdW5kOiBoc2woMGRlZywgMCUsIDQ5JSk7XFxuICB0cmFuc2Zvcm06IHNjYWxlWCgwKTtcXG4gIHRyYW5zZm9ybS1vcmlnaW46IDEwMCUgMTAwJTtcXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjZzIGN1YmljLWJlemllcigwLjUzLCAwLjIxLCAwLCAxKTtcXG59XFxuI3Jvb3QgLmJ0bi1vcHRpb246aG92ZXI6YmVmb3JlIHtcXG4gIHRyYW5zZm9ybS1vcmlnaW46IDAgMDtcXG4gIHRyYW5zZm9ybTogc2NhbGVYKDEpO1xcbn1cXG4jcm9vdCAuYnRuLW9wdGlvbjpob3ZlciBzcGFuIHtcXG4gIGNvbG9yOiB3aGl0ZTtcXG59XFxuI3Jvb3QgaW5wdXQge1xcbiAgd2lkdGg6IDI0MHB4O1xcbiAgaGVpZ2h0OiAzMnB4O1xcbiAgYm9yZGVyOiBub25lO1xcbiAgYm9yZGVyLXJhZGl1czogOHB4O1xcbiAgcGFkZGluZzogOHB4O1xcbiAgbWFyZ2luOiAwcHg7XFxuICBmb250LXNpemU6IDIwcHg7XFxuICBmb250LXdlaWdodDogYm9sZGVyO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDIzNiwgMjM2LCAyMzYpO1xcbn1cXG4jcm9vdCBpbnB1dDpmb2N1cyB7XFxuICBvdXRsaW5lOiBub25lO1xcbn1cXG4jcm9vdCBsYWJlbCB7XFxuICBmb250LXNpemU6IGxhcmdlO1xcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIHBhZGRpbmc6IDAgMjRweDtcXG59XFxuI3Jvb3QgbGFiZWwgZGl2IHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogcm93O1xcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG59XFxuI3Jvb3QgbGFiZWwgZGl2IC5idG4tZHJhdyB7XFxuICBwYWRkaW5nOiAxMHB4IDIwcHg7XFxufVxcbiNyb290IGxhYmVsIGRpdiAuYnRuLXNlYXJjaCB7XFxuICBwYWRkaW5nOiAxMHB4IDI1cHg7XFxufVxcbiNyb290IGxhYmVsIGRpdiAuYnRuLXNlYXJjaCBpIHtcXG4gIGZvbnQtc2l6ZTogMjRweDtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcbn1cXG4jcm9vdCAucmVzdWx0IHtcXG4gIGxpc3Qtc3R5bGU6IG5vbmU7XFxuICBwYWRkaW5nOiAwO1xcbiAgYm9yZGVyOiAycHggc29saWQgcmdiKDE4NywgMTg3LCAxODcpO1xcbiAgb3ZlcmZsb3cteDogaGlkZGVuO1xcbiAgb3ZlcmZsb3cteTogc2Nyb2xsO1xcbiAgaGVpZ2h0OiAzNTBweDtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkZXI7XFxufVxcbiNyb290IC5yZXN1bHQgOm5vdCg6bGFzdC1jaGlsZCkgbGkge1xcbiAgYm9yZGVyLWJvdHRvbTogNXB4IHNvbGlkIHJnYigxODEsIDE4MSwgMTgxKTtcXG59XFxuI3Jvb3QgLnJlc3VsdCBsaSB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMjQ4LCAyNDgsIDI0OCk7XFxufVxcbiNyb290IC5yZXN1bHQgbGk6bm90KDpsYXN0LWNoaWxkKSB7XFxuICBib3JkZXItYm90dG9tOiA1cHggc29saWQgcmdiKDE4MSwgMTgxLCAxODEpO1xcbn1cXG4jcm9vdCAucmVzdWx0IGxpIC50aXRsZSB7XFxuICBoZWlnaHQ6IDI0cHg7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBvdmVyZmxvdzogaGlkZGVuO1xcbn1cXG4jcm9vdCAucmVzdWx0IGxpIC50aXRsZSBzcGFuIHtcXG4gIGZvbnQtc2l6ZTogMTRweDtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcbiAgbWFyZ2luOiAwcHg7XFxuICBwYWRkaW5nOiA4cHggMHB4IDBweCAxMDAlO1xcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcXG4gIGxpbmUtaGVpZ2h0OiAxZW07XFxuICBhbmltYXRpb246IHNjcm9sbCAxNXMgbGluZWFyIGluZmluaXRlO1xcbn1cXG5Aa2V5ZnJhbWVzIHNjcm9sbCB7XFxuICAwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgwKTtcXG4gIH1cXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTEwMCUpO1xcbiAgfVxcbn1cXG4jcm9vdCAucmVzdWx0IGxpIC53cmFwcGVyIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogcm93O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIHBhZGRpbmc6IDEwcHg7XFxufVxcbiNyb290IC5yZXN1bHQgbGkgLndyYXBwZXIgaW1nIHtcXG4gIHdpZHRoOiAxMzBweDtcXG59XFxuI3Jvb3QgLnJlc3VsdCBsaSAud3JhcHBlciAuaW5mbyB7XFxuICBtYXJnaW4tbGVmdDogMjBweDtcXG4gIGZvbnQtc2l6ZTogMTZweDtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbn1cXG4jcm9vdCAucmVzdWx0IGxpIC53cmFwcGVyIC5pbmZvIC5vd25lciB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcXG4gIG1hcmdpbi1ib3R0b206IDVweDtcXG59XFxuI3Jvb3QgLnJlc3VsdCBsaSAud3JhcHBlciAuaW5mbyAub3duZXIgaW1nIHtcXG4gIHdpZHRoOiAzMnB4O1xcbiAgaGVpZ2h0OiAzMnB4O1xcbiAgbWFyZ2luLXJpZ2h0OiA1cHg7XFxufVxcbiNyb290IC5yZXN1bHQgbGkgLndyYXBwZXIgLmluZm8gcCB7XFxuICBtYXJnaW46IGF1dG87XFxufVxcbiNyb290IC5lcnJvciB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcXG59XFxuI3Jvb3QgLmVycm9yIHNwYW4ge1xcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbn1cXG4jcm9vdCAuZXJyb3Igc3BhbiBpIHtcXG4gIHBhZGRpbmc6IDE2cHggMDtcXG4gIGZvbnQtc2l6ZTogNDhweDtcXG4gIGNvbG9yOiByZ2IoNTEsIDUxLCA1MSk7XFxuICBvdmVyZmxvdzogaGlkZGVuO1xcbn1cXG4jcm9vdCAuZXJyb3IgYSB7XFxuICBtYXJnaW46IGF1dG8gMWVtO1xcbiAgZm9udC1zaXplOiAxNnB4O1xcbn1cIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvZ2xvYmFsLnNjc3NcIixcIndlYnBhY2s6Ly8uL3NyYy9wb3B1cC9wb3B1cC5zY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Q0FBQTtBQW1CQTtFQUNFLHNCQUFBO0VBQ0EsaUJBQUE7RUFDQSw0Q0FBQTtFQUNBLGtDQUFBO0VBT0Esc0JBQUE7RUFDQSxxQkFBQTtBQ1BGO0FEQ0U7RUFORjtJQVFJLG1DQUFBO0VDQ0Y7QUFDRjtBRElFO0VBQ0UscUJBQUE7RUFDQSxxQkFBQTtBQ0ZKOztBQWpDQTs7Ozs7Ozs7Ozs7Ozs7O0NBQUE7QUFtQkE7RUFDRSxZQUFBO0VBQ0EsYUFBQTtFQUNBLGdCQUFBO0VBQ0EsaUJBQUE7RUFDQSxnQkFBQTtFQUNBLGlCQUFBO0FBaUNGO0FBL0JFO0VBQ0UsYUFBQTtBQWlDSjtBQTlCRTtFQUNFLFdBQUE7RUFDQSxnQkFBQTtFQUNBLGtCQUFBO0VBQ0Esb0NBQUE7RUFDQSxxQkFBQTtFQUNBLFlBQUE7RUFDQSxlQUFBO0FBZ0NKO0FBOUJJO0VBQ0Usd0JBQUE7RUFDQSw0QkFBQTtBQWdDTjtBQTdCSTtFQUNFO0lBQ0UsMEJBQUE7RUErQk47RUE1Qkk7SUFDRSwyQkFBQTtFQThCTjtFQTNCSTtJQUNFLDBCQUFBO0VBNkJOO0VBMUJJO0lBQ0UsMEJBQUE7RUE0Qk47RUF6Qkk7SUFDRSwwQkFBQTtFQTJCTjtFQXhCSTtJQUNFLDBCQUFBO0VBMEJOO0FBQ0Y7QUF0QkU7RUFDRSxXQUFBO0VBQ0EsZ0JBQUE7RUFDQSxnQkFBQTtFQUNBLG1CQUFBO0VBQ0Esb0NBQUE7RUFDQSxZQUFBO0VBQ0Esa0JBQUE7RUFDQSxTQUFBO0VBQ0EsV0FBQTtFQUNBLHFCQUFBO0VBQ0EsZUFBQTtBQXdCSjtBQXRCSTtFQUNFLGtCQUFBO0VBQ0EscURBQUE7QUF3Qk47QUF0Qk07RUFDRSxlQUFBO0FBd0JSO0FBcEJJO0VBQ0UsV0FBQTtFQUNBLGNBQUE7RUFDQSxrQkFBQTtFQUNBLE1BQUE7RUFDQSxPQUFBO0VBQ0EsV0FBQTtFQUNBLFlBQUE7RUFDQSw4QkFBQTtFQUNBLG9CQUFBO0VBQ0EsMkJBQUE7RUFDQSx5REFBQTtBQXNCTjtBQWxCTTtFQUNFLHFCQUFBO0VBQ0Esb0JBQUE7QUFvQlI7QUFqQk07RUFDRSxZQUFBO0FBbUJSO0FBZEU7RUFDRSxZQUFBO0VBQ0EsWUFBQTtFQUNBLFlBQUE7RUFDQSxrQkFBQTtFQUNBLFlBQUE7RUFDQSxXQUFBO0VBQ0EsZUFBQTtFQUNBLG1CQUFBO0VBQ0Esb0NBQUE7QUFnQko7QUFkSTtFQUNFLGFBQUE7QUFnQk47QUFaRTtFQUNFLGdCQUFBO0VBQ0EsaUJBQUE7RUFDQSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSxlQUFBO0FBY0o7QUFaSTtFQUNFLGFBQUE7RUFDQSxtQkFBQTtFQUNBLDhCQUFBO0VBQ0EsbUJBQUE7QUFjTjtBQVpNO0VBQ0Usa0JBQUE7QUFjUjtBQVhNO0VBQ0Usa0JBQUE7QUFhUjtBQVhRO0VBQ0UsZUFBQTtFQUNBLGlCQUFBO0FBYVY7QUFQRTtFQUNFLGdCQUFBO0VBQ0EsVUFBQTtFQUNBLG9DQUFBO0VBQ0Esa0JBQUE7RUFDQSxrQkFBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtBQVNKO0FBTk07RUFDRSwyQ0FBQTtBQVFSO0FBSkk7RUFDRSxvQ0FBQTtBQU1OO0FBSk07RUFDRSwyQ0FBQTtBQU1SO0FBSE07RUFDRSxZQUFBO0VBQ0Esa0JBQUE7RUFDQSxnQkFBQTtBQUtSO0FBSFE7RUFDRSxlQUFBO0VBQ0EsaUJBQUE7RUFDQSxXQUFBO0VBQ0EseUJBQUE7RUFDQSxxQkFBQTtFQUNBLG1CQUFBO0VBQ0EsZ0JBQUE7RUFDQSxxQ0FBQTtBQUtWO0FBSFU7RUFDRTtJQUNFLHdCQUFBO0VBS1o7RUFGVTtJQUNFLDRCQUFBO0VBSVo7QUFDRjtBQUNNO0VBQ0UsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsbUJBQUE7RUFDQSxhQUFBO0FBQ1I7QUFDUTtFQUNFLFlBQUE7QUFDVjtBQUVRO0VBQ0UsaUJBQUE7RUFrQkEsZUFBQTtFQUNBLGFBQUE7RUFDQSxzQkFBQTtBQWpCVjtBQURVO0VBQ0UsYUFBQTtFQUNBLG1CQUFBO0VBQ0Esa0JBQUE7QUFHWjtBQURZO0VBQ0UsV0FBQTtFQUNBLFlBQUE7RUFDQSxpQkFBQTtBQUdkO0FBQ1U7RUFDRSxZQUFBO0FBQ1o7QUFVRTtFQUNFLGFBQUE7RUFDQSxtQkFBQTtBQVJKO0FBVUk7RUFDRSxxQkFBQTtFQUNBLGtCQUFBO0FBUk47QUFVTTtFQUNFLGVBQUE7RUFDQSxlQUFBO0VBQ0Esc0JBQUE7RUFDQSxnQkFBQTtBQVJSO0FBWUk7RUFDRSxnQkFBQTtFQUNBLGVBQUE7QUFWTlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIvKlxcclxcbiAgICBUaGlzIGZpbGUgaXMgcGFydCBvZiBkLWNvbW1lbnRzLlxcclxcblxcclxcbiAgICBkLWNvbW1lbnRzIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcXHJcXG4gICAgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcXHJcXG4gICAgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcXHJcXG4gICAgKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cXHJcXG5cXHJcXG4gICAgZC1jb21tZW50cyBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxcclxcbiAgICBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxcclxcbiAgICBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXFxyXFxuICAgIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXFxyXFxuXFxyXFxuICAgIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXFxyXFxuICAgIGFsb25nIHdpdGggZC1jb21tZW50cy4gIElmIG5vdCwgc2VlIDxodHRwczovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXFxyXFxuKi9cXHJcXG5cXHJcXG5AaW1wb3J0IFxcXCJ+QHZzY29kZS9jb2RpY29ucy9kaXN0L2NvZGljb24uY3NzXFxcIjtcXHJcXG5cXHJcXG46cm9vdCB7XFxyXFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcclxcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XFxyXFxuICAtd2Via2l0LWZvbnQtc21vb3RoaW5nOiBzdWJwaXhlbC1hbnRpYWxpYXNlZDtcXHJcXG4gIHRleHQtcmVuZGVyaW5nOiBvcHRpbWl6ZUxlZ2liaWxpdHk7XFxyXFxuXFxyXFxuICBAbWVkaWEgb25seSBzY3JlZW4gYW5kICgtd2Via2l0LW1pbi1kZXZpY2UtcGl4ZWwtcmF0aW86IDIpLFxcclxcbiAgICAobWluLXJlc29sdXRpb246IDJkcHB4KSB7XFxyXFxuICAgIC13ZWJraXQtZm9udC1zbW9vdGhpbmc6IGFudGlhbGlhc2VkO1xcclxcbiAgfVxcclxcblxcclxcbiAgd29yZC1icmVhazogYnJlYWstd29yZDtcXHJcXG4gIHdvcmQtd3JhcDogYnJlYWstd29yZDtcXHJcXG5cXHJcXG4gIDphbnktbGluayB7XFxyXFxuICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXHJcXG4gICAgY29sb3I6IHJnYig2LCA3LCAxMzMpO1xcclxcbiAgfVxcclxcbn1cXHJcXG5cIixcIi8qXFxyXFxuICAgIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIGQtY29tbWVudHMuXFxyXFxuXFxyXFxuICAgIGQtY29tbWVudHMgaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxcclxcbiAgICBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxcclxcbiAgICB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxcclxcbiAgICAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxcclxcblxcclxcbiAgICBkLWNvbW1lbnRzIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXFxyXFxuICAgIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXFxyXFxuICAgIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcXHJcXG4gICAgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cXHJcXG5cXHJcXG4gICAgWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcXHJcXG4gICAgYWxvbmcgd2l0aCBkLWNvbW1lbnRzLiAgSWYgbm90LCBzZWUgPGh0dHBzOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cXHJcXG4qL1xcclxcblxcclxcbkB1c2UgXFxcIi4uL2dsb2JhbC5zY3NzXFxcIjtcXHJcXG5cXHJcXG4jcm9vdCB7XFxyXFxuICB3aWR0aDogNDAwcHg7XFxyXFxuICBoZWlnaHQ6IDU4MHB4O1xcclxcbiAgbWF4LXdpZHRoOiA0ODBweDtcXHJcXG4gIG1heC1oZWlnaHQ6IDU4MHB4O1xcclxcbiAgbWluLXdpZHRoOiA0MDBweDtcXHJcXG4gIG1pbi1oZWlnaHQ6IDU4MHB4O1xcclxcblxcclxcbiAgJjo6LXdlYmtpdC1zY3JvbGxiYXIge1xcclxcbiAgICBkaXNwbGF5OiBub25lO1xcclxcbiAgfVxcclxcblxcclxcbiAgLmJ0biB7XFxyXFxuICAgIG1hcmdpbjogMHB4O1xcclxcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xcclxcbiAgICBib3JkZXItcmFkaXVzOiA3cHg7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYigyMzYgMjM2IDIzNik7XFxyXFxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXHJcXG4gICAgY29sb3I6IGJsYWNrO1xcclxcbiAgICBjdXJzb3I6IHBvaW50ZXI7XFxyXFxuXFxyXFxuICAgICY6aG92ZXIge1xcclxcbiAgICAgIGFuaW1hdGlvbjogc3dpbmcgMXMgZWFzZTtcXHJcXG4gICAgICBhbmltYXRpb24taXRlcmF0aW9uLWNvdW50OiAxO1xcclxcbiAgICB9XFxyXFxuXFxyXFxuICAgIEBrZXlmcmFtZXMgc3dpbmcge1xcclxcbiAgICAgIDE1JSB7XFxyXFxuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoNXB4KTtcXHJcXG4gICAgICB9XFxyXFxuXFxyXFxuICAgICAgMzAlIHtcXHJcXG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtNXB4KTtcXHJcXG4gICAgICB9XFxyXFxuXFxyXFxuICAgICAgNTAlIHtcXHJcXG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgzcHgpO1xcclxcbiAgICAgIH1cXHJcXG5cXHJcXG4gICAgICA4MCUge1xcclxcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDJweCk7XFxyXFxuICAgICAgfVxcclxcblxcclxcbiAgICAgIDkwJSB7XFxyXFxuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMXB4KTtcXHJcXG4gICAgICB9XFxyXFxuXFxyXFxuICAgICAgMTAwJSB7XFxyXFxuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMHB4KTtcXHJcXG4gICAgICB9XFxyXFxuICAgIH1cXHJcXG4gIH1cXHJcXG5cXHJcXG4gIC5idG4tb3B0aW9uIHtcXHJcXG4gICAgbWFyZ2luOiAwcHg7XFxyXFxuICAgIG92ZXJmbG93OiBoaWRkZW47XFxyXFxuICAgIHBhZGRpbmc6IDZweCA4cHg7XFxyXFxuICAgIGJvcmRlci1yYWRpdXM6IDEwMCU7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYigyMzYgMjM2IDIzNik7XFxyXFxuICAgIGNvbG9yOiBibGFjaztcXHJcXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xcclxcbiAgICB0b3A6IDEwcHg7XFxyXFxuICAgIHJpZ2h0OiAxNXB4O1xcclxcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxyXFxuICAgIGN1cnNvcjogcG9pbnRlcjtcXHJcXG5cXHJcXG4gICAgc3BhbiB7XFxyXFxuICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xcclxcbiAgICAgIHRyYW5zaXRpb246IGNvbG9yIDAuNnMgY3ViaWMtYmV6aWVyKDAuNTMsIDAuMjEsIDAsIDEpO1xcclxcblxcclxcbiAgICAgIGkge1xcclxcbiAgICAgICAgZm9udC1zaXplOiAyNXB4O1xcclxcbiAgICAgIH1cXHJcXG4gICAgfVxcclxcblxcclxcbiAgICAmOmJlZm9yZSB7XFxyXFxuICAgICAgY29udGVudDogXFxcIlxcXCI7XFxyXFxuICAgICAgZGlzcGxheTogYmxvY2s7XFxyXFxuICAgICAgcG9zaXRpb246IGFic29sdXRlO1xcclxcbiAgICAgIHRvcDogMDtcXHJcXG4gICAgICBsZWZ0OiAwO1xcclxcbiAgICAgIHdpZHRoOiAxMDAlO1xcclxcbiAgICAgIGhlaWdodDogMTAwJTtcXHJcXG4gICAgICBiYWNrZ3JvdW5kOiBoc2woMCwgMCUsIDQ5JSk7XFxyXFxuICAgICAgdHJhbnNmb3JtOiBzY2FsZVgoMCk7XFxyXFxuICAgICAgdHJhbnNmb3JtLW9yaWdpbjogMTAwJSAxMDAlO1xcclxcbiAgICAgIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjZzIGN1YmljLWJlemllcigwLjUzLCAwLjIxLCAwLCAxKTtcXHJcXG4gICAgfVxcclxcblxcclxcbiAgICAmOmhvdmVyIHtcXHJcXG4gICAgICAmOmJlZm9yZSB7XFxyXFxuICAgICAgICB0cmFuc2Zvcm0tb3JpZ2luOiAwIDA7XFxyXFxuICAgICAgICB0cmFuc2Zvcm06IHNjYWxlWCgxKTtcXHJcXG4gICAgICB9XFxyXFxuXFxyXFxuICAgICAgc3BhbiB7XFxyXFxuICAgICAgICBjb2xvcjogd2hpdGU7XFxyXFxuICAgICAgfVxcclxcbiAgICB9XFxyXFxuICB9XFxyXFxuXFxyXFxuICBpbnB1dCB7XFxyXFxuICAgIHdpZHRoOiAyNDBweDtcXHJcXG4gICAgaGVpZ2h0OiAzMnB4O1xcclxcbiAgICBib3JkZXI6IG5vbmU7XFxyXFxuICAgIGJvcmRlci1yYWRpdXM6IDhweDtcXHJcXG4gICAgcGFkZGluZzogOHB4O1xcclxcbiAgICBtYXJnaW46IDBweDtcXHJcXG4gICAgZm9udC1zaXplOiAyMHB4O1xcclxcbiAgICBmb250LXdlaWdodDogYm9sZGVyO1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMjM2IDIzNiAyMzYpO1xcclxcblxcclxcbiAgICAmOmZvY3VzIHtcXHJcXG4gICAgICBvdXRsaW5lOiBub25lO1xcclxcbiAgICB9XFxyXFxuICB9XFxyXFxuXFxyXFxuICBsYWJlbCB7XFxyXFxuICAgIGZvbnQtc2l6ZTogbGFyZ2U7XFxyXFxuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgICBwYWRkaW5nOiAwIDI0cHg7XFxyXFxuXFxyXFxuICAgIGRpdiB7XFxyXFxuICAgICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xcclxcbiAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXHJcXG4gICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcblxcclxcbiAgICAgIC5idG4tZHJhdyB7XFxyXFxuICAgICAgICBwYWRkaW5nOiAxMHB4IDIwcHg7XFxyXFxuICAgICAgfVxcclxcblxcclxcbiAgICAgIC5idG4tc2VhcmNoIHtcXHJcXG4gICAgICAgIHBhZGRpbmc6IDEwcHggMjVweDtcXHJcXG5cXHJcXG4gICAgICAgIGkge1xcclxcbiAgICAgICAgICBmb250LXNpemU6IDI0cHg7XFxyXFxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xcclxcbiAgICAgICAgfVxcclxcbiAgICAgIH1cXHJcXG4gICAgfVxcclxcbiAgfVxcclxcblxcclxcbiAgLnJlc3VsdCB7XFxyXFxuICAgIGxpc3Qtc3R5bGU6IG5vbmU7XFxyXFxuICAgIHBhZGRpbmc6IDA7XFxyXFxuICAgIGJvcmRlcjogMnB4IHNvbGlkIHJnYigxODcgMTg3IDE4Nyk7XFxyXFxuICAgIG92ZXJmbG93LXg6IGhpZGRlbjtcXHJcXG4gICAgb3ZlcmZsb3cteTogc2Nyb2xsO1xcclxcbiAgICBoZWlnaHQ6IDM1MHB4O1xcclxcbiAgICBmb250LXdlaWdodDogYm9sZGVyO1xcclxcblxcclxcbiAgICA6bm90KDpsYXN0LWNoaWxkKSB7XFxyXFxuICAgICAgbGkge1xcclxcbiAgICAgICAgYm9yZGVyLWJvdHRvbTogNXB4IHNvbGlkIHJnYigxODEgMTgxIDE4MSk7XFxyXFxuICAgICAgfVxcclxcbiAgICB9XFxyXFxuXFxyXFxuICAgIGxpIHtcXHJcXG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMjQ4IDI0OCAyNDgpO1xcclxcblxcclxcbiAgICAgICY6bm90KDpsYXN0LWNoaWxkKSB7XFxyXFxuICAgICAgICBib3JkZXItYm90dG9tOiA1cHggc29saWQgcmdiKDE4MSAxODEgMTgxKTtcXHJcXG4gICAgICB9XFxyXFxuXFxyXFxuICAgICAgLnRpdGxlIHtcXHJcXG4gICAgICAgIGhlaWdodDogMjRweDtcXHJcXG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcXHJcXG4gICAgICAgIG92ZXJmbG93OiBoaWRkZW47XFxyXFxuXFxyXFxuICAgICAgICBzcGFuIHtcXHJcXG4gICAgICAgICAgZm9udC1zaXplOiAxNHB4O1xcclxcbiAgICAgICAgICBmb250LXdlaWdodDogYm9sZDtcXHJcXG4gICAgICAgICAgbWFyZ2luOiAwcHg7XFxyXFxuICAgICAgICAgIHBhZGRpbmc6IDhweCAwcHggMHB4IDEwMCU7XFxyXFxuICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXHJcXG4gICAgICAgICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcXHJcXG4gICAgICAgICAgbGluZS1oZWlnaHQ6IDFlbTtcXHJcXG4gICAgICAgICAgYW5pbWF0aW9uOiBzY3JvbGwgMTVzIGxpbmVhciBpbmZpbml0ZTtcXHJcXG5cXHJcXG4gICAgICAgICAgQGtleWZyYW1lcyBzY3JvbGwge1xcclxcbiAgICAgICAgICAgIDAlIHtcXHJcXG4gICAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgwKTtcXHJcXG4gICAgICAgICAgICB9XFxyXFxuXFxyXFxuICAgICAgICAgICAgMTAwJSB7XFxyXFxuICAgICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTEwMCUpO1xcclxcbiAgICAgICAgICAgIH1cXHJcXG4gICAgICAgICAgfVxcclxcbiAgICAgICAgfVxcclxcbiAgICAgIH1cXHJcXG5cXHJcXG4gICAgICAud3JhcHBlciB7XFxyXFxuICAgICAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IHJvdztcXHJcXG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgICAgICBwYWRkaW5nOiAxMHB4O1xcclxcblxcclxcbiAgICAgICAgaW1nIHtcXHJcXG4gICAgICAgICAgd2lkdGg6IDEzMHB4O1xcclxcbiAgICAgICAgfVxcclxcblxcclxcbiAgICAgICAgLmluZm8ge1xcclxcbiAgICAgICAgICBtYXJnaW4tbGVmdDogMjBweDtcXHJcXG5cXHJcXG4gICAgICAgICAgLm93bmVyIHtcXHJcXG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICAgICAgICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XFxyXFxuICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogNXB4O1xcclxcblxcclxcbiAgICAgICAgICAgIGltZyB7XFxyXFxuICAgICAgICAgICAgICB3aWR0aDogMzJweDtcXHJcXG4gICAgICAgICAgICAgIGhlaWdodDogMzJweDtcXHJcXG4gICAgICAgICAgICAgIG1hcmdpbi1yaWdodDogNXB4O1xcclxcbiAgICAgICAgICAgIH1cXHJcXG4gICAgICAgICAgfVxcclxcblxcclxcbiAgICAgICAgICBwIHtcXHJcXG4gICAgICAgICAgICBtYXJnaW46IGF1dG87XFxyXFxuICAgICAgICAgIH1cXHJcXG5cXHJcXG4gICAgICAgICAgZm9udC1zaXplOiAxNnB4O1xcclxcbiAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgICAgICAgfVxcclxcbiAgICAgIH1cXHJcXG4gICAgfVxcclxcbiAgfVxcclxcblxcclxcbiAgLmVycm9yIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcXHJcXG5cXHJcXG4gICAgc3BhbiB7XFxyXFxuICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcclxcbiAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcXHJcXG5cXHJcXG4gICAgICBpIHtcXHJcXG4gICAgICAgIHBhZGRpbmc6IDE2cHggMDtcXHJcXG4gICAgICAgIGZvbnQtc2l6ZTogNDhweDtcXHJcXG4gICAgICAgIGNvbG9yOiByZ2IoNTEgNTEgNTEpO1xcclxcbiAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcXHJcXG4gICAgICB9XFxyXFxuICAgIH1cXHJcXG5cXHJcXG4gICAgYSB7XFxyXFxuICAgICAgbWFyZ2luOiBhdXRvIDFlbTtcXHJcXG4gICAgICBmb250LXNpemU6IDE2cHg7XFxyXFxuICAgIH1cXHJcXG4gIH1cXHJcXG59XFxyXFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vcG9wdXAuc2Nzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3BvcHVwLnNjc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcclxuLypcclxuICAgIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIGQtY29tbWVudHMuXHJcblxyXG4gICAgZC1jb21tZW50cyBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XHJcbiAgICBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxyXG4gICAgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcclxuICAgIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXHJcblxyXG4gICAgZC1jb21tZW50cyBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxyXG4gICAgYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcclxuICAgIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcclxuICAgIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXHJcblxyXG4gICAgWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcclxuICAgIGFsb25nIHdpdGggZC1jb21tZW50cy4gIElmIG5vdCwgc2VlIDxodHRwczovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXHJcbiovXHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5nZXRPcHRpb24gPSBleHBvcnRzLmdldEFsbE9wdGlvbnMgPSBleHBvcnRzLmRlZmF1bHRPcHRpb25zID0gdm9pZCAwO1xyXG5leHBvcnRzLmRlZmF1bHRPcHRpb25zID0ge1xyXG4gICAg44Od44OD44OX44Ki44OD44OX44KS6ZaL44GE44Gf44Go44GN5pyA5b6M44Gr5YWl5Yqb44GX44Gf5YuV55S7SUTjgpLooajnpLrjgZnjgos6IHRydWUsXHJcbiAgICDjg53jg4Pjg5fjgqLjg4Pjg5fjgpLplovjgYTjgZ/jgajjgY3oh6rli5Xjgafli5XnlLvmpJzntKLjgpLplovlp4vjgZnjgos6IHRydWUsXHJcbiAgICDoh6rli5XmpJzntKLjgYznhKHlirnjga7jgajjgY3liY3lm57jga7mpJzntKLntZDmnpzjgpLooajnpLrjgZnjgos6IHRydWUsXHJcbn07XHJcbi8qKlxyXG4gKiBDaHJvbWUuc3RvcmFnZS5sb2NhbCDjgavkv53lrZjjgZXjgozjgabjgYTjgovoqK3lrprjgpLlj5blvpfjgZfjgIFjYWxsYmFjayDjgpLlkbzjgbPlh7rjgZnjgIJcclxuICogQHBhcmFtIGNhbGxiYWNrIGNhbGxiYWNrKG9wdGlvbnMpXHJcbiAqL1xyXG5jb25zdCBnZXRBbGxPcHRpb25zID0gKGNhbGxiYWNrKSA9PiB7XHJcbiAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQobnVsbCwgKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIE9iamVjdC5rZXlzKGV4cG9ydHMuZGVmYXVsdE9wdGlvbnMpLm1hcCgoa2V5KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHRba2V5XSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IGV4cG9ydHMuZGVmYXVsdE9wdGlvbnNba2V5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5rZXlzKHJlc3VsdCkubWFwKChrZXkpID0+IHtcclxuICAgICAgICAgICAgaWYgKCEoa2V5IGluIGV4cG9ydHMuZGVmYXVsdE9wdGlvbnMpKSB7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgcmVzdWx0W2tleV07XHJcbiAgICAgICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5yZW1vdmUoa2V5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBjYWxsYmFjayhyZXN1bHQpO1xyXG4gICAgfSk7XHJcbn07XHJcbmV4cG9ydHMuZ2V0QWxsT3B0aW9ucyA9IGdldEFsbE9wdGlvbnM7XHJcbi8qKlxyXG4gKiDoqK3lrprjgpLlj5blvpfjgZfjgIFDYWxsYmFjayDjgpLlkbzjgbPlh7rjgZlcclxuICogQHBhcmFtIGtleSDoqK3lrprjgq3jg7xcclxuICogQHBhcmFtIGNhbGxiYWNrIOioreWumuWApOOCkuWPluW+l+OBl+OBn+W+jOOBq+WRvOOBsOOCjOOCi+mWouaVsFxyXG4gKi9cclxuY29uc3QgZ2V0T3B0aW9uID0gKGtleSwgY2FsbGJhY2spID0+IHtcclxuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChrZXksIChyZXN1bHQpID0+IHtcclxuICAgICAgICBjYWxsYmFjayhyZXN1bHRba2V5XSA/PyBleHBvcnRzLmRlZmF1bHRPcHRpb25zW2tleV0pO1xyXG4gICAgfSk7XHJcbn07XHJcbmV4cG9ydHMuZ2V0T3B0aW9uID0gZ2V0T3B0aW9uO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuLypcclxuICAgIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIGQtY29tbWVudHMuXHJcblxyXG4gICAgZC1jb21tZW50cyBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XHJcbiAgICBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxyXG4gICAgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcclxuICAgIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXHJcblxyXG4gICAgZC1jb21tZW50cyBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxyXG4gICAgYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcclxuICAgIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcclxuICAgIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXHJcblxyXG4gICAgWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcclxuICAgIGFsb25nIHdpdGggZC1jb21tZW50cy4gIElmIG5vdCwgc2VlIDxodHRwczovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXHJcbiovXHJcbnZhciBfX2NyZWF0ZUJpbmRpbmcgPSAodGhpcyAmJiB0aGlzLl9fY3JlYXRlQmluZGluZykgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobSwgayk7XHJcbiAgICBpZiAoIWRlc2MgfHwgKFwiZ2V0XCIgaW4gZGVzYyA/ICFtLl9fZXNNb2R1bGUgOiBkZXNjLndyaXRhYmxlIHx8IGRlc2MuY29uZmlndXJhYmxlKSkge1xyXG4gICAgICBkZXNjID0geyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9O1xyXG4gICAgfVxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCBkZXNjKTtcclxufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBvW2syXSA9IG1ba107XHJcbn0pKTtcclxudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19zZXRNb2R1bGVEZWZhdWx0KSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgXCJkZWZhdWx0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHYgfSk7XHJcbn0pIDogZnVuY3Rpb24obywgdikge1xyXG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xyXG59KTtcclxudmFyIF9faW1wb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnRTdGFyKSB8fCBmdW5jdGlvbiAobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xyXG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn07XHJcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgcmVhY3RfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwicmVhY3RcIikpO1xyXG5jb25zdCBSZWFjdERPTSA9IF9faW1wb3J0U3RhcihyZXF1aXJlKFwicmVhY3QtZG9tL2NsaWVudFwiKSk7XHJcbmNvbnN0IFN0b3JhZ2UgPSBfX2ltcG9ydFN0YXIocmVxdWlyZShcIi4uL2NvbnRlbnRfc2NyaXB0L2xvY2FsU3RvcmFnZVwiKSk7XHJcbnJlcXVpcmUoXCIuL3BvcHVwLnNjc3NcIik7XHJcbmNvbnN0IFBvcHVwID0gKCkgPT4ge1xyXG4gICAgY29uc3QgW21vdmllSWQsIHNldE1vdmllSWRdID0gcmVhY3RfMS5kZWZhdWx0LnVzZVN0YXRlKFwiXCIpO1xyXG4gICAgY29uc3QgW3dvcmQsIHNldFdvcmRdID0gcmVhY3RfMS5kZWZhdWx0LnVzZVN0YXRlKFwiXCIpO1xyXG4gICAgY29uc3QgW3Jlc3VsdCwgc2V0UmVzdWx0XSA9IHJlYWN0XzEuZGVmYXVsdC51c2VTdGF0ZSgpO1xyXG4gICAgY29uc3QgW293bmVyLCBzZXRPd25lcl0gPSByZWFjdF8xLmRlZmF1bHQudXNlU3RhdGUoKTtcclxuICAgIGNvbnN0IFtpc0FjdGl2ZSwgc2V0SXNBY3RpdmVdID0gcmVhY3RfMS5kZWZhdWx0LnVzZVN0YXRlKGZhbHNlKTtcclxuICAgIC8qKlxyXG4gICAgICog5L2c5ZOB6KaW6IG044Oa44O844K444GL5Yik5a6aXHJcbiAgICAgKiBAcGFyYW0gaHJlZiB3aW5kb3cubG9jYXRpb24uaHJlZlxyXG4gICAgICogQHJldHVybnMgYm9vbGVhblxyXG4gICAgICovXHJcbiAgICBjb25zdCBpc1dhdGNoUGFnZSA9IChocmVmKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGhyZWYubWF0Y2goL2h0dHBzOlxcL1xcL2FuaW1lc3RvcmVcXC5kb2NvbW9cXC5uZVxcLmpwXFwvYW5pbWVzdG9yZVxcL3NjX2RfcGNcXD9wYXJ0SWQ9XFxkKy8pXHJcbiAgICAgICAgICAgID8gdHJ1ZVxyXG4gICAgICAgICAgICA6IGZhbHNlO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICog6KaW6IG044Oa44O844K444Gn44Kz44Oh44Oz44OI44KS6KGo56S644GZ44KLXHJcbiAgICAgKi9cclxuICAgIGNvbnN0IHNlbmRNZXNzYWdlID0gKCkgPT4ge1xyXG4gICAgICAgIGNocm9tZS50YWJzLnF1ZXJ5KHsgYWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlIH0sICh0YWJzKSA9PiB7XHJcbiAgICAgICAgICAgIGlzV2F0Y2hQYWdlKHRhYnNbMF0/LnVybCA/PyBcIlwiKSAmJlxyXG4gICAgICAgICAgICAgICAgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFic1swXS5pZCwge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwic2hvd0NvbW1lbnRzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgbW92aWVJZDogbW92aWVJZCxcclxuICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBjb25zdCBoYW5kbGVyID0gKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKFwibW92aWVJZFwiLCB2YWx1ZSk7XHJcbiAgICAgICAgc2V0TW92aWVJZCh2YWx1ZSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiDli5XnlLvmipXnqL/ogIXjga7lkI3liY3jgIHjgqLjgqTjgrPjg7NVUkzjgpLlj5blvpdcclxuICAgICAqIEBwYXJhbSBjb250ZW50SWQg5YuV55S7SURcclxuICAgICAqIEBwYXJhbSBvd25lcklkIOODpuODvOOCtuODvElEIOOBvuOBn+OBryDjg4Hjg6Pjg7Pjg43jg6tJRFxyXG4gICAgICogQHBhcmFtIGlzVXNlciDjg6bjg7zjgrbjg7zjgYvjg4Hjg6Pjg7Pjg43jg6vjgYtcclxuICAgICAqIEByZXR1cm5zIOWLleeUu+aKleeov+iAheOBruWQjeWJjeOAgeOCouOCpOOCs+ODs1VSTFxyXG4gICAgICovXHJcbiAgICBjb25zdCBnZXRPd25lckluZm8gPSAoY29udGVudElkLCBvd25lcklkLCBpc1VzZXIpID0+IHtcclxuICAgICAgICBjb25zdCByZXMgPSBbXTtcclxuICAgICAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7XHJcbiAgICAgICAgICAgIHR5cGU6IGlzVXNlciA/IFwidXNlclwiIDogXCJjaGFubmVsXCIsXHJcbiAgICAgICAgICAgIGlkOiBvd25lcklkLFxyXG4gICAgICAgICAgICBVc2VyQWdlbnQ6IG5hdmlnYXRvci51c2VyQWdlbnQgPz8gXCJcIixcclxuICAgICAgICB9LCAocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLm1ldGEuc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNldE93bmVySW5mbyA9IGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRJZDogY29udGVudElkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvd25lcklkOiBvd25lcklkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvd25lck5hbWU6IGlzVXNlclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyByZXNwb25zZS5kYXRhLnVzZXIubmlja25hbWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogcmVzcG9uc2UuZGF0YS5jaGFubmVsLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG93bmVySWNvblVybDogaXNVc2VyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHJlc3BvbnNlLmRhdGEudXNlci5pY29ucy5zbWFsbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiByZXNwb25zZS5kYXRhLmNoYW5uZWwudGh1bWJuYWlsU21hbGxVcmwsXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgc2V0T3duZXJJbmZvKCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0T3duZXIoKG93bmVyKSA9PiAob3duZXIgPyBbLi4ub3duZXIsIC4uLnJlc10gOiByZXMpKTtcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJvd25lclwiLCBKU09OLnN0cmluZ2lmeShyZXMgPz8gW10pKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIOOCueODiuODg+ODl+OCt+ODp+ODg+ODiEFQSeOCkuS9v+OBo+OBpuOCreODvOODr+ODvOODieOBp+WLleeUu+OCkuaknOe0olxyXG4gICAgICogQHBhcmFtIHdvcmQg44Kt44O844Ov44O844OJXHJcbiAgICAgKiBAcmV0dXJucyDli5XnlLvmg4XloLFcclxuICAgICAqIEBzZWUgaHR0cHM6Ly9zaXRlLm5pY292aWRlby5qcC9zZWFyY2gtYXBpLWRvY3Mvc25hcHNob3RcclxuICAgICAqL1xyXG4gICAgY29uc3Qgc2VhcmNoID0gYXN5bmMgKHdvcmQpID0+IHtcclxuICAgICAgICBjaHJvbWUudGFicy5xdWVyeSh7IGFjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZSB9LCAodGFicykgPT4ge1xyXG4gICAgICAgICAgICBpc1dhdGNoUGFnZSh0YWJzWzBdPy51cmwgPz8gXCJcIikgJiZcclxuICAgICAgICAgICAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInNlYXJjaFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHdvcmQ6IHdvcmQsXHJcbiAgICAgICAgICAgICAgICAgICAgVXNlckFnZW50OiBuYXZpZ2F0b3IudXNlckFnZW50ID8/IFwiXCIsXHJcbiAgICAgICAgICAgICAgICB9LCAocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIuaknOe0oue1kOaenFwiLCByZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKFwic2VhcmNoUmVzdWx0XCIsIEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0UmVzdWx0KHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5kYXRhLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNVc2VyID0gaXRlbS51c2VySWQgPyB0cnVlIDogZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldE93bmVySW5mbyhpdGVtLmNvbnRlbnRJZCwgaXNVc2VyID8gaXRlbS51c2VySWQgOiBpdGVtLmNoYW5uZWxJZCwgaXNVc2VyID8gdHJ1ZSA6IGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIHJlYWN0XzEuZGVmYXVsdC51c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGluaXQgPSAodGl0bGUpID0+IHtcclxuICAgICAgICAgICAgU3RvcmFnZS5nZXRPcHRpb24oXCLjg53jg4Pjg5fjgqLjg4Pjg5fjgpLplovjgYTjgZ/jgajjgY3mnIDlvozjgavlhaXlipvjgZfjgZ/li5XnlLtJROOCkuihqOekuuOBmeOCi1wiLCAodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldE1vdmllSWQod2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibW92aWVJZFwiKSA/PyBcIlwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIFN0b3JhZ2UuZ2V0T3B0aW9uKFwi44Od44OD44OX44Ki44OD44OX44KS6ZaL44GE44Gf44Go44GN6Ieq5YuV44Gn5YuV55S75qSc57Si44KS6ZaL5aeL44GZ44KLXCIsICh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0V29yZCh0aXRsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoKHRpdGxlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIFN0b3JhZ2UuZ2V0T3B0aW9uKFwi6Ieq5YuV5qSc57Si44GM54Sh5Yq544Gu44Go44GN5YmN5Zue44Gu5qSc57Si57WQ5p6c44KS6KGo56S644GZ44KLXCIsICh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFJlc3VsdChKU09OLnBhcnNlKHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNlYXJjaFJlc3VsdFwiKSA/PyBcIlwiKSA/PyBcIlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldE93bmVyKEpTT04ucGFyc2Uod2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKFwib3duZXJcIikgPz8gXCJcIikgPz8gXCJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjaHJvbWUudGFicy5xdWVyeSh7IGFjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZSB9LCAodGFicykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0YWJzWzBdPy51cmwpO1xyXG4gICAgICAgICAgICBpc1dhdGNoUGFnZSh0YWJzWzBdPy51cmwgPz8gXCJcIilcclxuICAgICAgICAgICAgICAgID8gKHNldElzQWN0aXZlKHRydWUpLCBpbml0KHRhYnNbMF0/LnRpdGxlID8/IFwiXCIpKVxyXG4gICAgICAgICAgICAgICAgOiBzZXRJc0FjdGl2ZShmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LCBbXSk7XHJcbiAgICByZXR1cm4gKHJlYWN0XzEuZGVmYXVsdC5jcmVhdGVFbGVtZW50KHJlYWN0XzEuZGVmYXVsdC5GcmFnbWVudCwgbnVsbCxcclxuICAgICAgICByZWFjdF8xLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcImFcIiwgeyBocmVmOiBcIm9wdGlvbnMuaHRtbFwiLCBjbGFzc05hbWU6IFwiYnRuLW9wdGlvblwiLCB0YXJnZXQ6IFwiX2JsYW5rXCIsIHJlbDogXCJub29wZW5lciBub3JlZmVycmVyXCIgfSxcclxuICAgICAgICAgICAgcmVhY3RfMS5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICByZWFjdF8xLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcImlcIiwgeyBjbGFzc05hbWU6IFwiY29kaWNvbiBjb2RpY29uLXNldHRpbmdzLWdlYXJcIiB9KSkpLFxyXG4gICAgICAgIGlzQWN0aXZlID8gKHJlYWN0XzEuZGVmYXVsdC5jcmVhdGVFbGVtZW50KHJlYWN0XzEuZGVmYXVsdC5GcmFnbWVudCwgbnVsbCxcclxuICAgICAgICAgICAgcmVhY3RfMS5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgcmVhY3RfMS5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJcXHU1MkQ1XFx1NzUzQklEXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVhY3RfMS5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHsgaHJlZjogXCJodHRwczovL2RpYy5uaWNvdmlkZW8uanAvYS9pZFwiLCB0YXJnZXQ6IFwiX2JsYW5rXCIsIHJlbDogXCJub29wZW5lciBub3JlZmVycmVyXCIgfSwgXCJcXHUzMDEwXFx1OEE3M1xcdTdEMzBcXHUzMDExXCIpKSxcclxuICAgICAgICAgICAgICAgIHJlYWN0XzEuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVhY3RfMS5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7IHZhbHVlOiBtb3ZpZUlkLCBvbkNoYW5nZTogKGUpID0+IGhhbmRsZXIoZS50YXJnZXQudmFsdWUpIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlYWN0XzEuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7IGNsYXNzTmFtZTogXCJidG4gYnRuLWRyYXdcIiwgb25DbGljazogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VuZE1lc3NhZ2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSB9LCBcIlxcdTg4NjhcXHU3OTNBXCIpKSksXHJcbiAgICAgICAgICAgIHJlYWN0XzEuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIiwgbnVsbCxcclxuICAgICAgICAgICAgICAgIHJlYWN0XzEuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwicFwiLCBudWxsLCBcIlxcdTY5MUNcXHU3RDIyXFx1MzBFRlxcdTMwRkNcXHUzMEM5XCIpLFxyXG4gICAgICAgICAgICAgICAgcmVhY3RfMS5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICByZWFjdF8xLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHsgdmFsdWU6IHdvcmQsIG9uQ2hhbmdlOiAoZSkgPT4gc2V0V29yZChlLnRhcmdldC52YWx1ZSkgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgcmVhY3RfMS5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHsgY2xhc3NOYW1lOiBcImJ0biBidG4tc2VhcmNoXCIsIG9uQ2xpY2s6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlYXJjaCh3b3JkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWFjdF8xLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlYWN0XzEuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwiaVwiLCB7IGNsYXNzTmFtZTogXCJjb2RpY29uIGNvZGljb24tc2VhcmNoXCIgfSkpKSkpLFxyXG4gICAgICAgICAgICByZWFjdF8xLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcInVsXCIsIHsgY2xhc3NOYW1lOiBcInJlc3VsdFwiIH0sIHJlc3VsdD8ubWV0YT8uc3RhdHVzID09PSAyMDAgJiZcclxuICAgICAgICAgICAgICAgIHJlc3VsdD8uZGF0YT8ubWFwKChpdGVtLCBpbmRleCkgPT4gKHJlYWN0XzEuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwibGlcIiwgeyBrZXk6IGluZGV4LCBvbkNsaWNrOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXIoaXRlbS5jb250ZW50SWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gfSxcclxuICAgICAgICAgICAgICAgICAgICByZWFjdF8xLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcImFcIiwgeyBjbGFzc05hbWU6IFwidGl0bGVcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWFjdF8xLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgbnVsbCwgaXRlbS50aXRsZSkpLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlYWN0XzEuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcIndyYXBwZXJcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWFjdF8xLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcImltZ1wiLCB7IHNyYzogaXRlbS50aHVtYm5haWxVcmwsIGFsdDogaXRlbS50aXRsZSB9KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVhY3RfMS5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiaW5mb1wiIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWFjdF8xLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcInBcIiwgbnVsbCwgXCJcXHU1MkQ1XFx1NzUzQlxcdTYwQzVcXHU1ODMxXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3duZXI/Lm1hcCgob3duZXJJdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG93bmVySXRlbS5jb250ZW50SWQgPT09IGl0ZW0uY29udGVudElkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAocmVhY3RfMS5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwib3duZXJcIiwga2V5OiBvd25lckl0ZW0ub3duZXJJZCB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVhY3RfMS5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIiwgeyBzcmM6IG93bmVySXRlbS5vd25lckljb25VcmwsIGFsdDogb3duZXJJdGVtLm93bmVyTmFtZSB9KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlYWN0XzEuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwicFwiLCBudWxsLCBvd25lckl0ZW0ub3duZXJOYW1lKSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVhY3RfMS5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHU1MThEXFx1NzUxRlxcdTY1NzBcXHUyMDAzXFx1MjAwM1xcdTAwQTA6XFx1MDBBMFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0udmlld0NvdW50ZXIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVhY3RfMS5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHUzMEIzXFx1MzBFMVxcdTMwRjNcXHUzMEM4XFx1NjU3MFxcdTAwQTA6XFx1MDBBMFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uY29tbWVudENvdW50ZXIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVhY3RfMS5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHU1MkQ1XFx1NzUzQlxcdTMwNkVcXHU1QzNBXFx1MjAwM1xcdTAwQTA6XFx1MDBBMFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoaXRlbS5sZW5ndGhTZWNvbmRzIC8gMzYwMCkgPiAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gYCR7TWF0aC5mbG9vcihpdGVtLmxlbmd0aFNlY29uZHMgLyAzNjAwKX3mmYLplpNgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLmZsb29yKGl0ZW0ubGVuZ3RoU2Vjb25kcyAvIDYwKSA+IDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBgJHtNYXRoLmZsb29yKGl0ZW0ubGVuZ3RoU2Vjb25kcyAvIDYwKX3liIZgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmxlbmd0aFNlY29uZHMgJSA2MCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlxcdTc5RDJcIikpKSkpKSkpKSA6IChyZWFjdF8xLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcInBcIiwgeyBjbGFzc05hbWU6IFwiZXJyb3JcIiB9LFxyXG4gICAgICAgICAgICByZWFjdF8xLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgeyBjbGFzc05hbWU6IFwiaW5uZXJcIiB9LFxyXG4gICAgICAgICAgICAgICAgcmVhY3RfMS5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJpXCIsIHsgY2xhc3NOYW1lOiBcImNvZGljb24gY29kaWNvbi1pbmZvXCIgfSkpLFxyXG4gICAgICAgICAgICByZWFjdF8xLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcImFcIiwgbnVsbCwgXCJcXHU3M0ZFXFx1NTcyOFxcdTRGN0ZcXHU3NTI4XFx1NEUyRFxcdTMwNkVcXHUzMEJGXFx1MzBENlxcdTMwNjdcXHUzMDZGXFx1NEY3RlxcdTc1MjhcXHUzMDY3XFx1MzA0RFxcdTMwN0VcXHUzMDVCXFx1MzA5M1xcdTMwMDJcIikpKSkpO1xyXG59O1xyXG5jb25zdCByb290ID0gUmVhY3RET00uY3JlYXRlUm9vdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvb3RcIikpO1xyXG5yb290LnJlbmRlcihyZWFjdF8xLmRlZmF1bHQuY3JlYXRlRWxlbWVudChQb3B1cCwgbnVsbCkpO1xyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHRsb2FkZWQ6IGZhbHNlLFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcblx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0dmFyIHIgPSBmbigpO1xuXHRcdFx0aWYgKHIgIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5tZCA9IChtb2R1bGUpID0+IHtcblx0bW9kdWxlLnBhdGhzID0gW107XG5cdGlmICghbW9kdWxlLmNoaWxkcmVuKSBtb2R1bGUuY2hpbGRyZW4gPSBbXTtcblx0cmV0dXJuIG1vZHVsZTtcbn07IiwidmFyIHNjcmlwdFVybDtcbmlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLmcuaW1wb3J0U2NyaXB0cykgc2NyaXB0VXJsID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmxvY2F0aW9uICsgXCJcIjtcbnZhciBkb2N1bWVudCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5kb2N1bWVudDtcbmlmICghc2NyaXB0VXJsICYmIGRvY3VtZW50KSB7XG5cdGlmIChkb2N1bWVudC5jdXJyZW50U2NyaXB0KVxuXHRcdHNjcmlwdFVybCA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQuc3JjXG5cdGlmICghc2NyaXB0VXJsKSB7XG5cdFx0dmFyIHNjcmlwdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKTtcblx0XHRpZihzY3JpcHRzLmxlbmd0aCkgc2NyaXB0VXJsID0gc2NyaXB0c1tzY3JpcHRzLmxlbmd0aCAtIDFdLnNyY1xuXHR9XG59XG4vLyBXaGVuIHN1cHBvcnRpbmcgYnJvd3NlcnMgd2hlcmUgYW4gYXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCB5b3UgbXVzdCBzcGVjaWZ5IGFuIG91dHB1dC5wdWJsaWNQYXRoIG1hbnVhbGx5IHZpYSBjb25maWd1cmF0aW9uXG4vLyBvciBwYXNzIGFuIGVtcHR5IHN0cmluZyAoXCJcIikgYW5kIHNldCB0aGUgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gdmFyaWFibGUgZnJvbSB5b3VyIGNvZGUgdG8gdXNlIHlvdXIgb3duIGxvZ2ljLlxuaWYgKCFzY3JpcHRVcmwpIHRocm93IG5ldyBFcnJvcihcIkF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyXCIpO1xuc2NyaXB0VXJsID0gc2NyaXB0VXJsLnJlcGxhY2UoLyMuKiQvLCBcIlwiKS5yZXBsYWNlKC9cXD8uKiQvLCBcIlwiKS5yZXBsYWNlKC9cXC9bXlxcL10rJC8sIFwiL1wiKTtcbl9fd2VicGFja19yZXF1aXJlX18ucCA9IHNjcmlwdFVybDsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmIgPSBkb2N1bWVudC5iYXNlVVJJIHx8IHNlbGYubG9jYXRpb24uaHJlZjtcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcInBvcHVwXCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbl9fd2VicGFja19yZXF1aXJlX18uTy5qID0gKGNodW5rSWQpID0+IChpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPT09IDApO1xuXG4vLyBpbnN0YWxsIGEgSlNPTlAgY2FsbGJhY2sgZm9yIGNodW5rIGxvYWRpbmdcbnZhciB3ZWJwYWNrSnNvbnBDYWxsYmFjayA9IChwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbiwgZGF0YSkgPT4ge1xuXHR2YXIgW2NodW5rSWRzLCBtb3JlTW9kdWxlcywgcnVudGltZV0gPSBkYXRhO1xuXHQvLyBhZGQgXCJtb3JlTW9kdWxlc1wiIHRvIHRoZSBtb2R1bGVzIG9iamVjdCxcblx0Ly8gdGhlbiBmbGFnIGFsbCBcImNodW5rSWRzXCIgYXMgbG9hZGVkIGFuZCBmaXJlIGNhbGxiYWNrXG5cdHZhciBtb2R1bGVJZCwgY2h1bmtJZCwgaSA9IDA7XG5cdGlmKGNodW5rSWRzLnNvbWUoKGlkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2lkXSAhPT0gMCkpKSB7XG5cdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG5cdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8obW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm1bbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihydW50aW1lKSB2YXIgcmVzdWx0ID0gcnVudGltZShfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblx0fVxuXHRpZihwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbikgcGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24oZGF0YSk7XG5cdGZvcig7aSA8IGNodW5rSWRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y2h1bmtJZCA9IGNodW5rSWRzW2ldO1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhpbnN0YWxsZWRDaHVua3MsIGNodW5rSWQpICYmIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSkge1xuXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKCk7XG5cdFx0fVxuXHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDA7XG5cdH1cblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uTyhyZXN1bHQpO1xufVxuXG52YXIgY2h1bmtMb2FkaW5nR2xvYmFsID0gc2VsZltcIndlYnBhY2tDaHVua2RfY29tbWVudHNcIl0gPSBzZWxmW1wid2VicGFja0NodW5rZF9jb21tZW50c1wiXSB8fCBbXTtcbmNodW5rTG9hZGluZ0dsb2JhbC5mb3JFYWNoKHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgMCkpO1xuY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIGNodW5rTG9hZGluZ0dsb2JhbC5wdXNoLmJpbmQoY2h1bmtMb2FkaW5nR2xvYmFsKSk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5uYyA9IHVuZGVmaW5lZDsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGRlcGVuZHMgb24gb3RoZXIgbG9hZGVkIGNodW5rcyBhbmQgZXhlY3V0aW9uIG5lZWQgdG8gYmUgZGVsYXllZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8odW5kZWZpbmVkLCBbXCJ2ZW5kb3JcIl0sICgpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvcG9wdXAvcG9wdXAudHN4XCIpKSlcbl9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8oX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=