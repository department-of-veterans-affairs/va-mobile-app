"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[4902],{7800:function(e,t,n){n.d(t,{Z:function(){return u}});var o=n(7294),r=n(9055),a=n(6396),s=n(8215),l=n(2224),c=n(3490),i=function(e){var t=e.props;return t?o.createElement(o.Fragment,null,c.ZP.isEmpty(t)?o.createElement("pre",{className:"preText"},"This component does not have param defined"):o.createElement("table",null,o.createElement("thead",null,o.createElement("tr",null,o.createElement("th",null,"Param / Return"),o.createElement("th",null,"Description"))),o.createElement("tbody",null,Object.keys(t).map((function(e){return o.createElement("tr",{key:e},o.createElement("td",null,o.createElement("code",null,e)),o.createElement("td",null,"param"===e?t[e].split("\n").map((function(e,t){var n=e.split("-");return o.createElement("div",{key:t},o.createElement("code",null,n[0].trim()+":"),"\ufeff"+n[1])})):t[e]))}))))):null};function u(e){var t=(0,l.N)(e.componentName)[0],n=t.description,c=t.displayName,u=t.tags,m="How to use the "+c+" component";return o.createElement(o.Fragment,null,o.createElement(a.Z,null,o.createElement(s.Z,{value:"description",label:"Description"},o.createElement("pre",{className:"preText"},n)),o.createElement(s.Z,{value:"params",label:"Params and Return"},o.createElement(i,{props:u})),o.createElement(s.Z,{value:"example",label:"Example"},e.example&&o.createElement(r.Z,{title:m,className:"language-tsx test"},e.example))))}},4992:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return c},contentTitle:function(){return i},metadata:function(){return u},toc:function(){return m},exampleString:function(){return p},default:function(){return E}});var o=n(7462),r=n(3366),a=(n(7294),n(3905)),s=n(7800),l=["components"],c={},i=void 0,u={unversionedId:"FrontEnd/CustomHooks/useFontScale",id:"FrontEnd/CustomHooks/useFontScale",isDocsHomePage:!1,title:"useFontScale",description:"export const exampleString = `const fs = useFontScale()\\n",source:"@site/docs/FrontEnd/CustomHooks/useFontScale.mdx",sourceDirName:"FrontEnd/CustomHooks",slug:"/FrontEnd/CustomHooks/useFontScale",permalink:"/docs/FrontEnd/CustomHooks/useFontScale",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"useExternalLink",permalink:"/docs/FrontEnd/CustomHooks/useExternalLink"},next:{title:"useHasCernerFacilities",permalink:"/docs/FrontEnd/CustomHooks/useHasCernerFacilities"}},m=[],p="const fs = useFontScale()\n\nconst boxProps: BoxProps = {\n    backgroundColor: getBgColor(phase, current),\n    height: fs(theme.dimensions.phaseIndicatorDiameter),\n    width: fs(theme.dimensions.phaseIndicatorDiameter),\n    borderRadius: fs(theme.dimensions.phaseIndicatorDiameter),\n    justifyContent: 'center',\n    textAlign: 'center',\n    mr: theme.dimensions.phaseIndicatorRightMargin,\n}\n",d={toc:m,exampleString:p};function E(e){var t=e.components,n=(0,r.Z)(e,l);return(0,a.kt)("wrapper",(0,o.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)(s.Z,{componentName:"useFontScale",example:p,mdxType:"HooksInfo"}))}E.isMDXComponent=!0}}]);