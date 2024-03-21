"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[2957],{35227:(t,e,a)=>{a.r(e),a.d(e,{assets:()=>d,contentTitle:()=>n,default:()=>h,frontMatter:()=>i,metadata:()=>r,toc:()=>l});var s=a(87462),o=(a(67294),a(3905));a(8209);const i={},n="Datadog",r={unversionedId:"Engineering/BackEnd/Monitoring/DataDog",id:"Engineering/BackEnd/Monitoring/DataDog",title:"Datadog",description:"This section will share a short overview of how to use Datadog to analyze, and alert on VA metrics",source:"@site/docs/Engineering/BackEnd/Monitoring/DataDog.md",sourceDirName:"Engineering/BackEnd/Monitoring",slug:"/Engineering/BackEnd/Monitoring/DataDog",permalink:"/va-mobile-app/docs/Engineering/BackEnd/Monitoring/DataDog",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Schema Contract Testing",permalink:"/va-mobile-app/docs/Engineering/BackEnd/Features/SchemaContractTesting"},next:{title:"Logs",permalink:"/va-mobile-app/docs/Engineering/BackEnd/Monitoring/Logs"}},d={},l=[{value:"Integrations",id:"integrations",level:2},{value:"Exploring Metrics",id:"exploring-metrics",level:2},{value:"Creating Graphs",id:"creating-graphs",level:2},{value:"Formulas",id:"formulas",level:2},{value:"Dashboards",id:"dashboards",level:2},{value:"Creating Alerts",id:"creating-alerts",level:2},{value:"Good Places to Get Started",id:"good-places-to-get-started",level:2},{value:"Existing Mobile Dashboards",id:"existing-mobile-dashboards",level:2}],g={toc:l},c="wrapper";function h(t){let{components:e,...i}=t;return(0,o.kt)(c,(0,s.Z)({},g,i,{components:e,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"datadog"},"Datadog"),(0,o.kt)("p",null,"This section will share a short overview of how to use Datadog to analyze, and alert on VA metrics"),(0,o.kt)("h2",{id:"integrations"},"Integrations"),(0,o.kt)("p",null,"One of the major Pros of Datadog is a plethora of already created integration steps. ",(0,o.kt)("a",{parentName:"p",href:"https://docs.datadoghq.com/getting_started/integrations/"},"Datadog integration documentation")),(0,o.kt)("p",null,(0,o.kt)("img",{src:a(60518).Z,width:"1999",height:"319"})),(0,o.kt)("h2",{id:"exploring-metrics"},"Exploring Metrics"),(0,o.kt)("p",null,"You can search for existing metrics using Datadog's explore page. Within Datadog navigate to Metrics -> Explore from the sidebar. Selecting a metric from here will automatically create a graph that can be modified and exported to new or existing dashboards. ",(0,o.kt)("a",{parentName:"p",href:"https://docs.datadoghq.com/metrics/explorer/"},"Explore documentation")),(0,o.kt)("p",null,(0,o.kt)("img",{src:a(78376).Z,width:"1999",height:"1399"})),(0,o.kt)("h2",{id:"creating-graphs"},"Creating Graphs"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"Navigate to Dashboards -> Quick Graphs or edit a graph from an existing dashboard"),(0,o.kt)("li",{parentName:"ol"},"Choose the metric to graph by searching or selecting it from the dropdown next to 'Metric'")),(0,o.kt)("p",null,(0,o.kt)("img",{src:a(47338).Z,width:"1828",height:"666"})),(0,o.kt)("ol",{start:3},(0,o.kt)("li",{parentName:"ol"},"Select filters for the metric")),(0,o.kt)("p",null,(0,o.kt)("img",{src:a(37710).Z,width:"1056",height:"680"})),(0,o.kt)("ol",{start:4},(0,o.kt)("li",{parentName:"ol"},"Decide how to aggregate the metric (Max, Min, Avg, Sum)")),(0,o.kt)("p",null,(0,o.kt)("img",{src:a(130).Z,width:"1106",height:"136"})),(0,o.kt)("ol",{start:5},(0,o.kt)("li",{parentName:"ol"},"Apply functions to the metric. ",(0,o.kt)("a",{parentName:"li",href:"https://docs.datadoghq.com/dashboards/functions/"},"Functions documentation"))),(0,o.kt)("p",null,(0,o.kt)("img",{src:a(67482).Z,width:"1426",height:"768"})),(0,o.kt)("p",null,"Example: Total requests per second to any mobile endpoint averaged over 5 minutes"),(0,o.kt)("p",null,(0,o.kt)("img",{src:a(89501).Z,width:"1999",height:"57"}),"\n",(0,o.kt)("img",{src:a(31331).Z,width:"1999",height:"360"})),(0,o.kt)("h2",{id:"formulas"},"Formulas"),(0,o.kt)("p",null,"You can compare multiple metrics by using formulas.\nExample: Request error rate averaged over 5 minutes"),(0,o.kt)("p",null,(0,o.kt)("img",{src:a(55105).Z,width:"1999",height:"758"})),(0,o.kt)("h2",{id:"dashboards"},"Dashboards"),(0,o.kt)("p",null,"Dashboards allow you to display many different widgets. Select the 'Add widgets' button then select the desired widget. ",(0,o.kt)("a",{parentName:"p",href:"https://docs.datadoghq.com/dashboards/widgets/"},"Widgets documentation")),(0,o.kt)("p",null,(0,o.kt)("img",{src:a(69218).Z,width:"1072",height:"378"})),(0,o.kt)("p",null,"Additionally you can add variables for use across all widgets within a single dashboard. At the top of a dashboard select the pencil icon then fill in the details of your variable. These variables can be accessed from within a widget using ",(0,o.kt)("inlineCode",{parentName:"p"},"$[variable name]"),". ",(0,o.kt)("a",{parentName:"p",href:"https://docs.datadoghq.com/dashboards/template_variables/"},"Template variables documentation")),(0,o.kt)("p",null,(0,o.kt)("img",{src:a(35691).Z,width:"1574",height:"758"})),(0,o.kt)("h2",{id:"creating-alerts"},"Creating Alerts"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"Define a metric to alert on. This works the same as discussed in the graphs section above")),(0,o.kt)("p",null,(0,o.kt)("img",{src:a(712).Z,width:"1238",height:"432"})),(0,o.kt)("ol",{start:2},(0,o.kt)("li",{parentName:"ol"},"Define alert thresholds. These will dictate when the alert triggers")),(0,o.kt)("p",null,(0,o.kt)("img",{src:a(18782).Z,width:"1564",height:"480"})),(0,o.kt)("ol",{start:3},(0,o.kt)("li",{parentName:"ol"},"Decide how you would like to be notified when the alert triggers")),(0,o.kt)("p",null,(0,o.kt)("img",{src:a(36870).Z,width:"1358",height:"472"})),(0,o.kt)("ol",{start:4},(0,o.kt)("li",{parentName:"ol"},"Define message you want to appear when alert triggers")),(0,o.kt)("p",null,(0,o.kt)("img",{src:a(36208).Z,width:"1342",height:"686"})),(0,o.kt)("p",null,"To receive alert messages in slack the Datadog slack tool will need to be added to the channel where you want notifications then the channel also needs to be added via the slack integration within Datadog. Once this is complete the channel will be in a dropdown in the 'Notify your team' section shown above. ",(0,o.kt)("a",{parentName:"p",href:"https://docs.datadoghq.com/integrations/slack/?tab=slackapplication"},"Slack integration docs")),(0,o.kt)("p",null,(0,o.kt)("img",{src:a(65266).Z,width:"804",height:"364"}),"\n",(0,o.kt)("img",{src:a(69458).Z,width:"1999",height:"1324"})),(0,o.kt)("h2",{id:"good-places-to-get-started"},"Good Places to Get Started"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://www.youtube.com/playlist?list=PLdh-RwQzDsaOoFo0D8xSEHO0XXOKi1-5J"},"Datadog 101 videos")," and ",(0,o.kt)("a",{parentName:"p",href:"https://docs.datadoghq.com/getting_started/"},"Datadog documentation home page")),(0,o.kt)("h2",{id:"existing-mobile-dashboards"},"Existing Mobile Dashboards"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://vagov.ddog-gov.com/apm/services/mobile-app/operations/rack.request/resources?env=eks-prod&panels=qson%3A%28data%3A%28%29%2Cversion%3A%210%29&resources=qson%3A%28data%3A%28visible%3A%21t%2Chits%3A%28selected%3Atotal%29%2Cerrors%3A%28selected%3Atotal%29%2Clatency%3A%28selected%3Ap95%29%2CtopN%3A%215%29%2Cversion%3A%211%29&sort=error-rate%2Cdesc&summary=qson%3A%28data%3A%21f%2Cversion%3A%211%29&view=spans&start=1701356709938&end=1701360309938&paused=false"},"Dashboard")," and ",(0,o.kt)("a",{parentName:"p",href:"https://vagov.ddog-gov.com/monitors/90011?view=spans"},"Alerts"),". If you have issues accessing the dashboard or the VA Datadog site reach out in the shared mobile slack channel"))}h.isMDXComponent=!0},69218:(t,e,a)=>{a.d(e,{Z:()=>s});const s=a.p+"assets/images/datadog-add-widgets-939ca71065c886039612d20952dc398e.png"},36208:(t,e,a)=>{a.d(e,{Z:()=>s});const s=a.p+"assets/images/datadog-alert-message-a77efadfc6cece0002455b9200aa514c.png"},712:(t,e,a)=>{a.d(e,{Z:()=>s});const s=a.p+"assets/images/datadog-alert-metric-c89090d07cc51940afb4c25923b02aa6.png"},36870:(t,e,a)=>{a.d(e,{Z:()=>s});const s=a.p+"assets/images/datadog-alert-notify-cc3322d43eb8a54c574bf5ee7cfb4353.png"},18782:(t,e,a)=>{a.d(e,{Z:()=>s});const s=a.p+"assets/images/datadog-alert-threshold-b9e9c3eb058f6873b818030b2f6cb7a1.png"},60518:(t,e,a)=>{a.d(e,{Z:()=>s});const s=a.p+"assets/images/datadog-aws-integration-eb269c215a7a1d3bbde4b765e2ba545e.png"},47338:(t,e,a)=>{a.d(e,{Z:()=>s});const s=a.p+"assets/images/datadog-create-graphs-1-f9dcf5c108ce7a609b061df23f17e8a5.png"},37710:(t,e,a)=>{a.d(e,{Z:()=>s});const s=a.p+"assets/images/datadog-create-graphs-2-2a204fc03e9759f32d65a8847f7518b4.png"},130:(t,e,a)=>{a.d(e,{Z:()=>s});const s=a.p+"assets/images/datadog-create-graphs-3-e01939a70e711309dd3bb09a43dbb8a7.png"},67482:(t,e,a)=>{a.d(e,{Z:()=>s});const s=a.p+"assets/images/datadog-create-graphs-4-91ae7f0a29d22bb747ad0c06e368cbba.png"},89501:(t,e,a)=>{a.d(e,{Z:()=>s});const s=a.p+"assets/images/datadog-example-graph-query-0da0ced8654a58b7609a5522aff0be27.png"},31331:(t,e,a)=>{a.d(e,{Z:()=>s});const s=a.p+"assets/images/datadog-example-graph-b2149fc192fffc8a052b3f5a0bc88834.png"},55105:(t,e,a)=>{a.d(e,{Z:()=>s});const s=a.p+"assets/images/datadog-formula-graph-fcb6d95c9733cae18d6d424abee41c37.png"},78376:(t,e,a)=>{a.d(e,{Z:()=>s});const s=a.p+"assets/images/datadog-metrics-explorer-abd62072aa731c52840841adac55fb54.png"},35691:(t,e,a)=>{a.d(e,{Z:()=>s});const s=a.p+"assets/images/datadog-mobile-api-dashboard-d17f0b52a9ac62bb85b2dc67bfa71dc1.png"},65266:(t,e,a)=>{a.d(e,{Z:()=>s});const s=a.p+"assets/images/datadog-slack-integration-1-fbc1c9798b0dba05b2ffb493bbd95a7f.png"},69458:(t,e,a)=>{a.d(e,{Z:()=>s});const s=a.p+"assets/images/datadog-slack-integration-2-becf3971fcf37992b370e3cf6d80860b.png"}}]);