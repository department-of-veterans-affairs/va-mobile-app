"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[9321],{2414:function(t,e,n){n.r(e),n.d(e,{contentTitle:function(){return l},default:function(){return L},exampleString:function(){return d},frontMatter:function(){return p},metadata:function(){return c},toc:function(){return a}});var i=n(7462),o=n(3366),s=(n(7294),n(3905)),r=(n(9055),n(8909)),m=["components"],p={},l=void 0,c={unversionedId:"FrontEnd/ComponentsSection/SimpleList",id:"FrontEnd/ComponentsSection/SimpleList",isDocsHomePage:!1,title:"SimpleList",description:"export const exampleString = `const exampleList: Array =",source:"@site/docs/FrontEnd/ComponentsSection/SimpleList.mdx",sourceDirName:"FrontEnd/ComponentsSection",slug:"/FrontEnd/ComponentsSection/SimpleList",permalink:"/docs/FrontEnd/ComponentsSection/SimpleList",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"SignoutButton",permalink:"/docs/FrontEnd/ComponentsSection/SignoutButton"},next:{title:"Switch",permalink:"/docs/FrontEnd/ComponentsSection/Switch"}},a=[],d="const exampleList: Array<SimpleListItemObj> = \n[\n    {\n      text: 'the button',\n      a11yHintText: 'press this button to do something',\n      onPress: () => { console.log('button 1 pressed') },\n      testId: 'line-1-on-the-button',\n    },\n    {\n      text: 'the second button',\n      a11yHintText: 'press this button to do something',\n      onPress: () => { console.log('button 2 pressed') },\n      testId: 'line-1-on-the-second-button',\n    },\n]\n\n<SimpleList items={exampleList} />",u={toc:a,exampleString:d};function L(t){var e=t.components,n=(0,o.Z)(t,m);return(0,s.kt)("wrapper",(0,i.Z)({},u,n,{components:e,mdxType:"MDXLayout"}),(0,s.kt)(r.Z,{componentName:"SimpleList",example:d,codeString:"import React, { FC } from 'react'\n\nimport { List, ListItemObj, ListProps } from './index'\nimport { TextLine } from './types'\nimport { TextLines } from './TextLines'\nimport { generateTestIDForTextList } from 'utils/common'\n\n/**\n * Signifies each item in the list of items in {@link SimpleListProps}\n */\nexport type SimpleListItemObj = {\n  /** lines of text to display */\n  text: string\n} & Partial<ListItemObj>\n\n/**\n * Props for {@link SimpleList}\n */\nexport type SimpleListProps = {\n  items: Array<SimpleListItemObj>\n} & Partial<ListProps>\n\n/**Component to show a list with one line of text per item*/\nconst SimpleList: FC<SimpleListProps> = ({ items, title, titleA11yLabel }) => {\n  const listItemObjs: Array<ListItemObj> = items.map((item: SimpleListItemObj) => {\n    // Move all of the properties except text lines to the standard list item object\n    const { text, testId, ...listItemObj } = { ...item }\n\n    const textLine: Array<TextLine> = [{ text } as TextLine]\n\n    const testIdToUse = testId ? testId : generateTestIDForTextList(textLine)\n    const content = <TextLines listOfText={textLine} />\n\n    return { ...listItemObj, content, testId: testIdToUse }\n  })\n\n  return <List items={listItemObjs} title={title} titleA11yLabel={titleA11yLabel} />\n}\n\nexport default SimpleList\n",mdxType:"ComponentTopInfo"}))}L.isMDXComponent=!0}}]);