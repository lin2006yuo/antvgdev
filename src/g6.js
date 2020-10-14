import G6 from "@antv/g6"
import { transferG6Path } from "./utils"

G6.registerNode(
  "round",
  {
    draw(cfg, group) {
      const color = cfg.color
      const w = cfg.size[0] || 20
      const h = cfg.size[1] || 20
      const x = cfg.x || 0
      const y = cfg.y || 0
      const r = cfg.r

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
        ["Z"]
      ]
      const style = G6.Util.mix(
        {},
        {
          path: path,
          lineWidth: 2,
          fill: "red",
          stroke: color
        },
        cfg.style
      )
      const keyShape = group.addShape("path", {
        attrs: {
          ...style
        },
        draggable: true,
        name: "round"
      })

      // 三角图标
      const tri_r = 5
      const tri_point = [w + 4, h / 2 - tri_r / 2]
      group.addShape("polygon", {
        attrs: {
          points: [
            [tri_point[0], tri_point[1]],
            [tri_point[0] + tri_r, tri_point[1] + tri_r / 2],
            [tri_point[0], tri_point[1] + tri_r]
          ],
          fill: "blue"
        }
      })

      if (cfg.label) {
        // 如果有文本
        // 如果需要复杂的文本配置项，可以通过 labeCfg 传入
        // const style = (cfg.labelCfg && cfg.labelCfg.style) || {};
        // style.text = cfg.label;
        const label = group.addShape("text", {
          attrs: {
            x: 0 + w + 12, // 居中
            y: 0 + h / 2,
            textAlign: "left",
            textBaseline: "middle",
            text: cfg.label,
            fill: "#666"
          },
          // must be assigned in G6 3.3 and later versions. it can be any value you want
          name: "text-shape",
          // 设置 draggable 以允许响应鼠标的图拽事件
          draggable: true
        })
      }

      // 返回 keyShape
      return keyShape
    }
  },
  // 注意这里继承了 'single-node'
  "single-node"
)

G6.registerNode("work-node", {
  draw(cfg, group) {
    const style = G6.Util.mix(
      {},
      {
        r: cfg.r,
        x: 10, // 10是round节点的w
        y: 10 // 10是round节点的h
      },
      cfg.style
    )
    const keyShape = group.addShape("circle", {
      attrs: {
        ...style,
        stroke: "red",
        fill: cfg.state === "UNDO" || cfg.state === "DOING" ? "" : "red",
        lineWidth: 2
      }
    })

    // 三角图标
    const w = cfg.r * 2
    const h = cfg.r * 2
    const tri_r = 5
    const tri_point = [w / 2 + 10 + 4, h / 2 - tri_r / 2 - 10] // 10是round节点的w，h
    group.addShape("polygon", {
      attrs: {
        points: [
          [tri_point[0], tri_point[1]],
          [tri_point[0] + tri_r, tri_point[1] + tri_r / 2],
          [tri_point[0], tri_point[1] + tri_r]
        ],
        fill: "blue"
      }
    })

    if (cfg.state === "UNDO") {
      group.addShape("path", {
        attrs: {
          path: [
            ["M", 10 - cfg.r / 2, 10], // 10是round节点的w，h
            ["L", 10 + cfg.r / 2, 10]
          ],
          lineCap: "round",
          lineWidth: 4,
          stroke: "red"
        }
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
      const ratio = (cfg.r * 2) / 226.8 / 1.2
      const path1 = transferG6Path(
        "M113,34.1V8c0-1.2-1.4-1.8-2.2-0.9L74.8,43c-0.5,0.5-0.5,1.4,0,1.9l36,36c0.9,0.9,2.2,0.2,2.2-0.9V55.1  c0-0.7,0.6-1.3,1.4-1.3c31.7,0.7,57.4,26.9,57.4,58.7c0,9.4-2.7,18.9-6.5,26.6c-0.2,0.5-0.2,1.1,0.2,1.5l12.8,12.8  c0.6,0.6,1.7,0.5,2.1-0.3c6.4-12.3,10.9-25.5,10.9-40.5C191.3,69.4,156.1,34.1,113,34.1L113,34.1z",
        ratio
      )
      const path2 = transferG6Path(
        "M113,169.9c0,0.7-0.6,1.3-1.4,1.3c-31.7-0.7-57.4-26.9-57.4-58.7c0-9.5,2.7-18.9,6.5-26.6  c0.2-0.5,0.2-1.1-0.2-1.5L47.8,71.6c-0.6-0.6-1.7-0.5-2.1,0.3c-6.4,12.3-10.9,25.5-10.9,40.5c0,42.6,34.5,77.6,77,78.3  c0.7,0,1.3,0.6,1.3,1.3V217c0,1.2,1.4,1.8,2.2,0.9l36-36c0.5-0.5,0.5-1.4,0-1.9l-36-36c-0.9-0.9-2.2-0.2-2.2,0.9L113,169.9  L113,169.9z",
        ratio
      )
      group.addShape("path", {
        attrs: {
          path: path1,
          fill: "red",
          lineWidth: 2,
          stroke: "red"
        }
      })
      group.addShape("path", {
        attrs: {
          path: path2,
          fill: "red",
          lineWidth: 2,
          stroke: "red"
        }
      })
    }

    if (cfg.state === "DONE") {
      const point = 8 // 这里是round节点的w
      group.addShape("path", {
        attrs: {
          path: [
            ["M", point - cfg.r / 2 + 2, point + 2],
            ["L", point, point + cfg.r / 3 + 2],
            ["L", point + cfg.r / 2 + 2, point - cfg.r / 2 + 2 + 2]
          ],
          lineCap: "round",
          lineJoin: "round",
          lineWidth: 4,
          stroke: "white"
        }
      })
    }

    if (cfg.label) {
      // 如果有文本
      // 如果需要复杂的文本配置项，可以通过 labeCfg 传入
      // const style = (cfg.labelCfg && cfg.labelCfg.style) || {};
      // style.text = cfg.label;
      const label = group.addShape("text", {
        // attrs: style
        attrs: {
          x: cfg.r + 10 + 12, // 居中 10 是round节点的w，h
          y: cfg.r / 2,
          textAlign: "left",
          textBaseline: "middle",
          text: cfg.label,
          fill: "#666"
        },
        // must be assigned in G6 3.3 and later versions. it can be any value you want
        name: "text-shape",
        // 设置 draggable 以允许响应鼠标的图拽事件
        draggable: true
      })
    }

    return keyShape
  }
})

const data = {
  nodes: [
    {
      id: "node1",
      size: [20, 20],
      label: "萝卜",
      r: 3,
      type: "round",
      color: "black"
    },
    {
      id: "node2",
      label: "去皮",
      state: "DOING",
      r: 20,
      type: "work-node",
      color: "black"
    },
    {
      id: "node3",
      label: "切丝",
      state: "UNDO",
      r: 20,
      type: "work-node",
      color: "black"
    },
    {
      id: "node4",
      label: "牛腩",
      size: [20, 20],
      r: 3,
      type: "round",
      color: "black"
    },
    {
      id: "node5",
      label: "清洗",
      state: "DONE",
      size: [20, 20],
      r: 20,
      type: "work-node",
      color: "black"
    },
    {
      id: "node6",
      label: "潲水",
      state: "DONE",
      size: [20, 20],
      r: 20,
      type: "work-node",
      color: "black"
    },
    {
      id: "node7",
      label: "萝卜牛腩",
      size: [20, 20],
      r: 3,
      type: "round",
      color: "black"
    }
  ],
  edges: [
    {
      source: "node1",
      target: "node2"
    },
    {
      source: "node2",
      target: "node3"
    },
    {
      source: "node3",
      target: "node7"
    },
    {
      source: "node4",
      target: "node5"
    },
    {
      source: "node5",
      target: "node6"
    },
    {
      source: "node6",
      target: "node7"
    }
  ]
}

const graph = new G6.Graph({
  container: "g6",
  width: 500,
  height: 500,
  modes: {
    default: ["drag-canvas"]
  },
  defaultEdge: {
    type: "polyline",
    style: {
      lineWidth: 3
    }
  },
  defaultNode: {
    anchorPoints: [
      [0.5, 1],
      [0.5, 0]
    ]
  },
  layout: {
    type: "dagre",
    rankdir: "TB",
    ranksep: 20
  }
})
graph.data(data)
graph.render()
