export const getImagePath = (reference) => {
	switch (reference) {
		// // Home
		// case 'home_cleaning':
		// 	return require('./home_cleaning.jpg');
		// case 'home_painting':
		// 	return require('./home_painting.jpg');
		// case 'pool':
		// 	return require('./pool_services.jpg');
		// case 'carpet':
		// 	return require('./carpet_clean.jpg');
		// case 'fence':
		// 	return require('./fence.jpg');
		// case 'other_home':
		// 	return require('./other_home.jpg');
		// // Auto
		// case 'car_wash':
		// 	return require('./car_wash.jpg');
		// case 'tire_change':
		// 	return require('./tire_change.jpg');
		// case 'mechanic':
		// 	return require('./mechanic.jpg');
		case 'other_car':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fcar_other.jpg?alt=media&token=cb48b667-905a-494b-b8a3-a4e7469aa335';
		// // Plumbing
		// case 'water_leak':
		// 	return require('./water_leak.jpg');
		// case 'toilet':
		// 	return require('./toilet.jpg');
		// case 'drains':
		// 	return require('./drains.jpg');
		// case 'other_plumbing':
		// 	return require('./other_plumbing.jpg');
		// Handyman
		case 'ac_repair':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fac_repair.jpg?alt=media&token=3aca8d58-9b44-4cec-b8e4-b43824dfa47d';
		// case 'moving':
		// 	return require('./moving.jpg');
		// case 'furniture_fix_assembly':
		// 	return require('./furniture_fix_assembly.jpg');
		// case 'other_handyman':
		// 	return require('./other_handyman.jpg');
		// // Beauty
		// case 'nails':
		// 	return require('./nails.jpg');
		// case 'hair':
		// 	return require('./hair.jpg');
		// case 'spa':
		// 	return require('./spa.jpg');
		// case 'make_up':
		// 	return require('./make_up.jpg');
		// case 'other_beauty':
		// 	return require('./other_beauty.jpg');
		default:
			return null;
	}
};
