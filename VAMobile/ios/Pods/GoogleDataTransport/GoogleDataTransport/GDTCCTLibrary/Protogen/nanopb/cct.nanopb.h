/*
 * Copyright 2019 Google
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* Automatically generated nanopb header */
/* Generated by nanopb-0.3.9.9 */

#ifndef PB_GDT_CCT_CCT_NANOPB_H_INCLUDED
#define PB_GDT_CCT_CCT_NANOPB_H_INCLUDED
#include <nanopb/pb.h>

/* @@protoc_insertion_point(includes) */
#if PB_PROTO_HEADER_VERSION != 30
#error Regenerate this file with the current version of nanopb generator.
#endif


/* Enum definitions */
typedef enum _gdt_cct_NetworkConnectionInfo_NetworkType {
    gdt_cct_NetworkConnectionInfo_NetworkType_NONE = -1,
    gdt_cct_NetworkConnectionInfo_NetworkType_MOBILE = 0,
    gdt_cct_NetworkConnectionInfo_NetworkType_WIFI = 1,
    gdt_cct_NetworkConnectionInfo_NetworkType_MOBILE_MMS = 2,
    gdt_cct_NetworkConnectionInfo_NetworkType_MOBILE_SUPL = 3,
    gdt_cct_NetworkConnectionInfo_NetworkType_MOBILE_DUN = 4,
    gdt_cct_NetworkConnectionInfo_NetworkType_MOBILE_HIPRI = 5,
    gdt_cct_NetworkConnectionInfo_NetworkType_WIMAX = 6,
    gdt_cct_NetworkConnectionInfo_NetworkType_BLUETOOTH = 7,
    gdt_cct_NetworkConnectionInfo_NetworkType_DUMMY = 8,
    gdt_cct_NetworkConnectionInfo_NetworkType_ETHERNET = 9,
    gdt_cct_NetworkConnectionInfo_NetworkType_MOBILE_FOTA = 10,
    gdt_cct_NetworkConnectionInfo_NetworkType_MOBILE_IMS = 11,
    gdt_cct_NetworkConnectionInfo_NetworkType_MOBILE_CBS = 12,
    gdt_cct_NetworkConnectionInfo_NetworkType_WIFI_P2P = 13,
    gdt_cct_NetworkConnectionInfo_NetworkType_MOBILE_IA = 14,
    gdt_cct_NetworkConnectionInfo_NetworkType_MOBILE_EMERGENCY = 15,
    gdt_cct_NetworkConnectionInfo_NetworkType_PROXY = 16,
    gdt_cct_NetworkConnectionInfo_NetworkType_VPN = 17
} gdt_cct_NetworkConnectionInfo_NetworkType;
#define _gdt_cct_NetworkConnectionInfo_NetworkType_MIN gdt_cct_NetworkConnectionInfo_NetworkType_NONE
#define _gdt_cct_NetworkConnectionInfo_NetworkType_MAX gdt_cct_NetworkConnectionInfo_NetworkType_VPN
#define _gdt_cct_NetworkConnectionInfo_NetworkType_ARRAYSIZE ((gdt_cct_NetworkConnectionInfo_NetworkType)(gdt_cct_NetworkConnectionInfo_NetworkType_VPN+1))

typedef enum _gdt_cct_NetworkConnectionInfo_MobileSubtype {
    gdt_cct_NetworkConnectionInfo_MobileSubtype_UNKNOWN_MOBILE_SUBTYPE = 0,
    gdt_cct_NetworkConnectionInfo_MobileSubtype_GPRS = 1,
    gdt_cct_NetworkConnectionInfo_MobileSubtype_EDGE = 2,
    gdt_cct_NetworkConnectionInfo_MobileSubtype_UMTS = 3,
    gdt_cct_NetworkConnectionInfo_MobileSubtype_CDMA = 4,
    gdt_cct_NetworkConnectionInfo_MobileSubtype_EVDO_0 = 5,
    gdt_cct_NetworkConnectionInfo_MobileSubtype_EVDO_A = 6,
    gdt_cct_NetworkConnectionInfo_MobileSubtype_RTT = 7,
    gdt_cct_NetworkConnectionInfo_MobileSubtype_HSDPA = 8,
    gdt_cct_NetworkConnectionInfo_MobileSubtype_HSUPA = 9,
    gdt_cct_NetworkConnectionInfo_MobileSubtype_HSPA = 10,
    gdt_cct_NetworkConnectionInfo_MobileSubtype_IDEN = 11,
    gdt_cct_NetworkConnectionInfo_MobileSubtype_EVDO_B = 12,
    gdt_cct_NetworkConnectionInfo_MobileSubtype_LTE = 13,
    gdt_cct_NetworkConnectionInfo_MobileSubtype_EHRPD = 14,
    gdt_cct_NetworkConnectionInfo_MobileSubtype_HSPAP = 15,
    gdt_cct_NetworkConnectionInfo_MobileSubtype_GSM = 16,
    gdt_cct_NetworkConnectionInfo_MobileSubtype_TD_SCDMA = 17,
    gdt_cct_NetworkConnectionInfo_MobileSubtype_IWLAN = 18,
    gdt_cct_NetworkConnectionInfo_MobileSubtype_LTE_CA = 19,
    gdt_cct_NetworkConnectionInfo_MobileSubtype_COMBINED = 100
} gdt_cct_NetworkConnectionInfo_MobileSubtype;
#define _gdt_cct_NetworkConnectionInfo_MobileSubtype_MIN gdt_cct_NetworkConnectionInfo_MobileSubtype_UNKNOWN_MOBILE_SUBTYPE
#define _gdt_cct_NetworkConnectionInfo_MobileSubtype_MAX gdt_cct_NetworkConnectionInfo_MobileSubtype_COMBINED
#define _gdt_cct_NetworkConnectionInfo_MobileSubtype_ARRAYSIZE ((gdt_cct_NetworkConnectionInfo_MobileSubtype)(gdt_cct_NetworkConnectionInfo_MobileSubtype_COMBINED+1))

typedef enum _gdt_cct_ClientInfo_ClientType {
    gdt_cct_ClientInfo_ClientType_CLIENT_UNKNOWN = 0,
    gdt_cct_ClientInfo_ClientType_IOS_FIREBASE = 15
} gdt_cct_ClientInfo_ClientType;
#define _gdt_cct_ClientInfo_ClientType_MIN gdt_cct_ClientInfo_ClientType_CLIENT_UNKNOWN
#define _gdt_cct_ClientInfo_ClientType_MAX gdt_cct_ClientInfo_ClientType_IOS_FIREBASE
#define _gdt_cct_ClientInfo_ClientType_ARRAYSIZE ((gdt_cct_ClientInfo_ClientType)(gdt_cct_ClientInfo_ClientType_IOS_FIREBASE+1))

typedef enum _gdt_cct_QosTierConfiguration_QosTier {
    gdt_cct_QosTierConfiguration_QosTier_DEFAULT = 0,
    gdt_cct_QosTierConfiguration_QosTier_UNMETERED_ONLY = 1,
    gdt_cct_QosTierConfiguration_QosTier_UNMETERED_OR_DAILY = 2,
    gdt_cct_QosTierConfiguration_QosTier_FAST_IF_RADIO_AWAKE = 3,
    gdt_cct_QosTierConfiguration_QosTier_NEVER = 4
} gdt_cct_QosTierConfiguration_QosTier;
#define _gdt_cct_QosTierConfiguration_QosTier_MIN gdt_cct_QosTierConfiguration_QosTier_DEFAULT
#define _gdt_cct_QosTierConfiguration_QosTier_MAX gdt_cct_QosTierConfiguration_QosTier_NEVER
#define _gdt_cct_QosTierConfiguration_QosTier_ARRAYSIZE ((gdt_cct_QosTierConfiguration_QosTier)(gdt_cct_QosTierConfiguration_QosTier_NEVER+1))

/* Struct definitions */
typedef struct _gdt_cct_BatchedLogRequest {
    pb_size_t log_request_count;
    struct _gdt_cct_LogRequest *log_request;
/* @@protoc_insertion_point(struct:gdt_cct_BatchedLogRequest) */
} gdt_cct_BatchedLogRequest;

typedef struct _gdt_cct_IosClientInfo {
    pb_bytes_array_t *os_major_version;
    pb_bytes_array_t *os_full_version;
    pb_bytes_array_t *application_build;
    pb_bytes_array_t *country;
    pb_bytes_array_t *model;
    pb_bytes_array_t *language_code;
    pb_bytes_array_t *application_bundle_id;
/* @@protoc_insertion_point(struct:gdt_cct_IosClientInfo) */
} gdt_cct_IosClientInfo;

typedef struct _gdt_cct_MacClientInfo {
    pb_bytes_array_t *os_major_version;
    pb_bytes_array_t *os_full_version;
    pb_bytes_array_t *application_build;
    pb_bytes_array_t *application_bundle_id;
/* @@protoc_insertion_point(struct:gdt_cct_MacClientInfo) */
} gdt_cct_MacClientInfo;

typedef struct _gdt_cct_ClientInfo {
    bool has_client_type;
    gdt_cct_ClientInfo_ClientType client_type;
    bool has_ios_client_info;
    gdt_cct_IosClientInfo ios_client_info;
    bool has_mac_client_info;
    gdt_cct_MacClientInfo mac_client_info;
/* @@protoc_insertion_point(struct:gdt_cct_ClientInfo) */
} gdt_cct_ClientInfo;

typedef struct _gdt_cct_NetworkConnectionInfo {
    bool has_network_type;
    gdt_cct_NetworkConnectionInfo_NetworkType network_type;
    bool has_mobile_subtype;
    gdt_cct_NetworkConnectionInfo_MobileSubtype mobile_subtype;
/* @@protoc_insertion_point(struct:gdt_cct_NetworkConnectionInfo) */
} gdt_cct_NetworkConnectionInfo;

typedef struct _gdt_cct_QosTierConfiguration {
    bool has_qos_tier;
    gdt_cct_QosTierConfiguration_QosTier qos_tier;
    bool has_log_source;
    int32_t log_source;
/* @@protoc_insertion_point(struct:gdt_cct_QosTierConfiguration) */
} gdt_cct_QosTierConfiguration;

typedef struct _gdt_cct_QosTiersOverride {
    pb_size_t qos_tier_configuration_count;
    struct _gdt_cct_QosTierConfiguration *qos_tier_configuration;
    bool has_qos_tier_fingerprint;
    int64_t qos_tier_fingerprint;
/* @@protoc_insertion_point(struct:gdt_cct_QosTiersOverride) */
} gdt_cct_QosTiersOverride;

typedef struct _gdt_cct_LogEvent {
    bool has_event_time_ms;
    int64_t event_time_ms;
    pb_bytes_array_t *source_extension;
    bool has_event_code;
    int32_t event_code;
    bool has_timezone_offset_seconds;
    int64_t timezone_offset_seconds;
    bool has_event_uptime_ms;
    int64_t event_uptime_ms;
    bool has_network_connection_info;
    gdt_cct_NetworkConnectionInfo network_connection_info;
/* @@protoc_insertion_point(struct:gdt_cct_LogEvent) */
} gdt_cct_LogEvent;

typedef struct _gdt_cct_LogRequest {
    bool has_client_info;
    gdt_cct_ClientInfo client_info;
    bool has_log_source;
    int32_t log_source;
    pb_size_t log_event_count;
    struct _gdt_cct_LogEvent *log_event;
    bool has_request_time_ms;
    int64_t request_time_ms;
    bool has_request_uptime_ms;
    int64_t request_uptime_ms;
    bool has_qos_tier;
    gdt_cct_QosTierConfiguration_QosTier qos_tier;
/* @@protoc_insertion_point(struct:gdt_cct_LogRequest) */
} gdt_cct_LogRequest;

typedef struct _gdt_cct_LogResponse {
    bool has_next_request_wait_millis;
    int64_t next_request_wait_millis;
    bool has_qos_tier;
    gdt_cct_QosTiersOverride qos_tier;
/* @@protoc_insertion_point(struct:gdt_cct_LogResponse) */
} gdt_cct_LogResponse;

/* Default values for struct fields */
extern const gdt_cct_NetworkConnectionInfo_NetworkType gdt_cct_NetworkConnectionInfo_network_type_default;
extern const gdt_cct_NetworkConnectionInfo_MobileSubtype gdt_cct_NetworkConnectionInfo_mobile_subtype_default;
extern const gdt_cct_QosTierConfiguration_QosTier gdt_cct_LogRequest_qos_tier_default;
extern const int32_t gdt_cct_QosTierConfiguration_log_source_default;

/* Initializer values for message structs */
#define gdt_cct_LogEvent_init_default            {false, 0, NULL, false, 0, false, 0, false, 0, false, gdt_cct_NetworkConnectionInfo_init_default}
#define gdt_cct_NetworkConnectionInfo_init_default {false, gdt_cct_NetworkConnectionInfo_NetworkType_NONE, false, gdt_cct_NetworkConnectionInfo_MobileSubtype_UNKNOWN_MOBILE_SUBTYPE}
#define gdt_cct_MacClientInfo_init_default       {NULL, NULL, NULL, NULL}
#define gdt_cct_IosClientInfo_init_default       {NULL, NULL, NULL, NULL, NULL, NULL, NULL}
#define gdt_cct_ClientInfo_init_default          {false, _gdt_cct_ClientInfo_ClientType_MIN, false, gdt_cct_IosClientInfo_init_default, false, gdt_cct_MacClientInfo_init_default}
#define gdt_cct_BatchedLogRequest_init_default   {0, NULL}
#define gdt_cct_LogRequest_init_default          {false, gdt_cct_ClientInfo_init_default, false, 0, 0, NULL, false, 0, false, 0, false, gdt_cct_QosTierConfiguration_QosTier_DEFAULT}
#define gdt_cct_QosTierConfiguration_init_default {false, _gdt_cct_QosTierConfiguration_QosTier_MIN, false, 0}
#define gdt_cct_QosTiersOverride_init_default    {0, NULL, false, 0}
#define gdt_cct_LogResponse_init_default         {false, 0, false, gdt_cct_QosTiersOverride_init_default}
#define gdt_cct_LogEvent_init_zero               {false, 0, NULL, false, 0, false, 0, false, 0, false, gdt_cct_NetworkConnectionInfo_init_zero}
#define gdt_cct_NetworkConnectionInfo_init_zero  {false, _gdt_cct_NetworkConnectionInfo_NetworkType_MIN, false, _gdt_cct_NetworkConnectionInfo_MobileSubtype_MIN}
#define gdt_cct_MacClientInfo_init_zero          {NULL, NULL, NULL, NULL}
#define gdt_cct_IosClientInfo_init_zero          {NULL, NULL, NULL, NULL, NULL, NULL, NULL}
#define gdt_cct_ClientInfo_init_zero             {false, _gdt_cct_ClientInfo_ClientType_MIN, false, gdt_cct_IosClientInfo_init_zero, false, gdt_cct_MacClientInfo_init_zero}
#define gdt_cct_BatchedLogRequest_init_zero      {0, NULL}
#define gdt_cct_LogRequest_init_zero             {false, gdt_cct_ClientInfo_init_zero, false, 0, 0, NULL, false, 0, false, 0, false, _gdt_cct_QosTierConfiguration_QosTier_MIN}
#define gdt_cct_QosTierConfiguration_init_zero   {false, _gdt_cct_QosTierConfiguration_QosTier_MIN, false, 0}
#define gdt_cct_QosTiersOverride_init_zero       {0, NULL, false, 0}
#define gdt_cct_LogResponse_init_zero            {false, 0, false, gdt_cct_QosTiersOverride_init_zero}

/* Field tags (for use in manual encoding/decoding) */
#define gdt_cct_BatchedLogRequest_log_request_tag 1
#define gdt_cct_IosClientInfo_os_major_version_tag 3
#define gdt_cct_IosClientInfo_os_full_version_tag 4
#define gdt_cct_IosClientInfo_application_build_tag 5
#define gdt_cct_IosClientInfo_country_tag        6
#define gdt_cct_IosClientInfo_model_tag          7
#define gdt_cct_IosClientInfo_language_code_tag  8
#define gdt_cct_IosClientInfo_application_bundle_id_tag 11
#define gdt_cct_MacClientInfo_os_major_version_tag 1
#define gdt_cct_MacClientInfo_os_full_version_tag 2
#define gdt_cct_MacClientInfo_application_build_tag 3
#define gdt_cct_MacClientInfo_application_bundle_id_tag 7
#define gdt_cct_ClientInfo_client_type_tag       1
#define gdt_cct_ClientInfo_ios_client_info_tag   4
#define gdt_cct_ClientInfo_mac_client_info_tag   13
#define gdt_cct_NetworkConnectionInfo_network_type_tag 1
#define gdt_cct_NetworkConnectionInfo_mobile_subtype_tag 2
#define gdt_cct_QosTierConfiguration_qos_tier_tag 2
#define gdt_cct_QosTierConfiguration_log_source_tag 3
#define gdt_cct_QosTiersOverride_qos_tier_configuration_tag 1
#define gdt_cct_QosTiersOverride_qos_tier_fingerprint_tag 2
#define gdt_cct_LogEvent_event_time_ms_tag       1
#define gdt_cct_LogEvent_event_code_tag          11
#define gdt_cct_LogEvent_event_uptime_ms_tag     17
#define gdt_cct_LogEvent_source_extension_tag    6
#define gdt_cct_LogEvent_timezone_offset_seconds_tag 15
#define gdt_cct_LogEvent_network_connection_info_tag 23
#define gdt_cct_LogRequest_request_time_ms_tag   4
#define gdt_cct_LogRequest_request_uptime_ms_tag 8
#define gdt_cct_LogRequest_client_info_tag       1
#define gdt_cct_LogRequest_log_source_tag        2
#define gdt_cct_LogRequest_log_event_tag         3
#define gdt_cct_LogRequest_qos_tier_tag          9
#define gdt_cct_LogResponse_next_request_wait_millis_tag 1
#define gdt_cct_LogResponse_qos_tier_tag         3

/* Struct field encoding specification for nanopb */
extern const pb_field_t gdt_cct_LogEvent_fields[7];
extern const pb_field_t gdt_cct_NetworkConnectionInfo_fields[3];
extern const pb_field_t gdt_cct_MacClientInfo_fields[5];
extern const pb_field_t gdt_cct_IosClientInfo_fields[8];
extern const pb_field_t gdt_cct_ClientInfo_fields[4];
extern const pb_field_t gdt_cct_BatchedLogRequest_fields[2];
extern const pb_field_t gdt_cct_LogRequest_fields[7];
extern const pb_field_t gdt_cct_QosTierConfiguration_fields[3];
extern const pb_field_t gdt_cct_QosTiersOverride_fields[3];
extern const pb_field_t gdt_cct_LogResponse_fields[3];

/* Maximum encoded size of messages (where known) */
/* gdt_cct_LogEvent_size depends on runtime parameters */
#define gdt_cct_NetworkConnectionInfo_size       13
/* gdt_cct_MacClientInfo_size depends on runtime parameters */
/* gdt_cct_IosClientInfo_size depends on runtime parameters */
/* gdt_cct_ClientInfo_size depends on runtime parameters */
/* gdt_cct_BatchedLogRequest_size depends on runtime parameters */
/* gdt_cct_LogRequest_size depends on runtime parameters */
#define gdt_cct_QosTierConfiguration_size        13
/* gdt_cct_QosTiersOverride_size depends on runtime parameters */
/* gdt_cct_LogResponse_size depends on runtime parameters */

/* Message IDs (where set with "msgid" option) */
#ifdef PB_MSGID

#define CCT_MESSAGES \


#endif

/* @@protoc_insertion_point(eof) */

#endif
