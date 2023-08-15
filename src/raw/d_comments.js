"use strict";

(async function () {
	await import(chrome.runtime.getURL("js/index.js"));
})();
