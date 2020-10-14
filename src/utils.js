const path_string =
  "M113,34.1V8c0-1.2-1.4-1.8-2.2-0.9L74.8,43c-0.5,0.5-0.5,1.4,0,1.9l36,36c0.9,0.9,2.2,0.2,2.2-0.9V55.1  c0-0.7,0.6-1.3,1.4-1.3c31.7,0.7,57.4,26.9,57.4,58.7c0,9.4-2.7,18.9-6.5,26.6c-0.2,0.5-0.2,1.1,0.2,1.5l12.8,12.8  c0.6,0.6,1.7,0.5,2.1-0.3c6.4-12.3,10.9-25.5,10.9-40.5C191.3,69.4,156.1,34.1,113,34.1L113,34.1z"
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

export function transferG6Path(path, ratio, ox = 0, oy = 0) {
  const pathArray = []

  let pathArrayIndex = -1
  let strNumber = ""
  let _ox = 0
  let _oy = 0

  let cur = ''
  let Mtime = 0 

  for (let i = 0; i < path.length; i++) {
    const str = path[i]

    const needNew = !!key[str]
    if (needNew) {
      cur = needNew
      if (strNumber) {
        pathArray[pathArrayIndex].push(Number(strNumber) * ratio)
        strNumber = ""
      }
      if(needNew === 'M') {
        _ox = ox,
        _oy = oy
      } else {
        ox = 0,
        oy = 0
      }
      pathArrayIndex++
      let arr = []
      pathArray.push(arr)
      arr.push(key[str])
    } else {
      if (str === "," || str === "-") {
        if (strNumber) {
          pathArray[pathArrayIndex].push(Number(strNumber) * ratio - ox)
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
