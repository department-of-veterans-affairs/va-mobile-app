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

# Operating system default and options
declare -a os_opts=(ios android)

#### Help function
Help() {
    #Display help
    echo "Build an production version of Android or iOS. This will deploy to the release staging lane for the OS"

    echo "Syntax: ./production.sh [(-o|--os)&(-v|--version))]"
    echo "options:"
    echo "o | os                REQUIRED: Operating system to build for. Choose from [ $(arrayPrint os_opts) ]"
    echo "v | version           Version name. Should conform to the regular expression /^v\d+\.\d+\.\d+/ (eg v1.1.10)"
    echo "h | help              Displays this help menu."
    echo
}

Error() {
    # print error and exit
    printf "***************************\n"
    printf "* Error: Invalid argument. Try -h for help*\n"
    printf "***************************\n"
    exit 1
}

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
    illegalArg list "$4"
}

# get options and set values
while [ $# -gt 0 ]; do
  case "$1" in
    -o|--os)
      isInArray os_opts "$2" os "$1"
      ;;
    -v|--version)
      version=$2
      if [[ ! "$version" =~ v[0-9]*\.[0-9]*\.[0-9]* ]]; then Error; fi ;;
    -h|--help)
      Help;;
    *)
  esac
  shift
  shift
done

# sanity check prints for debugging
echo OS: "$os"
echo VERSION: "$version"

BASE_DIR="$PWD"

yarn install &&
yarn env:production &&

if [[ -z "$os" || $os == "ios" ]]
then
  cd "$BASE_DIR"/ios &&
  pod install &&
  cd "$BASE_DIR" &&
  yarn bundle:ios &&
  cd "$BASE_DIR"/ios &&
  fastlane review version:"$version" ;
fi
cd "$BASE_DIR" || exit

if [[ -z "$os" || $os == "android" ]]
then
  yarn bundle:android &&
  cd "$BASE_DIR"/android &&
  fastlane review version:"$version" ;
fi
