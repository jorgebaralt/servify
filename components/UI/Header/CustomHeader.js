import React from 'react';
import { Header } from 'react-navigation';
import { View, Text, TouchableOpacity } from 'react-native';
import { colors } from '../../../shared/styles';

export const CustomHeader = (props) => (
	<View
		style={{
			height: Header.HEIGHT,
			borderBottomWidth: 0.5,
			borderBottomColor: colors.lightGray,
			justifyContent: 'center',
			backgroundColor: props.color ? props.color : colors.white,
			shadowOpacity: 0.05,
			shadowRadius: 5,
			shadowOffset: { width: 0, height: 5 }
		}}
	>
		<View>
			<Text
				style={{
					textAlign: 'center',
					fontSize: 20,
					fontWeight: 'bold',
					color: props.titleColor ? props.titleColor : colors.black
				}}
			>
				{props.title ? props.title : null}
			</Text>
			<TouchableOpacity style={{ position: 'absolute', left: 10 }}>
				{props.left}
			</TouchableOpacity>
			<TouchableOpacity style={{ position: 'absolute', right: 10 }}>
				{props.right}
			</TouchableOpacity>
		</View>

	</View>
);
