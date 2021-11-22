"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[5346],{4330:function(e,n,t){t.r(n),t.d(n,{contentTitle:function(){return m},default:function(){return C},exampleString:function(){return c},frontMatter:function(){return u},metadata:function(){return p},toc:function(){return d}});var o=t(7462),s=t(3366),a=(t(7294),t(3905)),r=(t(9055),t(8909)),i=["components"],u={},m=void 0,p={unversionedId:"FrontEnd/ComponentsSection/MessagesCountTag",id:"FrontEnd/ComponentsSection/MessagesCountTag",isDocsHomePage:!1,title:"MessagesCountTag",description:"",source:"@site/docs/FrontEnd/ComponentsSection/MessagesCountTag.mdx",sourceDirName:"FrontEnd/ComponentsSection",slug:"/FrontEnd/ComponentsSection/MessagesCountTag",permalink:"/va-mobile-app/docs/FrontEnd/ComponentsSection/MessagesCountTag",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"MessageList",permalink:"/va-mobile-app/docs/FrontEnd/ComponentsSection/MessageList"},next:{title:"MessagesSentReadTag",permalink:"/va-mobile-app/docs/FrontEnd/ComponentsSection/MessagesSentReadTag"}},d=[],c="<MessagesCountTag unread={tagCount} />",g={toc:d,exampleString:c};function C(e){var n=e.components,t=(0,s.Z)(e,i);return(0,a.kt)("wrapper",(0,o.Z)({},g,t,{components:n,mdxType:"MDXLayout"}),(0,a.kt)(r.Z,{componentName:"MessagesCountTag",example:c,codeString:"import { testIdProps } from 'utils/accessibility'\nimport { useTheme } from 'utils/hooks'\nimport Box from './Box'\nimport React, { FC } from 'react'\nimport TextView from './TextView'\n\nexport type CountTagProps = {\n  /**number to be shown on the tag */\n  unread: number\n}\n\n/**A common component to show a count of a particular item within a page before clicking to enter that page. For example, this tag would be used to display the number of unread messages in one's inbox. */\nconst MessagesCountTag: FC<CountTagProps> = ({ unread }) => {\n  const theme = useTheme()\n  return (\n    <Box\n      minWidth={theme.dimensions.tagCountMinWidth}\n      justifyContent={'center'}\n      alignSelf={'center'}\n      backgroundColor=\"unreadMessagesTag\"\n      borderRadius={theme.dimensions.tagCountCurvedBorder}\n      {...testIdProps(unread.toString())}\n      accessible={true}>\n      <TextView flexWrap={'wrap'} color=\"primaryContrast\" variant=\"UnreadMessagesTag\" px={theme.dimensions.condensedMarginBetween} pt={theme.dimensions.tagCountTopPadding}>\n        {unread}\n      </TextView>\n    </Box>\n  )\n}\n\nexport default MessagesCountTag\n",mdxType:"ComponentTopInfo"}))}C.isMDXComponent=!0}}]);