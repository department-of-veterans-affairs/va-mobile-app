"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[5536],{32666:(e,t,n)=>{n.d(t,{Z:()=>m});var a=n(67294),l=n(97405),i=n(22808),r=n(30433),s=n(41284),o=n(36005);const c=e=>{let{props:t}=e;return t?a.createElement(a.Fragment,null,o.ZP.isEmpty(t)?a.createElement("pre",{className:"preText"},"This component does not have props defined"):a.createElement("table",null,a.createElement("thead",null,a.createElement("tr",null,a.createElement("th",null,"Name"),a.createElement("th",null,"Type"),a.createElement("th",null,"Default Value"),a.createElement("th",null,"Required"),a.createElement("th",null,"Description"))),a.createElement("tbody",null,Object.keys(t).map((e=>a.createElement("tr",{key:e},a.createElement("td",null,a.createElement("code",null,e)),a.createElement("td",{style:{minWidth:200}},t[e].type?.name),a.createElement("td",null,t[e].defaultValue&&t[e].defaultValue.value.toString()),a.createElement("td",null,t[e].required?"Yes":"No"),a.createElement("td",null,t[e].description))))))):null};function m(e){const t=(0,s.N)(e.componentName),{description:n,displayName:o,props:m}=t[0],d=`How to use the ${o} component`,p=`Full code for the ${o} component`;return a.createElement(a.Fragment,null,n,a.createElement("br",null),a.createElement("br",null),a.createElement(i.Z,null,a.createElement(r.Z,{value:"props",label:"Properties"},a.createElement(c,{props:m})),a.createElement(r.Z,{value:"example",label:"Example"},e.example&&a.createElement(l.Z,{title:d,className:"language-tsx test"},e.example)),a.createElement(r.Z,{value:"code",label:"Source Code"},e.codeString&&a.createElement(l.Z,{title:p,className:"language-tsx"},e.codeString)),a.createElement(r.Z,{value:"accessibility",label:"Accessibility"},a.createElement("pre",{className:"preText"},e.accessibilityInfo))))}},41284:(e,t,n)=>{n.d(t,{N:()=>l});var a=n(52426);const l=e=>(0,a.ZP)()["docusaurus-plugin-react-docgen-typescript"].default.filter((t=>t.displayName===e))},38046:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>m,contentTitle:()=>o,default:()=>b,exampleString:()=>p,frontMatter:()=>s,metadata:()=>c,toc:()=>d});var a=n(87462),l=(n(67294),n(3905));n(8209),n(97405);const i="import React, { FC, Ref } from 'react'\nimport { StyleSheet, View } from 'react-native'\n\nimport { TextView } from 'components'\nimport { useTheme } from 'utils/hooks'\n\nexport type HeaderTitleProps = {\n  /** ref for this component*/\n  focusRef?: Ref<View>\n  /**sets the header title*/\n  headerTitle?: string\n  /** sets if it is accessible*/\n  accessible?: boolean\n  /** sets the test id*/\n  testID?: string\n  /**sets the accessibility label*/\n  accessabilityLabel?: string\n}\n\n/**Common component used for the navigation header title*/\nconst HeaderTitle: FC<HeaderTitleProps> = ({\n  focusRef,\n  headerTitle,\n  testID,\n  accessabilityLabel,\n  accessible = true,\n}) => {\n  const {\n    dimensions: { headerHeight },\n  } = useTheme()\n\n  const combinestyle = StyleSheet.flatten([{ height: headerHeight }, defaultStyle.headerText])\n  return (\n    <View\n      ref={focusRef}\n      accessibilityRole=\"header\"\n      accessible={accessible}\n      style={combinestyle}\n      testID={testID}\n      accessibilityLabel={accessabilityLabel}>\n      <TextView accessible={false} importantForAccessibility={'no'} color={'primaryContrast'} allowFontScaling={false}>\n        {headerTitle}\n      </TextView>\n    </View>\n  )\n}\n\nconst defaultStyle = StyleSheet.create({\n  headerText: {\n    alignItems: 'center',\n    display: 'flex',\n    flexDirection: 'row',\n  },\n})\nexport default HeaderTitle\n";var r=n(32666);const s={},o=void 0,c={unversionedId:"Flagship design library/Components/Navigation/Primary/HeaderTitle",id:"Flagship design library/Components/Navigation/Primary/HeaderTitle",title:"HeaderTitle",description:"",source:"@site/docs/Flagship design library/Components/Navigation/Primary/HeaderTitle.mdx",sourceDirName:"Flagship design library/Components/Navigation/Primary",slug:"/Flagship design library/Components/Navigation/Primary/HeaderTitle",permalink:"/va-mobile-app/docs/Flagship design library/Components/Navigation/Primary/HeaderTitle",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Primary navigation",permalink:"/va-mobile-app/docs/Flagship design library/Components/Navigation/Primary/"},next:{title:"NavigationTabBar",permalink:"/va-mobile-app/docs/Flagship design library/Components/Navigation/Primary/NavigationTabBar"}},m={},d=[],p="useEffect(() => {\n    navigation.setOptions({\n      // using react-navigation internal HeaderTitle component to easily maintain font and styling while being able to add an accessibilityLabel\n      headerTitle: (header) => <HeaderTitle {...testIdProps('contactVA.title.a11yLabel')} headerTitle={header.children} />,\n    })\n})",u={toc:d,exampleString:p},g="wrapper";function b(e){let{components:t,...n}=e;return(0,l.kt)(g,(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,l.kt)(r.Z,{componentName:"HeaderTitle",example:p,codeString:i,mdxType:"ComponentTopInfo"}))}b.isMDXComponent=!0}}]);