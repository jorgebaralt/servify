import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ListModal from '../Modal/ListModal';
import { colors } from '../../../shared/styles';

const renderModal = (props) => <ListModal {...props} />;

export const ListPicker = (props) => {
	const { selected } = props;
	return (
		<TouchableOpacity
			{...props}
			style={[
				{
					borderBottomWidth: props.selected ? 1.5 : 1,
					borderBottomColor: props.selected
						? props.color
						: colors.darkGray
				},
				props.style
			]}
		>
			{/* render selected item name OR placeholder */}
			{selected ? (
				<View>
					<Text style={{ color: props.color }}>
						{props.label}
					</Text>
					<Text style={{ fontSize: 16, marginTop: 5 }}>
						{selected.title}
					</Text>
				</View>
			) : (
				null || (
					<View style={{ width: '100%' }}>
						<Text style={styles.placeholderStyle}>
							{props.placeholder}
						</Text>
						<Ionicons
							type="Ionicons"
							size={20}
							name="ios-arrow-down"
							style={styles.iconStyle}
						/>
					</View>
				)
			)}
			{renderModal(props)}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	iconStyle: {
		position: 'absolute',
		right: 10,
		color: colors.darkGray
	},
	placeholderStyle: {
		color: colors.darkGray,
		fontSize: 20
	}
});
