"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[1622],{7644:(e,t,n)=>{n.d(t,{A:()=>p});var r=n(96540),l=n(54610),o=n(3384),a=n(31347),i=n(28057),s=n(84476);const c=e=>{let{props:t}=e;return t?r.createElement(r.Fragment,null,s.Ay.isEmpty(t)?r.createElement("pre",{className:"preText"},"This component does not have props defined"):r.createElement("table",null,r.createElement("thead",null,r.createElement("tr",null,r.createElement("th",null,"Name"),r.createElement("th",null,"Type"),r.createElement("th",null,"Default Value"),r.createElement("th",null,"Required"),r.createElement("th",null,"Description"))),r.createElement("tbody",null,Object.keys(t).map((e=>r.createElement("tr",{key:e},r.createElement("td",null,r.createElement("code",null,e)),r.createElement("td",{style:{minWidth:200}},t[e].type?.name),r.createElement("td",null,t[e].defaultValue&&t[e].defaultValue.value.toString()),r.createElement("td",null,t[e].required?"Yes":"No"),r.createElement("td",null,t[e].description))))))):null};function p(e){const t=(0,i.d)(e.componentName),{description:n,displayName:s,props:p}=t[0],m=`How to use the ${s} component`,u=`Full code for the ${s} component`;return r.createElement(r.Fragment,null,n,r.createElement("br",null),r.createElement("br",null),r.createElement(o.A,null,r.createElement(a.A,{value:"props",label:"Properties"},r.createElement(c,{props:p})),r.createElement(a.A,{value:"example",label:"Example"},e.example&&r.createElement(l.A,{title:m,className:"language-tsx test"},e.example)),r.createElement(a.A,{value:"code",label:"Source Code"},e.codeString&&r.createElement(l.A,{title:u,className:"language-tsx"},e.codeString)),r.createElement(a.A,{value:"accessibility",label:"Accessibility"},r.createElement("pre",{className:"preText"},e.accessibilityInfo))))}},28057:(e,t,n)=>{n.d(t,{d:()=>l});var r=n(2736);const l=e=>(0,r.Ay)()["docusaurus-plugin-react-docgen-typescript"].default.filter((t=>t.displayName===e))},57342:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>s,default:()=>h,exampleString:()=>u,frontMatter:()=>i,metadata:()=>c,toc:()=>m});var r=n(58168),l=(n(96540),n(15680));n(41873),n(54610);const o="import React, { FC } from 'react'\nimport { useEffect } from 'react'\nimport { useTranslation } from 'react-i18next'\nimport { ViewStyle } from 'react-native'\n\nimport { AlertWithHaptics, Box, ClickToCallPhoneNumber, TextView, VAScrollView } from 'components'\nimport { Events } from 'constants/analytics'\nimport { NAMESPACE } from 'constants/namespaces'\nimport { a11yLabelID, a11yLabelVA } from 'utils/a11yLabel'\nimport { logAnalyticsEvent } from 'utils/analytics'\nimport { displayedTextPhoneNumber } from 'utils/formattingUtils'\nimport { useTheme } from 'utils/hooks'\n\nexport type CallHelpCenterProps = {\n  /** optional function called when the Try again button is pressed */\n  onTryAgain?: () => void\n  /** optional text for the title */\n  titleText?: string\n  /** optional title a11y hint*/\n  titleA11yHint?: string\n  /** optional text for the error */\n  errorText?: string\n  /** optional a11y hint for the error */\n  errorA11y?: string\n  /** optional phone number */\n  callPhone?: string\n}\n\n/**A common component to show the help center contact info for when an error happens*/\nconst CallHelpCenter: FC<CallHelpCenterProps> = ({\n  onTryAgain,\n  titleText,\n  titleA11yHint,\n  errorText,\n  errorA11y,\n  callPhone,\n}) => {\n  const { t } = useTranslation(NAMESPACE.COMMON)\n  const theme = useTheme()\n\n  const scrollStyles: ViewStyle = {\n    justifyContent: 'center',\n  }\n\n  const containerStyles = {\n    mt: theme.dimensions.contentMarginTop,\n    mb: theme.dimensions.contentMarginBottom,\n  }\n  useEffect(() => {\n    logAnalyticsEvent(Events.vama_fail())\n  }, [])\n\n  const tryAgain = () => {\n    logAnalyticsEvent(Events.vama_fail_refresh())\n    if (onTryAgain) {\n      onTryAgain()\n    }\n  }\n\n  return (\n    <VAScrollView contentContainerStyle={scrollStyles}>\n      <Box justifyContent=\"center\" {...containerStyles}>\n        <AlertWithHaptics\n          variant=\"error\"\n          header={titleText ? titleText : t('errors.callHelpCenter.vaAppNotWorking')}\n          headerA11yLabel={titleA11yHint ? titleA11yHint : a11yLabelVA(t('errors.callHelpCenter.vaAppNotWorking'))}\n          description={onTryAgain ? t('errors.callHelpCenter.sorryWithRefresh') : t('errors.callHelpCenter.sorry')}\n          primaryButton={onTryAgain && { label: t('refresh'), onPress: tryAgain, testID: t('refresh') }}>\n          <Box>\n            <TextView\n              variant=\"MobileBody\"\n              paragraphSpacing={true}\n              accessibilityLabel={errorA11y ? errorA11y : t('errors.callHelpCenter.informationLine.a11yLabel')}>\n              {errorText ? errorText : t('errors.callHelpCenter.informationLine')}\n            </TextView>\n            <ClickToCallPhoneNumber\n              a11yLabel={a11yLabelID(callPhone || t('8006982411'))}\n              displayedText={callPhone ? undefined : displayedTextPhoneNumber(t('8006982411'))}\n              phone={callPhone ? callPhone : t('8006982411')}\n            />\n          </Box>\n        </AlertWithHaptics>\n      </Box>\n    </VAScrollView>\n  )\n}\n\nexport default CallHelpCenter\n";var a=n(7644);const i={},s=void 0,c={unversionedId:"Flagship design library/Components/Errors/CallHelpCenter",id:"Flagship design library/Components/Errors/CallHelpCenter",title:"CallHelpCenter",description:"",source:"@site/docs/Flagship design library/Components/Errors/CallHelpCenter.mdx",sourceDirName:"Flagship design library/Components/Errors",slug:"/Flagship design library/Components/Errors/CallHelpCenter",permalink:"/va-mobile-app/docs/Flagship design library/Components/Errors/CallHelpCenter",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"BasicError",permalink:"/va-mobile-app/docs/Flagship design library/Components/Errors/BasicError"},next:{title:"DowntimeError",permalink:"/va-mobile-app/docs/Flagship design library/Components/Errors/DowntimeError"}},p={},m=[],u="<CallHelpCenter\n    titleText={t('profile:disabilityRating.errorTitle')}\n    titleA11yHint={t('profile:disabilityRating.errorTitleA11y')}\n    callPhone={t('profile:disabilityRating.errorPhoneNumber')}\n/>",y={toc:m,exampleString:u},d="wrapper";function h(e){let{components:t,...n}=e;return(0,l.yg)(d,(0,r.A)({},y,n,{components:t,mdxType:"MDXLayout"}),(0,l.yg)(a.A,{componentName:"CallHelpCenter",example:u,codeString:o,mdxType:"ComponentTopInfo"}))}h.isMDXComponent=!0}}]);