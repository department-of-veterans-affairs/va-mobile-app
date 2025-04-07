"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[263],{9540:(e,n,t)=>{t.d(n,{d:()=>a});var s=t(72077);const a=e=>(0,s.Ay)()["docusaurus-plugin-react-docgen-typescript"].default.filter((n=>n.displayName===e))},38035:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>d,contentTitle:()=>l,default:()=>g,exampleString:()=>c,frontMatter:()=>o,metadata:()=>s,toc:()=>u});const s=JSON.parse('{"id":"Engineering/FrontEnd/CustomHooks/useValidateMessageWithSignature","title":"useValidateMessageWithSignature","description":"","source":"@site/docs/Engineering/FrontEnd/CustomHooks/useValidateMessageWithSignature.mdx","sourceDirName":"Engineering/FrontEnd/CustomHooks","slug":"/Engineering/FrontEnd/CustomHooks/useValidateMessageWithSignature","permalink":"/va-mobile-app/docs/Engineering/FrontEnd/CustomHooks/useValidateMessageWithSignature","draft":false,"unlisted":false,"tags":[],"version":"current","frontMatter":{},"sidebar":"tutorialSidebar","previous":{"title":"useTopPaddingAsHeaderStyles","permalink":"/va-mobile-app/docs/Engineering/FrontEnd/CustomHooks/useTopPaddingAsHeaderStyles"},"next":{"title":"Debugging Tools","permalink":"/va-mobile-app/docs/Engineering/FrontEnd/DebuggingToolsInstructions"}}');var a=t(74848),i=t(28453),r=t(92179);const o={},l=void 0,d={},c="const validateMessage = useValidateMessageWithSignature()\n\n useEffect(() => {\n    navigation.setOptions({\n      headerLeft: (props): ReactNode => (\n        <BackButton\n          onPress={validateMessage(messageReply) ? goToCancel : navigation.goBack}\n          canGoBack={props.canGoBack}\n          label={BackButtonLabelConstants.cancel}\n          showCarat={false}\n        />\n      ),\n      headerRight: () => (\n        <SaveButton\n          onSave={() => {\n            setOnSaveDraftClicked(true)\n            setOnSendClicked(true)\n          }}\n          disabled={false}\n          a11yHint={t('secureMessaging.saveDraft.a11yHint')}\n        />\n      ),\n    })\n  })",u=[];function p(e){return(0,a.jsx)(r.A,{componentName:"useValidateMessageWithSignature",example:c})}function g(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,a.jsx)(n,{...e,children:(0,a.jsx)(p,{...e})}):p()}},92179:(e,n,t)=>{t.d(n,{A:()=>c});t(96540);var s=t(58069),a=t(65537),i=t(79329),r=t(9540),o=t(84476),l=t(74848);const d=e=>{let{props:n}=e;return n?(0,l.jsx)(l.Fragment,{children:o.Ay.isEmpty(n)?(0,l.jsx)("pre",{className:"preText",children:"This component does not have param defined"}):(0,l.jsxs)("table",{children:[(0,l.jsx)("thead",{children:(0,l.jsxs)("tr",{children:[(0,l.jsx)("th",{children:"Param / Return"}),(0,l.jsx)("th",{children:"Description"})]})}),(0,l.jsx)("tbody",{children:Object.keys(n).map((e=>{return(0,l.jsxs)("tr",{children:[(0,l.jsx)("td",{children:(0,l.jsx)("code",{children:e})}),(0,l.jsx)("td",{children:"param"===e?(t=n[e],t.split("\n").map(((e,n)=>{let t=e.split("-");return(0,l.jsxs)("div",{children:[(0,l.jsx)("code",{children:t[0].trim()+":"}),"\ufeff"+t[1]]},n)}))):n[e]})]},e);var t}))})]})}):null};function c(e){const n=(0,r.d)(e.componentName),{description:t,displayName:o,tags:c}=n[0],u=`How to use the ${o} component`;return(0,l.jsx)(l.Fragment,{children:(0,l.jsxs)(a.A,{children:[(0,l.jsx)(i.A,{value:"description",label:"Description",children:(0,l.jsx)("pre",{className:"preText",children:t})}),(0,l.jsx)(i.A,{value:"params",label:"Params and Return",children:(0,l.jsx)(d,{props:c})}),(0,l.jsx)(i.A,{value:"example",label:"Example",children:e.example&&(0,l.jsx)(s.A,{title:u,className:"language-tsx test",children:e.example})})]})})}}}]);