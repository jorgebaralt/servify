import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '../../../shared/styles';
import StarsRating from '../../Ratings/StarsRating';
import DollarRating from '../../Ratings/DollarRating';
import { formatDate } from '../../../shared/helpers';

export const ReviewCard = (props) => {
	const { review } = props;
	const reviewDate = formatDate(review.timestamp);

	return (
		<View
			style={{
				marginTop: 10,
				marginBottom: 10,
				borderWidth: 1,
				padding: 10,
				borderColor: colors.lightGray,
				borderRadius: 8,
				backgroundColor: colors.white,
			}}
		>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between'
				}}
			>
				<Text style={{ color: colors.black, fontSize: 16 }}>
					{review.reviewerDisplayName}
				</Text>
				<Text
					style={{
						color: colors.darkGray,
						fontSize: 14,
						marginRight: 20
					}}
				>
					{reviewDate}
				</Text>
			</View>
			<View style={{ flexDirection: 'row'}}>
				<StarsRating
					rating={review.rating}
					size={14}
					spacing={5}
					style={{ marginTop: 1 }}
				/>
				{review.price ? <DollarRating rating={review.price} size={14} style={{ marginTop: 1, marginLeft: 10}} /> : null}
			</View>
			
			<Text style={{marginTop: 10, fontSize: 14, color: colors.darkGray }}>
				{review.comment}
			</Text>
		</View>
	);
};
