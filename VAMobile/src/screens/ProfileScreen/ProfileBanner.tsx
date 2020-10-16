import React, { FC } from 'react'
import styled from 'styled-components/native'

import { Box, TextView, VAIcon } from 'components'
import { View } from 'react-native'
import { testIdProps } from 'utils/accessibility'
import { themeFn } from 'utils/theme'

const StyledOuterView = styled.View`
	width: 100%;
	background-color: ${themeFn((t) => t.colors.text.primary)};
	min-height: 85px;
`

/**
 *  Signifies the props that need to be passed in to {@link ProfileBanner}
 */
export type ProfileBannerProps = {
	/** string signifying the name of the user logged in */
	name: string

	/** string signifying the user's most recent branch of service */
	mostRecentBranch: string
}

const ProfileBanner: FC<ProfileBannerProps> = ({ name, mostRecentBranch }) => {
	const getBranchSeal = (): React.ReactNode => {
		const dimensions = {
			width: 50,
			height: 50,
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
		<StyledOuterView>
			<Box m={20} display="flex" flexDirection="row">
				<View {...testIdProps(`${mostRecentBranch}-seal`)} accessibilityRole="image">
					{getBranchSeal()}
				</View>
				<Box ml={12} flex={1}>
					<TextView textTransform="capitalize" mb={5} variant="BitterBoldHeading" color="primaryContrast" {...testIdProps(name)} accessibilityRole="text">
						{name}
					</TextView>
					<TextView textTransform="capitalize" variant="MobileBody" color="primaryContrast" {...testIdProps(mostRecentBranch)} accessibilityRole="text">
						{mostRecentBranch}
					</TextView>
				</Box>
			</Box>
		</StyledOuterView>
	)
}

export default ProfileBanner
