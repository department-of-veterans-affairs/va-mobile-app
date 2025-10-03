# Local API Server Configuration with Mocked Authentication

This document explains how to configure the VA Mobile app to use a local vets-api server with Mocked Authentication for development.

## Overview

The app can now be pointed at three different environments:
- **Staging**: `https://staging-api.va.gov/mobile` with real OAuth authentication
- **Production**: `https://api.va.gov/mobile` with real OAuth authentication  
- **Local**: Local vets-api server (e.g., `http://localhost:3000`) with **Mocked Authentication**

### What is Mocked Authentication?

Mocked Authentication is a feature built into vets-api that allows you to:
- ✅ **Skip real CSP authentication** (ID.me, Login.gov, etc.)
- ✅ **Select test users from a dropdown** instead of entering credentials
- ✅ **Generate real JWTs signed by your local server** that work with your local API
- ✅ **Work completely offline** without network dependencies
- ✅ **Use test users from vets-api-mockdata**

See the [official Mocked Authentication documentation](https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/identity/Products/Mocked%20Authentication/readme.md) for more details.

## Prerequisites

Before using local configuration, you must have a local vets-api server running with:

1. **vets-api** cloned and running on `localhost:3000`
2. **vets-api-mockdata** cloned and configured
3. **Database seeded** with `bundle exec rails db:seed`
4. **Mocked authentication enabled** (enabled by default in development)

See the [vets-api setup documentation](https://github.com/department-of-veterans-affairs/vets-api) for details.

## Quick Start

### Using Default Local URL (http://localhost:3000)

```bash
# Set up environment for local API with Mocked Authentication
yarn env:local

# Start the app with local API configuration
yarn start:local

# Then run on your device/simulator
yarn ios
# or
yarn android
```

### Using Custom Local URL

If your local API server runs on a different port or URL:

```bash
# Specify custom URL using the -l flag
./env/env.sh -e local -d true -l "http://localhost:8080"

# Or for a different host (e.g., your machine's IP for testing on physical devices)
./env/env.sh -e local -d true -l "http://192.168.1.100:3000"

# Then start the metro server
yarn start:metro-server
```

## Configuration Details

### What Gets Configured

When you set the environment to `local`, the following happens:

1. **API_ROOT**: Points to your local API server with `/mobile` path appended
   - Default: `http://localhost:3000/mobile`
   - Custom port: `http://localhost:8080/mobile`
   - Custom host: `http://192.168.1.100:3000/mobile`
   - Note: `/mobile` is automatically appended if not already present

2. **ENVIRONMENT**: Set to `"local"`

3. **Auth Endpoints**: **All point to your local vets-api** for Mocked Authentication:
   - `AUTH_SIS_ENDPOINT`: `http://localhost:3000/v0/sign_in/authorize`
   - `AUTH_SIS_TOKEN_EXCHANGE_URL`: `http://localhost:3000/v0/sign_in/token`
   - `AUTH_SIS_TOKEN_REFRESH_URL`: `http://localhost:3000/v0/sign_in/refresh`
   - `AUTH_SIS_REVOKE_URL`: `http://localhost:3000/v0/sign_in/revoke`

4. **Website Links**: Use staging VA.gov links by default

5. **Debug Menu**: Enabled by default (`SHOW_DEBUG_MENU=true`)

**Important**: Your local vets-api must have Mocked Authentication enabled and properly configured with test users from vets-api-mockdata.

## How Mocked Authentication Works

### The Authentication Flow

When using local configuration, the authentication flow works like this:

1. **User taps "Sign in"** in the mobile app
2. **App opens web view** to `http://localhost:3000/v0/sign_in/authorize?application=vamobile&oauth=true&...`
3. **Mocked Auth page appears** showing a dropdown with test users
4. **User selects a test user** (e.g., "Hector Allen - idme")
5. **User clicks "Continue signing in"**
6. **Local vets-api**:
   - Validates the OAuth parameters
   - Creates a session with the selected test user
   - Generates a JWT access token signed with local RSA keys
   - Redirects back to the app with an authorization code
7. **App exchanges the code** for tokens at `http://localhost:3000/v0/sign_in/token`
8. **App makes authenticated requests** to `http://localhost:3000/mobile/*` with the Bearer token

### Code Changes Implemented

The mobile app now automatically adds `client_id=vamock-mobile` when running in local environment to enable Mocked Authentication.

**Implementation** in `src/store/slices/authSlice.ts`:
```typescript
export const startWebLogin = (): AppThunk => async (dispatch) => {
  await clearCookies()
  
  const paramData: { [key: string]: string } = {
    code_challenge_method: 'S256',
    code_challenge: 'tDKCgVeM7b8X2Mw7ahEeSPPFxr7TGPc25IV5ex0PvHI',
    application: 'vamobile',
    oauth: 'true',
  }
  
  // Add client_id for local environment to enable Mocked Authentication
  if (ENVIRONMENT === 'local') {
    paramData.client_id = 'vamock-mobile'
  }
  
  const params = new URLSearchParams(paramData).toString()
  const url = `${AUTH_SIS_ENDPOINT}?${params}`
  dispatch(dispatchShowWebLogin(url))
}
```

This ensures:
- ✅ Local development uses `client_id=vamock-mobile` for Mocked Authentication
- ✅ Staging and production continue to work normally without the client_id parameter

### Available Test Users

Test users are defined in the [vets-api-mockdata repository](https://github.com/department-of-veterans-affairs/vets-api-mockdata/tree/master/credentials).

Common test users include:
- **Hector Allen** (idme) - ICN: 1012666073V986297
- **Test User** (logingov) - Various test scenarios
- **DS Logon users** - For DS Logon testing
- **MHV users** - For My HealtheVet testing

### Available Scripts

```bash
# Environment configuration scripts
yarn env:local              # Configure for local API (localhost:3000)
yarn env:staging            # Configure for staging API
yarn env:production         # Configure for production API
yarn env:debug             # Configure for staging with Reactotron enabled
yarn env:test              # Configure for test environment

# Start scripts
yarn start:local           # Set local env and start with Metro + linting
yarn start                 # Set staging env and start with Metro + linting
yarn start:debug           # Set debug env and start with Metro + linting
```

### Advanced Configuration

The `env.sh` script accepts the following flags:

- `-e <environment>`: Environment name (`staging`, `production`, or `local`)
- `-d <true|false>`: Show debug menu
- `-t <true|false>`: Enable test mode
- `-r <true|false>`: Enable Reactotron
- `-l <url>`: Local API URL (only used when `-e local`)

Example combinations:

```bash
# Local with Reactotron enabled
./env/env.sh -e local -d true -r true -l "http://localhost:3000"

# Local with custom port and no debug menu
./env/env.sh -e local -d false -l "http://localhost:8080"
```

## Testing on Physical Devices

When testing on a physical device, you'll need to use your computer's IP address instead of `localhost`:

1. Find your computer's IP address:
   ```bash
   # On macOS/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # On Windows
   ipconfig
   ```

2. Configure the app to use your IP:
   ```bash
   ./env/env.sh -e local -d true -l "http://192.168.1.100:3000"
   ```

3. Ensure your local API server is listening on `0.0.0.0` (all interfaces), not just `localhost`

## Local API Server Requirements

Your local API server should:

1. **Match the API contract**: Implement the same endpoints and response formats as the staging/production API
2. **Handle authentication**: Either proxy auth requests to staging or implement a mock auth system
3. **Support HTTPS** (optional but recommended): For testing SSL/TLS features
4. **Enable CORS**: If testing from a web view or different origin

### Example Local Server Setup

Here's a minimal example using Express.js:

```javascript
const express = require('express');
const app = express();

app.use(express.json());

// Health check endpoint
app.get('/mobile/v0/user', (req, res) => {
  res.json({
    data: {
      id: 'test-user',
      type: 'user',
      attributes: {
        profile: {
          firstName: 'Test',
          lastName: 'User'
        }
      }
    }
  });
});

// Add more endpoints as needed...

app.listen(3000, '0.0.0.0', () => {
  console.log('Local VA Mobile API running on http://localhost:3000');
});
```

## Troubleshooting

### Authentication Issues

#### "Invalid client_id" Error

If you get an "invalid client_id" error during login:

1. **Check vets-api database is seeded**:
   ```bash
   cd /path/to/vets-api
   bundle exec rails db:seed
   ```

2. **Add `client_id=vamock-mobile` to OAuth params** (see "Code Changes Required" section above)

3. **Verify Mocked Auth is enabled** in vets-api `config/settings.local.yml`:
   ```yaml
   betamocks:
     enabled: true
     cache_dir: ../vets-api-mockdata
   ```

#### No Users in Dropdown

If the mocked auth page shows no users in the dropdown:

1. **Check vets-api-mockdata is cloned**:
   ```bash
   git clone https://github.com/department-of-veterans-affairs/vets-api-mockdata.git
   ```

2. **Verify vets-api settings** point to mockdata:
   ```yaml
   # config/settings.local.yml
   betamocks:
     cache_dir: ../vets-api-mockdata  # Adjust path as needed
   ```

3. **Restart vets-api** after configuration changes

#### "Access token has expired" or JWT Validation Errors

If authenticated requests fail with JWT errors:

- **Symptom**: 403 errors with "Access token has expired"
- **Cause**: JWT was signed by a different server (e.g., staging) than the one validating it (local)
- **Solution**: Ensure ALL auth endpoints point to the same server:
  ```bash
  cat env/.env | grep AUTH_SIS
  # All should be localhost:3000, not staging
  ```

### API Endpoints Not Found (404 errors)

If you're getting 404 errors on API calls, ensure your local vets-api serves endpoints under the `/mobile` path:

- ✅ Correct: `http://localhost:3000/mobile/v0/user`
- ❌ Wrong: `http://localhost:3000/v0/user`

The configuration automatically appends `/mobile` to your API_ROOT to match the staging/production structure.

### Metro Bundler Cache Issues

If you're having issues after switching environments, try:

```bash
yarn start:metro-server
```

This automatically clears the cache with `--reset-cache`.

### Environment Not Updating

The `.env` file is generated when you run the `env:*` scripts. If changes aren't taking effect:

1. Verify the `.env` file was updated:
   ```bash
   cat env/.env | grep API_ROOT
   # Should show: API_ROOT=http://localhost:3000/mobile
   ```

2. Restart Metro Bundler completely (not just reload the app)

3. Rebuild the app if necessary:
   ```bash
   yarn clean
   yarn ios  # or yarn android
   ```

### Network Connection Issues

If the app can't connect to your local API:

1. Check the API server is running
2. Verify the URL in `env/.env` is correct
3. Ensure your firewall isn't blocking the connection
4. For physical devices, ensure both device and computer are on the same network

### iOS App Transport Security (ATS)

iOS blocks HTTP connections by default. The app should already have ATS exceptions configured for local development, but if you encounter issues:

Check `ios/VAMobile/Info.plist` for `NSAppTransportSecurity` settings.

## Reverting to Staging/Production

Simply run the appropriate environment script:

```bash
# Back to staging
yarn env:staging
yarn start

# Or production
yarn env:production
```

## Related Files

- `env/env.sh` - Environment configuration script
- `env/.env` - Generated environment variables file
- `env/constant.env` - Shared environment constants
- `src/utils/env.ts` - Environment variables wrapper
- `src/store/api/api.ts` - API client configuration
