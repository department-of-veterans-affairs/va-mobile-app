"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[2343],{72442:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>i,default:()=>d,frontMatter:()=>a,metadata:()=>l,toc:()=>u});var o=n(58168),r=(n(96540),n(15680));n(41873);const a={title:"Continuous Integration and Deployment"},i=void 0,l={unversionedId:"Engineering/BackEnd/Architecture/ContinuousIntegrationAndDeployment",id:"Engineering/BackEnd/Architecture/ContinuousIntegrationAndDeployment",title:"Continuous Integration and Deployment",description:"Production Deployment",source:"@site/docs/Engineering/BackEnd/Architecture/ContinuousIntegrationAndDeployment.md",sourceDirName:"Engineering/BackEnd/Architecture",slug:"/Engineering/BackEnd/Architecture/ContinuousIntegrationAndDeployment",permalink:"/va-mobile-app/docs/Engineering/BackEnd/Architecture/ContinuousIntegrationAndDeployment",draft:!1,tags:[],version:"current",frontMatter:{title:"Continuous Integration and Deployment"},sidebar:"tutorialSidebar",previous:{title:"Background Workers and Caching",permalink:"/va-mobile-app/docs/Engineering/BackEnd/Architecture/BackgroundWorkersAndCaching"},next:{title:"Devops",permalink:"/va-mobile-app/docs/Engineering/BackEnd/Architecture/Devops"}},s={},u=[{value:"Production Deployment",id:"production-deployment",level:2},{value:"Staging Deployment",id:"staging-deployment",level:2},{value:"Pull Request Continuous Integration",id:"pull-request-continuous-integration",level:2},{value:"Rubocop",id:"rubocop",level:2}],c={toc:u},p="wrapper";function d(e){let{components:t,...n}=e;return(0,r.yg)(p,(0,o.A)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,r.yg)("h2",{id:"production-deployment"},"Production Deployment"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},"See ",(0,r.yg)("a",{parentName:"li",href:"https://depo-platform-documentation.scrollhelp.site/developer-docs/deployment-process"},"Platform Support docs")," for schedule of production deployment "),(0,r.yg)("li",{parentName:"ul"},"Try to merge in your PR with adequate time to check that it works in staging. Because Staging and Production both use the master branch, once your PR is merged, you only have until the next production deploy to test your changes and revert them if necessary. Your code can occasionally get pulled into an off cycle deploy hotfix that can happen outside the regularly scheduled daily deploys. You can test changes on your branch without merging into master through review instances but this is not commonly used due to workarounds required to get a SIS user token. See ",(0,r.yg)("a",{parentName:"li",href:"/va-mobile-app/docs/Engineering/BackEnd/Testing/ReviewInstances"},"Review Instances"),". "),(0,r.yg)("li",{parentName:"ul"},"Checking when production was last re-deployed can be done at through ",(0,r.yg)("a",{parentName:"li",href:"https://argocd.vfs.va.gov/applications/vets-api-prod?resource="},"Argo")," via the last sync result section.")),(0,r.yg)("h2",{id:"staging-deployment"},"Staging Deployment"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},"Staging automatically redeploys after every new commit to Master (only during business hours). This typically takes up to 20 minutes. "),(0,r.yg)("li",{parentName:"ul"},"Checking when staging was last re-deployed can be done at through ",(0,r.yg)("a",{parentName:"li",href:"https://argocd.vfs.va.gov/applications/vets-api-staging?resource="},"Argo")," via the last sync result section.")),(0,r.yg)("h2",{id:"pull-request-continuous-integration"},"Pull Request Continuous Integration"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},"Follow ",(0,r.yg)("a",{parentName:"li",href:"https://depo-platform-documentation.scrollhelp.site/developer-docs/pull-request-best-practices"},"PR best practices")),(0,r.yg)("li",{parentName:"ul"},"When a PR is created, multiple checks are done before it is allowed to merge. ",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},"Rubocop, all changes must comply with the linter, see ",(0,r.yg)("a",{parentName:"li",href:"#Rubocop"},"Rubocop"),". "),(0,r.yg)("li",{parentName:"ul"},"All specs must pass. There are some specs (non-mobile) that do not pass consistently. This typically get disabled for this check but can occasionally slip through and fail your specs. If this check does fail, it may be a transient issue with the CI pipeline and just needs to be re-run. Occassionally, bad code gets merged into master that eventually gets corrected. You may need to re-merge with master to bring in these fixes to get this job to succeed (use re-merge master button on PR github page, don't have to do it manually). If after about 4 to 5 re-runs and re-merges of master into your branch, if it is still not passing, reach out to ",(0,r.yg)("a",{parentName:"li",href:"https://dsva.slack.com/archives/CBU0KDSB1"},"DSVA Platform Support"),"."),(0,r.yg)("li",{parentName:"ul"},"Total lines of change (LOC) is under 500. If it is above 500 and cannot realistically be reduced, you can request an exception through DSVA Platform Support (See above link). JSON and YML files such as VCR cassettes used in specs do not count towards LOC."),(0,r.yg)("li",{parentName:"ul"},"Approved review by a Mobile team member. (Technically, a VA API Engineer from platform support approval will allow you to merge but as an internal policy, we require at least one mobile engineer to approve.)"),(0,r.yg)("li",{parentName:"ul"},"If there are changes outside the mobile module, an additional review will be required by VA API Engineers group. This can also be requested by the DSVA Platform support (see above link).")))),(0,r.yg)("h2",{id:"rubocop"},"Rubocop"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},"A linter used within vets-api that enforces style rules. "),(0,r.yg)("li",{parentName:"ul"},"Can be run locally on all of the mobile code by running ",(0,r.yg)("inlineCode",{parentName:"li"},"bundle exec rubocop modules/mobile -a")),(0,r.yg)("li",{parentName:"ul"},"Rules and exceptions for these styles can be modified in the .rubocop.yml in the root of vets-api"),(0,r.yg)("li",{parentName:"ul"},"Rules can be disabled on a case by case basis by disabling the rule inline in your ruby file. EX: module length rule can be disabled by putting ",(0,r.yg)("inlineCode",{parentName:"li"},"# rubocop:disable Metrics/ModuleLength")," before the module than ",(0,r.yg)("inlineCode",{parentName:"li"},"# rubocop:enable Metrics/ModuleLength")," after the module. This should only be done if complying with the rule creates even worse looking code.")))}d.isMDXComponent=!0},15680:(e,t,n)=>{n.d(t,{xA:()=>c,yg:()=>y});var o=n(96540);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,o,r=function(e,t){if(null==e)return{};var n,o,r={},a=Object.keys(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=o.createContext({}),u=function(e){var t=o.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},c=function(e){var t=u(e.components);return o.createElement(s.Provider,{value:t},e.children)},p="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},g=o.forwardRef((function(e,t){var n=e.components,r=e.mdxType,a=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),p=u(n),g=r,y=p["".concat(s,".").concat(g)]||p[g]||d[g]||a;return n?o.createElement(y,i(i({ref:t},c),{},{components:n})):o.createElement(y,i({ref:t},c))}));function y(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=n.length,i=new Array(a);i[0]=g;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[p]="string"==typeof e?e:r,i[1]=l;for(var u=2;u<a;u++)i[u]=n[u];return o.createElement.apply(null,i)}return o.createElement.apply(null,n)}g.displayName="MDXCreateElement"},41873:(e,t,n)=>{n(96540)}}]);