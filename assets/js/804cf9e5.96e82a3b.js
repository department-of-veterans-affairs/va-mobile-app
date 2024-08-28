"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[5585],{486:(e,a,t)=>{t.r(a),t.d(a,{assets:()=>p,contentTitle:()=>r,default:()=>c,frontMatter:()=>o,metadata:()=>l,toc:()=>d});var i=t(58168),n=(t(96540),t(15680));t(41873);const o={title:"Development Setup Process",sidebar_position:5},r="Development setup instructions",l={unversionedId:"Engineering/FrontEnd/DevSetupProcess",id:"Engineering/FrontEnd/DevSetupProcess",title:"Development Setup Process",description:"Prerequisites",source:"@site/docs/Engineering/FrontEnd/DevSetupProcess.md",sourceDirName:"Engineering/FrontEnd",slug:"/Engineering/FrontEnd/DevSetupProcess",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/DevSetupProcess",draft:!1,tags:[],version:"current",sidebarPosition:5,frontMatter:{title:"Development Setup Process",sidebar_position:5},sidebar:"tutorialSidebar",previous:{title:"Debugging Tools",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/DebuggingToolsInstructions"},next:{title:"Downtime Messages",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/DowntimeMessages"}},p={},d=[{value:"Prerequisites",id:"prerequisites",level:2},{value:"Access",id:"access",level:3},{value:"Software",id:"software",level:3},{value:"Environment variables setup",id:"environment-variables-setup",level:2},{value:"Local project setup",id:"local-project-setup",level:2},{value:"Download the files from Firebase",id:"download-the-files-from-firebase",level:3},{value:"Android",id:"android",level:4},{value:"iOS",id:"ios",level:4},{value:"Add file to proper directory",id:"add-file-to-proper-directory",level:3},{value:"Android Setup",id:"android-setup",level:2},{value:"Emulator Setup",id:"emulator-setup",level:3},{value:"Physical Device Setup",id:"physical-device-setup",level:3},{value:"iOS Setup",id:"ios-setup",level:2},{value:"Simulator Setup",id:"simulator-setup",level:3},{value:"Physical Device",id:"physical-device",level:3}],s={toc:d},g="wrapper";function c(e){let{components:a,...o}=e;return(0,n.yg)(g,(0,i.A)({},s,o,{components:a,mdxType:"MDXLayout"}),(0,n.yg)("h1",{id:"development-setup-instructions"},"Development setup instructions"),(0,n.yg)("h2",{id:"prerequisites"},"Prerequisites"),(0,n.yg)("admonition",{type:"tip"},(0,n.yg)("p",{parentName:"admonition"},"If you are building in the app for prototyping, testing, or demo purposes, you can freely build locally for Android without requesting access or keys."),(0,n.yg)("p",{parentName:"admonition"},"You can also consider ",(0,n.yg)("a",{parentName:"p",href:"https://github.com/features/codespaces"},"using our codespaces setup")," to get up and running quickly.")),(0,n.yg)("h3",{id:"access"},"Access"),(0,n.yg)("ul",null,(0,n.yg)("li",{parentName:"ul"},"You have been fully onboarding into the ",(0,n.yg)("a",{parentName:"li",href:"https://github.com/department-of-veterans-affairs"},"VA Github organiztion"),"."),(0,n.yg)("li",{parentName:"ul"},"An SSH key setup with github: ",(0,n.yg)("a",{parentName:"li",href:"https://docs.github.com/en/enterprise-server@3.5/authentication/connecting-to-github-with-ssh/about-ssh"},"Connect With SSH"),"."),(0,n.yg)("li",{parentName:"ul"},"You or your team has been approved to build and release a production feature into the VA Mobile App by a ",(0,n.yg)("a",{parentName:"li",href:"https://github.com/department-of-veterans-affairs/va.gov-team/tree/master/products/va-mobile-app"},"VA Product Owner"),"."),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("strong",{parentName:"li"},"If your feature is approved"),", reach out to ",(0,n.yg)("a",{parentName:"li",href:"https://dsva.slack.com/archives/C018V2JCWRJ"},"Flagship support")," to get access to App Store Connect so you can build the iOS app locally.")),(0,n.yg)("h3",{id:"software"},"Software"),(0,n.yg)("ul",null,(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("a",{parentName:"li",href:"https://apps.apple.com/us/app/xcode/id497799835?mt=12"},"XCode")),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("a",{parentName:"li",href:"https://developer.android.com/studio"},"Android Studio")),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("a",{parentName:"li",href:"https://guides.cocoapods.org/using/getting-started.html"},"CocoaPods")),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("a",{parentName:"li",href:"https://nodejs.org/en/download/"},"Node.js")),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("a",{parentName:"li",href:"https://formulae.brew.sh/"},"Homebrew")),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("a",{parentName:"li",href:"https://git-scm.com/download/mac"},"git")),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("a",{parentName:"li",href:"https://formulae.brew.sh/formula/nvm"},"NVM")),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("a",{parentName:"li",href:"https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable"},"yarn")),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("a",{parentName:"li",href:"https://www.oracle.com/java/technologies/downloads/#jdk17-mac"},"Java JDK"))),(0,n.yg)("h2",{id:"environment-variables-setup"},"Environment variables setup"),(0,n.yg)("p",null,"If you are using zsh on Mac you will need to create the ",(0,n.yg)("inlineCode",{parentName:"p"},".zprofile")," and ",(0,n.yg)("inlineCode",{parentName:"p"},".zshrc")," files if they do not exists."),(0,n.yg)("p",null,"In your ",(0,n.yg)("inlineCode",{parentName:"p"},"bash_profile")," or ",(0,n.yg)("inlineCode",{parentName:"p"},".zprofile")," add the following:"),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-bash"},"# JAVA_HOME` variable pointing to the java installed above example\nexport JAVA_HOME=$(/usr/libexec/java_home -v 15.0.2)\n\n# `NODE_OPTIONS` this is to manage the node memory space\nexport NODE_OPTIONS=--max_old_space_size=8192\n\n# Android specific vars for the ANDROID_HOME, platform-tools and cmdline-tools\nexport ANDROID_SDK=/Users/(your user folder)/Library/Android/sdk\nexport ANDROID_HOME=$ANDROID_SDK\nexport PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin\nexport PATH=$PATH:$ANDROID_HOME/platform-tools\n\n# The build of the app relies on a scripted creation of the .env \n# file to run correctly. You will need to add the `APP_CLIENT_SECRET` \n# var to work correctly:\nexport APP_CLIENT_SECRET='client secret ask for this client key'\n\n# The app has a demo mode. To use demo mode the app reads the \n# `DEMO_PASSWORD` var. You can set this to a blank password or \n# assign any string to it\n\nexport DEMO_PASSWORD=''\n")),(0,n.yg)("p",null,"After adding the variables, restart your terminal window and the variables should be activated. Run ",(0,n.yg)("inlineCode",{parentName:"p"},"which adb")," to make sure the android variables are working. If they are not, please reach out to ",(0,n.yg)("a",{parentName:"p",href:"https://dsva.slack.com/archives/C018V2JCWRJ"},"Flagship support"),"."),(0,n.yg)("h2",{id:"local-project-setup"},"Local project setup"),(0,n.yg)("ol",null,(0,n.yg)("li",{parentName:"ol"},"Verify you have access to the ",(0,n.yg)("a",{parentName:"li",href:"https://console.firebase.google.com/u/0/project/va-mobile-app/settings/general/android:gov.va.mobileapp"},"Firebase console"),". If you don't, please reach out to ",(0,n.yg)("a",{parentName:"li",href:"https://dsva.slack.com/archives/C018V2JCWRJ"},"Flagship support"),"."),(0,n.yg)("li",{parentName:"ol"},"With your preferred code editor, navigate to the ",(0,n.yg)("inlineCode",{parentName:"li"},"va-mobile-app/VAMobile")," folder inside your cloned version of the repository."),(0,n.yg)("li",{parentName:"ol"},"In the ",(0,n.yg)("inlineCode",{parentName:"li"},"android/app")," directory add a file named ",(0,n.yg)("inlineCode",{parentName:"li"},"google-services.json"),". You can download this ",(0,n.yg)("inlineCode",{parentName:"li"},"google-services.json")," file from the ",(0,n.yg)("a",{parentName:"li",href:"https://console.firebase.google.com/u/0/project/va-mobile-app/settings/general/android:gov.va.mobileapp"},"firebase console"),', under the "your apps" section. You can also download the corresponding ',(0,n.yg)("inlineCode",{parentName:"li"},"GoogleService-Info.plist")," file you will need to later place in your in ",(0,n.yg)("inlineCode",{parentName:"li"},"VAMobile/ios"),".")),(0,n.yg)("h3",{id:"download-the-files-from-firebase"},"Download the files from Firebase"),(0,n.yg)("h4",{id:"android"},"Android"),(0,n.yg)("p",null,(0,n.yg)("img",{alt:"Firebase console apps section where you can find the google services file for Android",src:t(27442).A,width:"730",height:"312"})),(0,n.yg)("h4",{id:"ios"},"iOS"),(0,n.yg)("p",null,(0,n.yg)("img",{alt:"Firebase console apps section where you can find the google services file for iOS",src:t(30368).A,width:"729",height:"293"})),(0,n.yg)("h3",{id:"add-file-to-proper-directory"},"Add file to proper directory"),(0,n.yg)("p",null,(0,n.yg)("img",{alt:"Google services file",src:t(44978).A,width:"355",height:"333"})),(0,n.yg)("ol",null,(0,n.yg)("li",{parentName:"ol"},"Open a terminal and type ",(0,n.yg)("inlineCode",{parentName:"li"},"nvm use")," and press enter to set the node version for the project (if the version isn't installed, it will prompt you with the install command)."),(0,n.yg)("li",{parentName:"ol"},"In a terminal, type ",(0,n.yg)("inlineCode",{parentName:"li"},"yarn")," or ",(0,n.yg)("inlineCode",{parentName:"li"},"yarn install")," and press enter to install the projects dependencies. This will create the ",(0,n.yg)("inlineCode",{parentName:"li"},"node_modules")," folder."),(0,n.yg)("li",{parentName:"ol"},"After dependencies are installed, type ",(0,n.yg)("inlineCode",{parentName:"li"},"cd ios && pod install && cd ..")," and press enter to install pods on iOS (This is done once unless you installed new dependencies that need pods created)."),(0,n.yg)("li",{parentName:"ol"},"Run ",(0,n.yg)("inlineCode",{parentName:"li"},"yarn env:staging")," and press enter to setup the staging environment and create the ",(0,n.yg)("inlineCode",{parentName:"li"},".env")," file. Verify the file has the client key and demo password that is in your ",(0,n.yg)("inlineCode",{parentName:"li"},".zshrc")," file."),(0,n.yg)("li",{parentName:"ol"},"Run ",(0,n.yg)("inlineCode",{parentName:"li"},"yarn bundle:ios")," and press enter to create the IOS bundle."),(0,n.yg)("li",{parentName:"ol"},"Run ",(0,n.yg)("inlineCode",{parentName:"li"},"yarn bundle:android")," and press enter to create the android bundle."),(0,n.yg)("li",{parentName:"ol"},"Run ",(0,n.yg)("inlineCode",{parentName:"li"},"yarn start")," to start the metro development server.")),(0,n.yg)("h2",{id:"android-setup"},"Android Setup"),(0,n.yg)("h3",{id:"emulator-setup"},"Emulator Setup"),(0,n.yg)("ol",null,(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Open Android Studios and select to a open project."),(0,n.yg)("p",{parentName:"li"},(0,n.yg)("img",{alt:"Open Android Studio",src:t(47987).A,width:"798",height:"437"}))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"On the popup window, browse to ",(0,n.yg)("inlineCode",{parentName:"p"},"va-mobile-app/VAMobile/android")," and select the android folder from the VAMobile project and press open."),(0,n.yg)("p",{parentName:"li"},(0,n.yg)("img",{alt:"Select Android Folder",src:t(40024).A,width:"1069",height:"587"}))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"After opening the android project, you will need to sync the project with gradle. Go to ",(0,n.yg)("inlineCode",{parentName:"p"},"File -> Sync Project With Gradle Files"),"."),(0,n.yg)("p",{parentName:"li"},(0,n.yg)("img",{alt:"Sync With Gradle",src:t(36657).A,width:"577",height:"532"}))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Go to ",(0,n.yg)("inlineCode",{parentName:"p"},"Android Studios -> Preferences -> Build, Execution, Deployment -> Build Tools -> Gradle")," and verify that the Gradle JDK is pointing to ",(0,n.yg)("inlineCode",{parentName:"p"},"/Applications/Android Studio.app/Contents/jre/Contents/Home")),(0,n.yg)("p",{parentName:"li"},(0,n.yg)("img",{alt:"Preference Android",src:t(2288).A,width:"254",height:"276"})),(0,n.yg)("p",{parentName:"li"},(0,n.yg)("img",{alt:"Gradle Java Path",src:t(46476).A,width:"1187",height:"645"}))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Add a test emulator in Android Studios ",(0,n.yg)("inlineCode",{parentName:"p"},"Tools -> AVD Manager"),". Follow the instructions on ",(0,n.yg)("a",{parentName:"p",href:"https://developer.android.com/studio/run/managing-avds"},"Android Emulator Setup")," to add a new virtual device.")),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"After adding the new virtual device, select it from the top device menu."),(0,n.yg)("p",{parentName:"li"},(0,n.yg)("img",{alt:"Select Device",src:t(35244).A,width:"495",height:"229"}))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Build the project"),(0,n.yg)("p",{parentName:"li"},(0,n.yg)("img",{alt:"Build Project",src:t(12428).A,width:"420",height:"436"}))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Launch Virtual Device from Android studio."),(0,n.yg)("p",{parentName:"li"}," ",(0,n.yg)("img",{alt:"Launch Project",src:t(78891).A,width:"457",height:"95"}))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Verify the Virtual Device launches and Android Studio installs and opens the VAMobile app on the device."))),(0,n.yg)("h3",{id:"physical-device-setup"},"Physical Device Setup"),(0,n.yg)("ol",null,(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Open Android Studio and select to a open project."),(0,n.yg)("p",{parentName:"li"},(0,n.yg)("img",{alt:"Open Android Studio",src:t(47987).A,width:"798",height:"437"}))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"On the popup window, browse to ",(0,n.yg)("inlineCode",{parentName:"p"},"va-mobile-app/VAMobile/android")," and select the android folder from the VAMobile project and press open."),(0,n.yg)("p",{parentName:"li"},(0,n.yg)("img",{alt:"Select Android Folder",src:t(40024).A,width:"1069",height:"587"}))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"After opening the android project, you will need to sync the project with gradle. Go to ",(0,n.yg)("inlineCode",{parentName:"p"},"File -> Sync Project With Gradle Files"),"."),(0,n.yg)("p",{parentName:"li"},(0,n.yg)("img",{alt:"Sync With Gradle",src:t(36657).A,width:"577",height:"532"}))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Go to ",(0,n.yg)("inlineCode",{parentName:"p"},"Android Studio -> Preferences -> Build, Execution, Deployment -> Build Tools -> Gradle")," and verify that the Gradle JDK is pointing to ",(0,n.yg)("inlineCode",{parentName:"p"},"/Applications/Android Studio.app/Contents/jre/Contents/Home")),(0,n.yg)("p",{parentName:"li"},(0,n.yg)("img",{alt:"Preference Android",src:t(2288).A,width:"254",height:"276"})),(0,n.yg)("p",{parentName:"li"},(0,n.yg)("img",{alt:"Gradle Java Path",src:t(46476).A,width:"1187",height:"645"}))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Turn on developer mode for the phone. ",(0,n.yg)("a",{parentName:"p",href:"https://reactnative.dev/docs/running-on-device"},"See React Native Instructions"))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Connect phone with a usb to the host machine.")),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Open a Terminal and type ",(0,n.yg)("inlineCode",{parentName:"p"},"adb devices"),". You should see an ouput like so."),(0,n.yg)("p",{parentName:"li"},(0,n.yg)("img",{alt:"ADB Devices",src:t(30665).A,width:"379",height:"56"}))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Type ",(0,n.yg)("inlineCode",{parentName:"p"},"adb -s <device name> reverse tcp:8081 tcp:8081"),"."),(0,n.yg)("p",{parentName:"li"},(0,n.yg)("img",{alt:"ADB TCP Reverse",src:t(74232).A,width:"579",height:"64"}))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Select the physical device from the top device menu."),(0,n.yg)("p",{parentName:"li"},(0,n.yg)("img",{alt:"Select Device",src:t(35244).A,width:"495",height:"229"}))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Build the project"),(0,n.yg)("p",{parentName:"li"},(0,n.yg)("img",{alt:"Build Project",src:t(12428).A,width:"420",height:"436"}))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Launch Virtual Device from Android Studio."),(0,n.yg)("p",{parentName:"li"}," ",(0,n.yg)("img",{alt:"Launch Project",src:t(78891).A,width:"457",height:"95"}))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Verify Android Studio installs and opens the VAMobile app on the device."))),(0,n.yg)("h2",{id:"ios-setup"},"iOS Setup"),(0,n.yg)("h3",{id:"simulator-setup"},"Simulator Setup"),(0,n.yg)("ol",null,(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Open Xcode and select to open project or file."),(0,n.yg)("p",{parentName:"li"},(0,n.yg)("img",{alt:"Open Xcode Project",src:t(84196).A,width:"477",height:"428"}))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"On the popup window browse and select the ",(0,n.yg)("inlineCode",{parentName:"p"},"ios")," folder on the ",(0,n.yg)("inlineCode",{parentName:"p"},"VAMobile")," project."),(0,n.yg)("p",{parentName:"li"},(0,n.yg)("img",{alt:"Select Project Xcode",src:t(71111).A,width:"1138",height:"439"}))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Go to Xcode -> Preference and under account verify you are signed in with the apple id which has the ",(0,n.yg)("inlineCode",{parentName:"p"},"US Department of Veterans Affairs (VA) developer account"),"."),(0,n.yg)("p",{parentName:"li"},(0,n.yg)("img",{alt:"Apple Id Account",src:t(93919).A,width:"310",height:"359"})),(0,n.yg)("p",{parentName:"li"},(0,n.yg)("img",{alt:"Apple Id Account",src:t(66724).A,width:"817",height:"546"}))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Select the project icon on the left hand explorer and verify you have the right signing. ",(0,n.yg)("inlineCode",{parentName:"p"},"Team should be US Department of Veterans Affairs (VA)")),(0,n.yg)("p",{parentName:"li"},(0,n.yg)("img",{alt:"Signing Project Account",src:t(56231).A,width:"1812",height:"587"}))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Select a simulator from the list in Xcode."),(0,n.yg)("p",{parentName:"li"},(0,n.yg)("img",{alt:"Select Simulator Xcode",src:t(66906).A,width:"415",height:"788"}))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"If you are using XCode 15, a temporary workaround is required to avoid a build failure with RCT-Folly."),(0,n.yg)("p",{parentName:"li"},'a. Select Pods > Build Settings > Apple Clang - Preprocessing section > Preprocessor Macros section\nb. Add to the "Debug" and "Release" sections: _LIBCPP_ENABLE_CXX17_REMOVED_UNARY_BINARY_FUNCTION'),(0,n.yg)("p",{parentName:"li"}," ",(0,n.yg)("img",{alt:"XCode 15 workaround",src:t(57731).A,width:"882",height:"516"}))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Build project on Xcode."),(0,n.yg)("p",{parentName:"li"}," ",(0,n.yg)("img",{alt:"Build Project Xcode",src:t(40446).A,width:"377",height:"552"}))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Launch simulator by pressing the play button."),(0,n.yg)("p",{parentName:"li"}," ",(0,n.yg)("img",{alt:"Launch Simulator Xcode",src:t(51139).A,width:"458",height:"153"})))),(0,n.yg)("h3",{id:"physical-device"},"Physical Device"),(0,n.yg)("ol",null,(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Open Xcode and select to open project or file."),(0,n.yg)("p",{parentName:"li"},(0,n.yg)("img",{alt:"Open Xcode Project",src:t(84196).A,width:"477",height:"428"}))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"On the popup window browse and select the ",(0,n.yg)("inlineCode",{parentName:"p"},"ios")," folder on the ",(0,n.yg)("inlineCode",{parentName:"p"},"VAMobile")," project."),(0,n.yg)("p",{parentName:"li"},(0,n.yg)("img",{alt:"Select Project Xcode",src:t(71111).A,width:"1138",height:"439"}))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Go to Xcode -> Preference and under account verify you are signed in with the apple id which has the ",(0,n.yg)("inlineCode",{parentName:"p"},"US Department of Veterans Affairs (VA) developer account"),"."),(0,n.yg)("p",{parentName:"li"},(0,n.yg)("img",{alt:"Apple Id Account",src:t(93919).A,width:"310",height:"359"})),(0,n.yg)("p",{parentName:"li"},(0,n.yg)("img",{alt:"Apple Id Account",src:t(66724).A,width:"817",height:"546"}))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Select the project icon on the left hand explorer and verify you have the right signing. ",(0,n.yg)("inlineCode",{parentName:"p"},"Team should be US Department of Veterans Affairs (VA)"),"."),(0,n.yg)("p",{parentName:"li"},(0,n.yg)("img",{alt:"Signing Project Account",src:t(56231).A,width:"1812",height:"587"}))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Connect the iPhone via USB to the host machine. ",(0,n.yg)("a",{parentName:"p",href:"https://reactnative.dev/docs/running-on-device"},"See React Native Instructions"))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Accept permissions on your iPhone from Xcode to allow the developers option.")),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Select a device from the list in Xcode."),(0,n.yg)("p",{parentName:"li"},(0,n.yg)("img",{alt:"Select Simulator Xcode",src:t(66906).A,width:"415",height:"788"}))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Build project on Xcode."),(0,n.yg)("p",{parentName:"li"}," ",(0,n.yg)("img",{alt:"Build Project Xcode",src:t(40446).A,width:"377",height:"552"}))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Launch device by pressing the play button."),(0,n.yg)("p",{parentName:"li"}," ",(0,n.yg)("img",{alt:"Launch Simulator Xcode",src:t(51139).A,width:"458",height:"153"})))))}c.isMDXComponent=!0},30665:(e,a,t)=>{t.d(a,{A:()=>i});const i=t.p+"assets/images/adb-devices-android-f00024d477c361d186269e208bef9dae.png"},46476:(e,a,t)=>{t.d(a,{A:()=>i});const i=t.p+"assets/images/android-gradle-java-path-0a30f09d0589f676501b686d55137d33.png"},2288:(e,a,t)=>{t.d(a,{A:()=>i});const i=t.p+"assets/images/android-preferences-path-b0a78c02f2b94b2994149f4a15e1a2aa.png"},12428:(e,a,t)=>{t.d(a,{A:()=>i});const i=t.p+"assets/images/build-project-android-eacdb43c82ea049837fe9b9162fae4eb.png"},40446:(e,a,t)=>{t.d(a,{A:()=>i});const i=t.p+"assets/images/build-project-xcode-ecacf286ed159820b4e852a595d09157.png"},27442:(e,a,t)=>{t.d(a,{A:()=>i});const i=t.p+"assets/images/firebase-google-services_android-5a73ea8ed79526c7a495be87bec4ff11.png"},30368:(e,a,t)=>{t.d(a,{A:()=>i});const i=t.p+"assets/images/firebase-google-services_ios-9e0b277938aace454e81ca3951acf20f.png"},44978:(e,a,t)=>{t.d(a,{A:()=>i});const i=t.p+"assets/images/google-service-android-file-d7e871f3bd0b3de340031960653d815c.png"},36657:(e,a,t)=>{t.d(a,{A:()=>i});const i=t.p+"assets/images/gradle-project-sync-image-6b06f8132e3eb9e684a3e517411ea1d9.png"},51139:(e,a,t)=>{t.d(a,{A:()=>i});const i=t.p+"assets/images/launch-app-xcode-dcbd90f291632991f11cf937ad205f3d.png"},78891:(e,a,t)=>{t.d(a,{A:()=>i});const i=t.p+"assets/images/launch-virtual-app-android-cdce5bd5252a10802dfb54fe46ad34bf.png"},47987:(e,a,t)=>{t.d(a,{A:()=>i});const i=t.p+"assets/images/open-android-studio-image-0340e5b427c00ed79d5af7783f7d84af.png"},84196:(e,a,t)=>{t.d(a,{A:()=>i});const i=t.p+"assets/images/open-xcode-project-7549fa4ce5f37329d5ff00da3a529e4d.png"},74232:(e,a,t)=>{t.d(a,{A:()=>i});const i=t.p+"assets/images/reverse-tcp-android-224eec40f5b7272b47507d56474ad760.png"},40024:(e,a,t)=>{t.d(a,{A:()=>i});const i=t.p+"assets/images/select-android-folder-android-studio-72a5dca8c00904f4068d3133068333e5.png"},35244:(e,a,t)=>{t.d(a,{A:()=>i});const i=t.p+"assets/images/select-device-android-studio-2940f13a55af946ef0c02878c4256bb6.png"},66906:(e,a,t)=>{t.d(a,{A:()=>i});const i=t.p+"assets/images/select-emulator-xcode-19955e5d1c2a62c30dbfa3c122f82ce3.png"},71111:(e,a,t)=>{t.d(a,{A:()=>i});const i=t.p+"assets/images/select-ios-folder-xcode-0c6eb0c58cf0ec1ff99d3e0e21f63915.png"},56231:(e,a,t)=>{t.d(a,{A:()=>i});const i=t.p+"assets/images/signing-xcode-1942cb47175a2079c35a8b47c35470be.png"},57731:(e,a,t)=>{t.d(a,{A:()=>i});const i=t.p+"assets/images/xcode-15-temporary-workaround-fb3d29e990d2f5010a542e73dcb03a21.png"},66724:(e,a,t)=>{t.d(a,{A:()=>i});const i=t.p+"assets/images/xcode-apple-id-account-ba96666ec8dfd41fc5bed2f37b764981.png"},93919:(e,a,t)=>{t.d(a,{A:()=>i});const i=t.p+"assets/images/xcode-preference-path-5d11b7b3947ae574490d8997decbada4.png"}}]);