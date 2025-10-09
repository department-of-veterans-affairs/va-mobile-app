import { Dispatch, SetStateAction, useState } from 'react'

import { ParamListBase } from '@react-navigation/native'

import { useMutationState } from '@tanstack/react-query'
import { TFunction } from 'i18next'
import { DateTime } from 'luxon'
import { sortBy } from 'underscore'

import { travelPayMutationKeys } from 'api/travelPay'
import { AppointmentData, TravelPayClaimData, TravelPayClaimSummary } from 'api/types'
import { Events } from 'constants/analytics'
import { TravelClaimsScreenEntryType } from 'constants/travelPay'
import { logAnalyticsEvent } from 'utils/analytics'
import { RouteNavigationFunction } from 'utils/hooks'

export const FILTER_KEY_ALL = 'all'

export type SortOptionType = 'recent' | 'oldest'

export const SortOption: {
  Recent: SortOptionType
  Oldest: SortOptionType
} = {
  Recent: 'recent',
  Oldest: 'oldest',
}

export type CheckboxOption = {
  optionLabelKey: string
  value: string
}

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

/**
 * Navigates to the travel claims list screen from various entry points
 * @param navigateTo - The navigation function to navigate between screens
 * @param from - The entry point from which the user is navigating from
 */
export const navigateToTravelClaims = (
  navigateTo: RouteNavigationFunction<ParamListBase>,
  from: TravelClaimsScreenEntryType,
) => {
  navigateTo('TravelPayClaims', { from })
}

/** Filters the claims based on the provided filter options
 * @param claims - The list of claims
 * @param filter - The filter options to apply
 * @returns The filtered claims
 */
export const filteredClaims = (claims: Array<TravelPayClaimData>, filter: Set<string>) =>
  filter.size === 0 ? claims : claims.filter((claim) => filter.has(claim.attributes.claimStatus))

/**
 * Sorts the claims based on the provided sort option
 * @param claims - The list of claims
 * @param sortBy - The sort option to apply
 * @returns The list of claims sorted according to the sort option
 */
export const sortedClaims = (claims: Array<TravelPayClaimData>, sortOption: SortOptionType) =>
  sortBy(claims, (claim) => {
    const dateTime = new Date(claim.attributes.appointmentDateTime).getTime()
    switch (sortOption) {
      case SortOption.Recent:
        return -dateTime
      case SortOption.Oldest:
        return dateTime
      default:
        return 0
    }
  })

/**
 * Hook to manage toggling a set of filters and tracking the state of which ones are active
 *
 * @param options - Set of all available filter options
 * @param initialFilter - Set of initially selected filter options
 * @returns A tuple containing:
 *   - `selectedFilter` - Set of currently selected filter keys
 *   - `setSelectedFilter` - Setter to update the selected filters
 *   - `toggleFilter` - Toggles a specific filter on/off. When toggling FILTER_KEY_ALL,
 *     it will select everything if none/some are selected, or deselect everything if all are selected
 */
export const useFilterToggle = (
  options: Set<string>,
  initialFilter: Set<string>,
): [Set<string>, Dispatch<SetStateAction<Set<string>>>, (filterKey: string) => void] => {
  const [selectedFilter, setSelectedFilter] = useState<Set<string>>(initialFilter)

  const toggleFilter = (filterKey: string) => {
    setSelectedFilter((prevFilter) => {
      // Select or deselect everything when pressing "All"
      if (filterKey === FILTER_KEY_ALL) {
        return prevFilter.size === options.size ? new Set() : new Set([...options])
      }

      // Toggle the filter
      return prevFilter.has(filterKey)
        ? new Set([...prevFilter].filter((key) => key !== filterKey))
        : new Set([...prevFilter, filterKey])
    })
  }

  return [selectedFilter, setSelectedFilter, toggleFilter]
}

/**
 * Determine if a checkbox is checked based on the specified value and current selection
 * @param value - The value to check
 * @param options - The list of all available values
 * @param selectedValues - The set of currently selected values
 * @returns True if the value is selected, false otherwise
 */
export const isChecked = (value: string, options: Array<CheckboxOption>, selectedValues: Set<string>) => {
  if (value === FILTER_KEY_ALL) {
    const allOptions = new Set(options.map((option) => option.value))
    return selectedValues.size === allOptions.size
  }

  return selectedValues.has(value)
}

/**
 * Determine if a checkbox is in an indeterminate state based on the specified value and current selection
 * @param value - The value to check
 * @param options - The list of all available values
 * @param selectedValues - The set of currently selected values
 * @returns True if the checkbox is indeterminate, false otherwise
 */
export const isIndeterminate = (value: string, options: Array<CheckboxOption>, selectedValues: Set<string>) => {
  if (value === FILTER_KEY_ALL) {
    const allOptions = new Set(options.map((option) => option.value))
    return selectedValues.size > 0 && selectedValues.size < allOptions.size
  }

  return false
}
