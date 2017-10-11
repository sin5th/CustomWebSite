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
}

runtime = customConfig.runtime()

Vue.component('sub-group', {
  template: `<div>
    <div v-for="(name,nameIndex) in ['Request Headers']">
        <div style="border: solid 10px transparent;padding: 0">
                <button class="btn btn-primary"
                @click="Add(headers, nameIndex)">Add New {{name}}</button>
        </div>
        <div style="border: solid 10px transparent;padding: 0" v-if="SearchFilter(header[3])" v-for="(header, index) in headers[nameIndex]">
            <div style="userSelect: none;padding: 10px;background: white;boxShadow: 0 0 10px #888888;">
                <button class="btn btn-danger" 
                    @click="headers[nameIndex].splice(index,1)" style="float: right">X
                </button>
            
                <input type="checkbox" v-model="header[4]">
                
                <input
                  v-for="_, i in [0,1,2]"
                  v-model="header[i]"
                  :class="header[i]&&[]||['change-input']"
                  @focus="BindComplete((nameIndex+1)*10+i, $event.target)"
                  :placeholder="'+'+config.values[i]">
                
                <div>
                    <div v-for="(tags, i) in header[3]">
                        <button v-for="(tag, tag_i) in tags"
                        @click="tags.splice(tag_i,1)">
                        {{ tag }}
                        </button>
                        
                        <input class="change-input"
                        @keyup.enter="tags.push($event.target.value);$event.target.value=''"
                        @focus="BindComplete(i, $event.target)"
                        :placeholder="'+'+config.types[i]">
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`,
  props: ["headers"],
  computed: {
    config: function () {
      return config
    }
  },
  methods: {
    BindComplete: function () {

    },
    Add: function (p, k) {
      var l = p[k] || []
      l.unshift(runtime.getNewHeader())
      Vue.set(p, k, l)
    },
    SearchFilter: function () {
      return true
    }
  }
})


Vue.component('sub-group-input', {
  // options
  template: `<div class="col-md-12">
    <div class="row group-item">
        <div class="group-item-add">
          <span class="cross show-me"></span>
          <input class="hide-me"
          :placeholder="' Add New ' + suggestions[depth]"
          @keyup.enter="
          Add($event.target.value);
          $event.target.value='';">
        </div>
    </div>

    <div class="row group-item" v-bind:key="k" v-for="(k, _) in Sorted(objs)">
        <div class="col-md-12" :style="itemStyle">
            <button class="btn btn-danger" @click="Delete(k);" style="float: right;">X</button>
            <input v-model="keysMap[k]"
            @keyup.enter="Rename(k, keysMap[k])"
            class="change-input"
            :style="InputStyle(k, keysMap[k], keysMap)"
            placeholder="---"
            >
            <sub-group-input v-if="depth > 0" :depth="depth-1" :objs="objs[k].v"></sub-group-input>
            <sub-group v-else :headers="objs[k].v"></sub-group>
        </div>
    </div>
</div>`,
  props: ["objs", "depth"],
  data: function () {
    return {
      suggestions: ['Uri', 'Port', 'Host'],
      keysMap: {},
    }
  },
  computed: {
    itemStyle: function () {
      return {
        background: ["#4caf50", "#8bc34a", "#cddc39"][this.depth],
      }
    },
  },
  watch: {
    objs: function (n, o) {
      if (Object.keys(o).length == 0) {
        var keysMap = this.keysMap
        Object.keys(n).forEach(function (t) {
          Vue.set(keysMap, t, t)
        })
      }
    }
  },
  methods: {
    InputStyle: function (o, n, exists) {
      var r = {
        textAlign: 'center',
      };
      n = n || "";
      o = o || "";
      if (n != o) {
        r.borderColor = 'red'
        if (exists[n]) {
          r.color = 'red'
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
      Vue.set(this.objs, n, runtime.getNewHost())
      Vue.set(this.keysMap, n, n)
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
})


var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    user: customConfig.load(),
    runtime: customConfig.runtime(),
    config: config,
    searchFilter: {
      "filters": ["", "", ""]
    },
    autoComplete: {
      "type": 0,
      "ele": undefined
    }
  },
  methods: {
    Sorted: function (objs) {
      return Object.keys(objs).sort(function (a, b) {
        return objs[a].p < objs[b].p
      })
    },

    Save: customConfig.save,
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