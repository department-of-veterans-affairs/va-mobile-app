"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[6800],{28453:(e,t,i)=>{i.d(t,{R:()=>s,x:()=>r});var n=i(96540);const a={},o=n.createContext(a);function s(e){const t=n.useContext(o);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function r(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:s(e.components),n.createElement(o.Provider,{value:t},e.children)}},86285:(e,t,i)=>{i.r(t),i.d(t,{assets:()=>l,contentTitle:()=>r,default:()=>c,frontMatter:()=>s,metadata:()=>n,toc:()=>d});const n=JSON.parse('{"id":"QA/QualityAssuranceProcess/Automation/AddingNewFeatures","title":"Adding new e2e tests to Availability Framework and Nav","description":"Adding a new e2e test to navigation (Note: The only things tested are places in the app where you have the ability to navigate through the bottom navigation bar)","source":"@site/docs/QA/QualityAssuranceProcess/Automation/AddingNewFeatures.md","sourceDirName":"QA/QualityAssuranceProcess/Automation","slug":"/QA/QualityAssuranceProcess/Automation/AddingNewFeatures","permalink":"/va-mobile-app/docs/QA/QualityAssuranceProcess/Automation/AddingNewFeatures","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":1,"frontMatter":{"title":"Adding new e2e tests to Availability Framework and Nav","sidebar_position":1},"sidebar":"tutorialSidebar","previous":{"title":"UI Automation Testing","permalink":"/va-mobile-app/docs/QA/QualityAssuranceProcess/Automation/"},"next":{"title":"Detox Best Practices","permalink":"/va-mobile-app/docs/QA/QualityAssuranceProcess/Automation/Detox Best Practices"}}');var a=i(74848),o=i(28453);const s={title:"Adding new e2e tests to Availability Framework and Nav",sidebar_position:1},r="Adding new e2e tests to Availability Framework and Navigation",l={},d=[{value:"Adding a new e2e test to navigation (Note: The only things tested are places in the app where you have the ability to navigate through the bottom navigation bar)",id:"adding-a-new-e2e-test-to-navigation-note-the-only-things-tested-are-places-in-the-app-where-you-have-the-ability-to-navigate-through-the-bottom-navigation-bar",level:2},{value:"Adding a new e2e test to Availability Framework",id:"adding-a-new-e2e-test-to-availability-framework",level:2}];function h(e){const t={code:"code",h1:"h1",h2:"h2",header:"header",li:"li",ol:"ol",ul:"ul",...(0,o.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(t.header,{children:(0,a.jsx)(t.h1,{id:"adding-new-e2e-tests-to-availability-framework-and-navigation",children:"Adding new e2e tests to Availability Framework and Navigation"})}),"\n",(0,a.jsx)(t.h2,{id:"adding-a-new-e2e-test-to-navigation-note-the-only-things-tested-are-places-in-the-app-where-you-have-the-ability-to-navigate-through-the-bottom-navigation-bar",children:"Adding a new e2e test to navigation (Note: The only things tested are places in the app where you have the ability to navigate through the bottom navigation bar)"}),"\n",(0,a.jsxs)(t.ol,{children:["\n",(0,a.jsx)(t.li,{children:"Open the Navigation.e2e test"}),"\n",(0,a.jsxs)(t.li,{children:["Add the necessary information to navigationDic. The dictionary is broken down into the 4 sections found in the bottom navigation bar: Home, Health, Benefits, and Payments. Add new tests under the appropriate key value.","\n",(0,a.jsxs)(t.ol,{children:["\n",(0,a.jsxs)(t.li,{children:["The array follows the following format: [a, b, c]","\n",(0,a.jsxs)(t.ol,{children:["\n",(0,a.jsx)(t.li,{children:"For single e2e tests: string of name of the test. Ex: \u2018DisabilityRatings.e2e\u2019. For multiple e2e tests: array of strings with the names of the tests. Ex: [\u2018Claims.e2e\u2019, \u2018Appeals.e2e\u2019]"}),"\n",(0,a.jsxs)(t.li,{children:["String/array of strings that tells detox how to navigate to your feature.","\n",(0,a.jsxs)(t.ul,{children:["\n",(0,a.jsxs)(t.li,{children:["Notes:","\n",(0,a.jsxs)(t.ul,{children:["\n",(0,a.jsx)(t.li,{children:"The test will always navigate to the key value in which the array is in (Home, Health, Benefits, and Payments) first"}),"\n",(0,a.jsx)(t.li,{children:"If scrolling is required for detox to click on something use the featureID dictionary. It follows the following format: 'string of what needs to be clicked on (should match what is in navigationDic): testID for the scrollView being utilized'"}),"\n"]}),"\n"]}),"\n",(0,a.jsx)(t.li,{children:"Ex: DisabilityRatings (Benefits > Disability rating) is \u2018Disability rating\u2019"}),"\n",(0,a.jsx)(t.li,{children:"Ex: Claim details (Benefits > Claims > Claims history > 'name of claim') is an array of strings of the following: ['Claims', 'Claims history', 'Received July 20, 2021']"}),"\n"]}),"\n"]}),"\n",(0,a.jsx)(t.li,{children:"Name of the heading for the page. This is what the tests look for to verify it is in the right location."}),"\n"]}),"\n"]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,a.jsx)(t.h2,{id:"adding-a-new-e2e-test-to-availability-framework",children:"Adding a new e2e test to Availability Framework"}),"\n",(0,a.jsxs)(t.ol,{children:["\n",(0,a.jsx)(t.li,{children:"Open the AvailabilityFramework.e2e test"}),"\n",(0,a.jsxs)(t.li,{children:["Add the new waygate to AFNavigationForIndividual. The array has the following format: [String value indicating the e2e test covered, String value of the waygate name, string of navigation value 1, string of navigation value 2]","\n",(0,a.jsxs)(t.ul,{children:["\n",(0,a.jsxs)(t.li,{children:["String of navigation values ",(0,a.jsx)(t.code,{children:"<number\\>"})," tells detox how to navigate to the feature starting from the Home screen.","\n",(0,a.jsxs)(t.ul,{children:["\n",(0,a.jsxs)(t.li,{children:["Notes:","\n",(0,a.jsxs)(t.ul,{children:["\n",(0,a.jsx)(t.li,{children:"If scrolling is required for detox to click on something add an else if (featureNavigationArray[j] === 'string of navigation value') statement to the navigateToFeature function in utils.ts"}),"\n",(0,a.jsx)(t.li,{children:"If you are running into issues with inAppReview add your waygate to the if statement found in enableAF"}),"\n"]}),"\n"]}),"\n"]}),"\n"]}),"\n"]}),"\n"]}),"\n"]})]})}function c(e={}){const{wrapper:t}={...(0,o.R)(),...e.components};return t?(0,a.jsx)(t,{...e,children:(0,a.jsx)(h,{...e})}):h(e)}}}]);