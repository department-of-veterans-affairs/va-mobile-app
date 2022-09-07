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
  AUTH_IAM_PREFIX="sqa."
  AUTH_SIS_PREFIX="staging."
  API_PREFIX="staging-api."
  # set secret, should be stored in bash profile or CI ENVs as APP_CLIENT_SECRET
  echo "AUTH_IAM_CLIENT_SECRET=${APP_CLIENT_SECRET}" >> .env
else
  echo "Setting up Production environment"
  AUTH_IAM_PREFIX=""
  API_PREFIX="api."
  # set secret, should be stored in bash profile or CI ENVs as APP_CLIENT_SECRET_PROD
  echo "AUTH_IAM_CLIENT_SECRET=${APP_CLIENT_SECRET_PROD}" >> .env
fi
# set environment
echo "ENVIRONMENT=$environment" >> .env
# set api endpoints
echo "API_ROOT=https://${API_PREFIX}va.gov/mobile" >> .env

# set IAM vars
AUTH_IAM_ROOT="https://${AUTH_IAM_PREFIX}fed.eauth.va.gov/oauthe/sps/oauth/oauth20"
echo "AUTH_IAM_ENDPOINT=${AUTH_IAM_ROOT}/authorize" >> .env
echo "AUTH_IAM_TOKEN_EXCHANGE_URL=${AUTH_IAM_ROOT}/token" >> .env
echo "AUTH_IAM_REVOKE_URL=${AUTH_IAM_ROOT}/revoke" >> .env

# set SIS vars
AUTH_SIS_ROOT="https://${AUTH_SIS_PREFIX}va.gov"
echo "AUTH_SIS_ENDPOINT=${AUTH_SIS_ROOT}/sign-in" >> .env
echo "AUTH_SIS_TOKEN_EXCHANGE_URL=https://${API_PREFIX}va.gov/v0/sign_in/token" >> .env
echo "AUTH_SIS_TOKEN_REFRESH_URL=https://${API_PREFIX}va.gov/v0/sign_in/refresh" >> .env
echo "AUTH_SIS_REVOKE_URL=https://${API_PREFIX}va.gov/v0/sign_in/revoke" >> .env

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
