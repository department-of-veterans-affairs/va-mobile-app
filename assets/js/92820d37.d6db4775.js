"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[246],{28453:(e,n,t)=>{t.d(n,{R:()=>a,x:()=>r});var o=t(96540);const i={},s=o.createContext(i);function a(e){const n=o.useContext(s);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:a(e.components),o.createElement(s.Provider,{value:n},e.children)}},48011:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>r,default:()=>l,frontMatter:()=>a,metadata:()=>o,toc:()=>d});const o=JSON.parse('{"id":"Engineering/BackEnd/Testing/ApiTokens","title":"API Tokens","description":"Authorization and token types","source":"@site/docs/Engineering/BackEnd/Testing/ApiTokens.md","sourceDirName":"Engineering/BackEnd/Testing","slug":"/Engineering/BackEnd/Testing/ApiTokens","permalink":"/va-mobile-app/docs/Engineering/BackEnd/Testing/ApiTokens","draft":false,"unlisted":false,"tags":[],"version":"current","frontMatter":{"title":"API Tokens"},"sidebar":"tutorialSidebar","previous":{"title":"Testing","permalink":"/va-mobile-app/docs/Engineering/BackEnd/Testing/"},"next":{"title":"Postman","permalink":"/va-mobile-app/docs/Engineering/BackEnd/Testing/Postman"}}');var i=t(74848),s=t(28453);const a={title:"API Tokens"},r=void 0,c={},d=[{value:"Authorization and token types",id:"authorization-and-token-types",level:2},{value:"Fetching API tokens",id:"fetching-api-tokens",level:2},{value:"Working on the token app",id:"working-on-the-token-app",level:2}];function h(e){const n={a:"a",code:"code",h2:"h2",li:"li",ol:"ol",p:"p",pre:"pre",...(0,s.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.h2,{id:"authorization-and-token-types",children:"Authorization and token types"}),"\n",(0,i.jsx)(n.p,{children:"The mobile app currently SIS tokens (short for Sign-In Service). SIS is an in-house VA auth service."}),"\n",(0,i.jsx)(n.p,{children:"SIS tokens are over a thousand characters long."}),"\n",(0,i.jsxs)(n.p,{children:["You have to include an additional header when using SIS tokens: ",(0,i.jsx)(n.code,{children:"Authentication-Method: SIS"})]}),"\n",(0,i.jsx)(n.h2,{id:"fetching-api-tokens",children:"Fetching API tokens"}),"\n",(0,i.jsx)(n.p,{children:"We host a web app on heroku for fetching api tokens. You can fetch tokens in two ways:"}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["Manual: Go to the ",(0,i.jsx)(n.a,{href:"https://va-mobile-cutter.herokuapp.com",children:"token generator web app"})," and log in with a test user. User credentials are in 1Password."]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:"Automated: These requests use basic auth (ask teammates for username and password) and will only work if the test user has previously been logged in via the manual approach and the user's refresh token is still valid. The route for fetching SIS tokens is:"}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"GET https://va-mobile-cutter.herokuapp.com/auth/sis/token/judy.morrison@id.me\n"})}),"\n",(0,i.jsx)(n.h2,{id:"working-on-the-token-app",children:"Working on the token app"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.a,{href:"https://github.com/adhocteam/va-mobile-sampleweb",children:"View code for the token fetcher app"})," and instructions for development can be found in the README. To work on the app, you will need write access to the repo and admin access to the heroku instance."]})]})}function l(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(h,{...e})}):h(e)}}}]);