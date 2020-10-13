import G6 from "@antv/g6"

G6.registerNode(
  "diamond",
  {
    draw(cfg, group) {
      const size = this.getSize(cfg) // 转换成 [width, height] 的模式
      const color = cfg.color
      const width = size[0]
      const height = size[1]
      //  / 1 \
      // 4     2
      //  \ 3 /
      const path = [
        ["M", 0, 0 - height / 2], // 上部顶点
        ["L", width / 2, 0], // 右侧顶点
        ["L", 0, height / 2], // 下部顶点
        ["L", -width / 2, 0], // 左侧顶点
        ["Z"] // 封闭
      ]
      const style = G6.Util.mix(
        {},
        {
          path: path,
          stroke: color
        },
        cfg.style
      )
      // 增加一个 path 图形作为 keyShape
      const keyShape = group.addShape("path", {
        attrs: {
          ...style
        },
        draggable: true,
        name: "diamond-keyShape"
      })
      // 返回 keyShape
      return keyShape
    }
  },
  // 注意这里继承了 'single-node'
  "single-node"
)

G6.registerNode(
  "custom",
  {
    // 响应状态变化
    setState(name, value, item) {
      const group = item.getContainer()
      const shape = group.get("children")[0] // 顺序根据 draw 时确定
      if (name === "running") {
        if (value) {
          shape.animate(
            {
              r: 20
            },
            {
              repeat: true,
              duration: 1000
            }
          )
        } else {
          shape.stopAnimate()
          shape.attr("r", 10)
        }
      }
    }
  },
  "single-node"
)

G6.registerNode(
  "dom-node",
  {
    draw: (cfg, group) => {
      return group.addShape("dom", {
        attrs: {
          width: cfg.size[0],
          height: cfg.size[1],
          // 传入 DOM 的 html
          html: `
        <div style="background-color: #fff; border: 2px solid #5B8FF9; border-radius: 5px; width: ${
          cfg.size[0] - 5
        }px; height: ${cfg.size[1] - 5}px; display: flex;">
          <div style="height: 100%; width: 33%; background-color: #CDDDFD">
            <img alt="img" style="line-height: 100%; padding-top: 6px; padding-left: 8px;" src="https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*Q_FQT6nwEC8AAAAAAAAAAABkARQnAQ" width="20" height="20" />  
          </div>
          <span style="margin:auto; padding:auto; color: #5B8FF9">${
            cfg.label
          }</span>
        </div>
          `
        },
        draggable: true
      })
    }
  },
  "single-node"
)

G6.registerNode(
  "rect-xml",
  (cfg) => `
  <rect style={{
    width: 100, height: 20, fill: '#1890ff', stroke: '#1890ff', radius: [6, 6, 0, 0]
  }} keyshape="true" name="test">
    <text style={{ 
			marginTop: 2, 
			marginLeft: 50, 
      textAlign: 'center', 
      fontWeight: 'bold', 
      fill: '#fff' }} 
			name="title">${cfg.label || cfg.id}</text>



  </rect>
`
)

const percentageBar = ({ width, used, height = 12 }) => `
  <rect style={{
    marginLeft: 10,
    marginTop: 3,
    width: ${width},
    height: ${height},
    fill: '#fff',
    stroke: '#1890ff'
  }} name="body" >
    <rect style={{
      marginLeft: 10,
      width: ${(width / 100) * used},
      height: ${height},
      fill: '#1890ff',
      stroke: '#1890ff'
    }}/>
  </rect>
`

const textXML = (cfg) => `
<group>
  <rect style={{
    width: 100, height: 20, fill: '#1890ff', stroke: '#1890ff', radius: [6, 6, 0, 0]
  }}>
    <text style={{ marginTop: 2, marginLeft: 50, 
			textAlign: 'center',
			fontWeight: 'bold', 
			fill: '#fff' }}>${cfg.id}</text>
  </rect>
  <rect style={{ width: 100, height: 80, fill: 'rgba(24,144,255,0.15)', 
		radius: [0, 0, 6, 6] }} 
		keyshape="true" 
		cursor="move">
    <text style={{marginLeft: 10 ,fill: "red"}}>hah</text>
    <text style={{ marginTop: 5, marginLeft: 10, fill: '#333'}}>${cfg.metric}: </text>
    <text style={{
      marginTop: 1,
      marginLeft: 20,
      fontSize: 10,
      fill: '#1890ff',
    }}>${cfg.cpuUsage}%</text>

  </rect>
</group>
`

G6.registerNode("test-xml", textXML)

const data = {
  nodes: [
    {
      id: "circle",
      label: "Circle",
      x: 250,
      y: 150,
      type: "modelRect"
    },
    {
      id: "node2",
      label: "node2",
      x: 300,
      y: 400,
      // 该节点可选的连接点集合，该点有两个可选的连接点
      anchorPoints: [
        [0.5, 0],
        [1, 0.5]
      ],
      type: "rect"
    }
  ],
  edges: [
    {
      source: "node2",
      target: "node1",
      // 该边连入 source 点的第 1 个 anchorPoint，
      sourceAnchor: 1,
      // 该边连入 source 点的第 1 个 anchorPoint，
      targetAnchor: 1,
      style: {
        endArrow: true
      }
    },
    {
      source: "node2",
      target: "node1",
      // 该边连入 source 点的第 1 个 anchorPoint，
      sourceAnchor: 1,
      // 该边连入 source 点的第 1 个 anchorPoint，
      targetAnchor: 1,
      style: {
        endArrow: true
      }
    }
  ]
}

const graph = new G6.Graph({
  container: "g6",
  width: 500,
  height: 500,
  defaultNode: {
    linkPoints: {
      top: true,
      right: true,
      bottom: true,
      left: true,
      // the diameter of the linkPoint
      size: 10,
      lineWidth: 1,
      fill: "#fff",
      stroke: "#1890FF"
    }
  }
})
graph.data(data)
graph.render()
