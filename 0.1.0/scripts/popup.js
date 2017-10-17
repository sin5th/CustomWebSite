Vue.config.productionTip = false;

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

Vue.component('sub-group', {
  template: `<div class="group">
    <template v-for="(type,typeIndex) in ['Request Headers']">
        <button class="btn btn-primary" @click="Add(headers, typeIndex)">
            Add New {{type}}
        </button>
        <div class="group-item" :class="'group-item-0-'+typeIndex"
             v-if="SearchFilter(header[3])"
             v-for="(header, index) in headers[typeIndex]">

            <div class="group">
                <input type="checkbox" v-model="header[4]">

                <input v-for="_, i in [0,1,2]"
                       v-model="header[i]"
                       class="change-input"
                       @focus="BindComplete((typeIndex+1)*10+i, $event.target)"
                       :placeholder="'+'+config.values[i]">


                <div class="group group-item-tags">
                    <div class="group-item-add" v-for="(tags, i) in candidateTags.groups">
                        <button :class="header[3][i][tag]?['enable']:['disable']"
                                @click="ToggleTag(header[3][i], tag)"
                                v-for="tag in tags">
                            {{tag}}
                        </button>
                    </div>
                </div>
            </div>

            <button class="btn btn-danger"
                    @click="headers[typeIndex].splice(index,1)">
                x
            </button>
        </div>
    </template>
</div>`,
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
  template: `<div class="group">
    <div class="group-item-add">
        <input class="hide-me change-input"
               :placeholder="'Add New ' + suggestions[depth]"
               @keyup.enter="Add($event.target.value);$event.target.value='';">
        <span class="show-me"></span>
    </div>

    <div class="group-item" :class="'group-item-'+depth" v-bind:key="group+'/'+k" v-for="(k, _) in Sorted(objs)">
        <input v-model="keysMap[k]"
               @keyup.enter="Rename(k, keysMap[k])"
               class="change-input"
               :class="InputClass(k, keysMap)"
               placeholder="---">
        <sub-group-input v-if="depth > 0" :depth="depth-1" :objs="objs[k].v" :group="group+'/'+k"></sub-group-input>
        <sub-group v-else :headers="objs[k].v"></sub-group>
        <button class="btn btn-danger" @click="Delete(k);">x</button>
    </div>
</div>`,
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
      if (exists[o] == undefined) {
        Vue.set(exists, o, o)
      }
      var n = exists[o];
      if (n != o) {
        if (typeof exists[n] != "undefined") {
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
  el: '#app',
  data: function () {
    var user = customConfig.load();
    return {
      message: 'Hello Vue!',
      user: user,
      userLast: JSON.parse(JSON.stringify(user)),
      config: config,
      searchFilter: {
        "filters": ["", "", ""]
      },
      autoComplete: {
        "type": 0,
        "ele": undefined
      },
      tab: "scripts",
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