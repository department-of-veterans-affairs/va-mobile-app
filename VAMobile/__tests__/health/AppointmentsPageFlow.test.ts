import { androidScrollToElementWithText, goBackToPreviousScreen, tabTo, waitForIsShown } from '../utils'
import AppointmentsScreen from '../screenObjects/appointments.screen'
import HealthScreen from '../screenObjects/health.screen'
import UpcomingAppointmentsScreen from '../screenObjects/upcomingAppointments.screen'
import PastAppointmentsScreen from '../screenObjects/pastAppointments.screen'
import UpcomingAppointmentsDetailsScreen from '../screenObjects/upcomingAppointmentDetails.screen'
import PrepareForVideoVisitScreen from '../screenObjects/prepareForVideoVisit.screen'
import PastAppointmentDetailsScreen from '../screenObjects/pastAppointmentDetails.screen'

export default () => {
  before(async () => {
    await tabTo('Health')
    await HealthScreen.waitForIsShown()
  })

  describe('on click of the appointments button', () => {
    before(async () => {
      const appointmentsButton = await HealthScreen.appointmentsButton
      await appointmentsButton.click()
    })

    after(async () => {
      await goBackToPreviousScreen()
      await HealthScreen.waitForIsShown()
    })

    it('should render the appointment screen content', async () => {
      await AppointmentsScreen.waitForIsShown()
    })

    // TODO Appointments not guaranteed everytime uncomment when stable
    describe('Upcoming appointments', () => {
      before(async () => {
        await AppointmentsScreen.waitForIsShown()
        const appointmentsUpcomingTab = await AppointmentsScreen.appointmentsUpcomingTab
        await appointmentsUpcomingTab.click()
      })

      after( async () => {
        if (driver.isAndroid) {
          await androidScrollToElementWithText('Past')
        }
      })

      it('should show no appointments screen', async () => {
        await waitForIsShown(UpcomingAppointmentsScreen.noUpcomingApptScreen)
      })

      xit('should render its content', async () => {
        await UpcomingAppointmentsScreen.waitForIsShown()
      })

      xdescribe('on at home appointment type click', () => {
        before(async () => {
          await UpcomingAppointmentsScreen.waitForIsShown()

          if (driver.isAndroid) {
            await androidScrollToElementWithText('VA Video Connect at home')
          }

          const upcomingApptHomeAppointmentType = await UpcomingAppointmentsScreen.upcomingApptHomeAppointmentType('~Monday, March 29, 2021 5:30 PM EDT VA Video Connect at home')
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
        await AppointmentsScreen.waitForIsShown()
        const appointmentsPastTab = await AppointmentsScreen.appointmentsPastTab
        await appointmentsPastTab.click()
      })

      xit('should show no appointments screen', async () => {
        await waitForIsShown(PastAppointmentsScreen.noPastApptScreen)
      })

      it('should render its content', async () => {
        await PastAppointmentsScreen.waitForIsShown()
      })

      describe('on past appointment click', () => {
        before(async () => {
          await PastAppointmentsScreen.waitForIsShown()
          const pastAppt = await PastAppointmentsScreen.getPastApptWithID('~Monday, March 29, 2021 5:30 PM EDT VA Video Connect at an ATLAS location')
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
  })
}
