'use strict';
define(['dot', 'tools', 'wxshare'], function(doT, Tools, WxShare) {
  var $ = Tools.$;
  var page;
  return page = {
    init: function() {
      var wx_share = new WxShare(window.share.title, window.share.desc, window.share.icon, window.share.url);
      $('.container').html(this.render('tpl-demo'));

      $('.container').on('click', '.btn', function(e){
        alert(navigator.userAgent);
      });
    },
    render: function(tmp, data) {
      var _tmp;
      _tmp = doT.template($("#" + tmp).text());
      return _tmp(data);
    }
  };
});
