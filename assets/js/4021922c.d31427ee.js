"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[8900],{38909:function(e,t,n){n.d(t,{Z:function(){return m}});var o=n(67294),i=n(19055),a=n(26396),r=n(58215),s=n(82224),l=n(36005),c=function(e){var t=e.props;return t?o.createElement(o.Fragment,null,l.ZP.isEmpty(t)?o.createElement("pre",{className:"preText"},"This component does not have props defined"):o.createElement("table",null,o.createElement("thead",null,o.createElement("tr",null,o.createElement("th",null,"Name"),o.createElement("th",null,"Type"),o.createElement("th",null,"Default Value"),o.createElement("th",null,"Required"),o.createElement("th",null,"Description"))),o.createElement("tbody",null,Object.keys(t).map((function(e){var n;return o.createElement("tr",{key:e},o.createElement("td",null,o.createElement("code",null,e)),o.createElement("td",{style:{minWidth:200}},null==(n=t[e].type)?void 0:n.name),o.createElement("td",null,t[e].defaultValue&&t[e].defaultValue.value.toString()),o.createElement("td",null,t[e].required?"Yes":"No"),o.createElement("td",null,t[e].description))}))))):null};function m(e){var t=(0,s.N)(e.componentName)[0],n=t.description,l=t.displayName,m=t.props,p="How to use the "+l+" component",u="Full code for the "+l+" component";return o.createElement(o.Fragment,null,n,o.createElement("br",null),o.createElement("br",null),o.createElement(a.Z,null,o.createElement(r.Z,{value:"props",label:"Properties"},o.createElement(c,{props:m})),o.createElement(r.Z,{value:"example",label:"Example"},e.example&&o.createElement(i.Z,{title:p,className:"language-tsx test"},e.example)),o.createElement(r.Z,{value:"code",label:"Source Code"},e.codeString&&o.createElement(i.Z,{title:u,className:"language-tsx"},e.codeString)),o.createElement(r.Z,{value:"accessibility",label:"Accessibility"},o.createElement("pre",{className:"preText"},e.accessibilityInfo))))}},82224:function(e,t,n){n.d(t,{N:function(){return i}});var o=n(28084),i=function(e){return(0,o.default)()["docusaurus-plugin-react-docgen-typescript"].default.filter((function(t){return t.displayName===e}))}},75915:function(e,t,n){n.r(t),n.d(t,{contentTitle:function(){return c},default:function(){return f},exampleString:function(){return u},frontMatter:function(){return l},metadata:function(){return m},toc:function(){return p}});var o=n(87462),i=n(63366),a=(n(67294),n(3905)),r=(n(19055),n(38909)),s=["components"],l={},c=void 0,m={unversionedId:"UX/ComponentsSection/Selection and Input/Form Elements/FormAttachments",id:"UX/ComponentsSection/Selection and Input/Form Elements/FormAttachments",title:"FormAttachments",description:"export const exampleString = `<FormAttachments",source:"@site/docs/UX/ComponentsSection/Selection and Input/Form Elements/FormAttachments.mdx",sourceDirName:"UX/ComponentsSection/Selection and Input/Form Elements",slug:"/UX/ComponentsSection/Selection and Input/Form Elements/FormAttachments",permalink:"/va-mobile-app/docs/UX/ComponentsSection/Selection and Input/Form Elements/FormAttachments",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Form Elements",permalink:"/va-mobile-app/docs/UX/ComponentsSection/Selection and Input/Form Elements/"},next:{title:"FormWrapper",permalink:"/va-mobile-app/docs/UX/ComponentsSection/Selection and Input/Form Elements/FormWrapper"}},p=[],u="<FormAttachments \nattachmentsList={[ { name: 'file.txt' }, { fileName: 'image.jpeg' } ]} \nremoveOnPress={() => {}} \nlargeButtonProps={{ label: 'add files', onPress: () => {} }} />",d={toc:p,exampleString:u};function f(e){var t=e.components,n=(0,i.Z)(e,s);return(0,a.kt)("wrapper",(0,o.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)(r.Z,{componentName:"FormAttachments",example:u,codeString:'import { Pressable } from \'react-native\'\nimport { useTranslation } from \'react-i18next\'\nimport React, { FC, ReactNode } from \'react\'\n\nimport { ImagePickerResponse } from \'react-native-image-picker/src/types\'\nimport _ from \'underscore\'\n\nimport { Box, ButtonTypesConstants, TextView, VAButton, VAButtonProps, VAIcon } from \'components/index\'\nimport { DocumentPickerResponse } from \'screens/BenefitsScreen/BenefitsStackScreens\'\nimport { NAMESPACE } from \'constants/namespaces\'\nimport { getFileDisplay } from \'utils/common\'\nimport { useRouteNavigation, useTheme } from \'utils/hooks\'\n\nexport type FormAttachmentsProps = {\n  /** header for page title display */\n  originHeader: string\n  /** callback called on click of remove link for an attachment */\n  removeOnPress?: (attachment: ImagePickerResponse | DocumentPickerResponse) => void\n  /** optional props for large button */\n  largeButtonProps?: Omit<VAButtonProps, \'iconProps\' | \'buttonType\'>\n  /** list of current attachments */\n  attachmentsList?: Array<ImagePickerResponse | DocumentPickerResponse>\n  /** optional a11y Hint */\n  a11yHint?: string\n}\n\n/**A common component for form attachments, displays Attachments heading with helper link, already attached items with remove option, and an optional large button. */\nconst FormAttachments: FC<FormAttachmentsProps> = ({ originHeader, removeOnPress, largeButtonProps, attachmentsList, a11yHint }) => {\n  const theme = useTheme()\n  const { t } = useTranslation(NAMESPACE.COMMON)\n  const { t: tFunction } = useTranslation()\n  const navigateTo = useRouteNavigation()\n\n  const renderFileNames = (): ReactNode => {\n    return _.map(attachmentsList || [], (attachment, index) => {\n      const { fileName, fileSize: formattedFileSize, fileSizeA11y } = getFileDisplay(attachment, tFunction, true)\n      const text = [fileName, formattedFileSize].join(\' \').trim()\n\n      return (\n        <Box\n          display="flex"\n          flexDirection="row"\n          justifyContent="space-between"\n          alignItems="center"\n          flexWrap="wrap"\n          mt={index !== 0 ? theme.dimensions.condensedMarginBetween : 0}\n          key={index}>\n          <Box display="flex" flexDirection="row" alignItems="center" flexWrap="wrap" justifyContent="space-between">\n            <VAIcon name="PaperClip" width={16} height={16} fill="spinner" />\n            <TextView variant="MobileBodyBold" ml={theme.dimensions.textIconMargin} accessibilityLabel={fileSizeA11y ? [fileName, fileSizeA11y].join(\' \').trim() : undefined}>\n              {text}\n            </TextView>\n          </Box>\n\n          <Pressable\n            onPress={() => (removeOnPress ? removeOnPress(attachment) : {})}\n            accessible={true}\n            accessibilityRole="link"\n            accessibilityHint={t(\'remove.a11yHint\', { content: fileName })}\n            accessibilityLabel={t(\'remove\')}>\n            <Box display="flex" flexDirection="row" alignItems="center" minHeight={theme.dimensions.touchableMinHeight}>\n              <VAIcon name="Remove" {...iconProps} />\n              <TextView variant="HelperText" ml={theme.dimensions.textIconMargin} color="link" textDecoration="underline" textDecorationColor="link">\n                {t(\'remove\')}\n              </TextView>\n            </Box>\n          </Pressable>\n        </Box>\n      )\n    })\n  }\n\n  const iconProps = {\n    width: 16,\n    height: 16,\n    fill: \'link\',\n  }\n\n  const attachmentsDoNotExist = !attachmentsList || attachmentsList.length === 0\n\n  const goToFaq = navigateTo(\'AttachmentsFAQ\', { originHeader: originHeader })\n\n  return (\n    <Box>\n      <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" flexWrap="wrap">\n        <TextView>{t(\'attachments\')}</TextView>\n        <Pressable onPress={goToFaq} accessible={true} accessibilityRole="link" accessibilityHint={a11yHint ? a11yHint : undefined} accessibilityLabel={t(\'howToAttachAFile\')}>\n          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" minHeight={theme.dimensions.touchableMinHeight}>\n            <VAIcon name="QuestionMark" {...iconProps} />\n            <TextView variant="HelperText" ml={theme.dimensions.textIconMargin} color="link" textDecoration="underline" textDecorationColor="link">\n              {t(\'howToAttachAFile\')}\n            </TextView>\n          </Box>\n        </Pressable>\n      </Box>\n      <Box mt={theme.dimensions.standardMarginBetween} mb={attachmentsDoNotExist || !largeButtonProps ? 0 : theme.dimensions.standardMarginBetween}>\n        {renderFileNames()}\n      </Box>\n      {!!largeButtonProps && <VAButton {...largeButtonProps} buttonType={ButtonTypesConstants.buttonSecondary} iconProps={{ ...iconProps, fill: \'active\', name: \'PaperClip\' }} />}\n    </Box>\n  )\n}\n\nexport default FormAttachments\n',mdxType:"ComponentTopInfo"}))}f.isMDXComponent=!0}}]);