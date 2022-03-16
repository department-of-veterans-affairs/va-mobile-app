"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[1262],{38909:function(e,t,n){n.d(t,{Z:function(){return s}});var o=n(67294),r=n(19055),l=n(26396),i=n(58215),a=n(82224),u=n(36005),c=function(e){var t=e.props;return t?o.createElement(o.Fragment,null,u.ZP.isEmpty(t)?o.createElement("pre",{className:"preText"},"This component does not have props defined"):o.createElement("table",null,o.createElement("thead",null,o.createElement("tr",null,o.createElement("th",null,"Name"),o.createElement("th",null,"Type"),o.createElement("th",null,"Default Value"),o.createElement("th",null,"Required"),o.createElement("th",null,"Description"))),o.createElement("tbody",null,Object.keys(t).map((function(e){var n;return o.createElement("tr",{key:e},o.createElement("td",null,o.createElement("code",null,e)),o.createElement("td",{style:{minWidth:200}},null==(n=t[e].type)?void 0:n.name),o.createElement("td",null,t[e].defaultValue&&t[e].defaultValue.value.toString()),o.createElement("td",null,t[e].required?"Yes":"No"),o.createElement("td",null,t[e].description))}))))):null};function s(e){var t=(0,a.N)(e.componentName)[0],n=t.description,u=t.displayName,s=t.props,m="How to use the "+u+" component",p="Full code for the "+u+" component";return o.createElement(o.Fragment,null,n,o.createElement("br",null),o.createElement("br",null),o.createElement(l.Z,null,o.createElement(i.Z,{value:"props",label:"Properties"},o.createElement(c,{props:s})),o.createElement(i.Z,{value:"example",label:"Example"},e.example&&o.createElement(r.Z,{title:m,className:"language-tsx test"},e.example)),o.createElement(i.Z,{value:"code",label:"Source Code"},e.codeString&&o.createElement(r.Z,{title:p,className:"language-tsx"},e.codeString)),o.createElement(i.Z,{value:"accessibility",label:"Accessibility"},o.createElement("pre",{className:"preText"},e.accessibilityInfo))))}},22114:function(e,t,n){n.r(t),n.d(t,{contentTitle:function(){return c},default:function(){return g},exampleString:function(){return p},frontMatter:function(){return u},metadata:function(){return s},toc:function(){return m}});var o=n(87462),r=n(63366),l=(n(67294),n(3905)),i=(n(19055),n(38909)),a=["components"],u={},c=void 0,s={unversionedId:"Engineering/FrontEnd/ComponentsSection/SignoutButton",id:"Engineering/FrontEnd/ComponentsSection/SignoutButton",title:"SignoutButton",description:"export const exampleString = ``",source:"@site/docs/Engineering/FrontEnd/ComponentsSection/SignoutButton.mdx",sourceDirName:"Engineering/FrontEnd/ComponentsSection",slug:"/Engineering/FrontEnd/ComponentsSection/SignoutButton",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/ComponentsSection/SignoutButton",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"SegmentedControl",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/ComponentsSection/SegmentedControl"},next:{title:"SimpleList",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/ComponentsSection/SimpleList"}},m=[],p="<SignoutButton />",d={toc:m,exampleString:p};function g(e){var t=e.components,n=(0,r.Z)(e,a);return(0,l.kt)("wrapper",(0,o.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,l.kt)(i.Z,{componentName:"SignoutButton",example:p,codeString:"import React, { FC } from 'react'\n\nimport { ButtonTypesConstants } from './VAButton'\nimport { NAMESPACE } from 'constants/namespaces'\nimport { VAButton } from './index'\nimport { logout } from 'store/slices/authSlice'\nimport { testIdProps } from 'utils/accessibility'\nimport { useDestructiveAlert, useTranslation } from 'utils/hooks'\nimport { useDispatch } from 'react-redux'\n\n/**Common component for the sign out button */\nconst SignoutButton: FC = ({}) => {\n  const t = useTranslation(NAMESPACE.SETTINGS)\n  const dispatch = useDispatch()\n  const signOutAlert = useDestructiveAlert()\n  const _logout = () => {\n    dispatch(logout())\n  }\n\n  const onShowConfirm = (): void => {\n    signOutAlert({\n      title: t('logout.confirm.text'),\n      destructiveButtonIndex: 1,\n      cancelButtonIndex: 0,\n      buttons: [\n        {\n          text: t('common:cancel'),\n        },\n        {\n          text: t('logout.title'),\n          onPress: _logout,\n        },\n      ],\n    })\n  }\n\n  return (\n    <VAButton\n      onPress={onShowConfirm}\n      label={t('logout.title')}\n      buttonType={ButtonTypesConstants.buttonImportant}\n      a11yHint={t('logout.a11yHint')}\n      {...testIdProps(t('logout.title'))}\n    />\n  )\n}\n\nexport default SignoutButton\n",mdxType:"ComponentTopInfo"}))}g.isMDXComponent=!0}}]);