"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[3550],{7800:function(e,t,n){n.d(t,{Z:function(){return c}});var a=n(7294),r=n(9055),s=n(6396),o=n(8215),l=n(2224),i=n(3490),u=function(e){var t=e.props;return t?a.createElement(a.Fragment,null,i.ZP.isEmpty(t)?a.createElement("pre",{className:"preText"},"This component does not have param defined"):a.createElement("table",null,a.createElement("thead",null,a.createElement("tr",null,a.createElement("th",null,"Param / Return"),a.createElement("th",null,"Description"))),a.createElement("tbody",null,Object.keys(t).map((function(e){return a.createElement("tr",{key:e},a.createElement("td",null,a.createElement("code",null,e)),a.createElement("td",null,"param"===e?t[e].split("\n").map((function(e,t){var n=e.split("-");return a.createElement("div",{key:t},a.createElement("code",null,n[0].trim()+":"),"\ufeff"+n[1])})):t[e]))}))))):null};function c(e){var t=(0,l.N)(e.componentName)[0],n=t.description,i=t.displayName,c=t.tags,m="How to use the "+i+" component";return a.createElement(a.Fragment,null,a.createElement(s.Z,null,a.createElement(o.Z,{value:"description",label:"Description"},a.createElement("pre",{className:"preText"},n)),a.createElement(o.Z,{value:"params",label:"Params and Return"},a.createElement(u,{props:c})),a.createElement(o.Z,{value:"example",label:"Example"},e.example&&a.createElement(r.Z,{title:m,className:"language-tsx test"},e.example))))}},747:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return i},contentTitle:function(){return u},metadata:function(){return c},toc:function(){return m},exampleString:function(){return d},default:function(){return g}});var a=n(7462),r=n(3366),s=(n(7294),n(3905)),o=n(7800),l=["components"],i={},u=void 0,c={unversionedId:"FrontEnd/CustomHooks/useValidateMessageWithSignature",id:"FrontEnd/CustomHooks/useValidateMessageWithSignature",isDocsHomePage:!1,title:"useValidateMessageWithSignature",description:"export const exampleString = `const validateMessage = useValidateMessageWithSignature()\\n",source:"@site/docs/FrontEnd/CustomHooks/useValidateMessageWithSignature.mdx",sourceDirName:"FrontEnd/CustomHooks",slug:"/FrontEnd/CustomHooks/useValidateMessageWithSignature",permalink:"/docs/FrontEnd/CustomHooks/useValidateMessageWithSignature",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"useTranslation",permalink:"/docs/FrontEnd/CustomHooks/useTranslation"},next:{title:"Checkbox",permalink:"/docs/FrontEnd/Icons/checkboxIcons"}},m=[],d="const validateMessage = useValidateMessageWithSignature()\n\n useEffect(() => {\n    navigation.setOptions({\n      headerLeft: (props): ReactNode => (\n        <BackButton\n          onPress={validateMessage(messageReply) ? goToCancel : navigation.goBack}\n          canGoBack={props.canGoBack}\n          label={BackButtonLabelConstants.cancel}\n          showCarat={false}\n        />\n      ),\n      headerRight: () => (\n        <SaveButton\n          onSave={() => {\n            setOnSaveDraftClicked(true)\n            setOnSendClicked(true)\n          }}\n          disabled={false}\n          a11yHint={t('secureMessaging.saveDraft.a11yHint')}\n        />\n      ),\n    })\n  })",p={toc:m,exampleString:d};function g(e){var t=e.components,n=(0,r.Z)(e,l);return(0,s.kt)("wrapper",(0,a.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,s.kt)(o.Z,{componentName:"useValidateMessageWithSignature",example:d,mdxType:"HooksInfo"}))}g.isMDXComponent=!0}}]);