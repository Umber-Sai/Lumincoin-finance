/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/scripts/app.js":
/*!****************************!*\
  !*** ./src/scripts/app.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _router_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./router.js */ \"./src/scripts/router.js\");\n\n\nclass App {\n  constructor () {\n      this.router = new _router_js__WEBPACK_IMPORTED_MODULE_0__.Router();\n      window.addEventListener('DOMContentLoaded', this.handlerRouteChanging.bind(this));\n      window.addEventListener('popstate', this.handlerRouteChanging.bind(this));\n  }\n\n  handlerRouteChanging () {\n      this.router.openRoute();\n  }\n}\n\n(new App())\n\n//# sourceURL=webpack://frontend/./src/scripts/app.js?");

/***/ }),

/***/ "./src/scripts/components/login.js":
/*!*****************************************!*\
  !*** ./src/scripts/components/login.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Login: () => (/* binding */ Login)\n/* harmony export */ });\n\nclass Login {\n    constructor() {\n        alert('login')\n    }\n}\n\n//# sourceURL=webpack://frontend/./src/scripts/components/login.js?");

/***/ }),

/***/ "./src/scripts/router.js":
/*!*******************************!*\
  !*** ./src/scripts/router.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Router: () => (/* binding */ Router)\n/* harmony export */ });\n/* harmony import */ var _components_login_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/login.js */ \"./src/scripts/components/login.js\");\n\n\nclass Router {\n    constructor () {\n        this.routes = [\n            {\n                name : 'Вход в систему',\n                rout : '#/signin',\n                style : 'styles/signin.css',\n                template : 'templates/signin.html',\n                load : () => {\n\n                }\n            },\n            {\n                name : 'Регистрация',\n                rout : '#/login',\n                style : 'styles/login.css',\n                template : 'templates/login.html',\n                load : () => {\n                    new _components_login_js__WEBPACK_IMPORTED_MODULE_0__.Login()\n                }\n            }\n        ]\n    }\n\n    openRoute () {\n        const urlRoute = window.location.hash.split('?')[0];\n        \n        const newRout = this.routes.find(item => item.rout === urlRoute);\n        if (!newRout) window.location.href = '#/'\n\n    }\n}\n\n//# sourceURL=webpack://frontend/./src/scripts/router.js?");

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
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
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
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/scripts/app.js");
/******/ 	
/******/ })()
;