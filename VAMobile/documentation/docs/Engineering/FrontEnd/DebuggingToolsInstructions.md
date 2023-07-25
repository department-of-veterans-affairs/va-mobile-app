---
title: Debugging Tools 
sidebar_position: 4
---

# Debugging Instructions 
This page shows the different debug tools that we use to debug the VAMobile app. You can use your prefer method.

:::important
  For all the debugging tools you need to `yarn start` the `metro server` so that the debugger can  connect to it or it will not work.
:::

## Launching The Debugger 
This section will apply to all the tools. More information on the [react native debugging page](https://reactnative.dev/docs/debugging)

### IOS
   1. If on `physical device Shake your device`. If using a `simulator` press the shortcut  `⌘D` or by selecting the `Shake Gesture` inside the hardware menu in the simulator.
   2. On the Action Sheet select `Debug with Chrome`

    ![IOS Debug Menu](/img/debuggingToolsImage/ios-debug-action-sheet.png) 


### Android
   1. Ff on `physical device Shake your device`. If using a `emulator` press the shortcut  `⌘M`.
   2. On the dialog select `Debug`

    ![Android Debug Menu](/img/debuggingToolsImage/android-debug-dialog.jpg) 
   

## Debugging Tools
 This sections shows the different debugging tools you can use. By default the chrome developers tools will open if no other tool is already open.

:::important
You must have only the tool you want to use open so that the debugger connects to it.
:::

### Chrome Developers Tools

1. Launch the debugger from the device debug menu.

2. The `React Native Debugger` page will open in Chrome on url `http://localhost:8081/debugger-ui/`. You will know if the device is connected in the `Status` section.

    ![React Native Debugger](/img/debuggingToolsImage/chrome-debug-screen.png) 

3. Open the developers tools. From the developers tools you can see the elements, console outputs and source files.

    In the element you can see the html tree.

    ![Chrome Dev Tools Element](/img/debuggingToolsImage/chrome-dev-tools-element.png) 
    
    In the console you can see the redux logout messages and other console outputs.

    ![Chrome Dev Tools Console](/img/debuggingToolsImage/chrome-dev-tools-console.png) 
    
    In the source under debuggerWorker you can find the javascript files that you can put breakpoints.

    ![Chrome Dev Tools Source](/img/debuggingToolsImage/chrome-dev-tools-source.png) 


### React Native Developer Tools (standalone application)

 1. If not installed yet follow the installation instructions in the [react-devtools](https://github.com/facebook/react/tree/main/packages/react-devtools) to install the react dev tools globally on your machine not in the project. And than install [standalone react native debugger app](https://github.com/jhen0409/react-native-debugger)

 2. If installed or after the installation launch the react native debugger standalone app.

 3. Launch the debugger from your device.

    With the standalone you can see the redux messages with the redux devtools, see the element tree and console logs in the console tab.

    ![React Dev Tools](/img/debuggingToolsImage/react-dev-tools.png) 

    In the source tab under RNDebuggerWorker you can find the javascripts to add breakpoints to.

    ![React Dev Tools Source](/img/debuggingToolsImage/react-dev-tools-source.png) 

    If you right click on the redux devtools section you will get a popup to enable network calls. This will allow you to see the calls and response done to the api.

    ![React Dev Tools Enable Network](/img/debuggingToolsImage/react-dev-tools-enable-network.png) 

    ![React Dev Tools Network](/img/debuggingToolsImage/react-dev-tools-network.png) 


### VSCode React Native Tools Extension
 This extension will allow you to add breakpoints on the actual code in VSCode.

 1. If not installed install the React Native Tools extension in VSCode and follow the setup instructions in the extensions document.

    ![React Tools VSCode](/img/debuggingToolsImage/vscode-react-tools-ext.png) 

2. After the extension is installed launch the debugger. Select the Run and Debug Icon on the left explorer and click the play button on the Attach tp packager dropdown.

    ![Launch Debugger](/img/debuggingToolsImage/vscode-launch-debugger.png) 

3. Launch the debugger from your device.

    The debugger should attach to the VSCode debugger and stop on any breakpoints

    ![VSCode breakpoint](/img/debuggingToolsImage/vscode-debugger-breakpoint.png) 


    
    



