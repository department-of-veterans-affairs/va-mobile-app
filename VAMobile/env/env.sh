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
if [[ $environment == 'staging' ]]
then
  echo "Setting up Staging environment"
  AUTH_PREFIX="sqa."
  API_PREFIX="staging-api."
  echo "AUTH_ALLOW_NON_BIOMETRIC_SAVE=true" >> .env
  # set secret, should be stored in bash profile or CI ENVs as APP_CLIENT_SECRET
  echo "AUTH_CLIENT_SECRET=${APP_CLIENT_SECRET}" >> .env
else
  echo "Setting up Production environment"
  AUTH_PREFIX=""
  API_PREFIX="api."
  echo "AUTH_ALLOW_NON_BIOMETRIC_SAVE=false" >> .env
  # set secret, should be stored in bash profile or CI ENVs as APP_CLIENT_SECRET_PROD
  echo "AUTH_CLIENT_SECRET=${APP_CLIENT_SECRET_PROD}" >> .env
fi
# set environment
echo "ENVIRONMENT=$environment" >> .env
# set api endpoints
echo "API_ROOT=https://${API_PREFIX}va.gov/mobile" >> .env
 AUTH_ROOT="https://${AUTH_PREFIX}fed.eauth.va.gov/oauthe/sps/oauth/oauth20"
echo "AUTH_ENDPOINT=${AUTH_ROOT}/authorize" >> .env
echo "AUTH_TOKEN_EXCHANGE_URL=${AUTH_ROOT}/token" >> .env
echo "AUTH_REVOKE_URL=${AUTH_ROOT}/revoke" >> .env
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
# Get all vars that are the same across environments
while read p; do
  echo "$p" >> .env
done<constant.env
