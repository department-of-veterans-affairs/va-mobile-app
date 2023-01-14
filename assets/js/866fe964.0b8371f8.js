"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[7234],{38909:function(e,t,n){n.d(t,{Z:function(){return c}});var o=n(67294),r=n(19055),i=n(26396),l=n(58215),a=n(82224),s=n(36005),u=function(e){var t=e.props;return t?o.createElement(o.Fragment,null,s.ZP.isEmpty(t)?o.createElement("pre",{className:"preText"},"This component does not have props defined"):o.createElement("table",null,o.createElement("thead",null,o.createElement("tr",null,o.createElement("th",null,"Name"),o.createElement("th",null,"Type"),o.createElement("th",null,"Default Value"),o.createElement("th",null,"Required"),o.createElement("th",null,"Description"))),o.createElement("tbody",null,Object.keys(t).map((function(e){var n;return o.createElement("tr",{key:e},o.createElement("td",null,o.createElement("code",null,e)),o.createElement("td",{style:{minWidth:200}},null==(n=t[e].type)?void 0:n.name),o.createElement("td",null,t[e].defaultValue&&t[e].defaultValue.value.toString()),o.createElement("td",null,t[e].required?"Yes":"No"),o.createElement("td",null,t[e].description))}))))):null};function c(e){var t=(0,a.N)(e.componentName)[0],n=t.description,s=t.displayName,c=t.props,m="How to use the "+s+" component",p="Full code for the "+s+" component";return o.createElement(o.Fragment,null,n,o.createElement("br",null),o.createElement("br",null),o.createElement(i.Z,null,o.createElement(l.Z,{value:"props",label:"Properties"},o.createElement(u,{props:c})),o.createElement(l.Z,{value:"example",label:"Example"},e.example&&o.createElement(r.Z,{title:m,className:"language-tsx test"},e.example)),o.createElement(l.Z,{value:"code",label:"Source Code"},e.codeString&&o.createElement(r.Z,{title:p,className:"language-tsx"},e.codeString)),o.createElement(l.Z,{value:"accessibility",label:"Accessibility"},o.createElement("pre",{className:"preText"},e.accessibilityInfo))))}},82224:function(e,t,n){n.d(t,{N:function(){return r}});var o=n(28084),r=function(e){return(0,o.default)()["docusaurus-plugin-react-docgen-typescript"].default.filter((function(t){return t.displayName===e}))}},76035:function(e,t,n){n.r(t),n.d(t,{contentTitle:function(){return u},default:function(){return f},exampleString:function(){return p},frontMatter:function(){return s},metadata:function(){return c},toc:function(){return m}});var o=n(87462),r=n(63366),i=(n(67294),n(3905)),l=(n(19055),n(38909)),a=["components"],s={},u=void 0,c={unversionedId:"UX/ComponentsSection/Uncategorized/AppVersionAndBuild",id:"UX/ComponentsSection/Uncategorized/AppVersionAndBuild",title:"AppVersionAndBuild",description:"",source:"@site/docs/UX/ComponentsSection/Uncategorized/AppVersionAndBuild.mdx",sourceDirName:"UX/ComponentsSection/Uncategorized",slug:"/UX/ComponentsSection/Uncategorized/AppVersionAndBuild",permalink:"/va-mobile-app/docs/UX/ComponentsSection/Uncategorized/AppVersionAndBuild",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"VABulletList",permalink:"/va-mobile-app/docs/UX/ComponentsSection/TextViews/VABulletList"},next:{title:"NotificationManager",permalink:"/va-mobile-app/docs/UX/ComponentsSection/Uncategorized/NotificationManager"}},m=[],p="<AppVersionAndBuild textColor={'primaryContrast'} />",d={toc:m,exampleString:p};function f(e){var t=e.components,n=(0,r.Z)(e,a);return(0,i.kt)("wrapper",(0,o.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)(l.Z,{componentName:"AppVersionAndBuild",example:p,codeString:"import { useTranslation } from 'react-i18next'\nimport React, { FC, useEffect, useState } from 'react'\n\nimport { Box, TextView } from 'components'\nimport { NAMESPACE } from 'constants/namespaces'\nimport { VATextColors, VATypographyThemeVariants } from 'styles/theme'\nimport { getBuildNumber, getVersionName } from 'utils/deviceData'\nimport { useTheme } from 'utils/hooks'\n\nexport type AppVersionAndBuildProps = {\n  /** color of the text */\n  textColor?: keyof VATextColors\n  /** font weight of the text */\n  textWeight?: keyof VATypographyThemeVariants\n}\n\n/**\n * Common component to display the apps version and build number\n */\nconst AppVersionAndBuild: FC<AppVersionAndBuildProps> = ({ textColor = 'bodyText', textWeight = 'MobileBody' }) => {\n  const { t } = useTranslation(NAMESPACE.COMMON)\n  const theme = useTheme()\n  const [versionName, setVersionName] = useState<string>()\n  const [buildNumber, setBuildNumber] = useState<number>()\n\n  useEffect(() => {\n    async function getVersionAndBuild() {\n      const version = await getVersionName()\n      const build = await getBuildNumber()\n      setVersionName(version)\n      setBuildNumber(build)\n    }\n\n    getVersionAndBuild()\n  }, [])\n\n  return (\n    <Box mb={theme.dimensions.contentMarginBottom} justifyContent={'center'} alignItems={'center'}>\n      <TextView variant={textWeight} flexDirection=\"row\" color={textColor}>\n        {t('versionAndBuild', { versionName, buildNumber })}\n      </TextView>\n    </Box>\n  )\n}\n\nexport default AppVersionAndBuild\n",mdxType:"ComponentTopInfo"}))}f.isMDXComponent=!0}}]);