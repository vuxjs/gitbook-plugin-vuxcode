'use strict';

var parse = require('./libs/parser');

function addTag(code, tag) {
  var html = '' + slash(code);
  return html;
}

function slash(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function encode(str) {
  return encodeURIComponent(str);
}

var reg = /``` vux*([\s\S]*?)```/g

module.exports = {
  hooks: {
    'page:before': function (page) {
      var isProduct = /vux-doc/.test(page.rawPath)
      page.content = page.content.replace(reg, function (_match) {
        // get args
        var height = 100
        var width = '100%'
        var components = ''
        var raw = 'false'
        var def = _match.split('\n')[0].replace('``` vux', '')
        def = def.replace(/^\s+/, '').replace(/\s+$/, '')

        if (def.length) {
          def.split(' ').forEach(function (one) {
            var _split = one.split('=')
            if (_split[0] === 'height') {
              height = _split[1]
            }
            if (_split[0] === 'width') {
              width = _split[1]
            }
            if (_split[0] === 'components') {
              components = _split[1]
            }
            if (_split[0] === 'raw') {
              raw = _split[1]
            }
          })
        }
        if (raw === 'false') {
          var code = _match.split('\n').slice(1, -1).join('\n')
          var html = buildHTML(code, width, height, components, isProduct)
          return html
        } else {
          return _match.replace(' raw=true', '')
        }

      })
      return page;
    }
  }
};

function buildHTML(code, width, height, components, isProduct) {
  var data = parse(code);
  var url = 'https://vux.li/api/v1/demo.html?components=' + encode(components) + '&template=' + encode(data.template) + '&style=' + encode(data.style) + '&script=' + encode(data.script);
  var html = `
  <div style="padding-bottom:10px;position:relative">
    <iframe src="${url}" frameborder="0" scrolling="no" height="${height}" width="${width}" style="border:none;overflow:hidden;"></iframe>
    <a href="${url}" target="_blank" style="position:absolute;right:5px;top: -20px;color:#ccc;font-size:12px;">新窗口打开</a>
  </div>
  `
  for (var i in data) {
    if (i === 'template' && data[i]) {
      html += '<p class="vux-code-box vux-code-box-template" style="color:#ccc;margin-bottom:0;margin-top:10px;">template</p><pre style="margin:0;padding:0 10px;"><code class="language-html">' + addTag(data[i], 'template') + '</code></pre>';
    }
    if (i === 'script' && data[i]) {
      html += '<p class="vux-code-box vux-code-box-script" style="color:#ccc;margin-bottom:0;margin-top:10px;">script</p><pre style="margin:0;padding:0 10px;"><code class="language-javascript">' + addTag(data[i], 'script') + '</code></pre>';
    }
    if (i === 'style' && data[i]) {
      html += '<p class="vux-code-box vux-code-box-style" style="color:#ccc;margin-bottom:0;margin-top:10px;">style</p><pre style="margin:0;padding:0 10px;"><code class="language-css">' + addTag(data[i], 'style') + '</code></pre>';
    }
  }
  return html;
}