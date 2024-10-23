"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[4630],{16624:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>p,contentTitle:()=>i,default:()=>c,frontMatter:()=>n,metadata:()=>s,toc:()=>l});var a=r(58168),o=(r(96540),r(15680));r(41873);const n={},i="Encouraged Update",s={unversionedId:"App Features/EncouragedUpdate/EncouragedUpdate",id:"App Features/EncouragedUpdate/EncouragedUpdate",title:"Encouraged Update",description:"Feature Summary",source:"@site/docs/App Features/EncouragedUpdate/EncouragedUpdate.md",sourceDirName:"App Features/EncouragedUpdate",slug:"/App Features/EncouragedUpdate/",permalink:"/va-mobile-app/docs/App Features/EncouragedUpdate/",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Availability Framework",permalink:"/va-mobile-app/docs/App Features/Availability Framework/"},next:{title:"What's New",permalink:"/va-mobile-app/docs/App Features/WhatsNew/"}},p={},l=[{value:"Feature Summary",id:"feature-summary",level:2},{value:"Use Cases",id:"use-cases",level:2},{value:"How to force this to appear in Demo Mode",id:"how-to-force-this-to-appear-in-demo-mode",level:2},{value:"Screenshot",id:"screenshot",level:2}],d={toc:l},u="wrapper";function c(e){let{components:t,...n}=e;return(0,o.yg)(u,(0,a.A)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,o.yg)("h1",{id:"encouraged-update"},"Encouraged Update"),(0,o.yg)("h2",{id:"feature-summary"},"Feature Summary"),(0,o.yg)("p",null,"Encouraged update displays to the veteran that there is a newer version in the app store to encourage them to update with a button to click to either download in-app updates (Android) or to go to the app store to download (iOS). In doing so, they will download the latest version of the app and have access to all of the benefits that come with it. We also give them the option of skipping an update for a particular version, which hides this alert until the next version is released. This alert takes priority over the What's New alert."),(0,o.yg)("p",null,"This is potentially a precursor to forced upgrading in the future after so many versions of the app have gone by without upgrading. Currently there is no plan to have a forced upgrade feature, but the ability is there."),(0,o.yg)("h2",{id:"use-cases"},"Use Cases"),(0,o.yg)("ul",null,(0,o.yg)("li",{parentName:"ul"},"Use Case 1: The version on the device is older than what is in the store, so it displays the encouraged update alert (see screenshot)"),(0,o.yg)("li",{parentName:"ul"},"Use Case 2: The version on the device is older than what is in the store, and the veteran decided to skip the encourage update for this version so it does not display the alert"),(0,o.yg)("li",{parentName:"ul"},"Use Case 3: The version on the device is the same version in the store or newer (updates from the app store roll out to devices periodically, so it is possible that the app was updated but the store's API is returning an older version) so it displays the ",(0,o.yg)("a",{parentName:"li",href:"/va-mobile-app/docs/App%20Features/WhatsNew/"},"What's New")," alert if applicable ")),(0,o.yg)("h2",{id:"how-to-force-this-to-appear-in-demo-mode"},"How to force this to appear in Demo Mode"),(0,o.yg)("p",null,"Step 1: Go to the developer screen in the settings part of the app and scroll to the bottom where it has Encouraged Update and What's New versions\nStep 2: Set the Encouraged Update version override to a version that is lower than the store version\nStep 3: Logout of the app and log back into demo mode"),(0,o.yg)("h2",{id:"screenshot"},"Screenshot"),(0,o.yg)("p",null,(0,o.yg)("img",{src:r(28787).A,width:"860",height:"1708"})))}c.isMDXComponent=!0},15680:(e,t,r)=>{r.d(t,{xA:()=>d,yg:()=>g});var a=r(96540);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function n(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?n(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):n(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,a,o=function(e,t){if(null==e)return{};var r,a,o={},n=Object.keys(e);for(a=0;a<n.length;a++)r=n[a],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);for(a=0;a<n.length;a++)r=n[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var p=a.createContext({}),l=function(e){var t=a.useContext(p),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},d=function(e){var t=l(e.components);return a.createElement(p.Provider,{value:t},e.children)},u="mdxType",c={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},h=a.forwardRef((function(e,t){var r=e.components,o=e.mdxType,n=e.originalType,p=e.parentName,d=s(e,["components","mdxType","originalType","parentName"]),u=l(r),h=o,g=u["".concat(p,".").concat(h)]||u[h]||c[h]||n;return r?a.createElement(g,i(i({ref:t},d),{},{components:r})):a.createElement(g,i({ref:t},d))}));function g(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var n=r.length,i=new Array(n);i[0]=h;var s={};for(var p in t)hasOwnProperty.call(t,p)&&(s[p]=t[p]);s.originalType=e,s[u]="string"==typeof e?e:o,i[1]=s;for(var l=2;l<n;l++)i[l]=r[l];return a.createElement.apply(null,i)}return a.createElement.apply(null,r)}h.displayName="MDXCreateElement"},28787:(e,t,r)=>{r.d(t,{A:()=>a});const a=r.p+"assets/images/EncouragedUpdate-186df7b28b161ef0a1793cc436945934.png"},41873:(e,t,r)=>{r(96540)}}]);