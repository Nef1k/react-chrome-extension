module.exports = {
  paths: {
    manifest: "public/manifest.json",

    optionsEntry: "src/options.js",
    popupEntry: "src/popup.js",
    serviceWorkerEntry: "src/serviceWorker.js",

    optionsHtml: "public/options.html",
    popupHtml: "public/popup.html",

    distDirName: "dist",
  },
  contentScripts: {
    default: {
      scripts: [
        "./src/contentScripts/default.js",
      ],
      matches: [
        "https://warchestonline.com/game/*",
      ],
    },
  },
}
