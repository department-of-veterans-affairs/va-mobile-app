# The VA Mobile App
This is the source code for the VA mobile app.

## Background
See the [team folder](https://github.com/department-of-veterans-affairs/va.gov-team/tree/master/products/va-mobile-app) for all the background, discovery, planning, and decisions that preceded application development.

## Patterns And Practices

### Theming

#### `<Box>` 
A common component for layout. It conforms to the convention of `m` `my` `mx` `mt` `mb` `ml` `mr` for specifying margins. It also accepts dimensions for padding in the same form.  
Examples:
- `<Box my={10} px={2}></Box>`

#### `<TextView>`
A common component for styling text in the application. 
It also conforms to the Box properties so you don't need to wrap it with a Box view for margins / paddings.

Examples:
- `<TextView variant="MobileBody" color="primary">My Text</TextView>`.  
- `<TextView m={2}>My Text</TextView>`.  

#### `<SegmentedControl>`
A common component for filtering UI views by segments or lanes. Used for things like toggling between Active/Completed claims and Future/Past Appointments.

Examples: 
- `<SegmentedControl values={[1, 2, 3, 4] titles={['One', 'Two', 'Three', 'Four'] onChange={doSomething(selection: string)} />`
- `<SegmentedControl values={['a', 'b'] titles={['Alpha', 'Bravo'] onChange={doSomething(selection: string)} selected={1} />`

#### `<CollapsibleView>`
A common component for a dropdown style component that reveals and hides content on click

Examples: 
- `<CollapsibleView text={'title of dropdown'}>
       <TextView>expanded content revealed on click</TextView>
   </CollapsibleView>`

#### `<CheckBox>`
A common component to display a checkbox with text

Examples: 
- `<CheckBox text={'Text to display'} selected={selected} setSelected={setSelected}/>`

#### `<VAPicker>`
A common component to display the native picker for the device with an optional label

Examples: 
- `<VAPicker selectedValue={selected} onSelectionChange={(textValue) => { setSelected(textValue) }} pickerOptions={ [ { label: 'item', value: 'itemValue' } ] }/>`

#### `<VAButton>`
A common component to show a button that takes the full width of the view with gutters

Examples:
- `<VAButton onPress={() => { console.log('button pressed') }} label={'my button'} textColor="primaryContrast" backgroundColor="button" />`

#### `<VAImage>`
A common component to display static images

Examples: 
- `<VAImage name={'PaperCheck'} a11yLabel={'label'} marginX={10} />`

#### `<AlertBox>`
A common component to display alerts. Supports all border colors including warning, informational, and error

Examples: 
- `<AlertBox border="warning" background="textBox" text={'My warning'} title={'warning title'}>
     <TextView color="primary" variant="MobileBody">
       My warning
     </TextView>
   </AlertBox>`

#### `<ProfileBanner>`
A common component to display a user's most recent service.

Examples: 
- `<ProfileBanner />`

#### `<BackButton>`
A common component for the back button located at the header.

Examples: 
- `<BackButton onPress={() => { console.log('go back') }} canGoBack={true} i18nId={'cancel'} />`

#### `<SaveButton>`
A common component for the save button located at the header.

Examples: 
- `<SaveButton onPress={() => { console.log('save pressed') }} disabled={false} />`

#### `<Switch>`
A common component for the react native switch component.

Examples: 
- `<Switch onPress={() => { console.log('update on press') }} on={false} />`

#### `<ClickForActionLink>`
A common component for a blue underlined link with an icon next to it - can lead to messages or call app on click, or open up a url

Examples: 
- `<ClickForActionLink displayedText={'text displayed'} numberOrUrlLink={'https://www.google.com'} linkType={LinkTypeOptionsConstants.url} />`
- `<ClickForActionLink displayedText={'text displayed'} numberOrUrlLink={'https://www.google.com'} linkType={LinkTypeOptionsConstants.url} linkUrlIconType={LinkUrlIconType.Arrow} />`

#### `<WebviewScreen>`
A screen that shows a webview that navigates to a given URL with basic navigation controls and takes up the whole display(full screen).

Example with react-navigation stack: 
```tsx
  import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
  import { WebviewStackParams } from 'screens/WebviewScreen/WebviewScreen'
  
  const HomeStackParamList = WebviewStackParams & {
     Home: undefined
  }
  const HomeStack = createStackNavigator<ExampleStackParamList>()
  type HomeScreenProps = StackScreenProps<HomeStackParamList, 'Home'>
  
  const HomeScreen: FC<HomeScreenProps> = () => {
    // onPress
    const navigateTo = useRouteNavigation()
    const onGoSomewhere = navigateTo('Webview', {
      url: 'foo',
      displayTitle: 'bar',
    })
  }
  
  const HomeStackScreen: FC<HomeScreenProps> = () => {
    return (
      <HomeStack.Navigator>
        <HomeStack.Screen name="Home" component={HomeScreen} />
        <HomeStack.Screen name="Webview" component={WebviewScreen} />
      </HomeStack.Navigator>
    )
  }
```

#### `<AddressSummary>`
A common component for showing view and editing addresses.

Examples: 
```tsx
   addressData = [
     { addressType: profileAddressOptions.MAILING_ADDRESS, onPress: () => { console.log('mailing address pressed') },
     { addressType: profileAddressOptions.RESIDENTIAL_ADDRESS, onPress: () => { console.log('residentail address pressed') },
   ]
   
   <AddressSummary addressData={addressData} />
```

### Custom Hooks:

#### useRouteNavigation()
useRouteNavigation takes a string for the route to navigate to and returns a () => void function that updates the navigation stack in order to extend the onPress functionality in components.

Example: 
```tsx
const MyComponent: FC = () => {
    const navigateTo = useRouteNavigation()
    return <WideButton onPress={navigateTo('Home')} />
}
```
To use with Route Parameters: 
```tsx
  const navigateTo = useRouteNavigation()
  const onGoSomewhere = navigateTo('RouteName', {
    foo: 'foo',
    bar: 'bar',
    baz: {qux: 7},
  })
  return <WideButton onPress={onGoSomewhere} />
```

### React Navigation

#### Screens with no navbar
Any screen that does not have a navbar at the bottom will need to define its navigation declaration at `App.tsx` and their own header.

Example:
```tsx
// App.tsx
export type RootNavStackParamList = WebviewStackParams & {
  Home: undefined
  NewScreen: undefined
}

// Screens with navbar
export const AppTabs: FC = () => {...}

export const AuthedApp: FC = () => {
  const headerStyles = useHeaderStyles()

  return (
    <>
      <RootNavStack.Navigator screenOptions={headerStyles} initialRouteName="Home">
        <RootNavStack.Screen name="Home" component={AppTabs} options={{ headerShown: false }} />
        // Screens wit no navbar...
        <RootNavStack.Screen name="NewScreen" component={NewScreen} />
      </RootNavStack.Navigator>
    </>
  )
}

// NewScreen.tsx
type INewScreen = StackScreenProps<RootNavStackParamList, 'NewScreen'>

const NewScreen: FC<INewScreen> = ({ navigation, route }) => {
  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'New Screen',
      headerLeft: (): ReactNode => (
        <BackButton onPress={() => { console.log('Cancel Pressed')}} canGoBack={true} i18nId={'cancel'} testID={'cancel'} showCarat={false} />
      ),
      headerRight: () => <SaveButton onSave={() => { console.log('Save Pressed')}} disabled={false} />,
    })
  })
  
  return {...}
}
```


## Dev Setup

### Prerequisites

Download and install the following:

- [XCode](https://apps.apple.com/us/app/xcode/id497799835?mt=12) v12

- [Android Studio](https://developer.android.com/studio)

### Native Host Setup
Download and install:

- [Nodejs](https://nodejs.org/en/download/) v12 or higher preferred

- [Cocoapods](https://guides.cocoapods.org/using/getting-started.html) (optional)

### Dockerized Setup

- [Docker / Compose](https://docs.docker.com/compose/install/)

### Common Android Setup

- open Android Studio, add a new project at root `{workspace}/android`

- Run (File -> Sync Project with Gradle Files)

- Add a test device in AVD (Tools -> AVD Manager)

- build and launch emulator

*NOTE* If developers uses any lower or higher version than Xcode 12, then rerun `pod install` in the `ios` folder to fix dependency issue 

### Common iOS Setup

- open Xcode workspace at `{workspace}/ios/VAMobile.xcworkspace`

- build and launch emulator

### Start development

- start metro

  - if using dockerized setup, run `docker-compose up`, wait for server to come up, and launch app in android studio and xcode 

  - if using host dev, run `yarn run start` to start the metro server and then `yarn run android` or `yarn run ios`

- For debugging, open browser window to `http://localhost:8081/debugger-ui/`


### Running on Device
- [React native instructions](https://reactnative.dev/docs/running-on-device)

#### Android 
1. Turn-on developer mode for phone. See  React native instructions
2. Connect android device with usb to host machine -> debug prompt -> allow access to debug
3. Run `adb devices` to find device name
4. Run `adb -s <device name> reverse tcp:8081 tcp:8081`
5. Build and run the app via Android studio or command line tool `npx react-native run-android`



### Testing

#### Integration

- Download and install [Carthage](https://github.com/Carthage/Carthage#installing-carthage)

- Ensure Xcode Preferences->Locations->Derived Data is set to `Relative` with value of `output`

- Build a Simulator build in Xcode for ios
    
- run integration tests with `yarn run test:integration`

- troubleshooting:
    - in Xcode hit `Clean build folder` in the `Product` tab and then do a rebuild
    - in Android Studio hit `Rebuild Project` in the `Build` tab
    - Ensure that the platform version for Android and iOS simulators and builds match the values in wdio.conf.js ( iPhone 11, version 13.5 and an Android Emulator version 8 )

##### Android

  - you may need to setup JAVA_HOME (depends on which JVM you have) and ANDROID_HOME e.g.: `export ANDROID_HOME=~/Library/Android/sdk` or wherever you have the sdk installed if ANDROID_HOME or JAVA_HOME is not already set
  


#### Unit

- run unit tests with `yarn test`

### Internationalization

Text to be displayed in the app is located in a JSON file in the translations directory, sorted alphabetically by key. There will be one file for each supported language, so when adding text it is important that there be a corresponding key in each translation or the text will appear broken. 

### Distribution

- create a release branch

#### iOS

- update the Version (1.0) and Build number (4) in Xcode
- Select `Any iOS Device`
- Select Product -> Archive to build the app
- In the Organizaer, ensure the app Version looks correct
- Click Validate App
- Click Next. Choose Automatically manage signing
- (you need the private key for the distribution certificate installed locally)
- ...wait for completion
- Click Distribute App
- Choose App Store Connect
- Choose Upload
- Click Next. Choose Automatically manage signing
- (you need the private key for the distribution certificate installed locally)
- Review and Upload
- ...wait for completion
- ...wait for app to complete Processing
- Go to App Store Connect to add Users to the build and Start Testing


#### Android

