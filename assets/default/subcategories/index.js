
export const getImagePath = (reference) => {
	switch (reference) {
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
