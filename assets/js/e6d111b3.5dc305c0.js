"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[9688],{28453:(e,t,s)=>{s.d(t,{R:()=>a,x:()=>r});var i=s(96540);const o={},n=i.createContext(o);function a(e){const t=i.useContext(n);return i.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function r(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:a(e.components),i.createElement(n.Provider,{value:t},e.children)}},49082:(e,t,s)=>{s.r(t),s.d(t,{assets:()=>l,contentTitle:()=>r,default:()=>h,frontMatter:()=>a,metadata:()=>i,toc:()=>d});const i=JSON.parse('{"id":"QA/QualityAssuranceProcess/Resources","title":"Resources","description":"QA-specific","source":"@site/docs/QA/QualityAssuranceProcess/Resources.md","sourceDirName":"QA/QualityAssuranceProcess","slug":"/QA/QualityAssuranceProcess/Resources","permalink":"/va-mobile-app/docs/QA/QualityAssuranceProcess/Resources","draft":false,"unlisted":false,"tags":[],"version":"current","frontMatter":{},"sidebar":"tutorialSidebar","previous":{"title":"Release Testing","permalink":"/va-mobile-app/docs/QA/QualityAssuranceProcess/Release Testing"},"next":{"title":"Testing summary","permalink":"/va-mobile-app/docs/QA/QualityAssuranceProcess/Testing Summary"}}');var o=s(74848),n=s(28453);const a={},r="Resources",l={},d=[{value:"QA-specific",id:"qa-specific",level:2},{value:"TestRail",id:"testrail",level:3},{value:"TestFlight &amp; AppTester",id:"testflight--apptester",level:3},{value:"Charles Proxy",id:"charles-proxy",level:3},{value:"On demand build",id:"on-demand-build",level:3},{value:"Mobile team tools (as they relate to QA)",id:"mobile-team-tools-as-they-relate-to-qa",level:2},{value:"1Password",id:"1password",level:3},{value:"Github",id:"github",level:3},{value:"Zenhub",id:"zenhub",level:3},{value:"How do I",id:"how-do-i",level:2},{value:"Log into the mobile app in a staging environment?",id:"log-into-the-mobile-app-in-a-staging-environment",level:3}];function c(e){const t={a:"a",em:"em",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",ul:"ul",...(0,n.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(t.header,{children:(0,o.jsx)(t.h1,{id:"resources",children:"Resources"})}),"\n",(0,o.jsx)(t.h2,{id:"qa-specific",children:"QA-specific"}),"\n",(0,o.jsx)(t.h3,{id:"testrail",children:"TestRail"}),"\n",(0,o.jsxs)(t.p,{children:["TestRail is the web-based test management system used across the VA platform teams to document testing, including the ",(0,o.jsx)(t.a,{href:"https://dsvavsp.testrail.io/index.php?/runs/overview/29",children:"VA Health & Benefits mobile app"}),". ",(0,o.jsx)(t.a,{href:"https://depo-platform-documentation.scrollhelp.site/getting-started/request-access-to-tools#Requestaccesstotools-Additionalaccessfordevelopers",children:"Requesting access to TestRail"})," is done via DSVA Slack."]}),"\n",(0,o.jsxs)(t.p,{children:["If you're unfamiliar with TestRail overall, ",(0,o.jsx)(t.a,{href:"https://support.testrail.com/hc/en-us/articles/7076810203028-Introduction-to-TestRail",children:"their own guide"})," and ",(0,o.jsx)(t.a,{href:"https://depo-platform-documentation.scrollhelp.site/developer-docs/testrail-guide",children:"the basic how-to's laid out by the Platform team"})," are good starting resources to browse."]}),"\n",(0,o.jsxs)(t.p,{children:["Within the VA Mobile project, our top-level test case folders to be familiar with are (",(0,o.jsx)(t.em,{children:"links are to parent folders, explore the subfolders to see all cases"}),"):"]}),"\n",(0,o.jsxs)(t.ul,{children:["\n",(0,o.jsxs)(t.li,{children:["the ",(0,o.jsx)(t.a,{href:"https://dsvavsp.testrail.io/index.php?/suites/view/92&group_by=cases:section_id&group_order=desc&display_deleted_cases=0&group_id=2160",children:"release candidate regression test cases"}),", which contains cases run during release testing"]}),"\n",(0,o.jsxs)(t.li,{children:["the ",(0,o.jsx)(t.a,{href:"https://dsvavsp.testrail.io/index.php?/suites/view/92&group_by=cases:section_id&group_order=desc&display_deleted_cases=0&group_id=3347",children:"active cases"}),", which collectively describe the full testable behavior of the mobile app"]}),"\n",(0,o.jsxs)(t.li,{children:["the ",(0,o.jsx)(t.a,{href:"https://dsvavsp.testrail.io/index.php?/suites/view/92&group_by=cases:section_id&group_order=desc&display_deleted_cases=0&group_id=8944",children:"standard test cases"}),", which are generic test cases for functionality that spans features (such as error handling, accessibility, or feature flags) and can be pulled into test runs for new features without re-writing cases"]}),"\n",(0,o.jsxs)(t.li,{children:["the ",(0,o.jsx)(t.a,{href:"https://dsvavsp.testrail.io/index.php?/suites/view/92&group_by=cases:section_id&group_order=desc&display_deleted_cases=0&group_id=5648",children:"upcoming feature cases"}),", which contains cases written ahead of time for not-yet-implemented features, and"]}),"\n",(0,o.jsxs)(t.li,{children:["the ",(0,o.jsx)(t.a,{href:"https://dsvavsp.testrail.io/index.php?/suites/view/92&group_by=cases:section_id&group_order=desc&display_deleted_cases=0&group_id=3467",children:"archive"}),", which contains cases for deprecated functionality in the app"]}),"\n"]}),"\n",(0,o.jsx)(t.h3,{id:"testflight--apptester",children:"TestFlight & AppTester"}),"\n",(0,o.jsx)(t.p,{children:"We distribute testing builds through TestFlight for iOS, and Firebase's AppTester for Android. Key builds for manual testing include: release candidate builds for release testing, builds based on the develop branch that are updated daily (for visual QA or backend testing), and on-demand builds of branches not yet merged to develop for ticket testing."}),"\n",(0,o.jsxs)(t.p,{children:["To get access to either TestFlight or App Tester, follow the platform-specific instructions for your testing device on the ",(0,o.jsx)(t.a,{href:"https://department-of-veterans-affairs.github.io/va-mobile-app/docs/QA/Tool%20Setup",children:"Tool Setup page"}),"."]}),"\n",(0,o.jsx)(t.h3,{id:"charles-proxy",children:"Charles Proxy"}),"\n",(0,o.jsxs)(t.p,{children:["We use Charles Proxy as a key tool for things like error state testing, mocking data we don't have access to, and downtime window testing. We've got guides for ",(0,o.jsx)(t.a,{href:"https://docs.google.com/document/d/1nUJCIfGTap6RJK_E6xqiKF0OQ4yH-gmi/edit?usp=sharing&ouid=116379542377954476916&rtpof=true&sd=true",children:"setting up Charles Proxy"}),", and ",(0,o.jsx)(t.a,{href:"https://docs.google.com/document/d/10qeXwn55uGnx9wXj0FmKdLyh-dxwDNWj/edit?usp=sharing&ouid=116379542377954476916&rtpof=true&sd=true",children:"how to mock response data"})," or ",(0,o.jsx)(t.a,{href:"https://docs.google.com/document/d/1_obvBLHnTTNZGb5N1Rezq8duZhy-rZ1g/edit",children:"set exclusions"}),"."]}),"\n",(0,o.jsx)(t.h3,{id:"on-demand-build",children:"On demand build"}),"\n",(0,o.jsxs)(t.p,{children:["We create ",(0,o.jsx)(t.a,{href:"https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/on_demand_build.yml",children:"on-demand builds"})," of the pre-production mobile app using a github workflow for testing new frontend code. You need to have write-access to the mobile app repo to kick off these builds."]}),"\n",(0,o.jsxs)(t.ul,{children:["\n",(0,o.jsxs)(t.li,{children:['Visiting the page linked above, tap on "Run Workflow" near the top righthand corner. Then fill out the workflow prompts:',"\n",(0,o.jsxs)(t.ul,{children:["\n",(0,o.jsx)(t.li,{children:'By default, the develop branch is selected in the "Use workflow from" field. Replace it with the branch you want to test.'}),"\n",(0,o.jsx)(t.li,{children:'By default, the staging environment is selected in the "Environment" field. Very occasionally (such as user testing), you\'d change it to production instead.'}),"\n",(0,o.jsx)(t.li,{children:'Add a label to the "Notes" field that will help you identify your build in a list of all on-demand builds. Typically we\'ll include ticket ID, such as "9687 fix payment name"'}),"\n",(0,o.jsx)(t.li,{children:'Tap "run workflow"'}),"\n"]}),"\n"]}),"\n",(0,o.jsx)(t.li,{children:"Typically it takes ~10-15 minutes for Android to build, and about 5 minutes longer than that for iOS to build."}),"\n",(0,o.jsx)(t.li,{children:"If any build fails, attempt to re-run the failed builds at least once (iOS in particular can be a little flaky)."}),"\n"]}),"\n",(0,o.jsx)(t.h2,{id:"mobile-team-tools-as-they-relate-to-qa",children:"Mobile team tools (as they relate to QA)"}),"\n",(0,o.jsx)(t.h3,{id:"1password",children:"1Password"}),"\n",(0,o.jsx)(t.p,{children:"The VAMobile and VA.gov vaults contain usernames and passwords for staging test users."}),"\n",(0,o.jsx)(t.h3,{id:"github",children:"Github"}),"\n",(0,o.jsxs)(t.p,{children:["Most commonly used: ",(0,o.jsx)(t.a,{href:"https://github.com/department-of-veterans-affairs/va-mobile-app/issues/new?assignees=&labels=bug&template=bug-report.md&title=BUG+-+%5BSEVERITY%5D+-+%5BiOS%2FAndroid%2FAll%5D+-+%5BShort+description%5D",children:"writing a bug ticket with the new bug report template"}),"."]}),"\n",(0,o.jsx)(t.h3,{id:"zenhub",children:"Zenhub"}),"\n",(0,o.jsxs)(t.p,{children:["Most commonly used: ",(0,o.jsx)(t.a,{href:"https://app.zenhub.com/workspaces/va-mobile-60f1a34998bc75000f2a489f/board?repos=292052392",children:"the shared team Zenhub board"})," and ",(0,o.jsx)(t.a,{href:"https://app.zenhub.com/workspaces/va-mobile-60f1a34998bc75000f2a489f/reports/cumulative?r=&p%5B%5D=With%20QA&p%5B%5D=Icebox&p%5B%5D=With%20QA%281.43.0%20until%202%2F14%29&p%5B%5D=Ready%20to%20Merge%20to%20develop&p%5B%5D=Closed&p%5B%5D=With%20QA%20%28pre-develop%29&p%5B%5D=With%20QA%20%28develop%29&p%5B%5D=Blocked&df=06-15-2021&dt=06-15-2023&dr=24m&labels%5B%5D=bug&notLabels%5B%5D=",children:"the cumulative flow report to track ticket (or bug!) trends over several sprints"}),"."]}),"\n",(0,o.jsx)(t.h2,{id:"how-do-i",children:"How do I"}),"\n",(0,o.jsx)(t.h3,{id:"log-into-the-mobile-app-in-a-staging-environment",children:"Log into the mobile app in a staging environment?"}),"\n",(0,o.jsxs)(t.ul,{children:["\n",(0,o.jsxs)(t.li,{children:["First, you need to get ",(0,o.jsx)(t.a,{href:"https://department-of-veterans-affairs.github.io/va-mobile-app/docs/QA/QualityAssuranceProcess/Tool%20Setup",children:"TestFlight (iOS) or AppTester (Android)"})," set up on the device you'll use, which includes coordination with the mobile Engineering lead to get added to the list of approved testers."]}),"\n",(0,o.jsxs)(t.li,{children:["If you're testing backend changes, it's best to use a current version of the daily develop builds. If you're testing frontend changes, you'll need to follow the ",(0,o.jsx)(t.a,{href:"https://department-of-veterans-affairs.github.io/va-mobile-app/docs/QA/QualityAssuranceProcess/Resources#on-demand-build",children:"on-demand build process"}),", above."]}),"\n",(0,o.jsx)(t.li,{children:"Any credentials that work to log into staging.va.gov will also work to log into the mobile app in the staging environment. The mobile team, by and large, does not have the ability to create staging users or specific staging data, so you will need to work with other VA teams to do any prep needed for testing."}),"\n"]})]})}function h(e={}){const{wrapper:t}={...(0,n.R)(),...e.components};return t?(0,o.jsx)(t,{...e,children:(0,o.jsx)(c,{...e})}):c(e)}}}]);