import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Dollar from '../../assets/svg/Dollar';

const StarsRatingPick = (props) => {
	
	const dollarCount = props.count ? props.count : 4;
	// Current service rating
	let rating = props.rating ? props.rating : 0;
	const dollars = [];
	// Depending on rating, push a SVG star to our array
	for (let i = 1; i <= dollarCount; i++) {
		if (rating >= 1) {
			dollars.push(
				<TouchableOpacity key={i} onPress={() => props.selectRating(i)}>
					<Dollar {...props} />
				</TouchableOpacity>
			); 
			// substract 1 each time we render a full star
			rating -= 1;   
		} else if (rating < 1) {
			dollars.push(
				<TouchableOpacity key={i} onPress={() => props.selectRating(i)}>
					<Dollar {...props} fill="0%" />
				</TouchableOpacity>
			);
		}
	}

	return <View style={{ flexDirection: 'row' }}>{dollars}</View>;
};

export default StarsRatingPick;
