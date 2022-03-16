"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[1567],{38909:function(e,n,t){t.d(n,{Z:function(){return s}});var r=t(67294),o=t(19055),a=t(26396),l=t(58215),i=t(82224),c=t(36005),m=function(e){var n=e.props;return n?r.createElement(r.Fragment,null,c.ZP.isEmpty(n)?r.createElement("pre",{className:"preText"},"This component does not have props defined"):r.createElement("table",null,r.createElement("thead",null,r.createElement("tr",null,r.createElement("th",null,"Name"),r.createElement("th",null,"Type"),r.createElement("th",null,"Default Value"),r.createElement("th",null,"Required"),r.createElement("th",null,"Description"))),r.createElement("tbody",null,Object.keys(n).map((function(e){var t;return r.createElement("tr",{key:e},r.createElement("td",null,r.createElement("code",null,e)),r.createElement("td",{style:{minWidth:200}},null==(t=n[e].type)?void 0:t.name),r.createElement("td",null,n[e].defaultValue&&n[e].defaultValue.value.toString()),r.createElement("td",null,n[e].required?"Yes":"No"),r.createElement("td",null,n[e].description))}))))):null};function s(e){var n=(0,i.N)(e.componentName)[0],t=n.description,c=n.displayName,s=n.props,p="How to use the "+c+" component",u="Full code for the "+c+" component";return r.createElement(r.Fragment,null,t,r.createElement("br",null),r.createElement("br",null),r.createElement(a.Z,null,r.createElement(l.Z,{value:"props",label:"Properties"},r.createElement(m,{props:s})),r.createElement(l.Z,{value:"example",label:"Example"},e.example&&r.createElement(o.Z,{title:p,className:"language-tsx test"},e.example)),r.createElement(l.Z,{value:"code",label:"Source Code"},e.codeString&&r.createElement(o.Z,{title:u,className:"language-tsx"},e.codeString)),r.createElement(l.Z,{value:"accessibility",label:"Accessibility"},r.createElement("pre",{className:"preText"},e.accessibilityInfo))))}},98851:function(e,n,t){t.r(n),t.d(n,{contentTitle:function(){return m},default:function(){return d},exampleString:function(){return u},frontMatter:function(){return c},metadata:function(){return s},toc:function(){return p}});var r=t(87462),o=t(63366),a=(t(67294),t(3905)),l=(t(19055),t(38909)),i=["components"],c={},m=void 0,s={unversionedId:"Engineering/FrontEnd/ComponentsSection/ErrorComponents/NetworkConnectionError",id:"Engineering/FrontEnd/ComponentsSection/ErrorComponents/NetworkConnectionError",title:"NetworkConnectionError",description:"",source:"@site/docs/Engineering/FrontEnd/ComponentsSection/ErrorComponents/NetworkConnectionError.mdx",sourceDirName:"Engineering/FrontEnd/ComponentsSection/ErrorComponents",slug:"/Engineering/FrontEnd/ComponentsSection/ErrorComponents/NetworkConnectionError",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/ComponentsSection/ErrorComponents/NetworkConnectionError",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"ErrorComponent",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/ComponentsSection/ErrorComponents/ErrorComponent"},next:{title:"FormAttachments",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/ComponentsSection/FormComponents/FormAttachments"}},p=[],u="<NetworkConnectionError onTryAgain={tryAgain} />",E={toc:p,exampleString:u};function d(e){var n=e.components,t=(0,o.Z)(e,i);return(0,a.kt)("wrapper",(0,r.Z)({},E,t,{components:n,mdxType:"MDXLayout"}),(0,a.kt)(l.Z,{componentName:"NetworkConnectionError",example:u,codeString:"import React, { FC } from 'react'\n\nimport { NAMESPACE } from 'constants/namespaces'\nimport { useTranslation } from 'utils/hooks'\nimport BasicError from './BasicError'\n\nexport type NetworkConnectionErrorProps = {\n  /** function called when the Try again button is pressed */\n  onTryAgain: () => void\n}\n\n/**A common component to show an alert for when it is a network error*/\nconst NetworkConnectionError: FC<NetworkConnectionErrorProps> = ({ onTryAgain }) => {\n  const t = useTranslation(NAMESPACE.COMMON)\n\n  return (\n    <BasicError\n      onTryAgain={onTryAgain}\n      messageText={t('errors.networkConnection.body')}\n      buttonA11yHint={t('errors.networkConnection.a11yHint')}\n      headerText={t('errors.networkConnection.header')}\n      headerA11yLabel={t('errors.networkConnection.headerA11yLabel')}\n      label={t('refresh')}\n    />\n  )\n}\n\nexport default NetworkConnectionError\n",mdxType:"ComponentTopInfo"}))}d.isMDXComponent=!0}}]);