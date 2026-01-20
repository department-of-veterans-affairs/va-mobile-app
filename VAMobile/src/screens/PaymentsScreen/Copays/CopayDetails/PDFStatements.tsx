import React from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable } from 'react-native'

import { Icon } from '@department-of-veterans-affairs/mobile-component-library'

import { MedicalCopayRecord } from 'api/types'
import { AccordionCollapsible, BorderColorVariant, Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { formatDate } from 'utils/copays'
import { useTheme } from 'utils/hooks'

function PDFStatements({
  statements,
  downloadStatement,
}: {
  statements: MedicalCopayRecord[]
  downloadStatement: (statementID: string) => void
}) {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)

  const statementBoxProps = {
    borderTopWidth: theme.dimensions.borderWidth,
    borderColor: theme.colors.border.divider as BorderColorVariant,
    py: theme.dimensions.condensedMarginBetween,
  }

  const content = (
    <Box mt={theme.dimensions.standardMarginBetween}>
      <TextView variant={'MobileBody'} mb={theme.dimensions.standardMarginBetween}>
        {t('copays.pdfStatements.description')}
      </TextView>
      {statements.length > 0 ? (
        statements.map((statement, index) => (
          <Pressable
            key={`${statement.id}-${index}`}
            onPress={() => downloadStatement(statement.id)}
            accessible={true}
            accessibilityRole="link"
            accessibilityLabel={t('copays.pdfStatements.statementDate', {
              date: formatDate(statement.pSStatementDateOutput),
            })}
            accessibilityHint={t('copays.pdfStatements.statementDate.a11yLabel')}>
            <Box
              {...statementBoxProps}
              display={'flex'}
              flexDirection={'row'}
              justifyContent={'space-between'}
              alignItems={'center'}
              minHeight={theme.dimensions.touchableMinHeight}>
              <TextView flex={1} variant={'MobileBody'}>
                {index === 0
                  ? t('copays.pdfStatements.currentStatement')
                  : t('copays.pdfStatements.statementDate', { date: formatDate(statement.pSStatementDateOutput) })}
              </TextView>
              <Icon
                name={'ChevronRight'}
                fill={theme.colors.icon.chevronListItem}
                width={theme.dimensions.chevronListItemWidth}
                height={theme.dimensions.chevronListItemHeight}
              />
            </Box>
          </Pressable>
        ))
      ) : (
        <Box
          {...statementBoxProps}
          display={'flex'}
          flexDirection={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
          minHeight={theme.dimensions.touchableMinHeight}>
          <TextView flex={1} variant={'MobileBody'}>
            {t('copays.pdfStatements.noStatements')}
          </TextView>
        </Box>
      )}
    </Box>
  )

  return (
    <AccordionCollapsible
      header={<TextView variant={'MobileBodyBold'}>{t('copays.pdfStatements')}</TextView>}
      expandedContent={content}
      expandedInitialValue={false}
      noBorder
    />
  )
}

export default PDFStatements
