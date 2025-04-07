"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[6892],{65537:(n,t,r)=>{r.d(t,{A:()=>A});var e=r(96540),u=r(18215),o=r(65627),a=r(56347),i=r(50372),l=r(30604),c=r(11861),f=r(78749);function s(n){return e.Children.toArray(n).filter((n=>"\n"!==n)).map((n=>{if(!n||(0,e.isValidElement)(n)&&function(n){const{props:t}=n;return!!t&&"object"==typeof t&&"value"in t}(n))return n;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof n.type?n.type:n.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function p(n){const{values:t,children:r}=n;return(0,e.useMemo)((()=>{const n=t??function(n){return s(n).map((n=>{let{props:{value:t,label:r,attributes:e,default:u}}=n;return{value:t,label:r,attributes:e,default:u}}))}(r);return function(n){const t=(0,c.XI)(n,((n,t)=>n.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((n=>n.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(n),n}),[t,r])}function h(n){let{value:t,tabValues:r}=n;return r.some((n=>n.value===t))}function v(n){let{queryString:t=!1,groupId:r}=n;const u=(0,a.W6)(),o=function(n){let{queryString:t=!1,groupId:r}=n;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!r)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return r??null}({queryString:t,groupId:r});return[(0,l.aZ)(o),(0,e.useCallback)((n=>{if(!o)return;const t=new URLSearchParams(u.location.search);t.set(o,n),u.replace({...u.location,search:t.toString()})}),[o,u])]}function d(n){const{defaultValue:t,queryString:r=!1,groupId:u}=n,o=p(n),[a,l]=(0,e.useState)((()=>function(n){let{defaultValue:t,tabValues:r}=n;if(0===r.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!h({value:t,tabValues:r}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${r.map((n=>n.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const e=r.find((n=>n.default))??r[0];if(!e)throw new Error("Unexpected error: 0 tabValues");return e.value}({defaultValue:t,tabValues:o}))),[c,s]=v({queryString:r,groupId:u}),[d,y]=function(n){let{groupId:t}=n;const r=function(n){return n?`docusaurus.tab.${n}`:null}(t),[u,o]=(0,f.Dv)(r);return[u,(0,e.useCallback)((n=>{r&&o.set(n)}),[r,o])]}({groupId:u}),b=(()=>{const n=c??d;return h({value:n,tabValues:o})?n:null})();(0,i.A)((()=>{b&&l(b)}),[b]);return{selectedValue:a,selectValue:(0,e.useCallback)((n=>{if(!h({value:n,tabValues:o}))throw new Error(`Can't select invalid tab value=${n}`);l(n),s(n),y(n)}),[s,y,o]),tabValues:o}}var y=r(9136);const b={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var g=r(74848);function m(n){let{className:t,block:r,selectedValue:e,selectValue:a,tabValues:i}=n;const l=[],{blockElementScrollPositionUntilNextRender:c}=(0,o.a_)(),f=n=>{const t=n.currentTarget,r=l.indexOf(t),u=i[r].value;u!==e&&(c(t),a(u))},s=n=>{let t=null;switch(n.key){case"Enter":f(n);break;case"ArrowRight":{const r=l.indexOf(n.currentTarget)+1;t=l[r]??l[0];break}case"ArrowLeft":{const r=l.indexOf(n.currentTarget)-1;t=l[r]??l[l.length-1];break}}t?.focus()};return(0,g.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,u.A)("tabs",{"tabs--block":r},t),children:i.map((n=>{let{value:t,label:r,attributes:o}=n;return(0,g.jsx)("li",{role:"tab",tabIndex:e===t?0:-1,"aria-selected":e===t,ref:n=>{l.push(n)},onKeyDown:s,onClick:f,...o,className:(0,u.A)("tabs__item",b.tabItem,o?.className,{"tabs__item--active":e===t}),children:r??t},t)}))})}function w(n){let{lazy:t,children:r,selectedValue:o}=n;const a=(Array.isArray(r)?r:[r]).filter(Boolean);if(t){const n=a.find((n=>n.props.value===o));return n?(0,e.cloneElement)(n,{className:(0,u.A)("margin-top--md",n.props.className)}):null}return(0,g.jsx)("div",{className:"margin-top--md",children:a.map(((n,t)=>(0,e.cloneElement)(n,{key:t,hidden:n.props.value!==o})))})}function j(n){const t=d(n);return(0,g.jsxs)("div",{className:(0,u.A)("tabs-container",b.tabList),children:[(0,g.jsx)(m,{...t,...n}),(0,g.jsx)(w,{...t,...n})]})}function A(n){const t=(0,y.A)();return(0,g.jsx)(j,{...n,children:s(n.children)},String(t))}},79329:(n,t,r)=>{r.d(t,{A:()=>a});r(96540);var e=r(18215);const u={tabItem:"tabItem_Ymn6"};var o=r(74848);function a(n){let{children:t,hidden:r,className:a}=n;return(0,o.jsx)("div",{role:"tabpanel",className:(0,e.A)(u.tabItem,a),hidden:r,children:t})}},84476:(n,t,r)=>{r.d(t,{Ay:()=>Ur});var e={};r.r(e),r.d(e,{VERSION:()=>u,after:()=>Dt,all:()=>tr,allKeys:()=>bn,any:()=>rr,assign:()=>Dn,before:()=>qt,bind:()=>_t,bindAll:()=>Et,chain:()=>mt,chunk:()=>Cr,clone:()=>Ln,collect:()=>Xt,compact:()=>Ir,compose:()=>Bt,constant:()=>H,contains:()=>er,countBy:()=>br,create:()=>Cn,debounce:()=>Nt,default:()=>$r,defaults:()=>qn,defer:()=>Vt,delay:()=>Ot,detect:()=>Kt,difference:()=>Vr,drop:()=>Sr,each:()=>Yt,escape:()=>it,every:()=>tr,extend:()=>Bn,extendOwn:()=>Dn,filter:()=>Qt,find:()=>Kt,findIndex:()=>Pt,findKey:()=>Ct,findLastIndex:()=>$t,findWhere:()=>Jt,first:()=>xr,flatten:()=>Or,foldl:()=>Gt,foldr:()=>Ht,forEach:()=>Yt,functions:()=>Tn,get:()=>zn,groupBy:()=>dr,has:()=>Wn,head:()=>xr,identity:()=>Kn,include:()=>er,includes:()=>er,indexBy:()=>yr,indexOf:()=>zt,initial:()=>_r,inject:()=>Gt,intersection:()=>Mr,invert:()=>Nn,invoke:()=>ur,isArguments:()=>X,isArray:()=>K,isArrayBuffer:()=>R,isBoolean:()=>O,isDataView:()=>W,isDate:()=>M,isElement:()=>V,isEmpty:()=>cn,isEqual:()=>yn,isError:()=>D,isFinite:()=>Z,isFunction:()=>P,isMap:()=>Sn,isMatch:()=>fn,isNaN:()=>G,isNull:()=>E,isNumber:()=>T,isObject:()=>S,isRegExp:()=>B,isSet:()=>In,isString:()=>N,isSymbol:()=>q,isTypedArray:()=>un,isUndefined:()=>I,isWeakMap:()=>En,isWeakSet:()=>On,iteratee:()=>Gn,keys:()=>ln,last:()=>Er,lastIndexOf:()=>Wt,map:()=>Xt,mapObject:()=>Qn,matcher:()=>Jn,matches:()=>Jn,max:()=>ir,memoize:()=>It,methods:()=>Tn,min:()=>lr,mixin:()=>Pr,negate:()=>Mt,noop:()=>nt,now:()=>ut,object:()=>qr,omit:()=>Ar,once:()=>Rt,pairs:()=>kn,partial:()=>At,partition:()=>gr,pick:()=>jr,pluck:()=>or,property:()=>Yn,propertyOf:()=>tt,random:()=>et,range:()=>Rr,reduce:()=>Gt,reduceRight:()=>Ht,reject:()=>nr,rest:()=>Sr,restArguments:()=>x,result:()=>yt,sample:()=>sr,select:()=>Qt,shuffle:()=>pr,size:()=>mr,some:()=>rr,sortBy:()=>hr,sortedIndex:()=>Ft,tail:()=>Sr,take:()=>xr,tap:()=>Pn,template:()=>dt,templateSettings:()=>ct,throttle:()=>kt,times:()=>rt,toArray:()=>fr,toPath:()=>$n,transpose:()=>Br,unescape:()=>lt,union:()=>Tr,uniq:()=>Nr,unique:()=>Nr,uniqueId:()=>gt,unzip:()=>Br,values:()=>Vn,where:()=>ar,without:()=>kr,wrap:()=>Tt,zip:()=>Dr});var u="1.13.7",o="object"==typeof self&&self.self===self&&self||"object"==typeof global&&global.global===global&&global||Function("return this")()||{},a=Array.prototype,i=Object.prototype,l="undefined"!=typeof Symbol?Symbol.prototype:null,c=a.push,f=a.slice,s=i.toString,p=i.hasOwnProperty,h="undefined"!=typeof ArrayBuffer,v="undefined"!=typeof DataView,d=Array.isArray,y=Object.keys,b=Object.create,g=h&&ArrayBuffer.isView,m=isNaN,w=isFinite,j=!{toString:null}.propertyIsEnumerable("toString"),A=["valueOf","isPrototypeOf","toString","propertyIsEnumerable","hasOwnProperty","toLocaleString"],_=Math.pow(2,53)-1;function x(n,t){return t=null==t?n.length-1:+t,function(){for(var r=Math.max(arguments.length-t,0),e=Array(r),u=0;u<r;u++)e[u]=arguments[u+t];switch(t){case 0:return n.call(this,e);case 1:return n.call(this,arguments[0],e);case 2:return n.call(this,arguments[0],arguments[1],e)}var o=Array(t+1);for(u=0;u<t;u++)o[u]=arguments[u];return o[t]=e,n.apply(this,o)}}function S(n){var t=typeof n;return"function"===t||"object"===t&&!!n}function E(n){return null===n}function I(n){return void 0===n}function O(n){return!0===n||!1===n||"[object Boolean]"===s.call(n)}function V(n){return!(!n||1!==n.nodeType)}function k(n){var t="[object "+n+"]";return function(n){return s.call(n)===t}}const N=k("String"),T=k("Number"),M=k("Date"),B=k("RegExp"),D=k("Error"),q=k("Symbol"),R=k("ArrayBuffer");var C=k("Function"),L=o.document&&o.document.childNodes;"object"!=typeof Int8Array&&"function"!=typeof L&&(C=function(n){return"function"==typeof n||!1});const P=C,$=k("Object");var F=v&&(!/\[native code\]/.test(String(DataView))||$(new DataView(new ArrayBuffer(8)))),U="undefined"!=typeof Map&&$(new Map),z=k("DataView");const W=F?function(n){return null!=n&&P(n.getInt8)&&R(n.buffer)}:z,K=d||k("Array");function J(n,t){return null!=n&&p.call(n,t)}var Y=k("Arguments");!function(){Y(arguments)||(Y=function(n){return J(n,"callee")})}();const X=Y;function Z(n){return!q(n)&&w(n)&&!isNaN(parseFloat(n))}function G(n){return T(n)&&m(n)}function H(n){return function(){return n}}function Q(n){return function(t){var r=n(t);return"number"==typeof r&&r>=0&&r<=_}}function nn(n){return function(t){return null==t?void 0:t[n]}}const tn=nn("byteLength"),rn=Q(tn);var en=/\[object ((I|Ui)nt(8|16|32)|Float(32|64)|Uint8Clamped|Big(I|Ui)nt64)Array\]/;const un=h?function(n){return g?g(n)&&!W(n):rn(n)&&en.test(s.call(n))}:H(!1),on=nn("length");function an(n,t){t=function(n){for(var t={},r=n.length,e=0;e<r;++e)t[n[e]]=!0;return{contains:function(n){return!0===t[n]},push:function(r){return t[r]=!0,n.push(r)}}}(t);var r=A.length,e=n.constructor,u=P(e)&&e.prototype||i,o="constructor";for(J(n,o)&&!t.contains(o)&&t.push(o);r--;)(o=A[r])in n&&n[o]!==u[o]&&!t.contains(o)&&t.push(o)}function ln(n){if(!S(n))return[];if(y)return y(n);var t=[];for(var r in n)J(n,r)&&t.push(r);return j&&an(n,t),t}function cn(n){if(null==n)return!0;var t=on(n);return"number"==typeof t&&(K(n)||N(n)||X(n))?0===t:0===on(ln(n))}function fn(n,t){var r=ln(t),e=r.length;if(null==n)return!e;for(var u=Object(n),o=0;o<e;o++){var a=r[o];if(t[a]!==u[a]||!(a in u))return!1}return!0}function sn(n){return n instanceof sn?n:this instanceof sn?void(this._wrapped=n):new sn(n)}function pn(n){return new Uint8Array(n.buffer||n,n.byteOffset||0,tn(n))}sn.VERSION=u,sn.prototype.value=function(){return this._wrapped},sn.prototype.valueOf=sn.prototype.toJSON=sn.prototype.value,sn.prototype.toString=function(){return String(this._wrapped)};var hn="[object DataView]";function vn(n,t,r,e){if(n===t)return 0!==n||1/n==1/t;if(null==n||null==t)return!1;if(n!=n)return t!=t;var u=typeof n;return("function"===u||"object"===u||"object"==typeof t)&&dn(n,t,r,e)}function dn(n,t,r,e){n instanceof sn&&(n=n._wrapped),t instanceof sn&&(t=t._wrapped);var u=s.call(n);if(u!==s.call(t))return!1;if(F&&"[object Object]"==u&&W(n)){if(!W(t))return!1;u=hn}switch(u){case"[object RegExp]":case"[object String]":return""+n==""+t;case"[object Number]":return+n!=+n?+t!=+t:0==+n?1/+n==1/t:+n==+t;case"[object Date]":case"[object Boolean]":return+n==+t;case"[object Symbol]":return l.valueOf.call(n)===l.valueOf.call(t);case"[object ArrayBuffer]":case hn:return dn(pn(n),pn(t),r,e)}var o="[object Array]"===u;if(!o&&un(n)){if(tn(n)!==tn(t))return!1;if(n.buffer===t.buffer&&n.byteOffset===t.byteOffset)return!0;o=!0}if(!o){if("object"!=typeof n||"object"!=typeof t)return!1;var a=n.constructor,i=t.constructor;if(a!==i&&!(P(a)&&a instanceof a&&P(i)&&i instanceof i)&&"constructor"in n&&"constructor"in t)return!1}e=e||[];for(var c=(r=r||[]).length;c--;)if(r[c]===n)return e[c]===t;if(r.push(n),e.push(t),o){if((c=n.length)!==t.length)return!1;for(;c--;)if(!vn(n[c],t[c],r,e))return!1}else{var f,p=ln(n);if(c=p.length,ln(t).length!==c)return!1;for(;c--;)if(!J(t,f=p[c])||!vn(n[f],t[f],r,e))return!1}return r.pop(),e.pop(),!0}function yn(n,t){return vn(n,t)}function bn(n){if(!S(n))return[];var t=[];for(var r in n)t.push(r);return j&&an(n,t),t}function gn(n){var t=on(n);return function(r){if(null==r)return!1;var e=bn(r);if(on(e))return!1;for(var u=0;u<t;u++)if(!P(r[n[u]]))return!1;return n!==_n||!P(r[mn])}}var mn="forEach",wn=["clear","delete"],jn=["get","has","set"],An=wn.concat(mn,jn),_n=wn.concat(jn),xn=["add"].concat(wn,mn,"has");const Sn=U?gn(An):k("Map"),En=U?gn(_n):k("WeakMap"),In=U?gn(xn):k("Set"),On=k("WeakSet");function Vn(n){for(var t=ln(n),r=t.length,e=Array(r),u=0;u<r;u++)e[u]=n[t[u]];return e}function kn(n){for(var t=ln(n),r=t.length,e=Array(r),u=0;u<r;u++)e[u]=[t[u],n[t[u]]];return e}function Nn(n){for(var t={},r=ln(n),e=0,u=r.length;e<u;e++)t[n[r[e]]]=r[e];return t}function Tn(n){var t=[];for(var r in n)P(n[r])&&t.push(r);return t.sort()}function Mn(n,t){return function(r){var e=arguments.length;if(t&&(r=Object(r)),e<2||null==r)return r;for(var u=1;u<e;u++)for(var o=arguments[u],a=n(o),i=a.length,l=0;l<i;l++){var c=a[l];t&&void 0!==r[c]||(r[c]=o[c])}return r}}const Bn=Mn(bn),Dn=Mn(ln),qn=Mn(bn,!0);function Rn(n){if(!S(n))return{};if(b)return b(n);var t=function(){};t.prototype=n;var r=new t;return t.prototype=null,r}function Cn(n,t){var r=Rn(n);return t&&Dn(r,t),r}function Ln(n){return S(n)?K(n)?n.slice():Bn({},n):n}function Pn(n,t){return t(n),n}function $n(n){return K(n)?n:[n]}function Fn(n){return sn.toPath(n)}function Un(n,t){for(var r=t.length,e=0;e<r;e++){if(null==n)return;n=n[t[e]]}return r?n:void 0}function zn(n,t,r){var e=Un(n,Fn(t));return I(e)?r:e}function Wn(n,t){for(var r=(t=Fn(t)).length,e=0;e<r;e++){var u=t[e];if(!J(n,u))return!1;n=n[u]}return!!r}function Kn(n){return n}function Jn(n){return n=Dn({},n),function(t){return fn(t,n)}}function Yn(n){return n=Fn(n),function(t){return Un(t,n)}}function Xn(n,t,r){if(void 0===t)return n;switch(null==r?3:r){case 1:return function(r){return n.call(t,r)};case 3:return function(r,e,u){return n.call(t,r,e,u)};case 4:return function(r,e,u,o){return n.call(t,r,e,u,o)}}return function(){return n.apply(t,arguments)}}function Zn(n,t,r){return null==n?Kn:P(n)?Xn(n,t,r):S(n)&&!K(n)?Jn(n):Yn(n)}function Gn(n,t){return Zn(n,t,1/0)}function Hn(n,t,r){return sn.iteratee!==Gn?sn.iteratee(n,t):Zn(n,t,r)}function Qn(n,t,r){t=Hn(t,r);for(var e=ln(n),u=e.length,o={},a=0;a<u;a++){var i=e[a];o[i]=t(n[i],i,n)}return o}function nt(){}function tt(n){return null==n?nt:function(t){return zn(n,t)}}function rt(n,t,r){var e=Array(Math.max(0,n));t=Xn(t,r,1);for(var u=0;u<n;u++)e[u]=t(u);return e}function et(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))}sn.toPath=$n,sn.iteratee=Gn;const ut=Date.now||function(){return(new Date).getTime()};function ot(n){var t=function(t){return n[t]},r="(?:"+ln(n).join("|")+")",e=RegExp(r),u=RegExp(r,"g");return function(n){return n=null==n?"":""+n,e.test(n)?n.replace(u,t):n}}const at={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},it=ot(at),lt=ot(Nn(at)),ct=sn.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var ft=/(.)^/,st={"'":"'","\\":"\\","\r":"r","\n":"n","\u2028":"u2028","\u2029":"u2029"},pt=/\\|'|\r|\n|\u2028|\u2029/g;function ht(n){return"\\"+st[n]}var vt=/^\s*(\w|\$)+\s*$/;function dt(n,t,r){!t&&r&&(t=r),t=qn({},t,sn.templateSettings);var e=RegExp([(t.escape||ft).source,(t.interpolate||ft).source,(t.evaluate||ft).source].join("|")+"|$","g"),u=0,o="__p+='";n.replace(e,(function(t,r,e,a,i){return o+=n.slice(u,i).replace(pt,ht),u=i+t.length,r?o+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'":e?o+="'+\n((__t=("+e+"))==null?'':__t)+\n'":a&&(o+="';\n"+a+"\n__p+='"),t})),o+="';\n";var a,i=t.variable;if(i){if(!vt.test(i))throw new Error("variable is not a bare identifier: "+i)}else o="with(obj||{}){\n"+o+"}\n",i="obj";o="var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n"+o+"return __p;\n";try{a=new Function(i,"_",o)}catch(c){throw c.source=o,c}var l=function(n){return a.call(this,n,sn)};return l.source="function("+i+"){\n"+o+"}",l}function yt(n,t,r){var e=(t=Fn(t)).length;if(!e)return P(r)?r.call(n):r;for(var u=0;u<e;u++){var o=null==n?void 0:n[t[u]];void 0===o&&(o=r,u=e),n=P(o)?o.call(n):o}return n}var bt=0;function gt(n){var t=++bt+"";return n?n+t:t}function mt(n){var t=sn(n);return t._chain=!0,t}function wt(n,t,r,e,u){if(!(e instanceof t))return n.apply(r,u);var o=Rn(n.prototype),a=n.apply(o,u);return S(a)?a:o}var jt=x((function(n,t){var r=jt.placeholder,e=function(){for(var u=0,o=t.length,a=Array(o),i=0;i<o;i++)a[i]=t[i]===r?arguments[u++]:t[i];for(;u<arguments.length;)a.push(arguments[u++]);return wt(n,e,this,this,a)};return e}));jt.placeholder=sn;const At=jt,_t=x((function(n,t,r){if(!P(n))throw new TypeError("Bind must be called on a function");var e=x((function(u){return wt(n,e,t,this,r.concat(u))}));return e})),xt=Q(on);function St(n,t,r,e){if(e=e||[],t||0===t){if(t<=0)return e.concat(n)}else t=1/0;for(var u=e.length,o=0,a=on(n);o<a;o++){var i=n[o];if(xt(i)&&(K(i)||X(i)))if(t>1)St(i,t-1,r,e),u=e.length;else for(var l=0,c=i.length;l<c;)e[u++]=i[l++];else r||(e[u++]=i)}return e}const Et=x((function(n,t){var r=(t=St(t,!1,!1)).length;if(r<1)throw new Error("bindAll must be passed function names");for(;r--;){var e=t[r];n[e]=_t(n[e],n)}return n}));function It(n,t){var r=function(e){var u=r.cache,o=""+(t?t.apply(this,arguments):e);return J(u,o)||(u[o]=n.apply(this,arguments)),u[o]};return r.cache={},r}const Ot=x((function(n,t,r){return setTimeout((function(){return n.apply(null,r)}),t)})),Vt=At(Ot,sn,1);function kt(n,t,r){var e,u,o,a,i=0;r||(r={});var l=function(){i=!1===r.leading?0:ut(),e=null,a=n.apply(u,o),e||(u=o=null)},c=function(){var c=ut();i||!1!==r.leading||(i=c);var f=t-(c-i);return u=this,o=arguments,f<=0||f>t?(e&&(clearTimeout(e),e=null),i=c,a=n.apply(u,o),e||(u=o=null)):e||!1===r.trailing||(e=setTimeout(l,f)),a};return c.cancel=function(){clearTimeout(e),i=0,e=u=o=null},c}function Nt(n,t,r){var e,u,o,a,i,l=function(){var c=ut()-u;t>c?e=setTimeout(l,t-c):(e=null,r||(a=n.apply(i,o)),e||(o=i=null))},c=x((function(c){return i=this,o=c,u=ut(),e||(e=setTimeout(l,t),r&&(a=n.apply(i,o))),a}));return c.cancel=function(){clearTimeout(e),e=o=i=null},c}function Tt(n,t){return At(t,n)}function Mt(n){return function(){return!n.apply(this,arguments)}}function Bt(){var n=arguments,t=n.length-1;return function(){for(var r=t,e=n[t].apply(this,arguments);r--;)e=n[r].call(this,e);return e}}function Dt(n,t){return function(){if(--n<1)return t.apply(this,arguments)}}function qt(n,t){var r;return function(){return--n>0&&(r=t.apply(this,arguments)),n<=1&&(t=null),r}}const Rt=At(qt,2);function Ct(n,t,r){t=Hn(t,r);for(var e,u=ln(n),o=0,a=u.length;o<a;o++)if(t(n[e=u[o]],e,n))return e}function Lt(n){return function(t,r,e){r=Hn(r,e);for(var u=on(t),o=n>0?0:u-1;o>=0&&o<u;o+=n)if(r(t[o],o,t))return o;return-1}}const Pt=Lt(1),$t=Lt(-1);function Ft(n,t,r,e){for(var u=(r=Hn(r,e,1))(t),o=0,a=on(n);o<a;){var i=Math.floor((o+a)/2);r(n[i])<u?o=i+1:a=i}return o}function Ut(n,t,r){return function(e,u,o){var a=0,i=on(e);if("number"==typeof o)n>0?a=o>=0?o:Math.max(o+i,a):i=o>=0?Math.min(o+1,i):o+i+1;else if(r&&o&&i)return e[o=r(e,u)]===u?o:-1;if(u!=u)return(o=t(f.call(e,a,i),G))>=0?o+a:-1;for(o=n>0?a:i-1;o>=0&&o<i;o+=n)if(e[o]===u)return o;return-1}}const zt=Ut(1,Pt,Ft),Wt=Ut(-1,$t);function Kt(n,t,r){var e=(xt(n)?Pt:Ct)(n,t,r);if(void 0!==e&&-1!==e)return n[e]}function Jt(n,t){return Kt(n,Jn(t))}function Yt(n,t,r){var e,u;if(t=Xn(t,r),xt(n))for(e=0,u=n.length;e<u;e++)t(n[e],e,n);else{var o=ln(n);for(e=0,u=o.length;e<u;e++)t(n[o[e]],o[e],n)}return n}function Xt(n,t,r){t=Hn(t,r);for(var e=!xt(n)&&ln(n),u=(e||n).length,o=Array(u),a=0;a<u;a++){var i=e?e[a]:a;o[a]=t(n[i],i,n)}return o}function Zt(n){return function(t,r,e,u){var o=arguments.length>=3;return function(t,r,e,u){var o=!xt(t)&&ln(t),a=(o||t).length,i=n>0?0:a-1;for(u||(e=t[o?o[i]:i],i+=n);i>=0&&i<a;i+=n){var l=o?o[i]:i;e=r(e,t[l],l,t)}return e}(t,Xn(r,u,4),e,o)}}const Gt=Zt(1),Ht=Zt(-1);function Qt(n,t,r){var e=[];return t=Hn(t,r),Yt(n,(function(n,r,u){t(n,r,u)&&e.push(n)})),e}function nr(n,t,r){return Qt(n,Mt(Hn(t)),r)}function tr(n,t,r){t=Hn(t,r);for(var e=!xt(n)&&ln(n),u=(e||n).length,o=0;o<u;o++){var a=e?e[o]:o;if(!t(n[a],a,n))return!1}return!0}function rr(n,t,r){t=Hn(t,r);for(var e=!xt(n)&&ln(n),u=(e||n).length,o=0;o<u;o++){var a=e?e[o]:o;if(t(n[a],a,n))return!0}return!1}function er(n,t,r,e){return xt(n)||(n=Vn(n)),("number"!=typeof r||e)&&(r=0),zt(n,t,r)>=0}const ur=x((function(n,t,r){var e,u;return P(t)?u=t:(t=Fn(t),e=t.slice(0,-1),t=t[t.length-1]),Xt(n,(function(n){var o=u;if(!o){if(e&&e.length&&(n=Un(n,e)),null==n)return;o=n[t]}return null==o?o:o.apply(n,r)}))}));function or(n,t){return Xt(n,Yn(t))}function ar(n,t){return Qt(n,Jn(t))}function ir(n,t,r){var e,u,o=-1/0,a=-1/0;if(null==t||"number"==typeof t&&"object"!=typeof n[0]&&null!=n)for(var i=0,l=(n=xt(n)?n:Vn(n)).length;i<l;i++)null!=(e=n[i])&&e>o&&(o=e);else t=Hn(t,r),Yt(n,(function(n,r,e){((u=t(n,r,e))>a||u===-1/0&&o===-1/0)&&(o=n,a=u)}));return o}function lr(n,t,r){var e,u,o=1/0,a=1/0;if(null==t||"number"==typeof t&&"object"!=typeof n[0]&&null!=n)for(var i=0,l=(n=xt(n)?n:Vn(n)).length;i<l;i++)null!=(e=n[i])&&e<o&&(o=e);else t=Hn(t,r),Yt(n,(function(n,r,e){((u=t(n,r,e))<a||u===1/0&&o===1/0)&&(o=n,a=u)}));return o}var cr=/[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;function fr(n){return n?K(n)?f.call(n):N(n)?n.match(cr):xt(n)?Xt(n,Kn):Vn(n):[]}function sr(n,t,r){if(null==t||r)return xt(n)||(n=Vn(n)),n[et(n.length-1)];var e=fr(n),u=on(e);t=Math.max(Math.min(t,u),0);for(var o=u-1,a=0;a<t;a++){var i=et(a,o),l=e[a];e[a]=e[i],e[i]=l}return e.slice(0,t)}function pr(n){return sr(n,1/0)}function hr(n,t,r){var e=0;return t=Hn(t,r),or(Xt(n,(function(n,r,u){return{value:n,index:e++,criteria:t(n,r,u)}})).sort((function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||void 0===r)return 1;if(r<e||void 0===e)return-1}return n.index-t.index})),"value")}function vr(n,t){return function(r,e,u){var o=t?[[],[]]:{};return e=Hn(e,u),Yt(r,(function(t,u){var a=e(t,u,r);n(o,t,a)})),o}}const dr=vr((function(n,t,r){J(n,r)?n[r].push(t):n[r]=[t]})),yr=vr((function(n,t,r){n[r]=t})),br=vr((function(n,t,r){J(n,r)?n[r]++:n[r]=1})),gr=vr((function(n,t,r){n[r?0:1].push(t)}),!0);function mr(n){return null==n?0:xt(n)?n.length:ln(n).length}function wr(n,t,r){return t in r}const jr=x((function(n,t){var r={},e=t[0];if(null==n)return r;P(e)?(t.length>1&&(e=Xn(e,t[1])),t=bn(n)):(e=wr,t=St(t,!1,!1),n=Object(n));for(var u=0,o=t.length;u<o;u++){var a=t[u],i=n[a];e(i,a,n)&&(r[a]=i)}return r})),Ar=x((function(n,t){var r,e=t[0];return P(e)?(e=Mt(e),t.length>1&&(r=t[1])):(t=Xt(St(t,!1,!1),String),e=function(n,r){return!er(t,r)}),jr(n,e,r)}));function _r(n,t,r){return f.call(n,0,Math.max(0,n.length-(null==t||r?1:t)))}function xr(n,t,r){return null==n||n.length<1?null==t||r?void 0:[]:null==t||r?n[0]:_r(n,n.length-t)}function Sr(n,t,r){return f.call(n,null==t||r?1:t)}function Er(n,t,r){return null==n||n.length<1?null==t||r?void 0:[]:null==t||r?n[n.length-1]:Sr(n,Math.max(0,n.length-t))}function Ir(n){return Qt(n,Boolean)}function Or(n,t){return St(n,t,!1)}const Vr=x((function(n,t){return t=St(t,!0,!0),Qt(n,(function(n){return!er(t,n)}))})),kr=x((function(n,t){return Vr(n,t)}));function Nr(n,t,r,e){O(t)||(e=r,r=t,t=!1),null!=r&&(r=Hn(r,e));for(var u=[],o=[],a=0,i=on(n);a<i;a++){var l=n[a],c=r?r(l,a,n):l;t&&!r?(a&&o===c||u.push(l),o=c):r?er(o,c)||(o.push(c),u.push(l)):er(u,l)||u.push(l)}return u}const Tr=x((function(n){return Nr(St(n,!0,!0))}));function Mr(n){for(var t=[],r=arguments.length,e=0,u=on(n);e<u;e++){var o=n[e];if(!er(t,o)){var a;for(a=1;a<r&&er(arguments[a],o);a++);a===r&&t.push(o)}}return t}function Br(n){for(var t=n&&ir(n,on).length||0,r=Array(t),e=0;e<t;e++)r[e]=or(n,e);return r}const Dr=x(Br);function qr(n,t){for(var r={},e=0,u=on(n);e<u;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r}function Rr(n,t,r){null==t&&(t=n||0,n=0),r||(r=t<n?-1:1);for(var e=Math.max(Math.ceil((t-n)/r),0),u=Array(e),o=0;o<e;o++,n+=r)u[o]=n;return u}function Cr(n,t){if(null==t||t<1)return[];for(var r=[],e=0,u=n.length;e<u;)r.push(f.call(n,e,e+=t));return r}function Lr(n,t){return n._chain?sn(t).chain():t}function Pr(n){return Yt(Tn(n),(function(t){var r=sn[t]=n[t];sn.prototype[t]=function(){var n=[this._wrapped];return c.apply(n,arguments),Lr(this,r.apply(sn,n))}})),sn}Yt(["pop","push","reverse","shift","sort","splice","unshift"],(function(n){var t=a[n];sn.prototype[n]=function(){var r=this._wrapped;return null!=r&&(t.apply(r,arguments),"shift"!==n&&"splice"!==n||0!==r.length||delete r[0]),Lr(this,r)}})),Yt(["concat","join","slice"],(function(n){var t=a[n];sn.prototype[n]=function(){var n=this._wrapped;return null!=n&&(n=t.apply(n,arguments)),Lr(this,n)}}));const $r=sn;var Fr=Pr(e);Fr._=Fr;const Ur=Fr}}]);