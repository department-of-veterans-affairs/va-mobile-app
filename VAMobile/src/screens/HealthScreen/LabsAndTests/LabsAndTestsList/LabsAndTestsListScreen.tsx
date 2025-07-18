import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack'

import {
  Button,
  ButtonVariants,
} from '@department-of-veterans-affairs/mobile-component-library/src/components/Button/Button'
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
  PickerItem,
  TextLine,
  TextView,
  VAModalPicker,
} from 'components'
import { VAScrollViewProps } from 'components/VAScrollView'
import { Events } from 'constants/analytics'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { NAMESPACE } from 'constants/namespaces'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import NoLabsAndTestsRecords from 'screens/HealthScreen/LabsAndTests/NoLabsAndTestsRecords/NoLabsAndTestsRecords'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { getA11yLabelText } from 'utils/common'
import { MONTHS, getCurrentMonth, getDateRange, getFormattedDate, getListOfYearsSinceYear } from 'utils/dateUtils'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { useError, useRouteNavigation, useTheme } from 'utils/hooks'
import { screenContentAllowed } from 'utils/waygateConfig'

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
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonth())
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString())

  const createApiParamObject = (month: string, year: string) => {
    const startDate = DateTime.fromFormat(`${month} 01 ${year}`, 'LLLL dd yyyy').toJSDate()
    const endDate = new Date(startDate)
    endDate.setMonth(endDate.getMonth() + 1)
    endDate.setDate(0)
    return {
      startDate: getFormattedDate(startDate.toISOString(), 'yyyy-MM-dd'),
      endDate: getFormattedDate(endDate.toISOString(), 'yyyy-MM-dd'),
      timeFrame: `${month}-${year}`,
      display: getDateRange(DateTime.fromJSDate(startDate), DateTime.fromJSDate(endDate), 'MMMM dd, yyyy'),
    }
  }
  const [selectedDateRange, setSelectedDateRange] = useState<{
    startDate: string
    endDate: string
    timeFrame: string
    display: string
  }>(createApiParamObject(selectedMonth, selectedYear))

  const allMonthsOptions: Array<PickerItem> = useMemo(() => {
    return MONTHS.map((month) => {
      return {
        label: month,
        value: month,
        testID: t('labsAndTests.list.dateFilter.monthA11y', { date1: month }),
      }
    })
  }, [t])

  const allYearsOptions: Array<PickerItem> = useMemo(() => {
    const currentYear = new Date().getFullYear()
    const years = getListOfYearsSinceYear(currentYear - 100)
    return years.map((year) => {
      return {
        label: year,
        value: year,
        testID: t('labsAndTests.list.dateFilter.yearA11y', { date1: year }),
      }
    })
  }, [t])

  const onMonthSelectionChange = (selectValue: string) => {
    const curSelectedMonth = allMonthsOptions.find((el) => el.value === selectValue)
    if (curSelectedMonth) {
      setSelectedMonth(curSelectedMonth.value)
    }
  }

  const onYearSelectionChange = (selectValue: string) => {
    const curSelectedYear = allYearsOptions.find((el) => el.value === selectValue)
    if (curSelectedYear) {
      setSelectedYear(curSelectedYear.value)
    }
  }

  const labsAndTestsInDowntime = useError(ScreenIDTypesConstants.LABS_AND_TESTS_LIST_SCREEN_ID)

  // Helper function to validate date values
  const hasValidDates = (): boolean => {
    const start = selectedDateRange?.startDate
    const end = selectedDateRange?.endDate
    return !!start && !!end && start !== '' && end !== ''
  }

  const applyNewDateFilters = useCallback(() => {
    const { startDate, endDate, timeFrame, display } = createApiParamObject(selectedMonth, selectedYear)
    setSelectedDateRange({
      startDate,
      endDate,
      timeFrame,
      display,
    })
  }, [selectedMonth, selectedYear])

  const {
    data: labsAndTests,
    isFetching: loading,
    error: labsAndTestsError,
    refetch: refetchLabs,
  } = useLabsAndTests(
    {
      dateRange: {
        start: selectedDateRange.startDate,
        end: selectedDateRange.endDate,
      },
      timeFrame: selectedDateRange.timeFrame,
    },
    { enabled: screenContentAllowed('WG_LabsAndTestsList') && !labsAndTestsInDowntime && hasValidDates() },
  )

  // Analytics
  useEffect(() => {
    const { timeFrame } = selectedDateRange
    const count = labsAndTests?.data.length
    // if count is a number
    if (typeof count !== 'number') {
      return
    }
    logAnalyticsEvent(Events.vama_lab_or_test_list(timeFrame, count))
  }, [selectedDateRange, labsAndTests])

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
      <Box mx={theme.dimensions.gutter}>
        <Box mt={theme.dimensions.contentMarginTop}>
          <VAModalPicker
            selectedValue={selectedMonth}
            onSelectionChange={onMonthSelectionChange}
            pickerOptions={allMonthsOptions.map((option) => ({
              ...option,
              testID: option.testID,
            }))}
            labelKey={'labsAndTests.list.dateFilter.month'}
            testID="labsAndTestDataRangeMonthTestID"
            confirmTestID="labsAndTestsDateRangeMonthConfirmID"
          />
        </Box>
        <Box mt={theme.dimensions.contentMarginTop}>
          <VAModalPicker
            selectedValue={selectedYear}
            onSelectionChange={onYearSelectionChange}
            pickerOptions={allYearsOptions}
            labelKey={'labsAndTests.list.dateFilter.year'}
            testID="labsAndTestDataRangeYearTestID"
            confirmTestID="labsAndTestsDateRangeYearConfirmID"
          />
        </Box>
        <Box pt={theme.dimensions.standardMarginBetween}>
          <Button
            onPress={() => {
              applyNewDateFilters()
            }}
            label={t('labsAndTests.list.dateFilter.buttonText')}
            testID={'updateLabsAndTestsButtonTestID'}
            buttonType={ButtonVariants.Primary}
          />
        </Box>
        <Box mt={theme.dimensions.contentMarginTop}>
          <TextView testID="labsAndTestsDateRangeTestID">
            {t('labsAndTests.list.dateFilter.displayLabel', {
              timeFrame: selectedDateRange.timeFrame.replace('-', ' '),
            })}
          </TextView>
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
