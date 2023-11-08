import { StackScreenProps } from '@react-navigation/stack'
import { map } from 'underscore'
import { useTranslation } from 'react-i18next'
import React, { FC, ReactNode, useCallback, useEffect } from 'react'

import { Box, DefaultList, DefaultListItemObj, ErrorComponent, FeatureLandingTemplate, LoadingComponent, Pagination, PaginationProps, TextLine } from 'components'
import { HealthStackParamList } from '../../HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { Vaccine } from 'store/api/types'
import { VaccineState, getVaccines } from 'store/slices/vaccineSlice'
import { a11yLabelVA } from 'utils/a11yLabel'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { getA11yLabelText } from 'utils/common'
import { useAppDispatch, useError, useRouteNavigation, useTheme } from 'utils/hooks'
import { useSelector } from 'react-redux'
import NoVaccineRecords from '../NoVaccineRecords/NoVaccineRecords'

type VaccineListScreenProps = StackScreenProps<HealthStackParamList, 'VaccineList'>

/**
 * Screen containing a list of vaccines on record and a link to their details view
 */
const VaccineListScreen: FC<VaccineListScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch()
  const { vaccines, loading, vaccinePagination } = useSelector<RootState, VaccineState>((state) => state.vaccine)
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const vaccineButtons: Array<DefaultListItemObj> = map(vaccines || [], (vaccine: Vaccine, index) => {
    const textLines: Array<TextLine> = [
      { text: t('vaccines.vaccineName', { name: vaccine.attributes?.groupName }), variant: 'MobileBodyBold' },
      { text: formatDateMMMMDDYYYY(vaccine.attributes?.date || '') },
    ]

    const vaccineButton: DefaultListItemObj = {
      textLines,
      onPress: navigateTo('VaccineDetails', { vaccineId: vaccine.id }),
      a11yHintText: t('vaccines.list.a11yHint'),
      a11yValue: t('listPosition', { position: index + 1, total: vaccines.length }),
      testId: getA11yLabelText(textLines),
    }

    return vaccineButton
  })

  const requestPage = useCallback(
    (requestedPage: number) => {
      // request the next page
      dispatch(getVaccines(ScreenIDTypesConstants.VACCINE_LIST_SCREEN_ID, requestedPage))
    },
    [dispatch],
  )

  // Render pagination for sent and drafts folderMessages only
  const renderPagination = (): ReactNode => {
    const page = vaccinePagination?.currentPage || 1
    const paginationProps: PaginationProps = {
      onNext: () => {
        requestPage(page + 1)
      },
      onPrev: () => {
        requestPage(page - 1)
      },
      totalEntries: vaccinePagination?.totalEntries || 0,
      pageSize: vaccinePagination?.perPage || 0,
      page,
    }

    return (
      <Box flex={1} mt={theme.dimensions.paginationTopPadding} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <Pagination {...paginationProps} />
      </Box>
    )
  }

  useEffect(() => {
    requestPage(1)
  }, [dispatch, requestPage])

  if (useError(ScreenIDTypesConstants.VACCINE_LIST_SCREEN_ID)) {
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

  if (vaccines.length === 0) {
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
