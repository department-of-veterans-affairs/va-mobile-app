import React, { FC, useCallback, useMemo, useState } from 'react'

import { Box, SelectorType, VAScrollView } from 'components'

import { Agenda, AgendaEntry, AgendaSchedule, CalendarList, DateData } from 'react-native-calendars'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { DateTime } from 'luxon'
import RadioGroup from '../../components/FormWrapper/FormFields/RadioGroup'
import VASelector from '../../components/FormWrapper/FormFields/VASelector'

const INITIAL_DATE = DateTime.now().toUTC().toFormat('MM/dd/yyyy')
const minDate = DateTime.now().plus({ days: 5 }).toUTC().toFormat('MM/dd/yyyy')
const maxDate = DateTime.now().plus({ days: 120 }).toUTC().toFormat('MM/dd/yyyy')
/**
 *
 * Returns Calendar component from Wix
 * IOS
 * default calendar - voiceOver does not work property - reads all months first and then dates in the wrong order
 * infinite scroll - screen reader works but scroll is difficult( disable is not state if it is)
 *
 * Android
 * default calendar/horizontal - works but navigating previous(first day) or next(go to the end of the month)
 * infinite scrolls - works well with screen reader( disable is not state if it is)
 */
const Calendar: FC = () => {
  // common
  const [selected, setSelected] = useState(INITIAL_DATE)
  const [limitDate, setLimitDate] = useState([false, false])

  // radio
  const [calendarType, setCalendarType] = useState('DefaultCalendar')

  // Agenda
  const [agendaItems, setAgendaItems] = useState<AgendaSchedule | undefined>(undefined)

  // const vacation = { key: 'vacation', color: 'red', selectedDotColor: 'blue' }
  // const massage = { key: 'massage', color: 'blue', selectedDotColor: 'blue' }
  // const workout = { key: 'workout', color: 'green' }

  // Common props
  const onDayPress = useCallback((day) => {
    setSelected(day.dateString)
  }, [])

  const markedDates = useMemo(() => {
    return {
      '2022-03-20': { textColor: 'green' },
      // '2022-03-22': { startingDay: true, color: 'green', dots: [massage, workout] },
      // '2022-03-23': { endingDay: true, color: 'green', textColor: 'gray', dots: [vacation, massage, workout] },
      '2022-03-04': { disabled: true, startingDay: true, color: 'green', endingDay: true },
      // multiple
      '2022-03-15': { marked: true, dotColor: '#50cebb' },
      '2022-03-16': { marked: true, dotColor: '#50cebb' },
      '2022-03-21': { startingDay: true, color: '#50cebb', textColor: 'white' },
      '2022-03-22': { color: '#70d7c7', textColor: 'white' },
      '2022-03-23': { color: '#70d7c7', textColor: 'white', marked: true, dotColor: 'white' },
      '2022-03-24': { color: '#70d7c7', textColor: 'white' },
      '2022-03-25': { endingDay: true, color: '#50cebb', textColor: 'white' },
      [selected]: {
        selected: true,
        selectedColor: '#DFA460',
      },
    }
  }, [selected])

  const commonProps = {
    minDate: limitDate[0] ? minDate : undefined,
    maxDate: limitDate[1] ? maxDate : undefined,
  }

  const renderMinMaxDateSelectors = () => {
    const minDateProps = {
      selectorType: SelectorType.Checkbox,
      selected: limitDate[0],
      onSelectionChange: () => {
        const updated = [...limitDate]
        updated[0] = !updated[0]
        setLimitDate(updated)
      },
      labelKey: 'Min Date(5 days after the current day)',
    }

    const maxDateProps = {
      selectorType: SelectorType.Checkbox,
      selected: limitDate[1],
      onSelectionChange: () => {
        const updated = [...limitDate]
        updated[1] = !updated[1]
        setLimitDate(updated)
      },
      labelKey: 'Max Date(120 days after the current date)',
    }

    return (
      <Box mb={20}>
        <VASelector {...minDateProps} />
        <VASelector {...maxDateProps} />
      </Box>
    )
  }

  const renderCalendar = () => {
    const calendarProps = {
      ...commonProps,
    }

    return (
      <>
        <VAScrollView>
          <CalendarList
            current={INITIAL_DATE}
            markedDates={markedDates}
            pastScrollRange={24}
            futureScrollRange={24}
            horizontal={true}
            pagingEnabled
            onDayPress={onDayPress}
            markingType={'period'}
            testID={'horizontalList'}
            staticHeader
            {...calendarProps}
          />
        </VAScrollView>
      </>
    )
  }

  /// Agenda
  const styles = StyleSheet.create({
    item: {
      backgroundColor: 'white',
      flex: 1,
      borderRadius: 5,
      padding: 10,
      marginRight: 10,
      marginTop: 17,
    },
    emptyDate: {
      height: 15,
      flex: 1,
      paddingTop: 30,
    },
  })

  const loadItems = (day: DateData) => {
    const items = agendaItems || {}

    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000
        const strTime = timeToString(time)

        if (!items[strTime]) {
          items[strTime] = []

          const numItems = Math.floor(Math.random() * 3 + 1)
          for (let j = 0; j < numItems; j++) {
            items[strTime].push({
              name: 'Item for ' + strTime + ' #' + j,
              height: Math.max(50, Math.floor(Math.random() * 150)),
              day: strTime,
            })
          }
        }
      }

      const newItems: AgendaSchedule = {}
      Object.keys(items).forEach((key) => {
        newItems[key] = items[key]
      })
      setAgendaItems(newItems)
    }, 1000)
  }

  const renderItem = (reservation: AgendaEntry, isFirst: boolean) => {
    const fontSize = isFirst ? 16 : 14
    const color = isFirst ? 'black' : '#43515c'

    return (
      <TouchableOpacity testID={'item'} style={[styles.item, { height: reservation.height }]} onPress={() => Alert.alert(reservation.name)}>
        <Text style={{ fontSize, color }}>{reservation.name}</Text>
      </TouchableOpacity>
    )
  }

  const renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text>This is empty date!</Text>
      </View>
    )
  }

  const rowHasChanged = (r1: AgendaEntry, r2: AgendaEntry) => {
    return r1.name !== r2.name
  }

  const timeToString = (time: number) => {
    const date = new Date(time)
    return date.toISOString().split('T')[0]
  }

  const renderAgenda = () => {
    const agendaProps = {
      commonProps,
    }
    return (
      <>
        <Agenda
          {...agendaProps}
          testID={'agenda'}
          items={agendaItems}
          loadItemsForMonth={loadItems}
          selected={selected}
          renderItem={renderItem}
          renderEmptyDate={renderEmptyDate}
          rowHasChanged={rowHasChanged}
          showClosingKnob={true}
          renderEmptyData={() => {
            return (
              <View>
                <Text>TEST</Text>
              </View>
            )
          }}
          // markingType={'period'}
          // markedDates={{
          //    '2017-05-08': {textColor: '#43515c'},
          //    '2017-05-09': {textColor: '#43515c'},
          //    '2017-05-14': {startingDay: true, endingDay: true, color: 'blue'},
          //    '2017-05-21': {startingDay: true, color: 'blue'},
          //    '2017-05-22': {endingDay: true, color: 'gray'},
          //    '2017-05-24': {startingDay: true, color: 'gray'},
          //    '2017-05-25': {color: 'gray'},
          //    '2017-05-26': {endingDay: true, color: 'gray'}}}
          // monthFormat={'yyyy'}
          // theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
          //renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
          // hideExtraDays={false}
          // showOnlySelectedDayItems
        />
      </>
    )
  }

  // Infinite Scroll
  const renderInfiniteScroll = () => {
    const calendarParams = {
      ...commonProps,
    }

    return (
      <>
        <CalendarList
          // Callback which gets executed when visible months change in scroll view. Default = undefined
          onVisibleMonthsChange={(months) => {
            console.log('now these months are visible', months)
          }}
          // Max amount of months allowed to scroll to the past. Default = 50
          pastScrollRange={0}
          // Max amount of months allowed to scroll to the future. Default = 50
          futureScrollRange={50}
          // Enable or disable scrolling of calendar list
          scrollEnabled={true}
          // Enable or disable vertical scroll indicator. Default = false
          showScrollIndicator={true}
          enableSwipeMonths={true}
          {...calendarParams}
        />
      </>
    )
  }

  // Horizontal Scroll
  const renderHorizontalList = () => {
    const horizontalProps = {
      ...commonProps,
    }
    return (
      <>
        <CalendarList
          // Enable horizontal scrolling, default = false
          horizontal={true}
          // Enable paging on horizontal, default = false
          pagingEnabled={true}
          current={INITIAL_DATE}
          {...horizontalProps}
        />
      </>
    )
  }

  // radio button
  const onSetCalendarType = (val: string) => {
    setCalendarType(val)
    // Reset
    setSelected(INITIAL_DATE)
  }

  const radioCalendarTypeProps = {
    options: [
      {
        labelKey: 'DefaultCalendar',
        value: 'default',
      },
      {
        labelKey: 'Agenda',
        value: 'Agenda',
      },
      {
        labelKey: 'InfiniteScroll',
        value: 'InfiniteScroll',
      },
      {
        labelKey: 'HorizontalList',
        value: 'HorizontalList',
      },
    ],
    value: calendarType,
    onChange: onSetCalendarType,
  }

  const renderCalendarType = () => {
    switch (calendarType) {
      case 'HorizontalList':
        return renderHorizontalList()
      case 'InfiniteScroll':
        return renderInfiniteScroll()
      case 'Agenda':
        return renderAgenda()
      case 'default':
      default:
        return renderCalendar()
    }
  }

  return (
    <>
      <Box backgroundColor={'contentBox'}>
        <RadioGroup {...radioCalendarTypeProps} />
        {renderMinMaxDateSelectors()}
      </Box>
      {renderCalendarType()}
    </>
  )
}

export default Calendar
