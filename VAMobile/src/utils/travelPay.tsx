import { ParamListBase } from '@react-navigation/native'

import { useMutationState } from '@tanstack/react-query'
import { TFunction } from 'i18next'
import { DateTime } from 'luxon'

import { travelPayMutationKeys } from 'api/travelPay'
import { AppointmentData, TravelPayClaimDocument, TravelPayClaimSummary } from 'api/types'
import { DefaultListItemObj, TextLineWithIconProps } from 'components'
import { Events } from 'constants/analytics'
import { VATheme, VATypographyThemeVariants } from 'styles/theme'
import { logAnalyticsEvent } from 'utils/analytics'
import { getA11yLabelText } from 'utils/common'
import { RouteNavigationFunction } from 'utils/hooks'

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

export const useTravelClaimSubmissionMutationState = (appointmentId: string) => {
  const [mutationState] = useMutationState({
    filters: { mutationKey: [travelPayMutationKeys.submitClaim, appointmentId] },
  })

  return mutationState
}

/**
 * Logs the time taken for the SMOC flow
 * @param smocFlowStartDate - The start time when the user presses the continue button
 */
export const logSMOCTimeTaken = (smocFlowStartDate?: string) => {
  if (smocFlowStartDate) {
    const totalTime = DateTime.now().diff(DateTime.fromISO(smocFlowStartDate)).toMillis()
    logAnalyticsEvent(Events.vama_smoc_time_taken(totalTime))
  }
}

// ============================================================================
// Travel Pay Document Helpers
// ============================================================================

/**
 * Determines the document type based on filename patterns
 * Used for analytics tracking
 */
export const getDocumentType = (filename: string): string => {
  if (!filename) {
    return 'unknown'
  }
  if (filename.includes('Rejection Letter')) {
    return 'rejection_letter'
  }
  if (filename.includes('Decision Letter')) {
    return 'decision_letter'
  }
  return 'user_submitted'
}

/**
 * Helper function to create a document list item
 */
export const createTravelPayDocumentListItem = (
  document: TravelPayClaimDocument,
  claimId: string,
  claimStatus: string,
  onDocumentPress: (docId: string, filename: string) => void,
  theme: VATheme,
  t: TFunction,
  linkText?: string,
): DefaultListItemObj => {
  const handlePress = () => {
    // Log analytics before triggering download
    const documentType = getDocumentType(document.filename)
    logAnalyticsEvent(Events.vama_travel_pay_doc_dl(claimId, claimStatus, documentType, document.filename))
    onDocumentPress(document.documentId, document.filename)
  }

  const variant = 'MobileBodyBold' as keyof VATypographyThemeVariants
  const textLines: Array<TextLineWithIconProps> = [
    {
      text: linkText || document.filename,
      variant,
      iconProps: {
        name: 'Description',
        width: 24,
        height: 24,
        fill: theme.colors.text.primary,
      },
    },
  ]

  return {
    textLines,
    onPress: handlePress,
    testId: getA11yLabelText(textLines),
    a11yHintText: t('travelPay.claimDetails.document.downloadDecisionLetter'),
  }
}
