const cp = require("child_process");
const { promisify } = require("util");
const exec = promisify(cp.exec);

async function main(text) {
  const { stdout, stderr } = await exec(`python2 "${__dirname}/src/sensitiveApi.py" "${text}"`);
  if(stderr) console.error("sensitiveApi.py:", stderr);
  const obj = {
    sensitive: false,
    action: '通过',
    replaced: text,
  };
  try {
    const _obj = JSON.parse(stdout);
    obj.sensitive = _obj.sensitive;
    obj.action = _obj.action;
    obj.replaced = _obj.replaced;
  } catch (err) {
    console.error("failed to parse JSON generated from sensitiveApi.py:", stdout);
  }
  return obj;
}

module.exports = main;
