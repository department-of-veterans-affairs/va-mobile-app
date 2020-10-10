import React, { FC } from 'react'
import styled from 'styled-components/native'

import { StyledBitterBoldText, StyledRowContent, StyledSourceRegularText } from 'styles/common'
import { ThemeType } from 'styles/theme'
import { VAIcon } from 'components'
import { View } from 'react-native'
import { testIdProps } from 'utils/accessibility'
import { useFontScale } from 'utils/common'

const StyledOuterView = styled.View`
	width: 100%;
	background-color: ${(props: ThemeType): string => props.theme.primaryBlack};
	min-height: 85px;
`

const StyledContentView = styled(StyledRowContent)`
	margin: 20px;
`

const StyledTextView = styled.ScrollView`
	margin-left: 12px;
	flex: 1;
`

const StyledNameText = styled(StyledBitterBoldText)`
	color: ${(props: ThemeType): string => props.theme.white};
	font-size: 20px;
	line-height: 26px;
`

const StyledBranchText = styled(StyledSourceRegularText)`
	color: ${(props: ThemeType): string => props.theme.white};
	font-size: 17px;
	line-height: 26px;
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
				return <VAIcon name="Airforce" {...dimensions} id="airForce" />
			case 'United States Army':
				return <VAIcon name="Army" {...dimensions} id="army" />
			case 'United States Coastal Guard':
				return <VAIcon name="CoastGuard" {...dimensions} id="coastalGuard" />
			case 'United States Marine Corps':
				return <VAIcon name="Marines" {...dimensions} id="marineCorps" />
			case 'United States Navy':
				return <VAIcon name="Navy" {...dimensions} id="navy" />
		}
	}

	return (
		<StyledOuterView {...testIdProps('Profile-banner')}>
			<StyledContentView>
				<View {...testIdProps('Profile-banner-seal')}>{getBranchSeal()}</View>
				<StyledTextView>
					<StyledNameText {...testIdProps('Profile-banner-name')}>{name}</StyledNameText>
					<StyledBranchText {...testIdProps('Profile-banner-branch')}>{mostRecentBranch}</StyledBranchText>
				</StyledTextView>
			</StyledContentView>
		</StyledOuterView>
	)
}

export default ProfileBanner
