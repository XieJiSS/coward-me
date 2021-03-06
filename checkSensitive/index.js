const cp = require("child_process");
const { promisify } = require("util");
const execFile = promisify(cp.execFile);

/**
 * @param {string} rawText
 */
async function main(rawText) {
  const text = (rawText || "").substr(0, 3000);
  const { stdout, stderr } = await execFile("/usr/bin/env", ["python2", `${__dirname}/src/sensitiveApi.py`, `${text}`]);
  if(stderr) console.error("sensitiveApi.py:", stderr);
  /**
   * @type {{
      sensitive: boolean;
      action: string;
      replaced: string;
      badwords: string[];
    }}
   */
  const obj = {
    sensitive: false,
    action: "通过",
    replaced: text,
    badwords: [],
  };
  try {
    const _obj = JSON.parse(stdout);
    obj.sensitive = _obj.sensitive;
    obj.action = _obj.action;
    obj.replaced = _obj.replaced;
    if(_obj.badwords) obj.badwords = _obj.badwords;
  } catch (err) {
    console.error("failed to parse JSON generated from sensitiveApi.py:", stdout);
  }
  return obj;
}

module.exports = main;
