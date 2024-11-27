import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack'

import { map } from 'underscore'

import { useAllergies } from 'api/allergies/getAllergies'
import { Allergy } from 'api/types'
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
import NoAllergyRecords from '../NoAllergyRecords/NoAllergyRecords'

type AllergyListScreenProps = StackScreenProps<HealthStackParamList, 'AllergyList'>

/**
 * Screen containing a list of allergies on record and a link to their details view
 */
function AllergyListScreen({ navigation }: AllergyListScreenProps) {
  const [page, setPage] = useState(1)
  // checks for downtime, immunizations downtime constant is having an issue with unit test
  const vaccinesInDowntime = useError(ScreenIDTypesConstants.VACCINE_LIST_SCREEN_ID)
  const {
    data: allergies,
    isFetching: loading,
    error: vaccineError,
    refetch: refetchVaccines,
  } = useAllergies({ enabled: screenContentAllowed('WG_VaccineList') && !vaccinesInDowntime })

  // console.log(JSON.stringify(allergies, null, 3))

  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const [AllergiesToShow, setAllergiesToShow] = useState<Array<Allergy>>([])

  const scrollViewRef = useRef<ScrollView | null>(null)
  const scrollViewProps: VAScrollViewProps = {
    scrollViewRef: scrollViewRef,
  }

  useEffect(() => {
    const vaccineList = allergies?.data.slice((page - 1) * DEFAULT_PAGE_SIZE, page * DEFAULT_PAGE_SIZE)
    setAllergiesToShow(vaccineList || [])
  }, [allergies?.data, page])

  const allergyButtons: Array<DefaultListItemObj> = map(AllergiesToShow, (allergy, index) => {
    const textLines: Array<TextLine> = [
      { text: allergy.attributes?.code?.text ?? '', variant: 'MobileBodyBold' },
      { text: formatDateMMMMDDYYYY(allergy.attributes?.recordedDate || '') },
    ]

    const allergyButton: DefaultListItemObj = {
      textLines,
      onPress: () => {
        navigateTo('AllergyDetails', { allergy: allergy })
      },
      a11yHintText: t('vaccines.list.a11yHint'),
      a11yValue: t('listPosition', { position: index + 1, total: allergies?.data.length }),
      testId: getA11yLabelText(textLines),
    }

    return allergyButton
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
      totalEntries: allergies?.meta?.pagination?.totalEntries || 0,
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
      backLabel={t('health.title')}
      backLabelOnPress={navigation.goBack}
      title="Allergies"
      titleA11y={a11yLabelVA(t('vaAllergies'))}
      scrollViewProps={scrollViewProps}>
      {loading ? (
        <LoadingComponent text={t('allergies.loading')} />
      ) : vaccineError || vaccinesInDowntime ? (
        <ErrorComponent
          screenID={ScreenIDTypesConstants.VACCINE_LIST_SCREEN_ID}
          error={vaccineError}
          onTryAgain={refetchVaccines}
        />
      ) : allergies?.data?.length === 0 ? (
        <NoAllergyRecords />
      ) : (
        <>
          <Box mb={theme.dimensions.contentMarginBottom}>
            <DefaultList items={allergyButtons} />
          </Box>
          {renderPagination()}
        </>
      )}
    </FeatureLandingTemplate>
  )
}

export default AllergyListScreen
