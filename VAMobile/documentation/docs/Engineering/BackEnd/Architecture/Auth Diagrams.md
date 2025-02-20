---
title: Authentication Diagrams
---

## Username and Password Authorization Flow

![Username and Password Authorization Flow](../../../../static/img/backend/username-and-password-authorization-flow.png)

```yaml
sequenceDiagram
    participant User
    participant App
    participant Server
    User->>App: Enter username and password
    App->>Server: Send username and password
    Server-->>App: Send auth result
    App-->>User: Display auth result
```

## Biometrics Flow for Username and Password Initial Login

![Biometrics Flow for Username and Password Initial Login](../../../../static/img/backend/biometrics-flow-for-username-and-password-initial-login.png)

```yaml
sequenceDiagram
    participant User
    participant Keychain
    participant App
    participant Server
    User->>App: Enter username and password
    App-->>User: Do you want to login with biometrics next time?
    User->>App: Yes!
    App->>Keychain: Here is the username and pw for this app, keep it safe, please
    App->>Server: Send username and password
    Server-->>App: Send auth result
    App-->>User: Display auth result
```

## Biometrics Flow for Username and Password Subsequent Login

![Biometrics Flow for Username and Password Subsequent Login](../../../../static/img/backend/biometrics-flow-for-username-and-password-subsequent-login.png)

```yaml
sequenceDiagram
    participant User
    participant Keychain
    participant App
    participant Server
    App->>Keychain: Is there a username and pw saved for this app?
    Keychain-->>App: Yes there is!
    App->>User: Can I please have your biometrics?
    User-->>App: Here you go!
    App->>Keychain: Here are the biometrics, can you send the username/pw to me?
    Keychain-->>App: Here are the username and pw.
    App->>Server: Send username and password
    Server-->>App: Send auth result
    App-->>User: Display auth result
```

## VA: Health and Benefits Biometrics Initial Login

![Health and Benefits Biometrics Initial Login](../../../../static/img/backend/health-and-benefits-biometrics-initial-login.png)

```yaml
sequenceDiagram
    participant User
    participant Secure App Storage
    participant App
    participant SIS
    participant Identity Provider
    User->>App: Tap Login button
    App->>SIS: Start the sign in process
    SIS->>User: Which Identity Provider do you want?
    User-->>SIS: This one please.
    SIS-->>Identity Provider: Please authenticate this person at IAL2/AAL2/LOA3
    Identity Provider->>User: Please send your username and password
    User-->>Identity Provider: Here they are
    Identity Provider-->>SIS: It's them, I'm sure of it
    SIS-->>App: Here is a code to get your tokens
    App->>SIS: Please create a token and session for me
    SIS-->>App: Done and done! Here is the token
    App->>User: Do you want to use biometrics to log in?
    User-->>App: Yes please!
    App->>Secure App Storage: Please hang on to this for us and lock it with biometrics
    Secure App Storage-->>App: You got it!
    App-->>User: Display Auth Result
```

## VA: Health and Benefits Biometrics Subsequent Login

![Health and Benefits Biometrics Subsequent Login](../../../../static/img/backend/health-and-benefits-biometrics-subsequent-login.png)

```yaml
sequenceDiagram
    participant User
    participant Secure App Storage
    participant App
    participant SIS
    App->>Secure App Storage: Is there a stored token?
    Secure App Storage-->>App: Yes there is
    App->>User: Can I please have your biometrics?
    User-->>App: Here you go!
    App->>Secure App Storage: Here are the biometrics, can you send the token to me?
    Secure App Storage-->>App: Here it is!
    App->>SIS: Can I get a refreshed token, please? Here is the old one.
    SIS-->>App: Here you go, one new token.
    App-->>User: Display Auth Result
```

In order to regenerate these graphs, add 'mermaid' to the end of the \`\`\` at the beginning of each codeblock.
