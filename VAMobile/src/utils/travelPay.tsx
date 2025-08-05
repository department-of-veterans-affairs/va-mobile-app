import { createContext, useContext } from 'react'

import { ParamListBase } from '@react-navigation/native'

import { useMutationState } from '@tanstack/react-query'
import { TFunction } from 'i18next'

import { travelPayMutationKeys } from 'api/travelPay'
import { AppointmentData, TravelPayClaimSummary, UserContactInformation } from 'api/types'
import { Events } from 'constants/analytics'
import { logAnalyticsEvent } from 'utils/analytics'
import getEnv from 'utils/env'
import { RouteNavigationFunction } from 'utils/hooks'

const { LINK_URL_TRAVEL_PAY_FILE_CLAIM_BTSSS } = getEnv()

/**
 * Strips the timezone offset from a datetime string
 * @param datetimeString - The datetime string to strip the timezone offset from
 * @returns The datetime string with the timezone offset stripped
 */
export function stripTZOffset(datetimeString: string) {
  // We need the local time with no TZ indicators for the external API
  // There are 19 characters in the string required by the external API
  // i.e. 2024-06-25T08:00:00
  return datetimeString.slice(0, 19)
}

/**
 * Appends the claim data to the appointment
 * @param appointment - The appointment to append the claim data to
 * @param claimData - The claim data to append to the appointment
 * @returns The appointment with the claim data appended
 */
export function appendClaimDataToAppointment(
  appointment: AppointmentData,
  claimData?: TravelPayClaimSummary,
): AppointmentData {
  const newAppointment = {
    ...appointment,
    attributes: {
      ...appointment.attributes,
      travelPayClaim: {
        metadata: {
          status: 200,
          message: 'Data retrieved successfully',
          success: true,
        },
        claim: claimData,
      },
    },
  }

  return newAppointment
}

/**
 * Returns the subtask props for displaying the header help button
 * @param t - The translation function
 * @param navigateTo - The navigation function
 * @returns The props for the help button in the header
 */
export const getTravelPayHelpSubtaskProps = (t: TFunction, navigateTo: RouteNavigationFunction<ParamListBase>) => {
  return {
    rightButtonText: t('help'),
    rightButtonTestID: 'rightHelpTestID',
    onRightButtonPress: () => navigateTo('TravelClaimHelpScreen'),
    rightIconProps: {
      name: 'Help' as const,
      fill: 'default',
    },
  }
}

/**
 * Returns common subtask props for travel pay screens including navigation buttons and help functionality
 * @param t - The translation function for internationalization
 * @param navigateTo - The navigation function to navigate between screens
 * @param previousStepScreen - The screen name to navigate to when the back button is pressed
 * @param nextStepScreen - Optional screen name to navigate to when the primary button is pressed. If provided, adds a "yes" button
 * @param hasErrorScreen - Whether to include error handling props with a "no" button that navigates to ErrorScreen. Defaults to true
 * @returns Object containing props for subtask screen including help button, back button, and conditionally error/next step buttons
 */
export const getCommonSubtaskProps = (
  t: TFunction,
  navigateTo: RouteNavigationFunction<ParamListBase>,
  previousStepScreen: string,
  nextStepScreen?: string,
  hasErrorScreen: boolean = true,
) => {
  const helpProps = getTravelPayHelpSubtaskProps(t, navigateTo)
  const props = {
    ...helpProps,
    leftButtonText: t('back'),
    onLeftButtonPress: () => navigateTo(previousStepScreen),
    leftButtonTestID: 'leftBackTestID',
    ...(hasErrorScreen
      ? {
          secondaryContentButtonText: t('no'),
          onSecondaryContentButtonPress: () => {
            logAnalyticsEvent(Events.vama_smoc_error('unsupportedType'))
            navigateTo('SMOCErrorScreen', { error: 'unsupportedType' })
          },
        }
      : {}),
  }

  if (nextStepScreen) {
    return {
      ...props,
      primaryContentButtonText: t('yes'),
      primaryButtonTestID: 'yesTestID',
      onPrimaryContentButtonPress: () => navigateTo(nextStepScreen),
    }
  }

  return props
}

/**
 * Navigates to the travel pay website in a authenticated webview
 * @param t - The translation function
 * @param navigateTo - The navigation function
 */
export const navigateToTravelPayWebsite = (t: TFunction, navigateTo: RouteNavigationFunction<ParamListBase>) => {
  logAnalyticsEvent(Events.vama_webview(LINK_URL_TRAVEL_PAY_FILE_CLAIM_BTSSS))
  navigateTo('Webview', {
    url: LINK_URL_TRAVEL_PAY_FILE_CLAIM_BTSSS,
    displayTitle: t('travelPay.webview.fileForTravelPay.title'),
    loadingMessage: t('loading.vaWebsite'),
    useSSO: true,
  })
}

export const useTravelClaimSubmissionMutationState = (appointmentId: string) => {
  const [mutationState] = useMutationState({
    filters: { mutationKey: [travelPayMutationKeys.submitClaim, appointmentId] },
  })

  return mutationState
}

export type TravelPayContextValue = {
  /**
   * The appointment for which the user is filing a travel pay claim.
   */
  appointment: AppointmentData
  /**
   * Whether the user has checked the certification/acknowledgement checkbox on
   * the Review Claim screen indicating they agree with the penalty statement.
   */
  penaltyStatementAccepted: boolean
  /**
   * Setter to update {@link TravelPayContextValue.penaltyStatementAccepted}. Typically
   * invoked when the user toggles the review-screen checkbox to agree to the penalty statement.
   */
  setPenaltyStatementAccepted: (penaltyStatementAccepted: boolean) => void
  /**
   * Flag indicating the penalty statement checkbox is required but has not been selected.
   */
  penaltyStatementError: boolean
  /**
   * Fires the network request that submits the travel pay claim for the current
   * appointment. Also handles navigation to the success or error screens based
   * on the result.
   */
  submitTravelClaim: () => void
  /**
   * True while the claim is actively being submitted; used to show loading
   * indicators and disable duplicate submissions.
   */
  submittingTravelClaim: boolean
  /**
   * The veteran’s contact information (address, phone, etc.) fetched from the
   * backend. Optional because the data may still be loading when the context is
   * first created or the user has not yet provided their contact information.
   */
  userContactInformation?: UserContactInformation
  /**
   * Initiates the SMOC (Simple Mileage Only Claim) flow by navigating to the
   * mileage entry screen and marking the start time for analytics.
   */
  startSmocFlow: () => void
}

/**
 * React context that provides shared state and actions for the **Submit Travel Pay**
 * flow.
 *
 * @remarks The context value shape is described by {@link TravelPayContextValue}.
 * The context is created with a placeholder (empty object cast to that type) so
 * that it can be safely imported before the real value is supplied by
 * `TravelPayContextProvider`.
 *
 * Components should wrap their subtree with `TravelPayContextProvider` (located
 * in `SubmitTravelPayFlowSteps/components`) to supply the actual value.
 */
export const TravelPayContext = createContext<TravelPayContextValue>({} as TravelPayContextValue)

/**
 * React hook that returns the current value of {@link TravelPayContext}.
 *
 * @returns The current {@link TravelPayContextValue} provided higher in the
 * component tree.
 *
 * @example
 * ```tsx
 * const { appointment, startSmocFlow } = useTravelPayContext();
 * ```
 */
export const useTravelPayContext = () => useContext(TravelPayContext)
