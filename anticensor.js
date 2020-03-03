/**
 * @param {string} text
 */
function hide(text) {
  text = text.replace(/ /g, "").replace(/\,/g, "，");
  const row = text.length <= 100 ? Math.max(1, ~~Math.sqrt(text.length)) : 1 + ~~(text.length / 100);
  if(row <= 1) return text;
  const T = row + (row - 2), placeholder = "口";
  let result = Array.from(new Array(row), () => []);
  let x = 0, y = 0;
  for(let i = 0; i < text.length; i++) {
    x = ((i % T) < row ? 0 : (i % T) - row + 1) + (row - 1) * ~~(i / T);
    y = (i % T) < row ? (i % T) : (T - (i % T));
    result[y][x] = text[i];
  }
  let maxLen = 0;
  for(let i = 0; i < row; i++) {
    if(result[i].length > maxLen) maxLen = result[i].length;
  }
  for(let i = 0; i < row; i++) {
    for(let j = 0; j < maxLen; j++) {
      if(!result[i][j]) result[i][j] = placeholder;
    }
  }
  return result.map(line => line.join("")).join("\n");
}

console.log(hide(process.argv[2] || ""));
