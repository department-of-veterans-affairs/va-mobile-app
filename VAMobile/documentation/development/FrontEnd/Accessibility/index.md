---
title: Accessibility
---

# Accessibility Information
This page describes the nuances of accessibility(a11y) for front end development.

## IOS
IOS has a handful of ways to test a11y. Here are tools we can use to verify a11y on a real IOS device.

### VoiceOver(Screen Reader)
- Enable VoiceOver via `Settings` -> `Accessibility` -> `VoiceOver` -> toggle on
- `AccessibilityHints` are not turned on by default. To turn on `Settings` -> `Accessibility` -> `Verbosity` -> toggle on `Speak Hints`
- [Gestures for traversing](https://support.apple.com/guide/iphone/learn-voiceover-gestures-iph3e2e2281/ios)

### Voice Control(Voice Navigation)
- Enable Voice Control via `Settings` -> `Accessibility` -> `Voice Control` -> toggle on
- [Voice Commands](https://support.apple.com/guide/iphone/voice-control-iph2c21a3c88/ios)
    - `Show names` -> `Tap <name>`
    - `Show numbers` -> `Tap <number>`

### Wireless Keyboard
- Use right and left arrows to traverse (tab is not supported)
- Hit up and down at the same time to activate an item

### Accessibility Inspector(Simulator Only)
- Open `Xcode` -> `Play` to start simulator -> `Xcode Menu Item` -> `Open Developer Tool` -> `Accessibility Inspector`

![Accessibility Inspector](/img/accessibilityInformation/a11y-inspector.png)

## Android
Like IOS, Android provides tools to help verify a11y. A real device is needed to test a11y on Android.

### TalkBack(Screen Reader)
- Enable Talkback via `Settings` -> `Accessibility` -> `TalkBack` -> toggle on
    - Swipe right or left to move between items
    - Double-tap to activate an item
    - Drag 2 fingers to scroll

### Voice Access(Voice Navigation)
- Download/Install Voice Access from the [Google Play Store](https://play.google.com/store/apps/details?id=com.google.android.apps.accessibility.voiceaccess&hl=en_US&gl=US)
    1. `Settings` -> `Accessibility` -> `Voice Access` -> toggle on
    2. Start Voice Access by swiping down from the top of your phone and `tap to start`
- [Voice Commands](https://support.google.com/accessibility/android/answer/6151854?hl=en#zippy=%2Cbasics-navigation)
    - `Show numbers` -> `Tap <number>`

### Wireless Keyboard
- Use tab key to traverse
- Hit enter to activate an item
- See [React Navigation and Wireless Keyboard](#react-navigation-and-wireless-keyboard)

## Screen Reader Pronunciations
Some screen readers(ex. Samsung phones) will not always pronounce words like "VA" correctly - will sometimes read it as "VAAH" instead of "VA".

To get round this, add in the unicode `\ufeff` in between letters(ex. `VA` -> `V\ufeffA`) for your translations. Text is unchanged from the users pov and the screen reader will pronounce the word correctly.

![Vaah](/img/accessibilityInformation/vaah.png)

## Touch Targets
Most common components will have it setup so that the text or wrapper will use `theme.dimensions.touchableMinHeight` so pressable elements have a minimum of `44` height. We can add additional height without changing the font/styles by adding additional padding where it is needed.

Work with QA or design if the default minimum height for touchable targets should be bigger. You can visually view the touch target size by going to [debug menu](https://reactnative.dev/docs/debugging) -> `Show Inspector` -> Toggle on `Touchable` -> select the element

![Touch Target Example](/img/accessibilityInformation/touch-target.png)

## React Native Support
React Native has a variety of properties that can be set to support [a11y](https://reactnative.dev/docs/accessibility). Most common components will already support the a11y properties listed in the link.

### Accessibility with Integration Tests
We originally used the following functions to set a11y properties to better support integration test since without them we were unable to query for certain elements on the screen.
- `testIdProps`
    - for accessibilityLabels(when the literal text needs to sound different for TalkBack or VoiceOver).
- `a11yHintProp`
    - for accessibilityHints(additional text read by TalkBack or VoiceOver ex. Button that opens a link outside the app -> "This page will open in your device's browser").
- `a11yValueProp`
    - for accessibilityValue(additional text read by TalkBack or VoiceOver ex. The first item in a list of items -> "Item 1, 1 of 10").

_Note `AccessibilityState` can be used as normal without a special function_.


## Notable Quirks

### React Navigation and Wireless Keyboard

**Note**: There have been noticeable [issues using wireless keyboard with react navigation](https://app.zenhub.com/workspaces/va-mobile-frontendqa-60f1a34998bc75000f2a489f/issues/department-of-veterans-affairs/va-mobile-app/2214).

### Copy and Paste and how it affects Accessibility

We can make text-only elements(ex. TextView) have the ability to copy and paste by adding [selectable](https://reactnative.dev/docs/text#selectable) to its property.

We limit the areas(ex. Secure Messaging) where we want to do this because any `selectable` element gets read as pressable from voice navigation apps like Voice Access and Voice Control. [View related ticket](https://app.zenhub.com/workspaces/va-mobile-frontendqa-60f1a34998bc75000f2a489f/issues/department-of-veterans-affairs/va-mobile-app/2233).


## Accessibility principles

We strive to create a product that is usable for all Veterans, no matter their abilities.

We take a proactive, accessibility-first approach to everything we build. Accessibility is never an afterthought. It’s considered in every step of our process, from initial discovery to QA.

We also believe in accessibility beyond compliance. We don’t just meet the bare minimum of accessibility recommendations. We go above and beyond these recommendations to ensure we’re creating a product that is truly accessible to all of our users.


### Based on VA standards

The [VA design system](https://design.va.gov/) does not have comprehensive accessibility guidelines. However, it does [provide accessibility samples and guidelines](https://design.va.gov/content-style-guide/) when it comes to design, content, and components. We base our design system on this existing system with modifications for native mobile apps.

### Content takes center stage

All content throughout the app is clear and direct to ensure that users understand the information presented to them. A more thorough explanation of our best practices for accessible content can be found on the [content documentation page](/docs/Flagship%20design%20library/Content/content-style-guide).

### Go beyond guideline standards

The VA Mobile app targets WCAG 2.2 Level AA and Level AAA success criteria and section 508 guidelines. We also reference MCAG (Mobile Content Accessiblity Guidelines), when applicable. For more information, see the following resources:

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [508 guidelines](https://www.access-board.gov/ict/#508-chapter-1-application-and-administration)
- [MCAG (Mobile Content Accessibility Guidelines)](https://getevinced.github.io/mcag/)

### Comprehensive disability support

We aim to provide a usable experience for all Veterans and include disability support for:

- Individuals who use assistive technology
- Individuals with physical disabilities
- Individuals with visual impairments
- Individuals with hearing impairments
- Individuals with mental or cognitive disabilities

### Assistive technology support

Our app and components are tested for accessibility with automated and manual techniques. Users should expect to be able to access our app using modern assistive technologies. These include native and third-party tools like:

- Screen readers
- Speech recognition programs
- Support for low vision and color blindness
- Bluetooth mouse and keyboard
- Tools for readability

### Beyond disabilities

We believe that accessibility also goes beyond disabilities and we strive to provide access to our app for users with limited connectivity and device performance.

### The Section 508 law

Section 508 is a federal law that requires all U.S. government agencies to make their electronic and information technology and data accessible to everyone. By law, agencies must provide people with disabilities the same level of access as those without disabilities.

## Resources

- [Accessibility checklist for UX designers](../../FrontEnd/Accessibility/Checklists%20for%20designers.md)
- [Accessibility checklist for content designers](../../FrontEnd/Accessibility/Checklists%20for%20designers.md)
- [Haptic feedback](/docs/Flagship%20design%20library/Patterns/haptics)
- [VA.gov mobile accessibility testing plan](../../QA/QA%20process/Accessibility%20Testing%20Plan.md)
- [Native mobile app accessibility resources & articles](../../FrontEnd/Accessibility/resources)
