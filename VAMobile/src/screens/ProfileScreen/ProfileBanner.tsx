import React, { FC } from 'react'
import styled from 'styled-components/native'

import { StyledBitterBoldText, StyledSourceRegularText } from 'styles/common'
import { ThemeType } from 'styles/theme'
import { View } from 'react-native'
import Air_Force from 'images/profileIcon/air-force.svg'
import Army from 'images/profileIcon/army.svg'
import Coastal_Guard from 'images/profileIcon/coastal-guard.svg'
import Marine_Corps from 'images/profileIcon/marine.svg'
import Navy from 'images/profileIcon/navy.svg'

const StyledOuterView = styled.View`
	width: 100%;
	background-color: ${(props: ThemeType): string => props.theme.primaryBlack};
	min-height: 85px;
`

const StyledContentView = styled.View`
	display: flex;
	flex-direction: row;
	flex: 1;
	align-items: center;
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

export type ProfileBannerProps = {
	name: string
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
				return <Air_Force {...dimensions} />
			case 'United States Army':
				return <Army {...dimensions} />
			case 'United States Coastal Guard':
				return <Coastal_Guard {...dimensions} />
			case 'United States Marine Corps':
				return <Marine_Corps {...dimensions} />
			case 'United States Navy':
				return <Navy {...dimensions} />
		}
	}

	return (
		<StyledOuterView>
			<StyledContentView>
				<View>{getBranchSeal()}</View>
				<StyledTextView>
					<StyledNameText>{name}</StyledNameText>
					<StyledBranchText>{mostRecentBranch}</StyledBranchText>
				</StyledTextView>
			</StyledContentView>
		</StyledOuterView>
	)
}

export default ProfileBanner
