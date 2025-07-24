import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack'

import { map } from 'underscore'

import { useLabsAndTests } from 'api/labsAndTests/getLabsAndTests'
import { LabsAndTests } from 'api/types'
import {
  Box,
  DefaultList,
  DefaultListItemObj,
  ErrorComponent,
  FeatureLandingTemplate,
  LoadingComponent,
  Pagination,
  PaginationProps,
  TextLine,
  TextView,
  VAModalPicker,
} from 'components'
import { VAScrollViewProps } from 'components/VAScrollView'
import { Events } from 'constants/analytics'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { NAMESPACE } from 'constants/namespaces'
import { TimeFrameDropDownItem, TimeFrameTypeConstants } from 'constants/timeframes'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import NoLabsAndTestsRecords from 'screens/HealthScreen/LabsAndTests//NoLabsAndTestsRecords/NoLabsAndTestsRecords'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { getA11yLabelText } from 'utils/common'
import { getAccessibleDate, getDateMonthsAgo, getDateRange, getFormattedDate, todaysDate } from 'utils/dateUtils'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { useError, useRouteNavigation, useTheme } from 'utils/hooks'
import { screenContentAllowed } from 'utils/waygateConfig'

// import { TimeFrameDropDownItem } from './TimeFrameType'
// import { TimeFrameTypeConstants } from './constants'

type LabsAndTestsListScreenProps = StackScreenProps<HealthStackParamList, 'LabsAndTestsList'>

/**
 * Screen containing a list of Labs and Tests on record and a link to their details view
 */
function LabsAndTestsListScreen({ navigation }: LabsAndTestsListScreenProps) {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const [LabsAndTestsToShow, setLabsAndTestsToShow] = useState<Array<LabsAndTests>>([])

  const [page, setPage] = useState(1)
  const [datePickerOption, setDatePickerOption] = useState<TimeFrameDropDownItem>({} as TimeFrameDropDownItem)
  const timeRangeOptions: Array<TimeFrameDropDownItem> = useMemo(() => {
    const twoMonthsEarlier = getDateMonthsAgo(2, 'start', 'start')
    const threeMonthsEarlier = getDateMonthsAgo(3, 'end', 'end')
    const fiveMonthsEarlier = getDateMonthsAgo(5, 'start', 'start')

    const sixMonthsEarlier = getDateMonthsAgo(6, 'end', 'end')
    const eightMonthsEarlier = getDateMonthsAgo(8, 'start', 'start')

    const nineMonthsEarlier = getDateMonthsAgo(9, 'end', 'end')
    const elevenMonthsEarlier = getDateMonthsAgo(11, 'start', 'start')

    const twelveMonthsEarlier = getDateMonthsAgo(12, 'end', 'end')
    const fourteenMonthsEarlier = getDateMonthsAgo(14, 'start', 'start')

    const options: Array<TimeFrameDropDownItem> = [
      {
        label: t('labsAndTests.list.pastThreeMonths'),
        value: t('labsAndTests.list.pastThreeMonths'),
        testID: t('labsAndTests.list.dateRangeA11yLabel', {
          date1: getAccessibleDate(twoMonthsEarlier),
          date2: getAccessibleDate(todaysDate),
        }),
        dates: {
          startDate: twoMonthsEarlier.startOf('day'),
          endDate: todaysDate.minus({ hours: 1 }),
        },
        timeFrame: TimeFrameTypeConstants.PAST_THREE_MONTHS,
      },
      {
        label: getDateRange(fiveMonthsEarlier, threeMonthsEarlier),
        value: getDateRange(fiveMonthsEarlier, threeMonthsEarlier),
        testID: t('labsAndTests.list.dateRangeA11yLabel', {
          date1: getAccessibleDate(fiveMonthsEarlier),
          date2: getAccessibleDate(threeMonthsEarlier),
        }),
        dates: {
          startDate: fiveMonthsEarlier,
          endDate: threeMonthsEarlier,
        },
        timeFrame: TimeFrameTypeConstants.PAST_FIVE_TO_THREE_MONTHS,
      },
      {
        label: getDateRange(eightMonthsEarlier, sixMonthsEarlier),
        value: getDateRange(eightMonthsEarlier, sixMonthsEarlier),
        testID: t('labsAndTests.list.dateRangeA11yLabel', {
          date1: getAccessibleDate(eightMonthsEarlier),
          date2: getAccessibleDate(sixMonthsEarlier),
        }),
        dates: {
          startDate: eightMonthsEarlier,
          endDate: sixMonthsEarlier,
        },
        timeFrame: TimeFrameTypeConstants.PAST_EIGHT_TO_SIX_MONTHS,
      },
      {
        label: getDateRange(elevenMonthsEarlier, nineMonthsEarlier),
        value: getDateRange(elevenMonthsEarlier, nineMonthsEarlier),
        testID: t('labsAndTests.list.dateRangeA11yLabel', {
          date1: getAccessibleDate(elevenMonthsEarlier),
          date2: getAccessibleDate(nineMonthsEarlier),
        }),
        dates: {
          startDate: elevenMonthsEarlier,
          endDate: nineMonthsEarlier,
        },
        timeFrame: TimeFrameTypeConstants.PAST_ELEVEN_TO_NINE_MONTHS,
      },
      {
        label: getDateRange(fourteenMonthsEarlier, twelveMonthsEarlier),
        value: getDateRange(fourteenMonthsEarlier, twelveMonthsEarlier),
        testID: t('labsAndTests.list.dateRangeA11yLabel', {
          date1: getAccessibleDate(fourteenMonthsEarlier),
          date2: getAccessibleDate(twelveMonthsEarlier),
        }),
        dates: {
          startDate: fourteenMonthsEarlier.startOf('day'),
          endDate: twelveMonthsEarlier.endOf('day'),
        },
        timeFrame: TimeFrameTypeConstants.PAST_FOURTEEN_TO_TWELVE_MONTHS,
      },
    ]
    setDatePickerOption(options[0])
    return options
  }, [t])

  const onTimeRangeSelectionChange = (selectValue: string) => {
    const curSelectedRange = timeRangeOptions.find((el) => el.value === selectValue)
    if (curSelectedRange) {
      const startDate = curSelectedRange.dates.startDate.startOf('day').toISO()
      const endDate = curSelectedRange.dates.endDate.endOf('day').toISO()
      if (startDate && endDate) {
        setPage(1)
      }
      setDatePickerOption(curSelectedRange)
    }
  }

  const labsAndTestsInDowntime = useError(ScreenIDTypesConstants.LABS_AND_TESTS_LIST_SCREEN_ID)

  // Helper function to validate date values
  const hasValidDates = (): boolean => {
    const start = datePickerOption.dates?.startDate.toISO()
    const end = datePickerOption.dates?.endDate.toISO()
    return !!start && !!end && start !== '' && end !== ''
  }

  const {
    data: labsAndTests,
    isFetching: loading,
    error: labsAndTestsError,
    refetch: refetchLabs,
  } = useLabsAndTests(
    {
      dateRange: {
        start: getFormattedDate(datePickerOption.dates?.startDate.toISO(), 'yyyy-MM-dd'),
        end: getFormattedDate(datePickerOption.dates?.endDate.toISO(), 'yyyy-MM-dd'),
      },
      timeFrame: datePickerOption.timeFrame,
    },
    { enabled: screenContentAllowed('WG_LabsAndTestsList') && !labsAndTestsInDowntime && hasValidDates() },
  )

  // Analytics
  useEffect(() => {
    const { timeFrame } = datePickerOption
    const count = labsAndTests?.data.length
    // if count is a number
    if (typeof count !== 'number') {
      return
    }
    logAnalyticsEvent(Events.vama_lab_or_test_list(timeFrame, count))
  }, [datePickerOption, labsAndTests])

  useEffect(() => {
    const filteredLabsAndTests = labsAndTests?.data.sort((a, b) => {
      const dateA = b.attributes?.dateCompleted ? new Date(b.attributes.dateCompleted) : new Date(0)
      const dateB = a.attributes?.dateCompleted ? new Date(a.attributes.dateCompleted) : new Date(0)
      return dateA.getTime() - dateB.getTime()
    })

    const labAndTestsList = filteredLabsAndTests?.slice((page - 1) * DEFAULT_PAGE_SIZE, page * DEFAULT_PAGE_SIZE)
    setLabsAndTestsToShow(labAndTestsList || [])
  }, [labsAndTests?.data, page])

  const labsAndTestsButtons: Array<DefaultListItemObj> = map(LabsAndTestsToShow, (labOrTest, index) => {
    const textLines: Array<TextLine> = [
      { text: labOrTest.attributes?.display as string, variant: 'MobileBodyBold' },
      { text: formatDateMMMMDDYYYY(labOrTest.attributes?.dateCompleted || '') },
    ]

    const labsAndTestsButton: DefaultListItemObj = {
      textLines,
      onPress: () => {
        navigateTo('LabsAndTestsDetailsScreen', { labOrTest: labOrTest })
      },
      a11yHintText: t('labsAndTests.list.a11yHint'),
      a11yValue: t('listPosition', { position: index + 1, total: labsAndTests?.data.length }),
      testId: getA11yLabelText(textLines),
    }
    return labsAndTestsButton
  })

  const scrollViewRef = useRef<ScrollView | null>(null)
  const scrollViewProps: VAScrollViewProps = {
    scrollViewRef: scrollViewRef,
  }

  function renderPagination() {
    const paginationProps: PaginationProps = {
      onNext: () => {
        setPage(page + 1)
        scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false })
      },
      onPrev: () => {
        setPage(page - 1)
        scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false })
      },
      totalEntries: labsAndTests?.data?.length || 0,
      pageSize: DEFAULT_PAGE_SIZE,
      page,
    }
    return (
      <Box
        flex={1}
        mt={theme.dimensions.paginationTopPadding}
        mb={theme.dimensions.contentMarginBottom}
        mx={theme.dimensions.gutter}>
        <Pagination {...paginationProps} />
      </Box>
    )
  }
  return (
    <FeatureLandingTemplate
      backLabel={t('vaMedicalRecords.title')}
      backLabelOnPress={navigation.goBack}
      title={t('labsAndTests.title')}
      titleA11y={a11yLabelVA(t('labsAndTests.title'))}
      testID="labs-and-tests-list-screen"
      scrollViewProps={scrollViewProps}>
      <Box mx={theme.dimensions.gutter}>
        {/* Surely there is a better way to insert bold text into a display string... */}
        <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
          {t('labsAndTests.availability.start')}
          <TextView variant="MobileBodyBold" testID="labsAndTestsAvailabilityTimingTestID">
            {t('labsAndTests.availability.timing.bold')}
          </TextView>
          <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
            {t('labsAndTests.availability.end')}
          </TextView>
        </TextView>
      </Box>
      <Box mx={theme.dimensions.gutter} accessible={true}>
        <Box mt={theme.dimensions.contentMarginTop}>
          <VAModalPicker
            selectedValue={datePickerOption.value}
            onSelectionChange={onTimeRangeSelectionChange}
            pickerOptions={timeRangeOptions.map((option) => ({
              ...option,
              testID: option.testID,
            }))}
            labelKey={'labsAndTests.list.selectADateRange'}
            testID="labsAndTestDataRangeTestID"
            confirmTestID="labsAndTestsDateRangeConfirmID"
          />
        </Box>
      </Box>
      {loading ? (
        <LoadingComponent text={t('labsAndTests.loading')} />
      ) : labsAndTestsError || labsAndTestsInDowntime ? (
        <ErrorComponent
          screenID={ScreenIDTypesConstants.LABS_AND_TESTS_LIST_SCREEN_ID}
          error={labsAndTestsError}
          onTryAgain={refetchLabs}
        />
      ) : labsAndTests?.data?.length === 0 ? (
        <NoLabsAndTestsRecords />
      ) : (
        <>
          <Box mt={theme.dimensions.contentMarginTop}>
            <Box testID="LabsAndTestsButtonsListTestID" mb={theme.dimensions.contentMarginBottom}>
              <DefaultList items={labsAndTestsButtons} />
            </Box>
            {renderPagination()}
          </Box>
        </>
      )}
    </FeatureLandingTemplate>
  )
}

export default LabsAndTestsListScreen
