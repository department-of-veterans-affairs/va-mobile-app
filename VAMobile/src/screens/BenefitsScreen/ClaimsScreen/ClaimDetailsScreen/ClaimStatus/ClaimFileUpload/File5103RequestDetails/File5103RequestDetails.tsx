import React from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { Button, ButtonVariants } from '@department-of-veterans-affairs/mobile-component-library'
import { map } from 'underscore'

import { Box, BoxProps, DefaultList, TextArea, TextView, VAScrollView } from 'components'
import { useSubtaskProps } from 'components/Templates/MultiStepSubtask'
import SubtaskTitle from 'components/Templates/SubtaskTitle'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { FileRequestStackParams } from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/FileRequestSubtask'
import { logAnalyticsEvent } from 'utils/analytics'
import { hasUploadedOrReceived } from 'utils/claims'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { useRouteNavigation, useTheme } from 'utils/hooks'

type File5103RequestDetailsProps = StackScreenProps<FileRequestStackParams, 'File5103RequestDetails'>

function File5103RequestDetails({ navigation, route }: File5103RequestDetailsProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { claimID, request } = route.params
  const { standardMarginBetween, cardPadding, contentMarginBottom, contentMarginTop, gutter } = theme.dimensions
  const { displayName, type, status, description, uploadDate, documents } = request

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

  return (
    <VAScrollView testID="file5103RequestDetailsID">
      <SubtaskTitle title={t('claimDetails.5103.title')} />

      {/*<Box flex={1} mb={contentMarginBottom} backgroundColor='contentBox' />*/}
      <Box mb={contentMarginBottom} flex={1}>
        {/*<TextArea>*/}
        {/*  <TextView mb={standardMarginBetween} variant="MobileBodyBold" accessibilityRole="header">*/}
        {/*    {displayName}*/}
        {/*  </TextView>*/}
        {/*  <TextView variant="MobileBody">{description}</TextView>*/}
        {/*</TextArea>*/}

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
                textLines: [
                  {
                    text: 'Claim Letters',
                  },
                ],
                onPress: () => {},
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
      </Box>
    </VAScrollView>
  )
}

export default File5103RequestDetails
