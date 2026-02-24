> NOTE! This is a holding file for the content related to QA that will be added to the PR template after review and approval.

## Pre-QA Artifacts
<!-- This section should be completed by the PR filer. -->

<!-- If your PR isn't flagged for QA approval you can skip this section.
     These are provided by the PR author to demonstrate baseline verification before QA picks up the PR. -->

- [ ] Screenshots or screen recording at **factory default** settings (before and after, if applicable) in **portrait orientation**
- [ ] Screenshots in **landscape orientation**
- [ ] Screenshots at **2x text size**
- [ ] Screen recording of interaction using **VoiceOver (iOS)** and/or **TalkBack (Android)**

<details>
<summary>How to capture these</summary>

**Screenshots & Video**
- [Capturing screenshots and videos from Simulator, iOS](https://developer.apple.com/documentation/xcode/capturing-screenshots-and-videos-from-simulator)
- [Take screenshots on the Emulator, Android](https://developer.android.com/studio/run/emulator-take-screenshots)

**2x text size**
- iOS Dynamic Type: `Settings > Accessibility > Display & Text Size > Larger Text.` Toggle ON, move slider.
- Android Font Scale: `Settings > Accessibility > Display size and text.` Adjust Font size and Display size sliders.

**VoiceOver / TalkBack** (best on actual hardware)
- iOS: [Turn on VoiceOver](https://support.apple.com/guide/iphone/turn-on-and-practice-voiceover-iph3e2e415f/ios) · [Screen recording](https://support.apple.com/guide/iphone/take-a-screen-recording-iph52f6e1987/ios) / [QuickTime from Mac](https://support.apple.com/guide/quicktime-player/record-a-movie-qtp356b55534/mac)
- Android: [Turn on TalkBack](https://support.google.com/accessibility/answer/6007100) / [SCRCPY](https://scrcpy.org/) for desktop capture

</details>

## Test Context for QA
<!-- This section should be completed by the PR filer. -->

<!-- If your PR isn't flagged for QA approval you can skip this section.
     This helps QA understand what you built and where to focus.
     You are NOT writing test cases — just providing context. -->

**How does a user get here?**
<!-- Briefly describe the navigation path to this feature, and what kind of user would engage with it. -->

**Feature Flags**
<!-- Is there a feature flag? Does it wrap UI, API, both? What's the flag name? -->

**Risk Assessment:**
<!-- Select 1 that best describes the risk potential of this work -->
- [ ] **Low** (UI polish, copy change, isolated component)
- [ ] **Medium** (New feature, non-core path)
- [ ] **High** (Changes to Core Features: Login, Claims, Rx, Secure Messaging, etc.)

**What should QA pay extra attention to?**
<!-- Known risks, untested areas, upstream dependencies, offline behavior, anything unusual. "Nothing specific" is a valid answer. -->

**Test Review**
<!-- What edits/changes were made to e2e and unit tests? -->

**Test User(s)**
<!-- What staging test users should QA use? What data setup is needed? -->

---

## Checklist for QA
<!-- This checklist is for the QA team. -->
  **QA Engineer:** Check off the items below as you test

- [ ] [Shared Test Script](LINK-TBA) executed (post results as a PR comment)
- [ ] Feature-specific verification based on QA Test Context above
- [ ] Tested on iOS
- [ ] Tested on Android