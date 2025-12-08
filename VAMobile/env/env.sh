#!/usr/bin/env bash
while getopts e:t:d:r:l: option
do
case "${option}"
in
e) environment=${OPTARG};;
t) isTest=${OPTARG};;
d) showDebug=${OPTARG};;
r) reactotron=${OPTARG};;
l) localApiUrl=${OPTARG};;
esac
done

cd ./env

# clear the env file
echo "" > .env
echo "ENVIRONMENT=$environment" >> .env
# Get the environment related variables
if [[ $environment == 'local' ]]
then
  echo "Setting up Local environment with Mocked Authentication"
  # Use provided local URL or default to localhost:3000
  LOCAL_API_URL=${localApiUrl:-"http://localhost:3000"}
  
  # Extract base URL without /mobile for auth endpoints
  LOCAL_BASE_URL=${LOCAL_API_URL}
  
  # Add /mobile suffix for API_ROOT if not already present
  if [[ ! $LOCAL_API_URL == */mobile ]]; then
    LOCAL_API_URL="${LOCAL_API_URL}/mobile"
  fi
  
  echo "API_ROOT=$LOCAL_API_URL" >> .env

  # Use local vets-api for authentication (Mocked Authentication)
  # For local, we use the API authorize endpoint directly, not the frontend route
  echo "AUTH_SIS_ENDPOINT=${LOCAL_BASE_URL}/v0/sign_in/authorize" >> .env
  echo "AUTH_SIS_TOKEN_EXCHANGE_URL=${LOCAL_BASE_URL}/v0/sign_in/token" >> .env
  echo "AUTH_SIS_TOKEN_REFRESH_URL=${LOCAL_BASE_URL}/v0/sign_in/refresh" >> .env
  echo "AUTH_SIS_REVOKE_URL=${LOCAL_BASE_URL}/v0/sign_in/revoke" >> .env
elif [[ $environment == 'staging' ]]
then
  echo "Setting up Staging environment"
  API_PREFIX="staging-api."
  echo "API_ROOT=https://${API_PREFIX}va.gov/mobile" >> .env

  # set SIS vars
  AUTH_SIS_ROOT="https://staging.va.gov"
  echo "AUTH_SIS_ENDPOINT=${AUTH_SIS_ROOT}/sign-in" >> .env
  echo "AUTH_SIS_TOKEN_EXCHANGE_URL=https://${API_PREFIX}va.gov/v0/sign_in/token" >> .env
  echo "AUTH_SIS_TOKEN_REFRESH_URL=https://${API_PREFIX}va.gov/v0/sign_in/refresh" >> .env
  echo "AUTH_SIS_REVOKE_URL=https://${API_PREFIX}va.gov/v0/sign_in/revoke" >> .env
else
  echo "Setting up Production environment"
  API_PREFIX="api."
  echo "API_ROOT=https://${API_PREFIX}va.gov/mobile" >> .env

  # set SIS vars
  AUTH_SIS_ROOT="https://www.va.gov"
  echo "AUTH_SIS_ENDPOINT=${AUTH_SIS_ROOT}/sign-in" >> .env
  echo "AUTH_SIS_TOKEN_EXCHANGE_URL=https://${API_PREFIX}va.gov/v0/sign_in/token" >> .env
  echo "AUTH_SIS_TOKEN_REFRESH_URL=https://${API_PREFIX}va.gov/v0/sign_in/refresh" >> .env
  echo "AUTH_SIS_REVOKE_URL=https://${API_PREFIX}va.gov/v0/sign_in/revoke" >> .env
fi

# set website URLs by environment
if [[ $environment == 'local' ]] || [[ $environment == 'staging' ]]
then
  echo "LINK_URL_VA_NOTIFICATIONS=https://staging.va.gov/profile/notifications/" >> .env
  echo "LINK_URL_CLAIM_APPEAL_STATUS=https://staging.va.gov/track-claims/appeals/" >> .env
  echo "LINK_URL_VA_SCHEDULING=https://staging.va.gov/health-care/schedule-view-va-appointments/" >> .env
  echo "LINK_URL_SCHEDULE_APPOINTMENTS=https://staging.va.gov/my-health/appointments/schedule/type-of-care" >> .env
  echo "LINK_URL_TRAVEL_PAY_WEB_DETAILS=https://staging.va.gov/my-health/travel-pay/claims/" >> .env
  echo "LINK_URL_TRAVEL_PAY_FILE_CLAIM_BTSSS=https://staging.va.gov/health-care/get-reimbursed-for-travel-pay/#file-a-claim-for-general-healt" >> .env
  echo "LINK_URL_MHV_VA_MEDICATIONS=https://staging.va.gov/my-health/medications" >> .env
  echo "LINK_URL_MHV_VA_MEDICAL_RECORDS=https://staging.va.gov/my-health/medical-records/" >> .env
  echo "LINK_URL_MHV_LABS_AND_TESTS=https://staging.va.gov/my-health/medical-records/labs-and-tests/" >> .env
  echo "LINK_URL_ASK_VA_GOV=https://staging.va.gov/contact-us/ask-va/introduction" >> .env
else
  echo "LINK_URL_VA_NOTIFICATIONS=https://va.gov/profile/notifications/" >> .env
  echo "LINK_URL_CLAIM_APPEAL_STATUS=https://va.gov/track-claims/appeals/" >> .env
  echo "LINK_URL_VA_SCHEDULING=https://va.gov/health-care/schedule-view-va-appointments/" >> .env
  echo "LINK_URL_SCHEDULE_APPOINTMENTS=https://va.gov/my-health/appointments/schedule/type-of-care" >> .env
  echo "LINK_URL_TRAVEL_PAY_WEB_DETAILS=https://va.gov/my-health/travel-pay/claims/" >> .env
  echo "LINK_URL_TRAVEL_PAY_FILE_CLAIM_BTSSS=https://va.gov/health-care/get-reimbursed-for-travel-pay/#file-a-claim-for-general-healt" >> .env
  echo "LINK_URL_MHV_VA_MEDICATIONS=https://va.gov/my-health/medications" >> .env
  echo "LINK_URL_MHV_VA_MEDICAL_RECORDS=https://va.gov/my-health/medical-records/" >> .env
  echo "LINK_URL_MHV_LABS_AND_TESTS=https://va.gov/my-health/medical-records/labs-and-tests/" >> .env
  echo "LINK_URL_ASK_VA_GOV=https://va.gov/contact-us/ask-va/introduction" >> .env
fi

if [[ $showDebug == 'true' ]]
then
  echo true
  echo "SHOW_DEBUG_MENU=true" >> .env
else
  echo false
  echo "SHOW_DEBUG_MENU=false" >> .env
fi
# set test envs
if [[ $isTest == 'true' ]]
then
  echo "IS_TEST=true" >> .env
else
  echo "IS_TEST=false" >> .env
fi
# set reactotron
if [[ $reactotron == 'true' ]]
then
  echo "REACTOTRON_ENABLED=true" >> .env
else
  echo "REACTOTRON_ENABLED=false" >> .env
fi
# set demo mode password
echo "DEMO_PASSWORD=${DEMO_PASSWORD}" >> .env

# Get all vars that are the same across environments
while read p; do
  echo "$p" >> .env
done<constant.env
