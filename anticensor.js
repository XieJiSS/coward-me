const fs = require("fs");

/**
 * @param {string} text
 */
function hide(text) {
  text = text.replace(/\s/g, "").replace(/\,/g, "，").replace(/([a-zA-Z0-9])/g, ch => {
    return String.fromCharCode(ch.charCodeAt(0) + 0xFEE0);
  });

  const BLOCK_CNT = 5;
  const len = text.length;
  const placeholder = " ";
  if(len <= 1) return text;
  let row = 1 + Math.max(2, ~~Math.sqrt(len));
  let T = row + (row - 2);
  if(len > 36) {
    do {
      row += 1;
      T = row + (row - 2)
    } while((len - row) / T > BLOCK_CNT);
  }
  if(len <= 16) {
    if(len >= 9) {
      row += 1;
      T += 2;
    } else {
      // 懒得想算法了，打表吧
      let table;
      if(len === 8) {
        table = [
          [text[0], void 0 , text[4], void 0 ],
          [text[1], text[3], text[5], text[7]],
          [text[2], void 0 , text[6], void 0 ],
        ];
      } else if(len >= 5) {
        table = [
          [text[0], void 0 , text[4]],
          [text[1], text[3], text[5]],
          [text[2], void 0 , text[6]],
        ];
      } else if(len === 4) {
        table = [
          [text[0], void 0 ],
          [text[1], text[3]],
          [text[2], void 0 ],
        ];
      } else if(len === 3) {
        table = [
          [text[0]],
          [text[1]],
          [text[2]],
        ];
      } else {
        table = [
          [text[0]],
          [text[1]],
        ];
      }
      return table.map(line => line.map(ch => ch === void 0 ? placeholder : ch).join("")).join("\n");
    }
  }
  let result = Array.from(new Array(row), () => new Array((BLOCK_CNT + 1) * ~~(len / T)));
  let x = 0, y = 0;
  for(let i = 0; i < len; i++) {
    x = 4 * ~~(i / T);
    if(i % T === row) x += 1;
    else if(i % T > row && i % T <= T - 2) x += 2;
    else if(i % T === T - 1 && T > 2) x += 3;
    y = (i % T) < row ? (i % T) : (T - (i % T));
    result[y][x] = text[i];
  }
  let maxLen = 0;
  for(let i = 0; i < row; i++) {
    let currentMaxLen = 0;
    for(let j = 0; j < result[i].length; j++) {
      if(result[i][j] && j + 1 > currentMaxLen) currentMaxLen = j + 1;
    }
    if(currentMaxLen > maxLen) maxLen = currentMaxLen;
  }
  for(let i = 0; i < row; i++) {
    for(let j = 0; j < maxLen; j++) {
      if(!result[i][j]) result[i][j] = placeholder;
    }
  }
  return result.map(line => line.join("")).join("\n");
}

if(fs.existsSync(__dirname + "/" + process.argv[2])) {
  console.log(hide(
    fs.readFileSync(__dirname + "/" + process.argv[2]).toString("utf-8")
  ));
} else console.log(hide(process.argv[2] || ""));
