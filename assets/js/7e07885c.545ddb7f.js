"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[2672],{9540:(e,s,n)=>{n.d(s,{d:()=>a});var t=n(72077);const a=e=>(0,t.Ay)()["docusaurus-plugin-react-docgen-typescript"].default.filter((s=>s.displayName===e))},11050:(e,s,n)=>{n.r(s),n.d(s,{assets:()=>d,contentTitle:()=>l,default:()=>u,exampleString:()=>m,frontMatter:()=>i,metadata:()=>t,toc:()=>c});const t=JSON.parse('{"id":"Engineering/FrontEnd/CustomHooks/useAutoScrollToElement","title":"useAutoScrollToElement","description":"","source":"@site/docs/Engineering/FrontEnd/CustomHooks/useAutoScrollToElement.mdx","sourceDirName":"Engineering/FrontEnd/CustomHooks","slug":"/Engineering/FrontEnd/CustomHooks/useAutoScrollToElement","permalink":"/va-mobile-app/docs/Engineering/FrontEnd/CustomHooks/useAutoScrollToElement","draft":false,"unlisted":false,"tags":[],"version":"current","frontMatter":{},"sidebar":"tutorialSidebar","previous":{"title":"useAttachments","permalink":"/va-mobile-app/docs/Engineering/FrontEnd/CustomHooks/useAttachments"},"next":{"title":"useBeforeNavBackListener","permalink":"/va-mobile-app/docs/Engineering/FrontEnd/CustomHooks/useBeforeNavBackListener"}}');var a=n(74848),r=n(28453),o=n(92179);const i={},l=void 0,d={},m="const [scrollRef, messageRef, scrollToSelectedMessage] = useAutoScrollToElement()\n\nuseEffect(() => {\n    if (!loading && isTransitionComplete) {\n      scrollToSelectedMessage()\n    }\n}, [loading, isTransitionComplete, scrollToSelectedMessage])\n\nexport const renderMessages = (message: SecureMessagingMessageAttributes, messagesById: SecureMessagingMessageMap, thread: Array<number>, messageRef?: Ref<View>): ReactNode => {\n  const threadMessages = thread.map((messageID) => messagesById[messageID]).sort((message1, message2) => (message1.sentDate < message2.sentDate ? -1 : 1))\n  return threadMessages.map(\n    (m) =>\n      m &&\n      m.messageId && (\n        <CollapsibleMessage\n          key={m.messageId}\n          message={m}\n          isInitialMessage={m.messageId === message.messageId}\n          collapsibleMessageRef={m.messageId === message.messageId ? messageRef : undefined}\n        />\n      ),\n  )\n}\n\nreturn (\n<>\n    <VAScrollView {...testIdProps('ViewMessage-page')} scrollViewRef={scrollRef}>\n    <Box mt={theme.dimensions.standardMarginBetween} mb={theme.dimensions.condensedMarginBetween}>\n        <Box borderColor={'primary'} borderBottomWidth={'default'} p={theme.dimensions.cardPadding}>\n        <TextView variant=\"BitterBoldHeading\" accessibilityRole={'header'}>\n            {formatSubject(category, subject, t)}\n        </TextView>\n        </Box>\n        {renderMessages(message, messagesById, thread, messageRef)}\n    </Box>\n    {replyExpired && (\n        <Box mt={theme.dimensions.standardMarginBetween} mx={theme.dimensions.gutter} mb={theme.dimensions.contentMarginBottom}>\n        <AlertWithHaptics variant={'warning'} header={t('secureMessaging.reply.youCanNoLonger')} description={t('secureMessaging.reply.olderThan45Days')}>\n            <Box mt={theme.dimensions.standardMarginBetween}>\n            <Button\n                label={t('secureMessaging.startNewMessage.new')}\n                onPress={onPressCompose}\n                a11yHint={t('secureMessaging.startNewMessage.new.a11yHint')}\n            />\n            </Box>\n        </AlertWithHaptics>\n        </Box>\n    )}\n    </VAScrollView>\n    {!replyExpired && <ReplyMessageButton messageID={messageID} />}\n</>\n)",c=[];function g(e){return(0,a.jsx)(o.A,{componentName:"useAutoScrollToElement",example:m})}function u(e={}){const{wrapper:s}={...(0,r.R)(),...e.components};return s?(0,a.jsx)(s,{...e,children:(0,a.jsx)(g,{...e})}):g()}},92179:(e,s,n)=>{n.d(s,{A:()=>m});n(96540);var t=n(58069),a=n(65537),r=n(79329),o=n(9540),i=n(84476),l=n(74848);const d=e=>{let{props:s}=e;return s?(0,l.jsx)(l.Fragment,{children:i.Ay.isEmpty(s)?(0,l.jsx)("pre",{className:"preText",children:"This component does not have param defined"}):(0,l.jsxs)("table",{children:[(0,l.jsx)("thead",{children:(0,l.jsxs)("tr",{children:[(0,l.jsx)("th",{children:"Param / Return"}),(0,l.jsx)("th",{children:"Description"})]})}),(0,l.jsx)("tbody",{children:Object.keys(s).map((e=>{return(0,l.jsxs)("tr",{children:[(0,l.jsx)("td",{children:(0,l.jsx)("code",{children:e})}),(0,l.jsx)("td",{children:"param"===e?(n=s[e],n.split("\n").map(((e,s)=>{let n=e.split("-");return(0,l.jsxs)("div",{children:[(0,l.jsx)("code",{children:n[0].trim()+":"}),"\ufeff"+n[1]]},s)}))):s[e]})]},e);var n}))})]})}):null};function m(e){const s=(0,o.d)(e.componentName),{description:n,displayName:i,tags:m}=s[0],c=`How to use the ${i} component`;return(0,l.jsx)(l.Fragment,{children:(0,l.jsxs)(a.A,{children:[(0,l.jsx)(r.A,{value:"description",label:"Description",children:(0,l.jsx)("pre",{className:"preText",children:n})}),(0,l.jsx)(r.A,{value:"params",label:"Params and Return",children:(0,l.jsx)(d,{props:m})}),(0,l.jsx)(r.A,{value:"example",label:"Example",children:e.example&&(0,l.jsx)(t.A,{title:c,className:"language-tsx test",children:e.example})})]})})}}}]);