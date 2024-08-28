"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[9125],{7644:(e,t,n)=>{n.d(t,{A:()=>c});var i=n(96540),s=n(54610),a=n(3384),l=n(31347),r=n(28057),o=n(84476);const u=e=>{let{props:t}=e;return t?i.createElement(i.Fragment,null,o.Ay.isEmpty(t)?i.createElement("pre",{className:"preText"},"This component does not have props defined"):i.createElement("table",null,i.createElement("thead",null,i.createElement("tr",null,i.createElement("th",null,"Name"),i.createElement("th",null,"Type"),i.createElement("th",null,"Default Value"),i.createElement("th",null,"Required"),i.createElement("th",null,"Description"))),i.createElement("tbody",null,Object.keys(t).map((e=>i.createElement("tr",{key:e},i.createElement("td",null,i.createElement("code",null,e)),i.createElement("td",{style:{minWidth:200}},t[e].type?.name),i.createElement("td",null,t[e].defaultValue&&t[e].defaultValue.value.toString()),i.createElement("td",null,t[e].required?"Yes":"No"),i.createElement("td",null,t[e].description))))))):null};function c(e){const t=(0,r.d)(e.componentName),{description:n,displayName:o,props:c}=t[0],m=`How to use the ${o} component`,p=`Full code for the ${o} component`;return i.createElement(i.Fragment,null,n,i.createElement("br",null),i.createElement("br",null),i.createElement(a.A,null,i.createElement(l.A,{value:"props",label:"Properties"},i.createElement(u,{props:c})),i.createElement(l.A,{value:"example",label:"Example"},e.example&&i.createElement(s.A,{title:m,className:"language-tsx test"},e.example)),i.createElement(l.A,{value:"code",label:"Source Code"},e.codeString&&i.createElement(s.A,{title:p,className:"language-tsx"},e.codeString)),i.createElement(l.A,{value:"accessibility",label:"Accessibility"},i.createElement("pre",{className:"preText"},e.accessibilityInfo))))}},28057:(e,t,n)=>{n.d(t,{d:()=>s});var i=n(2736);const s=e=>(0,i.Ay)()["docusaurus-plugin-react-docgen-typescript"].default.filter((t=>t.displayName===e))},8986:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>o,default:()=>h,exampleString:()=>p,frontMatter:()=>r,metadata:()=>u,toc:()=>m});var i=n(58168),s=(n(96540),n(15680));n(41873),n(54610);const a="import React, { FC } from 'react'\nimport { useTranslation } from 'react-i18next'\nimport { Pressable, PressableProps } from 'react-native'\n\nimport { Box, TextView } from 'components/index'\nimport { NAMESPACE } from 'constants/namespaces'\nimport { useRouteNavigation, useTheme } from 'utils/hooks'\n\n/**\n * Crisis Line Button component\n */\nconst CrisisLineButton: FC = () => {\n  const theme = useTheme()\n  const { t } = useTranslation(NAMESPACE.COMMON)\n  const navigateTo = useRouteNavigation()\n\n  const pressableProps: PressableProps = {\n    accessible: true,\n    accessibilityRole: 'link',\n    onPress: () => navigateTo('VeteransCrisisLine'),\n    style: ({ pressed }) => [\n      {\n        backgroundColor: pressed\n          ? theme.colors.buttonBackground.crisisLineActive\n          : theme.colors.buttonBackground.crisisLine,\n        alignItems: 'center',\n        justifyContent: 'center',\n        minHeight: theme.dimensions.touchableMinHeight,\n        borderRadius: 40,\n      },\n    ],\n  }\n\n  return (\n    <Box mx={theme.dimensions.gutter} my={theme.dimensions.standardMarginBetween}>\n      <Pressable {...pressableProps}>\n        <TextView variant={'CrisisLineButton'} py={14}>\n          {t('crisisLineButton.label')}\n        </TextView>\n      </Pressable>\n    </Box>\n  )\n}\n\nexport default CrisisLineButton\n";var l=n(7644);const r={title:"Crisis Line button"},o=void 0,u={unversionedId:"Flagship design library/Components/Buttons and Links/CrisisLineButton",id:"Flagship design library/Components/Buttons and Links/CrisisLineButton",title:"Crisis Line button",description:"The Crisis Line button provides users quick access to crisis care.",source:"@site/docs/Flagship design library/Components/Buttons and Links/CrisisLineButton.mdx",sourceDirName:"Flagship design library/Components/Buttons and Links",slug:"/Flagship design library/Components/Buttons and Links/CrisisLineButton",permalink:"/va-mobile-app/docs/Flagship design library/Components/Buttons and Links/CrisisLineButton",draft:!1,tags:[],version:"current",frontMatter:{title:"Crisis Line button"},sidebar:"tutorialSidebar",previous:{title:"BackButton",permalink:"/va-mobile-app/docs/Flagship design library/Components/Buttons and Links/BackButton"},next:{title:"Menus",permalink:"/va-mobile-app/docs/Flagship design library/Components/Buttons and Links/Menus"}},c={},m=[{value:"Usage",id:"usage",level:2},{value:"When to use Crisis Line button",id:"when-to-use-crisis-line-button",level:3},{value:"Behavior",id:"behavior",level:3},{value:"Placement",id:"placement",level:3},{value:"Code usage",id:"code-usage",level:2}],p=" <CrisisLineButton />",d={toc:m,exampleString:p},g="wrapper";function h(e){let{components:t,...n}=e;return(0,s.yg)(g,(0,i.A)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,s.yg)("p",null,"The Crisis Line button provides users quick access to crisis care."),(0,s.yg)("h2",{id:"usage"},"Usage"),(0,s.yg)("h3",{id:"when-to-use-crisis-line-button"},"When to use Crisis Line button"),(0,s.yg)("ul",null,(0,s.yg)("li",{parentName:"ul"},"Crisis Line button button currently displays on the following screens:",(0,s.yg)("ul",{parentName:"li"},(0,s.yg)("li",{parentName:"ul"},"Login"),(0,s.yg)("li",{parentName:"ul"},"Home"),(0,s.yg)("li",{parentName:"ul"},"Contact VA"),(0,s.yg)("li",{parentName:"ul"},"Category screens, including Benefits, Health, and Payments"))),(0,s.yg)("li",{parentName:"ul"},"We don't include it on all screens to prevent banner fatigue / semantic satiation."),(0,s.yg)("li",{parentName:"ul"},"It should be considered on screens where there is a likelihood the Veteran is there because they're in crisis."),(0,s.yg)("li",{parentName:"ul"},"If the button is the only number on the page, it's possible it will be used as a general call center line.")),(0,s.yg)("h3",{id:"behavior"},"Behavior"),(0,s.yg)("ul",null,(0,s.yg)("li",{parentName:"ul"},"When the component is tapped, it opens a full panel with more information.")),(0,s.yg)("h3",{id:"placement"},"Placement"),(0,s.yg)("ul",null,(0,s.yg)("li",{parentName:"ul"},"Component should appear near the top of the screen, directly below the top navigation bar.")),(0,s.yg)("h2",{id:"code-usage"},"Code usage"),(0,s.yg)(l.A,{componentName:"CrisisLineButton",example:p,codeString:a,mdxType:"ComponentTopInfo"}))}h.isMDXComponent=!0}}]);