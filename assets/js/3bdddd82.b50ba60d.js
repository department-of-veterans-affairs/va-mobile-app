"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[5050],{7644:(e,t,n)=>{n.d(t,{A:()=>c});var s=n(96540),i=n(54610),l=n(3384),a=n(31347),o=n(28057),r=n(84476);const m=e=>{let{props:t}=e;return t?s.createElement(s.Fragment,null,r.Ay.isEmpty(t)?s.createElement("pre",{className:"preText"},"This component does not have props defined"):s.createElement("table",null,s.createElement("thead",null,s.createElement("tr",null,s.createElement("th",null,"Name"),s.createElement("th",null,"Type"),s.createElement("th",null,"Default Value"),s.createElement("th",null,"Required"),s.createElement("th",null,"Description"))),s.createElement("tbody",null,Object.keys(t).map((e=>s.createElement("tr",{key:e},s.createElement("td",null,s.createElement("code",null,e)),s.createElement("td",{style:{minWidth:200}},t[e].type?.name),s.createElement("td",null,t[e].defaultValue&&t[e].defaultValue.value.toString()),s.createElement("td",null,t[e].required?"Yes":"No"),s.createElement("td",null,t[e].description))))))):null};function c(e){const t=(0,o.d)(e.componentName),{description:n,displayName:r,props:c}=t[0],p=`How to use the ${r} component`,u=`Full code for the ${r} component`;return s.createElement(s.Fragment,null,n,s.createElement("br",null),s.createElement("br",null),s.createElement(l.A,null,s.createElement(a.A,{value:"props",label:"Properties"},s.createElement(m,{props:c})),s.createElement(a.A,{value:"example",label:"Example"},e.example&&s.createElement(i.A,{title:p,className:"language-tsx test"},e.example)),s.createElement(a.A,{value:"code",label:"Source Code"},e.codeString&&s.createElement(i.A,{title:u,className:"language-tsx"},e.codeString)),s.createElement(a.A,{value:"accessibility",label:"Accessibility"},s.createElement("pre",{className:"preText"},e.accessibilityInfo))))}},28057:(e,t,n)=>{n.d(t,{d:()=>i});var s=n(2736);const i=e=>(0,s.Ay)()["docusaurus-plugin-react-docgen-typescript"].default.filter((t=>t.displayName===e))},71902:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>r,default:()=>b,exampleString:()=>u,frontMatter:()=>o,metadata:()=>m,toc:()=>p});var s=n(58168),i=(n(96540),n(15680));n(41873),n(54610);const l="import React, { FC } from 'react'\n\nimport { generateTestIDForTextList } from 'utils/common'\n\nimport { TextLines } from './TextLines'\nimport { List, ListItemObj, ListProps } from './index'\nimport { TextLine } from './types'\n\n/**\n * Signifies each item in the list of items in {@link DefaultListProps}\n */\nexport type DefaultListItemObj = {\n  /** lines of text to display */\n  textLines: Array<TextLine>\n} & Partial<ListItemObj>\n\n/**\n * Props for {@link DefaultList}\n */\nexport type DefaultListProps = {\n  /** list of items of which a button will be rendered per item */\n  items: Array<DefaultListItemObj>\n  /** if true the text will be selectable */\n  selectable?: boolean\n} & Partial<ListProps>\n\n/**\n *Component to show a list composed of lines of display text built using TextLines\n */\nconst DefaultList: FC<DefaultListProps> = ({ items, title, titleA11yLabel, selectable }) => {\n  const listItemObjs: Array<ListItemObj> = items.map((item) => {\n    // Move all of the properties except text lines to the standard list item object\n    const { textLines, testId, ...listItemObj } = { ...item }\n    const testIdToUse = testId ? testId : generateTestIDForTextList(textLines)\n\n    const content = <TextLines listOfText={textLines} selectable={selectable} />\n\n    return { ...listItemObj, content, testId: testIdToUse }\n  })\n\n  return <List items={listItemObjs} title={title} titleA11yLabel={titleA11yLabel} />\n}\n\nexport default DefaultList\n";var a=n(7644);const o={},r=void 0,m={unversionedId:"Flagship design library/Components/Layout and Organization/List/DefaultList",id:"Flagship design library/Components/Layout and Organization/List/DefaultList",title:"DefaultList",description:"",source:"@site/docs/Flagship design library/Components/Layout and Organization/List/DefaultList.mdx",sourceDirName:"Flagship design library/Components/Layout and Organization/List",slug:"/Flagship design library/Components/Layout and Organization/List/DefaultList",permalink:"/va-mobile-app/docs/Flagship design library/Components/Layout and Organization/List/DefaultList",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"BaseListItem",permalink:"/va-mobile-app/docs/Flagship design library/Components/Layout and Organization/List/BaseListItem"},next:{title:"List header",permalink:"/va-mobile-app/docs/Flagship design library/Components/Layout and Organization/List/ListHeader"}},c={},p=[],u="const exampleList: Array<DefaultListItemObj> = \n[\n    {\n        textLines: [{ text: 'line 1 on the first button' }, { text: 'line 2 on the first button' }],\n        a11yHintText: 'press this button to do something',\n        onPress: () => { console.log('button 1 pressed') },\n        testId: 'line-1-on-the-button',\n    },\n    {\n        textLines: [{ text: 'line 1 on the second button' }, { text: 'line 2 on the second button' }],\n        a11yHintText: 'press this button to do something',\n        onPress: () => { console.log('button 2 pressed') },\n        testId: 'line-1-on-the-second-button',\n    },\n]\n\n<DefaultList items={exampleList} />",d={toc:p,exampleString:u},L="wrapper";function b(e){let{components:t,...n}=e;return(0,i.yg)(L,(0,s.A)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,i.yg)(a.A,{componentName:"DefaultList",example:u,codeString:l,mdxType:"ComponentTopInfo"}))}b.isMDXComponent=!0}}]);