"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[2369],{38909:function(e,t,n){n.d(t,{Z:function(){return c}});var i=n(67294),o=n(19055),l=n(26396),s=n(58215),a=n(82224),r=n(36005),u=function(e){var t=e.props;return t?i.createElement(i.Fragment,null,r.ZP.isEmpty(t)?i.createElement("pre",{className:"preText"},"This component does not have props defined"):i.createElement("table",null,i.createElement("thead",null,i.createElement("tr",null,i.createElement("th",null,"Name"),i.createElement("th",null,"Type"),i.createElement("th",null,"Default Value"),i.createElement("th",null,"Required"),i.createElement("th",null,"Description"))),i.createElement("tbody",null,Object.keys(t).map((function(e){var n;return i.createElement("tr",{key:e},i.createElement("td",null,i.createElement("code",null,e)),i.createElement("td",{style:{minWidth:200}},null==(n=t[e].type)?void 0:n.name),i.createElement("td",null,t[e].defaultValue&&t[e].defaultValue.value.toString()),i.createElement("td",null,t[e].required?"Yes":"No"),i.createElement("td",null,t[e].description))}))))):null};function c(e){var t=(0,a.N)(e.componentName)[0],n=t.description,r=t.displayName,c=t.props,m="How to use the "+r+" component",p="Full code for the "+r+" component";return i.createElement(i.Fragment,null,n,i.createElement("br",null),i.createElement("br",null),i.createElement(l.Z,null,i.createElement(s.Z,{value:"props",label:"Properties"},i.createElement(u,{props:c})),i.createElement(s.Z,{value:"example",label:"Example"},e.example&&i.createElement(o.Z,{title:m,className:"language-tsx test"},e.example)),i.createElement(s.Z,{value:"code",label:"Source Code"},e.codeString&&i.createElement(o.Z,{title:p,className:"language-tsx"},e.codeString)),i.createElement(s.Z,{value:"accessibility",label:"Accessibility"},i.createElement("pre",{className:"preText"},e.accessibilityInfo))))}},82224:function(e,t,n){n.d(t,{N:function(){return o}});var i=n(28084),o=function(e){return(0,i.default)()["docusaurus-plugin-react-docgen-typescript"].default.filter((function(t){return t.displayName===e}))}},15587:function(e,t,n){n.r(t),n.d(t,{contentTitle:function(){return u},default:function(){return f},exampleString:function(){return p},frontMatter:function(){return r},metadata:function(){return c},toc:function(){return m}});var i=n(87462),o=n(63366),l=(n(67294),n(3905)),s=(n(19055),n(38909)),a=["components"],r={},u=void 0,c={unversionedId:"UX/ComponentsSection/Layout and Organization/List/DefaultList",id:"UX/ComponentsSection/Layout and Organization/List/DefaultList",title:"DefaultList",description:"export const exampleString =`const exampleList: Array =",source:"@site/docs/UX/ComponentsSection/Layout and Organization/List/DefaultList.mdx",sourceDirName:"UX/ComponentsSection/Layout and Organization/List",slug:"/UX/ComponentsSection/Layout and Organization/List/DefaultList",permalink:"/va-mobile-app/docs/UX/ComponentsSection/Layout and Organization/List/DefaultList",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"BaseListItem",permalink:"/va-mobile-app/docs/UX/ComponentsSection/Layout and Organization/List/BaseListItem"},next:{title:"MessageList",permalink:"/va-mobile-app/docs/UX/ComponentsSection/Layout and Organization/List/MessageList"}},m=[],p="const exampleList: Array<DefaultListItemObj> = \n[\n    {\n        textLines: [{ text: 'line 1 on the first button' }, { text: 'line 2 on the first button' }],\n        a11yHintText: 'press this button to do something',\n        onPress: () => { console.log('button 1 pressed') },\n        testId: 'line-1-on-the-button',\n    },\n    {\n        textLines: [{ text: 'line 1 on the second button' }, { text: 'line 2 on the second button' }],\n        a11yHintText: 'press this button to do something',\n        onPress: () => { console.log('button 2 pressed') },\n        testId: 'line-1-on-the-second-button',\n    },\n]\n\n<DefaultList items={exampleList} />",d={toc:m,exampleString:p};function f(e){var t=e.components,n=(0,o.Z)(e,a);return(0,l.kt)("wrapper",(0,i.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,l.kt)(s.Z,{componentName:"DefaultList",example:p,codeString:"import React, { FC } from 'react'\n\nimport { List, ListItemObj, ListProps } from './index'\nimport { TextLine } from './types'\nimport { TextLines } from './TextLines'\nimport { generateTestIDForTextList } from 'utils/common'\n\n/**\n * Signifies each item in the list of items in {@link DefaultListProps}\n */\nexport type DefaultListItemObj = {\n  /** lines of text to display */\n  textLines: Array<TextLine>\n} & Partial<ListItemObj>\n\n/**\n * Props for {@link DefaultList}\n */\nexport type DefaultListProps = {\n  /** list of items of which a button will be rendered per item */\n  items: Array<DefaultListItemObj>\n  /** if true the text will be selectable */\n  selectable?: boolean\n} & Partial<ListProps>\n\n/**\n *Component to show a list composed of lines of display text built using TextLines\n */\nconst DefaultList: FC<DefaultListProps> = ({ items, title, titleA11yLabel, selectable }) => {\n  const listItemObjs: Array<ListItemObj> = items.map((item) => {\n    // Move all of the properties except text lines to the standard list item object\n    const { textLines, testId, ...listItemObj } = { ...item }\n    const testIdToUse = testId ? testId : generateTestIDForTextList(textLines)\n\n    const content = <TextLines listOfText={textLines} selectable={selectable} />\n\n    return { ...listItemObj, content, testId: testIdToUse }\n  })\n\n  return <List items={listItemObjs} title={title} titleA11yLabel={titleA11yLabel} />\n}\n\nexport default DefaultList\n",mdxType:"ComponentTopInfo"}))}f.isMDXComponent=!0}}]);