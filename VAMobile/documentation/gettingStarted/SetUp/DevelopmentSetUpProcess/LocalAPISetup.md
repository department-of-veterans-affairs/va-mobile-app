---
title: Local API Setup
---

# Local API Setup with Mocked Authentication

Configure the VA Mobile app to use a local vets-api instance with Mocked Authentication for offline development.

## Quick Start

```bash
# In VAMobile directory
yarn env:local
yarn start:local
yarn ios  # or yarn android
```

Then tap "Sign in" in the app and select a test user from the dropdown.

## Prerequisites

1. **vets-api running locally** on port 3000
   ```bash
   cd /path/to/vets-api
   bundle exec rails s
   ```

2. **vets-api-mockdata** cloned and configured
   ```bash
   git clone https://github.com/department-of-veterans-affairs/vets-api-mockdata.git
   ```

3. **vets-api configured** for mocked authentication in `config/settings.local.yml`:
   ```yaml
   mpi:
     mock: true
   
   betamocks:
     enabled: true
     cache_dir: ../vets-api-mockdata
   ```

4. **Database seeded**:
   ```bash
   cd vets-api
   bundle exec rails db:seed
   ```

5. **SignIn client configured** for mobile app:
   ```ruby
   # In vets-api Rails console
   bundle exec rails c
   
   SignIn::ClientConfig.find_or_create_by(client_id: 'vamock-mobile') do |config|
     config.redirect_uri = 'vamobile://login-success'
     config.authentication = 'cookie'
     config.anti_csrf = true
     config.pkce = true
     config.shared_sessions = false
   end
   ```

## Configuration

The `yarn env:local` command sets:
- `API_ROOT=http://localhost:3000/mobile`
- `AUTH_SIS_ENDPOINT=http://localhost:3000/v0/sign_in/authorize`
- All other auth endpoints point to localhost

### Custom URL

For physical device testing or different ports:

```bash
# Different port
./env/env.sh -e local -d true -l "http://localhost:8080"

# Physical device (use your computer's IP)
./env/env.sh -e local -d true -l "http://192.168.1.100:3000"
```

Make sure vets-api is configured to listen on `0.0.0.0` (all interfaces).

## How It Works

### Authentication Flow

1. User taps "Sign in"
2. Native browser opens to local vets-api with mocked auth UI
3. User selects test user from dropdown
4. vets-api creates session and generates JWT
5. Browser redirects back: `vamobile://login-success?code=...`
6. App exchanges code for access token
7. App makes authenticated API requests

### Native OAuth Implementation

The mobile app uses native authentication sessions for security:
- **iOS**: `ASWebAuthenticationSession` in `ios/RNAuthSession.swift`
- **Android**: `CustomTabsIntent` in `android/.../CustomTabsIntentModule.kt`

These automatically detect local URLs and add required parameters:
- `client_id=vamock-mobile`
- `type=idme`  
- `acr=min`
- NO `scope` (vamock client doesn't support it)

For staging/production, they add `scope=device_sso` instead.

## Available Test Users

Test users are defined in [vets-api-mockdata/credentials](https://github.com/department-of-veterans-affairs/vets-api-mockdata/tree/master/credentials).

Common examples:
- **Greg Anderson** (idme): this user has mocks available for all services necessary to get signed in and run the API calls on the home screen.

## Troubleshooting

### "Invalid client_id" Error

Check vets-api client configuration:
```ruby
bundle exec rails c
SignIn::ClientConfig.find_by(client_id: 'vamock-mobile')
# Should exist with redirect_uri = 'vamobile://login-success'
```

If missing, create it (see Prerequisites above).

### No Users in Dropdown

1. Verify vets-api-mockdata is cloned
2. Check `betamocks.cache_dir` in `config/settings.local.yml`
3. Restart vets-api

### JWT Validation Fails

Ensure all auth endpoints point to localhost:
```bash
cat env/.env | grep AUTH_SIS
# All should be http://localhost:3000/*
```

### API 404 Errors

The app automatically appends `/mobile` to API_ROOT:
- ✅ `http://localhost:3000/mobile/v0/user`
- ❌ `http://localhost:3000/v0/user`

### MPI/External Service Errors

Enable mocking in vets-api `config/settings.local.yml`:
```yaml
mpi:
  mock: true
```

## Switching Environments

```bash
# Local development
yarn env:local

# Staging (default)
yarn env:staging  

# Production
yarn env:production
```

After switching, rebuild native code if it was previously built for a different environment.

## Related Documentation

- [Mocked Authentication Guide](https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/identity/Products/Mocked%20Authentication/readme.md)
- [vets-api-mockdata](https://github.com/department-of-veterans-affairs/vets-api-mockdata)
- [Sign-In Service](https://github.com/department-of-veterans-affairs/va.gov-team/tree/master/products/identity/Products/Sign-In%20Service)

## Implementation Details

### Modified Files

**Configuration:**
- `env/env.sh` - Added local environment support
- `package.json` - Added `env:local` and `start:local` scripts

**Native Code:**
- `ios/RNAuthSession.swift` - Auto-detects local URLs and adds OAuth parameters
- `android/.../CustomTabsIntentModule.kt` - Auto-detects local URLs and adds OAuth parameters

The native modules handle all OAuth parameter differences between local and remote environments automatically - no manual configuration needed.
