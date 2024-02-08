"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[6811],{32666:(e,t,n)=>{n.d(t,{Z:()=>p});var i=n(67294),l=n(97405),s=n(22808),a=n(30433),o=n(41284),r=n(36005);const m=e=>{let{props:t}=e;return t?i.createElement(i.Fragment,null,r.ZP.isEmpty(t)?i.createElement("pre",{className:"preText"},"This component does not have props defined"):i.createElement("table",null,i.createElement("thead",null,i.createElement("tr",null,i.createElement("th",null,"Name"),i.createElement("th",null,"Type"),i.createElement("th",null,"Default Value"),i.createElement("th",null,"Required"),i.createElement("th",null,"Description"))),i.createElement("tbody",null,Object.keys(t).map((e=>i.createElement("tr",{key:e},i.createElement("td",null,i.createElement("code",null,e)),i.createElement("td",{style:{minWidth:200}},t[e].type?.name),i.createElement("td",null,t[e].defaultValue&&t[e].defaultValue.value.toString()),i.createElement("td",null,t[e].required?"Yes":"No"),i.createElement("td",null,t[e].description))))))):null};function p(e){const t=(0,o.N)(e.componentName),{description:n,displayName:r,props:p}=t[0],c=`How to use the ${r} component`,d=`Full code for the ${r} component`;return i.createElement(i.Fragment,null,n,i.createElement("br",null),i.createElement("br",null),i.createElement(s.Z,null,i.createElement(a.Z,{value:"props",label:"Properties"},i.createElement(m,{props:p})),i.createElement(a.Z,{value:"example",label:"Example"},e.example&&i.createElement(l.Z,{title:c,className:"language-tsx test"},e.example)),i.createElement(a.Z,{value:"code",label:"Source Code"},e.codeString&&i.createElement(l.Z,{title:d,className:"language-tsx"},e.codeString)),i.createElement(a.Z,{value:"accessibility",label:"Accessibility"},i.createElement("pre",{className:"preText"},e.accessibilityInfo))))}},41284:(e,t,n)=>{n.d(t,{N:()=>l});var i=n(52426);const l=e=>(0,i.ZP)()["docusaurus-plugin-react-docgen-typescript"].default.filter((t=>t.displayName===e))},96374:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>r,default:()=>b,exampleString:()=>d,frontMatter:()=>o,metadata:()=>m,toc:()=>c});var i=n(87462),l=(n(67294),n(3905));n(8209),n(97405);const s="import React, { FC } from 'react'\n\nimport { generateTestIDForTextList } from 'utils/common'\n\nimport { TextLines } from './TextLines'\nimport { List, ListItemObj, ListProps } from './index'\nimport { TextLine } from './types'\n\n/**\n * Signifies each item in the list of items in {@link SimpleListProps}\n */\nexport type SimpleListItemObj = {\n  /** lines of text to display */\n  text: string\n} & Partial<ListItemObj>\n\n/**\n * Props for {@link SimpleList}\n */\nexport type SimpleListProps = {\n  items: Array<SimpleListItemObj>\n} & Partial<ListProps>\n\n/**Component to show a list with one line of text per item*/\nconst SimpleList: FC<SimpleListProps> = ({ items, title, titleA11yLabel }) => {\n  const listItemObjs: Array<ListItemObj> = items.map((item: SimpleListItemObj) => {\n    // Move all of the properties except text lines to the standard list item object\n    const { text, testId, ...listItemObj } = { ...item }\n\n    const textLine: Array<TextLine> = [{ text } as TextLine]\n\n    const testIdToUse = testId ? testId : generateTestIDForTextList(textLine)\n    const content = <TextLines listOfText={textLine} />\n\n    return { ...listItemObj, content, testId: testIdToUse }\n  })\n\n  return <List items={listItemObjs} title={title} titleA11yLabel={titleA11yLabel} />\n}\n\nexport default SimpleList\n";var a=n(32666);const o={},r=void 0,m={unversionedId:"Flagship design library/Components/Layout and Organization/List/SimpleList",id:"Flagship design library/Components/Layout and Organization/List/SimpleList",title:"SimpleList",description:"",source:"@site/docs/Flagship design library/Components/Layout and Organization/List/SimpleList.mdx",sourceDirName:"Flagship design library/Components/Layout and Organization/List",slug:"/Flagship design library/Components/Layout and Organization/List/SimpleList",permalink:"/va-mobile-app/docs/Flagship design library/Components/Layout and Organization/List/SimpleList",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"SelectionList",permalink:"/va-mobile-app/docs/Flagship design library/Components/Layout and Organization/List/SelectionList"},next:{title:"Multi-touch card",permalink:"/va-mobile-app/docs/Flagship design library/Components/Layout and Organization/MultiTouchCard"}},p={},c=[],d="const exampleList: Array<SimpleListItemObj> = \n[\n    {\n      text: 'the button',\n      a11yHintText: 'press this button to do something',\n      onPress: () => { console.log('button 1 pressed') },\n      testId: 'line-1-on-the-button',\n    },\n    {\n      text: 'the second button',\n      a11yHintText: 'press this button to do something',\n      onPress: () => { console.log('button 2 pressed') },\n      testId: 'line-1-on-the-second-button',\n    },\n]\n\n<SimpleList items={exampleList} />",u={toc:c,exampleString:d},L="wrapper";function b(e){let{components:t,...n}=e;return(0,l.kt)(L,(0,i.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,l.kt)(a.Z,{componentName:"SimpleList",example:d,codeString:s,mdxType:"ComponentTopInfo"}))}b.isMDXComponent=!0}}]);