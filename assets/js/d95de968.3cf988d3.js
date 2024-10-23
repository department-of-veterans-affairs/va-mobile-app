"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[9769],{22894:(e,a,t)=>{t.r(a),t.d(a,{assets:()=>l,contentTitle:()=>o,default:()=>m,frontMatter:()=>i,metadata:()=>s,toc:()=>p});var r=t(58168),n=(t(96540),t(15680));t(41873);const i={},o="Availability Framework",s={unversionedId:"App Features/Availability Framework/Availability Framework",id:"App Features/Availability Framework/Availability Framework",title:"Availability Framework",description:"Feature Summary",source:"@site/docs/App Features/Availability Framework/Availability Framework.md",sourceDirName:"App Features/Availability Framework",slug:"/App Features/Availability Framework/",permalink:"/va-mobile-app/docs/App Features/Availability Framework/",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Team norms",permalink:"/va-mobile-app/docs/About our team/team-norms"},next:{title:"Encouraged Update",permalink:"/va-mobile-app/docs/App Features/EncouragedUpdate/"}},l={},p=[{value:"Feature Summary",id:"feature-summary",level:2},{value:"Use Cases",id:"use-cases",level:2},{value:"Example Screenshots",id:"example-screenshots",level:2},{value:"How to Enable",id:"how-to-enable",level:2},{value:"Developer Notes",id:"developer-notes",level:2}],u={toc:p},c="wrapper";function m(e){let{components:a,...i}=e;return(0,n.yg)(c,(0,r.A)({},u,i,{components:a,mdxType:"MDXLayout"}),(0,n.yg)("h1",{id:"availability-framework"},"Availability Framework"),(0,n.yg)("h2",{id:"feature-summary"},"Feature Summary"),(0,n.yg)("p",null,"Given the limitations of app store release processes between iOS and Android, we have no way to quickly/instantly turnaround a fix for even an easily resolved problem. Best case scenario with an app store update labelled 'hotfix' is 24 hours which is a really painful amount of time for a meaningful part of the application to be unusable for a veteran. We need to implement a way to quickly react and notify our userbase to a critical problem with a feature, api, or the app as a whole. Availability Framework allows us to stop user navigation to a given screen with a popup message, allow navigation but replace the screen display with an informative alert, or simply tack on a warning alert at the top of existing screen functionality."),(0,n.yg)("h2",{id:"use-cases"},"Use Cases"),(0,n.yg)("ul",null,(0,n.yg)("li",{parentName:"ul"},"Use Case 1: A screen is broken (for all users) and it can\u2019t be rendered without crashing the app/red screen of death."),(0,n.yg)("li",{parentName:"ul"},"Use Case 2: A screen element, feature, or part of a feature is broken (for all users) and the feature entry point can still be accessed and screen rendered (with missing or bad data), and we want to prevent everyone from accessing the broken feature."),(0,n.yg)("li",{parentName:"ul"},"Use Case 3: A screen element, feature, or part of feature is broken (for SOME users. not all) and the feature entry point can still be accessed screen rendered, but some folks will have critically broken data/feature.")),(0,n.yg)("h2",{id:"example-screenshots"},"Example Screenshots"),(0,n.yg)("p",null,"Use Case 1: ",(0,n.yg)("img",{src:t(57226).A,width:"1179",height:"2556"})),(0,n.yg)("p",null,"Use Case 2: ",(0,n.yg)("img",{src:t(6209).A,width:"1179",height:"2556"})),(0,n.yg)("p",null,"Use Case 3: ",(0,n.yg)("img",{src:t(21592).A,width:"1179",height:"2556"})),(0,n.yg)("h2",{id:"how-to-enable"},"How to Enable"),(0,n.yg)("p",null,"Here you'll see existing examples of previously enabled availability framework setups:"),(0,n.yg)("p",null,"Firebase definitions: ",(0,n.yg)("img",{src:t(24875).A,width:"1254",height:"569"})),(0,n.yg)("p",null,(0,n.yg)("a",{parentName:"p",href:"https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/va-mobile-app/Teams/QA%20and%20Release/Policies/Process%20-%20Availability%20Framework.md#json-disclaimer"},"JSON documentation and the parameter setup"),"."),(0,n.yg)("h2",{id:"developer-notes"},"Developer Notes"),(0,n.yg)("ul",null,(0,n.yg)("li",{parentName:"ul"},"If we run into an issue that requires ClaimsHistoryScreen to have an AF toggle, we will need to investigate doing the same for 'ClaimsHistory' for releases that happened in january if it's relevant to the scenario."),(0,n.yg)("li",{parentName:"ul"},"All 'Else' clauses should be set to the default waygate configuration to avoid issues with the remote config developer setup.")),(0,n.yg)("p",null,"Defaults:\nenabled: true,\ntype: undefined,\nerrorMsgTitle: undefined,\nerrorMsgBody: undefined,\nappUpdateButton: false"),(0,n.yg)("ul",null,(0,n.yg)("li",{parentName:"ul"},"We should endeavor to avoid screen name changes at all costs to avoid duplicative AF requirements.")))}m.isMDXComponent=!0},15680:(e,a,t)=>{t.d(a,{xA:()=>u,yg:()=>y});var r=t(96540);function n(e,a,t){return a in e?Object.defineProperty(e,a,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[a]=t,e}function i(e,a){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);a&&(r=r.filter((function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable}))),t.push.apply(t,r)}return t}function o(e){for(var a=1;a<arguments.length;a++){var t=null!=arguments[a]?arguments[a]:{};a%2?i(Object(t),!0).forEach((function(a){n(e,a,t[a])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(t,a))}))}return e}function s(e,a){if(null==e)return{};var t,r,n=function(e,a){if(null==e)return{};var t,r,n={},i=Object.keys(e);for(r=0;r<i.length;r++)t=i[r],a.indexOf(t)>=0||(n[t]=e[t]);return n}(e,a);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)t=i[r],a.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(n[t]=e[t])}return n}var l=r.createContext({}),p=function(e){var a=r.useContext(l),t=a;return e&&(t="function"==typeof e?e(a):o(o({},a),e)),t},u=function(e){var a=p(e.components);return r.createElement(l.Provider,{value:a},e.children)},c="mdxType",m={inlineCode:"code",wrapper:function(e){var a=e.children;return r.createElement(r.Fragment,{},a)}},d=r.forwardRef((function(e,a){var t=e.components,n=e.mdxType,i=e.originalType,l=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),c=p(t),d=n,y=c["".concat(l,".").concat(d)]||c[d]||m[d]||i;return t?r.createElement(y,o(o({ref:a},u),{},{components:t})):r.createElement(y,o({ref:a},u))}));function y(e,a){var t=arguments,n=a&&a.mdxType;if("string"==typeof e||n){var i=t.length,o=new Array(i);o[0]=d;var s={};for(var l in a)hasOwnProperty.call(a,l)&&(s[l]=a[l]);s.originalType=e,s[c]="string"==typeof e?e:n,o[1]=s;for(var p=2;p<i;p++)o[p]=t[p];return r.createElement.apply(null,o)}return r.createElement.apply(null,t)}d.displayName="MDXCreateElement"},57226:(e,a,t)=>{t.d(a,{A:()=>r});const r=t.p+"assets/images/AF-UseCase1-830ec12c4662287d254ea3e24125e826.png"},6209:(e,a,t)=>{t.d(a,{A:()=>r});const r=t.p+"assets/images/AF-UseCase2-fb84a75ac7b8806aa12ba62b0d63508e.png"},21592:(e,a,t)=>{t.d(a,{A:()=>r});const r=t.p+"assets/images/AF-UseCase3-bf6965ca4a66709617e4f64bc0a72386.png"},24875:(e,a,t)=>{t.d(a,{A:()=>r});const r=t.p+"assets/images/AF_in_Firebase-76ecbec7eae718b445b094d5763b21cd.png"},41873:(e,a,t)=>{t(96540)}}]);