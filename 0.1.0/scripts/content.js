var customjs = {
  end: [
    // {type: 'style', content: "body {background:black;}"},
    {type: 'script', content: "console.log('hi')"},
    {
      type: 'isolate',
      content: "console.log(typeof $)",
      include: "https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.2/vue.js"
    },
  ]
};

if (customjs[env]) {
  customjs[env].forEach(function (t) {
    try {
      switch (t.type) {
        case "script":
          var el = document.createElement("script")
          el.src = 'data:text/javascript;base64,' + btoa(t.content);
          if (document.body) {
            document.body.appendChild(el)
          }
          break
        case "style":
          var el = document.createElement("link")
          el.rel = "stylesheet";
          el.href = 'data:text/css;base64,' + btoa(t.content);
          if (document.head) {
            document.head.appendChild(el)
          }
          break
        case "isolate":
          var contents = [t.content];
          chrome.storage.local.get(["scripts"], function (items) {
            contents.unshift(items.scripts.jquery);
            (new Function(contents.join("\n")))()
          })
          // content = [t.content]
          break
      }
    } catch (e) {
      console.log(e)
    }
  });
}