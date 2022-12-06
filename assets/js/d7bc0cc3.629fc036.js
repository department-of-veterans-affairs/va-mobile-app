"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[8499],{38909:function(e,t,n){n.d(t,{Z:function(){return m}});var o=n(67294),l=n(19055),r=n(26396),i=n(58215),a=n(82224),c=n(36005),s=function(e){var t=e.props;return t?o.createElement(o.Fragment,null,c.ZP.isEmpty(t)?o.createElement("pre",{className:"preText"},"This component does not have props defined"):o.createElement("table",null,o.createElement("thead",null,o.createElement("tr",null,o.createElement("th",null,"Name"),o.createElement("th",null,"Type"),o.createElement("th",null,"Default Value"),o.createElement("th",null,"Required"),o.createElement("th",null,"Description"))),o.createElement("tbody",null,Object.keys(t).map((function(e){var n;return o.createElement("tr",{key:e},o.createElement("td",null,o.createElement("code",null,e)),o.createElement("td",{style:{minWidth:200}},null==(n=t[e].type)?void 0:n.name),o.createElement("td",null,t[e].defaultValue&&t[e].defaultValue.value.toString()),o.createElement("td",null,t[e].required?"Yes":"No"),o.createElement("td",null,t[e].description))}))))):null};function m(e){var t=(0,a.N)(e.componentName)[0],n=t.description,c=t.displayName,m=t.props,u="How to use the "+c+" component",d="Full code for the "+c+" component";return o.createElement(o.Fragment,null,n,o.createElement("br",null),o.createElement("br",null),o.createElement(r.Z,null,o.createElement(i.Z,{value:"props",label:"Properties"},o.createElement(s,{props:m})),o.createElement(i.Z,{value:"example",label:"Example"},e.example&&o.createElement(l.Z,{title:u,className:"language-tsx test"},e.example)),o.createElement(i.Z,{value:"code",label:"Source Code"},e.codeString&&o.createElement(l.Z,{title:d,className:"language-tsx"},e.codeString)),o.createElement(i.Z,{value:"accessibility",label:"Accessibility"},o.createElement("pre",{className:"preText"},e.accessibilityInfo))))}},92310:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return s},contentTitle:function(){return m},metadata:function(){return u},toc:function(){return d},exampleString:function(){return p},default:function(){return b}});var o=n(87462),l=n(63366),r=(n(67294),n(3905)),i=(n(19055),n(2809)),a=n(38909),c=["components"],s={},m=void 0,u={unversionedId:"Engineering/FrontEnd/ComponentsSection/Buttons and Links/AttachmentLink",id:"Engineering/FrontEnd/ComponentsSection/Buttons and Links/AttachmentLink",title:"AttachmentLink",description:"export const exampleString = `<AttachmentLink",source:"@site/docs/Engineering/FrontEnd/ComponentsSection/Buttons and Links/AttachmentLink.mdx",sourceDirName:"Engineering/FrontEnd/ComponentsSection/Buttons and Links",slug:"/Engineering/FrontEnd/ComponentsSection/Buttons and Links/AttachmentLink",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/ComponentsSection/Buttons and Links/AttachmentLink",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"TextView",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/ComponentsSection/Text Views/TextView"},next:{title:"BackButton",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/ComponentsSection/Buttons and Links/BackButton"}},d=[],p="<AttachmentLink\nname={'filename'}\nformattedSize={'byteSize'}\na11yHint={'a11yHint'}\na11yValue={'a11yValue'}\nonPress={() => {console.log('press function')}}\nload={true}\n/>",x={toc:d,exampleString:p};function b(e){var t=e.components,n=(0,l.Z)(e,c);return(0,r.kt)("wrapper",(0,o.Z)({},x,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)(a.Z,{componentName:"AttachmentLink",example:p,codeString:i.Z,mdxType:"ComponentTopInfo"}))}b.isMDXComponent=!0},2809:function(e,t){t.Z="import { AccessibilityRole } from 'react-native'\nimport React, { FC } from 'react'\n\nimport { Box, BoxProps, TextView } from './index'\nimport { VABorderColors } from 'styles/theme'\nimport { testIdProps } from 'utils/accessibility'\nimport { useTheme } from 'utils/hooks'\n\nexport type AlertBoxProps = {\n  /** color of the border */\n  border: keyof VABorderColors\n  /** body of the alert */\n  text?: string\n  /** optional bolded title text */\n  title?: string\n  /** optional accessibility label for the text */\n  textA11yLabel?: string\n  /** optional accessibility label for the title */\n  titleA11yLabel?: string\n  /** optional accessibility role for the title */\n  titleRole?: AccessibilityRole\n}\n\n/**\n * Displays content in a box styled as an alert\n */\nconst AlertBox: FC<AlertBoxProps> = ({ border, children, title, text, textA11yLabel, titleA11yLabel, titleRole }) => {\n  const theme = useTheme()\n\n  const boxProps: BoxProps = {\n    backgroundColor: 'alertBox',\n    borderLeftWidth: theme.dimensions.alertBorderWidth,\n    borderLeftColor: border,\n    py: 20,\n    px: 10,\n  }\n\n  const titleAccessibilityRole = titleRole ? titleRole : text || children ? 'header' : undefined\n\n  return (\n    <Box {...boxProps}>\n      {!!title && (\n        <Box {...testIdProps(titleA11yLabel || title)} accessibilityRole={titleAccessibilityRole} accessible={true}>\n          <TextView variant=\"MobileBodyBold\" mb={text ? theme.dimensions.standardMarginBetween : 0}>\n            {title}\n          </TextView>\n        </Box>\n      )}\n      {!!text && (\n        <Box accessible={true}>\n          <TextView {...testIdProps(textA11yLabel || text)} variant=\"MobileBody\">\n            {text}\n          </TextView>\n        </Box>\n      )}\n      {children}\n    </Box>\n  )\n}\n\nexport default AlertBox\n"}}]);