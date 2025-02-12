#!/usr/bin/env bash
while getopts e:t:d: option
do
case "${option}"
in
e) environment=${OPTARG};;
t) isTest=${OPTARG};;
d) showDebug=${OPTARG};;
esac
done
cd ./env
# clear the env file
echo "" > .env
# Get the environment related variables
if [[ $environment == 'staging' ]]; then
  echo "Setting up Staging environment"
  WEBSITE_ROOT_URL="https://staging.va.gov"
  API_ROOT_URL="https://staging-api.va.gov"
elif [[ $environment == 'dev' ]]; then
  echo "Setting up Development environment"
  WEBSITE_ROOT_URL="https://dev.va.gov"
  API_ROOT_URL="http://10.0.2.2:3000"
else
  echo "Setting up Production environment"
  WEBSITE_ROOT_URL="https://va.gov"
  API_ROOT_URL="https://api.va.gov"
fi
# set environment
echo "ENVIRONMENT=$environment" >> .env
# set api endpoints
echo "API_ROOT=${API_ROOT_URL}/mobile" >> .env

# set SIS vars
echo "AUTH_SIS_ENDPOINT=${WEBSITE_ROOT_URL}/sign-in" >> .env
echo "AUTH_SIS_TOKEN_EXCHANGE_URL=${API_ROOT_URL}/v0/sign_in/token" >> .env
echo "AUTH_SIS_TOKEN_REFRESH_URL=${API_ROOT_URL}/v0/sign_in/refresh" >> .env
echo "AUTH_SIS_REVOKE_URL=${API_ROOT_URL}/v0/sign_in/revoke" >> .env

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
# set demo mode password
echo "DEMO_PASSWORD=${DEMO_PASSWORD}" >> .env

# set website URLs
echo "LINK_URL_SCHEDULE_APPOINTMENTS=https://${WEBSITE_PREFIX}va.gov/health-care/schedule-view-va-appointments" >> .env

# Get all vars that are the same across environments
while read p; do
  echo "$p" >> .env
done<constant.env
