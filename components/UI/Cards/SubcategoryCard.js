import React from 'react';
import {
	TouchableOpacity,
	StyleSheet,
	Text,
	View,
	Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StarsRating from '../../Ratings/StarsRating';
import { colors } from '../../../shared/styles';
import { FadeImage } from '..';
import { getImagePath } from '../../../assets/default/subcategories';

const WIDTH = Dimensions.get('window').width - 140;

export const SubcategoryCard = (props) => {
	const { subcategory } = props;
	return (
		<TouchableOpacity style={{ margin: 5 }} onPress={props.onPress}>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center'
				}}
			>
				<View
					style={{
						shadowOpacity: 0.3,
						shadowColor: colors.darkerGray,
						shadowRadius: 2,
						shadowOffset: { width: 0, height: 2 }
					}}
				>
					<FadeImage
						circle
						image={getImagePath(subcategory.dbReference)}
						style={{ width: 90, height: 90 }}
					/>
				</View>

				<View
					style={{
						padding: 8,
						borderWidth: 1,
						borderColor: colors.lightGray,
						borderRadius: 8,
						marginLeft: -20,
						backgroundColor: colors.white,
						width: WIDTH,
						zIndex: -1,
						paddingLeft: 24,
						shadowOpacity: 0.3,
						shadowColor: colors.darkerGray,
						shadowRadius: 2,
						shadowOffset: { width: 0, height: 2 }
					}}
				>
					<Text
						style={{
							fontSize: 20,
							fontWeight: '600',
							color: props.color
						}}
					>
						{subcategory.title}
					</Text>
					<Text style={{ fontSize: 16, color: colors.darkGray }}>
						{subcategory.description}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
};
