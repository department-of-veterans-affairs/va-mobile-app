"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[9287],{38909:(e,n,t)=>{t.d(n,{Z:()=>p});var o=t(67294),a=t(19055),i=t(26396),r=t(58215),s=t(82224),l=t(36005);const c=e=>{let{props:n}=e;return n?o.createElement(o.Fragment,null,l.ZP.isEmpty(n)?o.createElement("pre",{className:"preText"},"This component does not have props defined"):o.createElement("table",null,o.createElement("thead",null,o.createElement("tr",null,o.createElement("th",null,"Name"),o.createElement("th",null,"Type"),o.createElement("th",null,"Default Value"),o.createElement("th",null,"Required"),o.createElement("th",null,"Description"))),o.createElement("tbody",null,Object.keys(n).map((e=>o.createElement("tr",{key:e},o.createElement("td",null,o.createElement("code",null,e)),o.createElement("td",{style:{minWidth:200}},n[e].type?.name),o.createElement("td",null,n[e].defaultValue&&n[e].defaultValue.value.toString()),o.createElement("td",null,n[e].required?"Yes":"No"),o.createElement("td",null,n[e].description))))))):null};function p(e){const n=(0,s.N)(e.componentName),{description:t,displayName:l,props:p}=n[0],m=`How to use the ${l} component`,d=`Full code for the ${l} component`;return o.createElement(o.Fragment,null,t,o.createElement("br",null),o.createElement("br",null),o.createElement(i.Z,null,o.createElement(r.Z,{value:"props",label:"Properties"},o.createElement(c,{props:p})),o.createElement(r.Z,{value:"example",label:"Example"},e.example&&o.createElement(a.Z,{title:m,className:"language-tsx test"},e.example)),o.createElement(r.Z,{value:"code",label:"Source Code"},e.codeString&&o.createElement(a.Z,{title:d,className:"language-tsx"},e.codeString)),o.createElement(r.Z,{value:"accessibility",label:"Accessibility"},o.createElement("pre",{className:"preText"},e.accessibilityInfo))))}},82224:(e,n,t)=>{t.d(n,{N:()=>a});var o=t(28084);const a=e=>(0,o.default)()["docusaurus-plugin-react-docgen-typescript"].default.filter((n=>n.displayName===e))},40508:(e,n,t)=>{t.r(n),t.d(n,{contentTitle:()=>l,default:()=>g,exampleString:()=>m,frontMatter:()=>s,metadata:()=>c,toc:()=>p});var o=t(87462),a=(t(67294),t(3905));t(95657),t(19055);const i="import { Pressable, PressableProps } from 'react-native'\nimport { useTranslation } from 'react-i18next'\nimport React, { FC } from 'react'\n\nimport { Events } from 'constants/analytics'\nimport { NAMESPACE } from 'constants/namespaces'\nimport { logAnalyticsEvent } from 'utils/analytics'\nimport { testIdProps } from 'utils/accessibility'\nimport { useTheme } from 'utils/hooks'\nimport Box, { BoxProps } from './Box'\nimport TextView from './TextView'\nimport VAIcon, { VAIconProps } from './VAIcon'\n\nexport type PaginationProps = {\n  /** page number */\n  page: number\n  /** total number of items */\n  totalEntries: number\n  /** pageSize */\n  pageSize: number\n  /** function to be called when previous is selected */\n  onPrev: () => void\n  /** function to be called when next is selected */\n  onNext: () => void\n  /** optional tab if screen has tabs for analytics */\n  tab?: string\n}\n\ntype PaginationArrowProps = {\n  /** function called when pressed */\n  onPress: () => void\n  /** optional accessibility hint */\n  a11yHint?: string\n  /** whether or not this button is disabled */\n  disabled: boolean\n  /** test id */\n  testID: string\n  /** props for icon */\n  iconProps: VAIconProps\n}\n\nexport const PaginationArrow: FC<PaginationArrowProps> = ({ onPress, a11yHint, iconProps, testID, disabled }) => {\n  const theme = useTheme()\n\n  const pressableProps: PressableProps = {\n    onPress: onPress,\n    accessibilityRole: 'link',\n    disabled,\n    accessible: true,\n    accessibilityHint: a11yHint,\n    accessibilityState: disabled ? { disabled: true } : {},\n  }\n\n  const boxProps: BoxProps = {\n    backgroundColor: disabled ? 'buttonSecondaryDisabled' : 'buttonPrimary',\n    minHeight: theme.dimensions.touchableMinHeight,\n    p: 15,\n    borderRadius: 5,\n  }\n  return (\n    <Pressable {...pressableProps} {...testIdProps(testID)}>\n      <Box {...boxProps}>\n        <VAIcon fill={theme.colors.icon.pagination} width={16} height={16} preventScaling={true} {...iconProps} />\n      </Box>\n    </Pressable>\n  )\n}\n/**A common component for showing pagination on the page. Displays previous arrow, next arrow, and copy message based on current page and item. */\nconst Pagination: FC<PaginationProps> = ({ page, pageSize, totalEntries, onPrev, onNext, tab }) => {\n  const theme = useTheme()\n  const { t } = useTranslation(NAMESPACE.COMMON)\n\n  const boxProps: BoxProps = {\n    flexDirection: 'row',\n    justifyContent: 'space-between',\n    alignItems: 'center',\n    width: '100%',\n    minHeight: theme.dimensions.touchableMinHeight,\n  }\n\n  const onPrevPress = () => {\n    logAnalyticsEvent(Events.vama_pagination(page, page - 1, tab))\n    onPrev()\n  }\n\n  const onNextPress = () => {\n    logAnalyticsEvent(Events.vama_pagination(page, page + 1, tab))\n    onNext()\n  }\n\n  const previousProps: PaginationArrowProps = {\n    onPress: onPrevPress,\n    testID: 'previous-page',\n    a11yHint: t('pagination.previous'),\n    iconProps: { name: 'ChevronLeft', fill: theme.colors.icon.pagination },\n    disabled: page === 1,\n  }\n\n  const nextProps: PaginationArrowProps = {\n    onPress: onNextPress,\n    testID: 'next-page',\n    a11yHint: t('pagination.next'),\n    iconProps: { name: 'ChevronRight', fill: theme.colors.icon.pagination },\n    disabled: page * pageSize >= totalEntries,\n  }\n  const beginIdx = (page - 1) * pageSize + 1\n  let endIdx = page * pageSize\n  // if more than total entries then calculate actual index\n  if (endIdx > totalEntries) {\n    endIdx = endIdx - (endIdx - totalEntries)\n  }\n\n  if (totalEntries <= pageSize) {\n    return <></>\n  }\n\n  return (\n    <Box {...boxProps}>\n      <PaginationArrow {...previousProps} />\n      <TextView flex={1} variant={'MobileBody'} px={theme.dimensions.buttonPadding} textAlign={'center'}>\n        {t('pagination.info', { beginIdx, endIdx, totalEntries })}\n      </TextView>\n      <PaginationArrow {...nextProps} />\n    </Box>\n  )\n}\n\nexport default Pagination\n";var r=t(38909);const s={},l=void 0,c={unversionedId:"UX/ComponentsSection/Navigation/Secondary/Pagination",id:"UX/ComponentsSection/Navigation/Secondary/Pagination",title:"Pagination",description:"",source:"@site/docs/UX/ComponentsSection/Navigation/Secondary/Pagination.mdx",sourceDirName:"UX/ComponentsSection/Navigation/Secondary",slug:"/UX/ComponentsSection/Navigation/Secondary/Pagination",permalink:"/va-mobile-app/docs/UX/ComponentsSection/Navigation/Secondary/Pagination",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"CarouselTabBar",permalink:"/va-mobile-app/docs/UX/ComponentsSection/Navigation/Secondary/CarouselTabBar"},next:{title:"SegmentedControl",permalink:"/va-mobile-app/docs/UX/ComponentsSection/Navigation/Secondary/SegmentedControl"}},p=[],m="<Pagination page={1} onNext={() => {}} onPrev={() => {}} totalEntries={12} pageSize={10} />",d={toc:p,exampleString:m},u="wrapper";function g(e){let{components:n,...t}=e;return(0,a.kt)(u,(0,o.Z)({},d,t,{components:n,mdxType:"MDXLayout"}),(0,a.kt)(r.Z,{componentName:"Pagination",example:m,codeString:i,mdxType:"ComponentTopInfo"}))}g.isMDXComponent=!0}}]);