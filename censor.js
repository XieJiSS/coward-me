const config = require("./config");
const checkOnline = require("./wordChecker")(config);
const checkOffline = require("./checkSensitive");

async function main() {
  const text = process.argv[2] || "";
  const checkOnlinePm = checkOnline.checkSpam(text);
  const checkOfflinePm = checkOffline(text);
  const result = await Promise.all([ checkOnlinePm, checkOfflinePm ]);
  console.log("aliyun :", result[0]);
  console.log("local  :", result[1]);
}

main();
