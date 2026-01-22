import React from 'react'
import { useTranslation } from 'react-i18next'
import FileViewer from 'react-native-file-viewer'

import { TFunction } from 'i18next'

import { AppointmentAttributes, SummaryObject } from 'api/types'
import { Box, DefaultList, DefaultListItemObj, TextLineWithIconProps, TextView } from 'components'
import { AfterVisitSummaryToIncludeOH, AfterVisitSummaryToIncludeVistA } from 'constants/appointments'
import { NAMESPACE } from 'constants/namespaces'
import { VATheme, VATypographyThemeVariants } from 'styles/theme'
import { getA11yLabelText } from 'utils/common'
import { createFileFromBase64, isValidBase64, unlinkFile } from 'utils/filesystem'
import { useTheme } from 'utils/hooks'

export type AppointmentAfterVisitSummaryProps = {
  attributes: AppointmentAttributes
}

// Export for testing - deletes the file at filePath when the viewer is dismissed
export const handleDismiss = (filePath: string) => {
  return () => {
    unlinkFile(filePath).catch((e) => {
      console.warn('Could not delete AVS file after viewing:', e)
    })
  }
}

export const getListItemVals = (
  summaries: SummaryObject[] | undefined,
  isCerner: boolean,
  theme: VATheme,
  t: TFunction<'common', undefined>,
): Array<DefaultListItemObj> => {
  if (!summaries || !summaries.length) {
    return []
  }
  const listItems: Array<DefaultListItemObj> = []
  const variant = 'MobileBodyBold' as keyof VATypographyThemeVariants
  const AvsToInclude = isCerner ? AfterVisitSummaryToIncludeOH : AfterVisitSummaryToIncludeVistA
  const AvsKeys = Object.keys(AvsToInclude)
  const filteredSummaries = summaries?.filter(
    (summary) => AvsKeys.includes(summary.noteType) && summary.binary && isValidBase64(summary.binary),
  )
  const validSummariesByNotetype = filteredSummaries.reduce(
    (accSummaries, curr) => {
      const noteTypeName = AvsToInclude[curr.noteType]
      accSummaries[noteTypeName] = [...(accSummaries[noteTypeName] || []), curr]
      return accSummaries
    },
    {} as Record<string, SummaryObject[]>,
  )
  Object.entries(validSummariesByNotetype).forEach(([noteType, arrayOfSummariesOfType]) => {
    const numSummaryOfType = arrayOfSummariesOfType.length
    for (let i = 0; i < numSummaryOfType; i++) {
      const summary = arrayOfSummariesOfType[i]
      const textLines: Array<TextLineWithIconProps> = [
        {
          text: t(`appointments.afterVisitSummary.review.${noteType}`, {
            index: numSummaryOfType > 1 ? ` ${i + 1}` : '',
          }),
          variant,
          iconProps: { name: 'Description', fill: theme.colors.icon.defaultMenuItem },
        },
      ]

      const onPress = () => {
        createFileFromBase64(summary.binary, `${summary.name.split(' ').join('_')}_${summary.id}_${i + 1}.pdf`).then(
          (filePath) => {
            FileViewer.open(filePath, { onDismiss: handleDismiss(filePath) })
          },
        )
        return true
      }

      listItems.push({
        textLines,
        onPress,
        testId: getA11yLabelText(textLines), // read by screen reader
      })
    }
  })
  for (let li = 0; li < listItems.length; li++) {
    // while we can do position in the forEach, we cannot get the total immediately
    listItems[li].a11yValue = t('listPosition', { position: li + 1, total: listItems.length })
  }

  return listItems
}

export default function AppointmentAfterVisitSummary({ attributes }: AppointmentAfterVisitSummaryProps) {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  // Currently only Cerner appointments have AVS PDFs (VistA will in the future -- currently only a web version)
  if (!attributes.isCerner || attributes.avsError) return null
  const listItems = getListItemVals(attributes.avsPdf, attributes.isCerner, theme, t)

  return (
    <Box testID="AppointmentAfterVisitSummary" mb={theme.dimensions.standardMarginBetween}>
      <TextView
        variant="MobileBodyBold"
        accessibilityRole="header"
        mb={listItems.length ? theme.dimensions.smallMarginBetween : 0}
        px={theme.dimensions.cardPadding}>
        {t('appointments.afterVisitSummary.title') + ' '}
        {/* Space is required because otherwise Android makes a huge gap */}
      </TextView>
      {!listItems.length ? (
        <TextView variant="MobileBody" mt={0} px={theme.dimensions.cardPadding} selectable testID="NoAvsAvailable">
          {t('appointments.afterVisitSummary.noneAvailable') + ' '}
        </TextView>
      ) : (
        <DefaultList items={listItems} />
      )}
    </Box>
  )
}
