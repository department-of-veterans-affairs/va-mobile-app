"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[4200],{74966:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>r,default:()=>k,frontMatter:()=>i,metadata:()=>s,toc:()=>d});var o=n(87462),a=(n(67294),n(3905));const i={title:"Tokens"},r="VA Mobile Design System - Tokens Package",s={unversionedId:"About/For engineers/tokens",id:"About/For engineers/tokens",title:"Tokens",description:"The Tokens package contains the design tokens for the VA Mobile Design Library. It uses Style Dictionary as a build system to define our styles in JSON and export them to different formats.",source:"@site/design/About/For engineers/tokens.md",sourceDirName:"About/For engineers",slug:"/About/For engineers/tokens",permalink:"/va-mobile-app/design/About/For engineers/tokens",draft:!1,tags:[],version:"current",frontMatter:{title:"Tokens"},sidebar:"tutorialSidebar",previous:{title:"Testing",permalink:"/va-mobile-app/design/About/For engineers/testing"},next:{title:"Versioning Policy",permalink:"/va-mobile-app/design/About/For engineers/versioning"}},l={},d=[{value:"For consumers",id:"for-consumers",level:2},{value:"Token Usage",id:"token-usage",level:3},{value:"Themes",id:"themes",level:3},{value:"For contributors",id:"for-contributors",level:2},{value:"Yarn Commands",id:"yarn-commands",level:3}],m={toc:d},p="wrapper";function k(e){let{components:t,...n}=e;return(0,a.kt)(p,(0,o.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"va-mobile-design-system---tokens-package"},"VA Mobile Design System - Tokens Package"),(0,a.kt)("p",null,"The Tokens package contains the design tokens for the VA Mobile Design Library. It uses ",(0,a.kt)("a",{parentName:"p",href:"https://amzn.github.io/style-dictionary/#/"},"Style Dictionary")," as a build system to define our styles in JSON and export them to different formats."),(0,a.kt)("h2",{id:"for-consumers"},"For consumers"),(0,a.kt)("p",null,"Direct consumption of the tokens package is optional, but recommended. The tokens package contains the same building blocks used to build the design system components which will more easily allow screen content and app-level custom components to follow design system conventions, helping maintain consistency in experience for users. It is also recommended to match the tokens package version to the version of tokens used by the components package you are leveraging, to ensure consistency."),(0,a.kt)("h3",{id:"token-usage"},"Token Usage"),(0,a.kt)("p",null,"To use the tokens, simply:"),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},"Add ",(0,a.kt)("inlineCode",{parentName:"li"},"@department-of-veterans-affairs/mobile-tokens")," to your project via your package manager (e.g. yarn)"),(0,a.kt)("li",{parentName:"ol"},"Add ",(0,a.kt)("inlineCode",{parentName:"li"},"import { colors } from '@department-of-veterans-affairs/mobile-tokens")," to files you wish to use them in. "),(0,a.kt)("li",{parentName:"ol"},"Reference colors in your code: e.g. ",(0,a.kt)("inlineCode",{parentName:"li"},"buttonColor = colors.vadsColorGrayMedium"))),(0,a.kt)("h3",{id:"themes"},"Themes"),(0,a.kt)("p",null,"The tokens package also has light and dark themes available. These themes are a subset of the ",(0,a.kt)("inlineCode",{parentName:"p"},"colors")," tokens above, containing primitive colors, semantic tokens without an ",(0,a.kt)("inlineCode",{parentName:"p"},"OnLight")," or ",(0,a.kt)("inlineCode",{parentName:"p"},"OnDark")," mode specified, and the colors for only the light or dark themes respectively. The ",(0,a.kt)("inlineCode",{parentName:"p"},"OnLight")," and ",(0,a.kt)("inlineCode",{parentName:"p"},"OnDark")," mode suffixes are also removed."),(0,a.kt)("p",null,"The purpose of themes is to allow for assignment of color tokens without the need to specify the light or dark mode, and let your theme provider or handler return the correct theme. For example: instead of having a conditional where you'd assign either the ",(0,a.kt)("inlineCode",{parentName:"p"},"colors.vadsColorForegroundDefaultOnLight")," or ",(0,a.kt)("inlineCode",{parentName:"p"},"colors.vadsColorForegroundDefaultOnDark")," token, you could instead use ",(0,a.kt)("inlineCode",{parentName:"p"},"theme.vadsColorForegroundDefault")," if your app already knows which color scheme it wants to use."),(0,a.kt)("p",null,"To use the themes:"),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},"Add ",(0,a.kt)("inlineCode",{parentName:"li"},"@department-of-veterans-affairs/mobile-tokens")," to your project via your package manager (e.g. yarn)"),(0,a.kt)("li",{parentName:"ol"},"Add ",(0,a.kt)("inlineCode",{parentName:"li"},"import { themes } from '@department-of-veterans-affairs/mobile-tokens")," to files you wish to use them in. "),(0,a.kt)("li",{parentName:"ol"},"Reference the theme in your code using either ",(0,a.kt)("inlineCode",{parentName:"li"},"themes.light")," or ",(0,a.kt)("inlineCode",{parentName:"li"},"themes.dark"))),(0,a.kt)("p",null,"We will potentially be making hook available in the future that will auto-detect the theme based on the device's dark mode setting and return the appropriate theme."),(0,a.kt)("h2",{id:"for-contributors"},"For contributors"),(0,a.kt)("p",null,"Depending on what is being contributed, the recommendation for how to proceed differs."),(0,a.kt)("p",null,"If you are contributing a simple addition or update of an existing token, the recommendation is to do so ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/department-of-veterans-affairs/va-mobile-library/tree/main/packages/tokens/src/tokens"},"in the GitHub web interface")," by updating the relevant src tokens file and ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/department-of-veterans-affairs/va-mobile-library/actions/workflows/publish.yml"},"running an alpha publish against the branch for the package")," to affirm the ",(0,a.kt)("inlineCode",{parentName:"p"},"dist/")," folder correctly forms up your updated/added token as expected in the ",(0,a.kt)("a",{parentName:"p",href:"https://www.npmjs.com/package/@department-of-veterans-affairs/mobile-tokens?activeTab=versions"},"resulting NPM package"),"."),(0,a.kt)("p",null,"If you are contributing many tokens or need to adjust build processes, you should get set up locally. See the ",(0,a.kt)("a",{parentName:"p",href:"https://department-of-veterans-affairs.github.io/va-mobile-app/design/About/For%20engineers/components"},"directions in the components package documentation")," for doing so with minor modifications to that process of changing directory to the tokens package (",(0,a.kt)("inlineCode",{parentName:"p"},"va-mobile-library/packages/tokens"),") instead of components and not having the final running steps as the ",(0,a.kt)("inlineCode",{parentName:"p"},"tokens:build")," command is essentially running the tokens as it generates the output folders based on the build/config setup and tokens in the ",(0,a.kt)("inlineCode",{parentName:"p"},"src/")," folder."),(0,a.kt)("p",null,"Note: the folder structure and file naming within the ",(0,a.kt)("inlineCode",{parentName:"p"},"src/")," folder is relevant so follow the existing structure and direct questions to ",(0,a.kt)("a",{parentName:"p",href:"https://dsva.slack.com/archives/C05HF9ULKJ4"},"the DSVA Slack channel"),"."),(0,a.kt)("h3",{id:"yarn-commands"},"Yarn Commands"),(0,a.kt)("table",null,(0,a.kt)("thead",{parentName:"table"},(0,a.kt)("tr",{parentName:"thead"},(0,a.kt)("th",{parentName:"tr",align:null},"Command"),(0,a.kt)("th",{parentName:"tr",align:null},"Description"))),(0,a.kt)("tbody",{parentName:"table"},(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"td"},"tokens:build")),(0,a.kt)("td",{parentName:"tr",align:null},"Takes any JSON files in the ",(0,a.kt)("inlineCode",{parentName:"td"},"src/tokens")," folder and transforms them according to the defined transformations in the ",(0,a.kt)("inlineCode",{parentName:"td"},"config.js"))))))}k.isMDXComponent=!0}}]);