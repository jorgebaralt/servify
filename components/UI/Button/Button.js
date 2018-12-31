/* eslint-disable no-dupe-keys */
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../../../shared/styles';

export const Button = (props) => {
	const styles = StyleSheet.create({
		defaultButton: {
			alignSelf: 'flex-start',
			backgroundColor: props.disabled ? colors.darkGray : props.color ? props.color : 'blue',
			padding: 10,
			borderRadius: 5,
			width: 'auto',
		},
		defaultText: {
			alignSelf: 'center',
			color: 'white',
			fontSize: props.style ? (props.style.fontSize ? props.style.fontSize : 16) : 16
		},
		borderedButtonStyle: {
			borderColor: props.disabled ? colors.darkGray : (props.color ? props.color : 'white'),
			borderWidth: 1,
			backgroundColor: 'transparent',
		},
		borderedTextStyle: {
			alignSelf: 'center',
			fontSize: 20,
			color: props.color ? props.color : 'white',
			fontSize: props.style ? (props.style.fontSize ? props.style.fontSize : 16) : 16
		}
	});

	let buttonStyle;
	let textStyle;

	if (props.bordered) {
		buttonStyle = [styles.defaultButton, styles.borderedButtonStyle, props.style];
		textStyle = styles.borderedTextStyle;
	} else {
		buttonStyle = [styles.defaultButton, props.style];
		textStyle = styles.defaultText;
	}
	
	return (
		<TouchableOpacity onPress={props.onPress} style={[buttonStyle, props.style]} disabled={props.disabled}>
			<Text style={textStyle}>
				{props.children}
			</Text>
		</TouchableOpacity>
	);
};
