"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[174],{9540:(e,r,n)=>{n.d(r,{d:()=>t});var o=n(72077);const t=e=>(0,o.Ay)()["docusaurus-plugin-react-docgen-typescript"].default.filter((r=>r.displayName===e))},64555:(e,r,n)=>{n.d(r,{A:()=>d});n(96540);var o=n(58069),t=n(65537),s=n(79329),i=n(9540),a=n(84476),l=n(74848);const c=e=>{let{props:r}=e;return r?(0,l.jsx)(l.Fragment,{children:a.Ay.isEmpty(r)?(0,l.jsx)("pre",{className:"preText",children:"This component does not have props defined"}):(0,l.jsxs)("table",{children:[(0,l.jsx)("thead",{children:(0,l.jsxs)("tr",{children:[(0,l.jsx)("th",{children:"Name"}),(0,l.jsx)("th",{children:"Type"}),(0,l.jsx)("th",{children:"Default Value"}),(0,l.jsx)("th",{children:"Required"}),(0,l.jsx)("th",{children:"Description"})]})}),(0,l.jsx)("tbody",{children:Object.keys(r).map((e=>(0,l.jsxs)("tr",{children:[(0,l.jsx)("td",{children:(0,l.jsx)("code",{children:e})}),(0,l.jsx)("td",{style:{minWidth:200},children:r[e].type?.name}),(0,l.jsx)("td",{children:r[e].defaultValue&&r[e].defaultValue.value.toString()}),(0,l.jsx)("td",{children:r[e].required?"Yes":"No"}),(0,l.jsx)("td",{children:r[e].description})]},e)))})]})}):null};function d(e){const r=(0,i.d)(e.componentName),{description:n,displayName:a,props:d}=r[0],p=`How to use the ${a} component`,m=`Full code for the ${a} component`;return(0,l.jsxs)(l.Fragment,{children:[n,(0,l.jsx)("br",{}),(0,l.jsx)("br",{}),(0,l.jsxs)(t.A,{children:[(0,l.jsx)(s.A,{value:"props",label:"Properties",children:(0,l.jsx)(c,{props:d})}),(0,l.jsx)(s.A,{value:"example",label:"Example",children:e.example&&(0,l.jsx)(o.A,{title:p,className:"language-tsx test",children:e.example})}),(0,l.jsx)(s.A,{value:"code",label:"Source Code",children:e.codeString&&(0,l.jsx)(o.A,{title:m,className:"language-tsx",children:e.codeString})}),(0,l.jsx)(s.A,{value:"accessibility",label:"Accessibility",children:(0,l.jsx)("pre",{className:"preText",children:e.accessibilityInfo})})]})]})}},73748:(e,r,n)=>{n.r(r),n.d(r,{assets:()=>d,contentTitle:()=>c,default:()=>u,exampleString:()=>p,frontMatter:()=>l,metadata:()=>o,toc:()=>m});const o=JSON.parse('{"id":"Flagship design library/Components/Errors/NetworkConnectionError","title":"NetworkConnectionError","description":"","source":"@site/docs/Flagship design library/Components/Errors/NetworkConnectionError.mdx","sourceDirName":"Flagship design library/Components/Errors","slug":"/Flagship design library/Components/Errors/NetworkConnectionError","permalink":"/va-mobile-app/docs/Flagship design library/Components/Errors/NetworkConnectionError","draft":false,"unlisted":false,"tags":[],"version":"current","frontMatter":{},"sidebar":"tutorialSidebar","previous":{"title":"ErrorComponent","permalink":"/va-mobile-app/docs/Flagship design library/Components/Errors/ErrorComponent"},"next":{"title":"Layout and organization","permalink":"/va-mobile-app/docs/Flagship design library/Components/Layout and Organization/"}}');var t=n(74848),s=n(28453);n(58069);const i="import React, { FC } from 'react'\nimport { useTranslation } from 'react-i18next'\n\nimport { NAMESPACE } from 'constants/namespaces'\n\nimport BasicError from './BasicError'\n\nexport type NetworkConnectionErrorProps = {\n  /** function called when the Try again button is pressed */\n  onTryAgain: () => void\n}\n\n/**A common component to show an alert for when it is a network error*/\nconst NetworkConnectionError: FC<NetworkConnectionErrorProps> = ({ onTryAgain }) => {\n  const { t } = useTranslation(NAMESPACE.COMMON)\n\n  return (\n    <BasicError\n      onTryAgain={onTryAgain}\n      messageText={t('errors.networkConnection.body')}\n      buttonA11yHint={t('errors.networkConnection.a11yHint')}\n      headerText={t('errors.networkConnection.header')}\n      label={t('refresh')}\n    />\n  )\n}\n\nexport default NetworkConnectionError\n";var a=n(64555);const l={},c=void 0,d={},p="<NetworkConnectionError onTryAgain={tryAgain} />",m=[];function h(e){return(0,t.jsx)(a.A,{componentName:"NetworkConnectionError",example:p,codeString:i})}function u(e={}){const{wrapper:r}={...(0,s.R)(),...e.components};return r?(0,t.jsx)(r,{...e,children:(0,t.jsx)(h,{...e})}):h()}}}]);