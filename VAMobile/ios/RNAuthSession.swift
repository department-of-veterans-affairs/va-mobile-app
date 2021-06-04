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
  
  func generateUrl(authUrl: String, clientId: String, redirectUri: String, scope: String, codeChallenge: String, state: String)-> URL! {
    let items = [
        URLQueryItem(name: "client_id", value: clientId),
        URLQueryItem(name: "redirect_uri", value: redirectUri),
        URLQueryItem(name: "scope", value: scope),
        URLQueryItem(name: "response_type", value: "code"),
        URLQueryItem(name: "response_mode", value: "query"),
        URLQueryItem(name: "code_challenge_method", value: "S256"),
        URLQueryItem(name: "code_challenge", value: codeChallenge),
        URLQueryItem(name: "state", value: state)
    ]
    var comps = URLComponents(string: authUrl)!
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
  ///   - resolve: React Native Promise resolver.
  ///   - reject: React Native Promise rejecter.
  /// - Returns: resolves with the callback url or rejects with an error.
  @objc(beginAuthSession:clientId:redirectUri:scope:codeChallenge:state:resolver:rejecter:)
  func beginAuthSession(_ authUrl: String, clientId: String, redirectUri: String, scope: String, codeChallenge: String, state: String, resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock)-> Void {
    let authUrl: URL! = generateUrl(authUrl: authUrl, clientId: clientId, redirectUri: redirectUri, scope: scope, codeChallenge: codeChallenge, state: state)
    session = ASWebAuthenticationSession(url: authUrl, callbackURLScheme: Environment.authScheme) {callbackUrl, error in
      if let error = error as? ASWebAuthenticationSessionError, error.code == .canceledLogin {
        reject("000", "RNAuthSession Cancelled", nil)
      } else if let error = error {
        reject("001", "RNAuthSession Error", error)
      } else if let url = callbackUrl {
        resolve(url.absoluteString)
      }
    }
    if #available(iOS 13.0, *) {
      session?.presentationContextProvider = self
      session?.prefersEphemeralWebBrowserSession = true
      session?.start()
    }
  }
  
  // defaults the presentation anchor for the ASWebAuthenticationSession
  func presentationAnchor(for session: ASWebAuthenticationSession) -> ASPresentationAnchor {
    return UIApplication.shared.keyWindow!
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
