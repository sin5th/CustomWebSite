Vue.component('name-input', {
  // options
  // template: '<div>A custom component!</div>'
  props:["hosts","host"]
})


var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    user: customConfig.load(),
    runtime: customConfig.runtime(),
    config: {
      values: ['name', 'value', 'spliter'],
      types: ['method', 'type', 'protocol'],
      autoComplete: {
        0: [
          'GET',
          'POST',
          'DELETE',
          'UPDATE',
          'PUT',
          'HEAD',
          'OPTIONS',
          'TRACE',
          'CONNECT'],
        1: [
          'main_frame',
          'sub_frame',
          'stylesheet',
          'script',
          'image',
          'object',
          'xmlhttprequest',
          'other'],
        2: [
          'https:',
          'http:',
          'ftp:',
          'file:',
          'ws:',
          'wss:',
          'chrome-extension:'],
        10: [
          'Authorization',
          'Cache-Control',
          'Connection',
          'Content-Length',
          'Host',
          'If-Modified-Since',
          'If-None-Match',
          'If-Range',
          'Partial-Data',
          'Pragma',
          'Proxy-Authorization',
          'Proxy-Connection',
          'Transfer-Encoding',
          'Accept',
          'Accept-Charset',
          'Accept-Encoding',
          'Accept-Language',
          'Accept-Datetime',
          'Cookie',
          'Content-MD5',
          'Content-Type',
          'Date',
          'Expect',
          'From',
          'If-Match',
          'If-Unmodified-Since',
          'Max-Forwards',
          'Origin',
          'Range',
          'Referer',
          'TE',
          'User-Agent',
          'Upgrade',
          'Via',
          'Warning',
          'X-Forwarded-For',
          'X-Forwarded-Host',
          'X-Forwarded-Proto',
          'Front-End-Https',
          'X-Http-Method-Override',
          'X-ATT-DeviceId',
          'X-Wap-Profile',
          'X-UIDH',
          'X-Csrf-Token'],
        11: [],
        12: [','],
        20: [
          'Access-Control-Allow-Origin',
          'Accept-Patch',
          'Accept-Ranges',
          'Age',
          'Allow',
          'Connection',
          'Content-Disposition',
          'Content-Encoding',
          'Content-Language',
          'Content-Length',
          'Content-Location',
          'Content-MD5',
          'Content-Range',
          'Content-Type',
          'Date',
          'ETag',
          'Expires',
          'Last-Modified',
          'Link',
          'Location',
          'P3P',
          'Pragma',
          'Proxy-Authenticate',
          'Public-Key-Pins',
          'Refresh',
          'Retry-After',
          'Server',
          'Set-Cookie',
          'Strict-Transport-Security',
          'Trailer',
          'Transfer-Encoding',
          'Upgrade',
          'Vary',
          'Via',
          'Warning',
          'WWW-Authenticate',
          'X-Frame-Options',
          'X-XSS-Protection',
          'Content-Security-Policy',
          'X-Content-Type-Options',
          'X-Powered-By',
          'X-UA-Compatible',
          'X-Content-Duration',
          'X-Content-Security-Policy',
          'X-WebKit-CSP',
        ],
        21: [],
        22: [',']
      }
    },
    searchFilter: {
      "filters": ["", "", ""]
    },
    autoComplete: {
      "type": 0,
      "ele": undefined
    }
  },
  methods: {
    Save: customConfig.save,
    AddHost: function (host) {
      var hosts = this.user.hosts;
      if (!hosts) {
        return
      }
      if (host == "") {
        return
      }
      if (hosts[host]) {
        return
      }
      this.$set(this.user.hosts, host, this.runtime.getNewHost())
    },
    AddItem: function (parent) {
      parent.push(this.runtime.getNewHeader())
    },
    SearchFilter: function (tags) {
      var filters = this.searchFilter.filters;
      for (var i = 0; i < filters.length; i++) {
        var filter = filters[i];
        if (filter !== "" && tags[i].length > 0 && tags[i].indexOf(filter) < 0) {
          return false
        }
      }
      return true
    },
    Log: function (v) {
      console.log(v)
    },
    AutoComplete: function (value) {
      var a = this.autoComplete;
      if (a.ele !== undefined) {
        a.ele.value = value;
        a.ele.dispatchEvent(new Event('input'));
        a.ele.focus();
      }
    },
    BindComplete: function (type, ele) {
      var a = this.autoComplete;
      a.type = type;
      a.ele = ele;
    },
    FilterComplete: function () {
      var a = this.autoComplete;
      var res = this.config.autoComplete[a.type];
      // if (a.ele) {
      //     var value = a.ele.value;
      //     res = res.filter(function (v) {
      //         return v.startsWith(value);
      //     });
      // }
      return res;
    }
  }
});