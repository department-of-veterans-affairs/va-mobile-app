---
title: Haptic Feedback
---

# Haptic Feedback

Haptic feedback, or “haptics”, is a mobile touch experience that responds to a user's action with vibration patterns. Implementation of haptics should help to enhance a user’s experience throughout the app by providing vibrational feedback in response to a user’s actions. Haptics can also be combined with visual and audio feedback.

## Principles

When it comes to haptics, less is more. Too much vibration can become annoying, distracting or desensitizing. When haptics are implemented in a thoughtful way, they can provide valuable feedback and a better overall experience for users. Haptics should be:

- **Complementary:** By establishing a clear relationship between haptics and their corresponding triggers, users will understand their usage. When the app's visual, auditory, and tactile feedback sync, the user experience is more consistent and natural.
- **Voluntary:** We allow users the option to turn off haptics within their device settings if they choose to do so. The app is still usable when haptics are turned off.
- **Purposeful:** We avoid needless alerts. Haptics are powerful and should only be used to provide valuable and actionable information.
- **Understated:** We want to ensure the users can get valuable information without interrupting their actions. Haptics should not complement content, not compete with it.
- **Mild:** We do not rely on the intensity of the haptic feedback alone. The intensity of the haptics should compliment the trigger.
- **Simple:** Keep it simple for accessibility. While haptics greatly benefit deaf and low vision users, they may also  trigger issues for those with sensory disabilities or PTSD. 

## Support

- Not all devices or operating systems support haptics. 
- Each device and operating system have their own location and verbiage for haptic settings.
- Not all operating systems support the same haptic patterns. 

## Implementation

- Haptics in the VA Health and Benefits app work if the Veteran's device haptic settings are enabled.
- Haptics are implemented on a component level.
- We use a 3 pattern since it is available in our React Native library and available across multiple operating systems.

| Component | Occurrence | Pattern | OS |
|-----------|------------|---------|----|
| Snackbar | Appearance | 3 Pattern | Android / iOS |
| Toggle | Interaction | Heavy Toggle | Android / iOS |
| Error Alert Box| Appearance | 3 Pattern | Android / iOS |
| Warning Alert Box | Appearance | 3 Pattern | Android / iOS |
