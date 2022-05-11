import React, { FC, useState } from 'react'

import { Box, TextView, VAScrollView } from 'components'
import { Button, Text, TextProps, View, ViewProps } from 'react-native'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const NDAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

const isLeapYear = (year: number) => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}
/**
 *
 * Returns Custom Calendar component
 */
const CustomCalendar: FC = () => {
  // Use luxon instead of hardcoded date
  const [activeDate, setActiveDate] = useState(new Date(Date.now()))

  const generateMatrix = () => {
    // [['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], [1, 2, 3, 4, 5, 6, 7], [8, 9]] etc...
    const matrix: Array<Array<string | number>> = []
    const year = activeDate.getFullYear()
    const month = activeDate.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    let maxDays = NDAYS[month]

    // Feb edge case
    if (month === 1 && isLeapYear(year)) {
      maxDays += 1
    }

    // create header
    matrix[0] = WEEKDAYS

    // Adds in the days
    let counter = 1
    for (let row = 1; row < 7; row++) {
      matrix[row] = []
      for (let col = 0; col < 7; col++) {
        matrix[row][col] = -1

        if (row === 1 && col >= firstDay) {
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

  const onPress = (item: number | string) => {
    console.log(item)
    // if (!item.match && item !== -1) {
    //   setActiveDate(item)
    // }
  }

  const renderMonth = () => {
    const matrix = generateMatrix()
    let rows = []
    rows = matrix.map((row, rowIndex) => {
      const rowItems = row.map((item, colIndex) => {
        const style = {
          flex: 1,
          height: 18,
          textAlign: 'center',
          // Highlight header
          backgroundColor: rowIndex === 0 ? '#ddd' : '#fff',
          // Highlight Sundays
          color: colIndex === 0 ? '#a00' : '#000',
          // Highlight current date
          fontWeight: item === activeDate.getDate() ? 'bold' : undefined,
        } as TextProps['style']

        // TODO, make it less clunky if possible Keyboard and  voice control
        // let a11yText = {}
        //
        // if (item === -1) {
        //   a11yText = {
        //     accessible: false,
        //   }
        // }
        //
        // let selectableText = {
        //   selectable: true,
        // }
        //
        // if (item === -1) {
        //   selectableText = {
        //     selectable: false,
        //   }
        // }

        return (
          <Text
            style={style}
            onPress={() => {
              // onPress causes it to highlight
              onPress(item)
            }}>
            {item !== -1 ? item : ''}
          </Text>
        )
      })

      const viewStyle = {
        flex: 1,
        flexDirection: 'row',
        padding: 15,
        justifyContent: 'space-around',
        alignItems: 'center',
      } as ViewProps['style']

      return <View style={viewStyle}>{rowItems}</View>
    })

    return rows
  }

  const changeMonth = (n: number) => {
    const newActiveDate = new Date(activeDate.getTime())
    newActiveDate.setMonth(activeDate.getMonth() + n)
    setActiveDate(newActiveDate)
  }

  return (
    <VAScrollView>
      <Box>
        <Box flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
          <Button
            title={'Prev'}
            onPress={() => {
              changeMonth(-1)
            }}
          />
          <TextView>{`${MONTHS[activeDate.getMonth()]} ${activeDate.getFullYear()}`}</TextView>
          <Button
            title={'Next'}
            onPress={() => {
              changeMonth(1)
            }}
          />
        </Box>
        {renderMonth()}
      </Box>
    </VAScrollView>
  )
}

export default CustomCalendar
