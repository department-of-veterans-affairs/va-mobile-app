# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **VA: Health and Benefits Mobile App**, a React Native application for Veterans Affairs. The app provides veterans access to health records, appointments, claims, benefits, and payments. It's a production mobile app serving real users with strict accessibility, security, and reliability requirements.

**Documentation**: https://department-of-veterans-affairs.github.io/va-mobile-app/

## Essential Commands

### Environment Setup
```bash
# Install dependencies
yarn install

# iOS pods (required after dependency changes)
yarn pods

# Set environment (must run before start/test)
yarn env:staging    # Default development environment
yarn env:local      # Local API (localhost:3000)
yarn env:debug      # Staging with Reactotron enabled
yarn env:test       # Test environment (for jest)
yarn env:production # Production environment
```

### Development
```bash
# Start Metro bundler with lint watching (auto-sets staging env)
yarn start

# Run on iOS simulator
yarn ios

# Run on Android emulator
yarn android

# Start with local API
yarn start:local

# Clean builds
yarn clean          # Both platforms
yarn clean:ios
yarn clean:android
```

### Testing
```bash
# Unit tests (coverage report)
yarn test

# Unit tests (watch mode with coverage)
yarn test:watch

# Unit tests (no coverage, faster)
yarn test:no-coverage

# Run a single test file
yarn env:test && jest path/to/file.test.tsx

# E2E tests (Detox)
yarn e2e:ios-build && yarn e2e:ios-test
yarn e2e:android-build && yarn e2e:android-test
```

### Code Quality
```bash
# Lint
yarn lint

# Lint and auto-fix
yarn lint:fix

# Type checking
yarn tsc:compile

# CI lint (fails on warnings)
yarn lint:ci

# Clear Jest cache (if tests behave strangely)
yarn jest:clear
```

### Bundling
```bash
# iOS bundle (for e2e tests)
yarn bundle:ios

# Android bundle (for e2e tests)
yarn bundle:android
```

## Architecture

### State Management

**Redux Toolkit** (`src/store/slices/`) for app-wide state:
- `authSlice` - Authentication tokens, login state, session management
- `accessibilitySlice` - Font scale, screen reader state
- `analyticsSlice` - Firebase analytics configuration
- `demoSlice` - Demo mode toggle
- `errorSlice` - Error states keyed by screen ID
- `offlineSlice` - Offline mode detection and cache timestamps
- `settingsSlice` - Remote config, feature flags

**TanStack React Query v5** (`src/api/`) for server state:
- Feature-based organization: `src/api/{feature}/`
- Each feature has: `getFeature.tsx` (query), `mutateFeature.tsx` (mutation), `queryKeys.ts`
- Custom query client at `src/api/queryClient.ts` with offline support
- Cache configured with `gcTime: Infinity` for offline functionality

### API Layer

**Custom fetch wrapper** (`src/store/api/api.ts`):
- Centralized authorization (Bearer tokens)
- Custom headers: `X-Key-Inflection`, `Source-App-Name`, device metadata
- Automatic token refresh on 401
- Demo mode support with artificial delays
- Error handling and retry logic

**Offline Support**:
- Cache-first strategy with React Query
- Redux `offlineSlice` tracks last updated timestamps per query key
- Analytics events: `vama_offline_cache`, `vama_offline_no_data`
- Network monitoring via `@react-native-community/netinfo`

### Navigation

**React Navigation v6** - Three-level hierarchy:
1. **Unauthenticated Stack**: Login, Splash, LOA Gate screens
2. **Authenticated Tab Navigator**: Home, Health, Benefits, Payments (4 tabs)
3. **Modal Screens**: Address editing, direct deposit, file uploads (rendered above tabs)

Each tab has nested stack screens defined in `*StackScreens.tsx` files.

**Deep linking**: Custom URL scheme `vamobile://` configured in `src/constants/linking.tsx`

### Component Structure

**VA Design System**:
- `@department-of-veterans-affairs/mobile-component-library` - Reusable UI components
- `@department-of-veterans-affairs/mobile-tokens` - Design tokens
- `@department-of-veterans-affairs/mobile-assets` - VA-branded assets

**Styling**: `styled-components` with theme system in `src/styles/`

**Accessibility**: Required for all components
- Screen reader labels and hints (enforced by ESLint rule)
- Dynamic font scaling support
- Accessibility state tracked in Redux

### Directory Structure

```
src/
├── api/              # React Query hooks organized by feature
├── components/       # Reusable UI components
├── constants/        # App constants, linking config
├── screens/          # Feature screens (Home, Health, Benefits, Payments)
├── store/            # Redux slices and API client
├── styles/           # Theme and global styles
├── translations/     # i18n (currently English only)
├── utils/            # Utility functions and custom hooks
└── App.tsx           # Root component with navigation

e2e/                  # Detox end-to-end tests
jest/                 # Jest configuration and mocks
documentation/        # Docusaurus site (design system docs)
env/                  # Environment configuration scripts
```

## Testing Strategy

### Unit Tests (Jest + React Testing Library)

**Location**: Colocated `*.test.tsx` or `*.test.ts` files

**Test utilities** (`src/testUtils.tsx`):
- `render()` - RTL render with Redux, React Query, Navigation providers
- `MockStore` - Pre-configured Redux store
- `RealStore` - Store with action tracking for assertions

**Running single tests**:
```bash
yarn env:test && jest src/path/to/Component.test.tsx
```

**Coverage**: Collected from all `src/**/*.{ts,tsx}` files (excluding tests and type files)

### E2E Tests (Detox)

**Location**: `e2e/tests/*.e2e.ts`

**Configuration**: `detoxconfig.js`
- iOS: iPhone 16 Pro Max (iOS 18.2)
- Android: Pixel 6 Pro API 34

**Important**: Always bundle before running e2e tests (`yarn bundle:ios` or `yarn bundle:android`)

## Code Conventions

### TypeScript Configuration

**Import paths**: Absolute imports from `src/` (configured in `tsconfig.json` with `baseUrl: "src"`)
```typescript
// Correct
import { MyComponent } from 'components/MyComponent'

// Incorrect (ESLint error)
import { MyComponent } from '../../components/MyComponent'
```

**Exception**: `index.ts` files can use relative imports (ESLint override)

### File Naming
- Components: `PascalCase.tsx` (e.g., `HomeScreen.tsx`)
- Utils/hooks: `camelCase.ts` (e.g., `dateUtils.ts`, `useAppointments.tsx`)
- Tests: `{fileName}.test.tsx`
- E2E: `{Feature}.e2e.ts`

### Code Style

**ESLint rules** (`.eslintrc.js`):
- Max line length: 150 characters (except strings/templates/regex)
- No relative imports (use absolute from `src/`)
- TypeScript strict mode enabled
- React Native a11y checks (accessibility hints required)
- TSDoc syntax validation

**Pre-commit hooks**: Husky runs lint and type checking before commits

### Accessibility Requirements
- All interactive elements need `accessibilityLabel`
- `accessibilityHint` required (ESLint warning if missing)
- Support dynamic font scaling (test with large text settings)
- VoiceOver/TalkBack compatible

## Feature Flags & Remote Config

**Firebase Remote Config**: Fetched every 30 minutes
- Check features: `featureEnabled('feature-name')` in `src/utils/remoteConfig.ts`
- Used for gradual rollouts, A/B testing, kill switches

**Demo Mode**: Toggle in developer settings
- Replaces API responses with dummy data
- Adds artificial 300ms delays
- Toggled via Redux `demoSlice`

## Environment Variables

**Configuration**: `env/env.sh` script generates `.env` file

**Available environments**:
- `staging` - Default dev environment (staging-api.va.gov)
- `production` - Production API
- `local` - Local vets-api (default: http://localhost:3000)
- `test` - Test environment for Jest

**Key variables** (auto-generated):
- `API_ROOT` - Base API URL
- `AUTH_SIS_ENDPOINT` - SIS authentication URL
- `AUTH_SIS_TOKEN_EXCHANGE_URL` - Token exchange endpoint
- `ENVIRONMENT` - Current environment name

## Analytics & Monitoring

**Firebase Integration**:
- Analytics: `logAnalyticsEvent()` with typed parameters
- Crashlytics: Automatic crash reporting
- Performance: App start time, network request monitoring
- Remote Config: Feature flags

**Analytics attached to queries**: Metadata added to React Query cache keys for tracking

## Common Patterns

### Error Handling
- Screen-specific errors stored in Redux `errorSlice` keyed by screen ID
- Downtime windows checked via `src/api/maintenanceWindows/`
- Error components: `ErrorComponent` and `DowntimeError` in `src/components/CommonErrorComponents/`

### Creating a New Feature Screen
1. Add screen component in `src/screens/{Feature}/`
2. Add to appropriate stack in `*StackScreens.tsx`
3. Create API hooks in `src/api/{feature}/`:
   - `getFeatureData.tsx` (React Query hook)
   - `queryKeys.ts` (cache keys)
4. Add tests: `{Feature}.test.tsx`
5. Add e2e test: `e2e/tests/{Feature}.e2e.ts`
6. Update deep linking config if needed (`src/constants/linking.tsx`)

### Adding API Endpoints
1. Create query hook: `src/api/{feature}/getFeature.tsx`
   - Use `useQuery()` from React Query
   - Export query key factory in `queryKeys.ts`
2. For mutations: Create `mutateFeature.tsx` with `useMutation()`
3. Use API client from `src/store/api/api.ts` (handles auth, headers, errors)
4. Add TypeScript types in `src/api/types/`

## Node Version

**Required**: Node >= 22.0.0 (specified in `package.json` engines)

Check with: `node --version`

## Common Issues

### Metro bundler issues
```bash
yarn start:metro-server  # Starts with --reset-cache
```

### Build failures after dependency changes
```bash
yarn clean
yarn install
yarn pods  # iOS only
```

### Test failures with stale cache
```bash
yarn jest:clear
```

### Type errors not showing in editor
```bash
yarn tsc:compile  # Manual type check
```

## Platform-Specific Notes

**iOS**:
- Requires Xcode and CocoaPods
- Run `yarn pods` after dependency changes
- Native code in `ios/` directory

**Android**:
- Requires Android Studio and JDK
- Native code in `android/` directory
- Gradle clean: `yarn clean:android`
