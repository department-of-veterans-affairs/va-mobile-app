"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[7690],{28453:(e,i,n)=>{n.d(i,{R:()=>d,x:()=>l});var t=n(96540);const s={},r=t.createContext(s);function d(e){const i=t.useContext(r);return t.useMemo((function(){return"function"==typeof e?e(i):{...i,...e}}),[i,e])}function l(e){let i;return i=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:d(e.components),t.createElement(r.Provider,{value:i},e.children)}},90722:(e,i,n)=>{n.r(i),n.d(i,{assets:()=>o,contentTitle:()=>l,default:()=>a,frontMatter:()=>d,metadata:()=>t,toc:()=>c});const t=JSON.parse('{"id":"Engineering/DevOps/AutomationCodeDocs/Scripts","title":"Scripts","description":"Lists all the reusable scripts available in the repository.","source":"@site/docs/Engineering/DevOps/AutomationCodeDocs/Scripts.md","sourceDirName":"Engineering/DevOps/AutomationCodeDocs","slug":"/Engineering/DevOps/AutomationCodeDocs/Scripts","permalink":"/va-mobile-app/docs/Engineering/DevOps/AutomationCodeDocs/Scripts","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":2,"frontMatter":{"sidebar_position":2,"sidebar_label":"Scripts, Etc."},"sidebar":"tutorialSidebar","previous":{"title":"Release Issues","permalink":"/va-mobile-app/docs/Engineering/DevOps/AutomationCodeDocs/GitHubActions/ReleaseIssues"},"next":{"title":"Signing Keys","permalink":"/va-mobile-app/docs/Engineering/DevOps/AutomationCodeDocs/SigningKeys/"}}');var s=n(74848),r=n(28453);const d={sidebar_position:2,sidebar_label:"Scripts, Etc."},l=void 0,o={},c=[{value:"<code>on-demand-build.sh</code>",id:"on-demand-buildsh",level:2},{value:"Description",id:"description",level:3},{value:"Parameters",id:"parameters",level:3},{value:"File location",id:"file-location",level:3},{value:"<code>production.sh</code>",id:"productionsh",level:2},{value:"Description",id:"description-1",level:3},{value:"Parameters",id:"parameters-1",level:3},{value:"File location",id:"file-location-1",level:3},{value:"<code>release_branch.sh</code>",id:"release_branchsh",level:2},{value:"Description",id:"description-2",level:3},{value:"From the help:",id:"from-the-help",level:4},{value:"Parameters",id:"parameters-2",level:3},{value:"File location",id:"file-location-2",level:3}];function h(e){const i={a:"a",blockquote:"blockquote",code:"code",h2:"h2",h3:"h3",h4:"h4",hr:"hr",li:"li",ol:"ol",p:"p",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,r.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(i.p,{children:"Lists all the reusable scripts available in the repository."}),"\n",(0,s.jsx)(i.h2,{id:"on-demand-buildsh",children:(0,s.jsx)(i.code,{children:"on-demand-build.sh"})}),"\n",(0,s.jsx)(i.h3,{id:"description",children:"Description"}),"\n",(0,s.jsx)(i.p,{children:"This script allows a developer with the correct Signing Keys stored locally to build a configured version for one of the stores."}),"\n",(0,s.jsx)(i.p,{children:"This version can be configured with any of the below parameters and will run the correct Fastlane script to complete the job."}),"\n",(0,s.jsx)(i.h3,{id:"parameters",children:"Parameters"}),"\n",(0,s.jsxs)(i.table,{children:[(0,s.jsx)(i.thead,{children:(0,s.jsxs)(i.tr,{children:[(0,s.jsx)(i.th,{children:"Flag"}),(0,s.jsx)(i.th,{children:"Description"}),(0,s.jsx)(i.th,{children:"required?"}),(0,s.jsx)(i.th,{children:"type"}),(0,s.jsx)(i.th,{children:"default?"}),(0,s.jsx)(i.th,{children:"choose from (case sensitive)"})]})}),(0,s.jsxs)(i.tbody,{children:[(0,s.jsxs)(i.tr,{children:[(0,s.jsx)(i.td,{children:"-o OR --os"}),(0,s.jsx)(i.td,{children:"Operating system to build for"}),(0,s.jsx)(i.td,{children:"yes"}),(0,s.jsx)(i.td,{children:"string"}),(0,s.jsx)(i.td,{children:"none"}),(0,s.jsx)(i.td,{children:"[ios, android]"})]}),(0,s.jsxs)(i.tr,{children:[(0,s.jsx)(i.td,{children:"-e OR --environment"}),(0,s.jsx)(i.td,{children:"Vets API environment to build for"}),(0,s.jsx)(i.td,{children:"no"}),(0,s.jsx)(i.td,{children:"string"}),(0,s.jsx)(i.td,{children:"staging"}),(0,s.jsx)(i.td,{children:"[staging, production]"})]}),(0,s.jsxs)(i.tr,{children:[(0,s.jsx)(i.td,{children:"-b OR --branch"}),(0,s.jsx)(i.td,{children:"Branch to checkout"}),(0,s.jsx)(i.td,{children:"no"}),(0,s.jsx)(i.td,{children:"string"}),(0,s.jsx)(i.td,{children:"develop"}),(0,s.jsx)(i.td,{children:"Any GitHub Branch"})]}),(0,s.jsxs)(i.tr,{children:[(0,s.jsx)(i.td,{children:"-t OR --type"}),(0,s.jsx)(i.td,{children:"Type of build"}),(0,s.jsx)(i.td,{children:"no"}),(0,s.jsx)(i.td,{children:"string"}),(0,s.jsx)(i.td,{children:"qa"}),(0,s.jsx)(i.td,{children:"[qa, release, hotfix]"})]}),(0,s.jsxs)(i.tr,{children:[(0,s.jsx)(i.td,{children:"-f OR --flight_group"}),(0,s.jsx)(i.td,{children:"Test Flight group to build for (iOS)"}),(0,s.jsx)(i.td,{children:"no"}),(0,s.jsx)(i.td,{children:"string"}),(0,s.jsx)(i.td,{children:"Development Team"}),(0,s.jsx)(i.td,{children:"[Development Team, Ad Hoc Production Testers, IAM Group, Push Testing, UAT Group, VA 508 Testers, VA Employee (Wide) Beta, VA Production Testers, VA Stakeholders]"})]}),(0,s.jsxs)(i.tr,{children:[(0,s.jsx)(i.td,{children:"-p OR --play_track"}),(0,s.jsx)(i.td,{children:"Google Play Track to build for (Android)"}),(0,s.jsx)(i.td,{children:"no"}),(0,s.jsx)(i.td,{children:"string"}),(0,s.jsx)(i.td,{children:"Development Team"}),(0,s.jsx)(i.td,{children:"[Development Team, VA Production Testers]"})]}),(0,s.jsxs)(i.tr,{children:[(0,s.jsx)(i.td,{children:"-n OR --notes"}),(0,s.jsx)(i.td,{children:"Notes to display in Test Flight or Firebase Distribution for this build"}),(0,s.jsx)(i.td,{children:"no"}),(0,s.jsx)(i.td,{children:"string"}),(0,s.jsx)(i.td,{children:"none"}),(0,s.jsx)(i.td,{children:"NA"})]}),(0,s.jsxs)(i.tr,{children:[(0,s.jsx)(i.td,{children:"-h OR --help"}),(0,s.jsx)(i.td,{children:"Displays this help menu"}),(0,s.jsx)(i.td,{children:"no"}),(0,s.jsx)(i.td,{children:"NA"}),(0,s.jsx)(i.td,{children:"NA"}),(0,s.jsx)(i.td,{children:"NA"})]})]})]}),"\n",(0,s.jsx)(i.h3,{id:"file-location",children:"File location"}),"\n",(0,s.jsx)(i.p,{children:(0,s.jsx)(i.a,{href:"https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/VAMobile/on-demand-build.sh",children:"~/VAMobile.on-demand-build.sh"})}),"\n",(0,s.jsx)(i.hr,{}),"\n",(0,s.jsx)(i.h2,{id:"productionsh",children:(0,s.jsx)(i.code,{children:"production.sh"})}),"\n",(0,s.jsx)(i.h3,{id:"description-1",children:"Description"}),"\n",(0,s.jsx)(i.p,{children:"Build an production version of Android or iOS. This will deploy to the release staging lane for the OS."}),"\n",(0,s.jsx)(i.p,{children:"Requires that the developer have the corret certificates installed on their local machine."}),"\n",(0,s.jsx)(i.h3,{id:"parameters-1",children:"Parameters"}),"\n",(0,s.jsxs)(i.table,{children:[(0,s.jsx)(i.thead,{children:(0,s.jsxs)(i.tr,{children:[(0,s.jsx)(i.th,{children:"Flag"}),(0,s.jsx)(i.th,{children:"Description"}),(0,s.jsx)(i.th,{children:"required?"}),(0,s.jsx)(i.th,{children:"type"}),(0,s.jsx)(i.th,{children:"default?"}),(0,s.jsx)(i.th,{children:"choose from (case sensitive)"})]})}),(0,s.jsxs)(i.tbody,{children:[(0,s.jsxs)(i.tr,{children:[(0,s.jsx)(i.td,{children:"-o OR --os"}),(0,s.jsx)(i.td,{children:"Operating system to build for"}),(0,s.jsx)(i.td,{children:"yes"}),(0,s.jsx)(i.td,{children:"string"}),(0,s.jsx)(i.td,{children:"none"}),(0,s.jsx)(i.td,{children:"[ios, android]"})]}),(0,s.jsxs)(i.tr,{children:[(0,s.jsx)(i.td,{children:"-v OR --version"}),(0,s.jsx)(i.td,{children:"Version name"}),(0,s.jsx)(i.td,{children:"yes"}),(0,s.jsx)(i.td,{children:"string"}),(0,s.jsx)(i.td,{children:"none"}),(0,s.jsxs)(i.td,{children:["Should conform to the regular expression ",(0,s.jsx)(i.code,{children:"/^v\\d+\\.\\d+\\.\\d+/"})," (eg v1.1.10)"]})]}),(0,s.jsxs)(i.tr,{children:[(0,s.jsx)(i.td,{children:"-h OR --help"}),(0,s.jsx)(i.td,{children:"Displays this help menu"}),(0,s.jsx)(i.td,{children:"NA"}),(0,s.jsx)(i.td,{children:"NA"}),(0,s.jsx)(i.td,{children:"NA"}),(0,s.jsx)(i.td,{children:"NA"})]})]})]}),"\n",(0,s.jsx)(i.h3,{id:"file-location-1",children:"File location"}),"\n",(0,s.jsx)(i.p,{children:(0,s.jsx)(i.a,{href:"https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/VAMobile/production.sh",children:"~/VAMobile/production.sh"})}),"\n",(0,s.jsx)(i.hr,{}),"\n",(0,s.jsx)(i.h2,{id:"release_branchsh",children:(0,s.jsx)(i.code,{children:"release_branch.sh"})}),"\n",(0,s.jsx)(i.h3,{id:"description-2",children:"Description"}),"\n",(0,s.jsx)(i.p,{children:"This script is used by the release branch automation. because release branches happen every two weeks and chrontabs notation does not offer intervals we have this script."}),"\n",(0,s.jsx)(i.h4,{id:"from-the-help",children:"From the help:"}),"\n",(0,s.jsxs)(i.blockquote,{children:["\n",(0,s.jsx)(i.p,{children:"Release branch automation script"}),"\n",(0,s.jsx)(i.p,{children:"This script does the following:"}),"\n",(0,s.jsxs)(i.ol,{children:["\n",(0,s.jsx)(i.li,{children:"Checks the date to see if it occurs at a 2 week interval from August 4, 2021. (If this is true, then we should cut a release branch from develop"}),"\n",(0,s.jsx)(i.li,{children:"Checks out the main branch, then pulls the latest tag."}),"\n",(0,s.jsx)(i.li,{children:"Increments the latest tag by the minor version to get the next release version number"}),"\n",(0,s.jsx)(i.li,{children:"Checks out and pulls latest develop branch"}),"\n",(0,s.jsx)(i.li,{children:"Creates a new release branch with the correct name and pushes it up to the origin"}),"\n"]}),"\n"]}),"\n",(0,s.jsx)(i.h3,{id:"parameters-2",children:"Parameters"}),"\n",(0,s.jsx)(i.p,{children:"None"}),"\n",(0,s.jsx)(i.h3,{id:"file-location-2",children:"File location"}),"\n",(0,s.jsx)(i.p,{children:(0,s.jsx)(i.a,{href:"https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/VAMobile/release_branch.sh",children:"~/VAMobile/release_branch.sh"})}),"\n",(0,s.jsx)(i.hr,{})]})}function a(e={}){const{wrapper:i}={...(0,r.R)(),...e.components};return i?(0,s.jsx)(i,{...e,children:(0,s.jsx)(h,{...e})}):h(e)}}}]);