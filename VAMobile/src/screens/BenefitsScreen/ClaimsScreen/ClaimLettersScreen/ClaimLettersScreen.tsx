import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { useNavigationState } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'

import { useSnackbar } from '@department-of-veterans-affairs/mobile-component-library'
import { useQueryClient } from '@tanstack/react-query'

import { useDecisionLetters, useDownloadDecisionLetter } from 'api/decisionLetters'
import { DecisionLettersList } from 'api/types'
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
import { Events } from 'constants/analytics'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { NAMESPACE } from 'constants/namespaces'
import { BenefitsStackParamList } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { DowntimeFeatureTypeConstants, ScreenIDTypesConstants } from 'store/api/types'
import { VATypographyThemeVariants } from 'styles/theme'
import { logAnalyticsEvent } from 'utils/analytics'
import { getA11yLabelText, isErrorObject } from 'utils/common'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { useAppDispatch, useDowntime, useTheme } from 'utils/hooks'
import { screenContentAllowed } from 'utils/waygateConfig'

import NoClaimLettersScreen from './NoClaimLettersScreen/NoClaimLettersScreen'

type ClaimLettersScreenProps = StackScreenProps<BenefitsStackParamList, 'ClaimLettersScreen'>

const ClaimLettersScreen = ({ navigation }: ClaimLettersScreenProps) => {
  const snackbar = useSnackbar()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const claimsInDowntime = useDowntime(DowntimeFeatureTypeConstants.claims)
  const prevScreen = useNavigationState((state) => state.routes[state.routes.length - 2]?.name)
  const [letterID, setLetterID] = useState<string>('')
  const [letterReceivedAt, setLetterReceivedAt] = useState<string>('')
  const {
    data: decisionLettersData,
    isFetching: loading,
    error: letterInfoError,
    refetch: fetchInfoAgain,
  } = useDecisionLetters({
    enabled: screenContentAllowed('WG_ClaimLettersScreen') && !claimsInDowntime,
  })
  const {
    isFetching: downloading,
    error: downloadLetterErrorDetails,
    refetch: refetchLetter,
  } = useDownloadDecisionLetter(letterID, letterReceivedAt, {
    enabled: letterID.length > 0 && letterReceivedAt.length > 0,
  })
  // This screen is reachable from two different screens, so adjust back button label
  const decisionLetters = decisionLettersData?.data || ([] as DecisionLettersList)
  const backLabel = prevScreen === 'ClaimDetailsScreen' ? t('claimDetails.title') : t('claims.title')

  const scrollViewRef = useRef<ScrollView | null>(null)
  const scrollViewProps: VAScrollViewProps = {
    scrollViewRef: scrollViewRef,
  }
  const [page, setPage] = useState(1)
  const { perPage, totalEntries } = {
    perPage: DEFAULT_PAGE_SIZE,
    totalEntries: decisionLettersData?.data.length || 0,
  }
  const [lettersToShow, setLettersToShow] = useState<DecisionLettersList>([])

  useEffect(() => {
    const lettersList = decisionLettersData?.data?.slice((page - 1) * perPage, page * perPage)
    setLettersToShow(lettersList || [])
  }, [decisionLettersData, page, perPage])

  useEffect(() => {
    if (downloadLetterErrorDetails && isErrorObject(downloadLetterErrorDetails)) {
      snackbar.show(t('claimLetters.download.error'), { isError: true, onActionPressed: refetchLetter })
    }
  }, [downloadLetterErrorDetails, queryClient, dispatch, t, refetchLetter, snackbar])

  const getListItemVals = (): Array<DefaultListItemObj> => {
    const listItems: Array<DefaultListItemObj> = []
    const variant = 'MobileBodyBold' as keyof VATypographyThemeVariants
    lettersToShow?.forEach((letter, index) => {
      const { typeDescription, receivedAt } = letter.attributes
      const date = t('claimLetters.letterDate', { date: formatDateMMMMDDYYYY(receivedAt || '') })
      const textLines: Array<TextLine> = [{ text: date, variant }, { text: typeDescription }]
      const onPress = () => {
        logAnalyticsEvent(Events.vama_ddl_letter_view())
        if (letterID === letter.id) {
          refetchLetter()
        } else {
          setLetterID(letter.id)
          setLetterReceivedAt(receivedAt.toString())
        }
      }

      listItems.push({
        textLines,
        onPress,
        a11yValue: t('listPosition', { position: index + 1, total: decisionLetters.length }),
        testId: getA11yLabelText(textLines), // read by screen reader
      })
    })
    return listItems
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
      totalEntries: totalEntries,
      pageSize: perPage,
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
      backLabel={backLabel}
      backLabelOnPress={navigation.goBack}
      title={t('claimLetters.title')}
      scrollViewProps={scrollViewProps}
      backLabelTestID="claimLettersBackTestID">
      {loading || downloading ? (
        <LoadingComponent text={t(loading ? 'claimLetters.loading' : 'claimLetters.downloading')} />
      ) : letterInfoError || claimsInDowntime ? (
        <ErrorComponent
          screenID={ScreenIDTypesConstants.DECISION_LETTERS_LIST_SCREEN_ID}
          onTryAgain={fetchInfoAgain}
          error={letterInfoError}
        />
      ) : decisionLetters.length === 0 ? (
        <NoClaimLettersScreen />
      ) : (
        <>
          <TextView variant="MobileBody" mx={theme.dimensions.gutter} paragraphSpacing={true}>
            {t('claimLetters.overview')}
          </TextView>
          <Box mb={theme.dimensions.contentMarginBottom}>
            <DefaultList items={getListItemVals()} />
          </Box>
          {renderPagination()}
        </>
      )}
    </FeatureLandingTemplate>
  )
}

export default ClaimLettersScreen
