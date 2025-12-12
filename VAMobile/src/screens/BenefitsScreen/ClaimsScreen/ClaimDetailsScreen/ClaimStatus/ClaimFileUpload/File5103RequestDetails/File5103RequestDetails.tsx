import React, { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { Button, ButtonVariants, useSnackbar } from '@department-of-veterans-affairs/mobile-component-library'
import { useQueryClient } from '@tanstack/react-query'

import { useDecisionLetters, useDownloadDecisionLetter } from 'api/decisionLetters'
import {
  Box,
  BoxProps,
  DefaultList,
  DefaultListItemObj,
  ErrorComponent,
  LoadingComponent,
  TextLine,
  TextLineWithIconProps,
  TextView,
  VAModalList,
  VAScrollView,
} from 'components'
import { useSubtaskProps } from 'components/Templates/MultiStepSubtask'
import SubtaskTitle from 'components/Templates/SubtaskTitle'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { FileRequestStackParams } from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/FileRequestSubtask'
import { DowntimeFeatureTypeConstants, ScreenIDTypesConstants } from 'store/api/types'
import { VATypographyThemeVariants } from 'styles/theme'
import { logAnalyticsEvent } from 'utils/analytics'
import { getA11yLabelText, isErrorObject } from 'utils/common'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { useAppDispatch, useDowntime, useRouteNavigation, useTheme } from 'utils/hooks'
import { screenContentAllowed } from 'utils/waygateConfig'

type File5103RequestDetailsProps = StackScreenProps<FileRequestStackParams, 'File5103RequestDetails'>

function File5103RequestDetails({ navigation, route }: File5103RequestDetailsProps) {
  const snackbar = useSnackbar()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const queryClient = useQueryClient()
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const navigateTo = useRouteNavigation()
  const claimsInDowntime = useDowntime(DowntimeFeatureTypeConstants.claims)
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

  const { claimID, request } = route.params
  const { cardPadding, contentMarginBottom } = theme.dimensions
  const [showLetterModal, setShowLetterModal] = useState<boolean>(false)

  useSubtaskProps({
    leftButtonText: t('back'),
    onLeftButtonPress: () => navigation.goBack(),
    leftButtonTestID: 'file5103RequestDetailsBackID',
  })

  const borderStyles: BoxProps = {
    borderStyle: 'solid',
    borderBottomWidth: 'default',
    borderBottomColor: 'primary',
    borderTopWidth: 'default',
    borderTopColor: 'primary',
  }

  const iconTextLine: TextLineWithIconProps = {
    text: t('claimDetails.5103.letters'),
    variant: 'MobileBodyBold',
    iconProps: {
      name: 'Description' as const,
      fill: theme.colors.text.primary,
    },
  }

  useEffect(() => {
    if (downloadLetterErrorDetails && isErrorObject(downloadLetterErrorDetails)) {
      snackbar.show(t('claimLetters.download.error'), { isError: true, onActionPressed: refetchLetter })
    }
  }, [downloadLetterErrorDetails, queryClient, dispatch, t, refetchLetter, snackbar])

  const getListItemVals = (): Array<DefaultListItemObj> => {
    const listItems: Array<DefaultListItemObj> = []
    const variant = 'MobileBodyBold' as keyof VATypographyThemeVariants
    decisionLettersData?.data?.forEach((letter, index) => {
      const { typeDescription, receivedAt } = letter.attributes
      const date = t('claimLetters.letterDate', { date: formatDateMMMMDDYYYY(receivedAt || '') })
      const textLines: Array<TextLine> = [{ text: date, variant }, { text: typeDescription }]
      const onPress = () => {
        setShowLetterModal(false)
        logAnalyticsEvent(Events.vama_ddl_letter_view(typeDescription))
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
        a11yValue: t('listPosition', { position: index + 1, total: decisionLettersData?.data?.length }),
        testId: getA11yLabelText(textLines), // read by screen reader
      })
    })
    return listItems
  }

  return (
    <Box>
      <VAScrollView testID="file5103RequestDetailsID">
        <SubtaskTitle title={t('claimDetails.5103.title')} />

        {loading || downloading ? (
          <LoadingComponent text={t(loading ? 'claimLetters.loading' : 'claimLetters.downloading')} />
        ) : letterInfoError || claimsInDowntime ? (
          <ErrorComponent
            screenID={ScreenIDTypesConstants.DECISION_LETTERS_LIST_SCREEN_ID}
            onTryAgain={fetchInfoAgain}
            error={letterInfoError}
          />
        ) : (
          <Box mb={contentMarginBottom} flex={1}>
            <Box backgroundColor="contentBox" {...borderStyles}>
              <Box p={cardPadding}>
                <TextView variant="ClaimHeader" accessibilityRole="header">
                  {t('claimDetails.5103.read')}
                </TextView>
                <TextView variant="MobileBody">{t('claimDetails.5103.body')}</TextView>
              </Box>
              <DefaultList
                items={[
                  {
                    textLines: [iconTextLine],
                    onPress: () => setShowLetterModal(true),
                  },
                ]}
              />
              <TextView p={cardPadding} variant="MobileBody">
                {t('claimDetails.5103.submit')}
              </TextView>
            </Box>
            <Box p={cardPadding}>
              <TextView mb={theme.dimensions.condensedMarginBetween} variant="MobileBody">
                <Trans i18nKey="claimDetails.5103.note" components={{ bold: <TextView variant="MobileBodyBold" /> }} />
              </TextView>
            </Box>
            <Box mx={theme.dimensions.gutter}>
              <Button
                buttonType={ButtonVariants.Primary}
                label={t('claimDetails.5103.review.waiver')}
                onPress={() => navigateTo('File5103ReviewWaiver', { claimID, request })}
              />
              <Box mt={theme.dimensions.condensedMarginBetween}>
                <Button
                  buttonType={ButtonVariants.Secondary}
                  label={t('claimDetails.5103.submit.evidence')}
                  onPress={() => navigateTo('File5103SubmitEvidence', { claimID, request })}
                />
              </Box>
            </Box>
          </Box>
        )}
      </VAScrollView>
      {showLetterModal && (
        <VAModalList
          showModal={showLetterModal}
          setShowModal={setShowLetterModal}
          listItems={getListItemVals()}
          title={t('claimDetails.5103.letters')}
          rightButton={{
            text: t('close'),
            onPress: () => setShowLetterModal(false),
          }}
        />
      )}
    </Box>
  )
}

export default File5103RequestDetails
