"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[9058],{9540:(e,n,s)=>{s.d(n,{d:()=>a});var t=s(72077);const a=e=>(0,t.Ay)()["docusaurus-plugin-react-docgen-typescript"].default.filter((n=>n.displayName===e))},62537:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>l,contentTitle:()=>d,default:()=>m,exampleString:()=>c,frontMatter:()=>o,metadata:()=>t,toc:()=>p});const t=JSON.parse('{"id":"Engineering/FrontEnd/CustomHooks/useTopPaddingAsHeaderStyles","title":"useTopPaddingAsHeaderStyles","description":"","source":"@site/docs/Engineering/FrontEnd/CustomHooks/useTopPaddingAsHeaderStyles.mdx","sourceDirName":"Engineering/FrontEnd/CustomHooks","slug":"/Engineering/FrontEnd/CustomHooks/useTopPaddingAsHeaderStyles","permalink":"/va-mobile-app/docs/Engineering/FrontEnd/CustomHooks/useTopPaddingAsHeaderStyles","draft":false,"unlisted":false,"tags":[],"version":"current","frontMatter":{},"sidebar":"tutorialSidebar","previous":{"title":"useTheme","permalink":"/va-mobile-app/docs/Engineering/FrontEnd/CustomHooks/useTheme"},"next":{"title":"useValidateMessageWithSignature","permalink":"/va-mobile-app/docs/Engineering/FrontEnd/CustomHooks/useValidateMessageWithSignature"}}');var a=s(74848),r=s(28453),i=s(92179);const o={},d=void 0,l={},c="const topPaddingAsHeaderStyles = useTopPaddingAsHeaderStyles()\n\n<Stack.Navigator>\n        <Stack.Screen name=\"Splash\" component={SplashScreen} options={{ ...topPaddingAsHeaderStyles, title: 'SplashScreen' }} />\n</Stack.Navigator>",p=[];function u(e){return(0,a.jsx)(i.A,{componentName:"useTopPaddingAsHeaderStyles",example:c})}function m(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,a.jsx)(n,{...e,children:(0,a.jsx)(u,{...e})}):u()}},92179:(e,n,s)=>{s.d(n,{A:()=>c});s(96540);var t=s(58069),a=s(65537),r=s(79329),i=s(9540),o=s(84476),d=s(74848);const l=e=>{let{props:n}=e;return n?(0,d.jsx)(d.Fragment,{children:o.Ay.isEmpty(n)?(0,d.jsx)("pre",{className:"preText",children:"This component does not have param defined"}):(0,d.jsxs)("table",{children:[(0,d.jsx)("thead",{children:(0,d.jsxs)("tr",{children:[(0,d.jsx)("th",{children:"Param / Return"}),(0,d.jsx)("th",{children:"Description"})]})}),(0,d.jsx)("tbody",{children:Object.keys(n).map((e=>{return(0,d.jsxs)("tr",{children:[(0,d.jsx)("td",{children:(0,d.jsx)("code",{children:e})}),(0,d.jsx)("td",{children:"param"===e?(s=n[e],s.split("\n").map(((e,n)=>{let s=e.split("-");return(0,d.jsxs)("div",{children:[(0,d.jsx)("code",{children:s[0].trim()+":"}),"\ufeff"+s[1]]},n)}))):n[e]})]},e);var s}))})]})}):null};function c(e){const n=(0,i.d)(e.componentName),{description:s,displayName:o,tags:c}=n[0],p=`How to use the ${o} component`;return(0,d.jsx)(d.Fragment,{children:(0,d.jsxs)(a.A,{children:[(0,d.jsx)(r.A,{value:"description",label:"Description",children:(0,d.jsx)("pre",{className:"preText",children:s})}),(0,d.jsx)(r.A,{value:"params",label:"Params and Return",children:(0,d.jsx)(l,{props:c})}),(0,d.jsx)(r.A,{value:"example",label:"Example",children:e.example&&(0,d.jsx)(t.A,{title:p,className:"language-tsx test",children:e.example})})]})})}}}]);