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
			alignItems: 'center'
		},
		borderedButtonStyle: {
			borderColor: props.disabled ? colors.darkGray : (props.color ? props.color : 'white'),
			borderWidth: 1,
			backgroundColor: 'transparent',
		},
		transparentButtonStyle: {
			backgroundColor: 'transparent'
		},
		textStyle: {
			alignSelf: 'center',
			color: props.textColor ? props.textColor : 'white',
			fontSize: props.style ? (props.style.fontSize ? props.style.fontSize : 16) : 16
		},
	});

	let buttonStyle;

	if (props.bordered) {
		buttonStyle = [styles.defaultButton, styles.borderedButtonStyle, props.style];
	} else if (props.transparent) {
		buttonStyle = [styles.defaultButton, styles.transparentButtonStyle, props.style];
	}else{
		buttonStyle = [styles.defaultButton, props.style];
	}
	
	return (
		<TouchableOpacity onPress={props.onPress} style={[buttonStyle, props.style]} disabled={props.disabled}>
			<Text style={styles.textStyle}>
				{props.children}
			</Text>
		</TouchableOpacity>
	);
};
