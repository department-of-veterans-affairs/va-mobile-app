"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[4700],{10116:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return r},contentTitle:function(){return d},metadata:function(){return m},toc:function(){return c},default:function(){return p}});var i=t(87462),a=t(63366),s=(t(67294),t(3905)),o=["components"],r={},d="Downtime Messages",m={unversionedId:"Engineering/FrontEnd/Downtime Messages/DowntimeMessages",id:"Engineering/FrontEnd/Downtime Messages/DowntimeMessages",title:"Downtime Messages",description:"Overview",source:"@site/docs/Engineering/FrontEnd/Downtime Messages/DowntimeMessages.md",sourceDirName:"Engineering/FrontEnd/Downtime Messages",slug:"/Engineering/FrontEnd/Downtime Messages/DowntimeMessages",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/Downtime Messages/DowntimeMessages",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Accessibility Information",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/Accessibility/AccessibilityInformation"},next:{title:"Fonts and Colors",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/Fonts and Colors/FontsAndColors"}},c=[{value:"Overview",id:"overview",children:[],level:2},{value:"Maintenance Window Technical Description",id:"maintenance-window-technical-description",children:[],level:2},{value:"Downtime Messages Display",id:"downtime-messages-display",children:[],level:2}],l={toc:c};function p(e){var n=e.components,r=(0,a.Z)(e,o);return(0,s.kt)("wrapper",(0,i.Z)({},l,r,{components:n,mdxType:"MDXLayout"}),(0,s.kt)("h1",{id:"downtime-messages"},"Downtime Messages"),(0,s.kt)("h2",{id:"overview"},"Overview"),(0,s.kt)("p",null,(0,s.kt)("strong",{parentName:"p"},"Downtime Messages")," are error pages that shown to users when a known ",(0,s.kt)("inlineCode",{parentName:"p"},"maintenance window")," is actively occuring for a specific feature in the app. Downtime windows are determined by upstream service providers and compiled into a single list by the back-end. The front-end checks for active downtime windows once per session durin the sync stage after login and caches the data for the remainder of the session."),(0,s.kt)("p",null,"Downtime messages use the same display pattern as errors in code, with additional checks in the ",(0,s.kt)("inlineCode",{parentName:"p"},"useError")," utility to check if a downtime error exists for a specific ",(0,s.kt)("inlineCode",{parentName:"p"},"screen ID"),". Multiple features can trigger a downtime message on a single screen, e.g. claims and appeals are two separate features but display on the same page. Whether a downtime message is displayed if a subset of features on the screen are down is a business decision that varies based on feature."),(0,s.kt)("h2",{id:"maintenance-window-technical-description"},"Maintenance Window Technical Description"),(0,s.kt)("p",null,"The data returned from the back-end for a ",(0,s.kt)("inlineCode",{parentName:"p"},"maintenance window")," includes a ",(0,s.kt)("inlineCode",{parentName:"p"},"service name"),", and start time, and an end time. The service name is determined by the back-end and is not directly equivalent to ",(0,s.kt)("inlineCode",{parentName:"p"},"feature names")," used in the front-end, so a mapping from ",(0,s.kt)("inlineCode",{parentName:"p"},"service name")," to ",(0,s.kt)("inlineCode",{parentName:"p"},"feature name")," as well as ",(0,s.kt)("inlineCode",{parentName:"p"},"service name")," to the affected ",(0,s.kt)("inlineCode",{parentName:"p"},"screen ID")," is provided in the ",(0,s.kt)("inlineCode",{parentName:"p"},"store/api/types/Errors.ts")," file. Anytime a new feature with downtime is added, this mapping needs to be updated and the rest of the logic will automatically piggyback off of error logic and the checks in ",(0,s.kt)("inlineCode",{parentName:"p"},"store/slices/errorSlice.ts:checkForDowntimeErrors()")),(0,s.kt)("p",null,"Example return data from ",(0,s.kt)("inlineCode",{parentName:"p"},"/v0/maintenance_windows")," endpoint:"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre"},"data: [\n  {\n    attributes: {\n      service: 'direct_deposit_benefits',\n      startTime: '2021-06-01T12:00:00.000Z',\n      endTime: '2021-06-01T18:00:00.000Z',\n    },\n    id: '1',\n    type: 'maintenance_window',\n  },\n  {\n    attributes: {\n      service: 'military_service_history',\n      startTime: '2021-06-01T12:00:00.000Z',\n      endTime: '2021-06-01T18:00:00.000Z',\n    },\n    id: '2',\n    type: 'maintenance_window',\n  },\n]\n")),(0,s.kt)("h2",{id:"downtime-messages-display"},"Downtime Messages Display"),(0,s.kt)("p",null,"The downtime message displays as a full page error with a warning border. The template and an example are show below"),(0,s.kt)("p",null,(0,s.kt)("img",{alt:"Downtime Messages Template",src:t(9283).Z})),(0,s.kt)("p",null,(0,s.kt)("img",{alt:"Downtime Messages Example",src:t(5435).Z})))}p.isMDXComponent=!0},5435:function(e,n,t){n.Z=t.p+"assets/images/downtime-messages-example-adffc5e7f06372cf6204b43e40ddeb2b.png"},9283:function(e,n,t){n.Z=t.p+"assets/images/downtime-messages-template-01f06574813b9222ee681215d88b368a.png"}}]);