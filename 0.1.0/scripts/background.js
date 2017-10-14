var configs = {}

chrome.storage.local.get(["hosts", "version"], function (items) {
  items = migrate(items)
  configs = items["hosts"] || {}
  console.log(configs);
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
  if (changes['hosts']) {
    configs = changes['hosts'].newValue;
    console.log(configs);
  }
});

function getHeaders(hosts, url, type, method, stage) {
  url = new URL(url)

  // check host
  var c = hosts[url.hostname];
  if (c === undefined) return false;
  c = c.v[url.port] || c.v[""]
  if (c === undefined) return false;
  c = c.v[url.pathname] || c.v[""]
  
  // check headers
  var headers = c.v[{"req": 0, "rsp": 1}[stage]];
  if (headers === undefined) return false;

  // only map filters
  var res = []
  var condition = [method, type, url.protocol]
  headers.forEach(function (header) {
    if (!header[4]) {
      return
    }
    var conditions = header[3];
    for (i = 0; i < condition.length; i++) {
      if (conditions[i].length > 0 &&
        conditions[i].indexOf(condition[i]) < 0) {
        return;
      }
    }
    res.push({name: header[0], value: header[1], separator: header[2]})
  })

  return res.length > 0 ? res : false
}

function updateHeaders(source, dest) {
  if (source.length === 0) return;
  var indexMap = {};
  dest.forEach(function (header, index) {
    indexMap[header.name.toLowerCase()] = index;
  });
  source.forEach(function (header) {
    var index = indexMap[header.name];
    if (index !== undefined) {
      if (header.separator == "") {
        dest[index].value += header.separator + header.value;
      } else {
        dest[index].value = header.value;
      }
    } else {
      dest.push({
        name: header.name,
        value: header.value,
      });
      indexMap[header.name] = dest.length - 1;
    }
  });
}

function cusReqHeaderHandler(details) {
  var headers = getHeaders(configs, details.url, details.type, details.method, "req");
  if (headers) {
    updateHeaders(headers, details.requestHeaders);
  }
  return {
    requestHeaders: details.requestHeaders
  };
}

function cusResHeaderHandler(details) {
  return {
    responseHeaders: details.responseHeaders
  };
}

chrome.webRequest.onBeforeSendHeaders.addListener(
  cusReqHeaderHandler,
  {urls: []},
  ['requestHeaders', 'blocking']
);

chrome.webRequest.onHeadersReceived.addListener(
  cusResHeaderHandler,
  {urls: []},
  ['responseHeaders', 'blocking']
);

console.log(chrome.browserAction.onClicked.addListener(function (activeTab) {
  chrome.tabs.create({url: "/popup.html"});
}));