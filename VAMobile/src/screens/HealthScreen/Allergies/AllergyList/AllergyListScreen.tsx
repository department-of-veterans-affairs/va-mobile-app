import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack'

import { map } from 'underscore'

import { useAllergies } from 'api/allergies/getAllergies'
import { AllergyAttributesV0, AllergyAttributesV1, AllergyData } from 'api/types'
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
import { Events } from 'constants/analytics'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { NAMESPACE } from 'constants/namespaces'
import NoAllergyRecords from 'screens/HealthScreen/Allergies/NoAllergyRecords/NoAllergyRecords'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { getA11yLabelText } from 'utils/common'
import { capitalizeFirstLetter, formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { useError, useRouteNavigation, useTheme } from 'utils/hooks'
import { screenContentAllowed } from 'utils/waygateConfig'

type AllergyListScreenProps = StackScreenProps<HealthStackParamList, 'AllergyList'>

/**
 * Screen containing a list of allergies on record and a link to their details view
 */
function AllergyListScreen({ navigation }: AllergyListScreenProps) {
  const [page, setPage] = useState(1)
  // checks for downtime, immunizations downtime constant is having an issue with unit test
  const allergiesInDowntime = useError(ScreenIDTypesConstants.ALLERGY_LIST_SCREEN_ID)
  const {
    data: allergies,
    isFetching: loading,
    error: allergyError,
    refetch: refetchAllergies,
  } = useAllergies({ enabled: screenContentAllowed('WG_AllergyList') && !allergiesInDowntime })

  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const [AllergiesToShow, setAllergiesToShow] = useState<Array<AllergyData>>([])

  const scrollViewRef = useRef<ScrollView | null>(null)
  const scrollViewProps: VAScrollViewProps = {
    scrollViewRef: scrollViewRef,
  }

  useEffect(() => {
    logAnalyticsEvent(Events.vama_allergy_list())
  }, [allergies])

  useEffect(() => {
    const descending = (allergies?.data || []).slice().reverse()
    const allergyList = descending.slice((page - 1) * DEFAULT_PAGE_SIZE, page * DEFAULT_PAGE_SIZE)
    setAllergiesToShow(allergyList || [])
  }, [allergies?.data, page])

  const allergyButtons: Array<DefaultListItemObj> = map(AllergiesToShow, (allergy, index) => {
    const textLines: Array<TextLine> = [
      {
        text: t('allergies.allergyName', {
          name: capitalizeFirstLetter(
            (allergy.attributes as AllergyAttributesV0)?.code?.text ||
              (allergy.attributes as AllergyAttributesV1)?.name ||
              '',
          ),
        }),
        variant: 'MobileBodyBold',
      },
      {
        text: formatDateMMMMDDYYYY(
          (allergy.attributes as AllergyAttributesV0)?.recordedDate ||
            (allergy.attributes as AllergyAttributesV1)?.date ||
            '',
        ),
      },
    ]

    const allergyButton: DefaultListItemObj = {
      textLines,
      onPress: () => {
        navigateTo('AllergyDetails', { allergy: allergy })
      },
      a11yHintText: t('allergies.list.a11yHint'),
      a11yValue: t('listPosition', { position: index + 1, total: allergies?.data.length }),
      testId: getA11yLabelText(textLines),
    }

    return allergyButton
  })

  // Render pagination for sent and drafts folderMessages only
  // TODO: DRY for this and vaccines.
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
      backLabel={t('vaMedicalRecords.title')}
      backLabelOnPress={navigation.goBack}
      title="Allergies"
      titleA11y={a11yLabelVA(t('vaAllergies'))}
      scrollViewProps={scrollViewProps}>
      {loading ? (
        <LoadingComponent text={t('allergies.loading')} />
      ) : allergyError || allergiesInDowntime ? (
        <ErrorComponent
          screenID={ScreenIDTypesConstants.ALLERGY_LIST_SCREEN_ID}
          error={allergyError}
          onTryAgain={refetchAllergies}
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
