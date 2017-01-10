"use strict";

require(['config.js?v=' + new Date().getTime().toString().slice(0,6)], function(conf){
  requirejs.config({
    baseUrl: "scripts",
    paths: {
      "config": "../../config",
      "zepto": "libs/zepto",
      "dot": "libs/doT",
      "tools": "common/tools",
      "wxshare": "common/wxshare",
      "index":  "controls/index",
      'jweixin': "https://res.wx.qq.com/open/js/jweixin-1.0.0",
      'cnzz': "https://s11.cnzz.com/z_stat.php?id=1254000558&web_id=1254000558",
    },
    shim: {
      "zepto": {
        exports: "$"
      },
      "tools": {
        deps: ["zepto"]
      },
      "cnzz": {
        exports: "_czc"
      }
    },
    urlArgs: function(name, url){
      var version = '1.0';
      if(url.indexOf('http') !== -1) return '';
      version = (this.verMap && this.verMap[name]) || version;
      return 'v=' + version;
    }
  });

  require([document.body.id], function(page) {
    return page.init();
  });
});
