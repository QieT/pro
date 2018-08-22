 function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 截取wboll.com带的cdn前缀和后缀样式库
 * 不截取腾讯cdn
 *
 * @param string url
 * @returns
 */
function getNoOSSimg(url) {
  if (!url) return '';
  if (url.indexOf('qlogo.cn') !== -1) return url;
  return url.slice(url.indexOf('.com')+4, url.indexOf('@!'));
}

module.exports = {
  formatTime: formatTime,
  getNoOSSimg: getNoOSSimg
}
