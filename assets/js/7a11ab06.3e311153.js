"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[9143],{77800:function(e,n,t){t.d(n,{Z:function(){return u}});var r=t(67294),o=t(19055),a=t(26396),l=t(58215),i=t(82224),s=t(36005),c=function(e){var n=e.props;return n?r.createElement(r.Fragment,null,s.ZP.isEmpty(n)?r.createElement("pre",{className:"preText"},"This component does not have param defined"):r.createElement("table",null,r.createElement("thead",null,r.createElement("tr",null,r.createElement("th",null,"Param / Return"),r.createElement("th",null,"Description"))),r.createElement("tbody",null,Object.keys(n).map((function(e){return r.createElement("tr",{key:e},r.createElement("td",null,r.createElement("code",null,e)),r.createElement("td",null,"param"===e?n[e].split("\n").map((function(e,n){var t=e.split("-");return r.createElement("div",{key:n},r.createElement("code",null,t[0].trim()+":"),"\ufeff"+t[1])})):n[e]))}))))):null};function u(e){var n=(0,i.N)(e.componentName)[0],t=n.description,s=n.displayName,u=n.tags,m="How to use the "+s+" component";return r.createElement(r.Fragment,null,r.createElement(a.Z,null,r.createElement(l.Z,{value:"description",label:"Description"},r.createElement("pre",{className:"preText"},t)),r.createElement(l.Z,{value:"params",label:"Params and Return"},r.createElement(c,{props:u})),r.createElement(l.Z,{value:"example",label:"Example"},e.example&&r.createElement(o.Z,{title:m,className:"language-tsx test"},e.example))))}},58426:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return s},contentTitle:function(){return c},metadata:function(){return u},toc:function(){return m},exampleString:function(){return p},default:function(){return f}});var r=t(87462),o=t(63366),a=(t(67294),t(3905)),l=t(77800),i=["components"],s={},c=void 0,u={unversionedId:"Engineering/FrontEnd/CustomHooks/useBeforeNavBackListener",id:"Engineering/FrontEnd/CustomHooks/useBeforeNavBackListener",title:"useBeforeNavBackListener",description:"export const exampleString = `useBeforeNavBackListener(navigation, (e) => {",source:"@site/docs/Engineering/FrontEnd/CustomHooks/useBeforeNavBackListener.mdx",sourceDirName:"Engineering/FrontEnd/CustomHooks",slug:"/Engineering/FrontEnd/CustomHooks/useBeforeNavBackListener",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/CustomHooks/useBeforeNavBackListener",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"useAutoScrollToElement",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/CustomHooks/useAutoScrollToElement"},next:{title:"useDestructiveAlert",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/CustomHooks/useDestructiveAlert"}},m=[],p="useBeforeNavBackListener(navigation, (e) => {\n  if (imagesList?.length === 0 || filesUploadedSuccess) {\n    return\n  }\n  e.preventDefault()\n  confirmAlert({\n    title: t('fileUpload.discard.confirm.title.photos'),\n    message: t('fileUpload.discard.confirm.message.photos'),\n    cancelButtonIndex: 0,\n    destructiveButtonIndex: 1,\n    buttons: [\n      {\n        text: t('common:cancel'),\n      },\n      {\n        text: t('fileUpload.discard.photos'),\n        onPress: () => {\n          navigation.dispatch(e.data.action)\n        },\n      },\n    ],\n  })\n})",d={toc:m,exampleString:p};function f(e){var n=e.components,t=(0,o.Z)(e,i);return(0,a.kt)("wrapper",(0,r.Z)({},d,t,{components:n,mdxType:"MDXLayout"}),(0,a.kt)(l.Z,{componentName:"useBeforeNavBackListener",example:p,mdxType:"HooksInfo"}))}f.isMDXComponent=!0}}]);