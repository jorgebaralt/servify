import { NEW_FILTER_EMPTY, NEW_FILTER_SUCCESS } from '../actions/types';

const initialState = [
	{
		id: '0',
		title: 'Home Services',
		description: 'Home Services Description',
		dbReference: 'home_services',
		color: ['#0288D1', '#90CAF9'],
		keyWords: ['home', 'cleaning', 'clean', 'cainting', 'organize', 'house', 'kitchen', 'paint', 'paiting', 'fix', 'cleaning', 'garage'],
		subcategories: [
			{
				id: '0.1',
				title: 'Home Cleaning',
				description: 'Home Cleaning Description',
				dbReference: 'home_cleaning'
			},
			{
				id: '0.2',
				title: 'Home Painting',
				description: 'Home Painting Description',
				dbReference: 'home_painting'
			},
			{
				id: '0.4',
				title: 'Other',
				description: 'Other Description',
				dbReference: 'other'
			}
		]
	},
	{
		id: '1',
		title: 'Auto Services',
		description: 'Car Wash and Repair Description',
		dbReference: 'car_services',
		color: ['#37474F', '#90A4AE'],
		keyWords: ['car', 'auto', 'truck', 'wash', 'tire', 'mechanic', 'air', 'ac', 'a/c', 'wheel', 'vehicle', 'autos', 'cars'],
		subcategories: [
			{
				id: '1.1',
				title: 'Car Wash',
				description: 'Car Wash Description',
				dbReference: 'car_wash'
			},
			{
				id: '1.2',
				title: 'Tire Change',
				description: 'tire change description',
				dbReference: 'tire_change'
			},
			{
				id: '1.3',
				title: 'Mechanic',
				description: 'Mechanic Description',
				dbReference: 'mechanic'
			}
		]
	},
	{
		id: '2',
		title: 'Handyman',
		description: 'Handyman Description',
		dbReference: 'handyman',
		color: ['#00695C', '#4DB6AC'],
		keyWords: ['fix', 'ac', 'a/c', 'furniture', 'assembly', 'moving', 'help', 'house', 'home', 'repair', 'installation', 'electric'],
		subcategories: [
			{
				id: '2.1',
				title: 'A/C Repair',
				description: 'A/C Repair Description',
				dbReference: 'ac_repair'
			},
			{
				id: '2.2',
				title: 'Furniture Fix and Assembly',
				description: 'Furniture Fix Assembly Description',
				dbReference: 'furniture_fix_assembly'
			},
			{
				id: '2.3',
				title: 'Moving Help',
				description: 'Moving Description',
				dbReference: 'moving'
			}
		]
	},
	{
		id: '3',
		title: 'Baby Sitting',
		description: 'Baby Sitting Description',
		dbReference: 'baby_sitting',
		keyWords: ['home', 'house', 'baby', 'sitting', 'care', 'kid', 'kids', 'boy', 'girl', 'children'],
		color: ['#AD1457', '#F06292']
	},
	{
		id: '4',
		title: 'Other',
		description: 'Other Description',
		dbReference: 'other',
		keyWords: ['other'],
		color: ['#FF8F00', '#FFF176']
	},
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
