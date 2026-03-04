---
title: Shared test script
---

> NOTE! This is a WIP document, and will likely migrate to the docs site when finalized.

# Shared Test Script

This script defines baseline checks that must be verified for every feature ticket flagged for QA. It ensures a consistent quality bar across all reviews, regardless of feature area and implementation team.

**When to use:** Any PR that requires QA approval. For PRs not flagged for QA (e.g., documentation-only changes, CI config, etc.), this script does not apply.

## How to Use This Script

1. When a PR is flagged for QA, the QA engineer copies the relevant checklist sections into a PR comment (or references this document).
2. Each item is verified and checked off during QA review.
3. Items that are N/A for a given PR should be marked as such with a brief explanation if necessary.
4. Results feed into the [Testing Summary](https://department-of-veterans-affairs.github.io/va-mobile-app/development/QA/QA%20process/Testing%20Summary) for feature-level work.

---

## 1. UI Validation

- [ ] UI matches design specs / Figma (or design has approved deviations on the PR/issue)
- [ ] Displays correctly in **portrait** orientation
- [ ] Displays correctly in **landscape** orientation
- [ ] Displays correctly at **default text size**
- [ ] Displays correctly at **2x text size** (iOS Dynamic Type / Android Font Scale)
- [ ] No layout clipping, overlapping, or truncation at larger text sizes
- [ ] Dark mode appearance is correct (if applicable)

## 2. Accessibility

**Reference:** [Accessibility Testing Plan](https://department-of-veterans-affairs.github.io/va-mobile-app/development/QA/QA%20process/Accessibility%20Testing%20Plan)

- [ ] All interactive elements are reachable and operable via **VoiceOver (iOS)**
- [ ] All interactive elements are reachable and operable via **TalkBack (Android)**
- [ ] Screen reader announces elements in a logical reading order
- [ ] Headings are properly leveled (no skipped levels)
- [ ] Actionable elements have meaningful accessible labels (no bare "Button", "Link", etc.)
- [ ] Focus is managed correctly after navigation or modal dismiss
- [ ] Color is not the sole means of conveying information

## 3. Navigation and Core Behavior

- [ ] Back navigation works as expected (hardware back on Android, swipe/back button on iOS)
- [ ] Deep links / push notification entry points land on the correct screen (if applicable)
- [ ] Bottom tab navigation state is preserved appropriately
- [ ] Loading states display correctly (spinners, skeletons)
- [ ] Pull-to-refresh works where expected

## 4. Error Handling

- [ ] Graceful behavior when **offline / no network**
- [ ] API error responses display user-friendly error messaging
- [ ] Retry mechanisms function correctly where implemented
- [ ] No crashes or unhandled exceptions on error paths
- [ ] Empty states display correctly when no data is available

## 5. Feature Flags

- [ ] Feature behaves correctly when flag is **ON**
- [ ] Feature is **not visible / accessible** when flag is **OFF**
- [ ] Flag wraps the correct scope (UI only, API only, or both) — documented on the PR

## 6. Platform Parity

- [ ] Tested on **iOS** (simulator or device)
- [ ] Tested on **Android** (emulator or device)
- [ ] Behavior is consistent across platforms (or platform-specific behavior is intentional and documented)

## 7. Data and State

- [ ] Works with expected/valid test data (happy path)
- [ ] Handles edge case data (long strings, special characters, boundary values)
- [ ] State persists correctly across app backgrounding and foregrounding
- [ ] Logout/login cycle does not produce stale data

## 8. Feature-Specific Verification

> These checks are informed by the **QA Test Context** section of the PR.

- [ ] **Happy path**: Navigate to the feature using the path described in the PR and verify it works as described
- [ ] **Risk-calibrated exploration**: Based on the stated risk level, perform exploratory testing:
    - Low -> Spot check, confirm it doesn't break surrounding features
    - Medium -> Test primary + at least one alternate flow, one negative case
    - High -> Full exploratory session: alternate flows, negative cases, boundary conditions, interaction with adjacent features
- [ ] **Feature flag behavior**: If flagged, verify ON/OFF behavior matches what the PR describes
- [ ] **Offline behavior**: If noted in the PR, verify offline handling
- [ ] **Edge cases identified by QA**: Document any additional edge cases found during exploratory testing
- [ ] **Regression spot-check**: Verify that features adjacent to the change still work

---

## Resources

- [Capturing screenshots and videos from Simulator, iOS](https://developer.apple.com/documentation/xcode/capturing-screenshots-and-videos-from-simulator)
- [Take screenshots on the Emulator, Android](https://developer.android.com/studio/run/emulator-take-screenshots)
- **2x text size:**
    - iOS: `Settings > Accessibility > Display & Text Size > Larger Text` → toggle ON, move slider
    - Android: `Settings > Accessibility > Display size and text` → adjust Font size and Display size
- **VoiceOver / TalkBack** (best on real hardware):
    - [Turn on VoiceOver on iPhone](https://support.apple.com/guide/iphone/turn-on-and-practice-voiceover-iph3e2e415f/ios)
    - [Screen recording on iPhone](https://support.apple.com/guide/iphone/take-a-screen-recording-iph52f6e1987/ios)
    - [QuickTime for recording attached iPhone](https://support.apple.com/guide/quicktime-player/record-a-movie-qtp356b55534/mac)
    - [Turn on TalkBack](https://support.google.com/accessibility/answer/6007100)
    - [SCRCPY](https://scrcpy.org/) for Android audio/video capture from desktop