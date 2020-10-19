// test string
// MoveTo: M, m
// LineTo: L, l, H, h, V, v
// Cubic Bézier Curve: C, c, S, s
// Quadratic Bézier Curve: Q, q, T, t
// Elliptical Arc Curve: A, a
// ClosePath: Z, z
// https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d
const key = {
  M: "M",
  m: "m",
  L: "L",
  l: "l",
  H: "H",
  h: "h",
  V: "V",
  v: "v",
  C: "C",
  c: "c",
  S: "S",
  s: "s",
  Q: "Q",
  q: "q",
  T: "T",
  t: "t",
  A: "A",
  a: "a",
  Z: "Z",
  z: "z"
}

export function transferArrayPath(path, ratio = 1) {
  const pathArray = []

  let pathArrayIndex = -1
  let strNumber = ""

  for (let i = 0; i < path.length; i++) {
    const str = path[i]

    const needNew = !!key[str]
    if (needNew) {
      if (strNumber.trim() !== "") {
        pathArray[pathArrayIndex].push(Number(strNumber) * ratio)
        strNumber = ""
      }
      pathArrayIndex++
      let arr = []
      pathArray.push(arr)
      arr.push(key[str])
    } else {
      if (str === "," || str === "-") {
        if (strNumber) {
          pathArray[pathArrayIndex].push(Number(strNumber) * ratio)
        }
        if (str === "-") {
          strNumber = "-"
        } else {
          strNumber = ""
        }
      } else {
        strNumber += str
      }
    }
  }
  return pathArray
}

const reg = /(M(\d|\,|\.)+)/g
const checked = /\s\d/g
// G6@3.8.1存在问题，直接使用svg的path绘制出来的图像会错位，解决方法是复制一遍M命令
export function adjustPath(path) {
  // 校验G6支持的格式
  if (checked.test(path)) {
    throw new Error("path不支持，请将svg放入AI导出再使用")
  }
  return path.replace(reg, "$&z$&")
}


/**
 * 处理nodes样式
 * @param {} nodes 
 */

export function processNode(nodes, options) {
  return nodes.map(node => {
    const size = [options.width, options.height]
    
    if(node.type === 'round') {
      node.size = [size]
    }
  })
}