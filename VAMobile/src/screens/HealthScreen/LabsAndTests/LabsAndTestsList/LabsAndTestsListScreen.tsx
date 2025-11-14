import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack'

import { DateTime } from 'luxon'
import { map } from 'underscore'

import { useLabsAndTests } from 'api/labsAndTests/getLabsAndTests'
import { LabsAndTests } from 'api/types'
import {
  AccordionCollapsible,
  Box,
  DefaultList,
  DefaultListItemObj,
  ErrorComponent,
  FeatureLandingTemplate,
  LinkWithAnalytics,
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
import getEnv from 'utils/env'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { useError, useRouteNavigation, useTheme } from 'utils/hooks'
import { screenContentAllowed } from 'utils/waygateConfig'

const { LINK_URL_MHV_VA_MEDICAL_RECORDS } = getEnv()
const LINK_URL_MHV_LABS_AND_TESTS = `${LINK_URL_MHV_VA_MEDICAL_RECORDS}labs-and-tests`

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

  // Generate date range options: past 3 months, past 6 months, then yearly back to 2013
  const dateRangeOptions: Array<PickerItem> = useMemo(() => {
    const now = DateTime.now()
    const currentYear = now.year
    const options: Array<PickerItem> = []

    // Past 3 months
    options.push({
      label: t('labsAndTests.list.pastThreeMonths'),
      value: 'past-3-months',
      testID: 'range-past-3-months',
    })

    // Past 6 months
    options.push({
      label: t('labsAndTests.list.pastSixMonths'),
      value: 'past-6-months',
      testID: 'range-past-6-months',
    })

    // Yearly options from current year back to 2013
    for (let year = currentYear; year >= 2013; year--) {
      options.push({
        label: t('labsAndTests.list.allOfYear', { year }),
        value: String(year),
        testID: `range-${year}`,
      })
    }

    return options
  }, [t])

  // Get date range based on selected value
  const getDateRangeByValue = (value: string) => {
    const now = DateTime.now()
    const today = now.toFormat('yyyy-MM-dd')

    const formatMonthsRange = (months: number) => {
      const startDate = now.minus({ months })
      return {
        startDate: startDate.toFormat('yyyy-MM-dd'),
        endDate: today,
        timeFrame: `${startDate.toFormat('MMM d, yyyy')} - ${now.toFormat('MMM d, yyyy')}`,
      }
    }

    if (value === 'past-3-months') {
      return formatMonthsRange(3)
    }

    if (value === 'past-6-months') {
      return formatMonthsRange(6)
    }

    // Yearly ranges
    const year = parseInt(value, 10)
    if (isNaN(year)) {
      // if not year, default to the last three months
      return formatMonthsRange(3)
    }
    return {
      startDate: `${year}-01-01`,
      endDate: `${year}-12-31`,
      timeFrame: `Jan 1, ${year} - Dec 31, ${year}`,
    }
  }

  const initialDateRange = getDateRangeByValue('past-3-months')
  const [selectedDateRangeValue, setSelectedDateRangeValue] = useState<string>('past-3-months')
  const [selectedDateRange, setSelectedDateRange] = useState<{
    startDate: string
    endDate: string
    timeFrame: string
  }>(initialDateRange)

  const onDateRangeChange = (selectValue: string) => {
    setSelectedDateRangeValue(selectValue)
    const dateRange = getDateRangeByValue(selectValue)
    setSelectedDateRange(dateRange)
    setPage(1) // Reset to first page when date range changes
  }

  const labsAndTestsInDowntime = useError(ScreenIDTypesConstants.LABS_AND_TESTS_LIST_SCREEN_ID)

  // Helper function to validate date values
  const hasValidDates = (): boolean => {
    const start = selectedDateRange?.startDate
    const end = selectedDateRange?.endDate
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
            selectedValue={selectedDateRangeValue}
            onSelectionChange={onDateRangeChange}
            pickerOptions={dateRangeOptions}
            labelKey={'labsAndTests.list.dateFilter.selectPeriod'}
            testID="labsAndTestDateRangePickerTestID"
            confirmTestID="labsAndTestsDateRangeConfirmID"
          />
        </Box>
        <Box mt={theme.dimensions.contentMarginTop}>
          <TextView testID="labsAndTestsDateRangeTestID">
            {t('labsAndTests.list.dateFilter.dateRange')}{' '}
            <TextView variant="MobileBodyBold">{selectedDateRange.timeFrame}</TextView>
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
            <Box mb={theme.dimensions.standardMarginBetween}>
              <AccordionCollapsible
                header={<TextView>{t('labsAndTests.details.imageDisclaimer.header')}</TextView>}
                expandedContent={
                  <>
                    <TextView
                      variant="MobileBody"
                      mt={theme.dimensions.standardMarginBetween}
                      accessibilityLabel={a11yLabelVA(t('labsAndTests.details.imageDisclaimer.text'))}
                      accessibilityHint={a11yLabelVA(t('labsAndTests.details.imageDisclaimer.text.a11yHint'))}>
                      {t('labsAndTests.details.imageDisclaimer.text')}
                    </TextView>
                    <Box mt={theme.dimensions.standardMarginBetween}>
                      <LinkWithAnalytics
                        type="custom"
                        onPress={() => {
                          logAnalyticsEvent(Events.vama_webview(LINK_URL_MHV_LABS_AND_TESTS))
                          navigateTo('Webview', {
                            url: LINK_URL_MHV_LABS_AND_TESTS,
                            displayTitle: t('webview.vagov'),
                            loadingMessage: t('webview.medicalRecords.loading'),
                            useSSO: true,
                          })
                        }}
                        text={t('labsAndTests.details.imageDisclaimer.linkText')}
                        a11yLabel={a11yLabelVA(t('labsAndTests.details.imageDisclaimer.linkText'))}
                        testID="viewMedicalRecordsLinkID"
                      />
                    </Box>
                  </>
                }
                testID="medicalImagesAccordionTestID"
              />
            </Box>
          </Box>
        </>
      )}
    </FeatureLandingTemplate>
  )
}

export default LabsAndTestsListScreen
