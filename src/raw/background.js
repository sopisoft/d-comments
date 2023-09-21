(async function () {
  // eslint-disable-next-line no-undef
  await import(chrome.runtime.getURL("js/background.js"));
})();
