import React, { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { Button, ButtonVariants } from '@department-of-veterans-affairs/mobile-component-library'

import { useDecisionLetters, useDownloadDecisionLetter } from 'api/decisionLetters'
import {
  Box,
  BoxProps,
  DefaultList,
  DefaultListItemObj,
  TextLine,
  TextLineWithIconProps,
  TextView,
  VAModalList,
  VAScrollView,
} from 'components'
import { useSubtaskProps } from 'components/Templates/MultiStepSubtask'
import SubtaskTitle from 'components/Templates/SubtaskTitle'
import { Events, UserAnalytics } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { FileRequestStackParams } from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/FileRequestSubtask'
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import { VATypographyThemeVariants } from 'styles/theme'
import { logAnalyticsEvent } from 'utils/analytics'
import { getA11yLabelText } from 'utils/common'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { useDowntime, useRouteNavigation, useTheme } from 'utils/hooks'
import { screenContentAllowed } from 'utils/waygateConfig'

type File5103RequestDetailsProps = StackScreenProps<FileRequestStackParams, 'File5103RequestDetails'>

function File5103RequestDetails({ navigation, route }: File5103RequestDetailsProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
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
  const { standardMarginBetween, cardPadding, contentMarginBottom, contentMarginTop, gutter } = theme.dimensions
  const { displayName, type, status, description, uploadDate, documents } = request
  const [showLetterModal, setShowLetterModal] = useState<boolean>(false)

  // const [lettersToShow, setLettersToShow] = useState<DecisionLettersList>([])
  //
  // useEffect(() => {
  //   const lettersList = decisionLettersData?.data
  //   setLettersToShow(lettersList || [])
  // }, [decisionLettersData])

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

  const getListItemVals = (): Array<DefaultListItemObj> => {
    const listItems: Array<DefaultListItemObj> = []
    const variant = 'MobileBodyBold' as keyof VATypographyThemeVariants
    decisionLettersData?.data?.forEach((letter, index) => {
      const { typeDescription, receivedAt } = letter.attributes
      const date = t('claimLetters.letterDate', { date: formatDateMMMMDDYYYY(receivedAt || '') })
      const textLines: Array<TextLine> = [{ text: date, variant }, { text: typeDescription }]
      const onPress = () => {
        // logAnalyticsEvent(Events.vama_ddl_letter_view(typeDescription))
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
    <VAScrollView testID="file5103RequestDetailsID">
      <SubtaskTitle title={t('claimDetails.5103.title')} />

      {/*<Box flex={1} mb={contentMarginBottom} backgroundColor='contentBox' />*/}
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
              onPress={() => {}}
            />
          </Box>
        </Box>
      </Box>
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
    </VAScrollView>
  )
}

export default File5103RequestDetails
