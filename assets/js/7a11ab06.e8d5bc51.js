"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[8662],{16360:(e,t,n)=>{n.d(t,{A:()=>m});var a=n(96540),r=n(54610),o=n(3384),l=n(31347),s=n(28057),i=n(84476);const c=e=>{let{props:t}=e;return t?a.createElement(a.Fragment,null,i.Ay.isEmpty(t)?a.createElement("pre",{className:"preText"},"This component does not have param defined"):a.createElement("table",null,a.createElement("thead",null,a.createElement("tr",null,a.createElement("th",null,"Param / Return"),a.createElement("th",null,"Description"))),a.createElement("tbody",null,Object.keys(t).map((e=>a.createElement("tr",{key:e},a.createElement("td",null,a.createElement("code",null,e)),a.createElement("td",null,"param"===e?t[e].split("\n").map(((e,t)=>{let n=e.split("-");return a.createElement("div",{key:t},a.createElement("code",null,n[0].trim()+":"),"\ufeff"+n[1])})):t[e]))))))):null};function m(e){const t=(0,s.d)(e.componentName),{description:n,displayName:i,tags:m}=t[0],u=`How to use the ${i} component`;return a.createElement(a.Fragment,null,a.createElement(o.A,null,a.createElement(l.A,{value:"description",label:"Description"},a.createElement("pre",{className:"preText"},n)),a.createElement(l.A,{value:"params",label:"Params and Return"},a.createElement(c,{props:m})),a.createElement(l.A,{value:"example",label:"Example"},e.example&&a.createElement(r.A,{title:u,className:"language-tsx test"},e.example))))}},28057:(e,t,n)=>{n.d(t,{d:()=>r});var a=n(2736);const r=e=>(0,a.Ay)()["docusaurus-plugin-react-docgen-typescript"].default.filter((t=>t.displayName===e))},74749:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>s,default:()=>E,exampleString:()=>u,frontMatter:()=>l,metadata:()=>i,toc:()=>m});var a=n(58168),r=(n(96540),n(15680)),o=(n(41873),n(16360));const l={},s=void 0,i={unversionedId:"Engineering/FrontEnd/CustomHooks/useBeforeNavBackListener",id:"Engineering/FrontEnd/CustomHooks/useBeforeNavBackListener",title:"useBeforeNavBackListener",description:"",source:"@site/docs/Engineering/FrontEnd/CustomHooks/useBeforeNavBackListener.mdx",sourceDirName:"Engineering/FrontEnd/CustomHooks",slug:"/Engineering/FrontEnd/CustomHooks/useBeforeNavBackListener",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/CustomHooks/useBeforeNavBackListener",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"useAutoScrollToElement",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/CustomHooks/useAutoScrollToElement"},next:{title:"useDestructiveAlert",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/CustomHooks/useDestructiveAlert"}},c={},m=[],u="useBeforeNavBackListener(navigation, (e) => {\n  if (imagesList?.length === 0 || filesUploadedSuccess) {\n    return\n  }\n  e.preventDefault()\n  confirmAlert({\n    title: t('fileUpload.discard.confirm.title.photos'),\n    message: t('fileUpload.discard.confirm.message.photos'),\n    cancelButtonIndex: 0,\n    destructiveButtonIndex: 1,\n    buttons: [\n      {\n        text: t('fileUpload.continueUpload'),\n      },\n      {\n        text: t('fileUpload.cancelUpload'),\n        onPress: () => {\n          navigation.dispatch(e.data.action)\n        },\n      },\n    ],\n  })\n})",p={toc:m,exampleString:u},d="wrapper";function E(e){let{components:t,...n}=e;return(0,r.yg)(d,(0,a.A)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,r.yg)(o.A,{componentName:"useBeforeNavBackListener",example:u,mdxType:"HooksInfo"}))}E.isMDXComponent=!0}}]);