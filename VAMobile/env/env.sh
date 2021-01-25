while getopts e:t:d: option
do
case "${option}"
in
e) environment=${OPTARG};;
t) isTest=${OPTARG};;
d) showDebug=${OPTARG};;
esac
done
# clear the env file
echo "" > script.env
# set test envs
if [[ $isTest == 'true' ]]
then
  echo "IS_TEST=true" >> script.env
else
  echo "IS_TEST=false" >> script.env
fi
# set secret
echo "AUTH_CLIENT_SECRET=${APP_CLIENT_SECRET}" >> script.env
# Get the environment related variables
if [[ $environment == 'staging' ]]
then
  echo "Setting up Staging environment"
  AUTH_PREFIX="sqa."
  API_PREFIX="staging-api."
  echo "AUTH_ALLOW_NON_BIOMETRIC_SAVE=true" >> script.env
else
  echo "Setting up Production environment"
  AUTH_PREFIX=""
  API_PREFIX="api."
  echo "AUTH_ALLOW_NON_BIOMETRIC_SAVE=false" >> script.env
fi
# set api endpoints
echo "API_ROOT=https://${API_PREFIX}va.gov/mobile" >> script.env
 AUTH_ROOT="https://${AUTH_PREFIX}fed.eauth.va.gov/oauthe/sps/oauth/oauth20"
echo "AUTH_ENDPOINT=${AUTH_ROOT}/authorize" >> script.env
echo "AUTH_TOKEN_EXCHANGE_URL=${AUTH_ROOT}/token" >> script.env
echo "AUTH_REVOKE_URL=${AUTH_ROOT}/revoke" >> script.env
if [[ showDebug ]]
then
  echo "SHOW_DEBUG_MENU=true" >> script.env
else
  echo "SHOW_DEBUG_MENU=false" >> script.env
fi
# Get all vars that are the same across environments
while read p; do
  echo "$p" >> script.env
done<constant.env
