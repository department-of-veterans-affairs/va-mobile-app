"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[3070],{28453:(e,s,i)=>{i.d(s,{R:()=>l,x:()=>d});var r=i(96540);const n={},t=r.createContext(n);function l(e){const s=r.useContext(t);return r.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function d(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:l(e.components),r.createElement(t.Provider,{value:s},e.children)}},62166:(e,s,i)=>{i.r(s),i.d(s,{assets:()=>a,contentTitle:()=>d,default:()=>c,frontMatter:()=>l,metadata:()=>r,toc:()=>o});const r=JSON.parse('{"id":"Engineering/DevOps/AutomationCodeDocs/GitHubActions/BuildReleaseWorkflows","title":"Build and Release Workflows","description":"This section contains all of the workflows that are related to our packaging our apps and automating our Release Process. Use the sidebar to the right to jump directly to workflows.","source":"@site/docs/Engineering/DevOps/AutomationCodeDocs/GitHubActions/BuildReleaseWorkflows.md","sourceDirName":"Engineering/DevOps/AutomationCodeDocs/GitHubActions","slug":"/Engineering/DevOps/AutomationCodeDocs/GitHubActions/BuildReleaseWorkflows","permalink":"/va-mobile-app/docs/Engineering/DevOps/AutomationCodeDocs/GitHubActions/BuildReleaseWorkflows","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":2,"frontMatter":{"sidebar_position":2,"sidebar_label":"Build and Release Workflows"},"sidebar":"tutorialSidebar","previous":{"title":"Overview","permalink":"/va-mobile-app/docs/Engineering/DevOps/AutomationCodeDocs/GitHubActions/Overview"},"next":{"title":"Code Quality Workflows","permalink":"/va-mobile-app/docs/Engineering/DevOps/AutomationCodeDocs/GitHubActions/CodeQualityWorkflows"}}');var n=i(74848),t=i(28453);const l={sidebar_position:2,sidebar_label:"Build and Release Workflows"},d="Build and Release Workflows",a={},o=[{value:"Build Automation Capabilities",id:"build-automation-capabilities",level:2},{value:"Build Workflows",id:"build-workflows",level:2},{value:"Reusable Build Workflows",id:"reusable-build-workflows",level:2},{value:"Reusable iOS Workflow (<code>build_ios</code>)",id:"reusable-ios-workflow-build_ios",level:3},{value:"Description",id:"description",level:4},{value:"Trigger",id:"trigger",level:4},{value:"Parameters",id:"parameters",level:4},{value:"Inputs",id:"inputs",level:5},{value:"Reusable Android Workflow (<code>build_android</code>)",id:"reusable-android-workflow-build_android",level:3},{value:"Description",id:"description-1",level:4},{value:"Trigger",id:"trigger-1",level:4},{value:"Parameters",id:"parameters-1",level:4},{value:"Inputs",id:"inputs-1",level:5},{value:"Build Workflows",id:"build-workflows-1",level:2},{value:"Daily QA Build (<code>qa_build</code>)",id:"daily-qa-build-qa_build",level:3},{value:"Description",id:"description-2",level:4},{value:"Triggers",id:"triggers",level:4},{value:"On Demand Build (<code>on_demand_build</code>)",id:"on-demand-build-on_demand_build",level:3},{value:"Description",id:"description-3",level:4},{value:"Triggers",id:"triggers-1",level:4},{value:"Parameters",id:"parameters-2",level:4},{value:"Inputs",id:"inputs-2",level:5},{value:"Release Candidate Build (<code>release_candidate_build</code>)",id:"release-candidate-build-release_candidate_build",level:3},{value:"Description",id:"description-4",level:4},{value:"Triggers",id:"triggers-2",level:4},{value:"Release Build (<code>release_build</code>)",id:"release-build-release_build",level:3},{value:"Description",id:"description-5",level:4},{value:"Triggers",id:"triggers-3",level:4},{value:"Go Live (<code>go_live</code>)",id:"go-live-go_live",level:3},{value:"Description",id:"description-6",level:4},{value:"Triggers",id:"triggers-4",level:4},{value:"Release Workflows",id:"release-workflows",level:2},{value:"New Release Branch (<code>new_release_branch</code>)",id:"new-release-branch-new_release_branch",level:3},{value:"Description",id:"description-7",level:4},{value:"Trigger",id:"trigger-2",level:4},{value:"New Release Issue (<code>release_branch_issue</code>)",id:"new-release-issue-release_branch_issue",level:3},{value:"Description",id:"description-8",level:4},{value:"Trigger",id:"trigger-3",level:4},{value:"Steps/Source",id:"stepssource",level:4},{value:"Approve Slash Command (<code>approve_command</code>)",id:"approve-slash-command-approve_command",level:3},{value:"Description",id:"description-9",level:4},{value:"Trigger",id:"trigger-4",level:4},{value:"Steps/Source",id:"stepssource-1",level:4},{value:"Merge to main and Create PR to develop (<code>release_pull_request</code>)",id:"merge-to-main-and-create-pr-to-develop-release_pull_request",level:3},{value:"Description",id:"description-10",level:4},{value:"Trigger",id:"trigger-5",level:4},{value:"Parameters",id:"parameters-3",level:4},{value:"Inputs",id:"inputs-3",level:5},{value:"Secrets",id:"secrets",level:5},{value:"Outputs",id:"outputs",level:5},{value:"Steps/Source",id:"stepssource-2",level:4}];function h(e){const s={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",h5:"h5",header:"header",hr:"hr",li:"li",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,t.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(s.header,{children:(0,n.jsx)(s.h1,{id:"build-and-release-workflows",children:"Build and Release Workflows"})}),"\n",(0,n.jsxs)(s.p,{children:["This section contains all of the workflows that are related to our packaging our apps and automating our ",(0,n.jsx)(s.a,{href:"/docs/Operations/Releases/release-process",children:"Release Process"}),". Use the sidebar to the right to jump directly to workflows."]}),"\n",(0,n.jsxs)(s.p,{children:["Each workflows has descriptions, triggers, and input/output parameters if applicable. See the ",(0,n.jsx)(s.a,{href:"https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows",children:"GitHub Actions Documentation"})," for more details about ",(0,n.jsx)(s.a,{href:"https://docs.github.com/en/actions/using-workflows/triggering-a-workflow",children:"triggers"})," and ",(0,n.jsx)(s.a,{href:"https://docs.github.com/en/actions/using-workflows/triggering-a-workflow#defining-inputs-outputs-and-secrets-for-reusable-workflows",children:"input/output parameters"}),"."]}),"\n",(0,n.jsx)(s.h2,{id:"build-automation-capabilities",children:"Build Automation Capabilities"}),"\n",(0,n.jsx)(s.p,{children:"The build system currently allows us to build in multiple ways and for multiple configurations."}),"\n",(0,n.jsxs)(s.ul,{children:["\n",(0,n.jsx)(s.li,{children:"Staging API or Production API"}),"\n",(0,n.jsx)(s.li,{children:"Special Release Candidate configuration"}),"\n",(0,n.jsx)(s.li,{children:"Options to upload to a specific lane or Test Flight group"}),"\n",(0,n.jsx)(s.li,{children:"Configurations to create one-off builds for feature branch testing prior to merging"}),"\n",(0,n.jsx)(s.li,{children:"Queueing capabilities to avoid build collisions on build numbers"}),"\n",(0,n.jsx)(s.li,{children:"Dependency installation and caching to speed up delivery"}),"\n",(0,n.jsx)(s.li,{children:"Slack integration to send useful messages to our DSVA Slack channels to raise errors and to indicate success"}),"\n"]}),"\n",(0,n.jsx)(s.h2,{id:"build-workflows",children:"Build Workflows"}),"\n",(0,n.jsxs)(s.ul,{children:["\n",(0,n.jsx)(s.li,{children:(0,n.jsx)(s.a,{href:"#daily-qa-build-qa_build",children:"Daily QA builds"})}),"\n",(0,n.jsx)(s.li,{children:(0,n.jsx)(s.a,{href:"#release-candidate-build-release_candidate_build",children:"Release Candidate (RC) builds"})}),"\n",(0,n.jsx)(s.li,{children:(0,n.jsx)(s.a,{href:"#on-demand-build-on_demand_build",children:"On Demand builds"})}),"\n",(0,n.jsx)(s.li,{children:(0,n.jsx)(s.a,{href:"#release-build-release_build",children:"Release builds and submission to App/Play Stores for approval"})}),"\n",(0,n.jsx)(s.li,{children:(0,n.jsx)(s.a,{href:"#go-live-go_live",children:'Scheduled "Go Live" every other Tuesday'})}),"\n"]}),"\n",(0,n.jsx)(s.h2,{id:"reusable-build-workflows",children:"Reusable Build Workflows"}),"\n",(0,n.jsx)(s.p,{children:"All of our build related workflows use one of following two workflows with different parameters passed in, making them the two most important workflows of our build automation."}),"\n",(0,n.jsxs)(s.h3,{id:"reusable-ios-workflow-build_ios",children:["Reusable iOS Workflow (",(0,n.jsx)(s.code,{children:"build_ios"}),")"]}),"\n",(0,n.jsx)(s.p,{children:(0,n.jsx)(s.a,{href:"https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/build_ios.yml",children:"View on GitHub Actions"})}),"\n",(0,n.jsx)(s.h4,{id:"description",children:"Description"}),"\n",(0,n.jsx)(s.p,{children:"Creates an iOS build using the passed parameters and distributes to TestFlight / App Connect. Starts a Slack thread in the channel and updates the thread with the results of each build job."}),"\n",(0,n.jsx)(s.h4,{id:"trigger",children:"Trigger"}),"\n",(0,n.jsx)(s.p,{children:"Can only be triggered by other workflows."}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-yaml",children:"on:\n  workflow_call:\n"})}),"\n",(0,n.jsx)(s.h4,{id:"parameters",children:"Parameters"}),"\n",(0,n.jsx)(s.h5,{id:"inputs",children:"Inputs"}),"\n",(0,n.jsxs)(s.table,{children:[(0,n.jsx)(s.thead,{children:(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.th,{children:"Parameter"}),(0,n.jsx)(s.th,{children:"Description"}),(0,n.jsx)(s.th,{children:"Type"}),(0,n.jsx)(s.th,{children:"Options"}),(0,n.jsx)(s.th,{children:"Default"})]})}),(0,n.jsxs)(s.tbody,{children:[(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.td,{children:"environment"}),(0,n.jsx)(s.td,{children:"Used to determine the environment variables to build the app with"}),(0,n.jsx)(s.td,{children:"string"}),(0,n.jsx)(s.td,{children:"test, staging, production"}),(0,n.jsx)(s.td,{children:"staging"})]}),(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.td,{children:"lane"}),(0,n.jsx)(s.td,{children:"Specifies which fastlane lane to run"}),(0,n.jsx)(s.td,{children:"string"}),(0,n.jsx)(s.td,{children:"qa, rc, review, release, on_demand"}),(0,n.jsx)(s.td,{children:"qa"})]}),(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.td,{children:"notes"}),(0,n.jsxs)(s.td,{children:['Release notes that will show next to the version in TestFlight. Fastlane will default to "New QA version for ',(0,n.jsx)(s.code,{children:"{{DATE_TIME}}"}),'" if nothing is passed']}),(0,n.jsx)(s.td,{children:"string"}),(0,n.jsx)(s.td,{}),(0,n.jsx)(s.td,{})]}),(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.td,{children:"ref"}),(0,n.jsx)(s.td,{children:"Branch or tag that we want to build from. Defaults to the branch/tag that triggered"}),(0,n.jsx)(s.td,{children:"string"}),(0,n.jsx)(s.td,{}),(0,n.jsx)(s.td,{})]}),(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.td,{children:"slack_thread_ts"}),(0,n.jsx)(s.td,{children:"Timestamp of the Slack thread where build related messages should be sent. Gets assigned to the SLACK_THREAD_TS environment variable that Fastlane uses."}),(0,n.jsx)(s.td,{children:"string"}),(0,n.jsx)(s.td,{}),(0,n.jsx)(s.td,{})]}),(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.td,{children:"tf_group"}),(0,n.jsx)(s.td,{children:'TestFlight group to distribute to. Fastlane defaults to "Development Team" if nothing is passed'}),(0,n.jsx)(s.td,{children:"string"}),(0,n.jsx)(s.td,{}),(0,n.jsx)(s.td,{})]}),(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.td,{children:"version"}),(0,n.jsx)(s.td,{children:'Version number to use for production release. Passing "qa" here will auto increment upon the latest version in the app stores'}),(0,n.jsx)(s.td,{children:"string"}),(0,n.jsx)(s.td,{}),(0,n.jsx)(s.td,{children:"qa"})]})]})]}),"\n",(0,n.jsx)(s.hr,{}),"\n",(0,n.jsxs)(s.h3,{id:"reusable-android-workflow-build_android",children:["Reusable Android Workflow (",(0,n.jsx)(s.code,{children:"build_android"}),")"]}),"\n",(0,n.jsx)(s.p,{children:(0,n.jsx)(s.a,{href:"https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/build_android.yml",children:"View on GitHub Actions"})}),"\n",(0,n.jsx)(s.h4,{id:"description-1",children:"Description"}),"\n",(0,n.jsx)(s.p,{children:"Creates an iOS build using the passed parameters and distributes to TestFlight / App Connect. Starts a Slack thread in the channel and updates the thread with the results of each build job."}),"\n",(0,n.jsx)(s.h4,{id:"trigger-1",children:"Trigger"}),"\n",(0,n.jsx)(s.p,{children:"Can only be triggered by other workflows."}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-yaml",children:"on:\n  workflow_call:\n"})}),"\n",(0,n.jsx)(s.h4,{id:"parameters-1",children:"Parameters"}),"\n",(0,n.jsx)(s.h5,{id:"inputs-1",children:"Inputs"}),"\n",(0,n.jsxs)(s.table,{children:[(0,n.jsx)(s.thead,{children:(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.th,{children:"Parameter"}),(0,n.jsx)(s.th,{children:"Description"}),(0,n.jsx)(s.th,{children:"Type"}),(0,n.jsx)(s.th,{children:"Options"}),(0,n.jsx)(s.th,{children:"Default"})]})}),(0,n.jsxs)(s.tbody,{children:[(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.td,{children:"environment"}),(0,n.jsx)(s.td,{children:"Used to determine the environment variables to build the app with"}),(0,n.jsx)(s.td,{children:"string"}),(0,n.jsx)(s.td,{children:"test, staging, production"}),(0,n.jsx)(s.td,{children:"staging"})]}),(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.td,{children:"lane"}),(0,n.jsx)(s.td,{children:"Specifies which fastlane lane to run"}),(0,n.jsx)(s.td,{children:"string"}),(0,n.jsx)(s.td,{children:"qa, rc, review, release, on_demand"}),(0,n.jsx)(s.td,{children:"qa"})]}),(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.td,{children:"notes"}),(0,n.jsxs)(s.td,{children:['Release notes that will show next to the version in TestFlight. Fastlane will default to "New QA version for ',(0,n.jsx)(s.code,{children:"{{DATE_TIME}}"}),'" if nothing is passed']}),(0,n.jsx)(s.td,{children:"string"}),(0,n.jsx)(s.td,{}),(0,n.jsx)(s.td,{})]}),(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.td,{children:"ref"}),(0,n.jsx)(s.td,{children:"Branch or tag that we want to build from. Defaults to the branch/tag that triggered"}),(0,n.jsx)(s.td,{children:"string"}),(0,n.jsx)(s.td,{}),(0,n.jsx)(s.td,{})]}),(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.td,{children:"slack_thread_ts"}),(0,n.jsx)(s.td,{children:"Timestamp of the Slack thread where build related messages should be sent. Gets assigned to the SLACK_THREAD_TS environment variable that Fastlane uses."}),(0,n.jsx)(s.td,{children:"string"}),(0,n.jsx)(s.td,{}),(0,n.jsx)(s.td,{})]}),(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.td,{children:"ps_track"}),(0,n.jsx)(s.td,{children:'Google Play Console track to distribute to. Fastlane defaults to "Development Team" if nothing is passed'}),(0,n.jsx)(s.td,{children:"string"}),(0,n.jsx)(s.td,{}),(0,n.jsx)(s.td,{})]}),(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.td,{children:"version"}),(0,n.jsx)(s.td,{children:'Version number to use for production release. Passing "qa" here will auto increment upon the latest version in the app stores'}),(0,n.jsx)(s.td,{children:"string"}),(0,n.jsx)(s.td,{}),(0,n.jsx)(s.td,{children:"qa"})]})]})]}),"\n",(0,n.jsx)(s.hr,{}),"\n",(0,n.jsx)(s.h2,{id:"build-workflows-1",children:"Build Workflows"}),"\n",(0,n.jsx)(s.p,{children:"These workflows utilize the reusable workflows above with specified parameters. Some are triggered by a tag or on a schedule."}),"\n",(0,n.jsxs)(s.h3,{id:"daily-qa-build-qa_build",children:["Daily QA Build (",(0,n.jsx)(s.code,{children:"qa_build"}),")"]}),"\n",(0,n.jsx)(s.p,{children:(0,n.jsx)(s.a,{href:"https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/qa_build.yml",children:"View on GitHub Actions"})}),"\n",(0,n.jsx)(s.h4,{id:"description-2",children:"Description"}),"\n",(0,n.jsxs)(s.p,{children:["This workflow runs every night to create and upload the QA version of the app configured for the staging environment for both Android and iOS. It uses the ",(0,n.jsx)(s.a,{href:"#build_ios",children:(0,n.jsx)(s.code,{children:"build_ios"})})," and ",(0,n.jsx)(s.a,{href:"#build_android",children:(0,n.jsx)(s.code,{children:"build_android"})})," workflows with their default parameters."]}),"\n",(0,n.jsx)(s.p,{children:"Creates a Slack thread in the channel and updates the thread with the results of each build job."}),"\n",(0,n.jsx)(s.h4,{id:"triggers",children:"Triggers"}),"\n",(0,n.jsx)(s.p,{children:"Runs every Weekday at 0400 UTC from the develop branch"}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-yaml",children:"on:\n  schedule:\n    - cron: '0 4 * * 1,2,3,4,5'\n"})}),"\n",(0,n.jsx)(s.hr,{}),"\n",(0,n.jsxs)(s.h3,{id:"on-demand-build-on_demand_build",children:["On Demand Build (",(0,n.jsx)(s.code,{children:"on_demand_build"}),")"]}),"\n",(0,n.jsx)(s.p,{children:(0,n.jsx)(s.a,{href:"https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/on_demand_build.yml",children:"View on GitHub Actions"})}),"\n",(0,n.jsx)(s.h4,{id:"description-3",children:"Description"}),"\n",(0,n.jsx)(s.p,{children:"Builds versions for both Android and iOS using the specified environment and branch and iOS and makes them available via TestFlight and Firebase App Distribution."}),"\n",(0,n.jsx)(s.p,{children:"Creates a Slack thread in the channel and updates the thread with the results of each build job."}),"\n",(0,n.jsx)(s.h4,{id:"triggers-1",children:"Triggers"}),"\n",(0,n.jsxs)(s.p,{children:["Manually via the ",(0,n.jsx)(s.a,{href:"https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/on_demand_build.yml",children:"GitHub Actions UI"})]}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-yaml",children:"on:\n  workflow_dispatch:\n"})}),"\n",(0,n.jsx)(s.h4,{id:"parameters-2",children:"Parameters"}),"\n",(0,n.jsx)(s.h5,{id:"inputs-2",children:"Inputs"}),"\n",(0,n.jsxs)(s.table,{children:[(0,n.jsx)(s.thead,{children:(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.th,{children:"Parameter"}),(0,n.jsx)(s.th,{children:"Description"}),(0,n.jsx)(s.th,{children:"Type"}),(0,n.jsx)(s.th,{children:"Options"}),(0,n.jsx)(s.th,{children:"Default"}),(0,n.jsx)(s.th,{children:"Required"})]})}),(0,n.jsxs)(s.tbody,{children:[(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.td,{children:"environment"}),(0,n.jsx)(s.td,{children:"Used to determine the environment variables to build the app with"}),(0,n.jsx)(s.td,{children:"string"}),(0,n.jsx)(s.td,{children:"test, staging, production"}),(0,n.jsx)(s.td,{children:"staging"}),(0,n.jsx)(s.td,{children:"Yes"})]}),(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.td,{children:"notes"}),(0,n.jsx)(s.td,{children:"The text you want to appear in the TestFlight and Firebase App Tester description"}),(0,n.jsx)(s.td,{children:"string"}),(0,n.jsx)(s.td,{}),(0,n.jsx)(s.td,{}),(0,n.jsx)(s.td,{children:"Yes"})]})]})]}),"\n",(0,n.jsx)(s.hr,{}),"\n",(0,n.jsxs)(s.h3,{id:"release-candidate-build-release_candidate_build",children:["Release Candidate Build (",(0,n.jsx)(s.code,{children:"release_candidate_build"}),")"]}),"\n",(0,n.jsx)(s.p,{children:(0,n.jsx)(s.a,{href:"https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/release_candidate_build.yml",children:"View on GitHub Actions"})}),"\n",(0,n.jsx)(s.h4,{id:"description-4",children:"Description"}),"\n",(0,n.jsxs)(s.p,{children:["This workflow runs every time a tag with RC-v",(0,n.jsx)(s.code,{children:"int.int.int"})," pattern is pushed to the origin. It builds release candidates pointed at staging for our QA team to test using the ",(0,n.jsx)(s.a,{href:"#build_ios",children:(0,n.jsx)(s.code,{children:"build_ios"})})," and ",(0,n.jsx)(s.a,{href:"#build_android",children:(0,n.jsx)(s.code,{children:"build_android"})})," workflows. Those jobs use the branch/tag that triggered the workflow, in this case RC-v",(0,n.jsx)(s.code,{children:"int.int.int"}),"."]}),"\n",(0,n.jsx)(s.p,{children:"Creates a Slack thread in the channel and updates the thread with the results of each build job."}),"\n",(0,n.jsx)(s.h4,{id:"triggers-2",children:"Triggers"}),"\n",(0,n.jsxs)(s.p,{children:["Tags matching the regular expression ",(0,n.jsx)(s.code,{children:"/^RC-v.d+.d+.d+$/"}),". Our ",(0,n.jsx)(s.a,{href:"/docs/Engineering/DevOps/AutomationCodeDocs/Scripts#release_branchsh",children:(0,n.jsx)(s.code,{children:"release_branch.sh"})})," script creates this tag at the end of every sprint."]}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-yaml",children:"on:\n  push:\n    tags:\n      - 'v[0-9]+.[0-9]+.[0-9]+'\n"})}),"\n",(0,n.jsx)(s.hr,{}),"\n",(0,n.jsxs)(s.h3,{id:"release-build-release_build",children:["Release Build (",(0,n.jsx)(s.code,{children:"release_build"}),")"]}),"\n",(0,n.jsx)(s.p,{children:(0,n.jsx)(s.a,{href:"https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/release_build.yml",children:"View on GitHub Actions"})}),"\n",(0,n.jsx)(s.h4,{id:"description-5",children:"Description"}),"\n",(0,n.jsxs)(s.p,{children:["This workflow runs every time a tag with v",(0,n.jsx)(s.code,{children:"int.int.int"})," pattern is pushed to the origin. It builds production versions for both Android and iOS and submits them to the app stores for review."]}),"\n",(0,n.jsx)(s.p,{children:"Creates a Slack thread in the channel and updates the thread with the results of each build job."}),"\n",(0,n.jsx)(s.h4,{id:"triggers-3",children:"Triggers"}),"\n",(0,n.jsxs)(s.p,{children:["Tags matching the regular expression ",(0,n.jsx)(s.code,{children:"/^vd+.d+.d+/"}),". Our ",(0,n.jsx)(s.a,{href:"/docs/Engineering/DevOps/AutomationCodeDocs/Scripts#release_branchsh",children:(0,n.jsx)(s.code,{children:"release_branch.sh"})})," script creates this tag at the end of every sprint."]}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-yaml",children:"on:\n  push:\n    tags:\n      - 'v[0-9]+.[0-9]+.[0-9]+'\n"})}),"\n",(0,n.jsx)(s.hr,{}),"\n",(0,n.jsxs)(s.h3,{id:"go-live-go_live",children:["Go Live (",(0,n.jsx)(s.code,{children:"go_live"}),")"]}),"\n",(0,n.jsx)(s.p,{children:(0,n.jsx)(s.a,{href:"https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/go_live.yml",children:"View on GitHub Actions"})}),"\n",(0,n.jsx)(s.h4,{id:"description-6",children:"Description"}),"\n",(0,n.jsx)(s.p,{children:"Job runs on release day to send approved versions to the stores"}),"\n",(0,n.jsx)(s.h4,{id:"triggers-4",children:"Triggers"}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-yaml",children:"cron: '0 14 * * 2'\n"})}),"\n",(0,n.jsx)(s.p,{children:"Runs every Tuesday at 1400 UTC on only the main branch"}),"\n",(0,n.jsx)(s.h2,{id:"release-workflows",children:"Release Workflows"}),"\n",(0,n.jsxs)(s.p,{children:["These workflows are related to are release process which occurs every 2 weeks. Check the ",(0,n.jsx)(s.a,{href:"/docs/Operations/Releases/release-process",children:"Release Process"})," for a high-level overview."]}),"\n",(0,n.jsxs)(s.h3,{id:"new-release-branch-new_release_branch",children:["New Release Branch (",(0,n.jsx)(s.code,{children:"new_release_branch"}),")"]}),"\n",(0,n.jsx)(s.p,{children:(0,n.jsx)(s.a,{href:"https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/new_release_branch.yml",children:"View on GitHub Actions"})}),"\n",(0,n.jsx)(s.h4,{id:"description-7",children:"Description"}),"\n",(0,n.jsxs)(s.p,{children:["Runs our ",(0,n.jsx)(s.a,{href:"/docs/Engineering/DevOps/AutomationCodeDocs/Scripts#release_branchsh",children:(0,n.jsx)(s.code,{children:"release_branch.sh"})})," script, which checks to see if we are at the beginning of a new sprint, and if so, cuts a new release/v",(0,n.jsx)(s.code,{children:"int.int.int"})," branch from the ",(0,n.jsx)(s.code,{children:"develop"})," branch and tags it with RC-v",(0,n.jsx)(s.code,{children:"int.int.int"}),". The command in the script also ends up triggering the ",(0,n.jsx)(s.a,{href:"#release_branch_issue",children:(0,n.jsx)(s.code,{children:"release_branch_issue"})})," and ",(0,n.jsx)(s.a,{href:"#release_candidate_build",children:(0,n.jsx)(s.code,{children:"release_candidate_build"})})," workflows by tagging the branch with RC-v",(0,n.jsx)(s.code,{children:"int.int.int"})," and c."]}),"\n",(0,n.jsx)(s.h4,{id:"trigger-2",children:"Trigger"}),"\n",(0,n.jsx)(s.p,{children:"Every Wednesday at 06:00 UTC, 2:00AM ET, 11:00PM (Tues) PT or manually via GitHub Actions UI."}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-yaml",children:"on:\n  workflow_dispatch:\n  schedule:\n    - cron: '00 6 * * 3'\n"})}),"\n",(0,n.jsx)(s.hr,{}),"\n",(0,n.jsxs)(s.h3,{id:"new-release-issue-release_branch_issue",children:["New Release Issue (",(0,n.jsx)(s.code,{children:"release_branch_issue"}),")"]}),"\n",(0,n.jsx)(s.p,{children:(0,n.jsx)(s.a,{href:"https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/new_release_branch.yml",children:"View on GitHub Actions"})}),"\n",(0,n.jsx)(s.h4,{id:"description-8",children:"Description"}),"\n",(0,n.jsx)(s.p,{children:"This automated workflow creates the release ticket for every release."}),"\n",(0,n.jsxs)(s.p,{children:["This ticket runs any time a release branch is created that matches our strategy of ",(0,n.jsx)(s.code,{children:"release/^v[0-9]+\\.[0-9]+\\.[0-9]+$"})," and does the following:"]}),"\n",(0,n.jsxs)(s.ul,{children:["\n",(0,n.jsx)(s.li,{children:"Scrapes the version from the GitHub reference"}),"\n",(0,n.jsx)(s.li,{children:"Calculates the QA, Product, and VA Due Dates for the ticket"}),"\n",(0,n.jsx)(s.li,{children:"Calculates the Release Date for the specified version"}),"\n",(0,n.jsx)(s.li,{children:"Creates a table of all the Sev-1 and Sev-2 bugs that are open in the repository"}),"\n",(0,n.jsxs)(s.li,{children:["Creates an issue from the ",(0,n.jsx)(s.code,{children:"release_ticket"})," GitHub Issue Template"]}),"\n",(0,n.jsx)(s.li,{children:"Creates a TestRail Run and Milestone for QA regression testing and tracking"}),"\n",(0,n.jsx)(s.li,{children:"Adds the TestRail run graph to the ticket after the run has been created"}),"\n"]}),"\n",(0,n.jsx)(s.h4,{id:"trigger-3",children:"Trigger"}),"\n",(0,n.jsxs)(s.p,{children:["Runs on every branch create and creates a new ticket only if the branch name matches ",(0,n.jsx)(s.code,{children:"release/^v[0-9]+\\.[0-9]+\\.[0-9]+$"})]}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-yaml",children:"on:\n  create:\n"})}),"\n",(0,n.jsx)(s.h4,{id:"stepssource",children:"Steps/Source"}),"\n",(0,n.jsx)(s.p,{children:(0,n.jsx)(s.a,{href:"https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/.github/workflows/release_branch_issue.yml",children:"See in repository"})}),"\n",(0,n.jsx)(s.hr,{}),"\n",(0,n.jsxs)(s.h3,{id:"approve-slash-command-approve_command",children:["Approve Slash Command (",(0,n.jsx)(s.code,{children:"approve_command"}),")"]}),"\n",(0,n.jsx)(s.p,{children:(0,n.jsx)(s.a,{href:"https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/approve_command.yml",children:"View on GitHub Actions"})}),"\n",(0,n.jsx)(s.h4,{id:"description-9",children:"Description"}),"\n",(0,n.jsxs)(s.p,{children:["Workflow for the ",(0,n.jsx)(s.code,{children:"/approve"})," command in GitHub Issues. Workflow is made available in Issues by the ",(0,n.jsx)(s.a,{href:"#slash_commands",children:(0,n.jsx)(s.code,{children:"slash_commands"})})," workflow."]}),"\n",(0,n.jsxs)(s.p,{children:["The current version of the workflow looks for a comment in issues that starts with ",(0,n.jsx)(s.code,{children:"/approve"}),". The command should be immediately followed by a version string that matches the version regex ",(0,n.jsx)(s.code,{children:"/^vd+.d+.d+$/"})]}),"\n",(0,n.jsx)(s.p,{children:"The current logic on this trigger is pretty brittle and if the admin doesn't do it correctly it can have some incorrect effects that need to get fixed with a new comment that is formatted correctly. There is likely some work to make this better, but there is some time needed to sort out the logic and have the command send the correct message back to the issue and to tag whoever initiated the command."}),"\n",(0,n.jsxs)(s.p,{children:["This command calls the ",(0,n.jsx)(s.code,{children:"release_pull_request"})," workflow during execution."]}),"\n",(0,n.jsx)(s.h4,{id:"trigger-4",children:"Trigger"}),"\n",(0,n.jsxs)(s.p,{children:["Workflow is triggered when a user types ",(0,n.jsx)(s.code,{children:"/approve"})," into a GitHub Issue and clicks the comment button. See ",(0,n.jsx)(s.a,{href:"#slash_commands",children:(0,n.jsx)(s.code,{children:"slash_commands"})})," for more info."]}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-yaml",children:"on:\n  repository_dispatch:\n    types: [approve-command]\n"})}),"\n",(0,n.jsx)(s.h4,{id:"stepssource-1",children:"Steps/Source"}),"\n",(0,n.jsx)(s.p,{children:(0,n.jsx)(s.a,{href:"https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/.github/workflows/approve_command.yml",children:"See in repository"})}),"\n",(0,n.jsx)(s.hr,{}),"\n",(0,n.jsxs)(s.h3,{id:"merge-to-main-and-create-pr-to-develop-release_pull_request",children:["Merge to main and Create PR to develop (",(0,n.jsx)(s.code,{children:"release_pull_request"}),")"]}),"\n",(0,n.jsx)(s.p,{children:(0,n.jsx)(s.a,{href:"https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/release_pull_request.yml",children:"View on GitHub Actions"})}),"\n",(0,n.jsx)(s.h4,{id:"description-10",children:"Description"}),"\n",(0,n.jsxs)(s.p,{children:["This Workflow runs when called by another workflow and merges the release branch changes to ",(0,n.jsx)(s.code,{children:"main"})," and then creates a PR for any branch updates to be pulled back into ",(0,n.jsx)(s.code,{children:"develop"})]}),"\n",(0,n.jsx)(s.h4,{id:"trigger-5",children:"Trigger"}),"\n",(0,n.jsx)(s.p,{children:"Runs when called by another Workflow"}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-yaml",children:"on:\n  workflow_call:\n"})}),"\n",(0,n.jsx)(s.h4,{id:"parameters-3",children:"Parameters"}),"\n",(0,n.jsx)(s.h5,{id:"inputs-3",children:"Inputs"}),"\n",(0,n.jsxs)(s.table,{children:[(0,n.jsx)(s.thead,{children:(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.th,{children:"Name"}),(0,n.jsx)(s.th,{children:"Description"}),(0,n.jsx)(s.th,{children:"type"}),(0,n.jsx)(s.th,{children:"required?"})]})}),(0,n.jsx)(s.tbody,{children:(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.td,{children:"version"}),(0,n.jsx)(s.td,{children:"Version Number (eg. v1.1.0)"}),(0,n.jsx)(s.td,{children:"string"}),(0,n.jsx)(s.td,{children:"yes"})]})})]}),"\n",(0,n.jsx)(s.h5,{id:"secrets",children:"Secrets"}),"\n",(0,n.jsxs)(s.table,{children:[(0,n.jsx)(s.thead,{children:(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.th,{children:"Name"}),(0,n.jsx)(s.th,{children:"Description"}),(0,n.jsx)(s.th,{children:"type"}),(0,n.jsx)(s.th,{children:"required?"})]})}),(0,n.jsx)(s.tbody,{children:(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.td,{children:"GH_ACTIONS_PAT"}),(0,n.jsx)(s.td,{children:"PAT token from composite parent workflow. Should be PAT from our automation robot"}),(0,n.jsx)(s.td,{children:"string"}),(0,n.jsx)(s.td,{children:"yes"})]})})]}),"\n",(0,n.jsx)(s.h5,{id:"outputs",children:"Outputs"}),"\n",(0,n.jsxs)(s.table,{children:[(0,n.jsx)(s.thead,{children:(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.th,{children:"Name"}),(0,n.jsx)(s.th,{children:"Description"}),(0,n.jsx)(s.th,{children:"type"})]})}),(0,n.jsxs)(s.tbody,{children:[(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.td,{children:"devPrUrl"}),(0,n.jsxs)(s.td,{children:["URL string that points to the new PR to ",(0,n.jsx)(s.code,{children:"develop"})," for any release branch specific changes"]}),(0,n.jsx)(s.td,{children:"string"})]}),(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.td,{children:"releaseHash"}),(0,n.jsxs)(s.td,{children:["String value of the commit hash on ",(0,n.jsx)(s.code,{children:"main"})," that can point to the release changes as a single commit in GitHub"]}),(0,n.jsx)(s.td,{children:"string"})]})]})]}),"\n",(0,n.jsx)(s.h4,{id:"stepssource-2",children:"Steps/Source"}),"\n",(0,n.jsx)(s.p,{children:(0,n.jsx)(s.a,{href:"https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/.github/workflows/release_pull_request.yml",children:"See in repository"})}),"\n",(0,n.jsx)(s.hr,{})]})}function c(e={}){const{wrapper:s}={...(0,t.R)(),...e.components};return s?(0,n.jsx)(s,{...e,children:(0,n.jsx)(h,{...e})}):h(e)}}}]);