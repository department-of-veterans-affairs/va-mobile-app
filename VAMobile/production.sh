#!/usr/bin/env bash
while getopts v:o: option
do
case "${option}"
in
v) version=${OPTARG};;
o) os=${OPTARG};;
*) ;;
esac
done

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
fastlane release version:"$version" ;
fi
cd "$BASE_DIR" || exit

if [[ -z "$os" || $os == "android" ]]
then
yarn bundle:android &&
cd "$BASE_DIR"/android &&
fastlane release version:"$version" ;
fi
