(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[3],{3261:function(e,t,n){Promise.resolve().then(n.bind(n,9453)),Promise.resolve().then(n.t.bind(n,231,23))},9453:function(e,t,n){"use strict";n.d(t,{default:function(){return s}});var r=n(7437),i=n(2265),u=n(6463),c=n(8614),o=n(5566);function s(e){let{children:t}=e,[n,s]=(0,i.useState)(!1),l=(0,u.useRouter)();return((0,i.useEffect)(()=>{(async function(){if("true"===o.env.NEXT_PUBLIC_SKIP_AUTH){s(!0);return}try{(await fetch("/api/auth/check")).ok?s(!0):l.push("/login")}catch(e){console.error("Authorization check failed:",e),l.push("/login")}})()},[l]),n)?(0,r.jsx)(c.Z,{children:t}):(0,r.jsx)("div",{children:"Checking authorization..."})}},7138:function(e,t,n){"use strict";n.d(t,{default:function(){return i.a}});var r=n(231),i=n.n(r)},6463:function(e,t,n){"use strict";var r=n(1169);n.o(r,"useRouter")&&n.d(t,{useRouter:function(){return r.useRouter}})},5566:function(e){var t,n,r,i=e.exports={};function u(){throw Error("setTimeout has not been defined")}function c(){throw Error("clearTimeout has not been defined")}function o(e){if(t===setTimeout)return setTimeout(e,0);if((t===u||!t)&&setTimeout)return t=setTimeout,setTimeout(e,0);try{return t(e,0)}catch(n){try{return t.call(null,e,0)}catch(n){return t.call(this,e,0)}}}!function(){try{t="function"==typeof setTimeout?setTimeout:u}catch(e){t=u}try{n="function"==typeof clearTimeout?clearTimeout:c}catch(e){n=c}}();var s=[],l=!1,a=-1;function f(){l&&r&&(l=!1,r.length?s=r.concat(s):a=-1,s.length&&h())}function h(){if(!l){var e=o(f);l=!0;for(var t=s.length;t;){for(r=s,s=[];++a<t;)r&&r[a].run();a=-1,t=s.length}r=null,l=!1,function(e){if(n===clearTimeout)return clearTimeout(e);if((n===c||!n)&&clearTimeout)return n=clearTimeout,clearTimeout(e);try{n(e)}catch(t){try{return n.call(null,e)}catch(t){return n.call(this,e)}}}(e)}}function d(e,t){this.fun=e,this.array=t}function p(){}i.nextTick=function(e){var t=Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];s.push(new d(e,t)),1!==s.length||l||o(h)},d.prototype.run=function(){this.fun.apply(null,this.array)},i.title="browser",i.browser=!0,i.env={},i.argv=[],i.version="",i.versions={},i.on=p,i.addListener=p,i.once=p,i.off=p,i.removeListener=p,i.removeAllListeners=p,i.emit=p,i.prependListener=p,i.prependOnceListener=p,i.listeners=function(e){return[]},i.binding=function(e){throw Error("process.binding is not supported")},i.cwd=function(){return"/"},i.chdir=function(e){throw Error("process.chdir is not supported")},i.umask=function(){return 0}},8614:function(e,t,n){"use strict";n.d(t,{Z:function(){return u}});var r=n(7437),i=n(7138);function u(e){let{children:t}=e;return(0,r.jsxs)("div",{className:"container mx-auto px-4",children:[(0,r.jsx)("header",{className:"py-4",children:(0,r.jsx)("nav",{children:(0,r.jsxs)("ul",{className:"flex space-x-4",children:[(0,r.jsx)("li",{children:(0,r.jsx)(i.default,{href:"/",children:"ホーム"})}),(0,r.jsx)("li",{children:(0,r.jsx)(i.default,{href:"/recipes",children:"レシピ一覧"})}),(0,r.jsx)("li",{children:(0,r.jsx)(i.default,{href:"/graph",children:"関係グラフ"})}),(0,r.jsx)("li",{children:(0,r.jsx)(i.default,{href:"/admin",children:"管理画面"})})]})})}),(0,r.jsx)("main",{children:t}),(0,r.jsx)("footer",{className:"py-4 mt-8 border-t",children:(0,r.jsx)("p",{children:"\xa9 2024 Bar Curion"})})]})}}},function(e){e.O(0,[231,971,23,744],function(){return e(e.s=3261)}),_N_E=e.O()}]);