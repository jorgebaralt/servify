import React from 'react';
import { TouchableOpacity, Text, View, Dimensions } from 'react-native';
import { colors } from '../../../shared/styles';
import { FadeImage } from '..';
import { getImagePath } from '../../../assets/default/subcategories';

const WIDTH = Dimensions.get('window').width - 100;

export const SubcategoryCard = (props) => {
	const { subcategory } = props;
	return (
		<TouchableOpacity
			style={{ margin: 5, marginTop: 20 }}
			onPress={props.onPress}
		>
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
						uri={getImagePath(subcategory.dbReference)}
						style={{ width: 90, height: 90 }}
					/>
				</View>

				<View
					style={{
						padding: 8,
						borderWidth: 1,
						borderColor: colors.lightGray,
						borderRadius: 10,
						marginLeft: -50,
						backgroundColor: colors.white,
						width: WIDTH,
						zIndex: -1,
						paddingLeft: 60,
						shadowOpacity: 0.3,
						shadowColor: colors.darkerGray,
						shadowRadius: 2,
						shadowOffset: { width: 0, height: 2 }
					}}
				>
					<Text
						style={{
							fontSize: 20,
							fontWeight: '500',
							color: colors.black
						}}
					>
						{subcategory.title}
					</Text>
					<Text
						style={{
							fontSize: 16,
							color: colors.darkGray,
							marginTop: 10
						}}
					>
						{subcategory.description}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
};
