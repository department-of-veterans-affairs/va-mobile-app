import { StackScreenProps } from '@react-navigation/stack'
import { map } from 'underscore'
import { useTranslation } from 'react-i18next'
import React, { useState } from 'react'

import { Box, DefaultList, DefaultListItemObj, ErrorComponent, FeatureLandingTemplate, LoadingComponent, Pagination, PaginationProps, TextLine } from 'components'
import { HealthStackParamList } from '../../HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { a11yLabelVA } from 'utils/a11yLabel'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { getA11yLabelText } from 'utils/common'
import { screenContentAllowed } from 'utils/waygateConfig'
import { useRouteNavigation, useTheme } from 'utils/hooks'
import { useVaccines } from 'api/vaccines/getVaccines'
import NoVaccineRecords from '../NoVaccineRecords/NoVaccineRecords'

type VaccineListScreenProps = StackScreenProps<HealthStackParamList, 'VaccineList'>

/**
 * Screen containing a list of vaccines on record and a link to their details view
 */
function VaccineListScreen({ navigation }: VaccineListScreenProps) {
  const [page, setPage] = useState(1)
  const { data: vaccines, isLoading: loading, isError: vaccineError } = useVaccines(page, { enabled: screenContentAllowed('WG_VaccineList') })
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const vaccineButtons: Array<DefaultListItemObj> = map(vaccines?.data || [], (vaccine, index) => {
    const textLines: Array<TextLine> = [
      { text: t('vaccines.vaccineName', { name: vaccine.attributes?.groupName }), variant: 'MobileBodyBold' },
      { text: formatDateMMMMDDYYYY(vaccine.attributes?.date || '') },
    ]

    const vaccineButton: DefaultListItemObj = {
      textLines,
      onPress: () => {
        navigateTo('VaccineDetails', { vaccine: vaccine })
      },
      a11yHintText: t('vaccines.list.a11yHint'),
      a11yValue: t('listPosition', { position: index + 1, total: vaccines?.data.length }),
      testId: getA11yLabelText(textLines),
    }

    return vaccineButton
  })

  // Render pagination for sent and drafts folderMessages only
  function renderPagination() {
    const paginationProps: PaginationProps = {
      onNext: () => {
        setPage(page + 1)
      },
      onPrev: () => {
        setPage(page - 1)
      },
      totalEntries: vaccines?.meta?.pagination?.totalEntries || 0,
      pageSize: vaccines?.meta?.pagination?.perPage || 0,
      page: vaccines?.meta?.pagination?.currentPage || 1,
    }

    return (
      <Box flex={1} mt={theme.dimensions.paginationTopPadding} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <Pagination {...paginationProps} />
      </Box>
    )
  }

  if (vaccineError) {
    return (
      <FeatureLandingTemplate backLabel={t('health.title')} backLabelOnPress={navigation.goBack} title={t('vaVaccines')} titleA11y={a11yLabelVA(t('vaVaccines'))}>
        <ErrorComponent screenID={ScreenIDTypesConstants.VACCINE_LIST_SCREEN_ID} />
      </FeatureLandingTemplate>
    )
  }

  if (loading) {
    return (
      <FeatureLandingTemplate backLabel={t('health.title')} backLabelOnPress={navigation.goBack} title={t('vaVaccines')} titleA11y={a11yLabelVA(t('vaVaccines'))}>
        <LoadingComponent text={t('vaccines.loading')} />
      </FeatureLandingTemplate>
    )
  }

  if (vaccines?.data?.length === 0) {
    return (
      <FeatureLandingTemplate backLabel={t('health.title')} backLabelOnPress={navigation.goBack} title={t('vaVaccines')} titleA11y={a11yLabelVA(t('vaVaccines'))}>
        <NoVaccineRecords />
      </FeatureLandingTemplate>
    )
  }

  return (
    <FeatureLandingTemplate backLabel={t('health.title')} backLabelOnPress={navigation.goBack} title={t('vaVaccines')} titleA11y={a11yLabelVA(t('vaVaccines'))}>
      <Box mb={theme.dimensions.contentMarginBottom}>
        <DefaultList items={vaccineButtons} />
      </Box>
      {renderPagination()}
    </FeatureLandingTemplate>
  )
}

export default VaccineListScreen
