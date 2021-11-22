"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[688],{9478:function(t,e,n){n.r(e),n.d(e,{contentTitle:function(){return m},default:function(){return f},exampleString:function(){return c},frontMatter:function(){return l},metadata:function(){return p},toc:function(){return u}});var o=n(7462),i=n(3366),s=(n(7294),n(3905)),r=(n(9055),n(8909)),a=["components"],l={},m=void 0,p={unversionedId:"FrontEnd/ComponentsSection/DefaultList",id:"FrontEnd/ComponentsSection/DefaultList",isDocsHomePage:!1,title:"DefaultList",description:"export const exampleString =`const exampleList: Array =",source:"@site/docs/FrontEnd/ComponentsSection/DefaultList.mdx",sourceDirName:"FrontEnd/ComponentsSection",slug:"/FrontEnd/ComponentsSection/DefaultList",permalink:"/va-mobile-app/docs/FrontEnd/ComponentsSection/DefaultList",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"CtaButton",permalink:"/va-mobile-app/docs/FrontEnd/ComponentsSection/CtaButton"},next:{title:"FocusedNavHeaderText",permalink:"/va-mobile-app/docs/FrontEnd/ComponentsSection/FocusedNavHeaderText"}},u=[],c="const exampleList: Array<DefaultListItemObj> = \n[\n    {\n        textLines: [{ text: 'line 1 on the first button' }, { text: 'line 2 on the first button' }],\n        a11yHintText: 'press this button to do something',\n        onPress: () => { console.log('button 1 pressed') },\n        testId: 'line-1-on-the-button',\n    },\n    {\n        textLines: [{ text: 'line 1 on the second button' }, { text: 'line 2 on the second button' }],\n        a11yHintText: 'press this button to do something',\n        onPress: () => { console.log('button 2 pressed') },\n        testId: 'line-1-on-the-second-button',\n    },\n]\n\n<DefaultList items={exampleList} />",d={toc:u,exampleString:c};function f(t){var e=t.components,n=(0,i.Z)(t,a);return(0,s.kt)("wrapper",(0,o.Z)({},d,n,{components:e,mdxType:"MDXLayout"}),(0,s.kt)(r.Z,{componentName:"DefaultList",example:c,codeString:"import React, { FC } from 'react'\n\nimport { List, ListItemObj, ListProps } from './index'\nimport { TextLine } from './types'\nimport { TextLines } from './TextLines'\nimport { generateTestIDForTextList } from 'utils/common'\n\n/**\n * Signifies each item in the list of items in {@link DefaultListProps}\n */\nexport type DefaultListItemObj = {\n  /** lines of text to display */\n  textLines: Array<TextLine>\n} & Partial<ListItemObj>\n\n/**\n * Props for {@link DefaultList}\n */\nexport type DefaultListProps = {\n  /** list of items of which a button will be rendered per item */\n  items: Array<DefaultListItemObj>\n} & Partial<ListProps>\n\n/**\n *Component to show a list composed of lines of display text built using TextLines\n */\nconst DefaultList: FC<DefaultListProps> = ({ items, title, titleA11yLabel }) => {\n  const listItemObjs: Array<ListItemObj> = items.map((item) => {\n    // Move all of the properties except text lines to the standard list item object\n    const { textLines, testId, ...listItemObj } = { ...item }\n    const testIdToUse = testId ? testId : generateTestIDForTextList(textLines)\n\n    const content = <TextLines listOfText={textLines} />\n\n    return { ...listItemObj, content, testId: testIdToUse }\n  })\n\n  return <List items={listItemObjs} title={title} titleA11yLabel={titleA11yLabel} />\n}\n\nexport default DefaultList\n",mdxType:"ComponentTopInfo"}))}f.isMDXComponent=!0}}]);