import React from 'react';
import { Text, View } from 'react-native';
import { colors } from '../../../shared/styles';

export const Tooltip = (props) => (
	<View
		style={[
			{
				borderWidth: 1,
				borderColor: colors.primaryColor,
				backgroundColor: colors.primaryColor,
				alignSelf: 'flex-end',
				borderRadius: 4,
				zIndex: 10,
				padding: 10,
				position: 'absolute',
				shadowColor: colors.darkGray,
				shadowOpacity: 0.9,
				shadowOffset: { width: 0, height: 0 },
				shadowRadius: 3
			},
			props.style
		]}
	>
		{props.children}
	</View>
);
