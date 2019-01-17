export const defaultImage = (category) => {
	switch (category) {
		case 'home_services':
			return require('./home_services.jpg');
		case 'car_services':
			return require('./car_services.jpg');
		case 'handyman':
			return require('./handyman.jpg');
		case 'baby_sitting':
			return require('./baby_sitting.jpg');
		case 'plumbing':
			return;
		case 'electrical':
			return require('./electrical.jpg');
		case 'pet':
			return require('./pet.jpg');
		case 'food_catering':
			return require('./food_catering.jpg');
		case 'beauty':
			return require('./beauty.jpg');
		case 'landscape':
			return require('./landscape.jpg');
		case 'pest':
			return require('./pest.jpg');
		case 'tutoring':
			return require('./tutoring.jpg');
		case 'health':
			return require('./health.jpg');
		case 'real_estate':
			return require('./real_estate.jpg');
		case 'fit':
			return require('./fit.jpg');
		case 'insurance':
			return require('./insurance.jpg');
		case 'handmade':
			return require('./handmade.jpg');
		case 'other':
			return require('./other.jpg');
		default:
			return null;
	}
};
