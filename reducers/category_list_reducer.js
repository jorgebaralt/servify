import { NEW_FILTER_EMPTY, NEW_FILTER_SUCCESS } from '../actions/types';

const initialState = [
	{
		id: 0,
		title: 'Home Services',
		description: 'Home Services Description',
		dbReference: 'home_services',
		color: ['#0288D1', '#90CAF9'],
		keyWords: [
			'home',
			'cleaning',
			'clean',
			'cainting',
			'organize',
			'house',
			'kitchen',
			'paint',
			'paiting',
			'fix',
			'cleaning',
			'garage',
			'carpet',
			'carpets'
		],
		subcategories: [
			{
				id: 0.1,
				title: 'Home Cleaning',
				description: 'Home Cleaning Description',
				dbReference: 'home_cleaning'
			},
			{
				id: 0.2,
				title: 'Home Painting',
				description: 'Home Painting Description',
				dbReference: 'home_painting'
			},
			{
				id: 0.3,
				title: 'Carpet Clean',
				description: 'Carpet clean desc',
				dbReference: 'carpet'
			},
			{
				id: 0.4,
				title: 'Other',
				description: 'Other Description',
				dbReference: 'other'
			},
		]
	},
	{
		id: 1,
		title: 'Auto Services',
		description: 'Car Wash and Repair Description',
		dbReference: 'car_services',
		color: ['#37474F', '#90A4AE'],
		keyWords: [
			'car',
			'auto',
			'truck',
			'wash',
			'tire',
			'mechanic',
			'air',
			'ac',
			'a/c',
			'wheel',
			'vehicle',
			'autos',
			'cars'
		],
		subcategories: [
			{
				id: 1.1,
				title: 'Car Wash',
				description: 'Car Wash Description',
				dbReference: 'car_wash'
			},
			{
				id: 1.2,
				title: 'Tire Change',
				description: 'tire change description',
				dbReference: 'tire_change'
			},
			{
				id: 1.3,
				title: 'Mechanic',
				description: 'Mechanic Description',
				dbReference: 'mechanic'
			}
		]
	},
	{
		id: 2,
		title: 'Handyman',
		description: 'Handyman Description',
		dbReference: 'handyman',
		color: ['#00695C', '#4DB6AC'],
		keyWords: [
			'fix',
			'ac',
			'a/c',
			'furniture',
			'assembly',
			'moving',
			'help',
			'house',
			'home',
			'repair',
			'installation',
			'electric'
		],
		subcategories: [
			{
				id: 2.1,
				title: 'A/C Repair',
				description: 'A/C Repair Description',
				dbReference: 'ac_repair'
			},
			{
				id: 2.2,
				title: 'Furniture Fix and Assembly',
				description: 'Furniture Fix Assembly Description',
				dbReference: 'furniture_fix_assembly'
			},
			{
				id: 2.3,
				title: 'Moving Help',
				description: 'Moving Description',
				dbReference: 'moving'
			}
		]
	},
	{
		id: 3,
		title: 'Baby Sitting',
		description: 'Baby Sitting Description',
		dbReference: 'baby_sitting',
		keyWords: [
			'home',
			'house',
			'baby',
			'sitting',
			'care',
			'kid',
			'kids',
			'boy',
			'girl',
			'children'
		],
		color: ['#AD1457', '#FF4081']
	},
	{
		id: 4,
		title: 'Plumbing',
		description: 'Plumbing Description',
		dbReference: 'plumbing',
		keyWords: [
			'plumbing',
			'water',
			'leaks',
			'toilet',
			'garbage',
			'disposal',
			'service',
			'leak',
			'drains',
			'drain',
			'faucets',
			'faucet'
		],
		color: ['#01579B', '#84FFFF'],
		subcategories: [
			{
				id: 4.1,
				title: 'Water leaks',
				description: 'Leals Description',
				dbReference: 'water_leak'
			},
			{
				id: 4.2,
				title: 'Drains',
				description: 'Drains Description',
				dbReference: 'drains'
			},
			{
				id: 4.3,
				title: 'Toilets',
				description: 'Toilet Description',
				dbReference: 'toilet'
			},
			{
				id: 4.4,
				title: 'All Plumbing services',
				description: 'All Description',
				dbReference: 'all_plumbing'
			}
		]
	},
	{
		id: 5,
		title: 'Electrical',
		description: 'Electrical Description',
		dbReference: 'electrical',
		keyWords: [
			'electrical',
			'light',
			'lighting',
			'outlets',
			'lights',
			'outlets',
			'ceiling',
			'bath',
			'fans'
		],
		color: ['#FB8C00', '#FFEB3B']
	},
	{
		id: 6,
		title: 'Pet Services',
		description: 'Pet Description',
		dbReference: 'pet',
		keyWords: [
			'pet',
			'dog',
			'dogs',
			'cat',
			'cats',
			'sitting',
			'walk',
			'walking',
			'grooming',
			'spa',
			'nails',
			'paw',
			'paws'
		],
		color: ['#F44336', '#FF8A65']
	},
	{
		id: 7,
		title: 'Food Catering',
		description: 'Food Description',
		dbReference: 'food_catering',
		keyWords: ['food', 'eat', 'catering', 'diet', 'restaurant', 'delivery'],
		color: ['#0097A7', '#004D40']
	},
	{
		id: 8,
		title: 'Beauty',
		description: 'Beauty Description',
		dbReference: 'beauty',
		keyWords: [
			'spa',
			'nails',
			'hair',
			'cut',
			'haircut',
			'cuttery',
			'highlights',
			'color'
		],
		color: ['#EC407A', '#AD1457'],
		subcategories: [
			{
				id: 8.1,
				title: 'Nails',
				description: 'Nails Description',
				dbReference: 'nails'
			},
			{
				id: 8.2,
				title: 'Hair cuttery',
				description: 'Hair cut Description',
				dbReference: 'hair'
			},
			{
				id: 8.3,
				title: 'Spa',
				description: 'spa description',
				dbReference: 'spa'
			}
		]
	},
	{
		id: 9,
		title: 'Landscaping',
		description: 'landscape Description',
		dbReference: 'landscape',
		keyWords: ['landscape', 'grass', 'cut', 'palms', 'tree', 'trees'],
		color: ['#43A047', '#C8E6C9']
	},
	{
		id: 10,
		title: 'Tutoring',
		description: 'Tutoring Description',
		dbReference: 'tutoring',
		keyWords: [
			'home',
			'homework',
			'work',
			'tutoring',
			'math',
			'science',
			'class',
			'classes'
		],
		color: ['#8D6E63', '#3E2723']
	},
	{
		id: 11,
		title: 'Other',
		description: 'Other Description',
		dbReference: 'other',
		keyWords: ['other'],
		color: ['#78909C', '#7986CB']
	}
];

export default (state = initialState, action) => {
	switch (action.type) {
		case NEW_FILTER_SUCCESS:
			return action.payload;
		case NEW_FILTER_EMPTY:
			return initialState;
		default:
			return state;
	}
};
