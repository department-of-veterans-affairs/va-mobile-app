<!-- There is no requirement to implement the suggestions but please respond to Copilot review comments in some way. 
Unaddressed comments will prevent the PR from moving to the QA process -->

## Description of Change
<!-- Please include a description of the change and context. What would a code reviewer, or a future dev, 
need to know about this PR in order to understand why this PR was created? This could include dependencies 
introduced, changes in behavior, pointers to more detailed documentation. The description should be more than a link 
to an issue. -->

## Target Release Date
<!-- Please include a preferred target release date, or N/A if not urgent. This helps us prioritize and plan, but 
target dates are tentative and not guaranteed. Timing will depend on overall prioritization, QA capacity, and 
whether the PR is ready for review and meets expected criteria. If the requested date is a firm deadline, please tag 
the PO/OCTO stakeholder requesting that timeline and notify the mobile app Slack channel. -->

## Link to Issue
<!--Link to an issue using a [keyword with your issue number](https://docs.github.
com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue). Your pull request is 
required to be linked to an issue in order for the pull request to Activate.-->

## Code testing

- [ ] Unit tests have been created or updated to cover this change
- [ ] End to end (Detox) tests have been added or updated as needed

## Pre-QA Artifacts
<!-- This section should be completed by the PR filer. -->

<!-- If your PR isn't flagged for QA approval you can skip this section.
     These are provided by the PR author to demonstrate baseline verification before QA picks up the PR. -->

- [ ] Screenshots or screen recording at **factory default** settings (before and after, if applicable) in **portrait orientation**
- [ ] Screenshots in **landscape orientation**
- [ ] Screenshots at **2x text size**
- [ ] Screen recording of interaction using **VoiceOver (iOS)** and/or **TalkBack (Android)**
- [ ] Visual artifacts not applicable to this PR (explain why below)

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
- [ ] **High** (Changes to Core Features: Login, Claims, Rx, Secure Messaging, major updates to a backend service, etc.)

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

- [ ] [Shared Test Script](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/VAMobile/QA/processes/testscript.md) executed (post results as a PR comment)
- [ ] Feature-specific verification based on QA Test Context above
- [ ] Tested on iOS
- [ ] Tested on Android

[Run a build for this branch](https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/on_demand_build.yml)
