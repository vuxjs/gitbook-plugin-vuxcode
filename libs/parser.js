var list = ['template', 'script', 'style', 'components']
var regs = {
  templateReg: /<template[^>]*>([\s\S]*?)<\/template>/,
  scriptReg: /<script[^>]*>([\s\S]*?)<\/script>/,
  styleReg: /<style[^>]*>([\s\S]*?)<\/style>/,
  componentsReg: /<components[^>]*>([\s\S]*?)<\/components>/
}

module.exports = function (str) {
  var data = {}
  list.forEach(function (one) {
    var _rs = str.match(regs[one + 'Reg'])
    data[one] = _rs && _rs[1]? _rs[1]: ''
    data[one] = data[one].replace(/^\s+|\s+$/g,'')
    if(one==='template'){
      data[one] = data[one].replace('<<','{{').replace('>>','}}')
    }
  })
  return data
}

function removeBreak (str) {
  return str.replace(/(\r\n|\n|\r)/gm, '')
}