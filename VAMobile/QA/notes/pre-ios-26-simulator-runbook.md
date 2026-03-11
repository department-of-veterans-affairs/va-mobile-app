# Older iOS Simulator Runbook

Workflow for running the app on an older iOS simulator for visual regression testing.

## Scope

- Repository: `department-of-veterans-affairs/va-mobile-app`
- App folder: `VAMobile/`
- Minimum supported iOS target in this repo as of 2026-03: `15.1`

## Most Common Path (After Initial Setup)

If you already created the simulator device once, this is usually all you need.

From within the `VAMobile/` directory:

```bash
open -a Simulator
xcrun simctl boot "VA iPhone 15 iOS18" || true
yarn ios --simulator "VA iPhone 15 iOS18"
```

Everything else in this runbook is setup or optional workflow guidance.

## One-Time Setup

### Install an Older iOS Runtime in Xcode

In Xcode:
- Open `Settings`
- Go to `Platforms` (called `Components` in older Xcode versions)
- Download an iOS runtime below 26, for example `iOS 18.x` (note, also, that iOS jumped from 18 to 26 to match years `¯\_(ツ)_/¯`)

### Create a Dedicated Simulator Device

List available runtimes and device types:

```bash
xcrun simctl list runtimes | grep iOS
xcrun simctl list devicetypes | grep "iPhone 15"
```

Create a dedicated simulator (example uses iOS 18.5):

```bash
xcrun simctl create "VA iPhone 15 iOS18" \
  com.apple.CoreSimulator.SimDeviceType.iPhone-15 \
  com.apple.CoreSimulator.SimRuntime.iOS-18-5
```

If your runtime patch differs (for example `18-5`), use the matching runtime identifier from `simctl list runtimes`.

## Optional Workflows

### Use an Older App Version With Older iOS Runtime

If visual regression requires an older app version:

```bash
# checkout your target branch/tag/commit first
yarn install
yarn pods
yarn ios --simulator "VA iPhone 15 iOS18"
```

### Keep Regression Runs Deterministic

Before each screenshot run:

```bash
xcrun simctl shutdown "VA iPhone 15 iOS18" || true
xcrun simctl erase "VA iPhone 15 iOS18"
```

This removes stale app and simulator state that can skew visual diffs.

### Tag and Version Strategy (When Needed)

You do not need to change git versions to run on an older simulator runtime. Use tag checkout only if you want to compare behavior against an older app release.

Recommended:
- Prefer semantic release tags like `v2.70.0`, `v2.69.0`, etc.
- Avoid `ios-build-*` tags unless you specifically need CI build-tag parity.

Commands:

```bash
git fetch --tags
git tag -l 'v*' --sort=-v:refname | head -n 20

# Example: run from a specific release tag (detached HEAD)
git switch --detach v2.69.0
yarn install
yarn pods
yarn env:staging
yarn bundle:ios
yarn ios --simulator "VA iPhone 15 iOS18"

# Return to normal development branch
git switch develop
```

Tip:
- Record the tag used for screenshots in your regression notes so comparisons stay reproducible.

## Troubleshooting

- Error: runtime not found
  - Re-run `xcrun simctl list runtimes` and copy the exact runtime identifier.
- Error: app does not support this iOS version
  - Ensure simulator runtime is `>= 15.1`.
- Build issues after switching revisions
  - Run `yarn install` and `yarn pods` again.
