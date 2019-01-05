
export const getImagePath = (reference) => {
	switch (reference) {
		// Home
		case 'home_cleaning':
			return require('./home_cleaning.jpg');
		// Auto
		case 'car_wash':
			return require('./car_wash.jpg');
		case 'tire_change':
			return require('./tire_change.jpg');
		case 'mechanic':
			return require('./mechanic.jpg');
		default:
			return null;
	}
};
