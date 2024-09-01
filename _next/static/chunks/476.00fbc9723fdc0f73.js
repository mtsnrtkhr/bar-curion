"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[476],{6476:function(t,n,e){e.r(n),e.d(n,{default:function(){return s}});var a=e(7437),c=e(2265),i=e(4576),r=t=>{let{data:n}=t,e=(0,c.useRef)();return(0,c.useEffect)(()=>{e.current&&(e.current.d3Force("charge").strength(-300),e.current.d3Force("link").distance(50))},[]),(0,a.jsx)("div",{style:{width:"100%",height:"600px"},children:(0,a.jsx)(i.f$,{ref:e,graphData:n,nodeLabel:"name",nodeColor:t=>"cocktail"===t.group?"#ff6347":"#4682b4",nodeRelSize:6,linkColor:t=>"similarity"===t.type?"#ff9999":"#999999",linkWidth:t=>t.value,onNodeClick:t=>{console.log("Clicked node:",t)}})})},o=e(6073);function s(t){let{searchTerm:n}=t,[e,i]=(0,c.useState)(null),[s,l]=(0,c.useState)(null);return((0,c.useEffect)(()=>{(async function(){await (0,o.k2)();let t=await (0,o.Fu)();i(t),l(t)})()},[]),(0,c.useEffect)(()=>{if(e&&n){let t=n.toLowerCase();l({nodes:e.nodes.filter(n=>n.name.toLowerCase().includes(t)),links:e.links.filter(n=>{let a=e.nodes.find(t=>t.id===n.source),c=e.nodes.find(t=>t.id===n.target);return(null==a?void 0:a.name.toLowerCase().includes(t))||(null==c?void 0:c.name.toLowerCase().includes(t))})})}else l(e)},[e,n]),s)?(0,a.jsx)(r,{data:s}):(0,a.jsx)("p",{children:"グラフデータを読み込んでいます..."})}},5170:function(t,n,e){e.d(n,{K:function(){return a}});let a=t=>"".concat("/bar-curion").concat(t)},6073:function(t,n,e){e.d(n,{Fu:function(){return w},wb:function(){return p},iM:function(){return m},k2:function(){return g},s8:function(){return y}});var a=e(9879),c=e(354),i=e(5170),r=e(3750),o=e(7934);async function s(t,n){let e=function(t){let n=[];function e(t,n){let e=arguments.length>2&&void 0!==arguments[2]&&arguments[2];if("alcohl_contents"==t);else{if("ingredients"==t){let a=n.map(t=>t.startsWith("*")&&t.endsWith("*")?"val.toString().match(/".concat(t.slice(1,-1),"/i)"):t.startsWith("*")?"val.toString().match(/".concat(t.slice(1),"$/i)"):t.endsWith("*")?"val.toString().match(/^".concat(t.slice(0,-1),"/i)"):'val.toString() == "'.concat(t,'"')).join(" || ");return e?"!@.".concat(t,".some(function($i){return (Object.values($i).some(function(val) { return (").concat(a,") }))})"):"@.".concat(t,".some(function($i){return (Object.values($i).some(function(val) { return (").concat(a,") }))})")}if(t.startsWith("ingredients.")){let a=t.split(".")[1],c=n.map(t=>t.startsWith("*")&&t.endsWith("*")?"$i.".concat(a,".match(/").concat(t.slice(1,-1),"/i)"):t.startsWith("*")?"$i.".concat(a,".match(/").concat(t.slice(1),"$/i)"):t.endsWith("*")?"$i.".concat(a,".match(/^").concat(t.slice(0,-1),"/i)"):"$i.".concat(a,' == "').concat(t,'"')).join(" || ");return e?"!@.ingredients.some(function($i){ return (".concat(c,") })"):"@.ingredients.some(function($i){ return (".concat(c,") })")}{let a=n.map(n=>n.startsWith("*")&&n.endsWith("*")?"@.".concat(t,".match(/").concat(n.slice(1,-1),"/i)"):n.startsWith("*")?"@.".concat(t,".match(/").concat(n.slice(1),"$/i)"):n.endsWith("*")?"@.".concat(t,".match(/^").concat(n.slice(0,-1),"/i)"):"@.".concat(t,' == "').concat(n,'"')).join(" || ");return e?"!(".concat(a,")"):"(".concat(a,")")}}}return Object.entries(t).forEach(t=>{let[a,c]=t;console.log("key:",a),console.log("values:",c,Array.isArray(c));let i=!1;"exclude"===a?0!==Object.keys(c).length&&(i=!0,a=Object.keys(c)[0],c=c[a],console.log("key:",a),console.log("values:",c),n.push("".concat(e(a,c,i)))):n.push("".concat(e(a,c,i)))}),n.length>0?"$[?(".concat(n.join(" && "),")]"):"$[*]"}(r.parse(t,{keywords:["ingredients","name","ingredients.name","ingredients.type","ingredients.amount","instructions","category"],ranges:["alcohol_content"],alwaysArray:!0,offsets:!1}));return console.log("JsonPath Query:",e),(0,o.j)({path:e,json:n,eval:"native"}).map(t=>t.id)}let l=null,u=null,d=null;async function f(t){let n=new a.z,e=new c.P(n,{});try{let n;{let e=await fetch((0,i.K)(t));if(!e.ok)throw Error("HTTP error! status: ".concat(e.status));n=await e.json()}e.data=n,await e.write()}catch(t){throw console.error("Error in initDb:",t),t}return e}async function h(t){let n=t.data.cocktails,e=t.data.ingredients;return n.map(t=>({...t,ingredients:t.ingredients.map(t=>{let n=e.find(n=>n.id===t.ingredient_id);return n?{...t,...n,products:n.products.map(t=>({...t,product_id:t.product_id}))}:t})}))}async function g(){l||(l=await f("/data/recipes.json")),u||(u=await f("/data/graph-data.json")),d||(d=await h(l))}async function m(){return await g(),l.data.cocktails}async function p(t){return await g(),l.data.cocktails.find(n=>n.id===parseInt(t))||null}async function w(){return await g(),u.data}async function y(t){let n=arguments.length>1&&void 0!==arguments[1]&&arguments[1];await g();let e=l,a=e.data.cocktails,c=e.data.ingredients;if(n)try{let n=await s(t,d);console.log(n);let e=Array.from(n).map(t=>p(t)),a=await Promise.all(e);return console.log(a),a}catch(t){return console.error("Advanced search error:",t),[]}else{let n=t.match(/"[^"]+"|[^\s]+/g)||[];return a.filter(t=>n.every(n=>{let e=n.startsWith('"')&&n.endsWith('"'),a=n.replace(/^"|"$/g,"").toLowerCase(),i=t=>{if("string"!=typeof t)return!1;let n=t.toLowerCase();return e?n===a:n.includes(a)};return i(t.name)||i(t.category)||t.ingredients.some(t=>i(t.name))||c.some(n=>i(n.name)&&t.ingredients.some(t=>t.id===n.id))}))}}}}]);