import React, { useEffect, useRef, useState } from 'react'
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
} from 'components'
import { VAScrollViewProps } from 'components/VAScrollView'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { a11yLabelVA } from 'utils/a11yLabel'
import { getA11yLabelText } from 'utils/common'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { useError, useRouteNavigation, useTheme } from 'utils/hooks'
import { screenContentAllowed } from 'utils/waygateConfig'

import { HealthStackParamList } from '../../HealthStackScreens'
import NoLabsAndTestsRecords from '../NoLabsAndTestsRecords/NoLabsAndTestsRecords'

type LabsAndTestsListScreenProps = StackScreenProps<HealthStackParamList, 'LabsAndTestsList'>

/**
 * Screen containing a list of Labs and Tests on record and a link to their details view
 */
function LabsAndTestsListScreen({ navigation }: LabsAndTestsListScreenProps) {
  const [page, setPage] = useState(1)
  // checks for downtime, immunizations downtime constant is having an issue with unit test
  const labsAndTestsInDowntime = useError(ScreenIDTypesConstants.LABS_AND_TESTS_LIST_SCREEN_ID)
  const {
    data: labsAndTests,
    isFetching: loading,
    error: labsAndTestsError,
    refetch: refetchAllergies,
  } = useLabsAndTests({ enabled: screenContentAllowed('WG_LabsAndTestsList') && !labsAndTestsInDowntime })

  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const [LabsAndTestsToShow, setLabsAndTestsToShow] = useState<Array<LabsAndTests>>([])

  const scrollViewRef = useRef<ScrollView | null>(null)
  const scrollViewProps: VAScrollViewProps = {
    scrollViewRef: scrollViewRef,
  }

  useEffect(() => {
    const labAndTestsList = labsAndTests?.data.slice((page - 1) * DEFAULT_PAGE_SIZE, page * DEFAULT_PAGE_SIZE)
    setLabsAndTestsToShow(labAndTestsList || [])
  }, [labsAndTests?.data, page])

  const labsAndTestsButtons: Array<DefaultListItemObj> = map(LabsAndTestsToShow, (labOrTest, index) => {
    const textLines: Array<TextLine> = [
      { text: labOrTest.attributes?.code as string, variant: 'MobileBodyBold' },
      { text: formatDateMMMMDDYYYY(labOrTest.attributes?.effectiveDateTime || '') },
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

  // Render pagination for sent and drafts folderMessages only
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
      totalEntries: labsAndTests?.meta?.pagination?.totalEntries || 0,
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
      scrollViewProps={scrollViewProps}>
      <Box mx={theme.dimensions.gutter}>
        {/* Surely there is a better way to insert bold text into a display string... */}
        <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
          {t('labsAndTests.availability.start')}
          <TextView variant="MobileBodyBold">{t('labsAndTests.availability.timing.bold')}</TextView>
          <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
            {t('labsAndTests.availability.end')}
          </TextView>
        </TextView>
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
          <Box mb={theme.dimensions.contentMarginBottom}>
            <DefaultList items={labsAndTestsButtons} />
          </Box>
          {renderPagination()}
        </>
      )}
    </FeatureLandingTemplate>
  )
}

export default LabsAndTestsListScreen
