"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[2581],{3905:function(e,t,a){a.d(t,{Zo:function(){return c},kt:function(){return d}});var n=a(67294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function i(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function l(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?i(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):i(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function o(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},i=Object.keys(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var s=n.createContext({}),p=function(e){var t=n.useContext(s),a=t;return e&&(a="function"==typeof e?e(t):l(l({},t),e)),a},c=function(e){var t=p(e.components);return n.createElement(s.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,i=e.originalType,s=e.parentName,c=o(e,["components","mdxType","originalType","parentName"]),u=p(a),d=r,h=u["".concat(s,".").concat(d)]||u[d]||m[d]||i;return a?n.createElement(h,l(l({ref:t},c),{},{components:a})):n.createElement(h,l({ref:t},c))}));function d(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=a.length,l=new Array(i);l[0]=u;var o={};for(var s in t)hasOwnProperty.call(t,s)&&(o[s]=t[s]);o.originalType=e,o.mdxType="string"==typeof e?e:r,l[1]=o;for(var p=2;p<i;p++)l[p]=a[p];return n.createElement.apply(null,l)}return n.createElement.apply(null,a)}u.displayName="MDXCreateElement"},46848:function(e,t,a){a.r(t),a.d(t,{frontMatter:function(){return o},contentTitle:function(){return s},metadata:function(){return p},toc:function(){return c},default:function(){return u}});var n=a(87462),r=a(63366),i=(a(67294),a(3905)),l=["components"],o={title:"Screen types",sidebar_position:2},s=void 0,p={unversionedId:"UX/Patterns/ScreenTypes",id:"UX/Patterns/ScreenTypes",title:"Screen types",description:"The VA mobile app has 5 main screen types that fall into two categories:",source:"@site/docs/UX/Patterns/ScreenTypes.md",sourceDirName:"UX/Patterns",slug:"/UX/Patterns/ScreenTypes",permalink:"/va-mobile-app/docs/UX/Patterns/ScreenTypes",tags:[],version:"current",sidebarPosition:2,frontMatter:{title:"Screen types",sidebar_position:2},sidebar:"tutorialSidebar",previous:{title:"Navigation model",permalink:"/va-mobile-app/docs/UX/Patterns/NavigationModel"},next:{title:"How We Work",permalink:"/va-mobile-app/docs/UX/How-We-Work/"}},c=[{value:"Hierarchical screens",id:"hierarchical-screens",children:[{value:"Category landing screen\u200b",id:"category-landing-screen",children:[],level:3},{value:"Feature landing screen\u200b",id:"feature-landing-screen",children:[],level:3},{value:"Child screen\u200b",id:"child-screen",children:[],level:3}],level:2},{value:"Modal screens",id:"modal-screens",children:[{value:"Fullscreen task/subtask\u200b",id:"fullscreen-tasksubtask",children:[],level:3},{value:"Large panel\u200b",id:"large-panel",children:[],level:3},{value:"Web view",id:"web-view",children:[],level:3}],level:2},{value:"Adding new screen types to the app\u200b",id:"adding-new-screen-types-to-the-app",children:[],level:2}],m={toc:c};function u(e){var t=e.components,a=(0,r.Z)(e,l);return(0,i.kt)("wrapper",(0,n.Z)({},m,a,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"The VA mobile app has 5 main screen types that fall into two categories:"),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Hierarchical screens:")," "),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"The categories, features, and child screens that make up much of the app. "),(0,i.kt)("li",{parentName:"ul"},"Make one choice per screen (descending deeper into the app\u2019s hierarchy) until you reach a destination. "),(0,i.kt)("li",{parentName:"ul"},"These screens always display the tab bar.")),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Modal screens:")," "),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"The VA Health & Benefits mobile app uses modality for quick actions and contained tasks where the user must maintain focus to complete it. "),(0,i.kt)("li",{parentName:"ul"},"Because they appear on a layer above the hierarchical screens, modal screens cover the tab bar.")),(0,i.kt)("h2",{id:"hierarchical-screens"},"Hierarchical screens"),(0,i.kt)("h3",{id:"category-landing-screen"},"Category landing screen\u200b"),(0,i.kt)("iframe",{width:"500",height:"500",alt:"image of feature landing/child mobile app screen and Home screen",src:"https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2Fcdp7Be4UdYesq9fXeqaOgt%2FVAMobile-Navigation2.0-ScreenTemplates-Shipped%25F0%259F%259A%25A2%3Fnode-id%3D661%253A2738%26t%3Db57jsZqgwHpuU2ja-1",allowfullscreen:!0}),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"Definition:")," The \u201chome\u201d screen of a category. Categories are the top level of hierarchical navigation (each category appears in tab bar/bottom navigation bar), grouping features of a similar type. It contains links to features and relevant summary content. Features are listed alphabetically, and grouped into subsections if the number of features in a category exceeds 6. Displays the tab bar. Does not display back button."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"Screen transition:")," Screen transition between categories is top-level peer (fade through)."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"Scroll behavior:")," Content scrolls if it exceeds the panel height",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},"Screen title scroll behavior",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},'Upon load: "VA" header text visible in top bar, screen title appears in body'),(0,i.kt)("li",{parentName:"ul"},'When scrolled: "VA" header disappears from top bar, screen title disappears from body and moves to top bar'))))),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"Examples:")," Home, Health, Benefits, Payments"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"Resources:"),(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://www.figma.com/file/cdp7Be4UdYesq9fXeqaOgt/IA%2FNAV-Screen-Templates?node-id=288%3A2995"},"Figma file: Category landing screen template")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/department-of-veterans-affairs/va-mobile-app/issues/3996"},"Github ticket: Category landing screen template"))))),(0,i.kt)("h3",{id:"feature-landing-screen"},"Feature landing screen\u200b"),(0,i.kt)("iframe",{width:"500",height:"500",alt:"image of feature landing/child mobile app screen",src:"https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2Fcdp7Be4UdYesq9fXeqaOgt%2FVAMobile-Navigation2.0-ScreenTemplates-Shipped%25F0%259F%259A%25A2%3Fnode-id%3D661%253A2737%26t%3Db57jsZqgwHpuU2ja-1",allowfullscreen:!0}),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"Definition:")," The \u201chome\u201d screen of a feature. Features are parent sections with multiple children that generally live within a category. A complex feature (like pharmacy or secure messaging) can also have subsections. Displays the tab bar and a descriptive back button."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"Screen transition:")," Horizontal (pushing on & off from right)."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"Scroll behavior:")," Content scrolls if it exceeds the panel height",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},"Screen title scroll behavior",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},'Upon load: "VA" header text visible in top bar, screen title appears in body'),(0,i.kt)("li",{parentName:"ul"},'When scrolled: "VA" header disappears from top bar, screen title disappears from body and moves to top bar'))))),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"Examples:")," Appointments, Pharmacy, Profile"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"Resources:"),(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://www.figma.com/file/cdp7Be4UdYesq9fXeqaOgt/IA%2FNAV-Screen-Templates?node-id=2%3A334"},"Figma file: Feature landing/child screen template")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://www.figma.com/file/cdp7Be4UdYesq9fXeqaOgt/IA%2FNAV-Screen-Templates?node-id=1%3A364"},"Figma: header scroll behavior")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://app.zenhub.com/workspaces/va-mobile-frontendqa-60f1a34998bc75000f2a489f/issues/gh/department-of-veterans-affairs/va-mobile-app/3977"},"Github ticket: Feature landing/child screen template"))))),(0,i.kt)("h3",{id:"child-screen"},"Child screen\u200b"),(0,i.kt)("iframe",{width:"500",height:"500",alt:"image of feature landing/child mobile app screen",src:"https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2Fcdp7Be4UdYesq9fXeqaOgt%2FVAMobile-Navigation2.0-ScreenTemplates-Shipped%25F0%259F%259A%25A2%3Fnode-id%3D661%253A2737%26t%3Db57jsZqgwHpuU2ja-1",allowfullscreen:!0}),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"Definition:")," Child screens live within a feature, generally an item in a list. It\u2019s often the end point of a hierarchy. Displays the tab bar and a descriptive back button."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"Screen transition:")," Horizontal (pushing on & off from right)."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"Scroll behavior:")," Content scrolls if it exceeds the panel height",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},"Screen title scroll behavior",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},'Upon load: "VA" header text visible in top bar, screen title appears in body'),(0,i.kt)("li",{parentName:"ul"},'When scrolled: "VA" header disappears from top bar, screen title disappears from body and moves to top bar'))))),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"Examples:")," Appointment details, Prescription details"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"Resources:"),(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://www.figma.com/file/cdp7Be4UdYesq9fXeqaOgt/IA%2FNAV-Screen-Templates?node-id=2%3A334"},"Figma file: Feature landing/child screen template")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://www.figma.com/file/cdp7Be4UdYesq9fXeqaOgt/IA%2FNAV-Screen-Templates?node-id=1%3A364"},"Figma: header scroll behavior")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://app.zenhub.com/workspaces/va-mobile-frontendqa-60f1a34998bc75000f2a489f/issues/gh/department-of-veterans-affairs/va-mobile-app/3977"},"Github ticket: Feature landing/child screen template"))))),(0,i.kt)("h2",{id:"modal-screens"},"Modal screens"),(0,i.kt)("h3",{id:"fullscreen-tasksubtask"},"Fullscreen task/subtask\u200b"),(0,i.kt)("iframe",{width:"750",height:"500",alt:"image of fullscreen task/subtask mobile app screen",src:"https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2Fcdp7Be4UdYesq9fXeqaOgt%2FVAMobile-Navigation2.0-ScreenTemplates-Shipped%25F0%259F%259A%25A2%3Fnode-id%3D661%253A2736%26t%3Db57jsZqgwHpuU2ja-1",allowfullscreen:!0}),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"Definition:")," A contained, linear flow that is presented modally at any level of the app\u2019s hierarchy, opening on a layer over the current screen and taking up the whole screen. A fullscreen task/subtask can be one or multiple steps, and it requires an explicit close or cancel button to exit. Use a task/subtask to enable something complex in order to lock in focus. Because it covers the entire screen, it is the only modally appearing screen over which other dialogs or panels can appear. Does not display the tab bar."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"Behaviors & Logic:"),(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"Screen Transition:")," Screen transition is vertical (pushing on & off from the bottom) to open the subtask, then horizontal between sequential steps (if applicable)."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"Scroll behavior:")," Content (including primary & secondary action buttons) scrolls if it exceeds the panel height."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"Button behavior & display logic"),(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},"Top bar action button behavior & display logic",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},'Left button: Cancel only, must be accompanied by primary action button. Closes editable view without saving changes and/or closes entire multi-strep flow without saving changes (Display "Are you sure?" confirmation modal).'),(0,i.kt)("li",{parentName:"ul"},"Right button: Done or Close. Does not appear with a primary action button. Closes non-editable view."))),(0,i.kt)("li",{parentName:"ul"},"Bottom action button behavior & display logic",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},"Locked to bottom of screen"),(0,i.kt)("li",{parentName:"ul"},"Primary action button: May appear alone or with a secondary action button. If task is a single step, tap to save/submit and close view. If task is multi-step, tap to advance to next step (mid-task) or save/submit and close view (end of task) Always accompanied by Cancel."),(0,i.kt)("li",{parentName:"ul"},"Secondary action button: Appears in a multi-step task, accompanied by a primary action button. Tap to go back one step."))))))),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"Example:")," Create an appointment, Refill a prescription"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"Resources:"),(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://www.figma.com/file/cdp7Be4UdYesq9fXeqaOgt/IA%2FNAV-Screen-Templates?node-id=155%3A2706"},"Figma file: Fullscreen subtask")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://app.zenhub.com/workspaces/va-mobile-frontendqa-60f1a34998bc75000f2a489f/issues/gh/department-of-veterans-affairs/va-mobile-app/3978"},"Github ticket: Fullscreen subtask template"))))),(0,i.kt)("h3",{id:"large-panel"},"Large panel\u200b"),(0,i.kt)("iframe",{width:"750",height:"500",alt:"image of large panel mobile app screen",src:"https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2Fcdp7Be4UdYesq9fXeqaOgt%2FVAMobile-Navigation2.0-ScreenTemplates-Shipped%25F0%259F%259A%25A2%3Fnode-id%3D661%253A2739%26t%3Db57jsZqgwHpuU2ja-1",allowfullscreen:!0}),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"Definition:")," A contained (single step) task that is presented modally at any level of the app\u2019s hierarchy and appears as a card that covers most of the underlying content. It displays a close button to exit, but can also swipe down or tap on background to close. Use a large panel to display more in depth detail (multiple paragraphs) or a small (quick) task, when you need to lock in focus and limit the possibility of abandoning. Cannot appear over another panel. Does not display the tab bar."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"Behaviors & Logic:"),(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"Screen transition:")," Screen transition is vertical (pushing on & off from the bottom) to open & close, then horizontal between sequential steps (if applicable)."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"Scroll behavior:")," ",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},"Top bar title and actions are fixed & do not scroll."),(0,i.kt)("li",{parentName:"ul"},"Content (including primary & secondary action buttons) scrolls if it exceeds the panel height."))),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"Button behavior & display logic"),(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},"Top bar action buttons:",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},'Left button: Cancel only, must be accompanied by primary embedded action button in content. Closes editable view without saving changes (Display "Are you sure?" confirmation modal).'),(0,i.kt)("li",{parentName:"ul"},"Right button: Done or Close. Does not appear with a primary action button. Closes non-editable view."))),(0,i.kt)("li",{parentName:"ul"},"Embedded action buttons:",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},"Primary action button: May appear alone or with a secondary action button. If task is a single step, tap to save/submit and close view. Always accompanied by Cancel."))),(0,i.kt)("li",{parentName:"ul"},"Secondary close/dismiss actions (Save/close action depends on top bar action button label) :",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},"Swipe down from header to close the panel"),(0,i.kt)("li",{parentName:"ul"},"Android hardware back also results in closing the panel"))))))),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"Example:")," Help text, composing a secure message"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"Resources:"),(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://www.figma.com/file/cdp7Be4UdYesq9fXeqaOgt/IA%2FNAV-Screen-Templates?node-id=155%3A2739"},"Figma file: Large panel template")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://app.zenhub.com/workspaces/va-mobile-frontendqa-60f1a34998bc75000f2a489f/issues/gh/department-of-veterans-affairs/va-mobile-app/3979"},"Github ticket: Large panel template"))))),(0,i.kt)("h3",{id:"web-view"},"Web view"),(0,i.kt)("iframe",{width:"500",height:"500",alt:"image of web view mobile app screen",src:"https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2Fcdp7Be4UdYesq9fXeqaOgt%2FVAMobile-Navigation2.0-ScreenTemplates-Shipped%25F0%259F%259A%25A2%3Fnode-id%3D208%253A2793%26t%3Db57jsZqgwHpuU2ja-1",allowfullscreen:!0}),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"Definition:")," A screen that displays content from an outside website without requiring the user to leave the app. Requires an explicit close or cancel button to exit. Does not display tab bar due to required web toolbar."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"Transition:")," Horizontal (pushing on & off from right)."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"Example:")," Contact VA"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"Resources:"),(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://www.figma.com/file/cdp7Be4UdYesq9fXeqaOgt/VAMobile-Navigation2.0-ScreenTemplates-Shipped%F0%9F%9A%A2?node-id=208%3A2793&t=b57jsZqgwHpuU2ja-4"},"Figma file: Webview"))))),(0,i.kt)("h2",{id:"adding-new-screen-types-to-the-app"},"Adding new screen types to the app\u200b"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Always try to use an existing screen type first before proposing a new (or modifying an existing) screen type."),(0,i.kt)("li",{parentName:"ul"},"New screen types should apply to multiple features/locations in the app rather than stand as one-offs, and need to be approved by the Component Committee.")))}u.isMDXComponent=!0}}]);