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
module.exports = {
  blocks: {
    vux: {
      process: function process(block) {
        var data = parse(block.body);
        var components = data.components;
        components = block.kwargs.components || data.components;
        var height = block.kwargs.height ? block.kwargs.height : 100;
        var width = block.kwargs.width ? block.kwargs.width : '100%';

        var url = 'https://vux.li/api/v1/demo.html?components=' + encode(components) + '&template=' + encode(data.template) + '&style=' + encode(data.style) + '&script=' + encode(data.script);
        var html = '<div style=""><iframe src="' + url + '" frameborder="0" scrolling="no" height="' + height + '" width="' + width + '" style="border:none;overflow:hidden;"></iframe></div>';
        for (var i in data) {
          if (i === 'template' && data[i]) {
            html += '<p style="color:#ccc;margin-bottom:0;margin-top:10px;">template</p><pre style="margin:0;padding:0 10px;"><code class="language-html">' + addTag(data[i], 'template') + '</code></pre>';
          }
          if (i === 'script' && data[i]) {
            html += '<p style="color:#ccc;margin-bottom:0;margin-top:10px;">script</p><pre style="margin:0;padding:0 10px;"><code class="language-javascript">' + addTag(data[i], 'script') + '</code></pre>';
          }
          if (i === 'style' && data[i]) {
            html += '<p style="color:#ccc;margin-bottom:0;margin-top:10px;">style</p><pre style="margin:0;padding:0 10px;"><code class="language-css">' + addTag(data[i], 'style') + '</code></pre>';
          }
        }
        return html;
      }
    }
  }
};