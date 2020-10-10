import React, { FC } from 'react'
import styled from 'styled-components/native'

import { Box, TextView, VAIcon } from 'components'
import { View } from 'react-native'
import { testIdProps } from 'utils/accessibility'
import { themeFn } from 'utils/theme'
import { useFontScale } from 'utils/common'

const StyledOuterView = styled.View`
	width: 100%;
	background-color: ${themeFn((t) => t.colors.text.primary)};
	min-height: 85px;
`

/**
 *  Signifies the props that need to be passed in to {@link ProfileBanner}
 *  name - string signifying the name of the user logged in
 *  mostRecentBranch - string signifying the user's most recent branch of service
 */
export type ProfileBannerProps = {
	name: string
	mostRecentBranch: string
}

const ProfileBanner: FC<ProfileBannerProps> = ({ name, mostRecentBranch }) => {
	const fs = useFontScale()

	const getBranchSeal = (): React.ReactNode => {
		const dimensions = {
			width: fs(50),
			height: fs(50),
		}

		switch (mostRecentBranch) {
			case 'United States Air Force':
				return <VAIcon name="Airforce" {...dimensions} {...testIdProps('Airforce')} />
			case 'United States Army':
				return <VAIcon name="Army" {...dimensions} {...testIdProps('Army')} />
			case 'United States Coastal Guard':
				return <VAIcon name="CoastGuard" {...dimensions} {...testIdProps('Coast-Guard')} />
			case 'United States Marine Corps':
				return <VAIcon name="Marines" {...dimensions} {...testIdProps('Marine-Corps')} />
			case 'United States Navy':
				return <VAIcon name="Navy" {...dimensions} {...testIdProps('Navy')} />
		}
	}

	return (
		<StyledOuterView {...testIdProps('Profile-banner')}>
			<Box m={20} display="flex" flexDirection="row">
				<View {...testIdProps('Profile-banner-seal')}>{getBranchSeal()}</View>
				<Box ml={12} flex={1}>
					<TextView mb={5} variant="h3" color="primaryContrast" {...testIdProps('Profile-banner-name')}>
						{name}
					</TextView>
					<TextView variant="body1" color="primaryContrast" {...testIdProps('Profile-banner-branch')}>
						{mostRecentBranch}
					</TextView>
				</Box>
			</Box>
		</StyledOuterView>
	)
}

export default ProfileBanner
