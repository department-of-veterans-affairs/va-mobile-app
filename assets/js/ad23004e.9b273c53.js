"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[7204],{7644:(e,n,t)=>{t.d(n,{A:()=>c});var a=t(96540),i=t(54610),o=t(3384),s=t(31347),r=t(28057),l=t(84476);const p=e=>{let{props:n}=e;return n?a.createElement(a.Fragment,null,l.Ay.isEmpty(n)?a.createElement("pre",{className:"preText"},"This component does not have props defined"):a.createElement("table",null,a.createElement("thead",null,a.createElement("tr",null,a.createElement("th",null,"Name"),a.createElement("th",null,"Type"),a.createElement("th",null,"Default Value"),a.createElement("th",null,"Required"),a.createElement("th",null,"Description"))),a.createElement("tbody",null,Object.keys(n).map((e=>a.createElement("tr",{key:e},a.createElement("td",null,a.createElement("code",null,e)),a.createElement("td",{style:{minWidth:200}},n[e].type?.name),a.createElement("td",null,n[e].defaultValue&&n[e].defaultValue.value.toString()),a.createElement("td",null,n[e].required?"Yes":"No"),a.createElement("td",null,n[e].description))))))):null};function c(e){const n=(0,r.d)(e.componentName),{description:t,displayName:l,props:c}=n[0],m=`How to use the ${l} component`,g=`Full code for the ${l} component`;return a.createElement(a.Fragment,null,t,a.createElement("br",null),a.createElement("br",null),a.createElement(o.A,null,a.createElement(s.A,{value:"props",label:"Properties"},a.createElement(p,{props:c})),a.createElement(s.A,{value:"example",label:"Example"},e.example&&a.createElement(i.A,{title:m,className:"language-tsx test"},e.example)),a.createElement(s.A,{value:"code",label:"Source Code"},e.codeString&&a.createElement(i.A,{title:g,className:"language-tsx"},e.codeString)),a.createElement(s.A,{value:"accessibility",label:"Accessibility"},a.createElement("pre",{className:"preText"},e.accessibilityInfo))))}},28057:(e,n,t)=>{t.d(n,{d:()=>i});var a=t(2736);const i=e=>(0,a.Ay)()["docusaurus-plugin-react-docgen-typescript"].default.filter((n=>n.displayName===e))},25905:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>l,default:()=>b,exampleString:()=>g,frontMatter:()=>r,metadata:()=>p,toc:()=>m});var a=t(58168),i=(t(96540),t(15680));t(41873),t(54610);const o="import React, { FC } from 'react'\nimport { useTranslation } from 'react-i18next'\nimport { Pressable, PressableProps } from 'react-native'\n\nimport { Events } from 'constants/analytics'\nimport { NAMESPACE } from 'constants/namespaces'\nimport { logAnalyticsEvent } from 'utils/analytics'\nimport { useTheme } from 'utils/hooks'\n\nimport Box, { BoxProps } from './Box'\nimport TextView from './TextView'\nimport VAIcon, { VAIconProps } from './VAIcon'\n\nexport type PaginationProps = {\n  /** page number */\n  page: number\n  /** total number of items */\n  totalEntries: number\n  /** pageSize */\n  pageSize: number\n  /** function to be called when previous is selected */\n  onPrev: () => void\n  /** function to be called when next is selected */\n  onNext: () => void\n  /** optional tab if screen has tabs for analytics */\n  tab?: string\n}\n\ntype PaginationArrowProps = {\n  /** function called when pressed */\n  onPress: () => void\n  /** optional accessibility hint */\n  a11yHint?: string\n  /** whether or not this button is disabled */\n  disabled: boolean\n  /** test id */\n  testID: string\n  /** props for icon */\n  iconProps: VAIconProps\n}\n\nexport const PaginationArrow: FC<PaginationArrowProps> = ({ onPress, a11yHint, iconProps, testID, disabled }) => {\n  const theme = useTheme()\n\n  const pressableProps: PressableProps = {\n    onPress: onPress,\n    accessibilityRole: 'link',\n    disabled,\n    accessible: true,\n    accessibilityHint: a11yHint,\n    accessibilityState: disabled ? { disabled: true } : {},\n  }\n\n  const boxProps: BoxProps = {\n    backgroundColor: disabled ? 'buttonSecondaryDisabled' : 'buttonPrimary',\n    minHeight: theme.dimensions.touchableMinHeight,\n    p: 15,\n    borderRadius: 5,\n  }\n  return (\n    <Pressable {...pressableProps} testID={testID} accessibilityLabel={testID}>\n      <Box {...boxProps}>\n        <VAIcon fill={theme.colors.icon.pagination} width={16} height={16} preventScaling={true} {...iconProps} />\n      </Box>\n    </Pressable>\n  )\n}\n/**A common component for showing pagination on the page. Displays previous arrow, next arrow, and copy message based on current page and item. */\nconst Pagination: FC<PaginationProps> = ({ page, pageSize, totalEntries, onPrev, onNext, tab }) => {\n  const theme = useTheme()\n  const { t } = useTranslation(NAMESPACE.COMMON)\n\n  const boxProps: BoxProps = {\n    flexDirection: 'row',\n    justifyContent: 'space-between',\n    alignItems: 'center',\n    width: '100%',\n    minHeight: theme.dimensions.touchableMinHeight,\n  }\n\n  const onPrevPress = () => {\n    logAnalyticsEvent(Events.vama_pagination(page, page - 1, tab))\n    onPrev()\n  }\n\n  const onNextPress = () => {\n    logAnalyticsEvent(Events.vama_pagination(page, page + 1, tab))\n    onNext()\n  }\n\n  const previousProps: PaginationArrowProps = {\n    onPress: onPrevPress,\n    testID: 'previous-page',\n    a11yHint: t('pagination.previous'),\n    iconProps: { name: 'ChevronLeft', fill: theme.colors.icon.pagination },\n    disabled: page === 1,\n  }\n\n  const nextProps: PaginationArrowProps = {\n    onPress: onNextPress,\n    testID: 'next-page',\n    a11yHint: t('pagination.next'),\n    iconProps: { name: 'ChevronRight', fill: theme.colors.icon.pagination },\n    disabled: page * pageSize >= totalEntries,\n  }\n  const beginIdx = (page - 1) * pageSize + 1\n  let endIdx = page * pageSize\n  // if more than total entries then calculate actual index\n  if (endIdx > totalEntries) {\n    endIdx = endIdx - (endIdx - totalEntries)\n  }\n\n  if (totalEntries <= pageSize) {\n    return <></>\n  }\n\n  return (\n    <Box {...boxProps}>\n      <PaginationArrow {...previousProps} />\n      <TextView flex={1} variant={'MobileBody'} px={theme.dimensions.buttonPadding} textAlign={'center'}>\n        {t('pagination.info', { beginIdx, endIdx, totalEntries })}\n      </TextView>\n      <PaginationArrow {...nextProps} />\n    </Box>\n  )\n}\n\nexport default Pagination\n";var s=t(7644);const r={title:"Pagination"},l=void 0,p={unversionedId:"Flagship design library/Components/Navigation/Secondary/Pagination",id:"Flagship design library/Components/Navigation/Secondary/Pagination",title:"Pagination",description:"Pagination is navigation for paginated content.",source:"@site/docs/Flagship design library/Components/Navigation/Secondary/Pagination.mdx",sourceDirName:"Flagship design library/Components/Navigation/Secondary",slug:"/Flagship design library/Components/Navigation/Secondary/Pagination",permalink:"/va-mobile-app/docs/Flagship design library/Components/Navigation/Secondary/Pagination",draft:!1,tags:[],version:"current",frontMatter:{title:"Pagination"},sidebar:"tutorialSidebar",previous:{title:"CarouselTabBar",permalink:"/va-mobile-app/docs/Flagship design library/Components/Navigation/Secondary/CarouselTabBar"},next:{title:"Segmented control",permalink:"/va-mobile-app/docs/Flagship design library/Components/Navigation/Secondary/SegmentedControl"}},c={},m=[{value:"Examples",id:"examples",level:2},{value:"Master component",id:"master-component",level:3},{value:"Examples",id:"examples-1",level:3},{value:"Usage",id:"usage",level:2},{value:"Accessibility considerations",id:"accessibility-considerations",level:2},{value:"Related",id:"related",level:2},{value:"Code usage",id:"code-usage",level:2}],g="<Pagination page={1} onNext={() => {}} onPrev={() => {}} totalEntries={12} pageSize={10} />",d={toc:m,exampleString:g},u="wrapper";function b(e){let{components:n,...t}=e;return(0,i.yg)(u,(0,a.A)({},d,t,{components:n,mdxType:"MDXLayout"}),(0,i.yg)("p",null,"Pagination is navigation for paginated content."),(0,i.yg)("h2",{id:"examples"},"Examples"),(0,i.yg)("h3",{id:"master-component"},"Master component"),(0,i.yg)("iframe",{width:"800",height:"450",alt:"Image of master component in Figma showing light and dark mode",src:"https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com/file/QVLPB3eOunmKrgQOuOt0SU/%F0%9F%93%90-DesignLibrary2.0---VAMobile?type=design&node-id=16025-1995&mode=design&t=kmODZY3bkhNgpYY1-4",title:"Image of master component in Figma showing light and dark mode",allowfullscreen:!0}),(0,i.yg)("h3",{id:"examples-1"},"Examples"),(0,i.yg)("iframe",{width:"800",height:"450",alt:"Image of component examples in Figma",src:"https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com/file/QVLPB3eOunmKrgQOuOt0SU/%F0%9F%93%90-DesignLibrary2.0---VAMobile?type=design&node-id=16025-1996&mode=design&t=kmODZY3bkhNgpYY1-4",allowfullscreen:!0}),(0,i.yg)("h2",{id:"usage"},"Usage"),(0,i.yg)("ul",null,(0,i.yg)("li",{parentName:"ul"},"Refer to the ",(0,i.yg)("a",{parentName:"li",href:"https://design.va.gov/components/pagination#usage"},"VA Design System for usage guidance"))),(0,i.yg)("h2",{id:"accessibility-considerations"},"Accessibility considerations"),(0,i.yg)("ul",null,(0,i.yg)("li",{parentName:"ul"},"Refer to the ",(0,i.yg)("a",{parentName:"li",href:"https://design.va.gov/components/pagination#accessibility-considerations"},"VA Design System for accessibility considerations")),(0,i.yg)("li",{parentName:"ul"},"All interactive tappable elements should be coded as links and not as buttons."),(0,i.yg)("li",{parentName:"ul"},"When additional context might be needed, we should apply a11yLabels to the links.")),(0,i.yg)("h2",{id:"related"},"Related"),(0,i.yg)("ul",null,(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("a",{parentName:"li",href:"https://design.va.gov/components/pagination"},"Pagination - VA Design System")),(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("a",{parentName:"li",href:"https://designsystem.digital.gov/components/pagination/"},"Pagination - USWDS"))),(0,i.yg)("h2",{id:"code-usage"},"Code usage"),(0,i.yg)(s.A,{componentName:"Pagination",example:g,codeString:o,mdxType:"ComponentTopInfo"}))}b.isMDXComponent=!0}}]);