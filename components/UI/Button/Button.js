/* eslint-disable no-dupe-keys */
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';


const Button = (props) => {
	const styles = StyleSheet.create({
		defaultButton: {
			flex: 1,
			alignSelf: 'flex-start',
			backgroundColor: props.color ? props.color : 'blue',
			padding: 10,
			borderRadius: 5,
			width: 'auto',
			marginLeft: 5,
			marginRight: 5,
		},
		defaultText: {
			alignSelf: 'center',
			color: 'white',
			fontSize: props.style ? (props.style.fontSize ? props.style.fontSize : 16) : 16
		},
		borderedButtonStyle: {
			flex: 1,
			alignSelf: 'flex-start',
			borderColor: props.color ? props.color : 'white',
			borderWidth: 1,
			backgroundColor: 'transparent',
			padding: 10,
			borderRadius: 5,
			width: 'auto',
			marginLeft: 5,
			marginRight: 5,
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
		buttonStyle = styles.borderedButtonStyle;
		textStyle = styles.borderedTextStyle;
	} else {
		buttonStyle = styles.defaultButton;
		textStyle = styles.defaultText;
	}
	
	return (
		<TouchableOpacity onPress={props.onPress} style={[buttonStyle, props.style]}>
			<Text style={textStyle}>
				{props.children}
			</Text>
		</TouchableOpacity>
	);
};

export default Button;
