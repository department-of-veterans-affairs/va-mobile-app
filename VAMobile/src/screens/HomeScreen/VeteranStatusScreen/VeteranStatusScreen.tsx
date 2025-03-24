import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useDisabilityRating } from 'api/disabilityRating'
import { useServiceHistory } from 'api/militaryService'
import { usePersonalInformation } from 'api/personalInformation/getPersonalInformation'
import { BranchOfService, ServiceData, ServiceHistoryData } from 'api/types'
import { useVeteranStatus } from 'api/veteranStatus'
import {
  AlertWithHaptics,
  BackgroundVariant,
  Box,
  ClickToCallPhoneNumber,
  ClickToCallPhoneNumberDeprecated,
  LargePanel,
  MilitaryBranchEmblem,
  TextView,
} from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { a11yLabelID, a11yLabelVA } from 'utils/a11yLabel'
import { useBeforeNavBackListener, useOrientation, useTheme } from 'utils/hooks'
import { useReviewEvent } from 'utils/inAppReviews'

import { displayedTextPhoneNumber } from '../../../utils/formattingUtils'

// import PhotoUpload from 'components/PhotoUpload'

const LANDSCAPE_PADDING = 144
const PORTRAIT_PADDING = 18

const EMBLEM_SIZE_LANDSCAPE = 82
const EMBLEM_SIZE_PORTRAIT = 50

const TOP_STRIP_HEIGHT_LANDSCAPE = 70
const TOP_STRIP_HEIGHT_PORTRAIT = 50

const EMBLEM_TOP_LANDSCAPE = 40
const EMBLEM_TOP_PORTRAIT = 42

const EMBLEM_OFFSET_FROM_CARD_RIGHT = 26

type VeteranStatusScreenProps = StackScreenProps<HomeStackParamList, 'VeteranStatus'>

function VeteranStatusScreen({ navigation }: VeteranStatusScreenProps) {
  const { data: militaryServiceHistoryAttributes } = useServiceHistory()
  const serviceHistory = militaryServiceHistoryAttributes?.serviceHistory || ([] as ServiceHistoryData)
  const mostRecentBranch = militaryServiceHistoryAttributes?.mostRecentBranch
  const { data: ratingData } = useDisabilityRating()
  const { data: userAuthorizedServices } = useAuthorizedServices()
  const { data: personalInfo } = usePersonalInformation()
  const { data: veteranStatus } = useVeteranStatus()
  const registerReviewEvent = useReviewEvent(true)
  const accessToMilitaryInfo = userAuthorizedServices?.militaryServiceHistory && serviceHistory.length > 0
  const veteranStatusConfirmed = veteranStatus?.data.attributes.veteranStatus === 'confirmed'
  const showError = !veteranStatusConfirmed || (veteranStatusConfirmed && !serviceHistory.length)
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const isPortrait = useOrientation()
  const isLandscape = !isPortrait
  const ratingPercent = ratingData?.combinedDisabilityRating
  const ratingIsDefined = ratingPercent !== undefined && ratingPercent !== null
  const combinedPercentText = ratingIsDefined
    ? t('disabilityRating.combinePercent', { combinedPercent: ratingPercent })
    : undefined
  const branch = mostRecentBranch || ('' as BranchOfService)

  useBeforeNavBackListener(navigation, () => {
    registerReviewEvent()
  })

  const getLatestPeriodOfService = (): React.ReactNode => {
    if (!serviceHistory || serviceHistory.length === 0) {
      return null
    }
    const service = serviceHistory[0]
    const branchOfService = t('militaryInformation.branch', {
      branch: service.branchOfService,
    })

    return (
      <Box>
        <Box display="flex" flexDirection="row" alignItems="center" mt={theme.dimensions.condensedMarginBetween}>
          <TextView variant="MobileBody" color="primaryContrast">
            {branchOfService}
          </TextView>
        </Box>

        <Box>
          <TextView
            variant="HelperText"
            color="primaryContrast"
            mb={theme.dimensions.condensedMarginBetween}
            testID="veteranStatusMilitaryServiceTestID">
            {t('militaryInformation.history', {
              begin: service.formattedBeginDate,
              end: service.formattedEndDate,
            })}
          </TextView>
        </Box>
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

  const horizontalPadding = isPortrait ? PORTRAIT_PADDING : LANDSCAPE_PADDING
  const emblemSize = isPortrait ? EMBLEM_SIZE_PORTRAIT : EMBLEM_SIZE_LANDSCAPE
  const topStripHeight = isPortrait ? TOP_STRIP_HEIGHT_PORTRAIT : TOP_STRIP_HEIGHT_LANDSCAPE
  const emblemTopOffset = isPortrait ? EMBLEM_TOP_PORTRAIT : EMBLEM_TOP_LANDSCAPE

  const emblemRightOffset = horizontalPadding + EMBLEM_OFFSET_FROM_CARD_RIGHT
  const clampedEmblemRight = emblemRightOffset < 0 ? 16 : emblemRightOffset

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
        <>
          <Box
            position="relative"
            width="100%"
            px={horizontalPadding}
            pt={20}
            borderRadius={15}
            style={{
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 3.75 },
              shadowOpacity: 0.25,
              shadowRadius: 3.75,
              ...Platform.select({
                android: {
                  elevation: 4,
                },
              }),
            }}>
            <Box
              accessibilityRole="header"
              alignItems="flex-start"
              justifyContent="center"
              backgroundColor={theme.colors.background.carousel as BackgroundVariant}
              height={topStripHeight}
              borderRadiusTop={15}
              style={{
                paddingTop: 16,
                paddingLeft: 16,
                paddingBottom: 8,
                paddingRight: 64,
              }}>
              {/* VeteranStatusCardHeaderBold */}
              <TextView color="primaryContrast" variant="MobileBodyBold">
                Veteran Status Card
              </TextView>
            </Box>

            <Box
              backgroundColor={theme.colors.background.veteranStatus as BackgroundVariant}
              borderRadiusBottom={15}
              px={isPortrait ? 18 : 0}
              pl={isPortrait ? 0 : 18}>
              <Box pt={12}>
                <TextView color="primaryContrast" variant="MobileBodyBold">
                  Name
                </TextView>
                <TextView color="primaryContrast" variant="MobileBody">
                  {personalInfo?.fullName}
                </TextView>
              </Box>

              <Box mt={8}>
                <TextView color="primaryContrast" variant="MobileBodyBold">
                  {'Latest period of service'}
                </TextView>
                <TextView color="primaryContrast" variant="MobileBody">
                  {getLatestPeriodOfService()}
                </TextView>
              </Box>

              <Box flexDirection={isLandscape ? 'row' : 'column'}>
                <Box flex={isLandscape ? 1 : undefined} mr={isLandscape ? 8 : 0}>
                  <TextView color="primaryContrast" variant="MobileBodyBold">
                    {t('veteranStatus.dodIdNumber')}
                  </TextView>
                  <TextView color="primaryContrast" variant="MobileBody">
                    {personalInfo?.edipi}
                  </TextView>
                </Box>

                <Box flex={isLandscape ? 1 : undefined} mt={isLandscape ? 0 : 8}>
                  <TextView color="primaryContrast" variant="MobileBodyBold">
                    {t('disabilityRating.title')}
                  </TextView>
                  <TextView color="primaryContrast" variant="MobileBody">
                    {combinedPercentText}
                  </TextView>
                </Box>
              </Box>

              <Box mt={16} pb={16}>
                <TextView color="primaryContrast" variant="VeteranStatusProof">
                  {t('veteranStatus.noBenefitsEntitled')}
                </TextView>
              </Box>
            </Box>

            <Box
              position="absolute"
              top={emblemTopOffset}
              right={clampedEmblemRight}
              width={emblemSize}
              height={emblemSize}
              borderRadius={emblemSize / 2}
              overflow="hidden">
              <MilitaryBranchEmblem
                testID="veteranStatusCardBranchEmblem"
                branch={branch}
                width={emblemSize}
                height={emblemSize}
                variant="dark"
              />
            </Box>
          </Box>
          <Box my={theme.dimensions.formMarginBetween} px={horizontalPadding}>
            <TextView variant="MobileBodyBold" color="primary" accessibilityRole="header" mb={12}>
              {t('veteranStatus.about')}
            </TextView>
            <TextView variant="MobileBody" color="bodyText" mb={theme.dimensions.formMarginBetween}>
              {t('veteranStatus.uniformedServices')}
            </TextView>
            <TextView variant="MobileBodyBold" color="primary" accessibilityRole="header" mb={12}>
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
              ttyBypass={true}
            />
          </Box>
        </>
      )}
    </LargePanel>
  )
}

export default VeteranStatusScreen
