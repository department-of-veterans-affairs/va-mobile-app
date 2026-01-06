import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { useAllergies } from 'api/allergies/getAllergies'
import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { AllergyAttributesV0, AllergyAttributesV1, NoteText, Reaction } from 'api/types'
import { Box, FeatureLandingTemplate, LoadingComponent, TextArea, TextView, VABulletList } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { capitalizeFirstLetter, formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { useAppDispatch, useTheme } from 'utils/hooks'
import { screenContentAllowed } from 'utils/waygateConfig'

type AllergyDetailsScreenProps = StackScreenProps<HealthStackParamList, 'AllergyDetails'>

/**
 * Screen providing details on an allergy
 */
function AllergyDetailsScreen({ route, navigation }: AllergyDetailsScreenProps) {
  const { allergy } = route.params

  const {
    data: authorizedServices,
    isFetching: loadingUserAuthorizedServices,
    error: getUserAuthorizedServicesError,
  } = useAuthorizedServices()

  const isAccelerating =
    authorizedServices?.allergiesOracleHealthEnabled &&
    !loadingUserAuthorizedServices &&
    !getUserAuthorizedServicesError

  const { isLoading: detailsLoading } = useAllergies({
    enabled: screenContentAllowed('WG_AllergyDetails'),
    isV1Api: isAccelerating,
  })

  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { contentMarginBottom, standardMarginBetween } = theme.dimensions
  const dispatch = useAppDispatch()

  const placeHolder = t('noneNoted')

  // analtyics
  useEffect(() => {
    logAnalyticsEvent(Events.vama_allergy_details())
  }, [dispatch, allergy])

  if (!allergy) {
    return <></>
  }

  const displayDate = (allergy.attributes as AllergyAttributesV1)?.date
    ? formatDateMMMMDDYYYY((allergy.attributes as AllergyAttributesV1).date || placeHolder)
    : (allergy.attributes as AllergyAttributesV0)?.recordedDate
      ? formatDateMMMMDDYYYY((allergy.attributes as AllergyAttributesV0).recordedDate || placeHolder)
      : placeHolder

  const displayName = (allergy.attributes as AllergyAttributesV0)?.code?.text
    ? t('allergies.allergyName', {
        name: capitalizeFirstLetter((allergy.attributes as AllergyAttributesV0)?.code?.text || placeHolder),
      })
    : (allergy.attributes as AllergyAttributesV1)?.name
      ? t('allergies.allergyName', {
          name: capitalizeFirstLetter((allergy.attributes as AllergyAttributesV1)?.name || placeHolder),
        })
      : t('allergies.allergyName', {
          name: capitalizeFirstLetter(placeHolder),
        })

  const listOfCategories = (allergy.attributes as AllergyAttributesV0)?.category
    ? (allergy.attributes as AllergyAttributesV0)?.category?.map((category: string) => {
        return capitalizeFirstLetter(category || placeHolder)
      })
    : (allergy.attributes as AllergyAttributesV1)?.categories
      ? (allergy.attributes as AllergyAttributesV1)?.categories?.map((category: string) => {
          return capitalizeFirstLetter(category || placeHolder)
        })
      : [placeHolder]

  const listOfReactions = allergy.attributes?.reactions
    ? allergy.attributes?.reactions?.flatMap((reaction) => {
        return (reaction as Reaction).manifestation
          ? (reaction as Reaction).manifestation?.map((manifestation) => {
              return capitalizeFirstLetter(manifestation.text || placeHolder)
            })
          : capitalizeFirstLetter((reaction as unknown as string) || placeHolder)
      })
    : [placeHolder]

  const listOfNotes = allergy.attributes?.notes
    ? allergy.attributes?.notes?.map((note) => {
        return (note as NoteText).text
          ? capitalizeFirstLetter((note as NoteText).text || placeHolder)
          : capitalizeFirstLetter((note as unknown as string) || placeHolder)
      })
    : [placeHolder]

  const providerName = (allergy.attributes as AllergyAttributesV0)?.recorder?.display
    ? capitalizeFirstLetter((allergy.attributes as AllergyAttributesV0)?.recorder?.display || placeHolder)
    : (allergy.attributes as AllergyAttributesV1)?.provider
      ? capitalizeFirstLetter((allergy.attributes as AllergyAttributesV1)?.provider || placeHolder)
      : placeHolder

  return (
    <FeatureLandingTemplate
      backLabel={t('vaAllergies')}
      backLabelA11y={a11yLabelVA(t('vaAllergies'))}
      backLabelOnPress={navigation.goBack}
      title={t('allergies.details.heading')}
      backLabelTestID="allergiesDetailsBackID">
      {detailsLoading ? (
        <LoadingComponent text={t('allergies.details.loading')} />
      ) : (
        <Box mb={contentMarginBottom}>
          <TextArea>
            <TextView variant="MobileBody" mb={standardMarginBetween}>
              {displayDate}
            </TextView>
            <Box accessibilityRole="header" accessible={true} mb={standardMarginBetween}>
              <TextView variant="MobileBodyBold">{displayName}</TextView>
            </Box>

            <Box>
              <TextView variant="MobileBodyBold" selectable={true}>
                {t('health.details.types.header')}
              </TextView>
              {(allergy.attributes as AllergyAttributesV0)?.category?.length ||
              (allergy.attributes as AllergyAttributesV1)?.categories?.length ? (
                <Box ml={theme.dimensions.standardMarginBetween}>
                  <VABulletList listOfText={listOfCategories as string[]} />
                </Box>
              ) : (
                <TextView variant="MobileBody" selectable={true} testID={'Category ' + placeHolder}>
                  {placeHolder}
                </TextView>
              )}
            </Box>

            <Box mt={theme.dimensions.standardMarginBetween}>
              <TextView variant="MobileBodyBold">{t('health.details.provider')}</TextView>
              <TextView variant="MobileBody" selectable={true} testID={'Provider ' + providerName}>
                {providerName}
              </TextView>
            </Box>

            <Box mt={theme.dimensions.standardMarginBetween}>
              <Box>
                <TextView variant="MobileBodyBold">{t('health.details.reaction.header')}</TextView>
                {allergy?.attributes?.reactions?.length ? (
                  <Box ml={theme.dimensions.standardMarginBetween}>
                    <VABulletList listOfText={listOfReactions as string[]} />
                  </Box>
                ) : (
                  <TextView variant="MobileBody" selectable={true} testID={'Reaction ' + placeHolder}>
                    {placeHolder}
                  </TextView>
                )}
              </Box>
              <Box mt={theme.dimensions.standardMarginBetween}>
                <TextView variant="MobileBodyBold">{t('health.details.notes')}</TextView>
                {allergy?.attributes?.notes?.length ? (
                  <Box ml={theme.dimensions.standardMarginBetween}>
                    <VABulletList listOfText={listOfNotes as string[]} />
                  </Box>
                ) : (
                  <TextView variant="MobileBody" selectable={true} testID={'Note ' + placeHolder}>
                    {placeHolder}
                  </TextView>
                )}
              </Box>
            </Box>
          </TextArea>

          <Box mt={theme.dimensions.contentMarginTop} mx={theme.dimensions.gutter}>
            {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
            <TextView variant="HelperText" accessibilityLabel={a11yLabelVA(t('health.details.weBaseThis'))}>
              {t('health.details.weBaseThis')}
            </TextView>
          </Box>
        </Box>
      )}
    </FeatureLandingTemplate>
  )
}

export default AllergyDetailsScreen
