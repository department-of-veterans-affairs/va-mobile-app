#!/bin/bash
# Exit script if you try to use an uninitialized variable.
set -o nounset

# Exit script if a statement returns a non-true return value.
set -o errexit

# Use the error status of the first failure, rather than that of the last item in a pipeline.
set -o pipefail

#### Help function
Help() {
  #Display help
  echo "Release branch automation script"
  echo
  echo "This script does the following:"
  echo "1. Checks the date to see if it occurs at a 2 week interval from August 4, 2021. (If this is true, then we should cut a release branch from develop"
  echo "2. Checks out the main branch, then pulls the latest tag."
  echo "3. Increments the latest tag by the minor version to get the next release version number"
  echo "4. Checks out and pulls latest develop branch"
  echo "5. Creates a new release branch with the correct name and pushes it up to the origin"
  echo
  echo "Syntax: ./release_branch.sh [-h]"
}


### Increments the part of the string
## $1: version itself
## $2: number of part: 0 – major, 1 – minor, 2 – patch

increment_version() {
  local delimiter=.
  local array=($(echo "$1" | tr $delimiter '\n'))
  array[$2]=$((array[$2]+1))
  if [ "$2" -lt 2 ]; then array[2]=0; fi
  if [ "$2" -lt 1 ]; then array[1]=0; fi
  echo $(local IFS=$delimiter ; echo "${array[*]}")
}


#### Process the options

while getopts h option
  do case "${option}" in
    h) Help; exit ;;
    *) echo "Invalid option -${option}"; exit ;;
  esac
done

# First release branch was 08-04-2021. check and see that we are at TWO WEEK interval (14 days)
if [[ $[$((($(date +%s)-$(date +%s --date "2021-08-04"))/(3600*24)))%14] == 0 ]]
then

  echo "Checking out and pulling latest from main branch"
  git checkout main &&
  git pull origin main &&

  echo "Fetching latest tag"
  # checks for latest tag on main that matches vX.Y.Z
  latest=$(git tag | sort -r --version-sort | head -n1) &&

  echo "Incrementing latest tag $latest by minor version"
  next=$(increment_version "$latest" 1) &&
  
  echo "Next version: $next"
  echo
  echo "Checking out and pulling latest from develop branch"
  git checkout develop &&
  git pull origin develop &&

  echo "Creating and pushing new release branch 'release/$next' to origin"
  git checkout -b release/"$next" &&
  git push -u origin release/"$next"

  echo "Successfully created and pushed new release branch 'release/$next' to origin"

  echo "Tag branch for Release Candidate build"
  TAG="RC-$next-$(date +%m%d%y-%H%M)"
  git tag -a "$TAG" -m "Release Candidate for $next. tagged on $(date +%m/%d/%y) at $(date +%H:%M)"
  git push origin "$TAG"

  echo "Successfully tagged for Release Candidate builds: $TAG"
  echo "Exit"
else
  echo "Not scheduled for new release branch this week. Exiting."
  exit 0
fi
