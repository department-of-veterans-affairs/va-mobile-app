"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[1294],{28453:(e,o,n)=>{n.d(o,{R:()=>a,x:()=>r});var t=n(96540);const i={},s=t.createContext(i);function a(e){const o=t.useContext(s);return t.useMemo((function(){return"function"==typeof e?e(o):{...o,...e}}),[o,e])}function r(e){let o;return o=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:a(e.components),t.createElement(s.Provider,{value:o},e.children)}},80093:(e,o,n)=>{n.r(o),n.d(o,{assets:()=>l,contentTitle:()=>r,default:()=>u,frontMatter:()=>a,metadata:()=>t,toc:()=>c});const t=JSON.parse('{"id":"Engineering/DevOps/AutomationCodeDocs/GitHubActions/Overview","title":"GitHub Actions","description":"Overview","source":"@site/docs/Engineering/DevOps/AutomationCodeDocs/GitHubActions/Overview.md","sourceDirName":"Engineering/DevOps/AutomationCodeDocs/GitHubActions","slug":"/Engineering/DevOps/AutomationCodeDocs/GitHubActions/Overview","permalink":"/va-mobile-app/docs/Engineering/DevOps/AutomationCodeDocs/GitHubActions/Overview","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":1,"frontMatter":{"sidebar_position":1,"sidebar_label":"Overview"},"sidebar":"tutorialSidebar","previous":{"title":"Unit Tests","permalink":"/va-mobile-app/docs/Engineering/FrontEnd/Testing/UnitTesting"},"next":{"title":"Build and Release Workflows","permalink":"/va-mobile-app/docs/Engineering/DevOps/AutomationCodeDocs/GitHubActions/BuildReleaseWorkflows"}}');var i=n(74848),s=n(28453);const a={sidebar_position:1,sidebar_label:"Overview"},r="GitHub Actions",l={},c=[{value:"Overview",id:"overview",level:2},{value:"Workflows",id:"workflows",level:2},{value:"Build and Release Workflows",id:"build-and-release-workflows",level:2},{value:"Code Quality Workflows",id:"code-quality-workflows",level:2},{value:"Other Workflows",id:"other-workflows",level:2},{value:"Code Quality",id:"code-quality",level:3},{value:"Automation Robot",id:"automation-robot",level:2},{value:"Local Testing",id:"local-testing",level:2}];function d(e){const o={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",ul:"ul",...(0,s.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(o.header,{children:(0,i.jsx)(o.h1,{id:"github-actions",children:"GitHub Actions"})}),"\n",(0,i.jsx)(o.h2,{id:"overview",children:"Overview"}),"\n",(0,i.jsxs)(o.p,{children:[(0,i.jsx)(o.a,{href:"https://github.com/features/actions",children:"GitHub Actions"})," is used to automate several processes for our project, including build automation, releases, ensuring code quality, and other workflows related to project management. Our workflows can be found on the va-mobile-app repo's ",(0,i.jsx)(o.a,{href:"https://github.com/department-of-veterans-affairs/va-mobile-app/actions",children:"Actions tab"}),"."]}),"\n",(0,i.jsx)(o.h2,{id:"workflows",children:"Workflows"}),"\n",(0,i.jsx)(o.p,{children:"Our workflows can curently be categorized into three types: Release and Build workflows, Code Quality workflows, and Other workflows."}),"\n",(0,i.jsx)(o.h2,{id:"build-and-release-workflows",children:"Build and Release Workflows"}),"\n",(0,i.jsxs)(o.p,{children:["We ",(0,i.jsx)(o.a,{href:"/docs/Operations/Releases/release-process",children:"release"})," a new version of the app to app stores every 2 weeks. The process of building, packaging, uploading the app, updating screenshots and release notes manually can be very time consuming. We use a combination of ",(0,i.jsx)(o.a,{href:"https://docs.github.com/en/actions",children:"GitHub Actions"})," and ",(0,i.jsx)(o.a,{href:"https://fastlane.tools/",children:"fastlane"})," to automate these processes with a combination of git branching strategy, scheduled jobs, and scripting."]}),"\n",(0,i.jsx)(o.p,{children:(0,i.jsx)(o.a,{href:"/docs/Engineering/DevOps/AutomationCodeDocs/GitHubActions/BuildReleaseWorkflows",children:"View Build and Release Workflows"})}),"\n",(0,i.jsx)(o.h2,{id:"code-quality-workflows",children:"Code Quality Workflows"}),"\n",(0,i.jsxs)(o.p,{children:["Our automations also help us prevent bad code from shipping out by performing linting and running unit tests before PRs are allowed to pass, keeping our dependencies up todate, scanning for vulnerability, and automating ",(0,i.jsx)(o.a,{href:"https://www.testrail.com/",children:"TestRail"})," runs."]}),"\n",(0,i.jsx)(o.p,{children:(0,i.jsx)(o.a,{href:"/docs/Engineering/DevOps/AutomationCodeDocs/GitHubActions/CodeQualityWorkflows",children:"View Code Quality Workflows"})}),"\n",(0,i.jsx)(o.h2,{id:"other-workflows",children:"Other Workflows"}),"\n",(0,i.jsx)(o.p,{children:"We also have other workflows to help us with more general tasks, such as getting a use added to our GitHub repo, sending Slack messages, enabling slash commands on our GitHub issues, and deploying our this documentation site."}),"\n",(0,i.jsx)(o.p,{children:(0,i.jsx)(o.a,{href:"/docs/Engineering/DevOps/AutomationCodeDocs/GitHubActions/OtherWorkflows",children:"View Other Workflows"})}),"\n",(0,i.jsx)(o.h3,{id:"code-quality",children:"Code Quality"}),"\n",(0,i.jsxs)(o.ul,{children:["\n",(0,i.jsx)(o.li,{children:"Code checks: linting and automated test runners"}),"\n",(0,i.jsxs)(o.li,{children:["Vulnerability checking with ",(0,i.jsx)(o.a,{href:"https://codeql.github.com/",children:"CodeQL"})]}),"\n"]}),"\n",(0,i.jsx)(o.h2,{id:"automation-robot",children:"Automation Robot"}),"\n",(0,i.jsxs)(o.p,{children:["We use our GitHub automation robot account to do any work in Actions. ",(0,i.jsx)(o.code,{children:"va-mobile-automation-robot"})," account credentials are located in the VA Mobile vault in 1Password."]}),"\n",(0,i.jsx)(o.p,{children:"I would recommend that you use this account in a separate browser from your every-day browser. It's easier to have the two accounts at hand if one is running in Chrome and the other is only used in say Safari."}),"\n",(0,i.jsxs)(o.p,{children:["Access in Actions is granted with ",(0,i.jsx)(o.a,{href:"https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token",children:"Personal Access Tokens"}),"."]}),"\n",(0,i.jsx)(o.h2,{id:"local-testing",children:"Local Testing"}),"\n",(0,i.jsxs)(o.p,{children:["You can test GitHub Actions on your local machine using ",(0,i.jsx)(o.a,{href:"https://github.com/nektos/act",children:"act CLI tool"})]}),"\n",(0,i.jsx)(o.p,{children:(0,i.jsx)(o.a,{href:"https://github.com/department-of-veterans-affairs/va-mobile-app/tree/develop/.github/test-data",children:"View saved test data used in local testing"})})]})}function u(e={}){const{wrapper:o}={...(0,s.R)(),...e.components};return o?(0,i.jsx)(o,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}}}]);