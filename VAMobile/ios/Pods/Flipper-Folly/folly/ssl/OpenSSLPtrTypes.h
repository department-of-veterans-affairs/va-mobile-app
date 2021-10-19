/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#pragma once

#include <glog/logging.h>

#include <folly/Memory.h>
#include <folly/portability/OpenSSL.h>

namespace folly {
namespace ssl {

//  helper which translates:
//    FOLLY_SSL_DETAIL_DEFINE_PTR_TYPE(Foo, FOO, FOO_free);
//  into
//    using FooDeleter = folly::static_function_deleter<FOO, &FOO_free>;
//    using FooUniquePtr = std::unique_ptr<FOO, FooDeleter>;
#define FOLLY_SSL_DETAIL_DEFINE_PTR_TYPE(alias, object, deleter)           \
  using alias##Deleter = folly::static_function_deleter<object, &deleter>; \
  using alias##UniquePtr = std::unique_ptr<object, alias##Deleter>

// ASN1
FOLLY_SSL_DETAIL_DEFINE_PTR_TYPE(ASN1Time, ASN1_TIME, ASN1_TIME_free);
FOLLY_SSL_DETAIL_DEFINE_PTR_TYPE(
    ASN1Ia5Str, ASN1_IA5STRING, ASN1_IA5STRING_free);
FOLLY_SSL_DETAIL_DEFINE_PTR_TYPE(ASN1Int, ASN1_INTEGER, ASN1_INTEGER_free);
FOLLY_SSL_DETAIL_DEFINE_PTR_TYPE(ASN1Obj, ASN1_OBJECT, ASN1_OBJECT_free);
FOLLY_SSL_DETAIL_DEFINE_PTR_TYPE(ASN1Str, ASN1_STRING, ASN1_STRING_free);
FOLLY_SSL_DETAIL_DEFINE_PTR_TYPE(ASN1Type, ASN1_TYPE, ASN1_TYPE_free);
FOLLY_SSL_DETAIL_DEFINE_PTR_TYPE(
    ASN1UTF8Str, ASN1_UTF8STRING, ASN1_UTF8STRING_free);

// X509
FOLLY_SSL_DETAIL_DEFINE_PTR_TYPE(X509, X509, X509_free);
FOLLY_SSL_DETAIL_DEFINE_PTR_TYPE(
    X509Extension, X509_EXTENSION, X509_EXTENSION_free);
FOLLY_SSL_DETAIL_DEFINE_PTR_TYPE(X509Store, X509_STORE, X509_STORE_free);
FOLLY_SSL_DETAIL_DEFINE_PTR_TYPE(
    X509StoreCtx, X509_STORE_CTX, X509_STORE_CTX_free);
FOLLY_SSL_DETAIL_DEFINE_PTR_TYPE(X509Sig, X509_SIG, X509_SIG_free);
FOLLY_SSL_DETAIL_DEFINE_PTR_TYPE(X509Algor, X509_ALGOR, X509_ALGOR_free);
FOLLY_SSL_DETAIL_DEFINE_PTR_TYPE(X509Pubkey, X509_PUBKEY, X509_PUBKEY_free);
using X509VerifyParamDeleter =
    folly::static_function_deleter<X509_VERIFY_PARAM, &X509_VERIFY_PARAM_free>;
using X509VerifyParam =
    std::unique_ptr<X509_VERIFY_PARAM, X509VerifyParamDeleter>;

FOLLY_SSL_DETAIL_DEFINE_PTR_TYPE(GeneralName, GENERAL_NAME, GENERAL_NAME_free);
FOLLY_SSL_DETAIL_DEFINE_PTR_TYPE(
    GeneralNames, GENERAL_NAMES, GENERAL_NAMES_free);
FOLLY_SSL_DETAIL_DEFINE_PTR_TYPE(
    AccessDescription, ACCESS_DESCRIPTION, ACCESS_DESCRIPTION_free);
FOLLY_SSL_DETAIL_DEFINE_PTR_TYPE(
    AuthorityInfoAccess, AUTHORITY_INFO_ACCESS, AUTHORITY_INFO_ACCESS_free);
FOLLY_SSL_DETAIL_DEFINE_PTR_TYPE(
    DistPointName, DIST_POINT_NAME, DIST_POINT_NAME_free);
FOLLY_SSL_DETAIL_DEFINE_PTR_TYPE(DistPoint, DIST_POINT, DIST_POINT_free);
FOLLY_SSL_DETAIL_DEFINE_PTR_TYPE(
    CrlDistPoints, CRL_DIST_POINTS, CRL_DIST_POINTS_free);
FOLLY_SSL_DETAIL_DEFINE_PTR_TYPE(X509Crl, X509_CRL, X509_CRL_free);
FOLLY_SSL_DETAIL_DEFINE_PTR_TYPE(X509Name, X509_NAME, X509_NAME_free);
FOLLY_SSL_DETAIL_DEFINE_PTR_TYPE(X509Req, X509_REQ, X509_REQ_free);
FOLLY_SSL_DETAIL_DEFINE_PTR_TYPE(X509Revoked, X509_REVOKED, X509_REVOKED_free);

// EVP
FOLLY_SSL_DETAIL_DEFINE_PTR_TYPE(EvpPkey, EVP_PKEY, EVP_PKEY_free);
using EvpPkeySharedPtr = std::shared_ptr<EVP_PKEY>;

// No EVP_PKEY_CTX <= 0.9.8b
#if OPENSSL_VERSION_NUMBER >= 0x10000002L
FOLLY_SSL_DETAIL_DEFINE_PTR_TYPE(EvpPkeyCtx, EVP_PKEY_CTX, EVP_PKEY_CTX_free);
#else
struct EVP_PKEY_CTX;
#endif

FOLLY_SSL_DETAIL_DEFINE_PTR_TYPE(EvpMdCtx, EVP_MD_CTX, EVP_MD_CTX_free);
FOLLY_SSL_DETAIL_DEFINE_PTR_TYPE(
    EvpCipherCtx, EVP_CIPHER_CTX, EVP_CIPHER_CTX_free);

// HMAC
FOLLY_SSL_DETAIL_DEFINE_PTR_TYPE(HmacCtx, HMAC_CTX, HMAC_CTX_free);

// BIO
FOLLY_SSL_DETAIL_DEFINE_PTR_TYPE(BioMethod, BIO_METHOD, BIO_meth_free);
FOLLY_SSL_DETAIL_DEFINE_PTR_TYPE(Bio, BIO, BIO_vfree);
FOLLY_SSL_DETAIL_DEFINE_PTR_TYPE(BioChain, BIO, BIO_free_all);
inline void BIO_free_fb(BIO* bio) {
  CHECK_EQ(1, BIO_free(bio));
}
using BioDeleterFb = folly::static_function_deleter<BIO, &BIO_free_fb>;
using BioUniquePtrFb = std::unique_ptr<BIO, BioDeleterFb>;

// RSA and EC
FOLLY_SSL_DETAIL_DEFINE_PTR_TYPE(Rsa, RSA, RSA_free);
#ifndef OPENSSL_NO_EC
FOLLY_SSL_DETAIL_DEFINE_PTR_TYPE(EcKey, EC_KEY, EC_KEY_free);
FOLLY_SSL_DETAIL_DEFINE_PTR_TYPE(EcGroup, EC_GROUP, EC_GROUP_free);
FOLLY_SSL_DETAIL_DEFINE_PTR_TYPE(EcPoint, EC_POINT, EC_POINT_free);
FOLLY_SSL_DETAIL_DEFINE_PTR_TYPE(EcdsaSig, ECDSA_SIG, ECDSA_SIG_free);
#endif

// BIGNUMs
FOLLY_SSL_DETAIL_DEFINE_PTR_TYPE(BIGNUM, BIGNUM, BN_clear_free);
FOLLY_SSL_DETAIL_DEFINE_PTR_TYPE(BNCtx, BN_CTX, BN_CTX_free);

// SSL and SSL_CTX
FOLLY_SSL_DETAIL_DEFINE_PTR_TYPE(SSL, SSL, SSL_free);
FOLLY_SSL_DETAIL_DEFINE_PTR_TYPE(SSLSession, SSL_SESSION, SSL_SESSION_free);

#undef FOLLY_SSL_DETAIL_DEFINE_PTR_TYPE
} // namespace ssl
} // namespace folly
