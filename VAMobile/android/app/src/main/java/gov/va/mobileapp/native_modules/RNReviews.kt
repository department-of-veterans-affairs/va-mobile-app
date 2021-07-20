package gov.va.mobileapp.native_modules

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.google.android.play.core.review.ReviewManagerFactory

class RNReviews(val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "RNReviews"
    private val manager = ReviewManagerFactory.create(reactContext)

    @ReactMethod
    fun requestReview(promise: Promise) {
        manager.requestReviewFlow().addOnCompleteListener{ task ->
            if(task.isSuccessful) {
                reactContext.currentActivity?.run {
                    // empty on complete because the task result doesnt tell us anything
                    // https://developer.android.com/guide/playcore/in-app-review/kotlin-java
                    manager.launchReviewFlow(this, task.result).addOnCompleteListener{_ ->
                        promise.resolve(true)
                    }
                } ?: promise.resolve(true)
            } else {
                // always resolve true since we don't know if the error is because the review flow is within a time window form the last request
                promise.resolve(true)
            }
        }
    }

}