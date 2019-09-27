import React from 'react';
import { View } from 'react-native';
import Star from '../../assets/svg/Star';

// Render stars for reviews 
const StarsRating = (props) => {
	const starsCount = props.count ? props.count : 5;
	// Current service rating
	let rating = props.rating ? props.rating : 0;
	const stars = [];
	// Depending on rating, push a SVG star to our array
	for (let i = 1; i <= starsCount; i++) {
		if (rating >= 1) {
			stars.push(<Star key={i} {...props} />);
			// substract 1 each time we render a full star
			rating -= 1;
		} else if (rating < 1 && rating > 0) {
			const value = rating * 100;
			stars.push(
				<Star
					key={i}
					{...props}
					fill={value + '%'}
				/>
			);
			// set our rating to 0, so we render the rest of the stars empty
			rating = 0;
		} else if (rating === 0) {
			stars.push(
				<Star key={i} {...props} fill="0%" />
			);
		}
	}
	console.log('zzz stars:', stars);
	// Render array of stars
	return <View style={{ flexDirection: 'row' }}></View>;
};

export default StarsRating;
