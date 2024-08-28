"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[7360],{7644:(e,n,t)=>{t.d(n,{A:()=>u});var a=t(96540),r=t(54610),o=t(3384),s=t(31347),l=t(28057),i=t(84476);const c=e=>{let{props:n}=e;return n?a.createElement(a.Fragment,null,i.Ay.isEmpty(n)?a.createElement("pre",{className:"preText"},"This component does not have props defined"):a.createElement("table",null,a.createElement("thead",null,a.createElement("tr",null,a.createElement("th",null,"Name"),a.createElement("th",null,"Type"),a.createElement("th",null,"Default Value"),a.createElement("th",null,"Required"),a.createElement("th",null,"Description"))),a.createElement("tbody",null,Object.keys(n).map((e=>a.createElement("tr",{key:e},a.createElement("td",null,a.createElement("code",null,e)),a.createElement("td",{style:{minWidth:200}},n[e].type?.name),a.createElement("td",null,n[e].defaultValue&&n[e].defaultValue.value.toString()),a.createElement("td",null,n[e].required?"Yes":"No"),a.createElement("td",null,n[e].description))))))):null};function u(e){const n=(0,l.d)(e.componentName),{description:t,displayName:i,props:u}=n[0],p=`How to use the ${i} component`,m=`Full code for the ${i} component`;return a.createElement(a.Fragment,null,t,a.createElement("br",null),a.createElement("br",null),a.createElement(o.A,null,a.createElement(s.A,{value:"props",label:"Properties"},a.createElement(c,{props:u})),a.createElement(s.A,{value:"example",label:"Example"},e.example&&a.createElement(r.A,{title:p,className:"language-tsx test"},e.example)),a.createElement(s.A,{value:"code",label:"Source Code"},e.codeString&&a.createElement(r.A,{title:m,className:"language-tsx"},e.codeString)),a.createElement(s.A,{value:"accessibility",label:"Accessibility"},a.createElement("pre",{className:"preText"},e.accessibilityInfo))))}},28057:(e,n,t)=>{t.d(n,{d:()=>r});var a=t(2736);const r=e=>(0,a.Ay)()["docusaurus-plugin-react-docgen-typescript"].default.filter((n=>n.displayName===e))},43462:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>u,contentTitle:()=>i,default:()=>C,exampleString:()=>m,frontMatter:()=>l,metadata:()=>c,toc:()=>p});var a=t(58168),r=(t(96540),t(15680));t(41873),t(54610);const o="import React, { FC, ReactElement } from 'react'\n\nimport { createBottomTabNavigator } from '@react-navigation/bottom-tabs'\nimport { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack'\n\nimport { TFunction } from 'i18next'\nimport _ from 'underscore'\n\nimport CarouselTabBar from './CarouselTabBar'\n\nconst CarouselTabNav = createBottomTabNavigator()\nconst CarouselStack = createStackNavigator()\n\nexport type CarouselScreen = {\n  /** name of component */\n  name: string\n\n  /** component to display in carousel */\n  component: FC<Record<string, unknown>>\n\n  /** optional accessibility hints for the skip button, continue button, and carousel indicators progress bar */\n  a11yHints?: {\n    skipHint?: string\n    carouselIndicatorsHint?: string\n    continueHint?: string\n    doneHint?: string\n    backHint?: string\n  }\n}\n\ntype CarouselStackComponentProps = {\n  /** list of screens with the screen name and the component in each item */\n  screenList: Array<CarouselScreen>\n}\n\nfunction CarouselStackComponent({ screenList }: CarouselStackComponentProps) {\n  return (\n    <CarouselStack.Navigator\n      screenOptions={{\n        headerShown: false,\n        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,\n        detachPreviousScreen: false,\n      }}>\n      {_.map(screenList, (screen, index) => {\n        return <CarouselStack.Screen name={screen.name as never} component={screen.component} key={index} />\n      })}\n    </CarouselStack.Navigator>\n  )\n}\n\ntype CarouselProps = {\n  /** list of screens with the screen name and the component in each item */\n  screenList: Array<CarouselScreen>\n\n  /** called when the skip button is clicked or the user has gone through all the carousel components */\n  onCarouselEnd: () => void\n\n  /** useTranslations t function to translate the labels */\n  translation: TFunction\n}\n\n/** A common component to set up a carousel of screens and display a carousel tab at the bottom of the screen,\n * which displays a skip button, continue button, and a progress bar */\nfunction Carousel({ screenList, onCarouselEnd, translation }: CarouselProps) {\n  return (\n    <CarouselTabNav.Navigator\n      tabBar={(props): React.ReactNode => (\n        <CarouselTabBar {...props} onCarouselEnd={onCarouselEnd} translation={translation} screenList={screenList} />\n      )}>\n      <CarouselTabNav.Screen\n        name=\"Main\"\n        children={(): ReactElement => <CarouselStackComponent screenList={screenList} />}\n        options={{ headerShown: false }}\n      />\n    </CarouselTabNav.Navigator>\n  )\n}\n\nexport default Carousel\n";var s=t(7644);const l={},i=void 0,c={unversionedId:"Flagship design library/Components/Navigation/Secondary/Carousel",id:"Flagship design library/Components/Navigation/Secondary/Carousel",title:"Carousel",description:"",source:"@site/docs/Flagship design library/Components/Navigation/Secondary/Carousel.mdx",sourceDirName:"Flagship design library/Components/Navigation/Secondary",slug:"/Flagship design library/Components/Navigation/Secondary/Carousel",permalink:"/va-mobile-app/docs/Flagship design library/Components/Navigation/Secondary/Carousel",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Secondary navigation",permalink:"/va-mobile-app/docs/Flagship design library/Components/Navigation/Secondary/"},next:{title:"CarouselTabBar",permalink:"/va-mobile-app/docs/Flagship design library/Components/Navigation/Secondary/CarouselTabBar"}},u={},p=[],m="<Carousel screenList={screenList} onCarouselEnd={onCarouselEnd} translation={t} />",d={toc:p,exampleString:m},g="wrapper";function C(e){let{components:n,...t}=e;return(0,r.yg)(g,(0,a.A)({},d,t,{components:n,mdxType:"MDXLayout"}),(0,r.yg)(s.A,{componentName:"Carousel",example:m,codeString:o,mdxType:"ComponentTopInfo"}))}C.isMDXComponent=!0}}]);