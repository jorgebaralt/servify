export default () => [
  {
    id: '0',
    title: 'Home Services',
    description: 'Home Services Description',
    dbReference: 'home_services',
    color: '',
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
    title: 'Car Wash and Repair',
    description: 'Car Wash and Repair Description',
    dbReference: 'car_services',
    color: '',
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
    color: '',
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
    color: ''
  },
  {
    id: '4', 
    title: 'Other',
    description: 'Other Description',
    dbReference: 'other',
    color: ''
  }
];
