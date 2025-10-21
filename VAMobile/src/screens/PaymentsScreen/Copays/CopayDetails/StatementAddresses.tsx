import React from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { MedicalCopayRecord } from 'api/types'
import { AccordionCollapsible, Box, ClickToCallPhoneNumber, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'

function StatementAddresses({ copay, facilityName }: { copay: MedicalCopayRecord; facilityName: string }) {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)

  const formattedSenderAddress = () => {
    const { staTAddress1, staTAddress2, staTAddress3, city, state, ziPCde } = copay.station

    return (
      <Box mb={theme.dimensions.condensedMarginBetween}>
        <TextView variant="vadsFontHeadingXsmall" mb={theme.dimensions.condensedMarginBetween}>
          {t('copays.statementAddresses.senderAddress')}
        </TextView>
        <TextView variant="MobileBody">{facilityName}</TextView>
        <TextView variant="MobileBody">{staTAddress1}</TextView>
        {staTAddress2 && <TextView variant="MobileBody">{staTAddress2}</TextView>}
        {staTAddress3 && <TextView variant="MobileBody">{staTAddress3}</TextView>}
        <TextView variant="MobileBody">
          {city}, {state} {ziPCde}
        </TextView>
      </Box>
    )
  }

  const formatttedRecipientAddress = () => {
    const { pHAddress1, pHAddress2, pHAddress3, pHCity, pHState, pHZipCde } = copay

    return (
      <Box mb={theme.dimensions.condensedMarginBetween}>
        <TextView variant="vadsFontHeadingXsmall" mb={theme.dimensions.condensedMarginBetween}>
          {t('copays.statementAddresses.recipientAddress')}
        </TextView>
        <TextView variant="MobileBody">{pHAddress1}</TextView>
        {pHAddress2 && <TextView variant="MobileBody">{pHAddress2}</TextView>}
        {pHAddress3 && <TextView variant="MobileBody">{pHAddress3}</TextView>}
        <TextView variant="MobileBody">
          {pHCity}, {pHState} {pHZipCde}
        </TextView>
      </Box>
    )
  }

  return (
    <AccordionCollapsible
      header={<TextView variant={'MobileBodyBold'}>{t('copays.statementAddresses')}</TextView>}
      expandedContent={
        <Box mt={theme.dimensions.standardMarginBetween}>
          {formattedSenderAddress()}
          {formatttedRecipientAddress()}
          <TextView>
            <Trans
              i18nKey={'copays.statementAddresses.note'}
              components={{
                // This handles bolding text
                bold: <TextView variant="MobileBodyBold" />,
              }}
            />
          </TextView>
          <ClickToCallPhoneNumber
            phone={t('8662602614')}
            displayedText={displayedTextPhoneNumber(t('8662602614'))}
            ttyBypass
          />
        </Box>
      }
      expandedInitialValue={false}
    />
  )
}

export default StatementAddresses
