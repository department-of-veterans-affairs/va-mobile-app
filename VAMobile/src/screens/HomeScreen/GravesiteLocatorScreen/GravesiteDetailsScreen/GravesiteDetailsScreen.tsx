import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { Icon, Link } from '@department-of-veterans-affairs/mobile-component-library'

import { BranchOfService, BranchesOfServiceConstants } from 'api/types'
import { Box, FeatureLandingTemplate, Map, MilitaryBranchEmblem, TextArea, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { useTheme } from 'utils/hooks'

type GravesiteDetailsScreenProps = StackScreenProps<HomeStackParamList, 'GravesiteDetails'>

function GravesiteDetailsScreen({ navigation, route }: GravesiteDetailsScreenProps) {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)

  const { gravesite } = route.params

  function formatDate(dateStr: string): string {
    if (dateStr.includes('/')) {
      const [month, day, year] = dateStr.split('/')
      const date = new Date(`${year}-${month}-${day}`)
      return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    } else {
      return dateStr
    }
  }

  function formatBirthDeathDates(birthDate: string | undefined, deathDate: string): string {
    if (birthDate && deathDate) {
      return `${formatDate(birthDate)} - ${formatDate(deathDate)}`
    } else {
      return formatDate(deathDate)
    }
  }

  const getBranchOfService = (branch: string): BranchOfService | undefined => {
    if (branch.includes('AIR FORCE')) {
      return BranchesOfServiceConstants.AirForce
    } else if (branch.includes('ARMY')) {
      return BranchesOfServiceConstants.Army
    } else if (branch.includes('COAST GUARD')) {
      return BranchesOfServiceConstants.CoastGuard
    } else if (branch.includes('MARINE CORPS')) {
      return BranchesOfServiceConstants.MarineCorps
    } else if (branch.includes('NAVY')) {
      return BranchesOfServiceConstants.Navy
    }
  }

  const branch = getBranchOfService(gravesite.branch)

  const name = gravesite.d_mid_name
    ? `${gravesite.d_first_name} ${gravesite.d_mid_name} ${gravesite.d_last_name}`
    : `${gravesite.d_first_name} ${gravesite.d_last_name}`
  const birthDeathDates = formatBirthDeathDates(gravesite.d_birth_date, gravesite.d_death_date)
  const locationData = {
    name: gravesite.cem_name,
    address: {
      street: gravesite.cem_addr_one ?? '',
      city: gravesite.city,
      state: gravesite.state,
      zipCode: gravesite.zip,
    },
    latitude: gravesite.location_point?.coordinates[1],
    longitude: gravesite.location_point?.coordinates[0],
  }

  return (
    <FeatureLandingTemplate
      title={t('gravesite.details.title')}
      backLabel={t('home.title')}
      backLabelOnPress={navigation.goBack}>
      <TextArea>
        <Box alignItems="center">
          {branch && <MilitaryBranchEmblem branch={branch} width={100} height={100} />}
          <TextView variant="MobileBodyBold">{name}</TextView>
          <TextView variant="MobileBodyTight">{birthDeathDates}</TextView>
          {gravesite.war && <TextView variant="MobileBodyTight">{gravesite.war}</TextView>}
        </Box>
      </TextArea>
      <Box flex={1} mt={theme.dimensions.standardMarginBetween}>
        <TextArea>
          <Box alignItems="center">
            <TextView variant="MobileBodyBold">{t('gravesite.details.restingPlace')}</TextView>
          </Box>
          {locationData.latitude && locationData.longitude && (
            <Map latitude={locationData.latitude} longitude={locationData.longitude} />
          )}
          <Box flexDirection="row" alignItems="center" pt={theme.dimensions.standardMarginBetween}>
            <Icon name="LocationOn" />
            <Box mx={theme.dimensions.textIconMargin}>
              <TextView variant="MobileBodyTight">{`${gravesite.cem_name}`}</TextView>
              {gravesite.cem_addr_one && <TextView variant="MobileBodyTight">{`${gravesite.cem_addr_one}`}</TextView>}
              <TextView variant="MobileBodyTight">{`${gravesite.city}, ${gravesite.state} ${gravesite.zip}`}</TextView>
            </Box>
          </Box>
          {gravesite.cem_phone && <Link type="call" text={gravesite.cem_phone} phoneNumber={gravesite.cem_phone} />}
          <Link type="directions" text={t('directions')} locationData={locationData} />
        </TextArea>
      </Box>
    </FeatureLandingTemplate>
  )
}

export default GravesiteDetailsScreen
