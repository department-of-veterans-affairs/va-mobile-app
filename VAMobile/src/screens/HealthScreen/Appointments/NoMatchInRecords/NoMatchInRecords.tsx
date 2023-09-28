import { useTranslation } from 'react-i18next'
import React, { FC, ReactNode } from 'react'

import { AccordionCollapsible, Box, ClickToCallPhoneNumber, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { getTranslation } from 'utils/formattingUtils'
import { testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'

const NoMatchInRecords: FC = () => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const accordionContent = (textID: string): ReactNode => {
    return (
      <Box mt={theme.dimensions.standardMarginBetween}>
        <TextView variant="MobileBody" accessibilityLabel={a11yLabelVA(getTranslation(`noMatch.${textID}`, t))}>
          {getTranslation(`noMatch.${textID}`, t)}
        </TextView>
        <ClickToCallPhoneNumber phone={t('8006982411')} displayedText={t('noMatch.phoneNumberDisplayed')} />
      </Box>
    )
  }

  const accordionHeader = (textID: string): ReactNode => {
    return (
      <TextView variant="MobileBodyBold" accessibilityLabel={a11yLabelVA(getTranslation(`noMatch.${textID}`, t))}>
        {getTranslation(`noMatch.${textID}`, t)}
      </TextView>
    )
  }

  return (
    <VAScrollView {...testIdProps('Health care: No match in records')}>
      <Box mb={theme.dimensions.contentMarginBottom}>
        <Box mx={theme.dimensions.gutter}>
          <TextView variant="BitterBoldHeading" accessibilityLabel={a11yLabelVA(t('noMatch.title'))} accessibilityRole="header" accessible={true}>
            {t('noMatch.title')}
          </TextView>
          <TextView variant="MobileBody" accessibilityLabel={a11yLabelVA(t('noMatch.noMatch'))} mt={theme.dimensions.standardMarginBetween} paragraphSpacing={true}>
            {t('noMatch.noMatch')}
          </TextView>
          <TextView variant="MobileBodyBold" accessibilityRole="header" accessible={true}>
            {t('noMatch.whatYouCanDo')}
          </TextView>
        </Box>
        <Box mt={theme.dimensions.condensedMarginBetween}>
          <AccordionCollapsible
            header={accordionHeader('currentlyRegisteredPatient')}
            expandedContent={accordionContent('currentlyRegisteredPatientContent')}
            testID={a11yLabelVA(t('noMatch.currentlyRegisteredPatient'))}
          />
        </Box>
        <Box mt={theme.dimensions.condensedMarginBetween}>
          <AccordionCollapsible
            header={accordionHeader('enrolledInHealthCare')}
            expandedContent={accordionContent('enrolledInHealthCareContent')}
            testID={a11yLabelVA(t('noMatch.enrolledInHealthCare'))}
          />
        </Box>
        <Box mt={theme.dimensions.condensedMarginBetween}>
          <AccordionCollapsible header={accordionHeader('notEnrolled')} expandedContent={accordionContent('notEnrolledContent')} testID={a11yLabelVA(t('noMatch.notEnrolled'))} />
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default NoMatchInRecords
