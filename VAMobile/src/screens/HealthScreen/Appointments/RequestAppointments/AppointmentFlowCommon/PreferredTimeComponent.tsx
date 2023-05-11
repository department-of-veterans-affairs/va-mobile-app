import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, ButtonDecoratorType, DefaultList, DefaultListItemObj, TextLine, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { TimesForPhoneCallType } from 'store/api/types'
import { useTheme } from 'utils/hooks'
import AppointmentFlowErrorAlert from './AppointmentFlowErrorAlert'

type PreferredTimeComponentProps = {
  /** method to execute when a selection is pressed */
  onChange: (val: Array<TimesForPhoneCallType>) => void
  /** array of the selected options */
  selectedTimes: Array<TimesForPhoneCallType> | undefined
  /** optional error message*/
  errorMessage?: string
  /** title shown above the selections*/
  selectionTitle: string
}

// Common component for the time of contact selection on appointment request
const PreferredTimeComponent: FC<PreferredTimeComponentProps> = ({ selectedTimes, onChange, errorMessage, selectionTitle }) => {
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { gutter, standardMarginBetween, condensedMarginBetween } = theme?.dimensions?
  const selectedList = new Set(selectedTimes || [])

  const timesList = [
    { value: t('requestAppointment.timeMorningValue'), label: t('requestAppointment.timeMorningLabel') },
    { value: t('requestAppointment.timeAfternoonValue'), label: t('requestAppointment.timeAfternoonLabel') },
    { value: t('requestAppointment.timeEveningValue'), label: t('requestAppointment.timeEveningLabel') },
  ]

  const getValueList = () => {
    const listItems: Array<DefaultListItemObj> = timesList.map((item, index) => {
      const textLines: Array<TextLine> = [{ text: item.label, variant: 'VASelector', color: 'primary' }]
      const value = item.value as TimesForPhoneCallType
      const selected = selectedList.has(value)

      const onValueChanged = (): void => {
        if (!selected) {
          selectedList.add(value)
        } else {
          selectedList.delete(value)
        }
        onChange([...selectedList])
      }

      const checkBox: DefaultListItemObj = {
        textLines,
        decorator: selected ? ButtonDecoratorType.FilledCheckBox : ButtonDecoratorType.EmptyCheckBox,
        onPress: onValueChanged,
        minHeight: 64,
        a11yValue: selected ? tc('selected') : undefined,
        a11yRole: 'checkbox',
        testId: `${item.label} ${tc('option', { count: index + 1, totalOptions: timesList.length })}`,
      }

      return checkBox
    })

    return (
      <Box>
        <TextView mx={gutter} mb={errorMessage ? 0 : condensedMarginBetween} variant="MobileBodyBold">
          {selectionTitle}
        </TextView>
        <AppointmentFlowErrorAlert errorMessage={errorMessage} mb={standardMarginBetween} mt={standardMarginBetween} />
        <DefaultList items={listItems} />
      </Box>
    )
  }

  return <>{getValueList()}</>
}

export default PreferredTimeComponent
