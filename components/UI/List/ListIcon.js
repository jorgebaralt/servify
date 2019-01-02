import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { colors } from '../../../shared/styles';

export const ListIcon = (props) => {
	return (
		<TouchableOpacity onPress={props.onPress} style={[styles.viewStyle, props.style]}>
			{props.left}
			<View style={{ position: 'absolute', right: 0 }}>
				{props.right}
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	viewStyle: { borderBottomWidth: 0.5, borderColor: colors.lightGray, marginLeft: 20, marginRight: 20, paddingBottom: 10 }
});
