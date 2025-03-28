import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { useDisabilityRating } from 'api/disabilityRating'
import { useServiceHistory } from 'api/militaryService'
import { usePersonalInformation } from 'api/personalInformation/getPersonalInformation'
import { BranchOfService, ServiceData, ServiceHistoryData } from 'api/types'
import { useVeteranStatus } from 'api/veteranStatus'
import {
  AlertWithHaptics,
  Box,
  ClickToCallPhoneNumber,
  ClickToCallPhoneNumberDeprecated,
  LargePanel,
  TextView,
} from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { a11yLabelID, a11yLabelVA } from 'utils/a11yLabel'
import { useBeforeNavBackListener, useOrientation, useTheme } from 'utils/hooks'
import { useReviewEvent } from 'utils/inAppReviews'

import { displayedTextPhoneNumber } from '../../../utils/formattingUtils'
import VeteranStatusCard from './VeteranStatusCard/VeteranStatusCard'

// import PhotoUpload from 'components/PhotoUpload'

const LANDSCAPE_PADDING = 44
const PORTRAIT_PADDING = 18
const MAX_WIDTH = 672

type VeteranStatusScreenProps = StackScreenProps<HomeStackParamList, 'VeteranStatus'>

function VeteranStatusScreen({ navigation }: VeteranStatusScreenProps) {
  const { data: militaryServiceHistoryAttributes } = useServiceHistory()
  const serviceHistory = militaryServiceHistoryAttributes?.serviceHistory || ([] as ServiceHistoryData)
  const mostRecentBranch = militaryServiceHistoryAttributes?.mostRecentBranch
  const { data: ratingData } = useDisabilityRating()
  const { data: personalInfo } = usePersonalInformation()
  const { data: veteranStatus } = useVeteranStatus()
  const registerReviewEvent = useReviewEvent(true)
  const veteranStatusConfirmed = veteranStatus?.data.attributes.veteranStatus === 'confirmed'
  const showError = !veteranStatusConfirmed || (veteranStatusConfirmed && !serviceHistory.length)
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const isPortrait = useOrientation()
  const ratingPercent = ratingData?.combinedDisabilityRating
  const ratingIsDefined = ratingPercent !== undefined && ratingPercent !== null
  const percentText = ratingIsDefined ? t('disabilityRating.percent', { combinedPercent: ratingPercent }) : undefined
  const branch = mostRecentBranch || ('' as BranchOfService)
  const horizontalPadding = isPortrait ? PORTRAIT_PADDING : LANDSCAPE_PADDING
  const containerStyle = !isPortrait ? { alignSelf: 'center' as const, maxWidth: MAX_WIDTH } : {}

  useBeforeNavBackListener(navigation, () => {
    registerReviewEvent()
  })

  const getLatestPeriodOfService = (): React.ReactNode => {
    if (!serviceHistory || serviceHistory.length === 0) {
      return null
    }
    const service = serviceHistory[serviceHistory.length - 1]
    const branchOfService = t('militaryInformation.branch', {
      branch: service.branchOfService,
    })

    const beginYear = service.beginDate.slice(0, 4)
    const endYear = service.endDate.slice(0, 4)

    return (
      <Box>
        <TextView variant="MobileBody" color="primaryContrast" testID="veteranStatusMilitaryServiceTestID">
          {branchOfService} • {beginYear}-{endYear}
        </TextView>
      </Box>
    )
  }

  const getError = () => {
    const notConfirmedReason = veteranStatus!.data.attributes.notConfirmedReason

    if (notConfirmedReason === 'NOT_TITLE_38') {
      return (
        <AlertWithHaptics
          variant="warning"
          header={t('veteranStatus.error.notTitle38.title')}
          headerA11yLabel={a11yLabelVA(t('veteranStatus.error.notTitle38.title'))}
          description={t('veteranStatus.error.notTitle38.body1')}
          descriptionA11yLabel={a11yLabelVA(t('veteranStatus.error.notTitle38.body1'))}>
          <TextView accessibilityLabel={t('veteranStatus.error.notTitle38.body2')}>
            {t('veteranStatus.error.notTitle38.body2')}
          </TextView>
          <ClickToCallPhoneNumber
            a11yLabel={a11yLabelID(t('8005389552'))}
            displayedText={displayedTextPhoneNumber(t('8005389552'))}
            phone={t('8005389552')}
          />
        </AlertWithHaptics>
      )
    }
    if (notConfirmedReason === 'ERROR') {
      return (
        <AlertWithHaptics
          variant="error"
          header={t('errors.somethingWentWrong')}
          headerA11yLabel={a11yLabelVA(t('errors.somethingWentWrong'))}
          description={t('veteranStatus.error.generic')}
          descriptionA11yLabel={a11yLabelVA(t('veteranStatus.error.generic'))}
        />
      )
    }
    return (
      <AlertWithHaptics
        variant="warning"
        header={t('veteranStatus.error.catchAll.title')}
        headerA11yLabel={a11yLabelVA(t('veteranStatus.error.catchAll.title'))}
        description={t('veteranStatus.error.catchAll.body')}
        descriptionA11yLabel={a11yLabelVA(t('veteranStatus.error.catchAll.body'))}>
        <ClickToCallPhoneNumber
          a11yLabel={a11yLabelID(t('8005389552'))}
          displayedText={displayedTextPhoneNumber(t('8005389552'))}
          phone={t('8005389552')}
        />
      </AlertWithHaptics>
    )
  }

  return (
    <LargePanel
      title={t('veteranStatus.title')}
      rightButtonText={t('close')}
      dividerMarginBypass={true}
      removeInsets={false}
      testID="veteranStatusTestID"
      rightButtonTestID="veteranStatusCloseID">
      {showError ? (
        getError()
      ) : (
        <VeteranStatusCard
          fullName={personalInfo?.fullName}
          edipi={personalInfo?.edipi}
          branch={branch}
          percentText={percentText}
          getLatestPeriodOfService={getLatestPeriodOfService}
        />
      )}
      <Box style={containerStyle} my={theme.dimensions.formMarginBetween} px={horizontalPadding} width="100%">
        <TextView variant="MobileBodyTightBold" color="primary" accessibilityRole="header" mb={12}>
          {t('veteranStatus.about')}
        </TextView>
        <TextView variant="MobileBody" color="bodyText" mb={theme.dimensions.condensedMarginBetween}>
          {t('veteranStatus.uniformedServices')}
        </TextView>
        <TextView variant="MobileBodyTightBold" color="primary" accessibilityRole="header" mb={12}>
          {t('veteranStatus.fixAnError')}
        </TextView>
        <TextView variant="MobileBody" color="bodyText" mb={theme.dimensions.condensedMarginBetween}>
          {t('veteranStatus.fixAnError.2')}
        </TextView>
        <ClickToCallPhoneNumberDeprecated
          phone={t('8008271000')}
          displayedText={displayedTextPhoneNumber(t('8008271000'))}
          colorOverride={'link'}
          iconColorOverride={theme.colors.icon.link}
        />
        <TextView variant="MobileBody" color="bodyText" my={theme.dimensions.condensedMarginBetween}>
          {t('veteranStatus.fixAnError.3')}
        </TextView>
        <ClickToCallPhoneNumberDeprecated
          phone={t('8005389552')}
          displayedText={displayedTextPhoneNumber(t('8005389552'))}
          colorOverride={'link'}
          iconColorOverride={theme.colors.icon.link}
        />
      </Box>
    </LargePanel>
  )
}

export default VeteranStatusScreen
