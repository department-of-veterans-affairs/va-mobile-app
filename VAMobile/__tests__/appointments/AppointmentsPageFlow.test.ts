import {androidScrollToElementWithText, goBackToPreviousScreen, tabTo} from '../utils'
import AppointmentsScreen from '../screenObjects/appointments.screen'
import UpcomingAppointmentsScreen from '../screenObjects/upcomingAppointments.screen'
import PastAppointmentsScreen from '../screenObjects/pastAppointments.screen'
import UpcomingAppointmentsDetailsScreen from '../screenObjects/upcomingAppointmentDetails.screen'
import PrepareForVideoVisitScreen from '../screenObjects/prepareForVideoVisit.screen'
import PastAppointmentDetailsScreen from '../screenObjects/pastAppointmentDetails.screen'

export default () => {
  before(async () => {
    await tabTo('Appointments')
    await AppointmentsScreen.waitForIsShown()
  })

  it('should render its content', async () => {
    const appointmentsUpcomingTab = await AppointmentsScreen.appointmentsUpcomingTab
    await expect(appointmentsUpcomingTab.isExisting()).resolves.toEqual(true)

    const appointmentsPastTab = await AppointmentsScreen.appointmentsPastTab
    await expect(appointmentsPastTab.isExisting()).resolves.toEqual(true)
  })

  describe('Upcoming appointments', () => {
    before(async () => {
      const appointmentsUpcomingTab = await AppointmentsScreen.appointmentsUpcomingTab
      await appointmentsUpcomingTab.click()
    })

    after( async () => {
      if (driver.isAndroid) {
        await androidScrollToElementWithText('Past')
      }
    })

    it('should render its content', async () => {
      await UpcomingAppointmentsScreen.waitForIsShown()
    })

    describe('on at home appointment type click', () => {
      before(async () => {
        await UpcomingAppointmentsScreen.waitForIsShown()

         if (driver.isAndroid) {
           await androidScrollToElementWithText('VA Video Connect at home')
         }

        const upcomingApptHomeAppointmentType = await UpcomingAppointmentsScreen.upcomingApptHomeAppointmentType('~wednesday,-august-11,-2021-1:15-pm-pdt-va-video-connect-at-home')
        await upcomingApptHomeAppointmentType.click()
      })

      after(async () => {
        await goBackToPreviousScreen()
        await UpcomingAppointmentsScreen.waitForIsShown()
      })

      it('should render the upcoming appointment details screen', async () => {
        await UpcomingAppointmentsDetailsScreen.waitForIsShown()
      })

      describe('on prepare for video visit link click', () => {
        before(async () => {
          await UpcomingAppointmentsDetailsScreen.waitForIsShown()
          const upcomingApptDetailsPrepareForVideoVisitLink = await UpcomingAppointmentsDetailsScreen.upcomingApptDetailsPrepareForVideoVisitLink
          await upcomingApptDetailsPrepareForVideoVisitLink.click()
        })

        after(async () => {
          await goBackToPreviousScreen()
          await UpcomingAppointmentsDetailsScreen.waitForIsShown()
        })

        it('should render the prepare for video visit screen', async () => {
          await PrepareForVideoVisitScreen.waitForIsShown()
        })
      })
    })
  })

  describe('Past appointments', () => {
    before(async () => {
      const appointmentsPastTab = await AppointmentsScreen.appointmentsPastTab
      await appointmentsPastTab.click()
    })

    it('should render its content', async () => {
      await PastAppointmentsScreen.waitForIsShown()
    })

    describe('on past appointment click', () => {
      before(async () => {
        await PastAppointmentsScreen.waitForIsShown()
        const pastAppt = await PastAppointmentsScreen.getPastApptWithID('~wednesday,-august-11,-2021-1:15-pm-pdt-va-video-connect-at-home')
        await pastAppt.click()
      })

      after(async () => {
        await goBackToPreviousScreen()
        await PastAppointmentsScreen.waitForIsShown()
      })

      it('should render the past appointment details screen', async () => {
        await PastAppointmentDetailsScreen.waitForIsShown()
      })
    })
  })
}
