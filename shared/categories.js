const categories = [
	{
		id: 0,
		uri:
			'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/category_default%2Fhome_services.jpg?alt=media&token=dd006b7f-a768-42ac-b07b-ecf10c5db9fe',
		title: 'Home Services',
		description: 'Home Services Description',
		dbReference: 'home_services',
		color: ['#42A5F5', '#64B5F6'],
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
				title: 'Windows and Curtains',
				description: 'The best view',
				dbReference: 'windows'
			},
			{
				id: 0.5,
				title: 'Other',
				description: 'Just other',
				dbReference: 'other_home'
			}
		]
	},
	{
		id: 19,
		uri:
			'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/category_default%2Fhome_outdoor.jpg?alt=media&token=68a6cd39-c322-4b03-95f8-7ebea5d5c9a9',
		title: 'Home Outdoor',
		description: 'Home Outdoor Description',
		dbReference: 'home_outdoor',
		color: ['#43A047', '#388E3C'],
		keyWords: [
			'home',
			'outdoor',
			'fence',
			'pool',
			'landscape',
			'screen',
			'repair',
			'pest',
			'pest',
			'landscape',
			'grass',
			'palms',
			'tree',
			'trees',
			'wild',
			'lawn',
			'debris',
			'rodent',
			'fence',
			'control'
		],
		subcategories: [
			{
				id: 19.1,
				title: 'Pool Services',
				description: 'Get a cleaner house',
				dbReference: 'pool'
			},
			{
				id: 19.2,
				title: 'Pest Control',
				description: 'Shiny walls',
				dbReference: 'pest_control'
			},
			{
				id: 19.3,
				title: 'Screen Repair',
				description: 'Softy carpets',
				dbReference: 'screen_repair'
			},
			{
				id: 19.5,
				title: 'Fence services',
				description: 'Great looking backyard',
				dbReference: 'fence'
			},
			{
				id: 19.6,
				title: 'Landscaping and Sprinklers',
				description: 'Great looking backyard',
				dbReference: 'landscape'
			},
			{
				id: 19.7,
				title: 'Garage and doors',
				description: 'Nice entrance',
				dbReference: 'garage_doors'
			},
			{
				id: 19.8,
				title: 'Other',
				description: 'Just other',
				dbReference: 'other_home_outdoor'
			}
		]
	},
	{
		id: 1,
		uri:
			'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/category_default%2Fcar_services.jpg?alt=media&token=65d06664-0fa1-47ca-a68a-f6c28d2626d7',
		title: 'Auto Services',
		description: 'Auto services description',
		dbReference: 'auto_services',
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
			},
			{
				id: 1.4,
				title: 'Other',
				description: 'Something else',
				dbReference: 'other_car'
			}
		]
	},
	{
		id: 2,
		uri:
			'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/category_default%2Fhandyman.jpg?alt=media&token=a6e20474-8a5c-46e9-990a-160078c0769a',
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
			},
			{
				id: 2.4,
				title: 'Carpentry',
				description: 'Built stuff',
				dbReference: 'carpentry'
			},
			{
				id: 2.5,
				title: 'Other',
				description: 'Something else',
				dbReference: 'other_handyman'
			}
		]
	},
	{
		id: 3,
		uri:
			'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/category_default%2Fbaby_sitting.jpg?alt=media&token=68fdea57-1a53-45b2-8e6c-e4505f3d792b',
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
		uri:
			'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/category_default%2Fplumbing.jpg?alt=media&token=f1e7d9e9-4d78-4af5-b50d-13352777c347',
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
				description: 'We always need them working',
				dbReference: 'toilet'
			},
			{
				id: 4.4,
				title: 'Other',
				description: 'Something else',
				dbReference: 'other_plumbing'
			}
		]
	},
	{
		id: 5,
		uri:
			'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/category_default%2Felectrical.jpg?alt=media&token=89327866-1863-4d8a-8697-a62072cea187',
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
		uri:
			'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/category_default%2Fpet.jpg?alt=media&token=70ee28e7-664f-49e1-adce-4aef634c28a5',
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
		uri:
			'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/category_default%2Ffood.jpg?alt=media&token=1fa79d02-3e91-4479-94d5-fcbb2628c900',
		title: 'Food',
		description: 'Food Description',
		dbReference: 'food',
		keyWords: ['food', 'eat', 'catering', 'diet', 'restaurant', 'delivery'],
		color: ['#0097A7', '#00ACC1'],
		subcategories: [
			{
				id: 7.1,
				title: 'Restaurant',
				description: 'Perfect dinner',
				dbReference: 'restaurant'
			},
			{
				id: 7.2,
				title: 'Catering',
				description: 'Cheff is home',
				dbReference: 'catering'
			},
			{
				id: 7.3,
				title: 'Delivery',
				description: 'Fast solution',
				dbReference: 'food_delivery'
			},
			{
				id: 7.4,
				title: 'Other',
				description: 'Something else',
				dbReference: 'other_food'
			}
		]
	},
	{
		id: 8,
		uri:
			'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/category_default%2Fbeauty.jpg?alt=media&token=633170f3-1d46-4c2b-8b6c-01669e0a11a1',
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
			},
			{
				id: 8.5,
				title: 'Other',
				description: 'Anything else?',
				dbReference: 'other_beauty'
			}
		]
	},
	{
		id: 11,
		uri:
			'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/category_default%2Ftutoring.jpg?alt=media&token=33292070-1628-49dd-800b-0a68d389bb8c',
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
		uri:
			'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/category_default%2Fhealth.jpg?alt=media&token=6d8b8ecd-9970-4a8c-928f-1bb63a4a4304',
		title: 'Health',
		description: 'Get healthy',
		dbReference: 'health',
		keyWords: ['health', 'therapy', 'kids', 'adults'],
		color: ['#D50000', '#E57373']
	},
	{
		id: 13,
		uri:
			'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/category_default%2Freal_estate.jpg?alt=media&token=9e9a57ea-d6d1-46c1-a2bf-6473f43f27e0',
		title: 'Real Estate',
		description: 'Get your dream house',
		dbReference: 'real_estate',
		keyWords: ['house', 'buy', 'realtor', 'broker', 'real', 'estate'],
		color: ['#006064', '#00838F']
	},
	{
		id: 14,
		uri:
			'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/category_default%2Ffit.jpg?alt=media&token=60a6669f-736d-4f5e-954b-2ad8c8198abd',
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
		uri:
			'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/category_default%2Finsurance.jpg?alt=media&token=1d488bfa-6e4c-4b68-bc0b-d4f413adbe61',
		title: 'Insurance',
		description: 'Insurance description',
		dbReference: 'insurance',
		keyWords: [
			'insurance',
			'health',
			'car',
			'auto',
			'policy',
			'claim',
			'medical'
		],
		color: ['#7E57C2', '#9575CD'],
		subcategories: [
			{
				id: 16.1,
				title: 'Car Insurance',
				description: 'Safe crash',
				dbReference: 'car_insurance'
			},
			{
				id: 16.2,
				title: 'Home Insurance',
				description: 'storm protector',
				dbReference: 'home_insurance'
			},
			{
				id: 16.3,
				title: 'Health Insurance',
				description: 'Medical expenses covered',
				dbReference: 'health_insurance'
			},
			{
				id: 16.4,
				title: 'Bussiness Insurance',
				description: 'Employee protection',
				dbReference: 'business_insurance'
			},
			{
				id: 16.5,
				title: 'Other',
				description: 'Anything else?',
				dbReference: 'other_insurance'
			}
		]
	},
	{
		id: 17,
		uri:
			'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/category_default%2Fhandmade.jpg?alt=media&token=d5734c87-c55d-4ace-b253-696862bf5de0',
		title: 'Handmade',
		description: 'Built with love',
		dbReference: 'handmade',
		keyWords: ['hand', 'made', 'handmade', 'bags', 'cloth', 'claim'],
		color: ['#AD1457', '#880E4F']
	},
	{
		id: 18,
		uri:
			'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/category_default%2Fcomputer_repair.jpg?alt=media&token=40c0dcad-1108-42e0-ae5a-ea15ea6c5965',
		title: 'Computer and Smartphone',
		description: 'Tech consultation',
		dbReference: 'computer_phone',
		keyWords: [
			'computer',
			'iphone',
			'broke',
			'android',
			'repair',
			'software',
			'install',
			'printer',
			'screen',
			'protector',
			'laptop',
			'desktop'
		],
		color: ['#0288D1', '#0277BD']
	},
	{
		id: 20,
		uri:
			'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/category_default%2Fremodel.jpg?alt=media&token=678d208d-7c85-4396-828f-9857929e3e49',
		title: 'Remodel',
		description: 'Redesign',
		dbReference: 'remodel',
		keyWords: ['remodel', 'kitchen', 'batroom', 'floor'],
		color: ['#FFB74D', '#FFA726'],
		subcategories: [
			{
				id: 20.1,
				title: 'Kitchen Remodel',
				description: 'Love cooking',
				dbReference: 'kitchen_remodel'
			},
			{
				id: 20.2,
				title: 'Bathroom Remodel',
				description: 'Take the perfect bath',
				dbReference: 'bathroom_remodel'
			},
			{
				id: 20.3,
				title: 'Floor remodel',
				description: 'Walk without shoes',
				dbReference: 'floor_remodel'
			},
			{
				id: 20.4,
				title: 'Countertops and Cabinets',
				description: 'Custom cabinets',
				dbReference: 'cabinets_remodel'
			},
			{
				id: 20.5,
				title: 'Other',
				description: 'Anything else?',
				dbReference: 'other_remodel'
			}
		]
	},
	{
		id: 21,
		uri:
			'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/category_default%2Fother.jpg?alt=media&token=78450869-0cc1-4545-b170-ba4ad0f65e1d',
		title: 'Other',
		description: 'Something else',
		dbReference: 'other',
		keyWords: ['other'],
		color: ['#607D8B', '#78909C']
	}
];
export default categories;
