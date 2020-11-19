import { tabTo } from '../utils'
import AppointmentsScreen from '../screenObjects/appointments.screen'
import UpcomingAppointmentsScreen from '../screenObjects/upcomingAppointments.screen'

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
    it('should render its content', async () => {
      const appointmentsUpcomingTab = await AppointmentsScreen.appointmentsUpcomingTab
      await appointmentsUpcomingTab.click()
      await UpcomingAppointmentsScreen.waitForIsShown()
    })
  })
}
