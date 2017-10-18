// 0 -> 1
var migrate_funcs = [
  function (items) { // 0
    items.hosts = {};
    return items
  },
  function (items) { // add port&path support
    items.hosts = items.hosts || {};
    var hosts = items.hosts;
    Object.keys(hosts).forEach(function (k) {
      hosts[k] = {"": {"": hosts[k]}}
    });
    return items
  },
  function (items) { // add priority support
    function addPriority(objs, depth) {
      if (!('forEach' in objs)) {
        var p = 0;
        Object.keys(objs).forEach(function (k) {
          if (depth > 0) addPriority(objs[k], depth - 1);
          objs[k] = {
            p: p++,
            v: objs[k]
          }
        })
      }
    }

    addPriority(items.hosts, 2);
    // console.log(JSON.stringify(items, null, 4))
    return items
  },
  function (items) {
    function modifyTag(objs) {
      Object.keys(objs).forEach(function (k) {
        if (!('forEach' in objs[k])) {
          modifyTag(objs[k].v)
        } else {
          objs[k].forEach(function (obj) {
            obj[3].forEach(function (tags, i) {
              var map = {};
              tags.forEach(function (tag) {
                map[tag] = true;
              });
              obj[3][i] = map;
            })
          })
        }
      })
    }

    modifyTag(items.hosts);
    return items
  },
  function (items) {
    items.scripts = {};
    return items
  },
  function (items) {
    items.styles = {};
    return items
  },
];

function migrate(items) {
  try {
    items.version = items.version || 1;
    items.version = items.version > migrate_funcs.length ? 0 : items.version;
    if (items.version == 0) {
      items = {version: 0}
    }
  } catch (err) {
    items = {}
  }

  try {
    for (i = items.version; i < migrate_funcs.length; i++) {
      items = migrate_funcs[i](items) || items;
      items.version = i + 1;
    }
  } catch (err) {
    console.log(err)
    return migrate({})
  }

  return items
}

if (typeof chrome == "undefined") {
  chrome = {}
}

// fake data
chrome.storage = chrome.storage || {
    local: {
      set: function (items, callback) {
        console.log(JSON.stringify(items));
        window.alert("不支持保存");
      },
      get: function (key, callback) {
        callback({
          "hosts": {
            "www.baidu.com": [
              [ // request
                [
                  "Foo", // name
                  "bar", // value
                  "", // spliter
                  [ // filters
                    [ // method
                      "GET"
                    ],
                    [ // "type"
                      "main_frame"
                    ],
                    [ // "protocol"
                      "https"
                    ]
                  ],
                  true // checked
                ]
              ],
              [ // response

              ]
            ]
          },
          "version": 1
        });
      }
    }
  };


var customConfig = function () {
  var user = {
    "hosts": {},
    "scripts": {},
    "styles": {},
    "saveTime": undefined,
    "version": "",
  };

  var runtime = {
    saveTime: undefined,
    getNewHost: function () {
      return {
        p: new Date().getTime(),
        v: {}
      }
    },
    getNewHeader: function () {
      return ["", "", "", [{}, {}, {}], true]
    }
  };


  return {
    "save": function () {
      if (runtime.saveTime) {
        user.saveTime = new Date().getTime();
        chrome.storage.local.set(user, function () {
          runtime.saveTime = user.saveTime
        });
        return true
      }
      return false
    },
    "load": function () {
      chrome.storage.local.get(null, function (items) {
        items = migrate(items);
        runtime.saveTime = items.saveTime || 1;
        Object.keys(items).forEach(function (k) {
          user[k] = items[k];
        });
      });
      return user
    },
    "runtime": function () {
      return runtime
    }
  };
}();


var config = {
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
      'CONNECT',
    ],
    1: [
      'xmlhttprequest',

      'main_frame',
      'sub_frame',
      'stylesheet',
      'script',
      'image',
      'object',
      'other',
    ],
    2: [
      'chrome-extension:',
      'https:',
      'file:',
      'http:',
      'ftp:',
      'ws:',
      'wss:',
    ],
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
      'x-Forwarded-For',
      'x-Forwarded-Host',
      'x-Forwarded-Proto',
      'Front-End-Https',
      'x-Http-Method-Override',
      'x-ATT-DeviceId',
      'x-Wap-Profile',
      'x-UIDH',
      'x-Csrf-Token'],
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
      'x-Frame-Options',
      'x-XSS-Protection',
      'Content-Security-Policy',
      'x-Content-Type-Options',
      'x-Powered-By',
      'x-UA-Compatible',
      'x-Content-Duration',
      'x-Content-Security-Policy',
      'x-WebKit-CSP',
    ],
    21: [],
    22: [',']
  }
};

var runtime = customConfig.runtime();