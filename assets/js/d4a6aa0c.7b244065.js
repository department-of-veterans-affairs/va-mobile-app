"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[7959],{16360:(e,t,n)=>{n.d(t,{A:()=>m});var a=n(96540),o=n(54610),r=n(3384),l=n(31347),s=n(28057),i=n(84476);const u=e=>{let{props:t}=e;return t?a.createElement(a.Fragment,null,i.Ay.isEmpty(t)?a.createElement("pre",{className:"preText"},"This component does not have param defined"):a.createElement("table",null,a.createElement("thead",null,a.createElement("tr",null,a.createElement("th",null,"Param / Return"),a.createElement("th",null,"Description"))),a.createElement("tbody",null,Object.keys(t).map((e=>a.createElement("tr",{key:e},a.createElement("td",null,a.createElement("code",null,e)),a.createElement("td",null,"param"===e?t[e].split("\n").map(((e,t)=>{let n=e.split("-");return a.createElement("div",{key:t},a.createElement("code",null,n[0].trim()+":"),"\ufeff"+n[1])})):t[e]))))))):null};function m(e){const t=(0,s.d)(e.componentName),{description:n,displayName:i,tags:m}=t[0],c=`How to use the ${i} component`;return a.createElement(a.Fragment,null,a.createElement(r.A,null,a.createElement(l.A,{value:"description",label:"Description"},a.createElement("pre",{className:"preText"},n)),a.createElement(l.A,{value:"params",label:"Params and Return"},a.createElement(u,{props:m})),a.createElement(l.A,{value:"example",label:"Example"},e.example&&a.createElement(o.A,{title:c,className:"language-tsx test"},e.example))))}},28057:(e,t,n)=>{n.d(t,{d:()=>o});var a=n(2736);const o=e=>(0,a.Ay)()["docusaurus-plugin-react-docgen-typescript"].default.filter((t=>t.displayName===e))},44261:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>u,contentTitle:()=>s,default:()=>E,exampleString:()=>c,frontMatter:()=>l,metadata:()=>i,toc:()=>m});var a=n(58168),o=(n(96540),n(15680)),r=(n(41873),n(16360));const l={},s=void 0,i={unversionedId:"Engineering/FrontEnd/CustomHooks/useRouteNavigation",id:"Engineering/FrontEnd/CustomHooks/useRouteNavigation",title:"useRouteNavigation",description:"",source:"@site/docs/Engineering/FrontEnd/CustomHooks/useRouteNavigation.mdx",sourceDirName:"Engineering/FrontEnd/CustomHooks",slug:"/Engineering/FrontEnd/CustomHooks/useRouteNavigation",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/CustomHooks/useRouteNavigation",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"usePrevious",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/CustomHooks/usePrevious"},next:{title:"useTheme",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/CustomHooks/useTheme"}},u={},m=[],c="const MyComponent: FC = () => {\n    const navigateTo = useRouteNavigation()\n    return <WideButton onPress={() => navigateTo('Home')} />\n}",p={toc:m,exampleString:c},d="wrapper";function E(e){let{components:t,...n}=e;return(0,o.yg)(d,(0,a.A)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,o.yg)(r.A,{componentName:"useRouteNavigation",example:c,mdxType:"HooksInfo"}))}E.isMDXComponent=!0}}]);