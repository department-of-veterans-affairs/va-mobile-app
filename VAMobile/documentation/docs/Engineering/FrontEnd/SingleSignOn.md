# Single Sign-On

Single sign-on (SSO) allows users to access the VA.gov website within the mobile app without having to manually authenticate in the browser.

## Architecture

The SSO process begins with the normal [authentication flow](../BackEnd/Architecture/Auth%20Diagrams.md), with the user signing in via the login screen. When the user taps the `Sign in` button, the mobile app launches the website's login webpage (https://va.gov/sign-in) in the browser. This webpage is opened with query parameters attached to the URL, specifically `code_challenge_method`, `code_challenge`, `application`, and `oauth`. In order to have the ability to start SSO sessions, we pass an additional query parameter to the URL, `scope`, which is set to `device_sso`. This informs the https://api.va.gov/v0/sign_in/authorize API endpoint that's called by the website that in addition to returning an access token and refresh token, it should return a device secret (`device_secret`), which can be used to fetch cookies for starting SSO sessions.

Once the device secret is received, it is securely stored in Keychain (iOS) or Keystore (Android).

### Fetching SSO cookies

To start an SSO session, cookies need to be fetched using the device secret and access token. SSO cookies are fetched from the https://api.va.gov/v0/sign_in/token endpoint with a few parameters, most importantly `subject_token` (access token) and `actor_token` (device secret). This endpoint will return a response with the `Set-Cookie` header, which will contain the SSO cookies `vagov_access_token`, `vagov_refresh_token`, `vagov_anti_csrf_token`, and `vagov_info_token`. Once received, these cookies are stored in the `CookieManager` using `@react-native-cookies/cookies`, and can be used to authenticate the user's session in the WebView. Cookies are fetched when the WebView component is first mounted. (Note: The `useSSO` prop must be passed to the WebView component in order for SSO cookies to be fetched.)

New cookies are always fetched whenever a new WebView is launched in the app. This is to ensure the SSO cookies used in the WebView are not expired.

### Authenticating the WebView

Once the SSO cookies are stored in the `CookieManager`, the `hasSession` field is set to `true` in `localstorage` for the WebView. This allows the VA.gov website to recognize that the user's session is authenticated.

### Persisting the device secret

As mentioned above, the device secret is stored in Keychain/Keystore to ensure its persistence for biometric login. When a user logs into the app with biometrics, the app will use the stored device secret to start SSO sessions. The device secret has an expiration of 45 days, similar to the refresh token.

When the user manually signs out, all sessions spawned with the device secret are revoked via the https://api.va.gov/v0/sign_in/revoke API endpoint. Likewise, whenever the user manually signs in to the mobile app, a new device secret will be retrieved and stored.

## Usage

SSO sessions can easily be started in WebViews within the app. Whenever you have a link/button that navigates to the WebView screen, you can pass the `useSSO` prop to the screen to start an authenticated SSO session, e.g.

```
navigateTo('Webview', {
  url: LINK_TO_OPEN_IN_WEBVIEW,
  displayTitle: t('webview.vagov'),
  useSSO: true,
})
```

This will open the WebView screen with an SSO session, allowing the user to access features on the website that require authentication.

## API documentation

For more information on API usage for SSO, view the [Device SSO Token Exchange](<https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/identity/Products/Sign-In%20Service/Engineering%20Docs/Authentication%20Types/Client%20Auth%20(User)/auth_flows/device_sso_token_exchange.md>) documentation.
