"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[2622],{38909:function(e,n,t){t.d(n,{Z:function(){return p}});var o=t(67294),i=t(19055),a=t(26396),r=t(58215),s=t(82224),l=t(36005),c=function(e){var n=e.props;return n?o.createElement(o.Fragment,null,l.ZP.isEmpty(n)?o.createElement("pre",{className:"preText"},"This component does not have props defined"):o.createElement("table",null,o.createElement("thead",null,o.createElement("tr",null,o.createElement("th",null,"Name"),o.createElement("th",null,"Type"),o.createElement("th",null,"Default Value"),o.createElement("th",null,"Required"),o.createElement("th",null,"Description"))),o.createElement("tbody",null,Object.keys(n).map((function(e){var t;return o.createElement("tr",{key:e},o.createElement("td",null,o.createElement("code",null,e)),o.createElement("td",{style:{minWidth:200}},null==(t=n[e].type)?void 0:t.name),o.createElement("td",null,n[e].defaultValue&&n[e].defaultValue.value.toString()),o.createElement("td",null,n[e].required?"Yes":"No"),o.createElement("td",null,n[e].description))}))))):null};function p(e){var n=(0,s.N)(e.componentName)[0],t=n.description,l=n.displayName,p=n.props,m="How to use the "+l+" component",d="Full code for the "+l+" component";return o.createElement(o.Fragment,null,t,o.createElement("br",null),o.createElement("br",null),o.createElement(a.Z,null,o.createElement(r.Z,{value:"props",label:"Properties"},o.createElement(c,{props:p})),o.createElement(r.Z,{value:"example",label:"Example"},e.example&&o.createElement(i.Z,{title:m,className:"language-tsx test"},e.example)),o.createElement(r.Z,{value:"code",label:"Source Code"},e.codeString&&o.createElement(i.Z,{title:d,className:"language-tsx"},e.codeString)),o.createElement(r.Z,{value:"accessibility",label:"Accessibility"},o.createElement("pre",{className:"preText"},e.accessibilityInfo))))}},17952:function(e,n,t){t.r(n),t.d(n,{contentTitle:function(){return c},default:function(){return g},exampleString:function(){return d},frontMatter:function(){return l},metadata:function(){return p},toc:function(){return m}});var o=t(87462),i=t(63366),a=(t(67294),t(3905)),r=(t(19055),t(38909)),s=["components"],l={},c=void 0,p={unversionedId:"Engineering/FrontEnd/ComponentsSection/Navigation/Pagination",id:"Engineering/FrontEnd/ComponentsSection/Navigation/Pagination",title:"Pagination",description:"",source:"@site/docs/Engineering/FrontEnd/ComponentsSection/Navigation/Pagination.mdx",sourceDirName:"Engineering/FrontEnd/ComponentsSection/Navigation",slug:"/Engineering/FrontEnd/ComponentsSection/Navigation/Pagination",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/ComponentsSection/Navigation/Pagination",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"NavigationTabBar",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/ComponentsSection/Navigation/NavigationTabBar"},next:{title:"SegmentedControl",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/ComponentsSection/Tabs/SegmentedControl"}},m=[],d="<Pagination page={1} onNext={() => {}} onPrev={() => {}} totalEntries={12} pageSize={10} />",u={toc:m,exampleString:d};function g(e){var n=e.components,t=(0,i.Z)(e,s);return(0,a.kt)("wrapper",(0,o.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,a.kt)(r.Z,{componentName:"Pagination",example:d,codeString:"import { Pressable, PressableProps } from 'react-native'\nimport { useTranslation } from 'react-i18next'\nimport React, { FC } from 'react'\n\nimport { NAMESPACE } from 'constants/namespaces'\nimport { testIdProps } from 'utils/accessibility'\nimport { useTheme } from 'utils/hooks'\nimport Box, { BoxProps } from './Box'\nimport TextView from './TextView'\nimport VAIcon, { VAIconProps } from './VAIcon'\n\nexport type PaginationProps = {\n  /** page number */\n  page: number\n  /** total number of items */\n  totalEntries: number\n  /** pageSize */\n  pageSize: number\n  /** function to be called when previous is selected */\n  onPrev: () => void\n  /** function to be called when next is selected */\n  onNext: () => void\n}\n\ntype PaginationArrowProps = {\n  /** function called when pressed */\n  onPress: () => void\n  /** optional accessibility hint */\n  a11yHint?: string\n  /** whether or not this button is disabled */\n  disabled: boolean\n  /** test id */\n  testID: string\n  /** props for icon */\n  iconProps: VAIconProps\n}\n\nexport const PaginationArrow: FC<PaginationArrowProps> = ({ onPress, a11yHint, iconProps, testID, disabled }) => {\n  const theme = useTheme()\n\n  const pressableProps: PressableProps = {\n    onPress: onPress,\n    accessibilityRole: 'link',\n    disabled,\n    accessible: true,\n    accessibilityHint: a11yHint,\n    accessibilityState: disabled ? { disabled: true } : {},\n  }\n\n  const boxProps: BoxProps = {\n    backgroundColor: disabled ? 'buttonSecondaryDisabled' : 'buttonPrimary',\n    minHeight: theme.dimensions.touchableMinHeight,\n    p: 15,\n    borderRadius: 5,\n  }\n  return (\n    <Pressable {...pressableProps} {...testIdProps(testID)}>\n      <Box {...boxProps}>\n        <VAIcon fill={theme.colors.icon.pagination} width={16} height={16} preventScaling={true} {...iconProps} />\n      </Box>\n    </Pressable>\n  )\n}\n/**A common component for showing pagination on the page. Displays previous arrow, next arrow, and copy message based on current page and item. */\nconst Pagination: FC<PaginationProps> = ({ page, pageSize, totalEntries, onPrev, onNext }) => {\n  const theme = useTheme()\n  const { t } = useTranslation(NAMESPACE.COMMON)\n\n  const boxProps: BoxProps = {\n    flexDirection: 'row',\n    justifyContent: 'space-between',\n    alignItems: 'center',\n    width: '100%',\n    minHeight: theme.dimensions.touchableMinHeight,\n  }\n\n  const previousProps: PaginationArrowProps = {\n    onPress: onPrev,\n    testID: 'previous-page',\n    a11yHint: t('pagination.previous'),\n    iconProps: { name: 'ArrowLeft', fill: theme.colors.icon.pagination },\n    disabled: page === 1,\n  }\n\n  const nextProps: PaginationArrowProps = {\n    onPress: onNext,\n    testID: 'next-page',\n    a11yHint: t('pagination.next'),\n    iconProps: { name: 'ArrowRight', fill: theme.colors.icon.pagination },\n    disabled: page * pageSize >= totalEntries,\n  }\n  const beginIdx = (page - 1) * pageSize + 1\n  let endIdx = page * pageSize\n  // if more than total entries then calculate actual index\n  if (endIdx > totalEntries) {\n    endIdx = endIdx - (endIdx - totalEntries)\n  }\n\n  if (totalEntries <= pageSize) {\n    return <></>\n  }\n\n  return (\n    <Box {...boxProps}>\n      <PaginationArrow {...previousProps} />\n      <TextView flex={1} variant={'MobileBody'} px={theme.dimensions.buttonPadding} textAlign={'center'}>\n        {t('pagination.info', { beginIdx, endIdx, totalEntries })}\n      </TextView>\n      <PaginationArrow {...nextProps} />\n    </Box>\n  )\n}\n\nexport default Pagination\n",mdxType:"ComponentTopInfo"}))}g.isMDXComponent=!0}}]);