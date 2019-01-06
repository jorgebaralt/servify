import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '../../../shared/styles';
import StarsRating from '../../Ratings/StarsRating';

export const ReviewCard = (props) => {
	const { review } = props;
	const date = new Date(review.timestamp);
	const monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	const day = date.getDate();
	const monthIndex = date.getMonth();
	const year = date.getFullYear();
	const reviewDate = day + ' ' + monthNames[monthIndex] + ' ' + year;

	return (
		<View
			style={{
				marginTop: 20,
				marginBottom: 10,
				borderWidth: 1,
				padding: 10,
				borderColor: colors.lightGray,
				borderRadius: 8,
				backgroundColor: colors.white,
				shadowOpacity: 0.3,
				shadowOffset: { width: 0, height: 0 },
				shadowColor: colors.darkGray,
				shadowRadius: 3
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
			<StarsRating
				rating={review.rating}
				size={14}
				spacing={5}
				style={{ marginTop: 1 }}
			/>
			<Text style={{marginTop: 10, fontSize: 14, color: colors.darkGray }}>
				{review.comment}
			</Text>
		</View>
	);
};
