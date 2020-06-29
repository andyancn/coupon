/**
 * data.js
 * @date    2019-04-13 16:20:18
 * @version 1.0.0
 */

const enableArr = [
  {
    label:'启用',
    value:1,
  },
  {
    label:'停用',
    value:0,
  }
]

const writeOffStatusArr = [
  {
    label:'全部券码状态',
    value:'',
  },
  {
    label:'未分配',
    value:0,
  },
  {
    label:'已分配',
    value:1,
  },
  {
    label:'已核销',
    value:2,
  },
  {
    label:'已失效',
    value:3,
  }
]

export default {
  enableArr,
  writeOffStatusArr
}