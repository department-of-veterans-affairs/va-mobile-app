"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[4163],{74705:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>r,default:()=>h,frontMatter:()=>o,metadata:()=>l,toc:()=>p});var a=n(58168),i=(n(96540),n(15680));const o={title:"Link"},r=void 0,l={unversionedId:"Components/Buttons and links/Link",id:"Components/Buttons and links/Link",title:"Link",description:"A link is a navigation element that can appear alone, inline (embedded), or in a group with other links. A link can trigger a download, but in general links go to internal or external pages when clicked.",source:"@site/design/Components/Buttons and links/Link.md",sourceDirName:"Components/Buttons and links",slug:"/Components/Buttons and links/Link",permalink:"/va-mobile-app/design/Components/Buttons and links/Link",draft:!1,tags:[],version:"current",frontMatter:{title:"Link"},sidebar:"tutorialSidebar",previous:{title:"Button",permalink:"/va-mobile-app/design/Components/Buttons and links/Button"},next:{title:"Segmented control",permalink:"/va-mobile-app/design/Components/Navigation/Secondary/SegmentedControl"}},s={},p=[{value:"Examples",id:"examples",level:2},{value:"Default",id:"default",level:3},{value:"Default (with icon)",id:"default-with-icon",level:3},{value:"Additional variants",id:"additional-variants",level:3},{value:"Usage",id:"usage",level:2},{value:"When to use Links",id:"when-to-use-links",level:3},{value:"When to consider something else",id:"when-to-consider-something-else",level:3},{value:"Behavior",id:"behavior",level:3},{value:"Choosing between variations",id:"choosing-between-variations",level:3},{value:"Code usage",id:"code-usage",level:2},{value:"Content considerations",id:"content-considerations",level:2},{value:"Accessibility considerations",id:"accessibility-considerations",level:2},{value:"Related",id:"related",level:2},{value:"Differences with VADS",id:"differences-with-vads",level:2}],g={toc:p},m="wrapper";function h(e){let{components:t,...n}=e;return(0,i.yg)(m,(0,a.A)({},g,n,{components:t,mdxType:"MDXLayout"}),(0,i.yg)("p",null,"A link is a navigation element that can appear alone, inline (embedded), or in a group with other links. A link can trigger a download, but in general links go to internal or external pages when clicked."),(0,i.yg)("h2",{id:"examples"},"Examples"),(0,i.yg)("h3",{id:"default"},"Default"),(0,i.yg)("p",null,(0,i.yg)("strong",{parentName:"p"},"Open in"),": ",(0,i.yg)("a",{parentName:"p",href:"https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/docs/link--default"},"Storybook"),"  |   ",(0,i.yg)("a",{parentName:"p",href:"https://www.figma.com/file/Zzt8z60hCtdEzXx2GFWghH/%F0%9F%93%90-Component-Library?type=design&node-id=235-771&mode=design&t=CNVVTHmCkOFHUVbq-4"},"Figma")),(0,i.yg)("iframe",{width:"620",height:"",title:"Image of component in Storybook",src:"https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/story/link--default&full=1&shortcuts=false&singleStory=true",allowfullscreen:!0}),(0,i.yg)("h3",{id:"default-with-icon"},"Default (with icon)"),(0,i.yg)("p",null,(0,i.yg)("strong",{parentName:"p"},"Open in"),": ",(0,i.yg)("a",{parentName:"p",href:"https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/docs/link--default-with-icon"},"Storybook"),"  |   ",(0,i.yg)("a",{parentName:"p",href:"https://www.figma.com/file/Zzt8z60hCtdEzXx2GFWghH/%F0%9F%93%90-Component-Library?type=design&node-id=235-772&mode=design&t=CNVVTHmCkOFHUVbq-4"},"Figma")),(0,i.yg)("iframe",{width:"620",height:"",title:"Image of component in Storybook",src:"https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/story/link--default-with-icon&full=1&shortcuts=false&singleStory=true",allowfullscreen:!0}),(0,i.yg)("h3",{id:"additional-variants"},"Additional variants"),(0,i.yg)("ul",null,(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("a",{parentName:"li",href:"https://department-of-veterans-affairs.github.io/va-mobile-library/iframe.html?args=&id=link--attachment&viewMode=story"},"Attachment")),(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("a",{parentName:"li",href:"https://department-of-veterans-affairs.github.io/va-mobile-library/iframe.html?args=&id=link--calendar&viewMode=story"},"Calendar")),(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("a",{parentName:"li",href:"https://department-of-veterans-affairs.github.io/va-mobile-library/iframe.html?args=&id=link--directions&viewMode=story"},"Directions")),(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("a",{parentName:"li",href:"https://department-of-veterans-affairs.github.io/va-mobile-library/iframe.html?args=&id=link--external-link&viewMode=story"},"External link")),(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("a",{parentName:"li",href:"https://department-of-veterans-affairs.github.io/va-mobile-library/iframe.html?args=&id=link--phone&viewMode=story"},"Phone")),(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("a",{parentName:"li",href:"https://department-of-veterans-affairs.github.io/va-mobile-library/iframe.html?args=&id=link--phone-tty&viewMode=story"},"Phone TTY")),(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("a",{parentName:"li",href:"https://department-of-veterans-affairs.github.io/va-mobile-library/iframe.html?args=&id=link--text&viewMode=story"},"Text"))),(0,i.yg)("h2",{id:"usage"},"Usage"),(0,i.yg)("h3",{id:"when-to-use-links"},"When to use Links"),(0,i.yg)("ul",null,(0,i.yg)("li",{parentName:"ul"},"Refer to the ",(0,i.yg)("a",{parentName:"li",href:"https://design.va.gov/components/link/#usage"},"VA Design System for usage guidance"))),(0,i.yg)("h3",{id:"when-to-consider-something-else"},"When to consider something else"),(0,i.yg)("ul",null,(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("strong",{parentName:"li"},"Use buttons for actions"),". Use a ",(0,i.yg)("a",{parentName:"li",href:"https://design.va.gov/components/button"},"Button")," when you want to make a state change or submit a form. Example actions include, but are not limited to, \u201cAdd\u201d, \u201cClose\u201d, \u201cCancel\u201d, or \u201cSave\u201d. Buttons ",(0,i.yg)("strong",{parentName:"li"},"do things"),", links ",(0,i.yg)("strong",{parentName:"li"},"go places"),". Refer to guidance on ",(0,i.yg)("a",{parentName:"li",href:"https://design.va.gov/components/link/action#links-vs-buttons"},"Links vs. buttons")),(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("strong",{parentName:"li"},"Use action links for calls-to-action"),". On the website, when you want to draw attention to an important call-to-action (CTA) on the page, such as a link that launches a benefit application, use an ",(0,i.yg)("a",{parentName:"li",href:"https://design.va.gov/components/link/action"},"Action link"),". Calls-to-action are not actions themselves (see the previous point). On the mobile app, use a Link or Button component instead."),(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("strong",{parentName:"li"},"Table of contents"),". On the website, when you want to make a long page of content with two or more H2s easier to navigate, use an ",(0,i.yg)("a",{parentName:"li",href:"https://design.va.gov/components/on-this-page"},"On this page link"),". On the mobile app, avoid long pages of content that might require a table of contents."),(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("strong",{parentName:"li"},"Triggering the generation of a PDF"),". When using for a PDF, use only for linking directly to a PDF, not as a trigger for a process that generates a PDF. For ",(0,i.yg)("a",{parentName:"li",href:"https://design.va.gov/components/link/#links-vs-buttons"},"generating a PDF, use a button"),".")),(0,i.yg)("h3",{id:"behavior"},"Behavior"),(0,i.yg)("ul",null,(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("strong",{parentName:"li"},"On the website"),(0,i.yg)("ul",{parentName:"li"},(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("strong",{parentName:"li"},"Open VA.gov links in the same window except in certain instances"),". VA.gov links should open in a new tab only if clicking the link will result in the user losing progress or data. Otherwise, links should open in the same window. See ",(0,i.yg)("a",{parentName:"li",href:"https://design.va.gov/content-style-guide/links/#linking-to-external-sites"},"linking to external sites")," in the content style guide for additional information."),(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("strong",{parentName:"li"},"Use semantically appropriate encodings"),". Encode email and phone links with mailto: and tel:, respectively."))),(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("strong",{parentName:"li"},"On the mobile app"),(0,i.yg)("ul",{parentName:"li"},(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("strong",{parentName:"li"},"Links open in the app"),(0,i.yg)("ul",{parentName:"li"},(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("strong",{parentName:"li"},"Links open in a full panel")," if the content is within the app."),(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("strong",{parentName:"li"},"Links open in a webview")," if the content is not within the app and the user does not need a separate sign in to access the content."))),(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("strong",{parentName:"li"},"Links open another app"),(0,i.yg)("ul",{parentName:"li"},(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("strong",{parentName:"li"},"Links open in the ",(0,i.yg)("a",{parentName:"strong",href:"https://department-of-veterans-affairs.github.io/va-mobile-library/iframe.html?args=&id=link--external-link&viewMode=story"},"browser app"))," if the user needs to sign in to access the content. Before leaving the app, always use a native alert to warn the user. Once confirmed, open the default browser app."),(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("strong",{parentName:"li"},"Links launch another app")," if the user is taking an action such as making a phone call, getting directions, or downloading a file. Before leaving the app, consider using a ",(0,i.yg)("a",{parentName:"li",href:"https://department-of-veterans-affairs.github.io/va-mobile-app/docs/Flagship%20design%20library/Patterns/confirmation-messages"},"confirmation message")," (such as a native alert or action sheet) to warn the user.",(0,i.yg)("ul",{parentName:"li"},(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("a",{parentName:"li",href:"https://department-of-veterans-affairs.github.io/va-mobile-library/iframe.html?args=&id=link--attachment&viewMode=story"},"Attachment"),": Display the attachment in the app with the ability to download to their device."),(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("a",{parentName:"li",href:"https://department-of-veterans-affairs.github.io/va-mobile-library/iframe.html?args=&id=link--calendar&viewMode=story"},"Calendar"),": Display the event information to allow the user to review and confirm before adding to their calendar. Once confirmed, add to the default calendar app."),(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("a",{parentName:"li",href:"https://department-of-veterans-affairs.github.io/va-mobile-library/iframe.html?args=&id=link--directions&viewMode=story"},"Directions"),": Display an Action Sheet to allow the user to select their preferred maps app (Apple Maps, Google Maps, etc.). Once selected, open the maps app with their destination."),(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("a",{parentName:"li",href:"https://department-of-veterans-affairs.github.io/va-mobile-library/iframe.html?args=&id=link--phone&viewMode=story"},"Phone"),": Display an Action Sheet to allow the user to confirm the phone call. Once confirmed, open the default phone app."),(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("a",{parentName:"li",href:"https://department-of-veterans-affairs.github.io/va-mobile-library/iframe.html?args=&id=link--phone-tty&viewMode=story"},"Phone TTY"),": Display an Action Sheet to allow user to confirm the TTY call. Once confirmed, open the default phone app."),(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("a",{parentName:"li",href:"https://department-of-veterans-affairs.github.io/va-mobile-library/iframe.html?args=&id=link--text&viewMode=story"},"Text"),": Open the default messages app.")))))))),(0,i.yg)("h3",{id:"choosing-between-variations"},"Choosing between variations"),(0,i.yg)("ul",null,(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("strong",{parentName:"li"},"Choosing between colors"),(0,i.yg)("ul",{parentName:"li"},(0,i.yg)("li",{parentName:"ul"},"In most cases, use the ",(0,i.yg)("strong",{parentName:"li"},"default (blue)")," color."),(0,i.yg)("li",{parentName:"ul"},"If the default (blue) color will not work (i.e. insufficient color contrast), you may use the ",(0,i.yg)("strong",{parentName:"li"},"base (gray)")," link.")))),(0,i.yg)("h2",{id:"code-usage"},"Code usage"),(0,i.yg)("p",null,(0,i.yg)("a",{parentName:"p",href:"https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/docs/link--docs"},"Open Storybook")),(0,i.yg)("h2",{id:"content-considerations"},"Content considerations"),(0,i.yg)("ul",null,(0,i.yg)("li",{parentName:"ul"},"Refer to the ",(0,i.yg)("a",{parentName:"li",href:"https://design.va.gov/components/link/#content-considerations"},"VA Design System for content considerations")),(0,i.yg)("li",{parentName:"ul"},"When linking Veterans to VA.gov, be sure to include VA.gov in the link text. For example, instead of saying \u201cLearn more about benefits,\u201d it\u2019s better to say \u201cLearn more about benefits on VA.gov\u201d.")),(0,i.yg)("h2",{id:"accessibility-considerations"},"Accessibility considerations"),(0,i.yg)("ul",null,(0,i.yg)("li",{parentName:"ul"},"For guidance on choosing between a Button or Link, see ",(0,i.yg)("a",{parentName:"li",href:"/va-mobile-app/docs/Flagship%20design%20library/Components/Buttons%20and%20Links/"},"additional documentation"),"."),(0,i.yg)("li",{parentName:"ul"},"For additional guidance, refer to the ",(0,i.yg)("a",{parentName:"li",href:"https://design.va.gov/components/link/#accessibility-considerations"},"VA Design System for accessibility considerations"))),(0,i.yg)("h2",{id:"related"},"Related"),(0,i.yg)("ul",null,(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("a",{parentName:"li",href:"https://design.va.gov/components/link/"},"Link - VA Design System")),(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("a",{parentName:"li",href:"https://designsystem.digital.gov/components/link/"},"Link - USWDS"))),(0,i.yg)("hr",null),(0,i.yg)("h2",{id:"differences-with-vads"},"Differences with VADS"),(0,i.yg)("ul",null,(0,i.yg)("li",{parentName:"ul"},"The Base link style exists due to mobile app specific needs in dark mode. For example: The v3 Alert component has a colored background for each variation. While working on dark mode, the mobile app team found that the Default link style did not meet color contrast requirements and clashed with the background colors. For this reason, we created a new Base style that's similar to a USWDS Base style."),(0,i.yg)("li",{parentName:"ul"},"In Storybook, variants are available for content-specific links (add to calendar, get directions, etc). These variants were created to include the onPress logic for app teams. This allows the component to always display a native confirmation message when needed."),(0,i.yg)("li",{parentName:"ul"},"Currently, the Link component does not support inline links. In the future, a Paragraph component will be created for inline links to support proper text wrapping and accessibility in React Native.")))}h.isMDXComponent=!0},15680:(e,t,n)=>{n.d(t,{xA:()=>g,yg:()=>u});var a=n(96540);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function r(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,i=function(e,t){if(null==e)return{};var n,a,i={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var s=a.createContext({}),p=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):r(r({},t),e)),n},g=function(e){var t=p(e.components);return a.createElement(s.Provider,{value:t},e.children)},m="mdxType",h={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,i=e.mdxType,o=e.originalType,s=e.parentName,g=l(e,["components","mdxType","originalType","parentName"]),m=p(n),d=i,u=m["".concat(s,".").concat(d)]||m[d]||h[d]||o;return n?a.createElement(u,r(r({ref:t},g),{},{components:n})):a.createElement(u,r({ref:t},g))}));function u(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var o=n.length,r=new Array(o);r[0]=d;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[m]="string"==typeof e?e:i,r[1]=l;for(var p=2;p<o;p++)r[p]=n[p];return a.createElement.apply(null,r)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"}}]);