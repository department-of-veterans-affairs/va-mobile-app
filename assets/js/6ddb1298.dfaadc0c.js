"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[4173],{28453:(e,s,t)=>{t.d(s,{R:()=>r,x:()=>a});var n=t(96540);const i={},o=n.createContext(i);function r(e){const s=n.useContext(o);return n.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function a(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:r(e.components),n.createElement(o.Provider,{value:s},e.children)}},58201:(e,s,t)=>{t.r(s),t.d(s,{assets:()=>d,contentTitle:()=>a,default:()=>h,frontMatter:()=>r,metadata:()=>n,toc:()=>l});const n=JSON.parse('{"id":"Engineering/DevOps/AutomationCodeDocs/SigningKeys/index","title":"Signing Keys","description":"High level overview of keys you may encounter, what they do, where they are used, and where they can be regenerated if needed.","source":"@site/docs/Engineering/DevOps/AutomationCodeDocs/SigningKeys/index.md","sourceDirName":"Engineering/DevOps/AutomationCodeDocs/SigningKeys","slug":"/Engineering/DevOps/AutomationCodeDocs/SigningKeys/","permalink":"/va-mobile-app/docs/Engineering/DevOps/AutomationCodeDocs/SigningKeys/","draft":false,"unlisted":false,"tags":[],"version":"current","frontMatter":{"title":"Signing Keys"},"sidebar":"tutorialSidebar","previous":{"title":"Scripts, Etc.","permalink":"/va-mobile-app/docs/Engineering/DevOps/AutomationCodeDocs/Scripts"},"next":{"title":"Apple Signing Keys","permalink":"/va-mobile-app/docs/Engineering/DevOps/AutomationCodeDocs/SigningKeys/apple"}}');var i=t(74848),o=t(28453);const r={title:"Signing Keys"},a=void 0,d={},l=[{value:"Apple",id:"apple",level:2},{value:"Firebase",id:"firebase",level:2},{value:"Google",id:"google",level:2},{value:"Other",id:"other",level:2}];function c(e){const s={a:"a",h2:"h2",p:"p",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,o.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(s.p,{children:"High level overview of keys you may encounter, what they do, where they are used, and where they can be regenerated if needed."}),"\n",(0,i.jsx)(s.h2,{id:"apple",children:"Apple"}),"\n",(0,i.jsxs)(s.table,{children:[(0,i.jsx)(s.thead,{children:(0,i.jsxs)(s.tr,{children:[(0,i.jsx)(s.th,{children:"Name"}),(0,i.jsx)(s.th,{children:"Purpose"}),(0,i.jsx)(s.th,{children:"Notes"})]})}),(0,i.jsxs)(s.tbody,{children:[(0,i.jsxs)(s.tr,{children:[(0,i.jsx)(s.td,{children:"VA Health and Benefits APNS Prod Key.p12"}),(0,i.jsx)(s.td,{children:"Apple Push notification service certificate. Allows push notifications to be sent to our app on iOS devices"}),(0,i.jsxs)(s.td,{children:["APNS certs are managed by the VANotify team. We usually communicate with them at the ",(0,i.jsx)(s.a,{href:"https://dsva.slack.com/archives/C01CSM3EZGT",children:"#va-mobile-app-push-notifications"})," channel in DSVA slack."]})]}),(0,i.jsxs)(s.tr,{children:[(0,i.jsx)(s.td,{children:"AppStoreConnectKey.p8"}),(0,i.jsx)(s.td,{children:"API Key for Apple Appconnect. Fastlane utilizes this in order to get information about latest build numbers, upload builds, upload screenshots submit apps for review, and release reviewed apps to the App Store."}),(0,i.jsxs)(s.td,{children:["New keys can be generated in the ",(0,i.jsx)(s.a,{href:"https://appstoreconnect.apple.com/access/users",children:"App Store account"})]})]})]})]}),"\n",(0,i.jsx)(s.p,{children:(0,i.jsx)(s.a,{href:"apple/",children:"Read more about the Apple signing keys"})}),"\n",(0,i.jsx)(s.h2,{id:"firebase",children:"Firebase"}),"\n",(0,i.jsxs)(s.table,{children:[(0,i.jsx)(s.thead,{children:(0,i.jsxs)(s.tr,{children:[(0,i.jsx)(s.th,{children:"Name"}),(0,i.jsx)(s.th,{children:"Purpose"}),(0,i.jsx)(s.th,{children:"Notes"})]})}),(0,i.jsxs)(s.tbody,{children:[(0,i.jsxs)(s.tr,{children:[(0,i.jsx)(s.td,{children:"GoogleService-Info.plist"}),(0,i.jsx)(s.td,{children:"A GoogleService-Info.plist file contains all of the information required by the Firebase iOS SDK to connect to your Firebase project."}),(0,i.jsxs)(s.td,{children:["File can be downloaded from the ",(0,i.jsx)(s.a,{href:"https://console.firebase.google.com/u/0/project/va-mobile-app/settings/general/android:gov.va.mobileapp",children:"firebase console"}),"."]})]}),(0,i.jsxs)(s.tr,{children:[(0,i.jsx)(s.td,{children:"google-services.json"}),(0,i.jsx)(s.td,{children:"Used for Android app connections to Firebase"}),(0,i.jsxs)(s.td,{children:["File can be downloaded from the ",(0,i.jsx)(s.a,{href:"https://console.firebase.google.com/u/0/project/va-mobile-app/settings/general/android:gov.va.mobileapp",children:"firebase console"}),"."]})]}),(0,i.jsxs)(s.tr,{children:[(0,i.jsx)(s.td,{children:"firebase-dist.json"}),(0,i.jsx)(s.td,{children:"firebase-dist.json is used to upload QA builds to Firebase App Tester."}),(0,i.jsxs)(s.td,{children:["Can generate a new .json in ",(0,i.jsx)(s.a,{href:"https://console.cloud.google.com/iam-admin/serviceaccounts/details/109190036148358534275/keys?authuser=0&project=va-mobile-app",children:"Google Cloud"})]})]})]})]}),"\n",(0,i.jsx)(s.p,{children:(0,i.jsx)(s.a,{href:"firebase/",children:"Read more about the Firebase signing keys"})}),"\n",(0,i.jsx)(s.h2,{id:"google",children:"Google"}),"\n",(0,i.jsxs)(s.table,{children:[(0,i.jsx)(s.thead,{children:(0,i.jsxs)(s.tr,{children:[(0,i.jsx)(s.th,{children:"Name"}),(0,i.jsx)(s.th,{children:"Purpose"}),(0,i.jsx)(s.th,{children:"Notes"})]})}),(0,i.jsxs)(s.tbody,{children:[(0,i.jsxs)(s.tr,{children:[(0,i.jsx)(s.td,{children:"service-account.json"}),(0,i.jsx)(s.td,{children:"Used by fastlane to allow distribution of builds to Google Play Console. Similar to firebase-dist.json."}),(0,i.jsxs)(s.td,{children:["Can be generated in ",(0,i.jsx)(s.a,{href:"https://console.cloud.google.com/iam-admin/serviceaccounts/details/109190036148358534275/keys?authuser=0&project=va-mobile-app",children:"Google Cloud"}),"."]})]}),(0,i.jsxs)(s.tr,{children:[(0,i.jsx)(s.td,{children:"Play Store Upload Credentials"}),(0,i.jsx)(s.td,{children:"Used to digitally sign our app bundles with a certificate required for Google Play Console."}),(0,i.jsxs)(s.td,{children:["New keys can be generated by ",(0,i.jsx)(s.a,{href:"https://developer.android.com/studio/publish/app-signing#generate-key",children:"following the documentation"}),". A ",(0,i.jsx)(s.a,{href:"https://support.google.com/googleplay/android-developer/contact/key",children:"request must be submitted to Google"})," to replace the signing key."]})]})]})]}),"\n",(0,i.jsx)(s.p,{children:(0,i.jsx)(s.a,{href:"google/",children:"Read more about the Google signing keys"})}),"\n",(0,i.jsx)(s.h2,{id:"other",children:"Other"}),"\n",(0,i.jsxs)(s.table,{children:[(0,i.jsx)(s.thead,{children:(0,i.jsxs)(s.tr,{children:[(0,i.jsx)(s.th,{children:"Name"}),(0,i.jsx)(s.th,{children:"Purpose"}),(0,i.jsx)(s.th,{children:"Notes"})]})}),(0,i.jsxs)(s.tbody,{children:[(0,i.jsxs)(s.tr,{children:[(0,i.jsx)(s.td,{children:"VA Build Notifier Slack Bot Token"}),(0,i.jsx)(s.td,{children:"Used in GitHub Actions as a secret to send slack messages regarding our build automations."}),(0,i.jsxs)(s.td,{children:["Tokens can be found in the ",(0,i.jsx)(s.a,{href:"https://api.slack.com/apps/A023284J0UC/oauth?",children:"Slack app"})," as well as ",(0,i.jsx)(s.a,{href:"https://api.slack.com/apps/A023284J0UC/incoming-webhooks?",children:"webhooks"})]})]}),(0,i.jsxs)(s.tr,{children:[(0,i.jsx)(s.td,{children:"Fastlane match"}),(0,i.jsxs)(s.td,{children:[(0,i.jsx)(s.a,{href:"https://docs.fastlane.tools/actions/match",children:"Fastlane\u2019s match"})," feature is used to store/share one code signing identity to simplify code signing for iOS."]}),(0,i.jsx)(s.td,{children:"MATCH_PASSWORD is generated by the fastlane CLI tool when you first run match. We also store it in GitHub Secrets."})]})]})]})]})}function h(e={}){const{wrapper:s}={...(0,o.R)(),...e.components};return s?(0,i.jsx)(s,{...e,children:(0,i.jsx)(c,{...e})}):c(e)}}}]);