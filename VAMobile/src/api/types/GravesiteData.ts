export type Gravesite = {
  decedent_id: string
  d_first_name: string
  d_mid_name?: string | null
  d_last_name: string
  cem_name: string
  cem_addr_one?: string | null
  city: string
  state: string
  zip: string
  cem_url?: string | null
  cem_phone?: string | null
  d_birth_date?: string
  d_death_date: string
  branch: string
  location_point: {
    type: string
    coordinates: Array<number>
  }
  war: string
}
