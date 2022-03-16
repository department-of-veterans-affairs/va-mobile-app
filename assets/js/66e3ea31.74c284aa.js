"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[2555],{38909:function(e,n,t){t.d(n,{Z:function(){return c}});var a=t(67294),r=t(19055),o=t(26396),i=t(58215),l=t(82224),s=t(36005),m=function(e){var n=e.props;return n?a.createElement(a.Fragment,null,s.ZP.isEmpty(n)?a.createElement("pre",{className:"preText"},"This component does not have props defined"):a.createElement("table",null,a.createElement("thead",null,a.createElement("tr",null,a.createElement("th",null,"Name"),a.createElement("th",null,"Type"),a.createElement("th",null,"Default Value"),a.createElement("th",null,"Required"),a.createElement("th",null,"Description"))),a.createElement("tbody",null,Object.keys(n).map((function(e){var t;return a.createElement("tr",{key:e},a.createElement("td",null,a.createElement("code",null,e)),a.createElement("td",{style:{minWidth:200}},null==(t=n[e].type)?void 0:t.name),a.createElement("td",null,n[e].defaultValue&&n[e].defaultValue.value.toString()),a.createElement("td",null,n[e].required?"Yes":"No"),a.createElement("td",null,n[e].description))}))))):null};function c(e){var n=(0,l.N)(e.componentName)[0],t=n.description,s=n.displayName,c=n.props,u="How to use the "+s+" component",p="Full code for the "+s+" component";return a.createElement(a.Fragment,null,t,a.createElement("br",null),a.createElement("br",null),a.createElement(o.Z,null,a.createElement(i.Z,{value:"props",label:"Properties"},a.createElement(m,{props:c})),a.createElement(i.Z,{value:"example",label:"Example"},e.example&&a.createElement(r.Z,{title:u,className:"language-tsx test"},e.example)),a.createElement(i.Z,{value:"code",label:"Source Code"},e.codeString&&a.createElement(r.Z,{title:p,className:"language-tsx"},e.codeString)),a.createElement(i.Z,{value:"accessibility",label:"Accessibility"},a.createElement("pre",{className:"preText"},e.accessibilityInfo))))}},6097:function(e,n,t){t.r(n),t.d(n,{contentTitle:function(){return m},default:function(){return g},exampleString:function(){return p},frontMatter:function(){return s},metadata:function(){return c},toc:function(){return u}});var a=t(87462),r=t(63366),o=(t(67294),t(3905)),i=(t(19055),t(38909)),l=["components"],s={},m=void 0,c={unversionedId:"Engineering/FrontEnd/ComponentsSection/VAImage",id:"Engineering/FrontEnd/ComponentsSection/VAImage",title:"VAImage",description:"",source:"@site/docs/Engineering/FrontEnd/ComponentsSection/VAImage.mdx",sourceDirName:"Engineering/FrontEnd/ComponentsSection",slug:"/Engineering/FrontEnd/ComponentsSection/VAImage",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/ComponentsSection/VAImage",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"VAIcon",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/ComponentsSection/VAIcon"},next:{title:"VAScrollView",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/ComponentsSection/VAScrollView"}},u=[],p="<VAImage name={'PaperCheck'} a11yLabel={'label'} marginX={10} />",d={toc:u,exampleString:p};function g(e){var n=e.components,t=(0,r.Z)(e,l);return(0,o.kt)("wrapper",(0,a.Z)({},d,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)(i.Z,{componentName:"VAImage",example:p,codeString:"import { Image, useWindowDimensions } from 'react-native'\nimport React, { FC } from 'react'\n\nimport { testIdProps } from 'utils/accessibility'\nimport { useSafeAreaInsets } from 'react-native-safe-area-context'\n\n/**\n * Add images to android('res/drawable') and in xcode('Images.xcassets') when new ones are added.\n * Android and IOS are not rendering using local path(ex. require('./images/asset.png')) and needs to be added as an asset resource.\n * Width and height should match whatever the image is.\n */\nexport const VA_IMAGES_MAP = {\n  PaperCheck: {\n    width: 922,\n    height: 492,\n    source: { uri: 'paper_check' },\n  },\n}\n/**\n *  Signifies the props that need to be passed in to {@link VAImage}\n */\nexport type VAImageProps = {\n  /** enum name of the image */\n  name: keyof typeof VA_IMAGES_MAP\n  /** accessibilityLabel for the overall component */\n  a11yLabel: string\n  /** margins for the image */\n  marginX: number\n}\n\n/**\n * A common component to display static images. New images need to be placed in VAImge/image and in Xcode under VAMobile/Images.xcassets. Examples/details can be found in VAImage component.\n *\n * @returns VAImage component\n */\nconst VAImage: FC<VAImageProps> = ({ name, a11yLabel, marginX }) => {\n  const safeAreaRightMargin = useSafeAreaInsets().right\n  const safeAreaLeftMargin = useSafeAreaInsets().left\n\n  // Subtracting safe area insets from image width\n  const width = useWindowDimensions().width - 2 * marginX - safeAreaLeftMargin - safeAreaRightMargin\n  const imageProps = VA_IMAGES_MAP[name]\n\n  if (!imageProps) {\n    return <></>\n  }\n\n  const ratio = width / imageProps.width\n\n  return (\n    <Image\n      source={imageProps.source}\n      style={{ width: width, height: imageProps.height * ratio }}\n      {...testIdProps(a11yLabel)}\n      accessibilityLabel={a11yLabel}\n      accessible={true}\n      accessibilityRole={'image'}\n    />\n  )\n}\n\nexport default VAImage\n",mdxType:"ComponentTopInfo"}))}g.isMDXComponent=!0}}]);