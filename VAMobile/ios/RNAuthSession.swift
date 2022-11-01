//
//  RNAuthSession.swift
//  VAMobile
//
//  Created by Pasquale L Saxton on 6/3/21.
//

import Foundation
import AuthenticationServices

/// This module allows the React-Native bridge to set up and use the ASWebAuthenticationSession flow for iOS devices.
@objc(RNAuthSession)
class RNAuthSession: NSObject, RCTBridgeModule, ASWebAuthenticationPresentationContextProviding {
  var session: ASWebAuthenticationSession?
  
  /// This sends the name of the module to React Native so that it can be imported from NativeModules
  /// - Returns: "RNAuthSession"
  static func moduleName() -> String! {
    return "RNAuthSession"
  }
  /// Tells Native OS to set this module up on the Main thread
  /// - Returns: true
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  // Auth environment for setting up the URL
  enum Environment {
      static let authScheme = "vamobile"
  }
  
  func generateUrl(authUrl: String, clientId: String, redirectUri: String, scope: String, codeChallenge: String, state: String, SISEnabled: Bool)-> URL? {
    var items = [
      URLQueryItem(name: "code_challenge_method", value: "S256"),
      URLQueryItem(name: "code_challenge", value: codeChallenge),
    ]

    if (SISEnabled) {
      items.append(contentsOf: [
        URLQueryItem(name: "application", value: "vamobile"),
        URLQueryItem(name: "oauth", value: "true")
      ])
    } else {
      items.append(contentsOf: [
        URLQueryItem(name: "client_id", value: clientId),
        URLQueryItem(name: "redirect_uri", value: redirectUri),
        URLQueryItem(name: "scope", value: scope),
        URLQueryItem(name: "response_type", value: "code"),
        URLQueryItem(name: "response_mode", value: "query"),
        URLQueryItem(name: "state", value: state)
      ])
    }

    guard var comps = URLComponents(string: authUrl) else {
      return nil
    }
    comps.queryItems = items
    return comps.url
  }

  /// Kicks off an ASWebAuthenticationSession for ios devices
  /// - Parameters:
  ///   - authUrl: string with the authorization url
  ///   - clientId: client id string for IAM
  ///   - redirectUri: redirect uri string for successful logins
  ///   - scope: space separated string of open ID scopes for IAM
  ///   - codeChallenge: PKCE code challenge string
  ///   - state: state string for OAuth flow with IAM
  ///   - SISEnabled: boolean of whether we are using SIS or not
  ///   - resolve: React Native Promise resolver.
  ///   - reject: React Native Promise rejecter.
  /// - Returns: resolves with the callback url or rejects with an error.
  @objc(beginAuthSession:clientId:redirectUri:scope:codeChallenge:state:SISEnabled:resolver:rejecter:)
  func beginAuthSession(_ authUrl: String, clientId: String, redirectUri: String, scope: String, codeChallenge: String, state: String, SISEnabled: Bool, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock)-> Void {
    let authUrl: URL? = generateUrl(authUrl: authUrl, clientId: clientId, redirectUri: redirectUri, scope: scope, codeChallenge: codeChallenge, state: state, SISEnabled: SISEnabled)
    guard let url = authUrl else {
      reject("002", "RNAuthSession Error", RNAuthSessionError.authUrlError)
      return
    }
    session = ASWebAuthenticationSession(url: url, callbackURLScheme: Environment.authScheme) {callbackUrl, error in
      if let error = error as? ASWebAuthenticationSessionError, error.code == .canceledLogin {
        reject("000", "RNAuthSession Cancelled", nil)
      } else if let error = error {
        reject("001", "RNAuthSession Error", error)
      } else if let url = callbackUrl {
        resolve(url.absoluteString)
      }
    }
    session?.presentationContextProvider = self
    session?.prefersEphemeralWebBrowserSession = true
    session?.start()
  }
  
  // defaults the presentation anchor for the ASWebAuthenticationSession
  func presentationAnchor(for session: ASWebAuthenticationSession) -> ASPresentationAnchor {
    return UIApplication.shared.windows.filter {$0.isKeyWindow}.first ?? ASPresentationAnchor()
  }
}

// Error class for RNAuthSession Module

public enum RNAuthSessionError: Error {
  case authUrlError
}

extension RNAuthSessionError: LocalizedError {
  public var errorDescription: String? {
    switch self {
      case .authUrlError:
        return NSLocalizedString("Authorization URL is invalid. You must provide valid Auth URL and parameters.", comment: "Invalid Auth URL")
    }
  }
}
