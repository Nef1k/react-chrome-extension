function capitalize(s) {
  return (
    s.toString().charAt(0).toUpperCase()
    + s.toString().slice(1)
  );
}

function firstLower(s) {
  return (
    s.toString().charAt(0).toLowerCase()
    + s.toString().slice(1)
  );
}

function entriesFromContentScripts(contentScripts) {
  const rawEntries = [];  // Entries like [scriptName, scriptPath]

  for (let csConfigName in contentScripts) {
    const csConfig = contentScripts[csConfigName];
    const csBaseEntryName = capitalize(csConfigName);

    for (let scriptPathIdx in csConfig.scripts) {
      const key = `cs${csBaseEntryName}_${scriptPathIdx}`;
      rawEntries.push([
        key,
        csConfig.scripts[scriptPathIdx],
      ])
    }
  }

  return Object.fromEntries(rawEntries);
}

function getCsNameFromFileName(csName) {
  const pattern = /cs([a-zA-Z\d]+)_(\d+)/;
  let result = csName.toString().match(pattern);
  if (!result) {
    return null
  }
  return firstLower(result[1]);
}

function isContentScript(fileName, contentScripts) {
  if (fileName.length < 3) {
    return false;
  }

  const csConfigName = getCsNameFromFileName(fileName);
  if (!csConfigName) {
    return false;
  }

  return contentScripts.hasOwnProperty(csConfigName);
}

module.exports = {
  capitalize,
  firstLower,
  entriesFromContentScripts,
  getCsNameFromFileName,
  isContentScript,
}
