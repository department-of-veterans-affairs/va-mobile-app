"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[3513],{7644:(e,t,n)=>{n.d(t,{A:()=>u});var o=n(96540),a=n(54610),s=n(3384),i=n(31347),l=n(28057),r=n(84476);const c=e=>{let{props:t}=e;return t?o.createElement(o.Fragment,null,r.Ay.isEmpty(t)?o.createElement("pre",{className:"preText"},"This component does not have props defined"):o.createElement("table",null,o.createElement("thead",null,o.createElement("tr",null,o.createElement("th",null,"Name"),o.createElement("th",null,"Type"),o.createElement("th",null,"Default Value"),o.createElement("th",null,"Required"),o.createElement("th",null,"Description"))),o.createElement("tbody",null,Object.keys(t).map((e=>o.createElement("tr",{key:e},o.createElement("td",null,o.createElement("code",null,e)),o.createElement("td",{style:{minWidth:200}},t[e].type?.name),o.createElement("td",null,t[e].defaultValue&&t[e].defaultValue.value.toString()),o.createElement("td",null,t[e].required?"Yes":"No"),o.createElement("td",null,t[e].description))))))):null};function u(e){const t=(0,l.d)(e.componentName),{description:n,displayName:r,props:u}=t[0],m=`How to use the ${r} component`,p=`Full code for the ${r} component`;return o.createElement(o.Fragment,null,n,o.createElement("br",null),o.createElement("br",null),o.createElement(s.A,null,o.createElement(i.A,{value:"props",label:"Properties"},o.createElement(c,{props:u})),o.createElement(i.A,{value:"example",label:"Example"},e.example&&o.createElement(a.A,{title:m,className:"language-tsx test"},e.example)),o.createElement(i.A,{value:"code",label:"Source Code"},e.codeString&&o.createElement(a.A,{title:p,className:"language-tsx"},e.codeString)),o.createElement(i.A,{value:"accessibility",label:"Accessibility"},o.createElement("pre",{className:"preText"},e.accessibilityInfo))))}},28057:(e,t,n)=>{n.d(t,{d:()=>a});var o=n(2736);const a=e=>(0,o.Ay)()["docusaurus-plugin-react-docgen-typescript"].default.filter((t=>t.displayName===e))},49316:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>u,contentTitle:()=>r,default:()=>h,exampleString:()=>p,frontMatter:()=>l,metadata:()=>c,toc:()=>m});var o=n(58168),a=(n(96540),n(15680));n(41873),n(54610);const s="import React, { FC } from 'react'\nimport { useTranslation } from 'react-i18next'\nimport { TouchableWithoutFeedback } from 'react-native'\n\nimport { useFocusEffect } from '@react-navigation/native'\n\nimport { BackButtonLabel } from 'constants/backButtonLabels'\nimport { NAMESPACE } from 'constants/namespaces'\nimport { a11yHintProp, testIdProps } from 'utils/accessibility'\nimport { useAccessibilityFocus, useTheme } from 'utils/hooks'\n\nimport Box from './Box'\nimport TextView from './TextView'\nimport VAIcon from './VAIcon'\n\n/**\n *  Signifies the props that need to be passed in to {@link BackButton}\n */\nexport type BackButtonProps = {\n  /** the onPress function for the back button */\n  onPress: (() => void) | undefined\n  /** a boolean indicating if the user has a screen to go back to; if false, the back button will be hidden */\n  canGoBack: boolean | undefined\n  /** translation key to use for the display text, as well as the testID for the component */\n  label: BackButtonLabel\n  /** whether to show the carat left of the text */\n  showCarat?: boolean | true\n  /** optional param to add accessibility hint to back button */\n  a11yHint?: string\n  /** boolean to specify if we want accesibility to focus on the back button */\n  focusOnButton?: boolean\n  /** option testID */\n  backButtonTestID?: string\n\n  webview?: boolean\n}\n\n/**\n * Button used by the stack navigation to go back to the previous screen\n */\nexport const BackButton: FC<BackButtonProps> = ({\n  onPress,\n  canGoBack,\n  label,\n  showCarat,\n  a11yHint,\n  backButtonTestID,\n  focusOnButton = true,\n  webview,\n}) => {\n  const { t } = useTranslation(NAMESPACE.COMMON)\n  const theme = useTheme()\n\n  const [focusRef, setFocus] = useAccessibilityFocus<TouchableWithoutFeedback>()\n\n  useFocusEffect(focusOnButton ? setFocus : () => {})\n\n  if (!canGoBack) {\n    return null\n  }\n\n  const chevron = showCarat ? <VAIcon mt={1} name={'ChevronLeft'} fill=\"backButton\" testID=\"BackButtonCarat\" /> : <></>\n\n  const a11yHintPropParam = a11yHint ? a11yHint : t(`${label}.a11yHint`)\n\n  return (\n    <TouchableWithoutFeedback\n      ref={focusRef}\n      onPress={onPress}\n      {...testIdProps(label)}\n      {...a11yHintProp(a11yHintPropParam)}\n      accessibilityRole=\"button\"\n      accessible={true}\n      testID={backButtonTestID}>\n      <Box\n        display=\"flex\"\n        flexDirection=\"row\"\n        ml={theme.dimensions.headerButtonSpacing}\n        height={theme.dimensions.headerHeight}\n        alignItems={'center'}>\n        {chevron}\n        <TextView\n          variant=\"ActionBar\"\n          color={webview ? 'footerButton' : undefined}\n          ml={theme.dimensions.textIconMargin}\n          allowFontScaling={false}\n          accessible={false}>\n          {t(label)}\n        </TextView>\n      </Box>\n    </TouchableWithoutFeedback>\n  )\n}\n\nexport default BackButton\n";var i=n(7644);const l={},r=void 0,c={unversionedId:"Flagship design library/Components/Buttons and Links/BackButton",id:"Flagship design library/Components/Buttons and Links/BackButton",title:"BackButton",description:"",source:"@site/docs/Flagship design library/Components/Buttons and Links/BackButton.mdx",sourceDirName:"Flagship design library/Components/Buttons and Links",slug:"/Flagship design library/Components/Buttons and Links/BackButton",permalink:"/va-mobile-app/docs/Flagship design library/Components/Buttons and Links/BackButton",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Link",permalink:"/va-mobile-app/docs/Flagship design library/Components/Buttons and Links/ClickForActionLink"},next:{title:"Crisis Line button",permalink:"/va-mobile-app/docs/Flagship design library/Components/Buttons and Links/CrisisLineButton"}},u={},m=[],p="<BackButton \nonPress={() => {}} \nlabel={'BackButtonLabelConstants.back'} \ncanGoBack={true} \nshowCarat={true} \na11yHint={'a11yHint'}/>",d={toc:m,exampleString:p},b="wrapper";function h(e){let{components:t,...n}=e;return(0,a.yg)(b,(0,o.A)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,a.yg)(i.A,{componentName:"BackButton",example:p,codeString:s,mdxType:"ComponentTopInfo"}))}h.isMDXComponent=!0}}]);