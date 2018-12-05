import React from 'react';
import { View, StyleSheet } from 'react-native';
import Star from '../assets/svg/Star';

const StarsRating = (props) => {
	const starsCount = props.count ? props.count : 5;
	let rating = props.rating ? props.rating : 0;
	const stars = [];
	for (let i = 1; i <= starsCount; i++) {
		if (rating >= 1) {
			stars.push(<Star {...props} />);
			rating -= 1;
		} else if (rating < 1 && rating > 0) {
			const value = rating * 100;
			stars.push(
				<Star
					{...props}
					fill={value + '%'}
				/>
			);
			rating = 0;
		} else if (rating === 0) {
			stars.push(
				<Star {...props} fill="0%" />
			);
		}
	}
	return <View style={{ flexDirection: 'row' }}>{stars}</View>;
};

export default StarsRating;
