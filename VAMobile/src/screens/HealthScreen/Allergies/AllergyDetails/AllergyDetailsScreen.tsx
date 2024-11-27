import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { every } from 'underscore'

import { useAllergies } from 'api/allergies/getAllergies'
import { useAllergyLocation } from 'api/allergies/getAllergyLocation'
import { Box, FeatureLandingTemplate, LoadingComponent, TextArea, TextView } from 'components'
import { Events } from 'constants/analytics'
import { COVID19 } from 'constants/common'
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
  // const { data: location, isLoading: detailsLoading } = useAllergyLocation(
  //   allergy.relationships?.location?.data?.id || '',
  //   {
  //     enabled: !!allergy.relationships?.location?.data?.id && screenContentAllowed('WG_VaccineDetails'),
  //   },
  // )
  const { isLoading: detailsLoading } = useAllergies({ enabled: screenContentAllowed('WG_VaccineDetails') })

  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { contentMarginBottom, standardMarginBetween } = theme.dimensions
  const dispatch = useAppDispatch()

  const placeHolder = t('noneNoted')

  // analtyics
  // useEffect(() => {
  //   logAnalyticsEvent(Events.vama_vaccine_details(allergy?.attributes?.groupName || ''))
  // }, [dispatch, allergy])

  if (!allergy) {
    return <></>
  }

  const displayDate = allergy.attributes?.recordedDate
    ? formatDateMMMMDDYYYY(allergy.attributes.recordedDate)
    : placeHolder

  const displayName = allergy.attributes?.code?.text
    ? t('allergies.allergyName', { name: allergy.attributes?.code?.text })
    : placeHolder

  const hasType = allergy.attributes?.category
  // const displayType = hasType ? allergy.attributes?.category : placeHolder

  const optionalFields = [
    hasType,
    allergy.attributes?.notes,
    // allergy.attributes?.reaction,
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
        // <LoadingComponent text="Loading your allergy record" />
        <Box mb={contentMarginBottom}>
          <TextArea>
            <TextView variant="MobileBody" mb={standardMarginBetween}>
              {displayDate}
            </TextView>
            <Box accessibilityRole="header" accessible={true} mb={standardMarginBetween}>
              <TextView variant="MobileBodyBold">{displayName}</TextView>
            </Box>
            <TextView variant="MobileBodyBold" selectable={true}>
              {'Type'}
            </TextView>

            <TextView
              variant="MobileBody"
              selectable={true}
              mb={standardMarginBetween}
              testID={'Type ' + allergy.attributes?.category || placeHolder}>
              {allergy.attributes?.category || placeHolder}
            </TextView>

            <Box mt={theme.dimensions.standardMarginBetween}>
              <TextView variant="MobileBodyBold">{t('vaccines.details.provider')}</TextView>
              <TextView variant="MobileBody" selectable={true} testID={'Series status'}>
                {allergy.attributes?.recorder?.display || placeHolder}
              </TextView>
            </Box>

            <Box mt={theme.dimensions.standardMarginBetween}>
              <Box>
                <TextView variant="MobileBodyBold">{t('vaccines.details.reaction')}</TextView>
                {allergy?.attributes?.reactions?.length ? (
                  allergy.attributes?.reactions?.map((reaction, index) => {
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
                <TextView variant="MobileBodyBold">{t('vaccines.details.notes')}</TextView>
                {console.log(JSON.stringify(allergy.attributes?.notes, null, 2))}
                {allergy?.attributes?.notes?.length ? (
                  allergy.attributes?.notes?.map((note, index) => {
                    console.log('NOTE: ' + JSON.stringify(note, null, 2))
                    console.log('NOTE TEXT: ' + note.text)
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
              <TextView variant="HelperText" accessibilityLabel={a11yLabelVA(t('vaccines.details.weBaseThis'))}>
                {t('vaccines.details.weBaseThis')}
              </TextView>
            </Box>
          )}
        </Box>
      )}
    </FeatureLandingTemplate>
  )
}

export default AllergyDetailsScreen
