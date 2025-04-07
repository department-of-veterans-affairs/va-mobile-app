"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[4904],{20924:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>c,contentTitle:()=>a,default:()=>h,frontMatter:()=>r,metadata:()=>t,toc:()=>l});const t=JSON.parse('{"id":"About/For engineers/namingConventions","title":"Naming Conventions","description":"This page documents naming conventions as they pertain to the design system. It is not fully inclusive.","source":"@site/design/About/For engineers/namingConventions.md","sourceDirName":"About/For engineers","slug":"/About/For engineers/namingConventions","permalink":"/va-mobile-app/design/About/For engineers/namingConventions","draft":false,"unlisted":false,"tags":[],"version":"current","frontMatter":{},"sidebar":"tutorialSidebar","previous":{"title":"Linting","permalink":"/va-mobile-app/design/About/For engineers/linting"},"next":{"title":"Release process","permalink":"/va-mobile-app/design/About/For engineers/releaseProcess"}}');var o=i(74848),s=i(28453);const r={},a="Naming Conventions",c={},l=[{value:"Component Prop Naming",id:"component-prop-naming",level:3}];function d(e){const n={code:"code",h1:"h1",h3:"h3",header:"header",li:"li",p:"p",ul:"ul",...(0,s.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(n.header,{children:(0,o.jsx)(n.h1,{id:"naming-conventions",children:"Naming Conventions"})}),"\n",(0,o.jsx)(n.p,{children:"This page documents naming conventions as they pertain to the design system. It is not fully inclusive."}),"\n",(0,o.jsx)(n.h3,{id:"component-prop-naming",children:"Component Prop Naming"}),"\n",(0,o.jsx)(n.p,{children:"This section details the naming conventions of properties (props) passed into the components package to give a high level vernacular of how we think about the aspects of a component. Naming practices are more art than science due to the variety of functionality of the components so these are not necessarily hard and fast rules so much as guidelines."}),"\n",(0,o.jsx)(n.p,{children:"General prop guidelines:"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["Use ",(0,o.jsx)(n.code,{children:"lowerCamelCase"})," capitalization"]}),"\n",(0,o.jsxs)(n.li,{children:["Generic behavioral differentiation:","\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.code,{children:"variant"})," is the primary generic behavioral differentiator, accounting for the most meaningful functional distinction"]}),"\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.code,{children:"type"})," is the secondary generic behavioral differentiator, if needed"]}),"\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.code,{children:"modifier"})," is the tertiary generic behavioral differentiator, if the component includes enough generic variety"]}),"\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.code,{children:"alternative"})," is the quaternary generic behavioral differentiator, if somehow that level of generic naming is necessary"]}),"\n"]}),"\n"]}),"\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.code,{children:"tone"})," is a special generic differentiator used for purely basic styling (e.g. Link color); delineated from ",(0,o.jsx)(n.code,{children:"style"})," to keep distinct from React Native's default styling prop"]}),"\n",(0,o.jsxs)(n.li,{children:["If the behavioral differentiation is simple, has generally accepted terminology, and/or is targeted to controlling a specific aspect, then consider functional prop naming over generic naming","\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["For example: ",(0,o.jsx)(n.code,{children:"expandable"})," for Alert that has expand/collapse behavior instead of secondary generic term (where ",(0,o.jsx)(n.code,{children:"variant"})," controls Alert types of info/success/warning/error)"]}),"\n"]}),"\n"]}),"\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.code,{children:"a11y"})," should be used for relevant accessibility related props, either as a prefix or descriptor (",(0,o.jsx)(n.code,{children:"A11y"}),") if multiple props have accessibility modifiers"]}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(d,{...e})}):d(e)}},28453:(e,n,i)=>{i.d(n,{R:()=>r,x:()=>a});var t=i(96540);const o={},s=t.createContext(o);function r(e){const n=t.useContext(s);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:r(e.components),t.createElement(s.Provider,{value:n},e.children)}}}]);