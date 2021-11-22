"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[3650],{115:function(e,n,t){t.r(n),t.d(n,{contentTitle:function(){return c},default:function(){return u},exampleString:function(){return g},frontMatter:function(){return m},metadata:function(){return p},toc:function(){return d}});var o=t(7462),a=t(3366),i=(t(7294),t(3905)),r=(t(9055),t(8909)),s=["components"],m={},c=void 0,p={unversionedId:"FrontEnd/ComponentsSection/VAImage",id:"FrontEnd/ComponentsSection/VAImage",isDocsHomePage:!1,title:"VAImage",description:"",source:"@site/docs/FrontEnd/ComponentsSection/VAImage.mdx",sourceDirName:"FrontEnd/ComponentsSection",slug:"/FrontEnd/ComponentsSection/VAImage",permalink:"/va-mobile-app/docs/FrontEnd/ComponentsSection/VAImage",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"VAIcon",permalink:"/va-mobile-app/docs/FrontEnd/ComponentsSection/VAIcon"},next:{title:"VAScrollView",permalink:"/va-mobile-app/docs/FrontEnd/ComponentsSection/VAScrollView"}},d=[],g="<VAImage name={'PaperCheck'} a11yLabel={'label'} marginX={10} />",l={toc:d,exampleString:g};function u(e){var n=e.components,t=(0,a.Z)(e,s);return(0,i.kt)("wrapper",(0,o.Z)({},l,t,{components:n,mdxType:"MDXLayout"}),(0,i.kt)(r.Z,{componentName:"VAImage",example:g,codeString:"import { Image, useWindowDimensions } from 'react-native'\nimport React, { FC } from 'react'\n\nimport { isIOS } from 'utils/platform'\nimport { testIdProps } from 'utils/accessibility'\nimport { useSafeAreaInsets } from 'react-native-safe-area-context'\n\n/**\n * Add images to './images' and in xcode('Images.xcassets') when new ones are added.\n * IOS does not handle images from local path correctly and needs to be added as an asset resource.\n * Width and height should match whatever the image is.\n */\nexport const VA_IMAGES_MAP = {\n  PaperCheck: {\n    width: 922,\n    height: 492,\n    source: isIOS() ? { uri: 'paperCheck' } : require('./images/paperCheck.png'),\n  },\n}\n/**\n *  Signifies the props that need to be passed in to {@link VAImage}\n */\nexport type VAImageProps = {\n  /** enum name of the image */\n  name: keyof typeof VA_IMAGES_MAP\n  /** accessibilityLabel for the overall component */\n  a11yLabel: string\n  /** margins for the image */\n  marginX: number\n}\n\n/**\n * A common component to display static images. New images need to be placed in VAImge/image and in Xcode under VAMobile/Images.xcassets. Examples/details can be found in VAImage component.\n *\n * @returns VAImage component\n */\nconst VAImage: FC<VAImageProps> = ({ name, a11yLabel, marginX }) => {\n  const safeAreaRightMargin = useSafeAreaInsets().right\n  const safeAreaLeftMargin = useSafeAreaInsets().left\n\n  // Subtracting safe area insets from image width\n  const width = useWindowDimensions().width - 2 * marginX - safeAreaLeftMargin - safeAreaRightMargin\n  const imageProps = VA_IMAGES_MAP[name]\n\n  if (!imageProps) {\n    return <></>\n  }\n\n  const ratio = width / imageProps.width\n\n  return (\n    <Image\n      source={imageProps.source}\n      style={{ width: width, height: imageProps.height * ratio }}\n      {...testIdProps(a11yLabel)}\n      accessibilityLabel={a11yLabel}\n      accessible={true}\n      accessibilityRole={'image'}\n    />\n  )\n}\n\nexport default VAImage\n",mdxType:"ComponentTopInfo"}))}u.isMDXComponent=!0}}]);