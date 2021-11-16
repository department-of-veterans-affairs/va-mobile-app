"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[4004],{1750:function(e,n,t){t.r(n),t.d(n,{contentTitle:function(){return a},default:function(){return l},exampleString:function(){return d},frontMatter:function(){return c},metadata:function(){return p},toc:function(){return m}});var o=t(7462),i=t(3366),r=(t(7294),t(3905)),s=(t(9055),t(8909)),x=["components"],c={},a=void 0,p={unversionedId:"FrontEnd/ComponentsSection/TextLines",id:"FrontEnd/ComponentsSection/TextLines",isDocsHomePage:!1,title:"TextLines",description:"",source:"@site/docs/FrontEnd/ComponentsSection/TextLines.mdx",sourceDirName:"FrontEnd/ComponentsSection",slug:"/FrontEnd/ComponentsSection/TextLines",permalink:"/docs/FrontEnd/ComponentsSection/TextLines",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"TextLineWithIcon",permalink:"/docs/FrontEnd/ComponentsSection/TextLineWithIcon"},next:{title:"TextView",permalink:"/docs/FrontEnd/ComponentsSection/TextView"}},m=[],d="<TextLines listOfText={[{ text: 'my text', isBold: true}]} />",T={toc:m,exampleString:d};function l(e){var n=e.components,t=(0,i.Z)(e,x);return(0,r.kt)("wrapper",(0,o.Z)({},T,t,{components:n,mdxType:"MDXLayout"}),(0,r.kt)(s.Z,{componentName:"TextLines",example:d,codeString:"import React, { FC } from 'react'\n\nimport { TextLine } from './types'\nimport Box from './Box'\nimport MessagesSentReadTag from './MessagesSentReadTag'\nimport TextLineWithIcon, { TextLineWithIconProps } from './TextLineWithIcon'\nimport TextView from './TextView'\n\ntype TextLinesProps = {\n  /** List of text for the button */\n  listOfText?: Array<TextLine | TextLineWithIconProps>\n}\n\n/**Component to render individual lines of text. Each text line will wrap as needed and subsequent lines will be on the next line*/\nexport const TextLines: FC<TextLinesProps> = ({ listOfText }) => {\n  return (\n    <Box flex={1}>\n      <Box flexDirection=\"column\">\n        {listOfText?.map((textObj: TextLine | TextLineWithIconProps, index: number) => {\n          if ('iconProps' in textObj && textObj.iconProps !== undefined) {\n            return <TextLineWithIcon key={index} {...textObj} />\n          } else {\n            const { text, variant = 'MobileBody', color = 'primary', textAlign = 'left', isTextTag = false } = textObj\n            if (isTextTag) {\n              return <MessagesSentReadTag text={text} key={index} />\n            }\n            return (\n              <TextView variant={variant} textAlign={textAlign} color={color} key={index}>\n                {text}\n              </TextView>\n            )\n          }\n        })}\n      </Box>\n    </Box>\n  )\n}\n",mdxType:"ComponentTopInfo"}))}l.isMDXComponent=!0}}]);