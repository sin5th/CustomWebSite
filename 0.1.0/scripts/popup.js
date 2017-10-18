Vue.config.productionTip = false;

// register modal component
Vue.component('modal', {
  template: '#modal-template'
});

Vue.component('sub-group', {
  template: '#sub-group',
  props: ["headers"],
  computed: {
    candidateTags: function () {
      var groups = [];
      var map = {};
      [0, 1, 2].forEach(function (i) {
        config.autoComplete[i].forEach(function (tag) {
          map[tag] = i
        });
        groups[i] = config.autoComplete[i]
      });
      return {
        groups: groups,
        map: map,
      }
    },
    config: function () {
      return config
    },
  },
  methods: {
    Log: function () {
      console.log(JSON.stringify(this.objs))
    },
    BindComplete: function () {

    },
    ToggleTag: function (p, k) {
      if (p[k]) {
        Vue.delete(p, k)
      } else {
        Vue.set(p, k, true)
      }
    },
    Add: function (p, k) {
      var l = p[k] || [];
      l.unshift(runtime.getNewHeader());
      Vue.set(p, k, l);
    },
    SearchFilter: function () {
      return true
    }
  }
});


Vue.component('sub-group-input', {
  // options
  template: "#sub-group-input",
  props: ["objs", "depth", "group"],
  data: function () {
    return {
      suggestions: ['Uri', 'Port', 'Host'],
      keysMap: {},
    }
  },
  methods: {
    InputClass: function (o, exists) {
      var r = [];

      o = o || "";
      if (exists[o] === undefined) {
        Vue.set(exists, o, o)
      }
      var n = exists[o];
      if (n !== o) {
        if (typeof exists[n] !== "undefined") {
          r.push("input-error")
        } else {
          r.push("input-warning")
        }
      }
      return r
    },
    Rename: function (o, n) {
      if (this.objs[n]) {
        return
      }

      Vue.set(this.objs, n, this.objs[o]);
      Vue.set(this.keysMap, n, n);

      Vue.delete(this.objs, o);
      Vue.delete(this.keysMap, o);
    },
    Add: function (n) {
      if (this.objs[n]) {
        return
      }
      Vue.set(this.objs, n, runtime.getNewHost());
      Vue.set(this.keysMap, n, n);
    },
    Delete: function (o) {
      Vue.delete(this.objs, o);
      Vue.delete(this.keysMap, o);
    },
    Sorted: function (objs) {
      return Object.keys(objs).sort(function (a, b) {
        return objs[a].p < objs[b].p
      })
    },

  },
});

function compareObject(o1, o2) {
  if (typeof o1 != typeof o2) return false;
  if (typeof o1 == 'object') {
    var compared = {};
    for (var o in o1) {
      if (!compareObject(o1[o], o2[o])) return false;
      compared[o] = true;
    }
    for (var o in o2) {
      if (!compared[o]) {
        if (!compareObject(o1[o], o2[o])) return false;
      }
    }
    return true;
  } else {
    return o1 === o2;
  }
}

var app = new Vue({
  preserveWhitespace: true,
  el: '#app',
  data: function () {
    var user = customConfig.load();
    return {
      user: user,
      userLast: JSON.parse(JSON.stringify(user)),
      tab: "scripts",
      showModal: false,
      newAddDict: [{
        name: "",
        content: ""
      }, {
        name: "",
        content: ""
      }],
      config: config,
      searchFilter: {
        "filters": ["", "", ""]
      },
      autoComplete: {
        "type": 0,
        "ele": undefined
      },

    }
  },
  directives: {
    focus: {
      // 指令的定义---
      inserted: function (el) {
        el.focus()
      }
    }
  },
  watch: {
    user: {
      handler: (function () {
        var i = 0;
        return function () {
          if (i === 0) {
            i++;
            this.Save(true)
          }
        }
      })(),
      deep: true
    }
  },
  computed: {
    changed: function () {
      return !compareObject(this.user, this.userLast)
    }
  },
  methods: {
    Changed: function () {
      // this.changed = true;
    },
    Save: function (update) {
      if (update || customConfig.save()) {
        this.userLast = JSON.parse(JSON.stringify(this.user));
        this.saveTime = runtime.saveTime;
      }
    },
    Reset: function () {
      this.user = JSON.parse(JSON.stringify(this.userLast));
    },
    SearchFilter: function (tags) {
      var filters = this.searchFilter.filters;
      for (var i = 0; i < filters.length; i++) {
        var filter = filters[i];
        if (filter !== "" && tags[i].length > 0 && tags[i].indexOf(filter) < 0) {
          return false;
        }
      }
      return true;
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
      if (a.ele) {
        var value = a.ele.value;
        res = res.filter(function (v) {
          return v.startsWith(value);
        });
      }
      return res;
    }
  }
});