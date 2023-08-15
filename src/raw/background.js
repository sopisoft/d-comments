"use strict";

(async function () {
	await import(chrome.runtime.getURL("js/background.js"));
})();
