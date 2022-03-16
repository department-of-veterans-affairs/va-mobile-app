"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[7013],{38909:function(e,t,n){n.d(t,{Z:function(){return c}});var o=n(67294),i=n(19055),r=n(26396),l=n(58215),s=n(82224),a=n(36005),m=function(e){var t=e.props;return t?o.createElement(o.Fragment,null,a.ZP.isEmpty(t)?o.createElement("pre",{className:"preText"},"This component does not have props defined"):o.createElement("table",null,o.createElement("thead",null,o.createElement("tr",null,o.createElement("th",null,"Name"),o.createElement("th",null,"Type"),o.createElement("th",null,"Default Value"),o.createElement("th",null,"Required"),o.createElement("th",null,"Description"))),o.createElement("tbody",null,Object.keys(t).map((function(e){var n;return o.createElement("tr",{key:e},o.createElement("td",null,o.createElement("code",null,e)),o.createElement("td",{style:{minWidth:200}},null==(n=t[e].type)?void 0:n.name),o.createElement("td",null,t[e].defaultValue&&t[e].defaultValue.value.toString()),o.createElement("td",null,t[e].required?"Yes":"No"),o.createElement("td",null,t[e].description))}))))):null};function c(e){var t=(0,s.N)(e.componentName)[0],n=t.description,a=t.displayName,c=t.props,p="How to use the "+a+" component",u="Full code for the "+a+" component";return o.createElement(o.Fragment,null,n,o.createElement("br",null),o.createElement("br",null),o.createElement(r.Z,null,o.createElement(l.Z,{value:"props",label:"Properties"},o.createElement(m,{props:c})),o.createElement(l.Z,{value:"example",label:"Example"},e.example&&o.createElement(i.Z,{title:p,className:"language-tsx test"},e.example)),o.createElement(l.Z,{value:"code",label:"Source Code"},e.codeString&&o.createElement(i.Z,{title:u,className:"language-tsx"},e.codeString)),o.createElement(l.Z,{value:"accessibility",label:"Accessibility"},o.createElement("pre",{className:"preText"},e.accessibilityInfo))))}},54175:function(e,t,n){n.r(t),n.d(t,{contentTitle:function(){return m},default:function(){return f},exampleString:function(){return u},frontMatter:function(){return a},metadata:function(){return c},toc:function(){return p}});var o=n(87462),i=n(63366),r=(n(67294),n(3905)),l=(n(19055),n(38909)),s=["components"],a={},m=void 0,c={unversionedId:"Engineering/FrontEnd/ComponentsSection/List",id:"Engineering/FrontEnd/ComponentsSection/List",title:"List",description:"const listExample: Array = [",source:"@site/docs/Engineering/FrontEnd/ComponentsSection/List.mdx",sourceDirName:"Engineering/FrontEnd/ComponentsSection",slug:"/Engineering/FrontEnd/ComponentsSection/List",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/ComponentsSection/List",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"LargeNavButton",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/ComponentsSection/LargeNavButton"},next:{title:"LoadingComponent",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/ComponentsSection/LoadingComponent"}},p=[],u="import { List, ListItemObj } from 'components'\n    const listExample: Array<ListItemObj> = [\n        { content: <TextView>'My Title 1'</TextView>, a11yHintText: 'Hint 1', onPress: () => { console.log('button 1 pressed') } },\n        { content: <TextView>'My Title 2'</TextView>, a11yHintText: 'Hint 2', onPress: () => { console.log('button 2 pressed') } },\n    ]\n\n<List items={listExample} />",d={toc:p,exampleString:u};function f(e){var t=e.components,n=(0,i.Z)(e,s);return(0,r.kt)("wrapper",(0,o.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)(l.Z,{componentName:"List",example:u,codeString:"import React, { FC } from 'react'\n\nimport { SwitchProps } from './Switch'\nimport { TextView } from './index'\nimport { TextViewProps } from './TextView'\nimport { testIdProps } from 'utils/accessibility'\nimport { useTheme } from 'utils/hooks'\nimport BaseListItem, { BaseListItemProps } from './BaseListItem'\nimport Box from './Box'\n\n/**\n * Signifies each item in the list of items in {@link ListProps}\n */\nexport type ListItemObj = {\n  /** optional text to use as the button's accessibility hint */\n  a11yHintText?: string\n\n  /** display content for the item */\n  content?: React.ReactNode\n\n  /** on press event */\n  onPress?: () => void\n\n  /** request file number for file indicator */\n  requestNumber?: number\n\n  /** request file if file was loaded */\n  fileUploaded?: boolean\n} & Partial<BaseListItemProps>\n\n/**\n * Props for {@link List}\n */\nexport type ListProps = {\n  /** list of items of which a button will be rendered per item */\n  items: Array<ListItemObj>\n\n  /** optional title to use for the list */\n  title?: string\n\n  /**optional a11y hint for the title */\n  titleA11yLabel?: string\n}\n\n/**\n * A common component for showing a list of <ListItem>.\n */\nconst List: FC<ListProps> = ({ items, title, titleA11yLabel }) => {\n  const theme = useTheme()\n  const { gutter, condensedMarginBetween, standardMarginBetween } = theme.dimensions\n\n  const titleProps: TextViewProps = {\n    variant: 'TableHeaderBold',\n    color: 'primaryTitle',\n    mx: gutter,\n    mb: condensedMarginBetween,\n    mt: standardMarginBetween,\n    accessibilityRole: 'header',\n  }\n\n  const buttons = items.map((item, index) => {\n    const { content, a11yHintText, decoratorProps } = item\n    const dProps = decoratorProps as Partial<SwitchProps>\n\n    return (\n      <BaseListItem key={index} a11yHint={a11yHintText || dProps?.a11yHint || ''} {...item}>\n        {content}\n      </BaseListItem>\n    )\n  })\n\n  return (\n    <Box>\n      {title && (\n        <Box accessible={true} accessibilityRole={'header'}>\n          <TextView {...titleProps} {...testIdProps(titleA11yLabel ? titleA11yLabel : title)}>\n            {title}\n          </TextView>\n        </Box>\n      )}\n      <Box borderTopWidth={theme.dimensions.borderWidth} borderStyle=\"solid\" borderColor=\"primary\">\n        <Box backgroundColor={'list'}>{buttons}</Box>\n      </Box>\n    </Box>\n  )\n}\n\nexport default List\n",mdxType:"ComponentTopInfo"}))}f.isMDXComponent=!0}}]);