"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[6583],{3905:function(e,t,n){n.d(t,{Zo:function(){return d},kt:function(){return m}});var r=n(67294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},l=Object.keys(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var p=r.createContext({}),s=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},d=function(e){var t=s(e.components);return r.createElement(p.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},c=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,l=e.originalType,p=e.parentName,d=o(e,["components","mdxType","originalType","parentName"]),c=s(n),m=a,h=c["".concat(p,".").concat(m)]||c[m]||u[m]||l;return n?r.createElement(h,i(i({ref:t},d),{},{components:n})):r.createElement(h,i({ref:t},d))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var l=n.length,i=new Array(l);i[0]=c;var o={};for(var p in t)hasOwnProperty.call(t,p)&&(o[p]=t[p]);o.originalType=e,o.mdxType="string"==typeof e?e:a,i[1]=o;for(var s=2;s<l;s++)i[s]=n[s];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}c.displayName="MDXCreateElement"},73025:function(e,t,n){n.r(t),n.d(t,{contentTitle:function(){return p},default:function(){return c},frontMatter:function(){return o},metadata:function(){return s},toc:function(){return d}});var r=n(87462),a=n(63366),l=(n(67294),n(3905)),i=["components"],o={sidebar_position:2,sidebar_label:"Scripts, Etc."},p=void 0,s={unversionedId:"Engineering/DevOps/Automation Code Docs/Scripts",id:"Engineering/DevOps/Automation Code Docs/Scripts",title:"Scripts",description:"Lists all the reusable scripts available in the repository.",source:"@site/docs/Engineering/DevOps/Automation Code Docs/Scripts.md",sourceDirName:"Engineering/DevOps/Automation Code Docs",slug:"/Engineering/DevOps/Automation Code Docs/Scripts",permalink:"/va-mobile-app/docs/Engineering/DevOps/Automation Code Docs/Scripts",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2,sidebar_label:"Scripts, Etc."},sidebar:"tutorialSidebar",previous:{title:"Other Workflows",permalink:"/va-mobile-app/docs/Engineering/DevOps/Automation Code Docs/GitHub Actions/OtherWorkflows"},next:{title:"Signing Keys",permalink:"/va-mobile-app/docs/Engineering/DevOps/Automation Code Docs/Signing Keys/"}},d=[{value:"<code>on-demand-build.sh</code>",id:"on-demand-buildsh",children:[{value:"Description",id:"description",children:[],level:3},{value:"Parameters",id:"parameters",children:[],level:3},{value:"File location",id:"file-location",children:[],level:3}],level:2},{value:"<code>production.sh</code>",id:"productionsh",children:[{value:"Description",id:"description-1",children:[],level:3},{value:"Parameters",id:"parameters-1",children:[],level:3},{value:"File location",id:"file-location-1",children:[],level:3}],level:2},{value:"<code>release_branch.sh</code>",id:"release_branchsh",children:[{value:"Description",id:"description-2",children:[{value:"From the help:",id:"from-the-help",children:[],level:4}],level:3},{value:"Parameters",id:"parameters-2",children:[],level:3},{value:"File location",id:"file-location-2",children:[],level:3}],level:2}],u={toc:d};function c(e){var t=e.components,n=(0,a.Z)(e,i);return(0,l.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("p",null,"Lists all the reusable scripts available in the repository. "),(0,l.kt)("h2",{id:"on-demand-buildsh"},(0,l.kt)("inlineCode",{parentName:"h2"},"on-demand-build.sh")),(0,l.kt)("h3",{id:"description"},"Description"),(0,l.kt)("p",null,"This script allows a developer with the correct Signing Keys stored locally to build a configured version for one of the stores. "),(0,l.kt)("p",null,"This version can be configured with any of the below parameters and will run the correct Fastlane script to complete the job. "),(0,l.kt)("h3",{id:"parameters"},"Parameters"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:null},"Flag"),(0,l.kt)("th",{parentName:"tr",align:null},"Description"),(0,l.kt)("th",{parentName:"tr",align:null},"required?"),(0,l.kt)("th",{parentName:"tr",align:null},"type"),(0,l.kt)("th",{parentName:"tr",align:null},"default?"),(0,l.kt)("th",{parentName:"tr",align:null},"choose from (case sensitive)"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"-o OR --os"),(0,l.kt)("td",{parentName:"tr",align:null},"Operating system to build for"),(0,l.kt)("td",{parentName:"tr",align:null},"yes"),(0,l.kt)("td",{parentName:"tr",align:null},"string"),(0,l.kt)("td",{parentName:"tr",align:null},"none"),(0,l.kt)("td",{parentName:"tr",align:null},"[ios, android]")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"-e OR --environment"),(0,l.kt)("td",{parentName:"tr",align:null},"Vets API environment to build for"),(0,l.kt)("td",{parentName:"tr",align:null},"no"),(0,l.kt)("td",{parentName:"tr",align:null},"string"),(0,l.kt)("td",{parentName:"tr",align:null},"staging"),(0,l.kt)("td",{parentName:"tr",align:null},"[staging, production]")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"-b OR --branch"),(0,l.kt)("td",{parentName:"tr",align:null},"Branch to checkout"),(0,l.kt)("td",{parentName:"tr",align:null},"no"),(0,l.kt)("td",{parentName:"tr",align:null},"string"),(0,l.kt)("td",{parentName:"tr",align:null},"develop"),(0,l.kt)("td",{parentName:"tr",align:null},"Any GitHub Branch")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"-t OR --type"),(0,l.kt)("td",{parentName:"tr",align:null},"Type of build"),(0,l.kt)("td",{parentName:"tr",align:null},"no"),(0,l.kt)("td",{parentName:"tr",align:null},"string"),(0,l.kt)("td",{parentName:"tr",align:null},"qa"),(0,l.kt)("td",{parentName:"tr",align:null},"[qa, release, hotfix]")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"-f OR --flight_group"),(0,l.kt)("td",{parentName:"tr",align:null},"Test Flight group to build for (iOS)"),(0,l.kt)("td",{parentName:"tr",align:null},"no"),(0,l.kt)("td",{parentName:"tr",align:null},"string"),(0,l.kt)("td",{parentName:"tr",align:null},"Development Team"),(0,l.kt)("td",{parentName:"tr",align:null},"[Development Team, Ad Hoc Production Testers, IAM Group, Push Testing, UAT Group, VA 508 Testers, VA Employee (Wide) Beta, VA Production Testers, VA Stakeholders]")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"-p OR --play_track"),(0,l.kt)("td",{parentName:"tr",align:null},"Google Play Track to build for (Android)"),(0,l.kt)("td",{parentName:"tr",align:null},"no"),(0,l.kt)("td",{parentName:"tr",align:null},"string"),(0,l.kt)("td",{parentName:"tr",align:null},"Development Team"),(0,l.kt)("td",{parentName:"tr",align:null},"[Development Team, VA Production Testers]")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"-n OR --notes"),(0,l.kt)("td",{parentName:"tr",align:null},"Notes to display in Test Flight or Firebase Distribution for this build"),(0,l.kt)("td",{parentName:"tr",align:null},"no"),(0,l.kt)("td",{parentName:"tr",align:null},"string"),(0,l.kt)("td",{parentName:"tr",align:null},"none"),(0,l.kt)("td",{parentName:"tr",align:null},"NA")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"-h OR --help"),(0,l.kt)("td",{parentName:"tr",align:null},"Displays this help menu"),(0,l.kt)("td",{parentName:"tr",align:null},"no"),(0,l.kt)("td",{parentName:"tr",align:null},"NA"),(0,l.kt)("td",{parentName:"tr",align:null},"NA"),(0,l.kt)("td",{parentName:"tr",align:null},"NA")))),(0,l.kt)("h3",{id:"file-location"},"File location"),(0,l.kt)("p",null,(0,l.kt)("a",{parentName:"p",href:"https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/VAMobile/on-demand-build.sh"},"~/VAMobile.on-demand-build.sh")),(0,l.kt)("hr",null),(0,l.kt)("h2",{id:"productionsh"},(0,l.kt)("inlineCode",{parentName:"h2"},"production.sh")),(0,l.kt)("h3",{id:"description-1"},"Description"),(0,l.kt)("p",null,"Build an production version of Android or iOS. This will deploy to the release staging lane for the OS."),(0,l.kt)("p",null,"Requires that the developer have the corret certificates installed on their local machine. "),(0,l.kt)("h3",{id:"parameters-1"},"Parameters"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:null},"Flag"),(0,l.kt)("th",{parentName:"tr",align:null},"Description"),(0,l.kt)("th",{parentName:"tr",align:null},"required?"),(0,l.kt)("th",{parentName:"tr",align:null},"type"),(0,l.kt)("th",{parentName:"tr",align:null},"default?"),(0,l.kt)("th",{parentName:"tr",align:null},"choose from (case sensitive)"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"-o OR --os"),(0,l.kt)("td",{parentName:"tr",align:null},"Operating system to build for"),(0,l.kt)("td",{parentName:"tr",align:null},"yes"),(0,l.kt)("td",{parentName:"tr",align:null},"string"),(0,l.kt)("td",{parentName:"tr",align:null},"none"),(0,l.kt)("td",{parentName:"tr",align:null},"[ios, android]")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"-v OR --version"),(0,l.kt)("td",{parentName:"tr",align:null},"Version name"),(0,l.kt)("td",{parentName:"tr",align:null},"yes"),(0,l.kt)("td",{parentName:"tr",align:null},"string"),(0,l.kt)("td",{parentName:"tr",align:null},"none"),(0,l.kt)("td",{parentName:"tr",align:null},"Should conform to the regular expression ",(0,l.kt)("inlineCode",{parentName:"td"},"/^v\\d+\\.\\d+\\.\\d+/")," (eg v1.1.10)")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"-h OR --help"),(0,l.kt)("td",{parentName:"tr",align:null},"Displays this help menu"),(0,l.kt)("td",{parentName:"tr",align:null},"NA"),(0,l.kt)("td",{parentName:"tr",align:null},"NA"),(0,l.kt)("td",{parentName:"tr",align:null},"NA"),(0,l.kt)("td",{parentName:"tr",align:null},"NA")))),(0,l.kt)("h3",{id:"file-location-1"},"File location"),(0,l.kt)("p",null,(0,l.kt)("a",{parentName:"p",href:"https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/VAMobile/production.sh"},"~/VAMobile/production.sh")),(0,l.kt)("hr",null),(0,l.kt)("h2",{id:"release_branchsh"},(0,l.kt)("inlineCode",{parentName:"h2"},"release_branch.sh")),(0,l.kt)("h3",{id:"description-2"},"Description"),(0,l.kt)("p",null,"This script is used by the release branch automation. because release branches happen every two weeks and chrontabs notation does not offer intervals we have this script."),(0,l.kt)("h4",{id:"from-the-help"},"From the help:"),(0,l.kt)("blockquote",null,(0,l.kt)("p",{parentName:"blockquote"},"Release branch automation script"),(0,l.kt)("p",{parentName:"blockquote"},"This script does the following:"),(0,l.kt)("ol",{parentName:"blockquote"},(0,l.kt)("li",{parentName:"ol"},"Checks the date to see if it occurs at a 2 week interval from August 4, 2021. (If this is true, then we should cut a release branch from develop"),(0,l.kt)("li",{parentName:"ol"},"Checks out the main branch, then pulls the latest tag."),(0,l.kt)("li",{parentName:"ol"},"Increments the latest tag by the minor version to get the next release version number"),(0,l.kt)("li",{parentName:"ol"},"Checks out and pulls latest develop branch"),(0,l.kt)("li",{parentName:"ol"},"Creates a new release branch with the correct name and pushes it up to the origin"))),(0,l.kt)("h3",{id:"parameters-2"},"Parameters"),(0,l.kt)("p",null,"None"),(0,l.kt)("h3",{id:"file-location-2"},"File location"),(0,l.kt)("p",null,(0,l.kt)("a",{parentName:"p",href:"https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/VAMobile/release_branch.sh"},"~/VAMobile/release_branch.sh")),(0,l.kt)("hr",null))}c.isMDXComponent=!0}}]);