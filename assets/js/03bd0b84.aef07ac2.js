"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[3080],{83281:(e,t,o)=>{o.r(t),o.d(t,{assets:()=>l,contentTitle:()=>a,default:()=>d,frontMatter:()=>i,metadata:()=>s,toc:()=>p});var n=o(58168),r=(o(96540),o(15680));o(41873);const i={title:"How we work"},a="How we work",s={unversionedId:"QA/HowWeWork/index",id:"QA/HowWeWork/index",title:"How we work",description:"The role of QA within a software delivery team is to provide enough details about the software we're delivering, so that stakeholders can make informed decisions (about whether to release, how to prioritize a given bug, etc).",source:"@site/docs/QA/HowWeWork/index.md",sourceDirName:"QA/HowWeWork",slug:"/QA/HowWeWork/",permalink:"/va-mobile-app/docs/QA/HowWeWork/",draft:!1,tags:[],version:"current",frontMatter:{title:"How we work"},sidebar:"tutorialSidebar",previous:{title:"QA",permalink:"/va-mobile-app/docs/QA/"},next:{title:"Meetings",permalink:"/va-mobile-app/docs/QA/HowWeWork/Meetings"}},l={},p=[{value:"When is our testing &quot;good enough&quot;?",id:"when-is-our-testing-good-enough",level:2},{value:"We stop preparing for testing activities when:",id:"we-stop-preparing-for-testing-activities-when",level:3},{value:"We stop testing when:",id:"we-stop-testing-when",level:3},{value:"Common misconception: QA makes the final decision",id:"common-misconception-qa-makes-the-final-decision",level:2}],c={toc:p},u="wrapper";function d(e){let{components:t,...o}=e;return(0,r.yg)(u,(0,n.A)({},c,o,{components:t,mdxType:"MDXLayout"}),(0,r.yg)("h1",{id:"how-we-work"},"How we work"),(0,r.yg)("p",null,"The role of QA within a software delivery team is to provide enough details about the software we're delivering, so that stakeholders can make informed decisions (about whether to release, how to prioritize a given bug, etc). "),(0,r.yg)("p",null,'We typically provide that information by signing off that we\'ve tested the software in question to our satisfaction. Saying "QA approves merging to develop" or "QA approves release" means we believe we\'ve tested the software well.'),(0,r.yg)("h2",{id:"when-is-our-testing-good-enough"},'When is our testing "good enough"?'),(0,r.yg)("p",null,'Good software testing happens with the keen awareness that it is impossible to "find all the bugs" (limitations in time, resources, tooling, and knowledge; not to mention inevitable changes in data, processes, software, and systems our software integrates with). Therefore, a highly-functional QA team knows when to stop vs continue working on a given task. On our team:'),(0,r.yg)("h3",{id:"we-stop-preparing-for-testing-activities-when"},"We stop preparing for testing activities when:"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},"we are sufficiently aware of how our software and interacting systems can break and what kinds of problems are the most important to find, and"),(0,r.yg)("li",{parentName:"ul"},"we have what we need (tools, data prep, etc) to be able to look for those problems.")),(0,r.yg)("h3",{id:"we-stop-testing-when"},"We stop testing when:"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},"we've examined the product commensurate to the risk it contains,"),(0,r.yg)("li",{parentName:"ul"},"we've met our testing standards, and"),(0,r.yg)("li",{parentName:"ul"},"we've expressed our testing plan and results, along with quality assessments, clearly.")),(0,r.yg)("h2",{id:"common-misconception-qa-makes-the-final-decision"},"Common misconception: QA makes the final decision"),(0,r.yg)("p",null,"QA is one of the last roles, if not the last role, involved in a given ticket; on some teams they are given gatekeeping authority over what software is released."),(0,r.yg)("p",null,"Within the VA mobile app space, PMs (in conjunction with stakeholders) make the final decision for what goes out the door. That is often explicit (such as new releases or new features) and, on a high-trust team, sometimes implicit (ex: QA stating a ticket meets the PM-set ACs does not need further review before merging into develop)"))}d.isMDXComponent=!0},15680:(e,t,o)=>{o.d(t,{xA:()=>c,yg:()=>g});var n=o(96540);function r(e,t,o){return t in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}function i(e,t){var o=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),o.push.apply(o,n)}return o}function a(e){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?i(Object(o),!0).forEach((function(t){r(e,t,o[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):i(Object(o)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(o,t))}))}return e}function s(e,t){if(null==e)return{};var o,n,r=function(e,t){if(null==e)return{};var o,n,r={},i=Object.keys(e);for(n=0;n<i.length;n++)o=i[n],t.indexOf(o)>=0||(r[o]=e[o]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)o=i[n],t.indexOf(o)>=0||Object.prototype.propertyIsEnumerable.call(e,o)&&(r[o]=e[o])}return r}var l=n.createContext({}),p=function(e){var t=n.useContext(l),o=t;return e&&(o="function"==typeof e?e(t):a(a({},t),e)),o},c=function(e){var t=p(e.components);return n.createElement(l.Provider,{value:t},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},w=n.forwardRef((function(e,t){var o=e.components,r=e.mdxType,i=e.originalType,l=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),u=p(o),w=r,g=u["".concat(l,".").concat(w)]||u[w]||d[w]||i;return o?n.createElement(g,a(a({ref:t},c),{},{components:o})):n.createElement(g,a({ref:t},c))}));function g(e,t){var o=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=o.length,a=new Array(i);a[0]=w;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[u]="string"==typeof e?e:r,a[1]=s;for(var p=2;p<i;p++)a[p]=o[p];return n.createElement.apply(null,a)}return n.createElement.apply(null,o)}w.displayName="MDXCreateElement"},41873:(e,t,o)=>{o(96540)}}]);