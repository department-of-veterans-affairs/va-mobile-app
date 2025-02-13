import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { every } from 'underscore'

import { useAllergies } from 'api/allergies/getAllergies'
import { Box, FeatureLandingTemplate, LoadingComponent, TextArea, TextView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { useAppDispatch, useTheme } from 'utils/hooks'
import { screenContentAllowed } from 'utils/waygateConfig'

import { HealthStackParamList } from '../../HealthStackScreens'

type AllergyDetailsScreenProps = StackScreenProps<HealthStackParamList, 'AllergyDetails'>

/**
 * Screen providing details on an allergy
 */
function AllergyDetailsScreen({ route, navigation }: AllergyDetailsScreenProps) {
  const { allergy } = route.params

  const { isLoading: detailsLoading } = useAllergies({ enabled: screenContentAllowed('WG_AllergyDetails') })

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

  const displayDate = allergy.attributes?.recordedDate
    ? formatDateMMMMDDYYYY(allergy.attributes.recordedDate)
    : placeHolder

  const displayName = allergy.attributes?.code?.text
    ? t('allergies.allergyName', { name: allergy.attributes?.code?.text })
    : placeHolder

  const optionalFields = [
    allergy.attributes?.category?.length,
    allergy.attributes?.notes?.length,
    allergy.attributes?.reactions?.length,
    allergy.attributes?.recorder,
  ]
  const isPartialData = !every(optionalFields)

  return (
    <FeatureLandingTemplate
      backLabel={t('vaAllergies')}
      backLabelA11y={a11yLabelVA(t('vaAllergies'))}
      backLabelOnPress={navigation.goBack}
      title={t('details')}
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
                {'Type'}
              </TextView>
              {allergy.attributes?.category?.length ? (
                allergy.attributes?.category?.map((category, index) => (
                  <TextView
                    variant="MobileBody"
                    selectable={true}
                    testID={'Type ' + category || placeHolder}
                    key={index}>
                    {category || placeHolder}
                  </TextView>
                ))
              ) : (
                <TextView variant="MobileBody" selectable={true} testID={'Category ' + placeHolder}>
                  {placeHolder}{' '}
                </TextView>
              )}
            </Box>

            <Box mt={theme.dimensions.standardMarginBetween}>
              <TextView variant="MobileBodyBold">{t('health.details.provider')}</TextView>
              <TextView
                variant="MobileBody"
                selectable={true}
                testID={'Provider ' + allergy.attributes?.recorder?.display || placeHolder}>
                {allergy.attributes?.recorder?.display || placeHolder}
              </TextView>
            </Box>

            <Box mt={theme.dimensions.standardMarginBetween}>
              <Box>
                <TextView variant="MobileBodyBold">{t('health.details.reaction')}</TextView>
                {allergy?.attributes?.reactions?.length ? (
                  allergy.attributes?.reactions?.map((reaction) => {
                    return reaction.manifestation?.map((manifestation, i) => (
                      <TextView
                        key={i}
                        variant="MobileBody"
                        selectable={true}
                        testID={'Reaction ' + manifestation.text || placeHolder}>
                        {manifestation.text || placeHolder}
                      </TextView>
                    ))
                  })
                ) : (
                  <TextView variant="MobileBody" selectable={true} testID={'Reaction ' + placeHolder}>
                    {placeHolder}{' '}
                  </TextView>
                )}
              </Box>

              <Box mt={theme.dimensions.standardMarginBetween}>
                <TextView variant="MobileBodyBold">{t('health.details.notes')}</TextView>
                {allergy?.attributes?.notes?.length ? (
                  allergy.attributes?.notes?.map((note, index) => {
                    return (
                      <TextView
                        key={index}
                        variant="MobileBody"
                        selectable={true}
                        testID={'Note ' + note.text || placeHolder}>
                        {note.text || placeHolder}
                      </TextView>
                    )
                  })
                ) : (
                  <TextView variant="MobileBody" selectable={true} testID={'Note ' + placeHolder}>
                    {placeHolder}{' '}
                  </TextView>
                )}
              </Box>
            </Box>
          </TextArea>
          {isPartialData && (
            <Box mt={theme.dimensions.contentMarginTop} mx={theme.dimensions.gutter}>
              <TextView variant="HelperText" accessibilityLabel={a11yLabelVA(t('health.details.weBaseThis'))}>
                {t('health.details.weBaseThis')}
              </TextView>
            </Box>
          )}
        </Box>
      )}
    </FeatureLandingTemplate>
  )
}

export default AllergyDetailsScreen
