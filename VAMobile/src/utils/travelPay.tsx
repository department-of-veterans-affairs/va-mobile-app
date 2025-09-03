import { ParamListBase } from '@react-navigation/native'

import { useMutationState } from '@tanstack/react-query'
import { TFunction } from 'i18next'
import { DateTime } from 'luxon'

import { travelPayMutationKeys } from 'api/travelPay'
import { AppointmentData, TravelPayClaimSummary } from 'api/types'
import { Events } from 'constants/analytics'
import { TimeFrameType, TimeFrameTypeConstants } from 'constants/timeframes'
import { logAnalyticsEvent } from 'utils/analytics'
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
 * Creates a complete mapping of all time frame types to their corresponding date ranges.
 * Each date range contains DateTime objects representing the start and end boundaries
 * for filtering travel pay claims by time period.
 *
 * @returns A record mapping each TimeFrameTypeConstant to an object containing:
 *   - startDate: DateTime object marking the beginning of the time period
 *   - endDate: DateTime object marking the end of the time period
 *
 * @example
 * ```typescript
 * const dateRanges = createTimeFrameDateRangeMap();
 * const pastThreeMonthsRange = dateRanges[TimeFrameTypeConstants.PAST_THREE_MONTHS];
 * console.log(pastThreeMonthsRange.startDate.toISO()); // "2024-01-15T00:00:00.000-05:00"
 * ```
 */
export const createTimeFrameDateRangeMap = () => {
  const todaysDate = DateTime.local()

  const futureDate = todaysDate.plus({ days: 390 })

  const fiveMonthsEarlier = todaysDate.minus({ months: 5 }).startOf('month').startOf('day')
  const threeMonthsEarlier = todaysDate.minus({ months: 3 })

  const eightMonthsEarlier = todaysDate.minus({ months: 8 }).startOf('month').startOf('day')
  const sixMonthsEarlier = todaysDate.minus({ months: 6 }).endOf('month').endOf('day')

  const elevenMonthsEarlier = todaysDate.minus({ months: 11 }).startOf('month').startOf('day')
  const nineMonthsEarlier = todaysDate.minus({ months: 9 }).endOf('month').endOf('day')

  const fourteenMonthsEarlier = todaysDate.minus({ months: 14 }).startOf('month').startOf('day')
  const twelveMonthsEarlier = todaysDate.minus({ months: 12 }).endOf('month').endOf('day')

  const firstDayCurrentYear = todaysDate.set({ month: 1, day: 1, hour: 0, minute: 0, millisecond: 0 })

  const lastYearDateTime = todaysDate.minus({ years: 1 })
  const firstDayLastYear = lastYearDateTime.set({ month: 1, day: 1, hour: 0, minute: 0, millisecond: 0 })
  const lastDayLastYear = lastYearDateTime.set({ month: 12, day: 31, hour: 23, minute: 59, millisecond: 999 })

  return {
    [TimeFrameTypeConstants.UPCOMING]: {
      startDate: todaysDate.startOf('day'),
      endDate: futureDate.endOf('day'),
    },
    [TimeFrameTypeConstants.PAST_THREE_MONTHS]: {
      startDate: threeMonthsEarlier.startOf('day'),
      endDate: todaysDate.endOf('day'),
    },
    [TimeFrameTypeConstants.PAST_FIVE_TO_THREE_MONTHS]: {
      startDate: fiveMonthsEarlier.startOf('day'),
      endDate: threeMonthsEarlier,
    },
    [TimeFrameTypeConstants.PAST_EIGHT_TO_SIX_MONTHS]: {
      startDate: eightMonthsEarlier.startOf('day'),
      endDate: sixMonthsEarlier,
    },
    [TimeFrameTypeConstants.PAST_ELEVEN_TO_NINE_MONTHS]: {
      startDate: elevenMonthsEarlier.startOf('day'),
      endDate: nineMonthsEarlier,
    },
    [TimeFrameTypeConstants.PAST_FOURTEEN_TO_TWELVE_MONTHS]: {
      startDate: fourteenMonthsEarlier.startOf('day'),
      endDate: twelveMonthsEarlier,
    },
    [TimeFrameTypeConstants.PAST_ALL_CURRENT_YEAR]: {
      startDate: firstDayCurrentYear,
      endDate: todaysDate.endOf('day'),
    },
    [TimeFrameTypeConstants.PAST_ALL_LAST_YEAR]: {
      startDate: firstDayLastYear,
      endDate: lastDayLastYear,
    },
  }
}

/**
 * Retrieves the date range for a specific time frame type and converts it to ISO string format.
 * This function is commonly used for API calls that require date ranges as strings.
 *
 * @param timeFrameType - The time frame type to get the date range for
 * @returns An object containing startDate and endDate as ISO strings
 *
 * @example
 * ```typescript
 * const range = getDateRangeFromTimeFrame(TimeFrameTypeConstants.PAST_THREE_MONTHS);
 * console.log(range); // { startDate: "2024-01-15T00:00:00.000-05:00", endDate: "2024-04-15T23:59:59.999-04:00" }
 * ```
 */
export const getDateRangeFromTimeFrame = (timeFrameType: TimeFrameType) => {
  const dateRange = createTimeFrameDateRangeMap()[timeFrameType]

  return {
    startDate: dateRange.startDate.toISO(),
    endDate: dateRange.endDate.toISO(),
  }
}
