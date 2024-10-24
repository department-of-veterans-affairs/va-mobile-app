"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[7175],{20643:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>c,frontMatter:()=>o,metadata:()=>s,toc:()=>p});var n=a(58168),r=(a(96540),a(15680));const o={title:"Alert"},i=void 0,s={unversionedId:"Components/Alerts and progress/Alert",id:"Components/Alerts and progress/Alert",title:"Alert",description:"Alerts are an in-content way to keep users informed of important and sometimes time-sensitive changes.",source:"@site/design/Components/Alerts and progress/Alert.md",sourceDirName:"Components/Alerts and progress",slug:"/Components/Alerts and progress/Alert",permalink:"/va-mobile-app/design/Components/Alerts and progress/Alert",draft:!1,tags:[],version:"current",frontMatter:{title:"Alert"},sidebar:"tutorialSidebar",previous:{title:"Logos",permalink:"/va-mobile-app/design/Foundation/Logos"},next:{title:"Loading indicator",permalink:"/va-mobile-app/design/Components/Alerts and progress/LoadingIndicator"}},l={},p=[{value:"Examples",id:"examples",level:2},{value:"Informational",id:"informational",level:3},{value:"Success",id:"success",level:3},{value:"Warning",id:"warning",level:3},{value:"Error",id:"error",level:3},{value:"Usage",id:"usage",level:2},{value:"When to use Alert",id:"when-to-use-alert",level:3},{value:"When to consider something else",id:"when-to-consider-something-else",level:3},{value:"Choosing between variations",id:"choosing-between-variations",level:3},{value:"Placement",id:"placement",level:3},{value:"Code usage",id:"code-usage",level:2},{value:"Content considerations",id:"content-considerations",level:2},{value:"Accessibility considerations",id:"accessibility-considerations",level:2},{value:"Related",id:"related",level:2}],g={toc:p},m="wrapper";function c(e){let{components:t,...a}=e;return(0,r.yg)(m,(0,n.A)({},g,a,{components:t,mdxType:"MDXLayout"}),(0,r.yg)("p",null,"Alerts are an in-content way to keep users informed of important and sometimes time-sensitive changes."),(0,r.yg)("h2",{id:"examples"},"Examples"),(0,r.yg)("h3",{id:"informational"},"Informational"),(0,r.yg)("p",null,(0,r.yg)("strong",{parentName:"p"},"Open in"),": ",(0,r.yg)("a",{parentName:"p",href:"https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/docs/alert--info"},"Storybook"),"  |   ",(0,r.yg)("a",{parentName:"p",href:"https://www.figma.com/file/Zzt8z60hCtdEzXx2GFWghH/%F0%9F%93%90-Component-Library?type=design&node-id=253-1119&mode=design&t=gceZHkCGGR5VP79F-4"},"Figma")),(0,r.yg)("iframe",{width:"620",height:"450",title:"Image of component in Storybook",src:"https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/story/alert--info&full=1&shortcuts=false&singleStory=true",allowfullscreen:!0}),(0,r.yg)("h3",{id:"success"},"Success"),(0,r.yg)("p",null,(0,r.yg)("strong",{parentName:"p"},"Open in"),": ",(0,r.yg)("a",{parentName:"p",href:"https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/docs/alert--success"},"Storybook"),"  |   ",(0,r.yg)("a",{parentName:"p",href:"https://www.figma.com/file/Zzt8z60hCtdEzXx2GFWghH/%F0%9F%93%90-Component-Library?type=design&node-id=253-1098&mode=design&t=gceZHkCGGR5VP79F-4"},"Figma")),(0,r.yg)("iframe",{width:"620",height:"450",title:"Image of component in Storybook",src:"https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/story/alert--success&full=1&shortcuts=false&singleStory=true",allowfullscreen:!0}),(0,r.yg)("h3",{id:"warning"},"Warning"),(0,r.yg)("p",null,(0,r.yg)("strong",{parentName:"p"},"Open in"),": ",(0,r.yg)("a",{parentName:"p",href:"https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/docs/alert--warning"},"Storybook"),"  |   ",(0,r.yg)("a",{parentName:"p",href:"https://www.figma.com/file/Zzt8z60hCtdEzXx2GFWghH/%F0%9F%93%90-Component-Library?type=design&node-id=253-1077&mode=design&t=gceZHkCGGR5VP79F-4"},"Figma")),(0,r.yg)("iframe",{width:"620",height:"450",title:"Image of component in Storybook",src:"https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/story/alert--warning&full=1&shortcuts=false&singleStory=true",allowfullscreen:!0}),(0,r.yg)("h3",{id:"error"},"Error"),(0,r.yg)("p",null,(0,r.yg)("strong",{parentName:"p"},"Open in"),": ",(0,r.yg)("a",{parentName:"p",href:"https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/docs/alert--error"},"Storybook"),"  |   ",(0,r.yg)("a",{parentName:"p",href:"https://www.figma.com/file/Zzt8z60hCtdEzXx2GFWghH/%F0%9F%93%90-Component-Library?type=design&node-id=253-1056&mode=design&t=gceZHkCGGR5VP79F-4"},"Figma")),(0,r.yg)("iframe",{width:"620",height:"450",title:"Image of component in Storybook",src:"https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/story/alert--error&full=1&shortcuts=false&singleStory=true",allowfullscreen:!0}),(0,r.yg)("h2",{id:"usage"},"Usage"),(0,r.yg)("p",null,(0,r.yg)("a",{parentName:"p",href:"https://design.va.gov/components/alert"},"Refer to the VA Design System for usage guidance")),(0,r.yg)("h3",{id:"when-to-use-alert"},"When to use Alert"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("strong",{parentName:"li"},"To notify users about the status of the system"),(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("strong",{parentName:"li"},"System status messages"),". An alert may be a notification that keeps people informed of the status of the system and may or may not require the user to respond. Such notifications may be errors, warnings, and general updates."),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("strong",{parentName:"li"},"In-application system status"),". An exception to the above is providing information to the user, unprompted, about a problem with a particular application. These ",(0,r.yg)("a",{parentName:"li",href:"https://design.va.gov/content-style-guide/error-messages/system"},"system status messages")," typically use an error or warning variation and do not require user action."),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("strong",{parentName:"li"},"Access messages when a user tries to access an item that is not available to them"),". ",(0,r.yg)("a",{parentName:"li",href:"https://design.va.gov/content-style-guide/error-messages/access"},"Access messages")," typically warn the user that something they tried to access is not working correctly or is temporarily unavailable. These often use the error or warning variations."),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("strong",{parentName:"li"},"Mobile app only: System maintenance"),". On the website, most ",(0,r.yg)("a",{parentName:"li",href:"https://design.va.gov/content-style-guide/error-messages/system"},"system messages")," related to maintenance are handled by the ",(0,r.yg)("a",{parentName:"li",href:"https://design.va.gov/components/banner/maintenance"},"Banner - Maintenance")," component. On the mobile app, system maintenance messages use the Alert component."))),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("strong",{parentName:"li"},"To respond to a user\u2019s action"),(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("strong",{parentName:"li"},"Validation messages"),". An alert may be a validation message that informs a user they just took an action that needs to be corrected or a confirmation that a task was completed successfully."),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("strong",{parentName:"li"},"User feedback"),". Use Alert for ",(0,r.yg)("a",{parentName:"li",href:"https://design.va.gov/content-style-guide/error-messages/feedback"},"feedback messages")," that respond to an action a user has taken and to draw their attention to something that they need to correct or to confirm successful completion of a task. These messages use success and error variations."),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("strong",{parentName:"li"},"Immediate feedback to the user"),". When your application is using Javascript to provide an immediate response to the user without a full page/screen load. For example, this may include alerts that appear with inline form validation."))),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("strong",{parentName:"li"},"Engagement messages that nudge the user to enter or update data"),". ",(0,r.yg)("a",{parentName:"li",href:"https://design.va.gov/content-style-guide/error-messages/engagement"},"Engagement messages")," typically use the informational variation and ask the user to take an action."),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("strong",{parentName:"li"},"Mobile app only: Unprompted and in-page alerts"),". On the website, consider the ",(0,r.yg)("a",{parentName:"li",href:"https://design.va.gov/components/alert-expandable"},"Alert - Expandable")," component to draw attention to important information on the page that is not a response to user feedback. On the mobile app, use the expandable variation of the Alert component.")),(0,r.yg)("h3",{id:"when-to-consider-something-else"},"When to consider something else"),(0,r.yg)("p",null,"On the mobile app, always consider a native component before using an in-content Alert."),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("strong",{parentName:"li"},"Action Sheet"),". When the user takes an action in which the system needs to ",(0,r.yg)("strong",{parentName:"li"},"clarify their intent"),", use an ",(0,r.yg)("a",{parentName:"li",href:"https://developer.apple.com/design/human-interface-guidelines/action-sheets"},"action sheet")," (for both iOS and Android) to ",(0,r.yg)("strong",{parentName:"li"},"offer the user a choice in how to proceed"),"."),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("strong",{parentName:"li"},"Alert/dialogue"),". When the user chooses to do something that has ",(0,r.yg)("strong",{parentName:"li"},"serious consequences"),", use a native modal ",(0,r.yg)("a",{parentName:"li",href:"https://developer.apple.com/design/human-interface-guidelines/alerts"},"alert")," (for iOS) or ",(0,r.yg)("a",{parentName:"li",href:"https://m3.material.io/components/dialogs/overview"},"dialogue")," (for Android) to present the user with critical information related to that action."),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("strong",{parentName:"li"},"Snackbar"),". If a user action ",(0,r.yg)("strong",{parentName:"li"},"triggers an API call that is successful or results in an error"),", consider using a ",(0,r.yg)("a",{parentName:"li",href:"https://department-of-veterans-affairs.github.io/va-mobile-app/docs/Flagship%20design%20library/Components/Alerts%20and%20Progress/Snackbar/"},"Snackbar")," in addition to or instead of an Alert. The snackbar may allow users to take an action on the feedback such as trying again or undoing the action.")),(0,r.yg)("p",null,"On the mobile app, do not use the Alert component for:"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("strong",{parentName:"li"},"Sub-alerts on the page"),". On the website, when your page has more than 1 alert and you are using the Standard and Slim alerts to create a hierarchy of alerts. It is also appropriate to convey multiple statuses using a combination of headers, text, and the Slim alert variation. An example of a sub-alert is the ",(0,r.yg)("a",{parentName:"li",href:"https://design.va.gov/components/form/autosave"},"Autosave alert"),". On the mobile app, do not use sub-alerts.")),(0,r.yg)("p",null,"On the website and mobile app, do not use the Alert component for:"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("strong",{parentName:"li"},"Long forms"),". On long forms, always include in-line validation in addition to any error messages that appear at the top of the form."),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("strong",{parentName:"li"},"Destructive actions"),". If an action will result in destroying a user\u2019s work (for example, deleting an application) use a more intrusive pattern, such as a confirmation ",(0,r.yg)("a",{parentName:"li",href:"https://design.va.gov/components/modal"},"modal")," dialogue on the website or a native alert on the mobile app, to allow the user to confirm that this action is what they want."),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("strong",{parentName:"li"},"Clarifying background information"),". Use the ",(0,r.yg)("a",{parentName:"li",href:"https://design.va.gov/components/additional-info"},"Additional info")," component when clarifying outcomes for an input or a form question as well as providing background information. Keep in mind that Alert - Expandable should warrant an alert and be used sparingly. The value of any type of alert is diminished if the page is littered with alerts of equal weight.")),(0,r.yg)("h3",{id:"choosing-between-variations"},"Choosing between variations"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},"Use standard alerts for most use cases."),(0,r.yg)("li",{parentName:"ul"},"Use expandable alerts when the information is not a response to user feedback."),(0,r.yg)("li",{parentName:"ul"},"Use dismissible alerts when the content is informational and not specific to the user or their interaction. For example, displaying \u201cwhat\u2019s new\u201d content in the app.")),(0,r.yg)("h3",{id:"placement"},"Placement"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},"Alerts always appear near the top of the screen")),(0,r.yg)("h2",{id:"code-usage"},"Code usage"),(0,r.yg)("p",null,(0,r.yg)("a",{parentName:"p",href:"https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/docs/alert--docs"},"Open Storybook")),(0,r.yg)("h2",{id:"content-considerations"},"Content considerations"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},"The ",(0,r.yg)("a",{parentName:"li",href:"https://design.va.gov/components/alert#content-considerations"},"VA Design System's content considerations for alerts")," are appropriate for the mobile app with the following addition:",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},"VA no longer says, \u201cPlease\u201d in alerts when making a request of the user."))),(0,r.yg)("li",{parentName:"ul"},"The VA Design System also includes guidance on how to write error alerts. In particular, the section on ",(0,r.yg)("a",{parentName:"li",href:"https://design.va.gov/patterns/help-users-to/recover-from-errors#style-and-tone"},"style and tone")," provides help on how to write clear and conversational alerts.")),(0,r.yg)("h2",{id:"accessibility-considerations"},"Accessibility considerations"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},"Alerts should only be used when appropriate to do so. Do not use Alerts when a native alert would be best (i.e. native alert, dialogue, action sheet, snackbar, etc.)."),(0,r.yg)("li",{parentName:"ul"},"When using a screen reader, the Alert should announce itself as an alert with an indication of its role / importance (i.e. error, warning, informational, etc.)."),(0,r.yg)("li",{parentName:"ul"},"Alerts that have expanded / closed states must be announced by a screen reader."),(0,r.yg)("li",{parentName:"ul"},"Do not automatically dismiss an Alert based on a timer or time limit."),(0,r.yg)("li",{parentName:"ul"},"Use alternative text (alt text) for any icons that are not considered decorative."),(0,r.yg)("li",{parentName:"ul"},"No buttons should be disabled within an Alert."),(0,r.yg)("li",{parentName:"ul"},"Focusable elements within an Alert should include: heading, body copy, phone numbers, and buttons."),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("a",{parentName:"li",href:"https://reactnative.dev/docs/accessibility#accessibilitylabel"},"accessibilityLabel")," and ",(0,r.yg)("a",{parentName:"li",href:"https://reactnative.dev/docs/accessibility#accessibilitylabelledby-android"},"accessibilityLabelledBy")," should be used where appropriate.")),(0,r.yg)("h2",{id:"related"},"Related"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("a",{parentName:"li",href:"https://department-of-veterans-affairs.github.io/va-mobile-app/docs/Flagship%20design%20library/Patterns/confirmation-messages/"},"Native alerts")),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("a",{parentName:"li",href:"https://department-of-veterans-affairs.github.io/va-mobile-app/docs/Flagship%20design%20library/Components/Alerts%20and%20Progress/Snackbar"},"Snackbar"))))}c.isMDXComponent=!0},15680:(e,t,a)=>{a.d(t,{xA:()=>g,yg:()=>u});var n=a(96540);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},o=Object.keys(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var l=n.createContext({}),p=function(e){var t=n.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):i(i({},t),e)),a},g=function(e){var t=p(e.components);return n.createElement(l.Provider,{value:t},e.children)},m="mdxType",c={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,o=e.originalType,l=e.parentName,g=s(e,["components","mdxType","originalType","parentName"]),m=p(a),d=r,u=m["".concat(l,".").concat(d)]||m[d]||c[d]||o;return a?n.createElement(u,i(i({ref:t},g),{},{components:a})):n.createElement(u,i({ref:t},g))}));function u(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=a.length,i=new Array(o);i[0]=d;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[m]="string"==typeof e?e:r,i[1]=s;for(var p=2;p<o;p++)i[p]=a[p];return n.createElement.apply(null,i)}return n.createElement.apply(null,a)}d.displayName="MDXCreateElement"}}]);