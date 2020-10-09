import { Canvas } from '@antv/g-canvas';
// 或者使用 SVG 版本
// import { Canvas } from '@antv/g-svg';

const canvas = new Canvas({
  container: 'c1',
  width: 500,
  height: 500,
});

const group = canvas.addGroup();
group.addShape('circle', {
  attrs: {
    x:100,
    y: 100,
    r: 50,
    fill: 'red',
    stroke: 'blue',
    lineWidth: 5,
  },
});