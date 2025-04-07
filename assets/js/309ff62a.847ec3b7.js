"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[496],{28453:(e,t,n)=>{n.d(t,{R:()=>a,x:()=>r});var i=n(96540);const s={},o=i.createContext(s);function a(e){const t=i.useContext(o);return i.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function r(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:a(e.components),i.createElement(o.Provider,{value:t},e.children)}},77014:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>r,default:()=>h,frontMatter:()=>a,metadata:()=>i,toc:()=>d});const i=JSON.parse('{"id":"Components/Buttons and links/Button","title":"Button","description":"A button draws attention to important actions with a large selectable surface.","source":"@site/design/Components/Buttons and links/Button.md","sourceDirName":"Components/Buttons and links","slug":"/Components/Buttons and links/Button","permalink":"/va-mobile-app/design/Components/Buttons and links/Button","draft":false,"unlisted":false,"tags":[],"version":"current","frontMatter":{"title":"Button"},"sidebar":"tutorialSidebar","previous":{"title":"Snackbar","permalink":"/va-mobile-app/design/Components/Alerts and progress/Snackbar"},"next":{"title":"Link","permalink":"/va-mobile-app/design/Components/Buttons and links/Link"}}');var s=n(74848),o=n(28453);const a={title:"Button"},r=void 0,l={},d=[{value:"Examples",id:"examples",level:2},{value:"Default",id:"default",level:3},{value:"Primary",id:"primary",level:4},{value:"Secondary",id:"secondary",level:4},{value:"Base",id:"base",level:3},{value:"Primary",id:"primary-1",level:4},{value:"Secondary",id:"secondary-1",level:4},{value:"Destructive",id:"destructive",level:3},{value:"Usage",id:"usage",level:2},{value:"Choosing between variations",id:"choosing-between-variations",level:3},{value:"Placement",id:"placement",level:3},{value:"Code usage",id:"code-usage",level:2},{value:"Content considerations",id:"content-considerations",level:2},{value:"Accessibility considerations",id:"accessibility-considerations",level:2},{value:"Related",id:"related",level:2},{value:"Differences with VADS",id:"differences-with-vads",level:2}];function c(e){const t={a:"a",h2:"h2",h3:"h3",h4:"h4",hr:"hr",li:"li",p:"p",strong:"strong",ul:"ul",...(0,o.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.p,{children:"A button draws attention to important actions with a large selectable surface."}),"\n",(0,s.jsx)(t.h2,{id:"examples",children:"Examples"}),"\n",(0,s.jsx)(t.h3,{id:"default",children:"Default"}),"\n",(0,s.jsx)(t.h4,{id:"primary",children:"Primary"}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.strong,{children:"Open in"}),": ",(0,s.jsx)(t.a,{href:"https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/docs/button--primary",children:"Storybook"}),"  |   ",(0,s.jsx)(t.a,{href:"https://www.figma.com/file/Zzt8z60hCtdEzXx2GFWghH/%F0%9F%93%90-Component-Library?type=design&node-id=224-606&mode=design&t=CNVVTHmCkOFHUVbq-4",children:"Figma"})]}),"\n",(0,s.jsx)("iframe",{width:"620",height:"",title:"Image of component in Storybook",src:"https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/story/button--primary&full=1&shortcuts=false&singleStory=true",allowfullscreen:!0}),"\n",(0,s.jsx)(t.h4,{id:"secondary",children:"Secondary"}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.strong,{children:"Open in"}),": ",(0,s.jsx)(t.a,{href:"https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/docs/button--secondary",children:"Storybook"}),"  |   ",(0,s.jsx)(t.a,{href:"https://www.figma.com/file/Zzt8z60hCtdEzXx2GFWghH/%F0%9F%93%90-Component-Library?type=design&node-id=224-607&mode=design&t=CNVVTHmCkOFHUVbq-4",children:"Figma"})]}),"\n",(0,s.jsx)("iframe",{width:"620",height:"",title:"Image of component in Storybook",src:"https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/story/button--secondary&full=1&shortcuts=false&singleStory=true",allowfullscreen:!0}),"\n",(0,s.jsx)(t.h3,{id:"base",children:"Base"}),"\n",(0,s.jsx)(t.h4,{id:"primary-1",children:"Primary"}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.strong,{children:"Open in"}),": ",(0,s.jsx)(t.a,{href:"https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/docs/button--base",children:"Storybook"}),"  |   ",(0,s.jsx)(t.a,{href:"https://www.figma.com/file/Zzt8z60hCtdEzXx2GFWghH/%F0%9F%93%90-Component-Library?type=design&node-id=224-595&mode=design&t=CNVVTHmCkOFHUVbq-4",children:"Figma"})]}),"\n",(0,s.jsx)("iframe",{width:"620",height:"",title:"Image of component in Storybook",src:"https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/story/button--base&full=1&shortcuts=false&singleStory=true",allowfullscreen:!0}),"\n",(0,s.jsx)(t.h4,{id:"secondary-1",children:"Secondary"}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.strong,{children:"Open in"}),": ",(0,s.jsx)(t.a,{href:"https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/docs/button--base-secondary",children:"Storybook"}),"  |   ",(0,s.jsx)(t.a,{href:"https://www.figma.com/file/Zzt8z60hCtdEzXx2GFWghH/%F0%9F%93%90-Component-Library?type=design&node-id=224-596&mode=design&t=CNVVTHmCkOFHUVbq-4",children:"Figma"})]}),"\n",(0,s.jsx)("iframe",{width:"620",height:"",title:"Image of component in Storybook",src:"https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/story/button--base-secondary&full=1&shortcuts=false&singleStory=true",allowfullscreen:!0}),"\n",(0,s.jsx)(t.h3,{id:"destructive",children:"Destructive"}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.strong,{children:"Open in"}),": ",(0,s.jsx)(t.a,{href:"https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/docs/button--destructive",children:"Storybook"}),"  |   ",(0,s.jsx)(t.a,{href:"https://www.figma.com/file/Zzt8z60hCtdEzXx2GFWghH/%F0%9F%93%90-Component-Library?type=design&node-id=224-586&mode=design&t=CNVVTHmCkOFHUVbq-4",children:"Figma"})]}),"\n",(0,s.jsx)("iframe",{width:"620",height:"",title:"Image of component in Storybook",src:"https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/story/button--destructive&full=1&shortcuts=false&singleStory=true",allowfullscreen:!0}),"\n",(0,s.jsx)(t.h2,{id:"usage",children:"Usage"}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.a,{href:"https://design.va.gov/components/button/",children:"Refer to the VA Design System for usage guidance"})}),"\n",(0,s.jsx)(t.h3,{id:"choosing-between-variations",children:"Choosing between variations"}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.strong,{children:"Use primary for the most important action"}),". Use the primary button for the most important action that you want the user to take on the page, or in a section."]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.strong,{children:"Use secondary for non-primary actions"}),". Use secondary buttons for any actions that need to be downplayed against other actions on the page, or in a section."]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.strong,{children:"Use destructive for actions that have serious consequences"}),". Use destructive buttons for any actions that cannot be reversed and may result in data loss.","\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsx)(t.li,{children:"Don't rely on the red color alone to communicate the destructive nature of the action. Always ensure the button text clearly communicates what will happen."}),"\n",(0,s.jsx)(t.li,{children:"Since destructive buttons have serious consequences, always add friction before completing the action. This can be in the form of a native confirmation message (alert or action sheet) in the mobile app or a modal on web."}),"\n"]}),"\n"]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.strong,{children:"Choosing between colors"}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsx)(t.li,{children:"In most cases, use the default (blue) color."}),"\n",(0,s.jsx)(t.li,{children:"If the default (blue) color will not work (i.e. insufficient color contrast), you may use the base (gray) button."}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,s.jsx)(t.h3,{id:"placement",children:"Placement"}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsx)(t.li,{children:"Buttons generally appear on their own line at the bottom of a form or section."}),"\n",(0,s.jsx)(t.li,{children:"Primary buttons usually appear first, or to the left, of a secondary button."}),"\n"]}),"\n",(0,s.jsx)(t.h2,{id:"code-usage",children:"Code usage"}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.a,{href:"https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/docs/button--docs",children:"Open Storybook"})}),"\n",(0,s.jsx)(t.h2,{id:"content-considerations",children:"Content considerations"}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsxs)(t.li,{children:["Refer to the ",(0,s.jsx)(t.a,{href:"https://design.va.gov/components/button#content-considerations",children:"VA Design System for content considerations"})]}),"\n"]}),"\n",(0,s.jsx)(t.h2,{id:"accessibility-considerations",children:"Accessibility considerations"}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsxs)(t.li,{children:["Guidance on using disabled buttons","\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsxs)(t.li,{children:["Although VADS and USWDS have styles in place to support disabled buttons, disabled buttons are not available in the mobile app.","\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsx)(t.li,{children:"Disabled buttons are only available in VADS and USWDS to support legacy buttons that still exist on VA.gov today. These legacy use cases do not exist in the mobile app."}),"\n"]}),"\n"]}),"\n",(0,s.jsxs)(t.li,{children:["Instead of disabling a button in the mobile app, always attempt to find an alternative solution such as:","\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsx)(t.li,{children:"Providing additional context surrounding a button that tells a user what to expect when a button is tapped."}),"\n",(0,s.jsx)(t.li,{children:"Allowing a user to attempt to submit a form even if an error exists in an input field (and then presenting the errors to the user to fix)."}),"\n"]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,s.jsxs)(t.li,{children:["For guidance on choosing between a Button or Link, see ",(0,s.jsx)(t.a,{href:"/va-mobile-app/docs/Flagship%20design%20library/Components/Buttons%20and%20Links/",children:"additional documentation"}),"."]}),"\n",(0,s.jsxs)(t.li,{children:["For additional guidance, refer to the ",(0,s.jsx)(t.a,{href:"https://design.va.gov/components/button/#accessibility-considerations",children:"VA Design System for accessibility considerations"}),"."]}),"\n"]}),"\n",(0,s.jsx)(t.h2,{id:"related",children:"Related"}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsx)(t.li,{children:(0,s.jsx)(t.a,{href:"https://design.va.gov/components/button/",children:"Button - VA Design System"})}),"\n",(0,s.jsx)(t.li,{children:(0,s.jsx)(t.a,{href:"https://designsystem.digital.gov/components/button/",children:"Button - USWDS"})}),"\n",(0,s.jsx)(t.li,{children:(0,s.jsx)(t.a,{href:"https://developer.apple.com/design/human-interface-guidelines/buttons",children:"Button - HIG"})}),"\n",(0,s.jsx)(t.li,{children:(0,s.jsx)(t.a,{href:"https://m3.material.io/components/buttons/guidelines",children:"Button - Material Design"})}),"\n"]}),"\n",(0,s.jsx)(t.hr,{}),"\n",(0,s.jsx)(t.h2,{id:"differences-with-vads",children:"Differences with VADS"}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsx)(t.li,{children:"The Base button style exists due to mobile app specific needs in dark mode. For example: The v3 Alert component has a colored background for each variation. While working on dark mode, the mobile app team found that the Default button style did not meet color contrast requirements and clashed with the background colors. For this reason, we created a new Base button style that's based on a USWDS Base button style."}),"\n",(0,s.jsx)(t.li,{children:"The Destructive button style is currently used in the mobile app to cancel an appointment or remove contact information. The mobile design system team presented to the Design System Council in February 2024 and this button will be added to the larger VA Design System."}),"\n"]})]})}function h(e={}){const{wrapper:t}={...(0,o.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(c,{...e})}):c(e)}}}]);