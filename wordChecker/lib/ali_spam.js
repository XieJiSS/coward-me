"use strict";

const green = require("./ali_green.js");
const { keyWordReasonMap } = require("../constant/type_map.js");

class AliSpam {
  constructor(configs) {
    const _default = {
      greenVersion: "2017-01-12",
      path: "/green/text/scan",
      hostname: "green.cn-shanghai.aliyuncs.com"
    };
    if (!configs.accessKeyId || !configs.accessKeySecret) {
      throw new Error("config filed accessKeyId && accessKeySecret missed");
    }
    this.config = Object.assign(_default, configs);
  }

  checkSpam(text, options = {}) {
    options = typeof options === "string" ? { userID: options } : options;
    const tasks = [
      {
        content: text,
        dataId: options.userID,
        time: Date.now()
      }
    ];

    const requestBody = JSON.stringify({
      bizType: options.bizType,
      scenes: [ "antispam" ],
      tasks
    });

    const params = Object.assign(this.config, {
      requestBody,
      clientInfo: options.clientInfo || { ip: "10.8.8.8" }
    });

    return new Promise((resolve, reject) => {
      green(params, (err, res) => {
        if (err) reject(err);
        if (typeof res === "string") res = JSON.parse(res);

        if (res && res.code === 200 && res.data) {
          const { results, content } = res.data[0];
          if (!results || !results[0]) return reject("Alispam service get null response, pls contact BE");

          const _res = this._handler(results[0], content);
          resolve(_res);
        }
      });
    });
  }

  _handler(data) {
    const { rate } = data;
    // sensitive rate = 100 - normal rate
    let res = {
      sensitive: false,
      rate: Math.floor((100 - rate) * 1e3) / 1e3,
    };
    let _res = {};

    if (data.suggestion != "pass" && data.label) {
      _res = { sensitive: true, reason: keyWordReasonMap[data.label] || data.label, rate };
    }

    return Object.assign(res, _res);
  }
}

module.exports = AliSpam;
