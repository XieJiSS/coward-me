const fs = require("fs");

const config = require("./config");
const checkOnline = require("./wordChecker")(config);
const checkOffline = require("./checkSensitive");

async function main() {
  const text = process.argv[2] || fs.readFileSync(0).toString("utf-8").trim() || "Empty String";
  const checkOnlinePm = checkOnline.checkSpam(text);
  const checkOfflinePm = checkOffline(text);
  const result = await Promise.all([ checkOnlinePm, checkOfflinePm ]);
  console.log("aliyun :", result[0]);
  console.log("local  :", result[1]);
}

main();
