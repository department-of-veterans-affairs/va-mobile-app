export type DemoUserIds = 'kimberlyWashington' | 'benjaminAdams' | 'claraJefferson' | 'dennisMadison' | 'johnMonroe'
type DemoUsersT = Record<
  DemoUserIds,
  {
    name: string
    notes?: string
  }
>

const DemoUsers: DemoUsersT = {
  kimberlyWashington: {
    name: 'Kimberly Washington',
    notes: 'US Coast Guard. Default demo user.',
  },
  benjaminAdams: {
    name: 'Benjamin Adams',
    notes: 'US Army. No appointments, claims, prescriptions or messages.',
  },
  claraJefferson: {
    name: 'Clara Jefferson',
    notes: 'US Air Force. All authorized services disabled',
  },
  dennisMadison: {
    name: 'Dennis Madison',
    notes: 'United States Marine Corps. Appointments in timezones GMT+10, GMT+8 and GMT-11 ',
  },
  johnMonroe: {
    name: 'John Monroe',
    notes: 'US Coast Guard. DO NOT UPDATE.  Used for screenshots.',
  },
}

export default DemoUsers
