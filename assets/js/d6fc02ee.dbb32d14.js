"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[1663],{79265:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>l,contentTitle:()=>o,default:()=>p,frontMatter:()=>i,metadata:()=>r,toc:()=>u});var s=a(87462),n=(a(67294),a(3905));a(8209);const i={title:"Detox Best Practices",sidebar_position:2},o="Detox Best Practices",r={unversionedId:"QA/QualityAssuranceProcess/Automation/Detox Best Practices",id:"QA/QualityAssuranceProcess/Automation/Detox Best Practices",title:"Detox Best Practices",description:"This is a set of best practices around creating and maintaining the detox tests.",source:"@site/docs/QA/QualityAssuranceProcess/Automation/Detox Best Practices.md",sourceDirName:"QA/QualityAssuranceProcess/Automation",slug:"/QA/QualityAssuranceProcess/Automation/Detox Best Practices",permalink:"/va-mobile-app/docs/QA/QualityAssuranceProcess/Automation/Detox Best Practices",draft:!1,tags:[],version:"current",sidebarPosition:2,frontMatter:{title:"Detox Best Practices",sidebar_position:2},sidebar:"tutorialSidebar",previous:{title:"Adding new e2e tests to Availability Framework and Nav",permalink:"/va-mobile-app/docs/QA/QualityAssuranceProcess/Automation/AddingNewFeatures"},next:{title:"Compatibility and Support",permalink:"/va-mobile-app/docs/QA/QualityAssuranceProcess/Compatibility"}},l={},u=[{value:"Creating/updating detox tests for a new feature",id:"creatingupdating-detox-tests-for-a-new-feature",level:3},{value:"Updating Detox tests for non feature work",id:"updating-detox-tests-for-non-feature-work",level:3},{value:"General Best Practices",id:"general-best-practices",level:3}],c={toc:u},d="wrapper";function p(e){let{components:t,...a}=e;return(0,n.kt)(d,(0,s.Z)({},c,a,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"detox-best-practices"},"Detox Best Practices"),(0,n.kt)("p",null,"This is a set of best practices around creating and maintaining the detox tests."),(0,n.kt)("h3",{id:"creatingupdating-detox-tests-for-a-new-feature"},"Creating/updating detox tests for a new feature"),(0,n.kt)("p",null,"For any new feature work detox work needs to either be:"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"Added to the acceptance criteria and done on a per ticket basis"),(0,n.kt)("li",{parentName:"ul"},"Done in a new ticket at the end of the feature that encompasses all the work completed (If a new ticket needs to be made please follow the Engineering best practices for ticket creation.)")),(0,n.kt)("p",null,"The following must be done for all new feature detox work no matter whether you are updating an existing detox test or creating a new one. "),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"Ensure that the test encompasses any new changes to the manual release candidate (RC) script and test steps where possible",(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},"Anything that happens outside of the app itself can't be automated with Detox.  In the past this has included stuff like opening and selecting an attachment in messages etc."))),(0,n.kt)("li",{parentName:"ul"},"Inform QA what has been automated.  This allows QA to:",(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},"Move the correct manual cases to the automated folder/split a case if needed in testRail"),(0,n.kt)("li",{parentName:"ul"},"Confirm that all test runs for the new automated script can be recorded in TestRail (preferably automatically, but at least manually)"))),(0,n.kt)("li",{parentName:"ul"},"Ensure the new/updating script provides artifacts (where necessary) for success and failure"),(0,n.kt)("li",{parentName:"ul"},"Ensure that the new test has been added to the array/dictionary in the Navigation.e2e and AvailabilityFramework.e2e tests (if needed). How to add new tests can be found ",(0,n.kt)("a",{parentName:"li",href:"/docs/QA/QualityAssuranceProcess/Automation/AddingNewFeatures"},"here")),(0,n.kt)("li",{parentName:"ul"},"Ensure that the test is named for the screen/feature its automating ('Prescriptions', 'HomeScreen', etc.) and that the test has been placed in the e2e folder."),(0,n.kt)("li",{parentName:"ul"},"Ensure that e2e_detox_mapping.yml has been updated to account for any added/deleted files")),(0,n.kt)("h3",{id:"updating-detox-tests-for-non-feature-work"},"Updating Detox tests for non feature work"),(0,n.kt)("p",null,"Detox is currently running on a per PR basis and is running any tests that might be affected with the code change.  The following must be done if any of the detox tests fail:"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"Update any parts of the detox that were affected by the code change and repush the PR.  This will cause the test to rerun. ",(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},"If you want to check to see if the detox test works before pushing the PR you can either run the test locally or run the test in github actions using the workflow_dispatch trigger"))),(0,n.kt)("li",{parentName:"ul"},"Ensure that e2e_detox_mapping.yml has been updated to account for any added/deleted files in the PR")),(0,n.kt)("h3",{id:"general-best-practices"},"General Best Practices"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"Tests usually follow the same initial format where you import the necessary variables, have a dictionary of any constants, and run a beforeAll statement that navigates to the specific feature in the app"),(0,n.kt)("li",{parentName:"ul"},"Any global functions/constants should be placed in utils.ts.  Utils.ts is also where all the navigation to a specific page functions live."),(0,n.kt)("li",{parentName:"ul"},"Set your demo mode password to '' (null) before running the tests"),(0,n.kt)("li",{parentName:"ul"},"Use ",(0,n.kt)("inlineCode",{parentName:"li"},"by.id")," in your tests (and add the associated testID to the code) where possible.  This makes the tests less flaky")))}p.isMDXComponent=!0}}]);