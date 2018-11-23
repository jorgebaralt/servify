import { NEW_FILTER_EMPTY, NEW_FILTER_SUCCESS } from '../actions/types';

const initialState = [
	{
		id: 0,
		title: 'Home Services',
		description: 'Home Services Description',
		dbReference: 'home_services',
		color: ['#5E35B1', '#673AB7'],
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
			'carpets',
			'pool',
			'swimming',
			'fence'
		],
		subcategories: [
			{
				id: 0.1,
				title: 'Home Cleaning',
				description: 'Get a cleaner house',
				dbReference: 'home_cleaning'
			},
			{
				id: 0.2,
				title: 'Home Painting',
				description: 'Shiny walls',
				dbReference: 'home_painting'
			},
			{
				id: 0.3,
				title: 'Carpet Clean',
				description: 'Softy carpets',
				dbReference: 'carpet'
			},
			{
				id: 0.4,
				title: 'Pool services',
				description: 'Get a clean pool',
				dbReference: 'pool'
			},
			{
				id: 0.5,
				title: 'Fence services',
				description: 'Great looking backyard',
				dbReference: 'fence'
			},
			{
				id: 0.6,
				title: 'Other',
				description: 'Just other',
				dbReference: 'other'
			}
		]
	},
	{
		id: 1,
		title: 'Auto Services',
		description: 'Car Wash and Repair Description',
		dbReference: 'car_services',
		color: ['#37474F', '#455A64'],
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
				description: 'Shiny car',
				dbReference: 'car_wash'
			},
			{
				id: 1.2,
				title: 'Tire Change',
				description: 'Shoes for your car',
				dbReference: 'tire_change'
			},
			{
				id: 1.3,
				title: 'Mechanic',
				description: 'Avoid crashing',
				dbReference: 'mechanic'
			}
		]
	},
	{
		id: 2,
		title: 'Handyman',
		description: 'Handyman Description',
		dbReference: 'handyman',
		color: ['#00695C', '#00796B'],
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
				description: 'Always cold',
				dbReference: 'ac_repair'
			},
			{
				id: 2.2,
				title: 'Furniture Fix and Assembly',
				description: 'Easy built',
				dbReference: 'furniture_fix_assembly'
			},
			{
				id: 2.3,
				title: 'Moving Help',
				description: 'Move out quickly',
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
		color: ['#AD1457', '#C2185B']
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
		color: ['#01579B', '#01579B'],
		subcategories: [
			{
				id: 4.1,
				title: 'Water leaks',
				description: 'Avoid inside rain',
				dbReference: 'water_leak'
			},
			{
				id: 4.2,
				title: 'Drains',
				description: 'Better dry',
				dbReference: 'drains'
			},
			{
				id: 4.3,
				title: 'Toilets',
				description: 'We always need it working',
				dbReference: 'toilet'
			},
			{
				id: 4.4,
				title: 'All Plumbing services',
				description: 'All you need',
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
		color: ['#FB8C00', '#FF9800']
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
		color: ['#F44336', '#EF5350']
	},
	{
		id: 7,
		title: 'Food Catering',
		description: 'Food Description',
		dbReference: 'food_catering',
		keyWords: ['food', 'eat', 'catering', 'diet', 'restaurant', 'delivery'],
		color: ['#0097A7', '#00ACC1']
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
			'color',
			'make',
			'up',
			'makeup',
			'make-up'
		],
		color: ['#EC407A', '#F06292'],
		subcategories: [
			{
				id: 8.1,
				title: 'Nails',
				description: 'Shiny nails',
				dbReference: 'nails'
			},
			{
				id: 8.2,
				title: 'Hair cuttery',
				description: 'Looking sharp',
				dbReference: 'hair'
			},
			{
				id: 8.3,
				title: 'Spa',
				description: 'Relax time',
				dbReference: 'spa'
			},
			{
				id: 8.4,
				title: 'Make up',
				description: 'Get prettier',
				dbReference: 'make_up'
			}
		]
	},
	{
		id: 9,
		title: 'Landscaping',
		description: 'landscape Description',
		dbReference: 'landscape',
		keyWords: ['landscape', 'grass', 'cut', 'palms', 'tree', 'trees', 'grass'],
		color: ['#33691E', '#558B2F']
	},
	{
		id: 10,
		title: 'Pest control',
		description: 'Pest control',
		dbReference: 'pest',
		keyWords: [
			'pest',
			'landscape',
			'grass',
			'palms',
			'tree',
			'trees',
			'wild',
			'lawn',
			'debris',
			'rodent'
		],
		color: ['#827717', '#9E9D24']
	},
	{
		id: 11,
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
		color: ['#795548', '#8D6E63']
	},
	{
		id: 12,
		title: 'Health',
		description: 'Get healthy',
		dbReference: 'health',
		keyWords: ['health', 'therapy', 'kids', 'adults'],
		color: ['#D50000', '#E57373']
	},
	{
		id: 13,
		title: 'Real state',
		description: 'Get your dream house',
		dbReference: 'real_state',
		keyWords: ['house', 'buy', 'realtor', 'broker', 'real', 'state'],
		color: ['#006064', '#00838F']
	},
	{
		id: 14,
		title: 'Fit',
		description: 'Get in shape',
		dbReference: 'fit',
		keyWords: [
			'sport',
			'soccer',
			'tennis',
			'golf',
			'practice',
			'fit',
			'fitness',
			'train',
			'run',
			'training'
		],
		color: ['#0D47A1', '#1565C0']
	},
	{
		id: 16,
		title: 'Insurance ',
		description: 'Insurance description',
		dbReference: 'insurance',
		keyWords: ['insurance', 'health', 'car', 'auto', 'policy', 'claim'],
		color: ['#7E57C2', '#9575CD']
	},
	{
		id: 17,
		title: 'Other',
		description: 'Something else',
		dbReference: 'other',
		keyWords: ['other'],
		color: ['#607D8B', '#78909C']
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
