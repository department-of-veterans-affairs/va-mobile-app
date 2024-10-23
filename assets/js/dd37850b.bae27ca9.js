"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[3778],{4918:(e,r,n)=>{n.r(r),n.d(r,{assets:()=>l,contentTitle:()=>s,default:()=>g,frontMatter:()=>o,metadata:()=>i,toc:()=>p});var t=n(58168),a=(n(96540),n(15680));const o={},s="Release process",i={unversionedId:"About/For engineers/releaseProcess",id:"About/For engineers/releaseProcess",title:"Release process",description:"Production releases for libraries within va-mobile-library are currently",source:"@site/design/About/For engineers/releaseProcess.md",sourceDirName:"About/For engineers",slug:"/About/For engineers/releaseProcess",permalink:"/va-mobile-app/design/About/For engineers/releaseProcess",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Naming Conventions",permalink:"/va-mobile-app/design/About/For engineers/namingConventions"},next:{title:"Testing",permalink:"/va-mobile-app/design/About/For engineers/testing"}},l={},p=[{value:"Git tags",id:"git-tags",level:2},{value:"Sign-off process",id:"sign-off-process",level:2},{value:"Release notes",id:"release-notes",level:2}],c={toc:p},u="wrapper";function g(e){let{components:r,...n}=e;return(0,a.yg)(u,(0,t.A)({},c,n,{components:r,mdxType:"MDXLayout"}),(0,a.yg)("h1",{id:"release-process"},"Release process"),(0,a.yg)("p",null,"Production releases for libraries within va-mobile-library are currently\ntriggered manually by engineers after each merge into the ",(0,a.yg)("inlineCode",{parentName:"p"},"main")," branch. We have\na ",(0,a.yg)("a",{parentName:"p",href:"https://github.com/department-of-veterans-affairs/va-mobile-library/actions/workflows/publish.yml"},"Publish Workflow in GitHub Actions"),"\nwhich automatically increments the specified package's version, creates a git\ntag, and publishes a new version to NPM. "),(0,a.yg)("p",null,"Alpha and beta releases are also released using the same workflow, but are\ntypically triggered from a development branch. See the ",(0,a.yg)("a",{parentName:"p",href:"https://department-of-veterans-affairs.github.io/va-mobile-app/design/About/For%20engineers/versioning"},"Versioning Policy"),"\nfor an explanation on how we handle versioning."),(0,a.yg)("h2",{id:"git-tags"},"Git tags"),(0,a.yg)("p",null,"Upon each release, a git tag is created for the release with a format of\n","[package]","-v","[X.X.X]"," which allows for historical snapshots of each version. For\nexample:"),(0,a.yg)("ul",null,(0,a.yg)("li",{parentName:"ul"},"components-v0.19.0"),(0,a.yg)("li",{parentName:"ul"},"assets-v0.10.0"),(0,a.yg)("li",{parentName:"ul"},"tokens-v0.12.0"),(0,a.yg)("li",{parentName:"ul"},"linting-v0.19.0")),(0,a.yg)("p",null,"Alpha and beta builds have ",(0,a.yg)("inlineCode",{parentName:"p"},"-[alpha/beta].[number]")," appended to the tag. For\nexample:"),(0,a.yg)("ul",null,(0,a.yg)("li",{parentName:"ul"},"components-v0.19.0-alpha.1")),(0,a.yg)("h2",{id:"sign-off-process"},"Sign-off process"),(0,a.yg)("p",null,"There is currently no sign-off process for releases. After work has been\nreviewed and tested, engineers create releases as needed upon merges to the\n",(0,a.yg)("inlineCode",{parentName:"p"},"main")," branch. As our team gets larger and other apps start to consume the\nlibrary, we may explore adding a sign-off process and extending our release\ncadence."),(0,a.yg)("h2",{id:"release-notes"},"Release notes"),(0,a.yg)("p",null,"A ",(0,a.yg)("a",{parentName:"p",href:"https://department-of-veterans-affairs.github.io/va-mobile-app/design/About/For%20engineers/changelog"},"changelog")," is automatically generated upon each release which\nnotes the merged pulled requests and closed issues since the last release. A\nslack notification is also sent to the ",(0,a.yg)("a",{parentName:"p",href:"https://dsva.slack.com/archives/C062TM03HN2"},"#va-mobile-library-alerts"),"\nchannel in DSVA slack."))}g.isMDXComponent=!0},15680:(e,r,n)=>{n.d(r,{xA:()=>c,yg:()=>m});var t=n(96540);function a(e,r,n){return r in e?Object.defineProperty(e,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[r]=n,e}function o(e,r){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);r&&(t=t.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),n.push.apply(n,t)}return n}function s(e){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?o(Object(n),!0).forEach((function(r){a(e,r,n[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))}))}return e}function i(e,r){if(null==e)return{};var n,t,a=function(e,r){if(null==e)return{};var n,t,a={},o=Object.keys(e);for(t=0;t<o.length;t++)n=o[t],r.indexOf(n)>=0||(a[n]=e[n]);return a}(e,r);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(t=0;t<o.length;t++)n=o[t],r.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=t.createContext({}),p=function(e){var r=t.useContext(l),n=r;return e&&(n="function"==typeof e?e(r):s(s({},r),e)),n},c=function(e){var r=p(e.components);return t.createElement(l.Provider,{value:r},e.children)},u="mdxType",g={inlineCode:"code",wrapper:function(e){var r=e.children;return t.createElement(t.Fragment,{},r)}},f=t.forwardRef((function(e,r){var n=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),u=p(n),f=a,m=u["".concat(l,".").concat(f)]||u[f]||g[f]||o;return n?t.createElement(m,s(s({ref:r},c),{},{components:n})):t.createElement(m,s({ref:r},c))}));function m(e,r){var n=arguments,a=r&&r.mdxType;if("string"==typeof e||a){var o=n.length,s=new Array(o);s[0]=f;var i={};for(var l in r)hasOwnProperty.call(r,l)&&(i[l]=r[l]);i.originalType=e,i[u]="string"==typeof e?e:a,s[1]=i;for(var p=2;p<o;p++)s[p]=n[p];return t.createElement.apply(null,s)}return t.createElement.apply(null,n)}f.displayName="MDXCreateElement"}}]);