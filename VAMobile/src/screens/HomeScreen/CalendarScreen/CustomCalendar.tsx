import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next'
import React, { FC, useState } from 'react'

import { Box, BoxProps, TextView, TextViewProps, VAIcon, VAIconProps } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { Pressable, PressableProps, useWindowDimensions } from 'react-native'
import { isIOS } from 'utils/platform'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from 'utils/hooks'

// TODO make more flexible
export enum DISABLED_WEEKDAYS {
  SUNDAY,
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
  WEEKEND,
  WEEKDAY,
}

// TODO add support for hints ex(current day, selected day, etc..)

export type CustomCalendarProps = {
  /** currently selected date */
  onSelected?: (selectedDate: DateTime) => void
  /** optional the date the calendar should start at, defaults to DateTime.now */
  initialDate?: DateTime
  /** optional earliest day for selection based on current day, any earlier are disabled */
  earliestDay?: number
  /** optional latest day for selection based on current day, any latest are disabled */
  latestDay?: number
  disableWeekdays?: DISABLED_WEEKDAYS
  // TODO add support to disable specific dates
}

// Values determine via checking max settings for a11y larger font for IOS and Android
const IOS_MAX_FONT_SCALE = 3.571
const ANDROID_MAX_FONT_SCALE = 1.299
// https://experienceleague.adobe.com/docs/target/using/experiences/vec/mobile-viewports.html
// broke around 428
const HEADER_MIN_WIDTH = 480

/**
 *
 * Returns Custom Calendar component
 */
const CustomCalendar: FC<CustomCalendarProps> = ({ initialDate, earliestDay, latestDay, onSelected, disableWeekdays }) => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const [activeDate, setActiveDate] = useState(initialDate || DateTime.now())
  const [selectedDate, setSelectedDate] = useState<DateTime | null>(null)
  const now = DateTime.now()

  const WEEKDAYS = [t('weekdays.sun'), t('weekdays.mon'), t('weekdays.tue'), t('weekdays.wed'), t('weekdays.thu'), t('weekdays.fri'), t('weekdays.sat')]
  const WEEKDAYS_SHORT = [
    t('weekdays.short.sun'),
    t('weekdays.short.mon'),
    t('weekdays.short.tue'),
    t('weekdays.short.wed'),
    t('weekdays.short.thu'),
    t('weekdays.short.fri'),
    t('weekdays.short.sat'),
  ]
  const { fontScale, width } = useWindowDimensions()
  const insets = useSafeAreaInsets()

  const calendarWidth = width - insets.right - insets.left - theme.dimensions.gutter * 2
  const columnWidth = calendarWidth / 7
  const maxFontScale = isIOS() ? IOS_MAX_FONT_SCALE : ANDROID_MAX_FONT_SCALE
  const smallScreen = width <= HEADER_MIN_WIDTH
  const isSmallScreenWithBigFont = fontScale > maxFontScale / 2 && smallScreen
  // https://stackoverflow.com/questions/929103/convert-a-number-range-to-another-range-maintaining-ratio
  const normalizeSize = (size: number) => {
    if (fontScale <= 1) {
      return size
    }

    const fontScaleRanges = { min: 1, max: maxFontScale }
    const fontSizeRanges = { min: size, max: size * 2 }
    const oldRange = fontScaleRanges.max - fontScaleRanges.min
    const newRange = fontSizeRanges.max - fontSizeRanges.min
    const newSize = ((fontScale - fontScaleRanges.min) * newRange) / oldRange + fontSizeRanges.min

    return newSize
  }

  const isWeekdayDisabled = (colIdx: number) => {
    const chosenDisabledDays = disableWeekdays
    if (disableWeekdays === undefined) {
      return false
    }

    if (chosenDisabledDays === DISABLED_WEEKDAYS.SUNDAY && colIdx === 0) {
      return true
    } else if (chosenDisabledDays === DISABLED_WEEKDAYS.MONDAY && colIdx === 1) {
      return true
    } else if (chosenDisabledDays === DISABLED_WEEKDAYS.TUESDAY && colIdx === 2) {
      return true
    } else if (chosenDisabledDays === DISABLED_WEEKDAYS.WEDNESDAY && colIdx === 3) {
      return true
    } else if (chosenDisabledDays === DISABLED_WEEKDAYS.THURSDAY && colIdx === 4) {
      return true
    } else if (chosenDisabledDays === DISABLED_WEEKDAYS.FRIDAY && colIdx === 5) {
      return true
    } else if (chosenDisabledDays === DISABLED_WEEKDAYS.SATURDAY && colIdx === 6) {
      return true
    } else if (chosenDisabledDays === DISABLED_WEEKDAYS.WEEKDAY && (colIdx === 1 || colIdx === 2 || colIdx === 3 || colIdx === 4 || colIdx === 5)) {
      return true
    } else if (chosenDisabledDays === DISABLED_WEEKDAYS.WEEKEND && (colIdx === 0 || colIdx === 6)) {
      return true
    }
    // Dont really need can probably rewrite this
    return false
  }
  const isBeforeEarliestDate = (currentDay: number) => {
    if (earliestDay === undefined) {
      return false
    }
    return activeDate.set({ day: currentDay }).startOf('day') < now.plus({ day: earliestDay }).startOf('day')
  }

  const isAfterLatestDate = (currentDay: number) => {
    if (latestDay === undefined) {
      return false
    }
    return activeDate.set({ day: currentDay }).startOf('day') > now.plus({ day: latestDay }).startOf('day')
  }

  const generateMatrix = () => {
    // [['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], [1, 2, 3, 4, 5, 6, 7], [8, 9]] etc...
    const matrix: Array<Array<string | number>> = []
    let weekdayOfFirstDay = activeDate.set({ day: 1 }).weekday as number
    // Sunday is 7 in luxon but we want it as 0 when we generate the calendar
    if (weekdayOfFirstDay === 7) {
      weekdayOfFirstDay = 0
    }
    const maxDays = activeDate.daysInMonth

    // create weekday header
    matrix[0] = isSmallScreenWithBigFont ? WEEKDAYS_SHORT : WEEKDAYS

    // Adds in the days
    let counter = 1
    for (let row = 1; row < 7; row++) {
      matrix[row] = []

      // skip making the last row if we already hit max days
      if (counter >= maxDays) {
        continue
      }

      for (let col = 0; col < 7; col++) {
        matrix[row][col] = -1

        if (row === 1 && col >= weekdayOfFirstDay) {
          // Fill in rows only after the first day of the month
          matrix[row][col] = counter++
        } else if (row > 1 && counter <= maxDays) {
          // Fill in rows only if the counter's not greater than
          // the number of the days in the month
          matrix[row][col] = counter++
        }
      }
    }

    return matrix
  }

  const renderMonth = () => {
    const matrix = generateMatrix()
    let rows = []
    rows = matrix.map((row, rowIndex) => {
      const rowItems = row.map((item, colIndex) => {
        // Header ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        if (rowIndex === 0) {
          const headerTextProps: TextViewProps = {
            flex: 1,
            mb: theme.dimensions.condensedMarginBetween,
            textAlign: 'center',
            variant: 'HelperText',
            color: 'calendarDay',
            maxFontSizeMultiplier: 2,
          }

          // Explict so we know its a string
          const weekday = item as string
          return (
            <TextView maxFontSizeMultiplier={2} key={`${rowIndex}_${colIndex}`} {...headerTextProps}>
              {weekday}
            </TextView>
          )
        }

        // Days
        // item at this point should always be a number so make it explict
        const day = item as number
        const disabled = isBeforeEarliestDate(day) || isAfterLatestDate(day) || isWeekdayDisabled(colIndex)
        const isSelected = activeDate.year === selectedDate?.year && activeDate.month === selectedDate?.month && selectedDate?.day === day
        const isCurrentDay = activeDate.year === now.year && activeDate.month === now.month && activeDate.day === day
        // A11y
        // use so that screen reader does not read empty days(-1) or show as clickable on voice control
        const accessible = day === -1 ? false : true

        const pressableProps: PressableProps = {
          accessibilityRole: 'button',
          // https://stackoverflow.com/questions/29283878/voiceover-announces-dimmed-instead-of-disabled-for-buttons
          disabled: disabled, // IOS dem button?
          onPress: () => {
            const newSelectedDay = activeDate.set({ day })
            setSelectedDate(newSelectedDay)

            if (onSelected) {
              onSelected(newSelectedDay)
            }
          },
          style: {
            flex: 1,
            // justifyContent: 'center',
            // backgroundColor: 'red',
            // margin: 1,
            marginBottom: smallScreen ? 15 : 0,
          },
          accessible,
          importantForAccessibility: day === -1 ? 'no' : 'yes', // Android a11y - so it does not read empty days
        }

        // TODO support labels or hints for selected day or current day
        const dayTextViewProps: TextViewProps = {
          variant: disabled ? 'HelperText' : 'HelperTextBold', // current day
          color: disabled ? 'calendarDayDisabled' : isSelected ? 'calendarDaySelected' : 'calendarDay',
          accessible,
          maxFontSizeMultiplier: 2,
        }

        // Need to handle larger scale
        const commonCircleProps: BoxProps = {
          borderWidth: 1,
          borderRadius: 100,
          width: columnWidth,
          height: columnWidth,
          position: 'absolute',
        }

        const currenDayCircleProps: BoxProps = {
          ...commonCircleProps,
          borderColor: 'calendarDaySelected',
        }

        const selectedDayCircleProps: BoxProps = {
          ...commonCircleProps,
          borderWidth: undefined,
          backgroundColor: 'calendarDaySelected',
        }

        return (
          <Pressable key={`${rowIndex}_${colIndex}`} {...pressableProps}>
            <Box position="relative" alignItems={'center'} justifyContent={'center'} height={columnWidth} overflow={'visible'}>
              {isCurrentDay && <Box {...currenDayCircleProps} overflow={'visible'} />}
              {isSelected && <Box {...selectedDayCircleProps} overflow={'visible'} />}
              <TextView {...dayTextViewProps}>{day !== -1 ? day : ''}</TextView>
            </Box>
          </Pressable>
        )
      })

      const monthView: BoxProps = {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
      }

      return (
        <Box key={rowIndex} {...monthView} width={'100%'}>
          {rowItems}
        </Box>
      )
    })

    return rows
  }

  const prevButtonProps: PressableProps = {
    accessibilityRole: 'button',
    onPress: () => {
      changeMonth(-1)
    },
    style: {
      justifyContent: 'center',
      minHeight: theme.dimensions.touchableMinHeight,
    },
  }

  const nextButtonProps: PressableProps = {
    accessibilityRole: 'button',
    onPress: () => {
      changeMonth(1)
    },
    style: {
      justifyContent: 'center',
      minHeight: theme.dimensions.touchableMinHeight,
    },
  }
  const changeMonth = (n: number) => {
    setActiveDate(activeDate.plus({ month: n }))
  }

  const renderHeader = () => {
    const headerBox: BoxProps = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      mb: 13,
    }

    const monthTextProps: TextViewProps = {
      textAlign: 'center',
      maxFontSizeMultiplier: 2,
      variant: 'MobileBody',
      color: 'calendarDay',
    }

    const commonIconProps: Partial<VAIconProps> = {
      width: normalizeSize(14),
      height: normalizeSize(16),
      fill: 'calendarArrow',
      preventScaling: true,
    }

    return (
      <Box {...headerBox}>
        <TextView {...monthTextProps}>{`${activeDate.monthLong} ${activeDate.year}`}</TextView>
        <Box flexDirection="row" justifyContent={'center'}>
          <Pressable {...prevButtonProps}>
            <VAIcon name={'ArrowLeft'} {...commonIconProps} />
          </Pressable>
          <Box mr={24} />
          <Pressable {...nextButtonProps}>
            <VAIcon name={'ArrowRight'} {...commonIconProps} />
          </Pressable>
        </Box>
      </Box>
    )
  }

  return (
    <Box mx={theme.dimensions.gutter}>
      {/*<View>*/}
      {/*  <TextView>{`width: ${width}`}</TextView>*/}
      {/*</View>*/}
      {/*<View>*/}
      {/*  <TextView>{`ratio: ${width / height}`}</TextView>*/}
      {/*</View>*/}
      {/*<View>*/}
      {/*  <TextView>{`nomralize : ${normalizeSize(14)}`}</TextView>*/}
      {/*</View>*/}
      {renderHeader()}
      {renderMonth()}
    </Box>
  )
}

export default CustomCalendar
