# Summary of Changes for Local API Support with Mocked Authentication

## Overview

The VA Mobile app now supports pointing at a local vets-api instance using **Mocked Authentication**. This enables complete offline development with real OAuth/JWT flows, eliminating dependencies on staging infrastructure.

## Files Modified

### 1. `env/env.sh`
- Added support for `local` environment type (`-e local`)
- Added optional `-l` flag to specify custom local API URL
- Default local URL: `http://localhost:3000`
- **All authentication endpoints now point to local vets-api**:
  - `AUTH_SIS_ENDPOINT`: `http://localhost:3000/v0/sign_in/authorize`
  - `AUTH_SIS_TOKEN_EXCHANGE_URL`: `http://localhost:3000/v0/sign_in/token`
  - `AUTH_SIS_TOKEN_REFRESH_URL`: `http://localhost:3000/v0/sign_in/refresh`
  - `AUTH_SIS_REVOKE_URL`: `http://localhost:3000/v0/sign_in/revoke`
- API_ROOT correctly includes `/mobile` path suffix
- Supports custom URLs for physical device testing

### 2. `package.json`
- Added `"env:local"` script: `./env/env.sh -e local -d true`
- Added `"start:local"` script: Sets local env and starts Metro with linting

### 3. `ios/RNAuthSession.swift`
- **Modified `generateUrl()` function to detect local URLs**
- Automatically adds `client_id=vamock-mobile` when authUrl contains:
  - `localhost`
  - `127.0.0.1`
  - `192.168.x.x` (local network IPs)
- No impact on staging/production environments

### 4. `android/.../CustomTabsIntentModule.kt`
- **Modified `beginAuthSession()` to detect local URLs**
- Automatically adds `client_id=vamock-mobile` when authUrl contains:
  - `localhost`
  - `127.0.0.1`
  - `192.168.x.x` (local network IPs)
  - `10.x.x.x` (Docker/VPN IPs)
- No impact on staging/production environments

## Files Created

### 1. `LOCAL_API_SETUP.md`
Complete guide covering:
- Mocked Authentication overview and benefits
- Prerequisites (vets-api, vets-api-mockdata setup)
- Quick start instructions
- Authentication flow explanation
- Available test users
- Physical device testing
- Comprehensive troubleshooting

### 2. `local-api-example.js`
Example Express server (optional - use real vets-api instead)

### 3. `LOCAL_API_CHANGES.md`
This file

## Quick Start

**Important: Native code changed - full rebuild required!**

```bash
# 1. Configure environment
yarn env:local

# 2. For iOS - Rebuild
cd ios && pod install && cd ..
yarn ios

# 3. For Android - Rebuild
cd android && ./gradlew clean && cd ..
yarn android

# 4. Try logging in!
```

## How It Works

### Authentication Flow

1. User taps "Sign in"
2. `useStartAuth()` hook calls `startAuthSession(codeChallenge)`
3. **Native module** (iOS or Android) builds OAuth URL:
   - Takes `AUTH_SIS_ENDPOINT` from environment
   - Detects if URL is local (localhost/127.0.0.1/192.168.x.x)
   - If local: adds `client_id=vamock-mobile` parameter
   - If not local: no client_id added (staging/production)
4. Native browser opens to the constructed URL
5. Mocked Auth page appears with dropdown of test users
6. User selects test user → logged in!

### Why Native Modules?

The mobile app uses **native authentication sessions**:
- iOS: `ASWebAuthenticationSession`
- Android: `CustomTabsIntent`

These native modules construct the OAuth URL with all parameters. The TypeScript code (`startWebLogin`) is NOT used for the actual authentication flow - it's the native modules that handle everything.

## Benefits

✓ Complete offline development
✓ Real OAuth/JWT authentication flow
✓ No staging infrastructure dependencies
✓ Test users from vets-api-mockdata
✓ JWTs signed & validated by local server
✓ Sessions in local PostgreSQL
✓ Fast iteration (no network latency)
✓ Full control over API responses
✓ **Automatic detection** - no manual configuration needed

## Prerequisites

Before using local configuration:

1. **vets-api** running on `localhost:3000`
2. **vets-api-mockdata** cloned and configured
3. **Database seeded**: `bundle exec rails db:seed`
4. **Mocked auth enabled** (default in development)

## Physical Device Testing

Use your computer's IP instead of localhost:

```bash
# Find your IP
ifconfig | grep "inet " | grep -v 127.0.0.1

# Configure with IP
./env/env.sh -e local -d true -l "http://192.168.1.100:3000"

# Rebuild and run on device
yarn ios  # or yarn android
```

The native modules will automatically detect the `192.168.x.x` address and add `client_id=vamock-mobile`.

## Testing Verification

✅ All tests passed:
1. Default local: `http://localhost:3000/mobile`
2. Custom port: `http://localhost:8080/mobile`
3. Custom IP: `http://192.168.1.100:3000/mobile`
4. Auth endpoints point to localhost (not staging)
5. Native modules add client_id automatically
6. Staging/production environments unchanged
7. `/mobile` path handled correctly

## Troubleshooting

### "Invalid client_id" Still Appearing

If you still see this error after rebuilding:
1. Verify you did a **full rebuild** (not just reload)
2. Check iOS: `cd ios && pod install && cd .. && yarn ios`
3. Check Android: `cd android && ./gradlew clean && cd .. && yarn android`
4. Verify environment: `cat env/.env | grep AUTH_SIS_ENDPOINT`
5. Should show: `http://localhost:3000/v0/sign_in/authorize`

### No Users in Dropdown

- Clone vets-api-mockdata
- Configure `betamocks.cache_dir` in vets-api
- Restart vets-api

### JWT Validation Fails

- Ensure ALL auth endpoints point to localhost
- Check: `cat env/.env | grep AUTH_SIS`

See `LOCAL_API_SETUP.md` for complete troubleshooting guide.

## Resources

- [Mocked Authentication Docs](https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/identity/Products/Mocked%20Authentication/readme.md)
- [vets-api-mockdata](https://github.com/department-of-veterans-affairs/vets-api-mockdata)
- [vets-api Setup](https://github.com/department-of-veterans-affairs/vets-api)

## Summary

The key insight: **Authentication in React Native mobile apps uses native modules**, not TypeScript code. The OAuth URL is constructed by native Swift (iOS) and Kotlin (Android) code, so that's where `client_id=vamock-mobile` needed to be added. Both native modules now automatically detect local URLs and add the required parameter.
