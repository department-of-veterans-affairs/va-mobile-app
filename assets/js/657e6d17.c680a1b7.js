"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[2107],{3905:function(e,t,i){i.d(t,{Zo:function(){return p},kt:function(){return m}});var n=i(67294);function a(e,t,i){return t in e?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}function r(e,t){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),i.push.apply(i,n)}return i}function o(e){for(var t=1;t<arguments.length;t++){var i=null!=arguments[t]?arguments[t]:{};t%2?r(Object(i),!0).forEach((function(t){a(e,t,i[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):r(Object(i)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))}))}return e}function l(e,t){if(null==e)return{};var i,n,a=function(e,t){if(null==e)return{};var i,n,a={},r=Object.keys(e);for(n=0;n<r.length;n++)i=r[n],t.indexOf(i)>=0||(a[i]=e[i]);return a}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(n=0;n<r.length;n++)i=r[n],t.indexOf(i)>=0||Object.prototype.propertyIsEnumerable.call(e,i)&&(a[i]=e[i])}return a}var s=n.createContext({}),c=function(e){var t=n.useContext(s),i=t;return e&&(i="function"==typeof e?e(t):o(o({},t),e)),i},p=function(e){var t=c(e.components);return n.createElement(s.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var i=e.components,a=e.mdxType,r=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),u=c(i),m=a,k=u["".concat(s,".").concat(m)]||u[m]||d[m]||r;return i?n.createElement(k,o(o({ref:t},p),{},{components:i})):n.createElement(k,o({ref:t},p))}));function m(e,t){var i=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var r=i.length,o=new Array(r);o[0]=u;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:a,o[1]=l;for(var c=2;c<r;c++)o[c]=i[c];return n.createElement.apply(null,o)}return n.createElement.apply(null,i)}u.displayName="MDXCreateElement"},7153:function(e,t,i){i.r(t),i.d(t,{contentTitle:function(){return s},default:function(){return u},frontMatter:function(){return l},metadata:function(){return c},toc:function(){return p}});var n=i(87462),a=i(63366),r=(i(67294),i(3905)),o=["components"],l={title:"Accessibility Information",sidebar_position:1},s="Accessibility Information",c={unversionedId:"Engineering/FrontEnd/AccessibilityInformation",id:"Engineering/FrontEnd/AccessibilityInformation",title:"Accessibility Information",description:"This page describes the nuances of accessibility(a11y) for front end development.",source:"@site/docs/Engineering/FrontEnd/AccessibilityInformation.md",sourceDirName:"Engineering/FrontEnd",slug:"/Engineering/FrontEnd/AccessibilityInformation",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/AccessibilityInformation",tags:[],version:"current",sidebarPosition:1,frontMatter:{title:"Accessibility Information",sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Front End",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/"},next:{title:"Components",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/components"}},p=[{value:"IOS",id:"ios",children:[{value:"VoiceOver(Screen Reader)",id:"voiceoverscreen-reader",children:[],level:3},{value:"Voice Control(Voice Navigation)",id:"voice-controlvoice-navigation",children:[],level:3},{value:"Wireless Keyboard",id:"wireless-keyboard",children:[],level:3},{value:"Accessibility Inspector(Simulator Only)",id:"accessibility-inspectorsimulator-only",children:[],level:3}],level:2},{value:"Android",id:"android",children:[{value:"TalkBack(Screen Reader)",id:"talkbackscreen-reader",children:[],level:3},{value:"Voice Access(Voice Navigation)",id:"voice-accessvoice-navigation",children:[],level:3},{value:"Wireless Keyboard",id:"wireless-keyboard-1",children:[],level:3}],level:2},{value:"Screen Reader Pronunciations",id:"screen-reader-pronunciations",children:[],level:2},{value:"Touch Targets",id:"touch-targets",children:[],level:2},{value:"React Native Support",id:"react-native-support",children:[{value:"Accessibility with Integration Tests",id:"accessibility-with-integration-tests",children:[],level:3}],level:2},{value:"Notable Quirks",id:"notable-quirks",children:[{value:"React Navigation and Wireless Keyboard",id:"react-navigation-and-wireless-keyboard",children:[],level:3},{value:"Copy and Paste and how it affects Accessibility",id:"copy-and-paste-and-how-it-affects-accessibility",children:[],level:3}],level:2}],d={toc:p};function u(e){var t=e.components,l=(0,a.Z)(e,o);return(0,r.kt)("wrapper",(0,n.Z)({},d,l,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"accessibility-information"},"Accessibility Information"),(0,r.kt)("p",null,"This page describes the nuances of accessibility(a11y) for front end development."),(0,r.kt)("h2",{id:"ios"},"IOS"),(0,r.kt)("p",null,"IOS has a handful of ways to test a11y. Here are tools we can use to verify a11y on a real IOS device."),(0,r.kt)("h3",{id:"voiceoverscreen-reader"},"VoiceOver(Screen Reader)"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Enable VoiceOver via ",(0,r.kt)("inlineCode",{parentName:"li"},"Settings")," -> ",(0,r.kt)("inlineCode",{parentName:"li"},"Accessibility")," -> ",(0,r.kt)("inlineCode",{parentName:"li"},"VoiceOver")," -> toggle on"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"AccessibilityHints")," are not turned on by default. To turn on ",(0,r.kt)("inlineCode",{parentName:"li"},"Settings")," -> ",(0,r.kt)("inlineCode",{parentName:"li"},"Accessibility")," -> ",(0,r.kt)("inlineCode",{parentName:"li"},"Verbosity")," -> toggle on ",(0,r.kt)("inlineCode",{parentName:"li"},"Speak Hints")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://support.apple.com/guide/iphone/learn-voiceover-gestures-iph3e2e2281/ios"},"Gestures for traversing"))),(0,r.kt)("h3",{id:"voice-controlvoice-navigation"},"Voice Control(Voice Navigation)"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Enable Voice Control via ",(0,r.kt)("inlineCode",{parentName:"li"},"Settings")," -> ",(0,r.kt)("inlineCode",{parentName:"li"},"Accessibility")," -> ",(0,r.kt)("inlineCode",{parentName:"li"},"Voice Control")," -> toggle on"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://support.apple.com/guide/iphone/voice-control-iph2c21a3c88/ios"},"Voice Commands"),(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"Show names")," -> ",(0,r.kt)("inlineCode",{parentName:"li"},"Tap <name>")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"Show numbers")," -> ",(0,r.kt)("inlineCode",{parentName:"li"},"Tap <number>"))))),(0,r.kt)("h3",{id:"wireless-keyboard"},"Wireless Keyboard"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Use right and left arrows to traverse (tab is not supported)"),(0,r.kt)("li",{parentName:"ul"},"Hit up and down at the same time to activate an item")),(0,r.kt)("h3",{id:"accessibility-inspectorsimulator-only"},"Accessibility Inspector(Simulator Only)"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"Open ",(0,r.kt)("inlineCode",{parentName:"p"},"Xcode")," -> ",(0,r.kt)("inlineCode",{parentName:"p"},"Play")," to start simulator -> ",(0,r.kt)("inlineCode",{parentName:"p"},"Xcode Menu Item")," -> ",(0,r.kt)("inlineCode",{parentName:"p"},"Open Developer Tool")," -> ",(0,r.kt)("inlineCode",{parentName:"p"},"Accessibility Inspector")),(0,r.kt)("p",{parentName:"li"},(0,r.kt)("img",{alt:"Accessibility Inspector",src:i(61349).Z})))),(0,r.kt)("h2",{id:"android"},"Android"),(0,r.kt)("p",null,"Like IOS, Android provides tools to help verify a11y. A real device is needed to test a11y on Android. "),(0,r.kt)("h3",{id:"talkbackscreen-reader"},"TalkBack(Screen Reader)"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Enable Talkback via ",(0,r.kt)("inlineCode",{parentName:"li"},"Settings")," -> ",(0,r.kt)("inlineCode",{parentName:"li"},"Accessibility")," -> ",(0,r.kt)("inlineCode",{parentName:"li"},"TalkBack")," -> toggle on",(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},"Swipe right or left to move between items"),(0,r.kt)("li",{parentName:"ul"},"Double-tap to activate an item"),(0,r.kt)("li",{parentName:"ul"},"Drag 2 fingers to scroll")))),(0,r.kt)("h3",{id:"voice-accessvoice-navigation"},"Voice Access(Voice Navigation)"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Download/Install Voice Access from the ",(0,r.kt)("a",{parentName:"li",href:"https://play.google.com/store/apps/details?id=com.google.android.apps.accessibility.voiceaccess&hl=en_US&gl=US"},"Google Play Store"),(0,r.kt)("ol",{parentName:"li"},(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("inlineCode",{parentName:"li"},"Settings")," -> ",(0,r.kt)("inlineCode",{parentName:"li"},"Accessibility")," -> ",(0,r.kt)("inlineCode",{parentName:"li"},"Voice Access")," -> toggle on"),(0,r.kt)("li",{parentName:"ol"},"Start Voice Access by swiping down from the top of your phone and ",(0,r.kt)("inlineCode",{parentName:"li"},"tap to start")))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://support.google.com/accessibility/android/answer/6151854?hl=en#zippy=%2Cbasics-navigation"},"Voice Commands"),(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"Show numbers")," -> ",(0,r.kt)("inlineCode",{parentName:"li"},"Tap <number>"))))),(0,r.kt)("h3",{id:"wireless-keyboard-1"},"Wireless Keyboard"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Use tab key to traverse"),(0,r.kt)("li",{parentName:"ul"},"Hit enter to activate an item"),(0,r.kt)("li",{parentName:"ul"},"See ",(0,r.kt)("a",{parentName:"li",href:"#react-navigation-and-wireless-keyboard"},"React Navigation and Wireless Keyboard"))),(0,r.kt)("h2",{id:"screen-reader-pronunciations"},"Screen Reader Pronunciations"),(0,r.kt)("p",null,'Some screen readers(ex. Samsung phones) will not always pronounce words like "VA" correctly - will sometimes read it as "VAAH" instead of "VA".'),(0,r.kt)("p",null,"To get round this, add in the unicode ",(0,r.kt)("inlineCode",{parentName:"p"},"\\ufeff")," in between letters(ex. ",(0,r.kt)("inlineCode",{parentName:"p"},"VA")," -> ",(0,r.kt)("inlineCode",{parentName:"p"},"V\\ufeffA"),") for your translations. Text is unchanged from the users pov and the screen reader will pronounce the word correctly."),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"Vaah",src:i(39206).Z})),(0,r.kt)("h2",{id:"touch-targets"},"Touch Targets"),(0,r.kt)("p",null,"Most common components will have it setup so that the text or wrapper will use ",(0,r.kt)("inlineCode",{parentName:"p"},"theme.dimensions.touchableMinHeight")," so pressable elements have a minimum of ",(0,r.kt)("inlineCode",{parentName:"p"},"44")," height. We can add additional height without changing the font/styles by adding additional padding where it is needed. "),(0,r.kt)("p",null,"Work with QA or design if the default minimum height for touchable targets should be bigger. You can visually view the touch target size by going to ",(0,r.kt)("a",{parentName:"p",href:"https://reactnative.dev/docs/debugging"},"debug menu")," -> ",(0,r.kt)("inlineCode",{parentName:"p"},"Show Inspector")," -> Toggle on ",(0,r.kt)("inlineCode",{parentName:"p"},"Touchable")," -> select the element"),(0,r.kt)("p",null,"  ",(0,r.kt)("img",{alt:"Touch Target Example",src:i(76788).Z})),(0,r.kt)("h2",{id:"react-native-support"},"React Native Support"),(0,r.kt)("p",null,"React Native has a variety of properties that can be set to support ",(0,r.kt)("a",{parentName:"p",href:"https://reactnative.dev/docs/accessibility"},"a11y"),". Most common components will already support the a11y properties listed in the link."),(0,r.kt)("h3",{id:"accessibility-with-integration-tests"},"Accessibility with Integration Tests"),(0,r.kt)("p",null,"We originally used the following functions to set a11y properties to better support integration test since without them we were unable to query for certain elements on the screen."),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"testIdProps"),(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},"for accessibilityLabels(when the literal text needs to sound different for TalkBack or VoiceOver)."))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"a11yHintProp"),(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},'for accessibilityHints(additional text read by TalkBack or VoiceOver ex. Button that opens a link outside the app -> "This page will open in your device\'s browser").'))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"a11yValueProp"),(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},'for accessibilityValue(additional text read by TalkBack or VoiceOver ex. The first item in a list of items -> "Item 1, 1 of 10").')))),(0,r.kt)("p",null,(0,r.kt)("em",{parentName:"p"},"Note ",(0,r.kt)("inlineCode",{parentName:"em"},"AccessibilityState")," can be used as normal without a special function"),"."),(0,r.kt)("h2",{id:"notable-quirks"},"Notable Quirks"),(0,r.kt)("h3",{id:"react-navigation-and-wireless-keyboard"},"React Navigation and Wireless Keyboard"),(0,r.kt)("p",null,"There has been noticeable issues using wireless keyboard with react navigation that has been tracked ",(0,r.kt)("a",{parentName:"p",href:"https://app.zenhub.com/workspaces/va-mobile-frontendqa-60f1a34998bc75000f2a489f/issues/department-of-veterans-affairs/va-mobile-app/2214"},"here"),"."),(0,r.kt)("h3",{id:"copy-and-paste-and-how-it-affects-accessibility"},"Copy and Paste and how it affects Accessibility"),(0,r.kt)("p",null,"We can make text-only elements(ex. TextView) have the ability to copy and paste by adding ",(0,r.kt)("a",{parentName:"p",href:"https://reactnative.dev/docs/text#selectable"},"selectable")," to its property."),(0,r.kt)("p",null,"We limit the areas(ex. Secure Messaging) where we want to do this because any ",(0,r.kt)("inlineCode",{parentName:"p"},"selectable")," element gets read as pressable from voice navigation apps like Voice Access and Voice Control. See related ticket ",(0,r.kt)("a",{parentName:"p",href:"https://app.zenhub.com/workspaces/va-mobile-frontendqa-60f1a34998bc75000f2a489f/issues/department-of-veterans-affairs/va-mobile-app/2233"},"here"),"."))}u.isMDXComponent=!0},61349:function(e,t,i){t.Z=i.p+"assets/images/a11y-inspector-31a86197d8e6778014427747310d75a9.png"},76788:function(e,t,i){t.Z=i.p+"assets/images/touch-target-659472950f37c403d58f09d07eaaaa41.png"},39206:function(e,t,i){t.Z=i.p+"assets/images/vaah-f1de1d5836cae944b06d11b2aab6c877.png"}}]);