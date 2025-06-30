import { ParamListBase } from '@react-navigation/native'

import { TFunction } from 'i18next'

import { AppointmentData, TravelPayClaimSummary } from 'api/types'
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
          onSecondaryContentButtonPress: () => navigateTo('ErrorScreen', { error: 'unsupportedType' }),
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
