import * as d3 from 'd3';
import { saveAs } from 'file-saver';
type TreeNode = {
  name: string;
  parent?: string | null;
  children?: Array<TreeNode>;
  type?: string;
}

const routerTreeView:  TreeNode = {
  name: '根模組',
  type: 'module',
  children: [
    {
      name: '登入頁面',
      parent: '根模組',
      type: 'page'
    },
    {
      name: '忘記密碼頁面',
      parent: '根模組',
      type: 'page'
    },
    {
      name: '帳戶鎖定頁面',
      parent: '根模組',
      type: 'page'
    },
    {
      name: '主模組',
      type: 'module',
      parent: '根模組',
      children: [
        {
          name: '收件模組',
          type: 'module',
          parent: '主模組',
          children: [
            {
              name: '收件作業模組',
              type: 'module',
              parent: '收件模組',
              children: [
                {
                  name: '查詢頁面',
                  type: 'page',
                  parent: '收件作業模組'
                },
                {
                  name: '新增頁面',
                  type: 'page',
                  parent: '收件作業模組'
                },
                {
                  name: '修改頁面',
                  type: 'page',
                  parent: '收件作業模組'
                }
              ]
            },
            {
              name: '收件管理者模組',
              type: 'module',
              parent: '收件模組',
              children: [
                {
                  name: '查詢頁面',
                  type: 'page',
                  parent: '收件查詢模組'
                },
                {
                  name: '修改頁面',
                  type: 'page',
                  parent: '收件作業模組'
                }
              ]
            }
          ]
        },
        {
          name: '入金模組',
          type: 'module',
          parent: '主模組',
          children: [
            {
              name: '入金作業模組',
              type: 'module',
              parent: '入金模組',
              children: [
                {
                  name: '查詢頁面',
                  type: 'page',
                  parent: '入金作業模組'
                },
                {
                  name: '編輯頁面',
                  type: 'page',
                  parent: '入金作業模組'
                }
              ]
            },
            {
              name: '未結案查詢模組',
              type: 'module',
              parent: '入金模組',
              children: [
                {
                  name: '查詢頁面',
                  type: 'page',
                  parent: '入金管理者模組'
                }
              ]
            },
            {
              name: '已結案查詢模組',
              type: 'module',
              parent: '入金模組',
              children: [
                {
                  name: '查詢頁面',
                  type: 'page',
                  parent: '入金管理者模組'
                },
                {
                  name: '修改頁面',
                  type: 'page',
                  parent: '入金管理者模組'
                }
              ]
            }
          ]
        },
        {
          name: '業績模組',
          type: 'module',
          parent: '主模組',
          children: [
            {
              name: '各種業績查詢頁面(有多個)',
              type: 'page',
              parent: '業績模組'
            },
          ]
        },
        {
          name: '佣金模組',
          type: 'module',
          parent: '主模組',
          children: [
            {
              name: '各種佣金查詢頁面(有多個)',
              type: 'page',
              parent: '佣金模組'
            },
          ]
        },
        {
          name: '權限模組',
          type: 'module',
          parent: '主模組',
          children: [
            {
              name: '角色維護模組',
              type: 'module',
              parent: '權限模組',
              children: [
                {
                  name: '查詢頁面',
                  type: 'page',
                  parent: '角色維護模組'
                },
                {
                  name: '新增頁面',
                  type: 'page',
                  parent: '角色維護模組'
                },
                {
                  name: '修改頁面',
                  type: 'page',
                  parent: '角色維護模組'
                }
              ]
            },
            {
              name: '角色功能權限設定模組',
              type: 'module',
              parent: '權限模組',
              children: [
                {
                  name: '查詢頁面',
                  type: 'page',
                  parent: '使用者維護模組'
                },
                {
                  name: '修改頁面',
                  type: 'page',
                  parent: '角色功能權限設定模組'
                }
              ]
            },
            {
              name: '使用者維護模組',
              type: 'module',
              parent: '權限模組',
              children: [
                {
                  name: '查詢頁面',
                  type: 'page',
                  parent: '使用者維護模組'
                },
                {
                  name: '修改頁面',
                  type: 'page',
                  parent: '使用者維護模組'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

// set up range of the margin, width and height
const margin  = {top: 40, right: 90, bottom: 30, left: 90};
const width = 960 - margin.left - margin.right;
const height = 2000 - margin.top - margin.bottom;


let i = 0;

var nodeWidth = 30;
var nodeHeight = 30;
var horizontalSeparationBetweenNodes = 12;
var verticalSeparationBetweenNodes = 10;


// set up the tree layout
const tree = d3.tree().nodeSize([nodeWidth + horizontalSeparationBetweenNodes, nodeHeight + verticalSeparationBetweenNodes])
.separation(function(a, b) {
    return a.parent == b.parent ? 1 : 2;
});

const diagonal = d3.linkHorizontal().x((d: any) => d.y).y((d: any) => d.x);



const svg = d3.select('body').append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top+800})`);

const root = routerTreeView;

update(root);

function update(source: TreeNode) {

  // d3.hierarchy() is used to transform the data into a hierarchy structure
  // tree() is used to transform the hierarchy structure into a tree structure
  const treeData = tree(d3.hierarchy(source as any));

  // tree.descendants() is used to get the nodes of the tree which already have the x and y values
  // tree.links() is used to get the links of the tree and there are two types source and target which represent the start and end of the link
  const nodes = treeData.descendants();
  const links = treeData.links();

  // set up the height of the nodes
  nodes.forEach((d: any) => {
    d.y = d.depth * 150;
  });

  // add the index of the nodes
  const node = svg.selectAll('g.node')
    .data(nodes, (d: any) => d.id || (d.id = ++i));


  console.log(node);


  const nodeEnter = node.enter().append('g')
    .attr('class', 'node')
    .attr('transform', (d: any) => `translate(${d.y}, ${d.x})`);

  nodeEnter.append('circle')
    .attr('r', 10)
    .style('fill', '#fff')
    .style('stroke', (d: any) => d.data.type === 'module' ? 'steelblue' : 'red').style('stroke-width', 3);

  nodeEnter.append('text')
    .attr('x', (d: any) => d.children || d._children ? 0 : 0)
    .attr('dy', '-1rem')
    .attr('text-anchor', 'middle')
    .text((d: any) => d.data.name)
    .style('fill-opacity', 1);

  const link = svg.selectAll('path.link')
    .data(links, (d: any) => d.target.id);

  link.enter().insert('path', 'g')
    .attr('class', 'link')
    .attr('d', diagonal as any)
    .style('fill', 'none')
    .style('stroke', '#ccc')
    .style('stroke-width', '2px');
}
