# Release issues

The automated release process works well a vast majority of the time but occasionally there are issues that may require some manual intervention. These issues can be caused by either upstream issues with the app stores or due to issues with our build. This page is meant to document some of the issues we may run into with our releases and how to resolve them.

## Re-releasing a failed build
Occasionally, a build may fail for one reason or another, or we may determine that we want to resubmit a build. In order to do this, we need to re-trigger the [Release Build](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/Engineering/DevOps/Automation%20Code%20Docs/GitHub%20Actions/BuildReleaseWorkflows#release-build-release_build) workflow. This workflow is triggered by tagging the release branch with a `vX.X.X` tag. Since this tag exists already, follow the steps below to re-tag a branch and retrigger the build. Keep in mind that the releases for both platforms are tied together in the same workflow, so following these steps will re-run the release for both iOS and Android.


1. Determine the version number of the build you want to rebuild (vX.X.X)
1. If possible, remove any pending versions for review
   1. [App Store Connect](https://appstoreconnect.apple.com/apps/1559609596/distribution)
   1. [Google Play Console](https://play.google.com/console/u/0/developers/7507611851470273082/app/4974294731909201030/releases/overview)
1. Make any changes necessary to the corresponding `release/vX.X.X` branch or have an FE engineer do so
1. Since the `vX.X.X` tag exists already from the previous build attempt, we need to delete the tag, both locally and remotely
    1. Delete the local tag: `git tag --delete <vX.X.X>`
    1. Delete the remote tag: `git push --delete origin <vX.X.X>`
    1. Checkout the `release/vX.X.X` branch
    1. Run `git pull` to ensure you have the latest changes
    1. Tag the branch with the version we're trying to release: `git tag -a vX.X.X -m vX.X.X`
    1. Push the tag `git push origin vX.X.X`
1. Confirm that the [Release Build](https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/release_build.yml) has been retriggered
1. Upon successful build, check the corresponding App Store console to confirm that the build is present and has been submitted for review


## App Store screenshot failure
Occasionally the uploading of screenshots to the iOS App Store will fail due to timeout. A recent fastlane version update included some optmizations to fix this but it's possible it can occur again. Screenshots are uploaded _after_ a successful build has already been uploaded to App Store Connect. Sometimes we can fix the screenshots manually in App Store connect. To do so:
1. Go to the pending release in [App Store Connect](https://appstoreconnect.apple.com/apps/1559609596/distribution)
1. On the Distribution tab, you should see the "iOS Previews and Screenshots" section
1. For each screen size and device:
    1. Remove any failed screenshots. They usually appear as blank with no image preview
    1. Check if there is a button in the top right that allows you to re-submit the app for review. 
        1. If not, you will likely need to re-release the entire build by following the steps for "Re-releasing a failed build" instead
        1. If so, continue with the next steps
    1. Comparing it to the screenshots in the `release/vX.X.X` branch, check the order and upload any missing screenshots
1. Re-submit the app for review
