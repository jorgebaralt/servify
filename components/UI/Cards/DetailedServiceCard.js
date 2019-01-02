import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StarsRating from '../../Ratings/StarsRating';
import { colors } from '../../../shared/styles';
import { FadeImage } from '..';

export const DetailedServiceCard = (props) => {
	const { service } = props;
	return (
		<TouchableOpacity
			style={styles.touchCardStyle}
			onPress={props.onPress}
		>
			<View
				style={styles.contanierViewStyle}
			>
				<View
					style={styles.imageContainerStyle}
				>
					<FadeImage
						image={require('../../../assets/default/baby/1.jpg')}
						style={styles.imageStyle}
					/>
				</View>
				<View style={{ paddingLeft: 10, marginLeft: 80, marginRight: 20 }}>
					<Text
						style={[styles.titleStyle, { color: props.color }]}
					>
						{service.title}
					</Text>
					<Text style={{ fontSize: 12 }}>{service.displayName}</Text>
					<View style={{ flexDirection: 'row' }}>
						<StarsRating
							width={15}
							height={15}
							spacing={5}
							rating={service.rating}
						/>
						<Text style={{ color: colors.darkGray }}>
							({service.rating})
						</Text>
					</View>
					<Text style={{ fontSize: 12, color: colors.darkerGray }}>
						{service.description.substring(0, 30) + '...'}
					</Text>
					<View>
						{props.distance ? <Text style={{marginTop: 10, fontSize: 12, color: colors.darkGray }}>{Math.floor(service.distance)} miles</Text> : null}
					</View>
				</View>
				<View style={{ position: 'absolute', right: -15 }}>
					<View
						style={[styles.iconContainerStyle, {backgroundColor: props.color}]}
					>
						<Ionicons
							name="ios-arrow-forward"
							size={24}
							style={{ color: colors.white }}
						/>
					</View>
				</View>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	touchCardStyle: {
		marginTop: 10,
		paddingLeft: 20,
		paddingRight: 20,
		marginBottom: 10
	},
	contanierViewStyle: {
		borderWidth: 1,
		borderColor: colors.lightGray,
		borderRadius: 8,
		flexDirection: 'row',
		height: 130,
		alignItems: 'center',
		backgroundColor: colors.white,
		shadowOpacity: 1,
		shadowColor: colors.lightGray,
		shadowRadius: 4,
		shadowOffset: { width: 0, height: 0 }
	},
	imageContainerStyle: {
		position: 'absolute',
		left: -20,
		height: 100,
		width: 100,
		borderRadius: 8,
		shadowOpacity: 0.6,
		shadowColor: colors.black,
		shadowRadius: 3,
		shadowOffset: { width: 1, height: 2 }
	},
	imageStyle: {
		height: 100,
		width: 100,
		borderRadius: 8,
		shadowOpacity: 1
	},
	titleStyle: {
		fontWeight: '600',
		fontSize: 16
	},
	iconContainerStyle: {
		width: 40,
		height: 40,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
		shadowOpacity: 0.6,
		shadowColor: colors.black,
		shadowRadius: 3,
		shadowOffset: { width: 1, height: 2 }
	}
});
