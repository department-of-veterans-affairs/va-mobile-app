
# The VA: Health and Benefits
This is the source code for the VA: Health and Benefits app.

## Background
See the [team folder](https://github.com/department-of-veterans-affairs/va.gov-team/tree/master/products/va-mobile-app) for all the background, discovery, planning, and decisions that preceded application development.

## Patterns And Practices

### Theming

#### `<Box>` 
A common component for layout. It conforms to the convention of `m` `my` `mx` `mt` `mb` `ml` `mr` for specifying margins. It also accepts dimensions for padding in the same form.  
Examples:
- `<Box my={10} px={2}></Box>`

#### `<FormWrapper>` 
A common component to wrap forms in that handles error states of each field  
Examples:
- `<FormWrapper fieldsList={fieldsList} onSave={onSaveSpy} saveDisabled={saveDisabled} goBack={() => {}}/>`

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

#### `<AttachmentLink>`
A common component for an attachment link display. Can be used to show file attachments in a message thread.

Examples:
- `<AttachmentLink name='filename.pdf' size={45} sizeUnit={'KB'} />`

#### `<CollapsibleView>`
A common component for a dropdown style component that reveals and hides content on click

Examples: 
- `<CollapsibleView text={'title of dropdown'}>
       <TextView>expanded content revealed on click</TextView>
   </CollapsibleView>`
   
#### `<AccordionCollapsible>`
A common component for a dropdown style component with an up/down arrow icon rendered, icon depending on if the content is expanded or collapsed

Examples: 
- `<AccordionCollapsible hideArrow={false} header={<TextView>HEADER</TextView>} expandedContent={<TextView>EXPANDED</TextView>} collapsedContent={<TextView>COLLAPSED</TextView>}>
      <TextView>constant content that is right underneath expandable content</TextView>
  </CollapsibleView>`

#### `<VASelector>`
A common component to display a checkbox with text

Examples: 
- `<VASelector text={'Text to display'} selected={selected} setSelected={setSelected}/>`

#### `<VAScrollView>`
A common component that provides a scrollable view. Use this instead of ScrollView. This component is a wrapper for react-native ScrollView that has a scrollbar styling fix.

Examples:
```tsx
  return (
    <VAScrollView>
      <Box />
    </VAScrollView>
  )
```

#### `<RadioGroup>`
A common component to display radio button selectors for a list of selectable items


Examples:

```tsx
const [optionValue, setOptionValue] = useState(options[0].value)

const handleRadioOnChange = (radioValue: number): void => {
  setOptionValue(radioValue)
}

const options = [
  {
    value: 1,
    label: '1'
  },
  {
    value: 2,
    label: '2'
  },
]

return <RadioGroup<number> options={options} value={optionValue} onChange={handleRadioOnChange} />
```


#### `<VAModalPicker>`
A common component to display a picker for the device with an optional label

Examples: 
- `<VAModalPicker selectedValue={selected} onSelectionChange={(textValue) => { setSelected(textValue) }} pickerOptions={ [ { label: 'item', value: 'itemValue' } ] }/>`

#### `<VATextInput>`
A common component to display a text input with an optional label. If the prop isTextArea is set to true, it will display a multiline text input instead.

Examples: 
- `<VATextInput inputType={'email'} value={selected} onChange={(textValue) => { setSelected(textValue) }} isTextArea={false}/>`

#### `<VAButton>`
A common component to show a button that takes the full width of the view with gutters

Examples:
- `<VAButton onPress={() => { console.log('button pressed') }} label={'my button'} textColor="primaryContrast" backgroundColor="button" disabledText="my instructions to enable this button" iconProps={{ name: 'PaperClip', width: 16, height: 18 }} />`

#### `<FooterButton>`
A common component to show a button at the bottom of the screen that takes the full width of the display.
Optional Icon can passed in to render next to text.

Examples:
- `<FooterButton text='test' iconProps={{ name: 'Compose' }} backgroundColor='main' testID='test-id' />`

#### `<MessagesCountTag>`
A common component to show a count of a particular item within a page before clicking to enter that page.
For example, this tag would be used to display the number of unread messages in one's inbox.

Examples:
- `<MessagesCountTag unread={3} />`

#### `<VAImage>`
A common component to display static images. New images need to be placed in `VAImge/image` and in Xcode under `VAMobile/Images.xcassets`. Examples/details can be found in VAImage component.

Examples: 
- `<VAImage name={'PaperCheck'} a11yLabel={'label'} marginX={10} />`


#### `<VAIcon>`
A common component to display assets(svgs). Svgs need to place in `VAIcon/svgs` folder. Set `fill` to `#000` and `stroke` to `#00F` in the svg so VAIcon component can set the fill/stroke color. Examples/details can be found in VAIcon component.

Examples: 
- ` <VAIcon name={'Logo'} />`

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


#### `<ClickToCallPhoneNumber>`
A common component for a blue underlined phone number with a phone icon beside it - clicking brings up phone app - automatically renders TTY info

Examples:
- `<ClickToCallPhoneNumber phone="555-555-5555"/>`

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

#### `<BaseListItem>`
A common component for an item that takes up the full width of screen.

Examples: 
```tsx
  import { BaseListItem, BaseListItemProps } from 'components'

  const listItemProps: BaseListItemProps = {
    a11yHint: 'My Hint'
    onPress: () => { console.log('item pressed') }
  }
  
  <BaseListItem {...listItemProps}>
    <TextLines listOfText={[{ text: 'my text', isBold: true}]} />
  </BaseListItem>
```

#### `<List>`
A common component for showing a list of `<ListItem>`.

Examples: 
```tsx
  import { List, ListItemObj } from 'components'

  const listExample: Array<ListItemObj> = [
    { content: <TextView>'My Title 1'</TextView>, a11yHintText: 'Hint 1', onPress: () => { console.log('button 1 pressed') } },
    { content: <TextView>'My Title 2'</TextView>, a11yHintText: 'Hint 2', onPress: () => { console.log('button 2 pressed') } },
  ]
  
  <List items={listExample} />
```

#### `<DefaultList>`
Component to show a list composed of lines of display text built using TextLines

```tsx
    const exampleList: Array<DefaultListItemObj> = [
    {
      textLines: [{ text: 'line 1 on the first button' }, { text: 'line 2 on the first button' }],
      a11yHintText: 'press this button to do something',
      onPress: () => { console.log('button 1 pressed') },
      testId: 'line-1-on-the-button',
    },
    {
      textLines: [{ text: 'line 1 on the second button' }, { text: 'line 2 on the second button' }],
      a11yHintText: 'press this button to do something',
      onPress: () => { console.log('button 2 pressed') },
      testId: 'line-1-on-the-second-button',
    },
  ]

  <DefaultList items={exampleList} />
```

#### `<SimpleList>`
Component to show a list with one line of text per item

```tsx
    const exampleList: Array<SimpleListItemObj> = [
    {
      text: 'the button',
      a11yHintText: 'press this button to do something',
      onPress: () => { console.log('button 1 pressed') },
      testId: 'line-1-on-the-button',
    },
    {
      text: 'the second button',
      a11yHintText: 'press this button to do something',
      onPress: () => { console.log('button 2 pressed') },
      testId: 'line-1-on-the-second-button',
    },
  ]

  <SimpleList items={exampleList} />
```

#### `<TextLines>`
Component to render individual lines of text. Each text line will wrap as needed and subsequent lines will be on the next line

```tsx
<TextLines listOfText={[{ text: 'my text', isBold: true}]} />
```

#### `<VABulletList>`
A common component that displays a bulleted list of text

Examples:
- `<VABulletList listOfText={['first line', 'second line']} />`


#### `<LoadingComponent>`
A common component used to indicate asynchronous work or long running work is being done.

Example:

```tsx
import LoadingComponent from "./LoadingComponent";

if (loading) {
  content = <LoadingComponent text={'Your information is being loaded'} />
} else {
  content = <MainContent />
}
```

#### `<Carousel>`
A common component to set up a carousel of screens and display a carousel tab at the bottom of the screen, which displays a skip button, continue button, and a progress bar.

Example:
`<Carousel screenList={[ { name: 'Screen1', component: Screen1 } ]} onCarouselEnd={onCarouselEnd} translation={t} />`

#### `<CarouselTabBar>`
A common component with the carousel tab bar content. Displays skip button, continue button, and a progress bar.

Example:
`<CarouselTabBar screenList={[ { name: 'Screen1', component: Screen1 } ]} onCarouselEnd={onCarouselEnd} translation={t} navigation={{ navigate: () => void }} />`

#### `<FormAttachments>`
A common component for form attachments, displays Attachments heading with helper link, already attached items with remove option, and an optional large button.

Example:
`<FormAttachments attachmentsList={[ { name: 'file.txt' }, { fileName: 'image.jpeg' } ]} removeOnPress={() => {}} largeButtonProps={{ label: 'add files', onPress: () => {} }} />`

#### `<Pagination>`
A common component for showing pagination on the page. Displays previous arrow, next arrow, and copy message based on current page and item.

Example:
`<Pagination page={1} onNext={() => {}} onPrev={() => {}} totalEntries={12} pageSize={10} />`

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

## Crashlytics/Google Analytics
The app has [Google Firebase Analytics for RN](https://rnfirebase.io/analytics/usage) installed. 

Once KPIS are added, they should be indicated here 

[Debug/Testing documentation](https://firebase.google.com/docs/analytics/debugview#android)
## Dev Setup

### Prerequisites

Download and install the following:

- [XCode](https://apps.apple.com/us/app/xcode/id497799835?mt=12) v12

- [Android Studio](https://developer.android.com/studio)

- SQA client secret. This will need to be saved in your `.bash_profile` or `.zshrc` file as `APP_CLIENT_SECRET`
  
- For DemoMode, you will the to save a string into your `.bash_profile` or `.zshrc` file as `DEMO_PASSWORD`. This can be any password you want, since it will only be used on your builds. Released builds will not see your password.
### Native Host Setup
Download and install:

- [Nodejs](https://nodejs.org/en/download/) v12 or higher preferred

- [Cocoapods](https://guides.cocoapods.org/using/getting-started.html) (optional)

- [Watchman](https://facebook.github.io/watchman/docs/install.html) (optional but recommended)

### Dockerized Setup

- [Docker / Compose](https://docs.docker.com/compose/install/)

### ENV Variable configurations
The build of the app relies on a scripted creation of the .env file to run correctly. You will need to do a few things in order for everything to work:

1. Update your bash profile to export the client secret like this `export APP_CLIENT_SECRET=<Staging Key>`. This can just be added after the last line in the profile.
2. If you use zsh, you will also need to update you .zshrc file with the same `export APP_CLIENT_SECRET=<Staging Key>`
3. Quit and terminate any terminal/shell windows you have open and then restart them to load the new environment variables you just added.
4. Go to the VAMobile directory and run `yarn start`. Or you can run `yarn run env:staging` just to establish the .env file without starting the Metro server.

After you complete this, the .env file should show up as an ignored file. This is because the build system creates this file with the client secrets and should not be uploaded to the repository. Please double check that this is ignored before you make any commits.

#### Todos:
- [ ] Update integration test script to run with new env scripts
- [ ] Remove remaining env files for int and int-test once tests can run successfully under the new scheme

### Common Android Setup

- open Android Studio, add a new project at root `{workspace}/android`

- Run (File -> Sync Project with Gradle Files)

- Add a test device in AVD (Tools -> AVD Manager)

- build and launch emulator

*NOTE* If developers uses any lower or higher version than Xcode 12, then rerun `pod install` in the `ios` folder to fix dependency issue 

### Common iOS Setup

- open Xcode workspace at `{workspace}/ios/VAMobile.xcworkspace`

- run `yarn bundle:ios` (Only need to run once. This generates the main.jsbundle)

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


### Accessibility
- [React native accessibility](https://reactnative.dev/docs/accessibility)

Elements that need to be accessible will often require you set accessibilityLabel, accessibilityHint, accessibilityValue, and accessibilityState. Use the functions below when settings these properties, if needed, as they ensure elements are queryable for tests and are set properly for accessibility on device.
- `testIdProps`
    - for accessibilityLabels(when the literal text needs to sound different for TalkBack or VoiceOver).
- `a11yHintProp` 
    - for accessibilityHints(additional text read by TalkBack or VoiceOver ex. Button that opens a link outside the app -> "This page will open in your device's browser").
- `a11yValueProp` 
    - for accessibilityValue(additional text read by TalkBack or VoiceOver ex. The first item in a list of items -> "Item 1, 1 of 10").

_Note `AccessibilityState` can be used as normal without a special function_.
### Testing

#### Integration

- Download and install [Carthage](https://github.com/Carthage/Carthage#installing-carthage)

- Ensure Xcode Preferences->Locations->Derived Data is set to `Relative` with value of `output`

- Build a Simulator build in Xcode for ios
    
- run integration tests with `yarn run test:integration`

- run android integration test separately with `yarn run test:integration-android` and ios with `yarn run test:integration-ios`

- troubleshooting:
    - in Xcode hit `Clean build folder` in the `Product` tab and then do a rebuild
    - in Android Studio hit `Rebuild Project` in the `Build` tab
    - Ensure that the platform version for Android and iOS simulators and builds match the values in wdio.conf.js ( iPhone 11, version 13.5 and an Android Emulator version 8 )

##### Querying for an Element
IOS uses `testId` and Android uses `accessibilityLabel` to query for elements in integration tests.

To ensure elements are queryable in testing and the app is still accessibility, use the functions provided [here](###Accessibility).

Example:

Component
```javascript
<VAScrollView {...testIdProps('Health-care-page')}>
  <CrisisLineCta onPress={onCrisisLine} />
</VAScrollView>
```
ScreenObject
```javascript
import AppScreen from './app.screen';

const SELECTORS = {
  HEALTH_SCREEN: '~Health-care-page',
}

class HealthScreen extends AppScreen {
  constructor() {
    super(SELECTORS.HEALTH_SCREEN)
  }
}

export default new HealthScreen()
```

Integration Test
```javascript
import HealthScreen from '../screenObjects/health.screen'

await HealthScreen.waitForIsShown()
```

##### Debugging
You can print out the contents of the page to find what the expected query string using the `getPageSource` function. On Android, `content-desc` property is the query string.
```javascript
// Prints out the contents of the page
const page = await browser.getPageSource()
console.log(page)

// ex Android - in this case the selector should be $('~Folders')
<android.view.View index="1" package="gov.va.mobileapp" class="android.view.View" text="" content-desc="Folders" checkable="false" checked="false" clickable="true" enabled="true" focusable="true" focused="false" long-clickable="false" password="false" scrollable="false" selected="false" bounds="[540,303][1020,424]" displayed="true">
```

##### Android

  - you may need to setup JAVA_HOME (depends on which JVM you have) and ANDROID_HOME e.g.: `export ANDROID_HOME=~/Library/Android/sdk` or wherever you have the sdk installed if ANDROID_HOME or JAVA_HOME is not already set
  


#### Unit

- run unit tests with `yarn test`
- coverage can be found under `coverage/lcov-report/index.html`

#### Mocking
- mocking libraries and functions in [jest](https://jestjs.io/docs/mock-functions)
- global mocks can be found at `jest/testSetup.ts` but can overridden within the individual test files.

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

