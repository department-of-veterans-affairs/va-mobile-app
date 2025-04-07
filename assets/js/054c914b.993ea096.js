"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[7941],{11015:(e,t,r)=>{r.d(t,{A:()=>n});const n=r.p+"assets/images/sentry-exception-additional-data-50db1dc7450fe661e504f4d6c7f59a15.png"},14120:(e,t,r)=>{r.d(t,{A:()=>n});const n=r.p+"assets/images/sentry-exception-42d6d2c8793a70a78667c4f9b2c8e434.png"},28453:(e,t,r)=>{r.d(t,{R:()=>i,x:()=>a});var n=r(96540);const s={},o=n.createContext(s);function i(e){const t=n.useContext(o);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:i(e.components),n.createElement(o.Provider,{value:t},e.children)}},64095:(e,t,r)=>{r.d(t,{A:()=>n});const n=r.p+"assets/images/sentry-log-level-toggle-03ef4fd3e442d4084abafd6b1d5e7353.png"},69546:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>c,contentTitle:()=>a,default:()=>h,frontMatter:()=>i,metadata:()=>n,toc:()=>l});const n=JSON.parse('{"id":"Engineering/BackEnd/Monitoring/Sentry","title":"Sentry","description":"Sentry is our automated error tracking tool. New exceptions in the API will cause Sentry to send us an email alert. We also audit the existing errors when fixing tech debt or silencing errors that are expected, i.e. unexceptional, such as when sub-systems return validation or not-found errors as 500s rather than 422s or 404s.","source":"@site/docs/Engineering/BackEnd/Monitoring/Sentry.md","sourceDirName":"Engineering/BackEnd/Monitoring","slug":"/Engineering/BackEnd/Monitoring/Sentry","permalink":"/va-mobile-app/docs/Engineering/BackEnd/Monitoring/Sentry","draft":false,"unlisted":false,"tags":[],"version":"current","frontMatter":{"title":"Sentry"},"sidebar":"tutorialSidebar","previous":{"title":"On-Call Procedure","permalink":"/va-mobile-app/docs/Engineering/BackEnd/Monitoring/OnCallProcedure"},"next":{"title":"Statsd Metrics","permalink":"/va-mobile-app/docs/Engineering/BackEnd/Monitoring/Statsd"}}');var s=r(74848),o=r(28453);const i={title:"Sentry"},a=void 0,c={},l=[];function d(e){const t={a:"a",img:"img",p:"p",...(0,o.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.a,{href:"http://sentry10.vfs.va.gov/auth/login/vsp/v/auth/login/vsp/",children:"Sentry"})," is our automated error tracking tool. New exceptions in the API will cause Sentry to send us an email alert. We also audit the existing errors when fixing tech debt or silencing errors that are expected, i.e. unexceptional, such as when sub-systems return validation or not-found errors as 500s rather than 422s or 404s."]}),"\n",(0,s.jsx)(t.p,{children:"All our classes are namespaced with a 'Mobile' Ruby module. When auditing errors a custom search of 'Mobile' filters out other vets-api errors."}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.img,{alt:"Search box in Sentry containing the word mobile",src:r(96933).A+"",width:"1344",height:"480"})}),"\n",(0,s.jsx)(t.p,{children:"To further refine the search to only 'error', rather than 'warn' or 'info' level errors you can toggle open the search builder bar."}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.img,{alt:"Toggle search builder option",src:r(82948).A+"",width:"654",height:"188"})}),"\n",(0,s.jsx)(t.p,{children:"And then select 'error' from the list."}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.img,{alt:"Dropdown listing three options: Warning, Info, and Error",src:r(64095).A+"",width:"726",height:"426"})}),"\n",(0,s.jsx)(t.p,{children:"Once you've found an error, or have been linked to one directly from an alert email, you'll be taken to the error details page."}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.img,{alt:"Error result page in Sentry",src:r(14120).A+"",width:"1999",height:"1427"})}),"\n",(0,s.jsx)(t.p,{children:"The majority of our errors occur during HTTP responses. Often the errors first present themselves deep within the API framework's base classes."}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.img,{alt:"Code-level error details example",src:r(77987).A+"",width:"1999",height:"1107"})}),"\n",(0,s.jsx)(t.p,{children:"Selecting the 'Full' tab reveals the full call stack and as seen below the true source of the error."}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.img,{alt:"Full error stack example",src:r(71717).A+"",width:"1999",height:"803"})}),"\n",(0,s.jsx)(t.p,{children:"Once the location of the error has been determined the next step is determining the cause. Errors from bugs we have introduced (500s in our API responses) will have clear Ruby errors such as 'NoMethodError'. For errors from sub-systems you'll need to check the 'ADDITIONAL DATA' section of the error details page."}),"\n",(0,s.jsx)(t.p,{children:"As seen below this section includes the errors from the upstream service as well as any custom tags added for that specific service. In this case 'ICN' and 'MHV Correlation ID' can be used to cross-reference Loki based logs to get an idea of the full request flow and any user actions that lead up to the error."}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.img,{alt:"Other upstream errors included in the log output",src:r(11015).A+"",width:"1999",height:"1455"})})]})}function h(e={}){const{wrapper:t}={...(0,o.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}},71717:(e,t,r)=>{r.d(t,{A:()=>n});const n=r.p+"assets/images/sentry-exception-full-details-4da6a35c5a7c78ae4c33d22b05cadd8e.png"},77987:(e,t,r)=>{r.d(t,{A:()=>n});const n=r.p+"assets/images/sentry-exception-app-only-ec39dda2b89899988115f3203436b5c5.png"},82948:(e,t,r)=>{r.d(t,{A:()=>n});const n=r.p+"assets/images/sentry-toggle-search-builder-02580a5afa9c79bda195aa1643d12594.png"},96933:(e,t,r)=>{r.d(t,{A:()=>n});const n=r.p+"assets/images/sentry-custom-search-83ab1f6f607e7dba7c2ccc79469a11d0.png"}}]);