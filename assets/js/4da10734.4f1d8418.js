"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[5043],{16360:(e,n,t)=>{t.d(n,{A:()=>m});var s=t(96540),a=t(54610),r=t(3384),l=t(31347),o=t(28057),i=t(84476);const u=e=>{let{props:n}=e;return n?s.createElement(s.Fragment,null,i.Ay.isEmpty(n)?s.createElement("pre",{className:"preText"},"This component does not have param defined"):s.createElement("table",null,s.createElement("thead",null,s.createElement("tr",null,s.createElement("th",null,"Param / Return"),s.createElement("th",null,"Description"))),s.createElement("tbody",null,Object.keys(n).map((e=>s.createElement("tr",{key:e},s.createElement("td",null,s.createElement("code",null,e)),s.createElement("td",null,"param"===e?n[e].split("\n").map(((e,n)=>{let t=e.split("-");return s.createElement("div",{key:n},s.createElement("code",null,t[0].trim()+":"),"\ufeff"+t[1])})):n[e]))))))):null};function m(e){const n=(0,o.d)(e.componentName),{description:t,displayName:i,tags:m}=n[0],p=`How to use the ${i} component`;return s.createElement(s.Fragment,null,s.createElement(r.A,null,s.createElement(l.A,{value:"description",label:"Description"},s.createElement("pre",{className:"preText"},t)),s.createElement(l.A,{value:"params",label:"Params and Return"},s.createElement(u,{props:m})),s.createElement(l.A,{value:"example",label:"Example"},e.example&&s.createElement(a.A,{title:p,className:"language-tsx test"},e.example))))}},28057:(e,n,t)=>{t.d(n,{d:()=>a});var s=t(2736);const a=e=>(0,s.Ay)()["docusaurus-plugin-react-docgen-typescript"].default.filter((n=>n.displayName===e))},64551:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>u,contentTitle:()=>o,default:()=>d,exampleString:()=>p,frontMatter:()=>l,metadata:()=>i,toc:()=>m});var s=t(58168),a=(t(96540),t(15680)),r=(t(41873),t(16360));const l={},o=void 0,i={unversionedId:"Engineering/FrontEnd/CustomHooks/useMessageWithSignature",id:"Engineering/FrontEnd/CustomHooks/useMessageWithSignature",title:"useMessageWithSignature",description:"",source:"@site/docs/Engineering/FrontEnd/CustomHooks/useMessageWithSignature.mdx",sourceDirName:"Engineering/FrontEnd/CustomHooks",slug:"/Engineering/FrontEnd/CustomHooks/useMessageWithSignature",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/CustomHooks/useMessageWithSignature",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"useHeaderStyles",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/CustomHooks/useHeaderStyles"},next:{title:"useOnResumeForeground",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/CustomHooks/useOnResumeForeground"}},u={},m=[],p="const [messageReply, setMessageReply] = useMessageWithSignature()\n\nconst goToCancel = () => {\n    replyCancelConfirmation({\n      origin: FormHeaderTypeConstants.reply,\n      replyToID: messageID,\n      messageData: { body: messageReply },\n      isFormValid: true,\n    })\n}\n\n{\n    fieldType: FieldType.TextInput,\n    fieldProps: {\n    inputType: 'none',\n    value: messageReply,\n    onChange: setMessageReply,\n    labelKey: 'health:secureMessaging.formMessage.message',\n    isRequiredField: true,\n    isTextArea: true,\n    setInputCursorToBeginning: true,\n    },\n    fieldErrorMessage: t('secureMessaging.formMessage.message.fieldError'),\n},",c={toc:m,exampleString:p},g="wrapper";function d(e){let{components:n,...t}=e;return(0,a.yg)(g,(0,s.A)({},c,t,{components:n,mdxType:"MDXLayout"}),(0,a.yg)(r.A,{componentName:"useMessageWithSignature",example:p,mdxType:"HooksInfo"}))}d.isMDXComponent=!0}}]);