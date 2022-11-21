/* eslint-disable sort-imports-es6-autofix/sort-imports-es6 */
import { DateTime } from 'luxon'
import { Animated, Platform, ScrollView, StyleSheet, Text, View, ViewStyle } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC, ReactElement, ReactNode, useEffect, useRef, useState } from 'react'

import { AlertBox, Box, ErrorComponent, FooterButton, SegmentedControl, VAScrollView } from 'components'
import { AppointmentsDateRange, prefetchAppointments } from 'store/slices/appointmentsSlice'
import { AppointmentsState, AuthorizedServicesState } from 'store/slices'
import { DowntimeFeatureTypeConstants, ScreenIDTypesConstants } from 'store/api/types'
import { HealthStackParamList } from '../screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { featureEnabled } from 'utils/remoteConfig'
import { testIdProps } from 'utils/accessibility'
import { useAppDispatch, useDowntime, useError, useHasCernerFacilities, useRouteNavigation, useTheme } from 'utils/hooks'
import { useSelector } from 'react-redux'
import CernerAlert from '../screens/HealthScreen/CernerAlert'
import NoMatchInRecords from '../screens/HealthScreen/Appointments/NoMatchInRecords/NoMatchInRecords'
import PastAppointments from '../screens/HealthScreen/Appointments/PastAppointments/PastAppointments'
import UpcomingAppointments from '../screens/HealthScreen/Appointments/UpcomingAppointments/UpcomingAppointments'

type AppointmentsScreenProps = StackScreenProps<HealthStackParamList, 'Appointments'>

export const getUpcomingAppointmentDateRange = (): AppointmentsDateRange => {
  const todaysDate = DateTime.local()
  const twelveMonthsFromToday = todaysDate.plus({ months: 12 })

  return {
    startDate: todaysDate.startOf('day').toISO(),
    endDate: twelveMonthsFromToday.endOf('day').toISO(),
  }
}

export type FeatureLandingProps = ChildTemplateProps // Passthrough to same props

export type ChildTemplateProps = {
  backLabel: string
  backLabelA11y?: string
  backLabelOnPress: () => void

  title: string
  titleA11y?: string

  headerButtonLabel?: string
  headerButtonIcon?: JSX.Element
  headerButtonOnPress?: () => void

  content: ReactNode
}

const HEADER_MAX_HEIGHT = 200
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 60 : 73
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT
const SUBHEADER_MAX_HEIGHT = 75

const ChildTemplate: FC<AppointmentsScreenProps> = ({}) => {
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const dispatch = useAppDispatch()
  const controlValues = [t('appointmentsTab.upcoming'), t('appointmentsTab.past')]
  const a11yHints = [t('appointmentsTab.upcoming.a11yHint'), t('appointmentsTab.past.a11yHint')]
  const [selectedTab, setSelectedTab] = useState(controlValues[0])
  const { upcomingVaServiceError, upcomingCcServiceError, pastVaServiceError, pastCcServiceError, currentPageAppointmentsByYear } = useSelector<RootState, AppointmentsState>(
    (state) => state.appointments,
  )
  const { appointments, scheduleAppointments } = useSelector<RootState, AuthorizedServicesState>((state) => state.authorizedServices)
  const hasCernerFacilities = useHasCernerFacilities()
  const apptsNotInDowntime = !useDowntime(DowntimeFeatureTypeConstants.appointments)
  const navigateToRequestAppointments = navigateTo('RequestAppointmentScreen')
  const navigateToNoRequestAppointmentAccess = navigateTo('NoRequestAppointmentAccess')

  const [initialScrollY, setInitialScrollY] = useState(new Animated.Value(Platform.OS === 'ios' ? -HEADER_MAX_HEIGHT - SUBHEADER_MAX_HEIGHT : 0))
  const scrollY = Animated.add(initialScrollY, Platform.OS === 'ios' ? HEADER_MAX_HEIGHT + SUBHEADER_MAX_HEIGHT : 0)

  const headerTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_SCROLL_DISTANCE],
    extrapolate: 'clamp',
  })

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 1, 0],
    extrapolate: 'clamp',
  })

  const imageTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 100],
    extrapolate: 'clamp',
  })

  const subtitleTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_SCROLL_DISTANCE * 1.5],
    extrapolate: 'clamp',
  })

  const titleScale = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 1, 0.8],
    extrapolate: 'clamp',
  })
  const titleTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0, -8],
    extrapolate: 'clamp',
  })

  // Resets scroll position to top whenever current page appointment list changes:
  // Previously IOS left position at the bottom, which is where the user last tapped to navigate to next/prev page.
  // Position reset is necessary to make the pagination component padding look consistent between pages,
  // since the appointment list sizes differ depending on content
  const scrollViewRef = useRef<ScrollView | null>(null)

  useEffect(() => {
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false })
  }, [currentPageAppointmentsByYear])

  useEffect(() => {
    const todaysDate = DateTime.local()
    const threeMonthsEarlier = todaysDate.minus({ months: 3 })

    const upcomingRange: AppointmentsDateRange = getUpcomingAppointmentDateRange()
    const pastRange: AppointmentsDateRange = {
      startDate: threeMonthsEarlier.startOf('day').toISO(),
      endDate: todaysDate.minus({ days: 1 }).endOf('day').toISO(),
    }

    // fetch upcoming and default past appointments ranges
    if (apptsNotInDowntime) {
      dispatch(prefetchAppointments(upcomingRange, pastRange, ScreenIDTypesConstants.APPOINTMENTS_SCREEN_ID))
    }
  }, [dispatch, apptsNotInDowntime])

  if (useError(ScreenIDTypesConstants.APPOINTMENTS_SCREEN_ID)) {
    return <ErrorComponent screenID={ScreenIDTypesConstants.APPOINTMENTS_SCREEN_ID} />
  }

  if (!appointments) {
    return <NoMatchInRecords />
  }

  const serviceErrorAlert = (): ReactElement => {
    const pastAppointmentError = selectedTab === t('appointmentsTab.past') && (pastVaServiceError || pastCcServiceError)
    const upcomingAppointmentError = selectedTab === t('appointmentsTab.upcoming') && (upcomingVaServiceError || upcomingCcServiceError)
    if (pastAppointmentError || upcomingAppointmentError) {
      return (
        <Box mx={theme.dimensions.gutter} mb={theme.dimensions.standardMarginBetween}>
          <AlertBox
            title={t('appointments.appointmentsStatusSomeUnavailable')}
            text={t('appointments.troubleLoadingSomeAppointments')}
            border="error"
            titleA11yLabel={t('appointments.appointmentsStatusSomeUnavailable.a11yLabel')}
            textA11yLabel={t('appointments.troubleLoadingSomeAppointments.a11yLabel')}
          />
        </Box>
      )
    }

    return <></>
  }

  const scrollStyles: ViewStyle = {
    flexGrow: 1,
  }

  const onRequestAppointmentPress = () => {
    scheduleAppointments ? navigateToRequestAppointments() : navigateToNoRequestAppointmentAccess()
  }

  return (
    <View style={styles.fill}>
      <Animated.ScrollView
        style={styles.fill}
        scrollEventThrottle={1}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: initialScrollY } } }], { useNativeDriver: true })}
        // iOS offset for RefreshControl
        contentInset={{
          top: HEADER_MAX_HEIGHT + SUBHEADER_MAX_HEIGHT,
        }}
        contentOffset={{
          x: 0,
          y: -HEADER_MAX_HEIGHT - SUBHEADER_MAX_HEIGHT,
        }}>
        {/* <VAScrollView scrollViewRef={scrollViewRef} {...testIdProps('Appointments-page')} contentContainerStyle={scrollStyles}> */}
        <Box flex={1} justifyContent="flex-start">
          <Box mb={theme.dimensions.standardMarginBetween} mt={theme.dimensions.contentMarginTop} mx={theme.dimensions.gutter}>
            <SegmentedControl
              values={controlValues}
              titles={controlValues}
              onChange={setSelectedTab}
              selected={controlValues.indexOf(selectedTab)}
              accessibilityHints={a11yHints}
            />
          </Box>
          {serviceErrorAlert()}
          <Box mb={hasCernerFacilities ? theme.dimensions.standardMarginBetween : 0}>
            <CernerAlert />
          </Box>
          <Box flex={1} mb={theme.dimensions.contentMarginBottom}>
            {selectedTab === t('appointmentsTab.past') && <PastAppointments />}
            {selectedTab === t('appointmentsTab.upcoming') && <UpcomingAppointments />}
          </Box>
        </Box>
      </Animated.ScrollView>
      {/* </VAScrollView> */}
      <Animated.View pointerEvents="none" style={[styles.header, { transform: [{ translateY: headerTranslate }] }]}>
        <Animated.Image
          style={[
            styles.backgroundImage,
            {
              opacity: imageOpacity,
              transform: [{ translateY: imageTranslate }],
            },
          ]}
          source={require('../../assets/cat.jpeg')}
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.bar,
          {
            transform: [{ scale: titleScale }, { translateY: titleTranslate }],
          },
        ]}>
        <Text style={styles.title}>Title</Text>
      </Animated.View>
      <Animated.View style={[styles.subheader, { transform: [{ translateY: subtitleTranslate }] }]}>
        <Text style={styles.subtitle}>Sub Title</Text>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#03A9F4',
    overflow: 'hidden',
    height: HEADER_MAX_HEIGHT,
    zIndex: 2,
  },
  subheader: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: HEADER_MAX_HEIGHT,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    overflow: 'hidden',
    height: SUBHEADER_MAX_HEIGHT,
    zIndex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: HEADER_MAX_HEIGHT,
    resizeMode: 'cover',
  },
  bar: {
    backgroundColor: 'transparent',
    marginTop: Platform.OS === 'ios' ? 28 : 38,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 4,
  },
  title: {
    color: 'white',
    fontSize: 18,
    zIndex: 5,
  },
  subtitle: {
    color: 'black',
    fontSize: 18,
  },
  scrollViewContent: {
    // iOS uses content inset, which acts like padding.
    paddingTop: Platform.OS !== 'ios' ? HEADER_MAX_HEIGHT : 0,
  },
  row: {
    height: 40,
    margin: 16,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default ChildTemplate
