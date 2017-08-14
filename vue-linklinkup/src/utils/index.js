const Utils = {}

/* Array.prototype.fill Polyfill By https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill */
/* eslint-disable */
if (!Array.prototype.fill) {
  Object.defineProperty(Array.prototype, 'fill', {
    value: function(value) {

      // Steps 1-2.
      if (this == null) {
        throw new TypeError('this is null or not defined');
      }

      var O = Object(this);

      // Steps 3-5.
      var len = O.length >>> 0;

      // Steps 6-7.
      var start = arguments[1];
      var relativeStart = start >> 0;

      // Step 8.
      var k = relativeStart < 0 ?
        Math.max(len + relativeStart, 0) :
        Math.min(relativeStart, len);

      // Steps 9-10.
      var end = arguments[2];
      var relativeEnd = end === undefined ?
        len : end >> 0;

      // Step 11.
      var final = relativeEnd < 0 ?
        Math.max(len + relativeEnd, 0) :
        Math.min(relativeEnd, len);

      // Step 12.
      while (k < final) {
        O[k] = value;
        k++;
      }

      // Step 13.
      return O;
    }
  });
}
/* eslint-enable */

/*
* Wrap a dyadic array by fill
* @params arr     the source arr
* @params fill    which to wrap source arr
*
*               0 0 0 0 0
*   1 1 1       0 1 1 1 0
*   1 1 1   =>  0 1 1 1 0
*   1 1 1       0 1 1 1 0
*               0 0 0 0 0
*/
// dyadicArray:二维数组、Wrap:缠绕，盘绕、row:行
// forEach(item, index){}遍历
// Object.assign(target, ...sources) 方法用于将所有可枚举的属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。
// var obj = Object.assign(o1, o2, o3);
// console.log(obj); // { a: 1, b: 2, c: 3 }
// console.log(o1);  // { a: 1, b: 2, c: 3 }, 注意目标对象自身也会改变。
Utils.dyadicArrayWrap = function (arr, fill) {
  let firstRowLength = 0
  let lastRowLength = 0
  arr.forEach(function (row, index) {
    if (index === 0) {
      // 数组元素的第一个元素长度+2
      firstRowLength = row.length + 2
    } else if (index === arr.length - 1) {
      // 数组元素的最后一个元素长度+2
      lastRowLength = row.length + 2
    }
    // Object.assign({}, fill).valueOf() 返回实例对象本身
    // splice() 方法向/从数组中添加/删除项目，然后返回被删除的项目。
    row.splice(0, 0, Object.assign({}, fill).valueOf())
    row.splice(row.length, 0, Object.assign({}, fill).valueOf())
  })
  arr.splice(0, 0, Array(firstRowLength).fill(0).map(e => Object.assign({}, fill).valueOf()))
  arr.splice(arr.length, 0, Array(lastRowLength).fill(0).map(e => Object.assign({}, fill).valueOf()))
  return arr
}

// 从数组中随机选取一条数据，set用于排重
const arrayRandomItem = function (arr, set) {
  let arrlen = arr.length
  let rand = ~~(Math.random() * arrlen)
  return set.has(rand) ? arrayRandomItem(arr, set) : (set.add(rand), arr[rand])
}

// 从数组中随机选取几条非重复数据
// new Set() http://www.cnblogs.com/sker/p/5520392.html  它类似于数组，但是成员的值都是唯一的，没有重复的值
// arr.fill() https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/fill 方法用一个固定值填充一个数组中从起始索引到终止索引内的全部元素。
Utils.arrayRandom = function (arr, count) {
  if (arr.length <= count) {
    Utils.arrayShuffle(arr)
    return arr
  }
  let set = new Set()
  return Array(count).fill(0).map(e => arrayRandomItem(arr, set))
}

// 随机排序数组
Utils.arrayShuffle = function (arr) {
  for (var j, x, i = arr.length; i; j = ~~(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
  return arr
}

// 用一个数组来随机填充一个指定大小的数组，groupCount用于将数据分组，每组数据必须是groupCount的倍数
// arr.map() 方法创建一个新数组，其结果是该数组中的每个元素都调用一个提供的函数后返回的结果。https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map
Utils.arrayFillByRandomGroup = function (fillCount, group, groupCount = 2) {
  let groupLength = group.length
  let perGroup = ~~(~~(fillCount / groupLength) / groupCount) * groupCount
  let rest = fillCount - perGroup * groupLength
  let countArray = group.map((e, i) => rest / groupCount > i ? perGroup + groupCount : perGroup)
  let result = countArray.reduce((prev, curr, index) => prev.concat(Array(curr).fill(0).map(e => Object.assign({}, group[index]).valueOf())), [])
  Utils.arrayShuffle(result)
  return result
}

// 将一维数组根据col转换为二维数组
// forEach(item, index){}遍历
// ~~强制转化为数字
// result返回一个二维数组
Utils.arrayToDyadic = function (arr, col) {
  let result = []
  arr.forEach((e, i) => {
    let index = ~~(i / col)
    let mod = i % col
    result[index] || (result[index] = [])
    result[index][mod] = e
  })
  return result
}

export default Utils
