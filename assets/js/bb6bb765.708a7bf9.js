"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[3513],{9540:(n,e,t)=>{t.d(e,{d:()=>o});var s=t(72077);const o=n=>(0,s.Ay)()["docusaurus-plugin-react-docgen-typescript"].default.filter((e=>e.displayName===n))},64555:(n,e,t)=>{t.d(e,{A:()=>u});t(96540);var s=t(58069),o=t(65537),a=t(79329),i=t(9540),r=t(84476),c=t(74848);const l=n=>{let{props:e}=n;return e?(0,c.jsx)(c.Fragment,{children:r.Ay.isEmpty(e)?(0,c.jsx)("pre",{className:"preText",children:"This component does not have props defined"}):(0,c.jsxs)("table",{children:[(0,c.jsx)("thead",{children:(0,c.jsxs)("tr",{children:[(0,c.jsx)("th",{children:"Name"}),(0,c.jsx)("th",{children:"Type"}),(0,c.jsx)("th",{children:"Default Value"}),(0,c.jsx)("th",{children:"Required"}),(0,c.jsx)("th",{children:"Description"})]})}),(0,c.jsx)("tbody",{children:Object.keys(e).map((n=>(0,c.jsxs)("tr",{children:[(0,c.jsx)("td",{children:(0,c.jsx)("code",{children:n})}),(0,c.jsx)("td",{style:{minWidth:200},children:e[n].type?.name}),(0,c.jsx)("td",{children:e[n].defaultValue&&e[n].defaultValue.value.toString()}),(0,c.jsx)("td",{children:e[n].required?"Yes":"No"}),(0,c.jsx)("td",{children:e[n].description})]},n)))})]})}):null};function u(n){const e=(0,i.d)(n.componentName),{description:t,displayName:r,props:u}=e[0],d=`How to use the ${r} component`,p=`Full code for the ${r} component`;return(0,c.jsxs)(c.Fragment,{children:[t,(0,c.jsx)("br",{}),(0,c.jsx)("br",{}),(0,c.jsxs)(o.A,{children:[(0,c.jsx)(a.A,{value:"props",label:"Properties",children:(0,c.jsx)(l,{props:u})}),(0,c.jsx)(a.A,{value:"example",label:"Example",children:n.example&&(0,c.jsx)(s.A,{title:d,className:"language-tsx test",children:n.example})}),(0,c.jsx)(a.A,{value:"code",label:"Source Code",children:n.codeString&&(0,c.jsx)(s.A,{title:p,className:"language-tsx",children:n.codeString})}),(0,c.jsx)(a.A,{value:"accessibility",label:"Accessibility",children:(0,c.jsx)("pre",{className:"preText",children:n.accessibilityInfo})})]})]})}},96014:(n,e,t)=>{t.r(e),t.d(e,{assets:()=>u,contentTitle:()=>l,default:()=>b,exampleString:()=>d,frontMatter:()=>c,metadata:()=>s,toc:()=>p});const s=JSON.parse('{"id":"Flagship design library/Components/Buttons and Links/BackButton","title":"BackButton","description":"","source":"@site/docs/Flagship design library/Components/Buttons and Links/BackButton.mdx","sourceDirName":"Flagship design library/Components/Buttons and Links","slug":"/Flagship design library/Components/Buttons and Links/BackButton","permalink":"/va-mobile-app/docs/Flagship design library/Components/Buttons and Links/BackButton","draft":false,"unlisted":false,"tags":[],"version":"current","frontMatter":{},"sidebar":"tutorialSidebar","previous":{"title":"Link","permalink":"/va-mobile-app/docs/Flagship design library/Components/Buttons and Links/ClickForActionLink"},"next":{"title":"Crisis Line button","permalink":"/va-mobile-app/docs/Flagship design library/Components/Buttons and Links/CrisisLineButton"}}');var o=t(74848),a=t(28453);t(58069);const i="import React, { FC } from 'react'\nimport { useTranslation } from 'react-i18next'\nimport { TouchableWithoutFeedback } from 'react-native'\n\nimport { useFocusEffect } from '@react-navigation/native'\n\nimport { BackButtonLabel } from 'constants/backButtonLabels'\nimport { NAMESPACE } from 'constants/namespaces'\nimport { a11yHintProp } from 'utils/accessibility'\nimport { useAccessibilityFocus, useTheme } from 'utils/hooks'\n\nimport Box from './Box'\nimport TextView from './TextView'\n\n/**\n *  Signifies the props that need to be passed in to {@link BackButton}\n */\nexport type BackButtonProps = {\n  /** the onPress function for the back button */\n  onPress: (() => void) | undefined\n  /** a boolean indicating if the user has a screen to go back to; if false, the back button will be hidden */\n  canGoBack: boolean | undefined\n  /** translation key to use for the display text, as well as the testID for the component */\n  label: BackButtonLabel\n  /** optional param to add accessibility hint to back button */\n  a11yHint?: string\n  /** boolean to specify if we want accesibility to focus on the back button */\n  focusOnButton?: boolean\n  /** option testID */\n  backButtonTestID?: string\n\n  webview?: boolean\n}\n\n/**\n * Button used by the stack navigation to go back to the previous screen\n */\nexport const BackButton: FC<BackButtonProps> = ({\n  onPress,\n  canGoBack,\n  label,\n  a11yHint,\n  backButtonTestID,\n  focusOnButton = true,\n  webview,\n}) => {\n  const { t } = useTranslation(NAMESPACE.COMMON)\n  const theme = useTheme()\n\n  const [focusRef, setFocus] = useAccessibilityFocus<TouchableWithoutFeedback>()\n\n  useFocusEffect(focusOnButton ? setFocus : () => {})\n\n  if (!canGoBack) {\n    return null\n  }\n\n  const a11yHintPropParam = a11yHint ? a11yHint : t(`${label}.a11yHint`)\n\n  return (\n    <TouchableWithoutFeedback\n      ref={focusRef}\n      onPress={onPress}\n      accessibilityLabel={label}\n      {...a11yHintProp(a11yHintPropParam)}\n      accessibilityRole=\"button\"\n      accessible={true}\n      testID={backButtonTestID}>\n      <Box\n        display=\"flex\"\n        flexDirection=\"row\"\n        ml={theme.dimensions.headerButtonSpacing}\n        height={theme.dimensions.headerHeight}\n        alignItems={'center'}>\n        <TextView\n          variant=\"ActionBar\"\n          color={webview ? 'link' : undefined}\n          ml={theme.dimensions.textIconMargin}\n          allowFontScaling={false}\n          accessible={false}>\n          {t(label)}\n        </TextView>\n      </Box>\n    </TouchableWithoutFeedback>\n  )\n}\n\nexport default BackButton\n";var r=t(64555);const c={},l=void 0,u={},d="<BackButton \nonPress={() => {}} \nlabel={'BackButtonLabelConstants.back'} \ncanGoBack={true} \nshowCarat={true} \na11yHint={'a11yHint'}/>",p=[];function h(n){return(0,o.jsx)(r.A,{componentName:"BackButton",example:d,codeString:i})}function b(n={}){const{wrapper:e}={...(0,a.R)(),...n.components};return e?(0,o.jsx)(e,{...n,children:(0,o.jsx)(h,{...n})}):h()}}}]);