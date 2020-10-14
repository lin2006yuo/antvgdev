import G6 from "@antv/g6"
import { mat3 } from "@antv/matrix-util"
import { transferG6Path } from "./utils"

const round_w = 80 // 物料节点宽
const round_h = 50 // 物料节点高
const node_radius = 25 // 物料节点圆角

// 拓展一个圆角rect
G6.registerNode(
  "round",
  {
    draw(cfg, group) {
      const color = cfg.color
      const w = cfg.size[0] || round_w
      const h = cfg.size[1] || round_h
      const x = cfg.x || 0
      const y = cfg.y || 0
      const r = cfg.r // 圆角半径

      const path = [
        ["M", x + r, y],
        ["L", x + w - r, y],
        ["Q", x + w, y, x + w, y + r],
        ["L", x + w, y + h - r],
        ["Q", x + w, y + h, x + w - r, y + h],
        ["L", x + r, y + h],
        ["Q", x, y + h, x, y + h - r],
        ["L", x, y + r],
        ["Q", x, y, x + r, y],
        ["Z"],
      ]
      const style = G6.Util.mix(
        {},
        {
          path: path,
          fill: color,
        },
        cfg.style
      )
      const keyShape = group.addShape("path", {
        attrs: {
          ...style,
        },
        draggable: true,
        name: "round",
      })

      // 三角图标
      const tri_r = 5
      const tri_point = [w + 4, h / 2 - tri_r / 2]
      group.addShape("polygon", {
        attrs: {
          points: [
            [tri_point[0], tri_point[1]],
            [tri_point[0] + tri_r, tri_point[1] + tri_r / 2],
            [tri_point[0], tri_point[1] + tri_r],
          ],
          fill: "blue",
        },
      })

      if (cfg.label) {
        const label = group.addShape("text", {
          attrs: {
            x: 0 + w + 12, // 居中
            y: 0 + h / 2,
            textAlign: "left",
            textBaseline: "middle",
            text: cfg.label,
            fill: "#666",
          },
          // must be assigned in G6 3.3 and later versions. it can be any value you want
          name: "text-shape",
          // 设置 draggable 以允许响应鼠标的图拽事件
          draggable: true,
        })
      }

      return keyShape
    },
  },
  "single-node"
)

G6.registerNode("work-node", {
  draw(cfg, group) {
    const style = G6.Util.mix(
      {},
      {
        r: cfg.r,
        x: round_w / 2, // 10是round节点的w
        y: round_h / 2, // 10是round节点的h
      },
      cfg.style
    )
    const keyShape = group.addShape("circle", {
      attrs: {
        ...style,
        stroke: "red",
        cursor: 'pointer',
        fill: cfg.state === "UNDO" || cfg.state === "DOING" ? "white" : "red",
        lineWidth: 2,
      },
    })

    // 三角图标
    const w = cfg.r * 2
    const h = cfg.r * 2
    const tri_r = 5
    const tri_point = [w / 2 + round_w / 2 + 4, round_h / 2 - tri_r / 2] // 10是round节点的w，h
    group.addShape("polygon", {
      attrs: {
        points: [
          [tri_point[0], tri_point[1]],
          [tri_point[0] + tri_r, tri_point[1] + tri_r / 2],
          [tri_point[0], tri_point[1] + tri_r],
        ],
        fill: "blue",
      },
    })

    if (cfg.state === "UNDO") {
      group.addShape("path", {
        attrs: {
          path: [
            ["M", round_w / 2 - cfg.r / 2, round_h / 2], // 10是round节点的w，h
            ["L", round_w / 2 + cfg.r / 2, round_h / 2],
          ],
          lineCap: "round",
          lineWidth: 4,
          stroke: "red",
        },
      })
    }

    /**
     * M113,34.1
     * V8
     * c0 -1.2 -1.4 -1.8 -2.2 -0.9
     * L74.8,43
     * c-0.5, 0.5 -0.5, 1.4, 0, 1.9
     * l36, 36
     * c 0.9, 0.9, 2.2 , 0.2, 2.2 -0.9
     * V55.1
     * c0 -0.7, 0.6 -1.3, 1.4 -1.3
     * c31.7, 0.7, 57.4, 26.9, 57.4, 58.7
     * c0, 9.4 -2.7, 18.9 -6.5, 26.6
     * c-0.2, 0.5 -0.2, 1.1, 0.2, 1.5
     * l12.8,12.8
     * c0.6, 0.6, 1.7, 0.5, 2.1 -0.3
     * c6.4 -12.3, 10.9 -25.5, 10.9 -40.5
     * C191.3,69.4,156.1,34.1,113,34.1
     * L113,34.1
     * z
     */
    if (cfg.state === "DOING") {
      const ratio = (cfg.r * 2) / 226.8 / 1.2 // 226.8为svg viewBox值
      // 转化为G6要求的格式
      const path1 = transferG6Path(
        `M113,34.1V8c0-1.2-1.4-1.8-2.2-0.9L74.8,43c-0.5,0.5-0.5,1.4,0,1.9l36,36c0.9,0.9,2.2,0.2,2.2-0.9V55.1  c0-0.7,0.6-1.3,1.4-1.3c31.7,0.7,57.4,26.9,57.4,58.7c0,9.4-2.7,18.9-6.5,26.6c-0.2,0.5-0.2,1.1,0.2,1.5l12.8,12.8  c0.6,0.6,1.7,0.5,2.1-0.3c6.4-12.3,10.9-25.5,10.9-40.5C191.3,69.4,156.1,34.1,113,34.1L113,34.1z`,
        ratio
      )

      const path2 = transferG6Path(
        "M113,169.9c0,0.7-0.6,1.3-1.4,1.3c-31.7-0.7-57.4-26.9-57.4-58.7c0-9.5,2.7-18.9,6.5-26.6  c0.2-0.5,0.2-1.1-0.2-1.5L47.8,71.6c-0.6-0.6-1.7-0.5-2.1,0.3c-6.4,12.3-10.9,25.5-10.9,40.5c0,42.6,34.5,77.6,77,78.3  c0.7,0,1.3,0.6,1.3,1.3V217c0,1.2,1.4,1.8,2.2,0.9l36-36c0.5-0.5,0.5-1.4,0-1.9l-36-36c-0.9-0.9-2.2-0.2-2.2,0.9L113,169.9  L113,169.9z",
        ratio
      )

      const p1 = group.addShape("path", {
        attrs: {
          path: path1,
          fill: "red",
          lineWidth: 1,
        },
      })
      let matrix1 = p1.getMatrix()
      if (!matrix1) matrix1 = mat3.create()
      const newMatrix1 = G6.Util.transform(matrix1, [
        [
          "t",
          (-226.8 * ratio) / 2 + round_w / 2,
          (-226.8 * ratio) / 2 + round_h / 2,
        ], // translate
      ])
      p1.setMatrix(newMatrix1)

      const p2 = group.addShape("path", {
        attrs: {
          path: path2,
          fill: "red",
          lineWidth: 1,
        },
      })
      let matrix2 = p2.getMatrix()
      if (!matrix2) matrix2 = mat3.create()
      const newMatrix2 = G6.Util.transform(matrix2, [
        [
          "t",
          (-226.8 * ratio) / 2 + round_w / 2,
          (-226.8 * ratio) / 2 + round_h / 2,
        ], // translate
      ])
      p2.setMatrix(newMatrix2)
    }

    if (cfg.state === "DONE") {
      const point_x = round_w / 2 - 2 // 这里是round节点的w
      const point_y = round_h / 2 - 2 // 这里是round节点的w
      group.addShape("path", {
        attrs: {
          path: [
            ["M", point_x - cfg.r / 2 + 2, point_y + 2],
            ["L", point_x, point_y + cfg.r / 3 + 2],
            ["L", point_x + cfg.r / 2 + 2, point_y - cfg.r / 2 + 2 + 2],
          ],
          lineCap: "round",
          lineJoin: "round",
          lineWidth: 4,
          stroke: "white",
        },
      })
    }

    if (cfg.label) {
      const label = group.addShape("text", {
        attrs: {
          x: cfg.r + round_w / 2 + 12,
          y: cfg.r / 2 + round_h / 2 - 10,
          textAlign: "left",
          textBaseline: "middle",
          text: cfg.label,
          fill: "#666",
        },
        // must be assigned in G6 3.3 and later versions. it can be any value you want
        name: "text-shape",
        draggable: true,
      })
    }

    return keyShape
  },
})

const data = {
  nodes: [
    {
      id: "node1",
      size: [round_w, round_h],
      label: "萝卜",
      r: node_radius,
      type: "round",
      color: "red",
    },
    {
      id: "node2",
      label: "去皮",
      state: "DOING",
      r: 20,
      type: "work-node",
      color: "red",
    },
    {
      id: "node3",
      label: "切丝",
      state: "UNDO",
      r: 20,
      type: "work-node",
      color: "red",
    },
    {
      id: "node4",
      label: "牛腩",
      size: [round_w, round_h],
      r: node_radius,
      type: "round",
      color: "red",
    },
    {
      id: "node5",
      label: "清洗",
      state: "DONE",
      r: 20,
      type: "work-node",
      color: "red",
    },
    {
      id: "node6",
      label: "潲水",
      state: "DONE",
      r: 20,
      type: "work-node",
      color: "red",
    },
    {
      id: "node7",
      label: "大火慢炖",
      state: "UNDO",
      r: 20,
      type: "work-node",
      color: "red",
    },
    {
      id: "node8",
      label: "萝卜牛腩",
      size: [round_w, round_h],
      r: node_radius,
      type: "round",
      color: "red",
    },
  ],
  edges: [
    {
      source: "node1",
      target: "node2",
    },
    {
      source: "node2",
      target: "node3",
    },
    {
      source: "node3",
      target: "node7",
    },
    {
      source: "node4",
      target: "node5",
    },
    {
      source: "node5",
      target: "node6",
    },
    {
      source: "node6",
      target: "node7",
    },
    {
      source: "node7",
      target: "node8",
    },
  ],
}

const graph = new G6.Graph({
  container: "g6",
  width: 500,
  height: 500,
  modes: {
    default: ["drag-canvas", "zoom-canvas"],
  },
  defaultEdge: {
    type: "polyline",
    style: {
      lineWidth: 3,
    },
  },
  defaultNode: {
    anchorPoints: [
      [0.5, 1],
      [0.5, 0],
    ],
  },
  layout: {
    type: "dagre",
    rankdir: "TB",
    ranksep: 20,
  },
})
graph.data(data)
graph.render()
