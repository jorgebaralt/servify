import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Star from '../../assets/svg/Star';

const StarsRatingPick = (props) => {
	
	const starsCount = props.count ? props.count : 5;
	// Current service rating
	let rating = props.rating ? props.rating : 0;
	const stars = [];
	// Depending on rating, push a SVG star to our array
	for (let i = 1; i <= starsCount; i++) {
		if (rating >= 1) {
			stars.push(
				<TouchableOpacity key={i} onPress={() => props.selectRating(i)}>
					<Star {...props} />
				</TouchableOpacity>
			); 
			// substract 1 each time we render a full star
			rating -= 1;   
		} else if (rating < 1 && rating > 0) {
			const value = rating * 100;
			stars.push(
				<TouchableOpacity key={i} onPress={() => props.selectRating(i)}>
					<Star {...props} fill={value + '%'} />
				</TouchableOpacity>
			);
			// set our rating to 0, so we render the rest of the stars empty
			rating = 0;
		} else if (rating === 0) {
			stars.push(
				<TouchableOpacity key={i} onPress={() => props.selectRating(i)}>
					<Star {...props} fill="0%" />
				</TouchableOpacity>
			);
		}
	}

	return <View style={{ flexDirection: 'row' }}></View>;
};

export default StarsRatingPick;
