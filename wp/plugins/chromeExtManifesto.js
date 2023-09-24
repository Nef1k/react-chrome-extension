const path = require("path");
const fs = require("fs");
const utils = require("../utils");
const {contentScripts} = require("../../extenstion.config");

const pluginName = "ChromeExtManifesto";

class ChromeExtManifesto {
  constructor({extensionInfo, minify = true}) {
    this.extention = extensionInfo;
    this.contentScripts = extensionInfo.contentScripts;
    this.minify = minify;

    this.manifestTargetPath = null;
    this.scriptsMapping = {};
  }

  apply(compiler) {
    compiler.hooks.assetEmitted.tap(pluginName, (fileName, fileData) => {
      const srcName = path.basename(fileName.toString());
      const cfgName = path.basename(this.extention.paths.manifest);
      if (srcName === cfgName) {
        this.manifestTargetPath = fileData.targetPath;
        return;
      }

      const isContentScript = utils.isContentScript(fileName, this.contentScripts);
      if (!isContentScript || path.extname(fileName) !== '.js') {
        return;
      }

      const scriptName = utils.getCsNameFromFileName(fileName);
      const csConfig = this.contentScripts[scriptName];

      csConfig.scripts.forEach((cfgScriptPath) => {
        const absCfgScript = path.resolve(cfgScriptPath);
        const entries = fileData.compilation.options.entry;

        let currentEntryName = Object.keys(entries).filter((entryName) => {
          const nameIncluded = fileName.includes(entryName);
          return nameIncluded;
        });
        if (currentEntryName && currentEntryName.length > 0) {
          currentEntryName = currentEntryName[0];
        } else {
          return;
        }
        const currentEntry = path.resolve(entries[currentEntryName].import[0]);

        if (currentEntry === absCfgScript) {
          this.scriptsMapping[cfgScriptPath] = fileName;
        }
      });
    });

    compiler.hooks.done.tap(pluginName, (compiler) => {
      // compiler.hooks.assetEmitted.tap(pluginName, (file, fileData) => {

      const manifestData = JSON.parse(fs.readFileSync(this.manifestTargetPath, 'utf-8'));

      // Change manifest data
      // console.log(this.foundScripts);
      manifestData.content_scripts = Object.keys(this.contentScripts).map((csName) => {
        const csData = this.contentScripts[csName];
        csData.js = csData.scripts.map((srcScriptPath) => this.scriptsMapping[srcScriptPath]);
        delete csData.scripts;

        return csData;
      });

      const serializedManifest = JSON.stringify(manifestData, null, this.minify ? 0 : 2);
      fs.writeFileSync(this.manifestTargetPath, serializedManifest);
      // });
    })
  }
}

module.exports = ChromeExtManifesto
