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
  }
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
    "saveTime": undefined,
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
      chrome.storage.local.get(["hosts", "saveTime", "version"], function (items) {
        items = migrate(items);
        runtime.saveTime = items.saveTime || 1;
        Object.keys(items).forEach(function (k) {
          user[k] = items[k];
        });
        console.log("load")
      });
      return user
    },
    "runtime": function () {
      return runtime
    }
  };
}();

