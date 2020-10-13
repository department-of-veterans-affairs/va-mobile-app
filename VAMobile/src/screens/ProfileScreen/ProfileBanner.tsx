import React, { FC } from 'react'
import styled from 'styled-components/native'

import { Box, TextView, TextViewProps, VAIcon } from 'components'
import { View } from 'react-native'
import { testIdProps } from 'utils/accessibility'
import { themeFn } from 'utils/theme'
import { useFontScale } from 'utils/common'

/**
 * Signifies the style flags for the profile banner
 */
export enum ProfileBannerStyle {
	TextTransformCapitalize,
}

const StyledOuterView = styled.View`
	width: 100%;
	background-color: ${themeFn((t) => t.colors.text.primary)};
	min-height: 85px;
`

const StyledNameText = styled(TextView)`
	text-transform: capitalize;
`

/**
 *  Signifies the props that need to be passed in to {@link ProfileBanner}
 */
export type ProfileBannerProps = {
	/** string signifying the name of the user logged in */
	name: string

	/** string signifying the user's most recent branch of service */
	mostRecentBranch: string

	/** if TextTransformCapitalize, should apply the style text transform: capitalize to the user's name */
	bannerStyle?: ProfileBannerStyle
}

const ProfileBanner: FC<ProfileBannerProps> = ({ name, mostRecentBranch, bannerStyle }) => {
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

	const nameTextProps: TextViewProps = {
		mb: 5,
		variant: 'BitterBoldHeading',
		color: 'primaryContrast',
	}

	return (
		<StyledOuterView {...testIdProps('Profile-banner')}>
			<Box m={20} display="flex" flexDirection="row">
				<View {...testIdProps('Profile-banner-seal')}>{getBranchSeal()}</View>
				<Box ml={12} flex={1}>
					{bannerStyle === ProfileBannerStyle.TextTransformCapitalize ? (
						<StyledNameText {...nameTextProps} {...testIdProps('Profile-banner-name')}>
							{name}
						</StyledNameText>
					) : (
						<TextView {...nameTextProps} {...testIdProps('Profile-banner-name')}>
							{name}
						</TextView>
					)}
					<TextView variant="MobileBody" color="primaryContrast" {...testIdProps('Profile-banner-branch')}>
						{mostRecentBranch}
					</TextView>
				</Box>
			</Box>
		</StyledOuterView>
	)
}

export default ProfileBanner
