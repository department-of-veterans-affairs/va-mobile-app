"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[7499],{85357:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>o,contentTitle:()=>i,default:()=>h,frontMatter:()=>n,metadata:()=>s,toc:()=>c});var r=a(58168),l=(a(96540),a(15680));a(41873);const n={title:"Parallel Calls"},i=void 0,s={unversionedId:"Engineering/BackEnd/Architecture/ParallelCalls",id:"Engineering/BackEnd/Architecture/ParallelCalls",title:"Parallel Calls",description:"The mobile API often needs to make requests to external services to fetch data to return to the client. In some cases, a single request from the client can require data from multiple external services. This can cause those requests to be slow and creates a bad user experience.",source:"@site/docs/Engineering/BackEnd/Architecture/ParallelCalls.md",sourceDirName:"Engineering/BackEnd/Architecture",slug:"/Engineering/BackEnd/Architecture/ParallelCalls",permalink:"/va-mobile-app/docs/Engineering/BackEnd/Architecture/ParallelCalls",draft:!1,tags:[],version:"current",frontMatter:{title:"Parallel Calls"},sidebar:"tutorialSidebar",previous:{title:"JSON API",permalink:"/va-mobile-app/docs/Engineering/BackEnd/Architecture/JSONAPI"},next:{title:"Record Filtering",permalink:"/va-mobile-app/docs/Engineering/BackEnd/Architecture/RecordFiltering"}},o={},c=[],u={toc:c},d="wrapper";function h(e){let{components:t,...a}=e;return(0,l.yg)(d,(0,r.A)({},u,a,{components:t,mdxType:"MDXLayout"}),(0,l.yg)("p",null,"The mobile API often needs to make requests to external services to fetch data to return to the client. In some cases, a single request from the client can require data from multiple external services. This can cause those requests to be slow and creates a bad user experience."),(0,l.yg)("p",null,"To mitigate the issue, we use the ",(0,l.yg)("a",{parentName:"p",href:"https://github.com/grosser/parallel"},"Parallel Gem"),", which provides a simple interface for executing functions in parallel using threads. A simple use pattern is:"),(0,l.yg)("ul",null,(0,l.yg)("li",{parentName:"ul"},"Find the common location where code branches off into the multiple network calls."),(0,l.yg)("li",{parentName:"ul"},"Wrap the methods that initiate those branches in lambdas."),(0,l.yg)("li",{parentName:"ul"},"Pass an array of those lambdas to the gem, telling it how many threads to use and specifying that it should execute the ",(0,l.yg)("inlineCode",{parentName:"li"},"call")," method on each lambda to execute it."),(0,l.yg)("li",{parentName:"ul"},"Capture return values if needed."),(0,l.yg)("li",{parentName:"ul"},"It is possible to rescue errors either within lambdas or around the entire parallelization code block. This allows us the ability to capture errors and either log them or provide helpful information back to the client. If we do not rescue, errors will stop execution and be handled as they normally would.")))}h.isMDXComponent=!0}}]);