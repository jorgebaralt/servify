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
				justifyContent: 'center'
			}}
		>
			<Text
				style={{
					textAlign: 'center',
					fontSize: 20,
					fontWeight: 'bold'
				}}
			>
				{props.title ? props.title : null}
			</Text>
			<TouchableOpacity
				style={{ position: 'absolute', left: 10 }}
			>
				{props.left}
			</TouchableOpacity>
			<TouchableOpacity
				style={{ position: 'absolute', right: 10 }}
			>
				{props.right}
			</TouchableOpacity>
		</View>
);
