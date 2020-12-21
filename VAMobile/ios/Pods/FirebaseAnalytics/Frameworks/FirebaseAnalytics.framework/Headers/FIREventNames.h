/// @file FIREventNames.h
///
/// Predefined event names.
///
/// An Event is an important occurrence in your app that you want to measure. You can report up to
/// 500 different types of Events per app and you can associate up to 25 unique parameters with each
/// Event type. Some common events are suggested below, but you may also choose to specify custom
/// Event types that are associated with your specific app. Each event type is identified by a
/// unique name. Event names can be up to 40 characters long, may only contain alphanumeric
/// characters and underscores ("_"), and must start with an alphabetic character. The "firebase_",
/// "google_", and "ga_" prefixes are reserved and should not be used.

#import <Foundation/Foundation.h>

/// Add Payment Info event. This event signifies that a user has submitted their payment
/// information. Note: If you supply the @c kFIRParameterValue parameter, you must also supply the
/// @c kFIRParameterCurrency parameter so that revenue metrics can be computed accurately. Params:
///
/// <ul>
///     <li>@c kFIRParameterCoupon (NSString) (optional)</li>
///     <li>@c kFIRParameterCurrency (NSString) (optional)</li>
///     <li>@c kFIRParameterItems (NSArray) (optional)</li>
///     <li>@c kFIRParameterPaymentType (NSString) (optional)</li>
///     <li>@c kFIRParameterValue (double as NSNumber) (optional)</li>
/// </ul>
static NSString *const kFIREventAddPaymentInfo NS_SWIFT_NAME(AnalyticsEventAddPaymentInfo) =
    @"add_payment_info";

/// E-Commerce Add To Cart event. This event signifies that an item(s) was added to a cart for
/// purchase. Add this event to a funnel with @c kFIREventPurchase to gauge the effectiveness of
/// your checkout process. Note: If you supply the @c kFIRParameterValue parameter, you must also
/// supply the @c kFIRParameterCurrency parameter so that revenue metrics can be computed
/// accurately. Params:
///
/// <ul>
///     <li>@c kFIRParameterCurrency (NSString) (optional)</li>
///     <li>@c kFIRParameterItems (NSArray) (optional)</li>
///     <li>@c kFIRParameterValue (double as NSNumber) (optional)</li>
/// </ul>
static NSString *const kFIREventAddToCart NS_SWIFT_NAME(AnalyticsEventAddToCart) = @"add_to_cart";

/// E-Commerce Add To Wishlist event. This event signifies that an item was added to a wishlist. Use
/// this event to identify popular gift items. Note: If you supply the @c kFIRParameterValue
/// parameter, you must also supply the @c kFIRParameterCurrency parameter so that revenue metrics
/// can be computed accurately. Params:
///
/// <ul>
///     <li>@c kFIRParameterCurrency (NSString) (optional)</li>
///     <li>@c kFIRParameterItems (NSArray) (optional)</li>
///     <li>@c kFIRParameterValue (double as NSNumber) (optional)</li>
/// </ul>
static NSString *const kFIREventAddToWishlist NS_SWIFT_NAME(AnalyticsEventAddToWishlist) =
    @"add_to_wishlist";

/// Ad Impression event. This event signifies when a user sees an ad impression. Note: If you supply
/// the @c kFIRParameterValue parameter, you must also supply the @c kFIRParameterCurrency parameter
/// so that revenue metrics can be computed accurately. Params:
///
/// <ul>
///     <li>@c kFIRParameterAdPlatform (NSString) (optional)</li>
///     <li>@c kFIRParameterAdFormat (NSString) (optional)</li>
///     <li>@c kFIRParameterAdSource (NSString) (optional)</li>
///     <li>@c kFIRParameterAdUnitName (NSString) (optional)</li>
///     <li>@c kFIRParameterCurrency (NSString) (optional)</li>
///     <li>@c kFIRParameterValue (double as NSNumber) (optional)</li>
/// </ul>
static NSString *const kFIREventAdImpression NS_SWIFT_NAME(AnalyticsEventAdImpression) =
    @"ad_impression";

/// App Open event. By logging this event when an App becomes active, developers can understand how
/// often users leave and return during the course of a Session. Although Sessions are automatically
/// reported, this event can provide further clarification around the continuous engagement of
/// app-users.
static NSString *const kFIREventAppOpen NS_SWIFT_NAME(AnalyticsEventAppOpen) = @"app_open";

/// E-Commerce Begin Checkout event. This event signifies that a user has begun the process of
/// checking out. Add this event to a funnel with your @c kFIREventPurchase event to gauge the
/// effectiveness of your checkout process. Note: If you supply the @c kFIRParameterValue parameter,
/// you must also supply the @c kFIRParameterCurrency parameter so that revenue metrics can be
/// computed accurately. Params:
///
/// <ul>
///     <li>@c kFIRParameterCoupon (NSString) (optional)</li>
///     <li>@c kFIRParameterCurrency (NSString) (optional)</li>
///     <li>@c kFIRParameterItems (NSArray) (optional)</li>
///     <li>@c kFIRParameterValue (double as NSNumber) (optional)</li>
/// </ul>
static NSString *const kFIREventBeginCheckout NS_SWIFT_NAME(AnalyticsEventBeginCheckout) =
    @"begin_checkout";

/// Campaign Detail event. Log this event to supply the referral details of a re-engagement
/// campaign. Note: you must supply at least one of the required parameters kFIRParameterSource,
/// kFIRParameterMedium or kFIRParameterCampaign. Params:
///
/// <ul>
///     <li>@c kFIRParameterSource (NSString)</li>
///     <li>@c kFIRParameterMedium (NSString)</li>
///     <li>@c kFIRParameterCampaign (NSString)</li>
///     <li>@c kFIRParameterTerm (NSString) (optional)</li>
///     <li>@c kFIRParameterContent (NSString) (optional)</li>
///     <li>@c kFIRParameterAdNetworkClickID (NSString) (optional)</li>
///     <li>@c kFIRParameterCP1 (NSString) (optional)</li>
/// </ul>
static NSString *const kFIREventCampaignDetails NS_SWIFT_NAME(AnalyticsEventCampaignDetails) =
    @"campaign_details";

/// Checkout progress. Params:
///
/// <ul>
///    <li>@c kFIRParameterCheckoutStep (unsigned 64-bit integer as NSNumber)</li>
///    <li>@c kFIRParameterCheckoutOption (NSString) (optional)</li>
/// </ul>
/// <b>This constant has been deprecated.</b>
static NSString *const kFIREventCheckoutProgress NS_SWIFT_NAME(AnalyticsEventCheckoutProgress) =
    @"checkout_progress";

/// Earn Virtual Currency event. This event tracks the awarding of virtual currency in your app. Log
/// this along with @c kFIREventSpendVirtualCurrency to better understand your virtual economy.
/// Params:
///
/// <ul>
///     <li>@c kFIRParameterVirtualCurrencyName (NSString)</li>
///     <li>@c kFIRParameterValue (signed 64-bit integer or double as NSNumber)</li>
/// </ul>
static NSString *const kFIREventEarnVirtualCurrency
    NS_SWIFT_NAME(AnalyticsEventEarnVirtualCurrency) = @"earn_virtual_currency";

/// E-Commerce Purchase event. This event signifies that an item was purchased by a user. Note:
/// This is different from the in-app purchase event, which is reported automatically for App
/// Store-based apps. Note: If you supply the @c kFIRParameterValue parameter, you must also
/// supply the @c kFIRParameterCurrency parameter so that revenue metrics can be computed
/// accurately. Params:
///
/// <ul>
///     <li>@c kFIRParameterCurrency (NSString) (optional)</li>
///     <li>@c kFIRParameterValue (double as NSNumber) (optional)</li>
///     <li>@c kFIRParameterTransactionID (NSString) (optional)</li>
///     <li>@c kFIRParameterTax (double as NSNumber) (optional)</li>
///     <li>@c kFIRParameterShipping (double as NSNumber) (optional)</li>
///     <li>@c kFIRParameterCoupon (NSString) (optional)</li>
///     <li>@c kFIRParameterLocation (NSString) (optional)</li>
///     <li>@c kFIRParameterStartDate (NSString) (optional)</li>
///     <li>@c kFIRParameterEndDate (NSString) (optional)</li>
///     <li>@c kFIRParameterNumberOfNights (signed 64-bit integer as NSNumber) (optional) for
///         hotel bookings</li>
///     <li>@c kFIRParameterNumberOfRooms (signed 64-bit integer as NSNumber) (optional) for
///         hotel bookings</li>
///     <li>@c kFIRParameterNumberOfPassengers (signed 64-bit integer as NSNumber) (optional)
///         for travel bookings</li>
///     <li>@c kFIRParameterOrigin (NSString) (optional)</li>
///     <li>@c kFIRParameterDestination (NSString) (optional)</li>
///     <li>@c kFIRParameterTravelClass (NSString) (optional) for travel bookings</li>
/// </ul>
/// <b>This constant has been deprecated. Use @c kFIREventPurchase constant instead.</b>
static NSString *const kFIREventEcommercePurchase NS_SWIFT_NAME(AnalyticsEventEcommercePurchase) =
    @"ecommerce_purchase";

/// Generate Lead event. Log this event when a lead has been generated in the app to understand the
/// efficacy of your install and re-engagement campaigns. Note: If you supply the
/// @c kFIRParameterValue parameter, you must also supply the @c kFIRParameterCurrency
/// parameter so that revenue metrics can be computed accurately. Params:
///
/// <ul>
///     <li>@c kFIRParameterCurrency (NSString) (optional)</li>
///     <li>@c kFIRParameterValue (double as NSNumber) (optional)</li>
/// </ul>
static NSString *const kFIREventGenerateLead NS_SWIFT_NAME(AnalyticsEventGenerateLead) =
    @"generate_lead";

/// Join Group event. Log this event when a user joins a group such as a guild, team or family. Use
/// this event to analyze how popular certain groups or social features are in your app. Params:
///
/// <ul>
///     <li>@c kFIRParameterGroupID (NSString)</li>
/// </ul>
static NSString *const kFIREventJoinGroup NS_SWIFT_NAME(AnalyticsEventJoinGroup) = @"join_group";

/// Level End event. Log this event when the user finishes a level. Params:
///
/// <ul>
///     <li>@c kFIRParameterLevelName (NSString)</li>
///     <li>@c kFIRParameterSuccess (NSString)</li>
/// </ul>
static NSString *const kFIREventLevelEnd NS_SWIFT_NAME(AnalyticsEventLevelEnd) = @"level_end";

/// Level Start event. Log this event when the user starts a new level. Params:
///
/// <ul>
///     <li>@c kFIRParameterLevelName (NSString)</li>
/// </ul>
static NSString *const kFIREventLevelStart NS_SWIFT_NAME(AnalyticsEventLevelStart) = @"level_start";

/// Level Up event. This event signifies that a player has leveled up in your gaming app. It can
/// help you gauge the level distribution of your userbase and help you identify certain levels that
/// are difficult to pass. Params:
///
/// <ul>
///     <li>@c kFIRParameterLevel (signed 64-bit integer as NSNumber)</li>
///     <li>@c kFIRParameterCharacter (NSString) (optional)</li>
/// </ul>
static NSString *const kFIREventLevelUp NS_SWIFT_NAME(AnalyticsEventLevelUp) = @"level_up";

/// Login event. Apps with a login feature can report this event to signify that a user has logged
/// in.
static NSString *const kFIREventLogin NS_SWIFT_NAME(AnalyticsEventLogin) = @"login";

/// Post Score event. Log this event when the user posts a score in your gaming app. This event can
/// help you understand how users are actually performing in your game and it can help you correlate
/// high scores with certain audiences or behaviors. Params:
///
/// <ul>
///     <li>@c kFIRParameterScore (signed 64-bit integer as NSNumber)</li>
///     <li>@c kFIRParameterLevel (signed 64-bit integer as NSNumber) (optional)</li>
///     <li>@c kFIRParameterCharacter (NSString) (optional)</li>
/// </ul>
static NSString *const kFIREventPostScore NS_SWIFT_NAME(AnalyticsEventPostScore) = @"post_score";

/// Present Offer event. This event signifies that the app has presented a purchase offer to a user.
/// Add this event to a funnel with the kFIREventAddToCart and kFIREventEcommercePurchase to gauge
/// your conversion process. Note: If you supply the @c kFIRParameterValue parameter, you must
/// also supply the @c kFIRParameterCurrency parameter so that revenue metrics can be computed
/// accurately. Params:
///
/// <ul>
///     <li>@c kFIRParameterQuantity (signed 64-bit integer as NSNumber)</li>
///     <li>@c kFIRParameterItemID (NSString)</li>
///     <li>@c kFIRParameterItemName (NSString)</li>
///     <li>@c kFIRParameterItemCategory (NSString)</li>
///     <li>@c kFIRParameterItemLocationID (NSString) (optional)</li>
///     <li>@c kFIRParameterPrice (double as NSNumber) (optional)</li>
///     <li>@c kFIRParameterCurrency (NSString) (optional)</li>
///     <li>@c kFIRParameterValue (double as NSNumber) (optional)</li>
/// </ul>
/// <b>This constant has been deprecated. Use @c kFIREventViewPromotion constant instead.</b>
static NSString *const kFIREventPresentOffer NS_SWIFT_NAME(AnalyticsEventPresentOffer) =
    @"present_offer";

/// E-Commerce Purchase Refund event. This event signifies that an item purchase was refunded.
/// Note: If you supply the @c kFIRParameterValue parameter, you must also supply the
/// @c kFIRParameterCurrency parameter so that revenue metrics can be computed accurately.
/// Params:
///
/// <ul>
///     <li>@c kFIRParameterCurrency (NSString) (optional)</li>
///     <li>@c kFIRParameterValue (double as NSNumber) (optional)</li>
///     <li>@c kFIRParameterTransactionID (NSString) (optional)</li>
/// </ul>
/// <b>This constant has been deprecated. Use @c kFIREventRefund constant instead.</b>
static NSString *const kFIREventPurchaseRefund NS_SWIFT_NAME(AnalyticsEventPurchaseRefund) =
    @"purchase_refund";

/// E-Commerce Remove from Cart event. This event signifies that an item(s) was removed from a cart.
/// Note: If you supply the @c kFIRParameterValue parameter, you must also supply the @c
/// kFIRParameterCurrency parameter so that revenue metrics can be computed accurately. Params:
///
/// <ul>
///     <li>@c kFIRParameterCurrency (NSString) (optional)</li>
///     <li>@c kFIRParameterItems (NSArray) (optional)</li>
///     <li>@c kFIRParameterValue (double as NSNumber) (optional)</li>
/// </ul>
static NSString *const kFIREventRemoveFromCart NS_SWIFT_NAME(AnalyticsEventRemoveFromCart) =
    @"remove_from_cart";

/// Screen View event. This event signifies a screen view. Use this when a screen transition occurs.
/// This event can be logged irrespective of whether automatic screen tracking is enabled. Params:
///
/// <ul>
///     <li>@c kFIRParameterScreenClass (NSString) (optional)</li>
///     <li>@c kFIRParameterScreenName (NSString) (optional)</li>
/// </ul>
static NSString *const kFIREventScreenView NS_SWIFT_NAME(AnalyticsEventScreenView) = @"screen_view";

/// Search event. Apps that support search features can use this event to contextualize search
/// operations by supplying the appropriate, corresponding parameters. This event can help you
/// identify the most popular content in your app. Params:
///
/// <ul>
///     <li>@c kFIRParameterSearchTerm (NSString)</li>
///     <li>@c kFIRParameterStartDate (NSString) (optional)</li>
///     <li>@c kFIRParameterEndDate (NSString) (optional)</li>
///     <li>@c kFIRParameterNumberOfNights (signed 64-bit integer as NSNumber) (optional) for
///         hotel bookings</li>
///     <li>@c kFIRParameterNumberOfRooms (signed 64-bit integer as NSNumber) (optional) for
///         hotel bookings</li>
///     <li>@c kFIRParameterNumberOfPassengers (signed 64-bit integer as NSNumber) (optional)
///         for travel bookings</li>
///     <li>@c kFIRParameterOrigin (NSString) (optional)</li>
///     <li>@c kFIRParameterDestination (NSString) (optional)</li>
///     <li>@c kFIRParameterTravelClass (NSString) (optional) for travel bookings</li>
/// </ul>
static NSString *const kFIREventSearch NS_SWIFT_NAME(AnalyticsEventSearch) = @"search";

/// Select Content event. This general purpose event signifies that a user has selected some content
/// of a certain type in an app. The content can be any object in your app. This event can help you
/// identify popular content and categories of content in your app. Params:
///
/// <ul>
///     <li>@c kFIRParameterContentType (NSString)</li>
///     <li>@c kFIRParameterItemID (NSString)</li>
/// </ul>
static NSString *const kFIREventSelectContent NS_SWIFT_NAME(AnalyticsEventSelectContent) =
    @"select_content";

/// Set checkout option. Params:
///
/// <ul>
///    <li>@c kFIRParameterCheckoutStep (unsigned 64-bit integer as NSNumber)</li>
///    <li>@c kFIRParameterCheckoutOption (NSString)</li>
/// </ul>
/// <b>This constant has been deprecated.</b>
static NSString *const kFIREventSetCheckoutOption NS_SWIFT_NAME(AnalyticsEventSetCheckoutOption) =
    @"set_checkout_option";

/// Share event. Apps with social features can log the Share event to identify the most viral
/// content. Params:
///
/// <ul>
///     <li>@c kFIRParameterContentType (NSString)</li>
///     <li>@c kFIRParameterItemID (NSString)</li>
/// </ul>
static NSString *const kFIREventShare NS_SWIFT_NAME(AnalyticsEventShare) = @"share";

/// Sign Up event. This event indicates that a user has signed up for an account in your app. The
/// parameter signifies the method by which the user signed up. Use this event to understand the
/// different behaviors between logged in and logged out users. Params:
///
/// <ul>
///     <li>@c kFIRParameterSignUpMethod (NSString)</li>
/// </ul>
static NSString *const kFIREventSignUp NS_SWIFT_NAME(AnalyticsEventSignUp) = @"sign_up";

/// Spend Virtual Currency event. This event tracks the sale of virtual goods in your app and can
/// help you identify which virtual goods are the most popular objects of purchase. Params:
///
/// <ul>
///     <li>@c kFIRParameterItemName (NSString)</li>
///     <li>@c kFIRParameterVirtualCurrencyName (NSString)</li>
///     <li>@c kFIRParameterValue (signed 64-bit integer or double as NSNumber)</li>
/// </ul>
static NSString *const kFIREventSpendVirtualCurrency
    NS_SWIFT_NAME(AnalyticsEventSpendVirtualCurrency) = @"spend_virtual_currency";

/// Tutorial Begin event. This event signifies the start of the on-boarding process in your app. Use
/// this in a funnel with kFIREventTutorialComplete to understand how many users complete this
/// process and move on to the full app experience.
static NSString *const kFIREventTutorialBegin NS_SWIFT_NAME(AnalyticsEventTutorialBegin) =
    @"tutorial_begin";

/// Tutorial End event. Use this event to signify the user's completion of your app's on-boarding
/// process. Add this to a funnel with kFIREventTutorialBegin to gauge the completion rate of your
/// on-boarding process.
static NSString *const kFIREventTutorialComplete NS_SWIFT_NAME(AnalyticsEventTutorialComplete) =
    @"tutorial_complete";

/// Unlock Achievement event. Log this event when the user has unlocked an achievement in your
/// game. Since achievements generally represent the breadth of a gaming experience, this event can
/// help you understand how many users are experiencing all that your game has to offer. Params:
///
/// <ul>
///     <li>@c kFIRParameterAchievementID (NSString)</li>
/// </ul>
static NSString *const kFIREventUnlockAchievement NS_SWIFT_NAME(AnalyticsEventUnlockAchievement) =
    @"unlock_achievement";

/// View Item event. This event signifies that a user has viewed an item. Use the appropriate
/// parameters to contextualize the event. Use this event to discover the most popular items viewed
/// in your app. Note: If you supply the @c kFIRParameterValue parameter, you must also supply the
/// @c kFIRParameterCurrency parameter so that revenue metrics can be computed accurately. Params:
///
/// <ul>
///     <li>@c kFIRParameterCurrency (NSString) (optional)</li>
///     <li>@c kFIRParameterItems (NSArray) (optional)</li>
///     <li>@c kFIRParameterValue (double as NSNumber) (optional)</li>
/// </ul>
static NSString *const kFIREventViewItem NS_SWIFT_NAME(AnalyticsEventViewItem) = @"view_item";

/// View Item List event. Log this event when a user sees a list of items or offerings. Params:
///
/// <ul>
///     <li>@c kFIRParameterItems (NSArray) (optional)</li>
///     <li>@c kFIRParameterItemListID (NSString) (optional)</li>
///     <li>@c kFIRParameterItemListName (NSString) (optional)</li>
/// </ul>
static NSString *const kFIREventViewItemList NS_SWIFT_NAME(AnalyticsEventViewItemList) =
    @"view_item_list";

/// View Search Results event. Log this event when the user has been presented with the results of a
/// search. Params:
///
/// <ul>
///     <li>@c kFIRParameterSearchTerm (NSString)</li>
/// </ul>
static NSString *const kFIREventViewSearchResults NS_SWIFT_NAME(AnalyticsEventViewSearchResults) =
    @"view_search_results";

/// Add Shipping Info event. This event signifies that a user has submitted their shipping
/// information. Note: If you supply the @c kFIRParameterValue parameter, you must also supply the
/// @c kFIRParameterCurrency parameter so that revenue metrics can be computed accurately. Params:
///
/// <ul>
///     <li>@c kFIRParameterCoupon (NSString) (optional)</li>
///     <li>@c kFIRParameterCurrency (NSString) (optional)</li>
///     <li>@c kFIRParameterItems (NSArray) (optional)</li>
///     <li>@c kFIRParameterShippingTier (NSString) (optional)</li>
///     <li>@c kFIRParameterValue (double as NSNumber) (optional)</li>
/// </ul>
static NSString *const kFIREventAddShippingInfo NS_SWIFT_NAME(AnalyticsEventAddShippingInfo) =
    @"add_shipping_info";

/// E-Commerce Purchase event. This event signifies that an item(s) was purchased by a user. Note:
/// This is different from the in-app purchase event, which is reported automatically for App
/// Store-based apps. Note: If you supply the @c kFIRParameterValue parameter, you must also supply
/// the @c kFIRParameterCurrency parameter so that revenue metrics can be computed accurately.
/// Params:
///
/// <ul>
///     <li>@c kFIRParameterAffiliation (NSString) (optional)</li>
///     <li>@c kFIRParameterCoupon (NSString) (optional)</li>
///     <li>@c kFIRParameterCurrency (NSString) (optional)</li>
///     <li>@c kFIRParameterItems (NSArray) (optional)</li>
///     <li>@c kFIRParameterShipping (double as NSNumber) (optional)</li>
///     <li>@c kFIRParameterTax (double as NSNumber) (optional)</li>
///     <li>@c kFIRParameterTransactionID (NSString) (optional)</li>
///     <li>@c kFIRParameterValue (double as NSNumber) (optional)</li>
/// </ul>
static NSString *const kFIREventPurchase NS_SWIFT_NAME(AnalyticsEventPurchase) = @"purchase";

/// E-Commerce Refund event. This event signifies that a refund was issued. Note: If you supply the
/// @c kFIRParameterValue parameter, you must also supply the @c kFIRParameterCurrency parameter so
/// that revenue metrics can be computed accurately. Params:
///
/// <ul>
///     <li>@c kFIRParameterAffiliation (NSString) (optional)</li>
///     <li>@c kFIRParameterCoupon (NSString) (optional)</li>
///     <li>@c kFIRParameterCurrency (NSString) (optional)</li>
///     <li>@c kFIRParameterItems (NSArray) (optional)</li>
///     <li>@c kFIRParameterShipping (double as NSNumber) (optional)</li>
///     <li>@c kFIRParameterTax (double as NSNumber) (optional)</li>
///     <li>@c kFIRParameterTransactionID (NSString) (optional)</li>
///     <li>@c kFIRParameterValue (double as NSNumber) (optional)</li>
/// </ul>
static NSString *const kFIREventRefund NS_SWIFT_NAME(AnalyticsEventRefund) = @"refund";

/// Select Item event. This event signifies that an item was selected by a user from a list. Use the
/// appropriate parameters to contextualize the event. Use this event to discover the most popular
/// items selected. Params:
///
/// <ul>
///     <li>@c kFIRParameterItems (NSArray) (optional)</li>
///     <li>@c kFIRParameterItemListID (NSString) (optional)</li>
///     <li>@c kFIRParameterItemListName (NSString) (optional)</li>
/// </ul>
static NSString *const kFIREventSelectItem NS_SWIFT_NAME(AnalyticsEventSelectItem) = @"select_item";

/// Select promotion event. This event signifies that a user has selected a promotion offer. Use the
/// appropriate parameters to contextualize the event, such as the item(s) for which the promotion
/// applies. Params:
///
/// <ul>
///     <li>@c kFIRParameterCreativeName (NSString) (optional)</li>
///     <li>@c kFIRParameterCreativeSlot (NSString) (optional)</li>
///     <li>@c kFIRParameterItems (NSArray) (optional)</li>
///     <li>@c kFIRParameterLocationID (NSString) (optional)</li>
///     <li>@c kFIRParameterPromotionID (NSString) (optional)</li>
///     <li>@c kFIRParameterPromotionName (NSString) (optional)</li>
/// </ul>
static NSString *const kFIREventSelectPromotion NS_SWIFT_NAME(AnalyticsEventSelectPromotion) =
    @"select_promotion";

/// E-commerce View Cart event. This event signifies that a user has viewed their cart. Use this to
/// analyze your purchase funnel. Note: If you supply the @c kFIRParameterValue parameter, you must
/// also supply the @c kFIRParameterCurrency parameter so that revenue metrics can be computed
/// accurately. Params:
///
/// <ul>
///     <li>@c kFIRParameterCurrency (NSString) (optional)</li>
///     <li>@c kFIRParameterItems (NSArray) (optional)</li>
///     <li>@c kFIRParameterValue (double as NSNumber) (optional)</li>
/// </ul>
static NSString *const kFIREventViewCart NS_SWIFT_NAME(AnalyticsEventViewCart) = @"view_cart";

/// View Promotion event. This event signifies that a promotion was shown to a user. Add this event
/// to a funnel with the @c kFIREventAddToCart and @c kFIREventPurchase to gauge your conversion
/// process. Params:
///
/// <ul>
///     <li>@c kFIRParameterCreativeName (NSString) (optional)</li>
///     <li>@c kFIRParameterCreativeSlot (NSString) (optional)</li>
///     <li>@c kFIRParameterItems (NSArray) (optional)</li>
///     <li>@c kFIRParameterLocationID (NSString) (optional)</li>
///     <li>@c kFIRParameterPromotionID (NSString) (optional)</li>
///     <li>@c kFIRParameterPromotionName (NSString) (optional)</li>
/// </ul>
static NSString *const kFIREventViewPromotion NS_SWIFT_NAME(AnalyticsEventViewPromotion) =
    @"view_promotion";
