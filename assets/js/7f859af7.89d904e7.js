"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[3646],{38909:function(e,t,n){n.d(t,{Z:function(){return m}});var o=n(67294),i=n(19055),l=n(26396),s=n(58215),r=n(82224),a=n(36005),c=function(e){var t=e.props;return t?o.createElement(o.Fragment,null,a.ZP.isEmpty(t)?o.createElement("pre",{className:"preText"},"This component does not have props defined"):o.createElement("table",null,o.createElement("thead",null,o.createElement("tr",null,o.createElement("th",null,"Name"),o.createElement("th",null,"Type"),o.createElement("th",null,"Default Value"),o.createElement("th",null,"Required"),o.createElement("th",null,"Description"))),o.createElement("tbody",null,Object.keys(t).map((function(e){var n;return o.createElement("tr",{key:e},o.createElement("td",null,o.createElement("code",null,e)),o.createElement("td",{style:{minWidth:200}},null==(n=t[e].type)?void 0:n.name),o.createElement("td",null,t[e].defaultValue&&t[e].defaultValue.value.toString()),o.createElement("td",null,t[e].required?"Yes":"No"),o.createElement("td",null,t[e].description))}))))):null};function m(e){var t=(0,r.N)(e.componentName)[0],n=t.description,a=t.displayName,m=t.props,u="How to use the "+a+" component",p="Full code for the "+a+" component";return o.createElement(o.Fragment,null,n,o.createElement("br",null),o.createElement("br",null),o.createElement(l.Z,null,o.createElement(s.Z,{value:"props",label:"Properties"},o.createElement(c,{props:m})),o.createElement(s.Z,{value:"example",label:"Example"},e.example&&o.createElement(i.Z,{title:u,className:"language-tsx test"},e.example)),o.createElement(s.Z,{value:"code",label:"Source Code"},e.codeString&&o.createElement(i.Z,{title:p,className:"language-tsx"},e.codeString)),o.createElement(s.Z,{value:"accessibility",label:"Accessibility"},o.createElement("pre",{className:"preText"},e.accessibilityInfo))))}},31909:function(e,t,n){n.r(t),n.d(t,{contentTitle:function(){return c},default:function(){return f},exampleString:function(){return p},frontMatter:function(){return a},metadata:function(){return m},toc:function(){return u}});var o=n(87462),i=n(63366),l=(n(67294),n(3905)),s=(n(19055),n(38909)),r=["components"],a={},c=void 0,m={unversionedId:"Engineering/FrontEnd/ComponentsSection/DefaultList",id:"Engineering/FrontEnd/ComponentsSection/DefaultList",title:"DefaultList",description:"export const exampleString =`const exampleList: Array =",source:"@site/docs/Engineering/FrontEnd/ComponentsSection/DefaultList.mdx",sourceDirName:"Engineering/FrontEnd/ComponentsSection",slug:"/Engineering/FrontEnd/ComponentsSection/DefaultList",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/ComponentsSection/DefaultList",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"CtaButton",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/ComponentsSection/CtaButton"},next:{title:"FocusedNavHeaderText",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/ComponentsSection/FocusedNavHeaderText"}},u=[],p="const exampleList: Array<DefaultListItemObj> = \n[\n    {\n        textLines: [{ text: 'line 1 on the first button' }, { text: 'line 2 on the first button' }],\n        a11yHintText: 'press this button to do something',\n        onPress: () => { console.log('button 1 pressed') },\n        testId: 'line-1-on-the-button',\n    },\n    {\n        textLines: [{ text: 'line 1 on the second button' }, { text: 'line 2 on the second button' }],\n        a11yHintText: 'press this button to do something',\n        onPress: () => { console.log('button 2 pressed') },\n        testId: 'line-1-on-the-second-button',\n    },\n]\n\n<DefaultList items={exampleList} />",d={toc:u,exampleString:p};function f(e){var t=e.components,n=(0,i.Z)(e,r);return(0,l.kt)("wrapper",(0,o.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,l.kt)(s.Z,{componentName:"DefaultList",example:p,codeString:"import React, { FC } from 'react'\n\nimport { List, ListItemObj, ListProps } from './index'\nimport { TextLine } from './types'\nimport { TextLines } from './TextLines'\nimport { generateTestIDForTextList } from 'utils/common'\n\n/**\n * Signifies each item in the list of items in {@link DefaultListProps}\n */\nexport type DefaultListItemObj = {\n  /** lines of text to display */\n  textLines: Array<TextLine>\n} & Partial<ListItemObj>\n\n/**\n * Props for {@link DefaultList}\n */\nexport type DefaultListProps = {\n  /** list of items of which a button will be rendered per item */\n  items: Array<DefaultListItemObj>\n  /** if true the text will be selectable */\n  selectable?: boolean\n} & Partial<ListProps>\n\n/**\n *Component to show a list composed of lines of display text built using TextLines\n */\nconst DefaultList: FC<DefaultListProps> = ({ items, title, titleA11yLabel, selectable }) => {\n  const listItemObjs: Array<ListItemObj> = items.map((item) => {\n    // Move all of the properties except text lines to the standard list item object\n    const { textLines, testId, ...listItemObj } = { ...item }\n    const testIdToUse = testId ? testId : generateTestIDForTextList(textLines)\n\n    const content = <TextLines listOfText={textLines} selectable={selectable} />\n\n    return { ...listItemObj, content, testId: testIdToUse }\n  })\n\n  return <List items={listItemObjs} title={title} titleA11yLabel={titleA11yLabel} />\n}\n\nexport default DefaultList\n",mdxType:"ComponentTopInfo"}))}f.isMDXComponent=!0}}]);