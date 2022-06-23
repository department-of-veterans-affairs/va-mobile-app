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

/* Automatically generated nanopb constant definitions */
/* Generated by nanopb-0.3.9.7 */

#include "GoogleDataTransport/GDTCCTLibrary/Protogen/nanopb/cct.nanopb.h"

/* @@protoc_insertion_point(includes) */
#if PB_PROTO_HEADER_VERSION != 30
#error Regenerate this file with the current version of nanopb generator.
#endif

const gdt_cct_NetworkConnectionInfo_NetworkType gdt_cct_NetworkConnectionInfo_network_type_default = gdt_cct_NetworkConnectionInfo_NetworkType_NONE;
const gdt_cct_NetworkConnectionInfo_MobileSubtype gdt_cct_NetworkConnectionInfo_mobile_subtype_default = gdt_cct_NetworkConnectionInfo_MobileSubtype_UNKNOWN_MOBILE_SUBTYPE;
const gdt_cct_QosTierConfiguration_QosTier gdt_cct_LogRequest_qos_tier_default = gdt_cct_QosTierConfiguration_QosTier_DEFAULT;
const int32_t gdt_cct_QosTierConfiguration_log_source_default = 0;


const pb_field_t gdt_cct_LogEvent_fields[7] = {
    PB_FIELD(  1, INT64   , OPTIONAL, STATIC  , FIRST, gdt_cct_LogEvent, event_time_ms, event_time_ms, 0),
    PB_FIELD(  6, BYTES   , OPTIONAL, POINTER , OTHER, gdt_cct_LogEvent, source_extension, event_time_ms, 0),
    PB_FIELD( 11, INT32   , OPTIONAL, STATIC  , OTHER, gdt_cct_LogEvent, event_code, source_extension, 0),
    PB_FIELD( 15, SINT64  , OPTIONAL, STATIC  , OTHER, gdt_cct_LogEvent, timezone_offset_seconds, event_code, 0),
    PB_FIELD( 17, INT64   , OPTIONAL, STATIC  , OTHER, gdt_cct_LogEvent, event_uptime_ms, timezone_offset_seconds, 0),
    PB_FIELD( 23, MESSAGE , OPTIONAL, STATIC  , OTHER, gdt_cct_LogEvent, network_connection_info, event_uptime_ms, &gdt_cct_NetworkConnectionInfo_fields),
    PB_LAST_FIELD
};

const pb_field_t gdt_cct_NetworkConnectionInfo_fields[3] = {
    PB_FIELD(  1, ENUM    , OPTIONAL, STATIC  , FIRST, gdt_cct_NetworkConnectionInfo, network_type, network_type, &gdt_cct_NetworkConnectionInfo_network_type_default),
    PB_FIELD(  2, UENUM   , OPTIONAL, STATIC  , OTHER, gdt_cct_NetworkConnectionInfo, mobile_subtype, network_type, &gdt_cct_NetworkConnectionInfo_mobile_subtype_default),
    PB_LAST_FIELD
};

const pb_field_t gdt_cct_IosClientInfo_fields[8] = {
    PB_FIELD(  3, BYTES   , OPTIONAL, POINTER , FIRST, gdt_cct_IosClientInfo, os_major_version, os_major_version, 0),
    PB_FIELD(  4, BYTES   , OPTIONAL, POINTER , OTHER, gdt_cct_IosClientInfo, os_full_version, os_major_version, 0),
    PB_FIELD(  5, BYTES   , OPTIONAL, POINTER , OTHER, gdt_cct_IosClientInfo, application_build, os_full_version, 0),
    PB_FIELD(  6, BYTES   , OPTIONAL, POINTER , OTHER, gdt_cct_IosClientInfo, country, application_build, 0),
    PB_FIELD(  7, BYTES   , OPTIONAL, POINTER , OTHER, gdt_cct_IosClientInfo, model, country, 0),
    PB_FIELD(  8, BYTES   , OPTIONAL, POINTER , OTHER, gdt_cct_IosClientInfo, language_code, model, 0),
    PB_FIELD( 11, BYTES   , OPTIONAL, POINTER , OTHER, gdt_cct_IosClientInfo, application_bundle_id, language_code, 0),
    PB_LAST_FIELD
};

const pb_field_t gdt_cct_ClientInfo_fields[3] = {
    PB_FIELD(  1, UENUM   , OPTIONAL, STATIC  , FIRST, gdt_cct_ClientInfo, client_type, client_type, 0),
    PB_FIELD(  4, MESSAGE , OPTIONAL, STATIC  , OTHER, gdt_cct_ClientInfo, ios_client_info, client_type, &gdt_cct_IosClientInfo_fields),
    PB_LAST_FIELD
};

const pb_field_t gdt_cct_BatchedLogRequest_fields[2] = {
    PB_FIELD(  1, MESSAGE , REPEATED, POINTER , FIRST, gdt_cct_BatchedLogRequest, log_request, log_request, &gdt_cct_LogRequest_fields),
    PB_LAST_FIELD
};

const pb_field_t gdt_cct_LogRequest_fields[7] = {
    PB_FIELD(  1, MESSAGE , OPTIONAL, STATIC  , FIRST, gdt_cct_LogRequest, client_info, client_info, &gdt_cct_ClientInfo_fields),
    PB_FIELD(  2, INT32   , OPTIONAL, STATIC  , OTHER, gdt_cct_LogRequest, log_source, client_info, 0),
    PB_FIELD(  3, MESSAGE , REPEATED, POINTER , OTHER, gdt_cct_LogRequest, log_event, log_source, &gdt_cct_LogEvent_fields),
    PB_FIELD(  4, INT64   , OPTIONAL, STATIC  , OTHER, gdt_cct_LogRequest, request_time_ms, log_event, 0),
    PB_FIELD(  8, INT64   , OPTIONAL, STATIC  , OTHER, gdt_cct_LogRequest, request_uptime_ms, request_time_ms, 0),
    PB_FIELD(  9, UENUM   , OPTIONAL, STATIC  , OTHER, gdt_cct_LogRequest, qos_tier, request_uptime_ms, &gdt_cct_LogRequest_qos_tier_default),
    PB_LAST_FIELD
};

const pb_field_t gdt_cct_QosTierConfiguration_fields[3] = {
    PB_FIELD(  2, UENUM   , OPTIONAL, STATIC  , FIRST, gdt_cct_QosTierConfiguration, qos_tier, qos_tier, 0),
    PB_FIELD(  3, INT32   , OPTIONAL, STATIC  , OTHER, gdt_cct_QosTierConfiguration, log_source, qos_tier, &gdt_cct_QosTierConfiguration_log_source_default),
    PB_LAST_FIELD
};

const pb_field_t gdt_cct_QosTiersOverride_fields[3] = {
    PB_FIELD(  1, MESSAGE , REPEATED, POINTER , FIRST, gdt_cct_QosTiersOverride, qos_tier_configuration, qos_tier_configuration, &gdt_cct_QosTierConfiguration_fields),
    PB_FIELD(  2, INT64   , OPTIONAL, STATIC  , OTHER, gdt_cct_QosTiersOverride, qos_tier_fingerprint, qos_tier_configuration, 0),
    PB_LAST_FIELD
};

const pb_field_t gdt_cct_LogResponse_fields[3] = {
    PB_FIELD(  1, INT64   , OPTIONAL, STATIC  , FIRST, gdt_cct_LogResponse, next_request_wait_millis, next_request_wait_millis, 0),
    PB_FIELD(  3, MESSAGE , OPTIONAL, STATIC  , OTHER, gdt_cct_LogResponse, qos_tier, next_request_wait_millis, &gdt_cct_QosTiersOverride_fields),
    PB_LAST_FIELD
};






/* Check that field information fits in pb_field_t */
#if !defined(PB_FIELD_32BIT)
/* If you get an error here, it means that you need to define PB_FIELD_32BIT
 * compile-time option. You can do that in pb.h or on compiler command line.
 *
 * The reason you need to do this is that some of your messages contain tag
 * numbers or field sizes that are larger than what can fit in 8 or 16 bit
 * field descriptors.
 */
PB_STATIC_ASSERT((pb_membersize(gdt_cct_LogEvent, network_connection_info) < 65536 && pb_membersize(gdt_cct_ClientInfo, ios_client_info) < 65536 && pb_membersize(gdt_cct_LogRequest, client_info) < 65536 && pb_membersize(gdt_cct_LogResponse, qos_tier) < 65536), YOU_MUST_DEFINE_PB_FIELD_32BIT_FOR_MESSAGES_gdt_cct_LogEvent_gdt_cct_NetworkConnectionInfo_gdt_cct_IosClientInfo_gdt_cct_ClientInfo_gdt_cct_BatchedLogRequest_gdt_cct_LogRequest_gdt_cct_QosTierConfiguration_gdt_cct_QosTiersOverride_gdt_cct_LogResponse)
#endif

#if !defined(PB_FIELD_16BIT) && !defined(PB_FIELD_32BIT)
/* If you get an error here, it means that you need to define PB_FIELD_16BIT
 * compile-time option. You can do that in pb.h or on compiler command line.
 *
 * The reason you need to do this is that some of your messages contain tag
 * numbers or field sizes that are larger than what can fit in the default
 * 8 bit descriptors.
 */
PB_STATIC_ASSERT((pb_membersize(gdt_cct_LogEvent, network_connection_info) < 256 && pb_membersize(gdt_cct_ClientInfo, ios_client_info) < 256 && pb_membersize(gdt_cct_LogRequest, client_info) < 256 && pb_membersize(gdt_cct_LogResponse, qos_tier) < 256), YOU_MUST_DEFINE_PB_FIELD_16BIT_FOR_MESSAGES_gdt_cct_LogEvent_gdt_cct_NetworkConnectionInfo_gdt_cct_IosClientInfo_gdt_cct_ClientInfo_gdt_cct_BatchedLogRequest_gdt_cct_LogRequest_gdt_cct_QosTierConfiguration_gdt_cct_QosTiersOverride_gdt_cct_LogResponse)
#endif


/* @@protoc_insertion_point(eof) */
