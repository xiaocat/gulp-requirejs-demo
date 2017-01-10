'use strict';
var slice = [].slice;

define(['zepto', 'config', 'cnzz'], function($, config, _czc) {
  var Tools, tools;
  Tools = (function() {
    function Tools() {
      this.$ = $;
      this.ua = window.navigator.userAgent.toLowerCase();
      this.cookie_prefix = '__daka_';
      this._czc = _czc || [];
      this._czc.push(["_setAccount", config.cnzz_id]);
      if (this.isWeixin()) {
        this.openType = '1';
      } else if (this.isIOS()) {
        this.openType = '3';
      } else {
        this.openType = '2';
      }
    }

    Tools.prototype.showMsg = function(text) {
      var $error;
      $error = $('#error-tips');
      $error.html(text).removeClass('hide').addClass('fade-out');
      return setTimeout((function() {
        return $error.html('').removeClass('fade-out').addClass('hide');
      }), 2000);
    };

    Tools.prototype.getUrlParam = function(name) {
      var r, reg;
      reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      r = window.location.search.substr(1).match(reg);
      if (r !== null) {
        return r[2];
      }
      return null;
    };

    Tools.prototype.getUserId = function() {
      var _data, data, userId;
      userId = this.getUrlParam('userId') ? this.getUrlParam('userId') : '';
      if (this.inApp()) {
        try {
          data = window.daka.getMobileApp();
          data = data.replace(/\s/g, '');
          _data = JSON.parse(atob(data));
          if (_data && _data.userId) {
            userId = userId || _data.userId;
          }
        } catch (undefined) {}
      }
      if (this.getCookie(this.cookie_prefix + "user")) {
        userId = userId || this.getCookie(this.cookie_prefix + "user");
      }
      if (userId != null) {
        this.setCookie(this.cookie_prefix + "user", userId);
      }
      return userId;
    };

    Tools.prototype.getUserPhone = function() {
      var _data, data, phone;
      phone = this.getUrlParam('phone') ? this.getUrlParam('phone') : '';
      if (this.inApp()) {
        try {
          data = window.daka.getMobileApp();
          data = data.replace(/\s/g, '');
          _data = JSON.parse(atob(data));
          if (_data && _data.mobileNo) {
            phone = phone || _data.mobileNo;
          }
        } catch (undefined) {}
      }
      if (this.getCookie(this.cookie_prefix + "phone")) {
        phone = phone || this.getCookie(this.cookie_prefix + "phone");
      }
      if (phone != null) {
        this.setCookie(this.cookie_prefix + "phone", phone);
      }
      return phone;
    };

    Tools.prototype.isAndroid = function() {
      return /android/i.test(this.ua);
    };

    Tools.prototype.isIOS = function() {
      return /(iPhone|iPad|iPod|iOS)/i.test(this.ua);
    };

    Tools.prototype.isWeixin = function() {
      return this.ua.match(/MicroMessenger/i) === "micromessenger";
    };

    Tools.prototype.inApp = function() {
      var in_app;
      in_app = 0;
      if (/^(http|https):.+userId=.+/.test(window.location.href)) {
        in_app = 1;
      }
      if (window.daka) {
        in_app = 1;
      }
      if (parseInt(this.getCookie(this.cookie_prefix + "isapp")) === 1) {
        in_app = 1;
      }
      this.setCookie(this.cookie_prefix + "isapp", in_app);
      return in_app;
    };

    Tools.prototype.setCookie = function(name, value) {
      var exp;
      exp = new Date();
      exp.setTime(exp.getTime() + 30 * 24 * 60 * 60 * 1000);
      return document.cookie = name + "=" + (escape(value)) + ";expires=" + (exp.toGMTString());
    };

    Tools.prototype.getCookie = function(name) {
      var arr, reg, result;
      reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
      return result = (arr = document.cookie.match(reg)) ? unescape(arr[2]) : null;
    };

    Tools.prototype._request = function() {
      var callback, data, others, type, url;
      type = arguments[0], url = arguments[1], data = arguments[2], callback = arguments[3], others = 5 <= arguments.length ? slice.call(arguments, 4) : [];
      data = $.param(data);
      return $.ajax({
        url: url,
        type: type,
        data: data,
        dataType: 'json',
        success: function(res) {
          return callback(res);
        },
        error: function(err) {
          return callback({
            error: 1,
            msg: err
          });
        }
      });
    };

    Tools.prototype.getData = function() {
      return this._request.apply(this, ['GET'].concat(slice.call(arguments)));
    };

    Tools.prototype.postData = function() {
      return this._request.apply(this, ['POST'].concat(slice.call(arguments)));
    };

    Tools.prototype.actionLog = function(eventName) {
      if (this.isIOS()) {
        return window.location.href = 'native:event:' + eventName;
      } else {
        try {
          return window.daka.exec('statis', [eventName]);
        } catch (undefined) {}
      }
    };

    Tools.prototype.shareLog = function(shareType, eventType) {
      return $.ajax({
        url: '/logs-mobile-api/shareLogs/webApi/add',
        type: 'POST',
        dataType: 'json',
        data: $.param({
          shareType: shareType,
          eventType: eventType,
          openType: this.openType
        }, {
          success: function(res) {}
        })
      });
    };

    Tools.prototype.pv = function(options) {
      if (this.inApp()) {
        return this.actionLog(options.eventName);
      } else {
        return this.shareLog(options.shareType, 1);
      }
    };

    Tools.prototype.action = function(options) {
      if (this.inApp()) {
        this.actionLog(options.eventName);
      } else if (options.download) {
        this.shareLog(options.shareType, 2);
      }
      return this._czc.push(["_trackEvent", options.actionType, options.pageName, options.actionName]);
    };

    return Tools;

  })();
  return tools = new Tools();
});
