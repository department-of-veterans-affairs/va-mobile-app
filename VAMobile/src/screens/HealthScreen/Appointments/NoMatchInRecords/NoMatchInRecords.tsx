import { useTranslation } from 'react-i18next'
import React, { FC, ReactNode } from 'react'

import { AccordionCollapsible, Box, ClickToCallPhoneNumber, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { getTranslation } from 'utils/formattingUtils'
import { testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'

const NoMatchInRecords: FC = () => {
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()

  const accordionContent = (textID: string, textA11yLabelID: string): ReactNode => {
    return (
      <Box mt={theme.dimensions.standardMarginBetween}>
        <Box {...testIdProps(getTranslation(`noMatch.${textA11yLabelID}`, t))}>
          <TextView variant="MobileBody">{getTranslation(`noMatch.${textID}`, t)}</TextView>
        </Box>
        <ClickToCallPhoneNumber phone={t('noMatch.phoneNumber')} displayedText={t('noMatch.phoneNumberDisplayed')} />
      </Box>
    )
  }

  const accordionHeader = (textID: string, textA11yLabelID: string): ReactNode => {
    return (
      <TextView variant="MobileBodyBold" {...testIdProps(getTranslation(`noMatch.${textA11yLabelID}`, t))}>
        {getTranslation(`noMatch.${textID}`, t)}
      </TextView>
    )
  }

  return (
    <VAScrollView {...testIdProps('Health care: No match in records')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <Box mx={theme.dimensions.gutter}>
          <Box {...testIdProps(t('noMatch.titleA11yLabel'))} accessibilityRole="header" accessible={true}>
            <TextView variant="BitterBoldHeading">
              {t('noMatch.title')}
            </TextView>
          </Box>
          <Box {...testIdProps(t('noMatch.noMatchA11yLabel'))} accessible={true}>
            <TextView variant="MobileBody" paragraphSpacing={true}>
              {t('noMatch.noMatch')}
            </TextView>
          </Box>
          <Box {...testIdProps(t('noMatch.whatYouCanDo'))} accessibilityRole="header" accessible={true}>
            <TextView variant="MobileBodyBold">{t('noMatch.whatYouCanDo')}</TextView>
          </Box>
        </Box>
        <Box mt={theme.dimensions.condensedMarginBetween}>
          <AccordionCollapsible
            header={accordionHeader('currentlyRegisteredPatient', 'currentlyRegisteredPatientA11yLabel')}
            expandedContent={accordionContent('currentlyRegisteredPatientContent', 'currentlyRegisteredPatientContentA11yLabel')}
            testID={t('noMatch.currentlyRegisteredPatientA11yLabel')}
          />
        </Box>
        <Box mt={theme.dimensions.condensedMarginBetween}>
          <AccordionCollapsible
            header={accordionHeader('enrolledInHealthCare', 'enrolledInHealthCareA11yLabel')}
            expandedContent={accordionContent('enrolledInHealthCareContent', 'enrolledInHealthCareContentA11yLabel')}
            testID={t('noMatch.enrolledInHealthCareA11yLabel')}
          />
        </Box>
        <Box mt={theme.dimensions.condensedMarginBetween}>
          <AccordionCollapsible
            header={accordionHeader('notEnrolled', 'notEnrolledA11yLabel')}
            expandedContent={accordionContent('notEnrolledContent', 'notEnrolledContentA11yLabel')}
            testID={t('noMatch.notEnrolledA11yLabel')}
          />
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default NoMatchInRecords
