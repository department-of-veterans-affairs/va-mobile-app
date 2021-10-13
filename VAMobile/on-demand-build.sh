#!/usr/bin/env bash
# Exit script if you try to use an uninitialized variable.
set -o nounset

# Exit script if a statement returns a non-true return value.
set -o errexit

# Use the error status of the first failure, rather than that of the last item in a pipeline.
set -o pipefail

#### function to pretty print array values as comma separated string
### $1: array to print
arrayPrint() {
    local -n arr=$1
    IFS=',';echo "${arr[*]}";IFS=$' \t\n'
    return 0
}


#### Help function
Help() {
    #Display help
    echo "Build an on-demand version of Android or iOS. This will deploy to the named tracks/groups"

    echo "Syntax: ./on-demand.sh [(-o|--os)&((-e|--environment)|(-b|--branch)|(-t|--type)|(-f|--flight_group)|(-p|--play_track))]"
    echo "options:"
    echo "o | os                REQUIRED: Operating system to build for. Choose from [ $(arrayPrint os_opts) ]"
    echo "e | environment       Vets API environment to build for. default is 'staging'. Choose from [ $(arrayPrint env_opts) ]"
    echo "b | branch            Branch to checkout. Default is 'develop'"
    echo "t | type              Type of build. Default is 'qa'. Choose from [ $(arrayPrint type_opts) ]"
    echo "f | flight_group      Test Flight group to build for (iOS). Default is 'Development Team'. Choose from [ $(arrayPrint tf_opts) ]"
    echo "p | play_track        Google Play Track to build for (Android). Default is 'Development Team'. Choose from [ $(arrayPrint ps_opts) ]"
    echo "h | help              Displays this help menu."
    echo
}


# Environment default and options
ENV="staging"
declare -a env_opts=(staging production)

# Operating system default and options
declare -a os_opts=(ios android)

# Git branch default
BRANCH="develop"

#Build taget type default and options. release and hotfix are here for later versions, for now please use only "qa"
TYPE="qa"
declare -a type_opts=(qa release hotfix)

# TestFlight group and options
TF_GROUP="Development Team"
declare -a tf_opts=("Development Team" "Ad Hoc Production Testers" "IAM Group" "Push Testing" "UAT Group" "VA 508 Testers" "VA Employee (Wide) Beta" "VA Production Testers" "VA Stakeholders")

# Play Store track default and options
PS_TRACK="Development Team"
declare -a ps_opts=("Ad Hoc Production Testers" "Development Team" "UAT Group" "VA Production Testers" "VA Production Testers" "Temp - Push" "508 Office")

### Prints Illegal arg error and exits script
## $1: list of the possible option values
## $2: flag being set
illegalArg() {
    local -n opts=$1
    echo "Illegal argument for ${2}. Must be one of the following:"
    echo $(arrayPrint opts)
    exit 1
}

### Checks to see if a string is in a list. If the value is not found in the
### list the function throws illegal arg error and exits script
## $1: list to check in
## $2: string value to check for
## $3: variable to set
## $4: the flag we are checking (used for error outputs)
isInArray() {
    local -n list=$1
    local -n outvar=$3
    for i in "${list[@]}"; do
        if [[ "$2" == "$i" ]]; then
            outvar="$2"
            return 0
        fi
    done
    illegalArg list $4
}


## -------------- MAIN SCRIPT -------------------

# get options and set values
while [ $# -gt 0 ]; do
  case "$1" in
    -e|--environment)
	  isInArray env_opts "$2" ENV $1
      ;;
    -o|--os)
      isInArray os_opts "$2" OS $1
      ;;
    -b|--branch)
	  BRANCH=$2
	  ;;
	-t|--type)
	  isInArray type_opts "$2" TYPE $1
	  ;;
	-f|--flight_group)
	  isInArray tf_opts "$2" TF_GROUP $1
	  ;;
	-p|--play_track)
	  isInArray ps_opts "$2" PS_TRACK $1
	  ;;
	-h|--help)
	  Help;;
    *)
      printf "***************************\n"
      printf "* Error: Invalid argument. Try -h for help*\n"
      printf "***************************\n"
      exit 1
  esac
  shift
  shift
done

# sanity check prints for debugging
echo BRANCH: "$BRANCH"
echo OS: $OS
echo ENV: $ENV
echo TYPE: $TYPE
echo TF_GROUP: "$TF_GROUP"
echo PS_TRACK: "$PS_TRACK"

# save the base directory to move about the project
BASE_DIR="$PWD"

## checkout branch and pull branch
git checkout "$BRANCH"
git pull

## install dependencies
yarn install &&
## set ENV VARS
yarn env:$ENV &&

# build iOS if the os flag is all or ios
if [[ $OS == "ios" ]]
then
  # install pods
  cd "$BASE_DIR"/ios &&
  # run fastlane
  fastlane on_demand version:"qa" tfGroup:"$TF_GROUP";
fi
cd "$BASE_DIR" || exit

# build for android if os flag is all or android
if [[ $OS == "android" ]]
then
  # bundle for android
  yarn bundle:android &&
  cd "$BASE_DIR"/android &&
  # run fastlane
  fastlane on_demand version:"qa" psTrack:"$PS_TRACK";
fi
