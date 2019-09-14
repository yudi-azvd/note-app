(window.webpackJsonpnotes=window.webpackJsonpnotes||[]).push([[0],{15:function(e,t,n){e.exports=n(38)},20:function(e,t,n){},38:function(e,t,n){"use strict";n.r(t);var r=n(0),o=n.n(r),a=n(13),c=n.n(a),i=(n(20),n(14)),u=n(2),l=function(e){var t=e.note,n=e.toggleImportance,r=t.important?"make not important":"make important";return o.a.createElement("li",{className:"note"},o.a.createElement("button",{onClick:n},r)," ",t.content)},f=function(e){var t=e.message;return null===t?null:o.a.createElement("div",{className:"error"},t)},s=n(3),m=n.n(s),p=function(){return m.a.get("/api/notes").then(function(e){return e.data})},b=function(e){return m.a.post("/api/notes",e).then(function(e){return e.data})},d=function(e,t){var n=m.a.put("".concat("/api/notes","/").concat(e),t);return console.log("".concat("/api/notes","/").concat(e)),console.log(n.then(function(e){return console.log(e.data)})),n.then(function(e){return e.data})},g=function(){return o.a.createElement("footer",{style:{color:"green",fontStyle:"italic",fontSize:16,flexShrink:0,marginTop:20,padding:"30px",background:"lightgrey"}},o.a.createElement("em",null,"Note app, Department of Computer Science, University of Helsinki 2019"))};function O(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}var v=function(){var e=Object(r.useState)([]),t=Object(u.a)(e,2),n=t[0],a=t[1],c=Object(r.useState)("a new note..."),s=Object(u.a)(c,2),m=s[0],v=s[1],E=Object(r.useState)(!0),h=Object(u.a)(E,2),j=h[0],y=h[1],w=Object(r.useState)(null),S=Object(u.a)(w,2),k=S[0],P=S[1],D=function(e){var t=n.find(function(t){return t.id===e}),r=function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?O(n,!0).forEach(function(t){Object(i.a)(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):O(n).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}({},t,{important:!t.important});console.log("updating note with id",e),d(e,r).then(function(t){a(n.map(function(n){return n.id!==e?n:t}))}).catch(function(r){P("Note ".concat(t.content," was already removed from server")),setTimeout(function(){P(null)},5e3),a(n.filter(function(t){return t.id!==e}))})};Object(r.useEffect)(function(){p().then(function(e){a(e)})},[]);var N=j?n:n.filter(function(e){return e.important});return o.a.createElement("div",{className:"main"},o.a.createElement("div",{className:"content"},o.a.createElement("h1",null,"Notes"),o.a.createElement(f,{message:k}),o.a.createElement("div",null,o.a.createElement("button",{onClick:function(){return y(!j)}},"show ",j?"important":"all")),o.a.createElement("ul",null,N.map(function(e){return o.a.createElement(l,{key:e.id,note:e,toggleImportance:function(){return D(e.id)}})})),o.a.createElement("form",{onSubmit:function(e){e.preventDefault();var t={content:m,date:(new Date).toISOString(),important:!1,id:n.length+1};b(t).then(function(e){a(n.concat(e)),v("")})}},o.a.createElement("input",{value:m,onChange:function(e){v(e.target.value)}}),o.a.createElement("button",{type:"submit"},"save"))),o.a.createElement(g,null))};c.a.render(o.a.createElement(v,null),document.getElementById("root"))}},[[15,1,2]]]);
//# sourceMappingURL=main.66789da5.chunk.js.map