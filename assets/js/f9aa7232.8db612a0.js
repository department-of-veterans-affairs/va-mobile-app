"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[2708],{94270:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>r,contentTitle:()=>s,default:()=>p,frontMatter:()=>i,metadata:()=>l,toc:()=>m});var o=n(87462),a=(n(67294),n(3905));const i={title:"Segmented control"},s=void 0,l={unversionedId:"Components/Navigation/Secondary/SegmentedControl",id:"Components/Navigation/Secondary/SegmentedControl",title:"Segmented control",description:"A segmented control is used to switch between related views of information within the same context.",source:"@site/design/Components/Navigation/Secondary/SegmentedControl.md",sourceDirName:"Components/Navigation/Secondary",slug:"/Components/Navigation/Secondary/SegmentedControl",permalink:"/va-mobile-app/design/Components/Navigation/Secondary/SegmentedControl",draft:!1,tags:[],version:"current",frontMatter:{title:"Segmented control"},sidebar:"tutorialSidebar",previous:{title:"For designers",permalink:"/va-mobile-app/design/About/designers"}},r={},m=[{value:"Examples",id:"examples",level:2},{value:"Default",id:"default",level:3},{value:"Storybook",id:"storybook",level:4},{value:"Figma",id:"figma",level:4},{value:"Variations",id:"variations",level:3},{value:"Storybook (coming soon)",id:"storybook-coming-soon",level:4},{value:"Figma",id:"figma-1",level:4},{value:"Usage",id:"usage",level:2},{value:"When to use Segmented control",id:"when-to-use-segmented-control",level:3},{value:"When to consider something else",id:"when-to-consider-something-else",level:3},{value:"Placement",id:"placement",level:3},{value:"Instances of this component in production",id:"instances-of-this-component-in-production",level:3},{value:"Code usage",id:"code-usage",level:2},{value:"Content considerations",id:"content-considerations",level:2},{value:"Accessibility considerations",id:"accessibility-considerations",level:2},{value:"Related",id:"related",level:2}],d={toc:m},c="wrapper";function p(e){let{components:t,...n}=e;return(0,a.kt)(c,(0,o.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"A segmented control is used to switch between related views of information within the same context."),(0,a.kt)("h2",{id:"examples"},"Examples"),(0,a.kt)("h3",{id:"default"},"Default"),(0,a.kt)("h4",{id:"storybook"},(0,a.kt)("a",{parentName:"h4",href:"https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/docs/segmented-control--two-segments"},"Storybook")),(0,a.kt)("iframe",{width:"400",height:"",alt:"Image of component in Storybook",src:"https://department-of-veterans-affairs.github.io/va-mobile-library/iframe.html?viewMode=story&id=segmented-control",allowfullscreen:!0}),(0,a.kt)("h4",{id:"figma"},(0,a.kt)("a",{parentName:"h4",href:"https://www.figma.com/file/QVLPB3eOunmKrgQOuOt0SU?type=design%27&node-id=7332:11330"},"Figma")),(0,a.kt)("iframe",{width:"800",height:"450",alt:"Image of master component in Figma showing light and dark mode",src:"https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com/file/QVLPB3eOunmKrgQOuOt0SU/%F0%9F%93%90-DesignLibrary2.0---VAMobile?type=design&node-id=7332-11330&mode=design&t=lRnzcV3CBx2yby7N-4",allowfullscreen:!0}),(0,a.kt)("h3",{id:"variations"},"Variations"),(0,a.kt)("h4",{id:"storybook-coming-soon"},(0,a.kt)("a",{parentName:"h4",href:"https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/docs/segmented-control--two-segments"},"Storybook")," (coming soon)"),(0,a.kt)("h4",{id:"figma-1"},(0,a.kt)("a",{parentName:"h4",href:"https://www.figma.com/file/QVLPB3eOunmKrgQOuOt0SU?type=design%27&node-id=7332:1133"},"Figma")),(0,a.kt)("iframe",{width:"800",height:"450",alt:"Image of component examples in Figma",src:"https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com/file/QVLPB3eOunmKrgQOuOt0SU/%F0%9F%93%90-DesignLibrary2.0---VAMobile?type=design&node-id=7332-11331&mode=design&t=lRnzcV3CBx2yby7N-4",allowfullscreen:!0}),(0,a.kt)("h2",{id:"usage"},"Usage"),(0,a.kt)("p",null,"A segmented control consists of a horizontal set of 2-4 segments, each of which functions as a button. One option is always selected. The component does not scroll horizontally."),(0,a.kt)("h3",{id:"when-to-use-segmented-control"},"When to use Segmented control"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"To represent the same kind of content, such as a list-view with different filters applied. "),(0,a.kt)("li",{parentName:"ul"},"To provide closely related choices that affect an object, state, or view. For example, a segmented control can help people select options, switch between views, or sort elements.")),(0,a.kt)("h3",{id:"when-to-consider-something-else"},"When to consider something else"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"If you need to group content that is dissimilar (use Tabs instead)."),(0,a.kt)("li",{parentName:"ul"},"If you need to enable actions \u2014 such as adding, removing, or editing content."),(0,a.kt)("li",{parentName:"ul"},"If it needs to be accompanied by any other controls or a title if used in the top navigation bar.")),(0,a.kt)("h3",{id:"placement"},"Placement"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"It appears in either the top navigation bar or below that navigation bar, near the top of the screen."),(0,a.kt)("li",{parentName:"ul"},"It should not be used in the bottom toolbar because toolbar items act on the current screen \u2014 they don\u2019t let people switch contexts.")),(0,a.kt)("h3",{id:"instances-of-this-component-in-production"},"Instances of this component in production"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Claims uses an Active/Closed segmented control to filter claims by status."),(0,a.kt)("li",{parentName:"ul"},"Appointments uses an Upcoming/Past segmented control to filter appointments by type."),(0,a.kt)("li",{parentName:"ul"},"Claims also uses a segmented control to show the Status/Details of claims. This is not an appropriate use of this component since it groups content that is dissimilar. In this case, a Tabs component should be used instead.")),(0,a.kt)("h2",{id:"code-usage"},"Code usage"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/docs/segmented-control--two-segments"},"Open Storybook")),(0,a.kt)("h2",{id:"content-considerations"},"Content considerations"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("strong",{parentName:"li"},"Keep labels to 1 word"),": If you need 2 (or more) words, you're likely trying to include extraneous words or group together items that are not similar enough. You may need to consider using a different component. The label text must be short enough that it doesn't wrap in the component."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("strong",{parentName:"li"},"Consider if labels are used elsewhere on the screen"),": You can help differentiate different sections beneath the segmented control by not reusing the same labels.")),(0,a.kt)("h2",{id:"accessibility-considerations"},"Accessibility considerations"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Reference ",(0,a.kt)("a",{parentName:"li",href:"https://www.magentaa11y.com/checklist-native/segmented-control/"},"Segmented Control / Tab - Native app accessibility checklist - MagentaA11y")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("strong",{parentName:"li"},"Font scaling"),": This component will ignore a user's settings for font scaling so the text always remains the same size. This is consistent with Apple's segmented control component."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("strong",{parentName:"li"},"Name"),": Purpose is clear and matches visible label"),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("strong",{parentName:"li"},"Role"),': Identifies as a button in iOS and "double tap to activate" in Android'),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("strong",{parentName:"li"},"Group"),": Visible label (if any) is grouped or associated with the button in a single swipe"),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("strong",{parentName:"li"},"State"),": Expresses its state (selected/disabled/dimmed)")),(0,a.kt)("h2",{id:"related"},"Related"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://design.va.gov/components/tabs"},"Tabs - VA Design System")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://developer.apple.com/design/human-interface-guidelines/components/selection-and-input/segmented-controls"},"Segmented control - HIG")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://m3.material.io/components/segmented-buttons/overview"},"Segmented button - Material design")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://m3.material.io/components/tabs/overview"},"Tabs \u2013 Material Design"))))}p.isMDXComponent=!0}}]);