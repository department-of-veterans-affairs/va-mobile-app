"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[7999],{7800:function(e,n,t){t.d(n,{Z:function(){return i}});var r=t(7294),o=t(9055),a=t(6396),l=t(8215),s=t(2224),u=t(3490),c=function(e){var n=e.props;return n?r.createElement(r.Fragment,null,u.ZP.isEmpty(n)?r.createElement("pre",{className:"preText"},"This component does not have param defined"):r.createElement("table",null,r.createElement("thead",null,r.createElement("tr",null,r.createElement("th",null,"Param / Return"),r.createElement("th",null,"Description"))),r.createElement("tbody",null,Object.keys(n).map((function(e){return r.createElement("tr",{key:e},r.createElement("td",null,r.createElement("code",null,e)),r.createElement("td",null,"param"===e?n[e].split("\n").map((function(e,n){var t=e.split("-");return r.createElement("div",{key:n},r.createElement("code",null,t[0].trim()+":"),"\ufeff"+t[1])})):n[e]))}))))):null};function i(e){var n=(0,s.N)(e.componentName)[0],t=n.description,u=n.displayName,i=n.tags,m="How to use the "+u+" component";return r.createElement(r.Fragment,null,r.createElement(a.Z,null,r.createElement(l.Z,{value:"description",label:"Description"},r.createElement("pre",{className:"preText"},t)),r.createElement(l.Z,{value:"params",label:"Params and Return"},r.createElement(c,{props:i})),r.createElement(l.Z,{value:"example",label:"Example"},e.example&&r.createElement(o.Z,{title:m,className:"language-tsx test"},e.example))))}},5614:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return u},contentTitle:function(){return c},metadata:function(){return i},toc:function(){return m},exampleString:function(){return p},default:function(){return d}});var r=t(7462),o=t(3366),a=(t(7294),t(3905)),l=t(7800),s=["components"],u={},c=void 0,i={unversionedId:"FrontEnd/CustomHooks/useExternalLink",id:"FrontEnd/CustomHooks/useExternalLink",isDocsHomePage:!1,title:"useExternalLink",description:"export const exampleString = ` const launchExternalLink = useExternalLink()\\n",source:"@site/docs/FrontEnd/CustomHooks/useExternalLink.mdx",sourceDirName:"FrontEnd/CustomHooks",slug:"/FrontEnd/CustomHooks/useExternalLink",permalink:"/docs/FrontEnd/CustomHooks/useExternalLink",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"useError",permalink:"/docs/FrontEnd/CustomHooks/useError"},next:{title:"useFontScale",permalink:"/docs/FrontEnd/CustomHooks/useFontScale"}},m=[],p=" const launchExternalLink = useExternalLink()\n\nconst onDecisionReview = async (): Promise<void> => {\n    launchExternalLink(LINK_URL_DECISION_REVIEWS)\n}",E={toc:m,exampleString:p};function d(e){var n=e.components,t=(0,o.Z)(e,s);return(0,a.kt)("wrapper",(0,r.Z)({},E,t,{components:n,mdxType:"MDXLayout"}),(0,a.kt)(l.Z,{componentName:"useExternalLink",example:p,mdxType:"HooksInfo"}))}d.isMDXComponent=!0}}]);