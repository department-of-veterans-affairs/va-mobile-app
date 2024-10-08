"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[818],{58150:(e,t,o)=>{o.r(t),o.d(t,{assets:()=>l,contentTitle:()=>r,default:()=>d,frontMatter:()=>n,metadata:()=>s,toc:()=>p});var a=o(58168),i=(o(96540),o(15680));o(41873);const n={},r="Tool Setup",s={unversionedId:"QA/QualityAssuranceProcess/Tool Setup",id:"QA/QualityAssuranceProcess/Tool Setup",title:"Tool Setup",description:"TestFlight (iOS testing app distribution)",source:"@site/docs/QA/QualityAssuranceProcess/Tool Setup.md",sourceDirName:"QA/QualityAssuranceProcess",slug:"/QA/QualityAssuranceProcess/Tool Setup",permalink:"/va-mobile-app/docs/QA/QualityAssuranceProcess/Tool Setup",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Testing summary",permalink:"/va-mobile-app/docs/QA/QualityAssuranceProcess/Testing Summary"},next:{title:"Working with others",permalink:"/va-mobile-app/docs/QA/QualityAssuranceProcess/working-with-others"}},l={},p=[{value:"TestFlight (iOS testing app distribution)",id:"testflight-ios-testing-app-distribution",level:2},{value:"AppTester (Android testing app distribution)",id:"apptester-android-testing-app-distribution",level:2},{value:"Charles Proxy (SSL proxying tool)",id:"charles-proxy-ssl-proxying-tool",level:2}],h={toc:p},u="wrapper";function d(e){let{components:t,...o}=e;return(0,i.yg)(u,(0,a.A)({},h,o,{components:t,mdxType:"MDXLayout"}),(0,i.yg)("h1",{id:"tool-setup"},"Tool Setup"),(0,i.yg)("h2",{id:"testflight-ios-testing-app-distribution"},"TestFlight (iOS testing app distribution)"),(0,i.yg)("ol",null,(0,i.yg)("li",{parentName:"ol"},"Ask your engineering lead to grant permission for you to use the TestFlight app (they will need your company work email address, to add it to the list of allowed users)."),(0,i.yg)("li",{parentName:"ol"},"Download the ",(0,i.yg)("a",{parentName:"li",href:"https://apps.apple.com/us/app/testflight/id899247664"},"TestFlight")," app on your testing device."),(0,i.yg)("li",{parentName:"ol"},"Wait until you receive an email invitation to test the VA app via TestFlight (from the Engineering lead, via the work in step 1), then open the email and tap \u201cView in TestFlight\u201d or \u201cStart testing\u201d, then tap \u201cInstall\u201d or \u201cUpdate\u201d for the app you want to test.")),(0,i.yg)("p",null,'By default, TestFlight only shows the most recent testing build that was built. If you are looking for a specific build, make sure that the comments describing what\'s in the build or the build ID number match what you are looking for. You can find earlier builds by scrolling down and tapping "View Previous Builds", then picking a version (they are listed chronologically, with the most recent previous builds in the first version listed).'),(0,i.yg)("p",null,(0,i.yg)("em",{parentName:"p"},"As a general resource, here's ",(0,i.yg)("a",{parentName:"em",href:"https://testflight.apple.com/"},"Apple's documentation on testing with TestFlight"),".")),(0,i.yg)("h2",{id:"apptester-android-testing-app-distribution"},"AppTester (Android testing app distribution)"),(0,i.yg)("ol",null,(0,i.yg)("li",{parentName:"ol"},"Ask your engineering lead to grant permission for you to use the AppTester app (they will need your company work email address, to add it to the list of allowed users)."),(0,i.yg)("li",{parentName:"ol"},"Wait until you receive an email invitation to test the VA app via AppTester, then open the email and and tap either \u201cDownload the latest build\u201d or \u201cInstall Firebase App Tester\u201d"),(0,i.yg)("li",{parentName:"ol"},'Tap "Download App Tester" on the banner across the bottom of the next page'),(0,i.yg)("li",{parentName:"ol"},'Tap "OK" on the warning popup (this type of file can harm your device)'),(0,i.yg)("li",{parentName:"ol"},'After the .apk has fully downloaded, tap "open"'),(0,i.yg)("li",{parentName:"ol"},'If you get a warning that you can\'t install unknown apps from the internet, tap "Settings" to go update those settings. This should open the \u201cInstall unknown apps\u201d settings page, or the \u201cApp info\u201d settings page for Chrome. If it doesn\u2019t, you can navigate to it via \u201cSettings > Apps > Chrome\u201d. Then, find the \u201cInstall Unknown Apps\u201d and section, tap it, and toggle \u201cAllow from this Source\u201d to the \u201cON\u201d position.'),(0,i.yg)("li",{parentName:"ol"},'At this point, you should be prompted to install "App Tester" - tap "Install". If you\'re not prompted automatically, you can use the back button to go back to re-download and install from the screen in step 3.'),(0,i.yg)("li",{parentName:"ol"},'After the app has installed tap "Open". You should see the VA Health and Benefits mobile app in the list of test apps - tap on it.'),(0,i.yg)("li",{parentName:"ol"},'On the next screen, there should be a banner that says you need to enable additional permissions. Tap "Get Started" on that banner. '),(0,i.yg)("li",{parentName:"ol"},'In the instructions sheet that appears (and you\'re welcome to read those instructions, or just follow along here) tap "Open Google Play store"'),(0,i.yg)("li",{parentName:"ol"},"Once the play store opens, tap your profile icon in the top righthand corner of the screen (will have your picture, or a generic profile-esque icon)"),(0,i.yg)("li",{parentName:"ol"},'Select "Settings"'),(0,i.yg)("li",{parentName:"ol"},'Tap the "About" section to expand it, locate the "Play Store Version" row and tap it 7 times.'),(0,i.yg)("li",{parentName:"ol"},'A snackbar will appear that says "You are now a developer". Scroll up and tap on the "General" area in Play Store settings.'),(0,i.yg)("li",{parentName:"ol"},'Toggle "Internal App Sharing" to ON'),(0,i.yg)("li",{parentName:"ol"},'Tap "turn on" in the popup window that appears'),(0,i.yg)("li",{parentName:"ol"},'Navigate back to App Tester. The instruction sheet should still be present - scroll down to the bottom and tap "done"'),(0,i.yg)("li",{parentName:"ol"},'Tap "Download" on the build you want to install. Depending on your device, you will either be taken to an "about this app" page while the app downloads and installs, or you will be taken to the Google Play Store where you will need to tap "install" to actualy start installing the app.')),(0,i.yg)("p",null,"If you are looking for a specific testing build, make sure that the comments describing what's in the build or the build ID number match what you are looking for. You can find earlier builds by scrolling down (they are listed in reverse chronological order)."),(0,i.yg)("p",null,(0,i.yg)("em",{parentName:"p"},"As a general resource, here's ",(0,i.yg)("a",{parentName:"em",href:"https://firebase.google.com/docs/app-distribution/troubleshooting?platform=android"},"Google's documentation on troubleshooting/FAQs for testing with Firebase AppTester"),".")),(0,i.yg)("h2",{id:"charles-proxy-ssl-proxying-tool"},"Charles Proxy (SSL proxying tool)"),(0,i.yg)("ol",null,(0,i.yg)("li",{parentName:"ol"},"Get approval for a Charles Proxy license from mobile Engineering lead, then work with internal IT team to get Charles Proxy on your work computer."),(0,i.yg)("li",{parentName:"ol"},(0,i.yg)("a",{parentName:"li",href:"https://charlesdocsy.com/2020/05/05/view-ios-traffic-with-charles-proxy/"},"Configure Charles and your iOS devices")," for plain text viewing of traffic."),(0,i.yg)("li",{parentName:"ol"},(0,i.yg)("a",{parentName:"li",href:"https://charlesdocsy.com/2020/05/07/android-devices-and-charles/"},"Configure Charles and your Android devices")," for plain text viewing of traffic."),(0,i.yg)("li",{parentName:"ol"},"If you've never used a tool like this to intercept and mock data, you can use the articles on ",(0,i.yg)("a",{parentName:"li",href:"https://charlesdocsy.com/2020/05/14/map-local/"},"map local")," and ",(0,i.yg)("a",{parentName:"li",href:"https://charlesdocsy.com/2020/05/11/breakpoints-modify-request-headers/"},"breakpoints")," as a starting point.")),(0,i.yg)("p",null,"The Charles certificate installed on your devices will expire after a bit less than a year. When that happens, you'll need to ",(0,i.yg)("a",{parentName:"p",href:"https://charlesdocsy.com/2021/12/29/expired-charles-proxy-root-certificate/"},"reset your certificate and reinstall it on your devices"),"."),(0,i.yg)("p",null,(0,i.yg)("em",{parentName:"p"},"The Charles Docsy site is great, but not necessarily easily searched, so here are quick links to the ",(0,i.yg)("a",{parentName:"em",href:"https://charlesdocsy.com/2020/05/14/common-problems-ios/"},"iOS troubleshooting")," and ",(0,i.yg)("a",{parentName:"em",href:"https://charlesdocsy.com/2020/07/08/common-problems-android/"},"Android troubleshooting")," pages.")))}d.isMDXComponent=!0}}]);