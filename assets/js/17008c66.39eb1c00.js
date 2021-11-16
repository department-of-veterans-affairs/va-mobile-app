"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[1851],{4475:function(e,n,o){o.r(n),o.d(n,{contentTitle:function(){return a},default:function(){return V},exampleString:function(){return m},frontMatter:function(){return l},metadata:function(){return p},toc:function(){return u}});var t=o(7462),r=o(3366),i=(o(7294),o(3905)),s=(o(9055),o(8909)),c=["components"],l={},a=void 0,p={unversionedId:"FrontEnd/ComponentsSection/VAScrollView",id:"FrontEnd/ComponentsSection/VAScrollView",isDocsHomePage:!1,title:"VAScrollView",description:"export const exampleString = `return (",source:"@site/docs/FrontEnd/ComponentsSection/VAScrollView.mdx",sourceDirName:"FrontEnd/ComponentsSection",slug:"/FrontEnd/ComponentsSection/VAScrollView",permalink:"/docs/FrontEnd/ComponentsSection/VAScrollView",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"VAImage",permalink:"/docs/FrontEnd/ComponentsSection/VAImage"},next:{title:"useAccessibilityFocus",permalink:"/docs/FrontEnd/CustomHooks/useAccessibilityFocus"}},u=[],m="return (\n    <VAScrollView>\n        <Box />\n    </VAScrollView>\n)",d={toc:u,exampleString:m};function V(e){var n=e.components,o=(0,r.Z)(e,c);return(0,i.kt)("wrapper",(0,t.Z)({},d,o,{components:n,mdxType:"MDXLayout"}),(0,i.kt)(s.Z,{componentName:"VAScrollView",example:m,codeString:"import { ScrollView, ScrollViewProps } from 'react-native'\nimport React, { FC, Ref } from 'react'\n\nimport { useSafeAreaInsets } from 'react-native-safe-area-context'\n\nexport type VAScrollViewProps = {\n  /** Optional reference prop to determine scroll position */\n  scrollViewRef?: Ref<ScrollView>\n} & ScrollViewProps\n\n/**A common component that provides a scrollable view. Use this instead of ScrollView. This component is a wrapper for react-native ScrollView that has a scrollbar styling fix */\nconst VAScrollView: FC<VAScrollViewProps> = (props) => {\n  const insets = useSafeAreaInsets()\n  const style = {\n    paddingRight: insets.right,\n    paddingLeft: insets.left,\n  }\n\n  return (\n    /**\n     * force scroll position by default to avoid visual bug where scrollbar appears in the center of a screen\n     * scrollIndicatorInsets is an iOS only prop, this bug only appears on iOS\n     */\n    <ScrollView ref={props.scrollViewRef} scrollIndicatorInsets={{ right: 1 }} {...props} style={style} />\n  )\n}\n\nexport default VAScrollView\n",mdxType:"ComponentTopInfo"}))}V.isMDXComponent=!0}}]);