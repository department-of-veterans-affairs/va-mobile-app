import React, { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { StackScreenProps } from '@react-navigation/stack'

import { map } from 'underscore'

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
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { Vaccine } from 'store/api/types'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { VaccineState, getVaccines } from 'store/slices/vaccineSlice'
import { a11yLabelVA } from 'utils/a11yLabel'
import { getA11yLabelText } from 'utils/common'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { useAppDispatch, useError, useRouteNavigation, useTheme } from 'utils/hooks'
import { screenContentAllowed } from 'utils/waygateConfig'

import { HealthStackParamList } from '../../HealthStackScreens'
import NoVaccineRecords from '../NoVaccineRecords/NoVaccineRecords'

type VaccineListScreenProps = StackScreenProps<HealthStackParamList, 'VaccineList'>

/**
 * Screen containing a list of vaccines on record and a link to their details view
 */
function VaccineListScreen({ navigation }: VaccineListScreenProps) {
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
      onPress: () => {
        navigateTo('VaccineDetails', { vaccineId: vaccine.id })
      },
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
  function renderPagination() {
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
      <Box
        flex={1}
        mt={theme.dimensions.paginationTopPadding}
        mb={theme.dimensions.contentMarginBottom}
        mx={theme.dimensions.gutter}>
        <Pagination {...paginationProps} />
      </Box>
    )
  }

  useEffect(() => {
    if (screenContentAllowed('WG_VaccineList')) {
      requestPage(1)
    }
  }, [dispatch, requestPage])

  if (useError(ScreenIDTypesConstants.VACCINE_LIST_SCREEN_ID)) {
    return (
      <FeatureLandingTemplate
        backLabel={t('health.title')}
        backLabelOnPress={navigation.goBack}
        title={t('vaVaccines')}
        titleA11y={a11yLabelVA(t('vaVaccines'))}>
        <ErrorComponent screenID={ScreenIDTypesConstants.VACCINE_LIST_SCREEN_ID} />
      </FeatureLandingTemplate>
    )
  }

  if (loading) {
    return (
      <FeatureLandingTemplate
        backLabel={t('health.title')}
        backLabelOnPress={navigation.goBack}
        title={t('vaVaccines')}
        titleA11y={a11yLabelVA(t('vaVaccines'))}>
        <LoadingComponent text={t('vaccines.loading')} />
      </FeatureLandingTemplate>
    )
  }

  if (vaccines.length === 0) {
    return (
      <FeatureLandingTemplate
        backLabel={t('health.title')}
        backLabelOnPress={navigation.goBack}
        title={t('vaVaccines')}
        titleA11y={a11yLabelVA(t('vaVaccines'))}>
        <NoVaccineRecords />
      </FeatureLandingTemplate>
    )
  }

  return (
    <FeatureLandingTemplate
      backLabel={t('health.title')}
      backLabelOnPress={navigation.goBack}
      title={t('vaVaccines')}
      titleA11y={a11yLabelVA(t('vaVaccines'))}>
      <Box mb={theme.dimensions.contentMarginBottom}>
        <DefaultList items={vaccineButtons} />
      </Box>
      {renderPagination()}
    </FeatureLandingTemplate>
  )
}

export default VaccineListScreen
