import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack'

import { map } from 'underscore'

import { Vaccine } from 'api/types'
import { useVaccines } from 'api/vaccines/getVaccines'
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
import NoVaccineRecords from '../NoVaccineRecords/NoVaccineRecords'

type VaccineListScreenProps = StackScreenProps<HealthStackParamList, 'VaccineList'>

/**
 * Screen containing a list of vaccines on record and a link to their details view
 */
function VaccineListScreen({ navigation }: VaccineListScreenProps) {
  const [page, setPage] = useState(1)
  // checks for downtime, immunizations downtime constant is having an issue with unit test
  const vaccinesInDowntime = useError(ScreenIDTypesConstants.VACCINE_LIST_SCREEN_ID)
  const {
    data: vaccines,
    isFetching: loading,
    error: vaccineError,
    refetch: refetchVaccines,
  } = useVaccines({ enabled: screenContentAllowed('WG_VaccineList') && !vaccinesInDowntime })

  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const [vaccinesToShow, setVaccinesToShow] = useState<Array<Vaccine>>([])

  const scrollViewRef = useRef<ScrollView | null>(null)
  const scrollViewProps: VAScrollViewProps = {
    scrollViewRef: scrollViewRef,
  }

  useEffect(() => {
    const filteredVaccines = vaccines?.data.sort((a, b) => {
      const dateA = b.attributes?.date ? new Date(b.attributes.date) : new Date(0)
      const dateB = a.attributes?.date ? new Date(a.attributes.date) : new Date(0)
      return dateA.getTime() - dateB.getTime()
    })
    const vaccineList = filteredVaccines?.slice((page - 1) * DEFAULT_PAGE_SIZE, page * DEFAULT_PAGE_SIZE)
    setVaccinesToShow(vaccineList || [])
  }, [vaccines?.data, page])

  const vaccineButtons: Array<DefaultListItemObj> = map(vaccinesToShow, (vaccine, index) => {
    const vaccineTitle = vaccine.attributes?.groupName
      ? t('vaccines.vaccineName', { name: vaccine.attributes?.groupName })
      : t('vaccine')
    const vaccineDate = vaccine.attributes?.date ? formatDateMMMMDDYYYY(vaccine.attributes?.date) : t('vaccines.noDate')

    const textLines: Array<TextLine> = [
      {
        text: vaccineTitle,
        variant: 'MobileBodyBold',
      },
      { text: vaccineDate },
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
        scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false })
      },
      onPrev: () => {
        setPage(page - 1)
        scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false })
      },
      totalEntries: vaccines?.meta?.pagination?.totalEntries || 0,
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
      title={t('vaVaccines')}
      titleA11y={a11yLabelVA(t('vaVaccines'))}
      scrollViewProps={scrollViewProps}>
      {loading ? (
        <LoadingComponent text={t('vaccines.loading')} />
      ) : vaccineError || vaccinesInDowntime ? (
        <ErrorComponent
          screenID={ScreenIDTypesConstants.VACCINE_LIST_SCREEN_ID}
          error={vaccineError}
          onTryAgain={refetchVaccines}
        />
      ) : vaccines?.data?.length === 0 ? (
        <NoVaccineRecords />
      ) : (
        <>
          <Box mb={theme.dimensions.contentMarginBottom}>
            <DefaultList items={vaccineButtons} />
          </Box>
          {renderPagination()}
        </>
      )}
    </FeatureLandingTemplate>
  )
}

export default VaccineListScreen
