import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack'

import { DateTime } from 'luxon'
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
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { a11yLabelVA } from 'utils/a11yLabel'
import { getA11yLabelText } from 'utils/common'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { getFormattedDate } from 'utils/formattingUtils'
import { useError, useRouteNavigation, useTheme } from 'utils/hooks'
import { screenContentAllowed } from 'utils/waygateConfig'

import { HealthStackParamList } from '../../HealthStackScreens'
import NoLabsAndTestsRecords from '../NoLabsAndTestsRecords/NoLabsAndTestsRecords'
import { TimeFrameDropDownItem } from './TimeFrameType'
import { TimeFrameTypeConstants } from './constants'

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
    const getMMMyyyy = (date: DateTime): string => {
      return getFormattedDate(date.toISO(), 'MMM yyyy')
    }

    const getDateRange = (startDate: DateTime, endDate: DateTime): string => {
      return `${getMMMyyyy(startDate)} - ${getMMMyyyy(endDate)}`
    }
    const todaysDate = DateTime.local()

    const fiveMonthsEarlier = todaysDate.minus({ months: 5 }).startOf('month').startOf('day')
    const threeMonthsEarlier = todaysDate.minus({ months: 3 }).endOf('month').endOf('day')

    const eightMonthsEarlier = todaysDate.minus({ months: 8 }).startOf('month').startOf('day')
    const sixMonthsEarlier = todaysDate.minus({ months: 6 }).endOf('month').endOf('day')

    const elevenMonthsEarlier = todaysDate.minus({ months: 11 }).startOf('month').startOf('day')
    const nineMonthsEarlier = todaysDate.minus({ months: 9 }).endOf('month').endOf('day')

    const fourteenMonthsEarlier = todaysDate.minus({ months: 14 }).startOf('month').startOf('day')
    const twelveMonthsEarlier = todaysDate.minus({ months: 12 }).startOf('month').startOf('day')
    const options: Array<TimeFrameDropDownItem> = [
      {
        label: t('labsAndTests.list.pastThreeMonths'),
        value: t('labsAndTests.list.pastThreeMonths'),
        a11yLabel: t('labsAndTests.list.dateRangeA11yLabel', {
          date1: getMMMyyyy(todaysDate),
          date2: getMMMyyyy(threeMonthsEarlier.endOf('month').endOf('day')),
        }),
        dates: {
          startDate: threeMonthsEarlier.startOf('day'),
          endDate: todaysDate.endOf('day'),
        },
        timeFrame: TimeFrameTypeConstants.PAST_THREE_MONTHS,
      },
      {
        label: getDateRange(fiveMonthsEarlier, threeMonthsEarlier.endOf('month').endOf('day')),
        value: getDateRange(fiveMonthsEarlier, threeMonthsEarlier.endOf('month').endOf('day')),
        a11yLabel: t('labsAndTests.list.dateRangeA11yLabel', {
          date1: getMMMyyyy(fiveMonthsEarlier),
          date2: getMMMyyyy(threeMonthsEarlier.endOf('month').endOf('day')),
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
        a11yLabel: t('labsAndTests.list.dateRangeA11yLabel', {
          date1: getMMMyyyy(eightMonthsEarlier),
          date2: getMMMyyyy(sixMonthsEarlier),
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
        a11yLabel: t('labsAndTests.list.dateRangeA11yLabel', {
          date1: getMMMyyyy(elevenMonthsEarlier),
          date2: getMMMyyyy(nineMonthsEarlier),
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
        a11yLabel: t('labsAndTests.list.dateRangeA11yLabel', {
          date1: getMMMyyyy(twelveMonthsEarlier),
          date2: getMMMyyyy(fourteenMonthsEarlier.endOf('month').endOf('day')),
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
  const {
    data: labsAndTests,
    isFetching: loading,
    error: labsAndTestsError,
    refetch: refetchAllergies,
  } = useLabsAndTests(
    {
      dateRange: {
        start: getFormattedDate(datePickerOption.dates?.startDate.toISO(), 'MM-d-yyyy'),
        end: getFormattedDate(datePickerOption.dates?.endDate.toISO(), 'MM-d-yyyy'),
      },
      timeFrame: datePickerOption.timeFrame,
    },
    { enabled: screenContentAllowed('WG_LabsAndTestsList') && !labsAndTestsInDowntime },
  )

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
            pickerOptions={timeRangeOptions}
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
          screenID={ScreenIDTypesConstants.ALLERGY_LIST_SCREEN_ID}
          error={labsAndTestsError}
          onTryAgain={refetchAllergies}
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
