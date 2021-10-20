while getopts v option
do
case "${option}"
in
v) version=${OPTARG}
esac
done

yarn install ;
cd ios ;
pod install ;
cd ../ ;
yarn env:production ;
yarn bundle:ios ;
yarn bundle:android ;
cd ios ;

bundle update fastlane ;
bundle exec fastlane release version:$version ;
cd ../android ;
bundle exec fastlane release version:$version ;

