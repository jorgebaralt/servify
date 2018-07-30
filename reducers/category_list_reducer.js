export default () => [
  {
    id: '0',
    categoryTitle: 'Home Services',
    categoryDescription: 'Home Services Description',
    dbReference: 'home_services',
    color: '',
    subcategories: [
      {
        id: '0.1',
        subcategoryTitle: 'Home Cleaning',
        subcategoryDescription: 'Home Cleaning Description',
        dbReference: 'home_cleaning'
      },
      {
        id: '0.2',
        subcategoryTitle: 'Home Painting',
        subcategoryDescription: 'Home Painting Description',
        dbReference: 'home_painting'
      },
      {
        id: '0.4',
        subcategoryTitle: 'Other',
        subcategoryDescription: 'Other Description', 
        dbReference: 'other'
      }
    ]
  },
  {
    id: '1',  
    categoryTitle: 'Car Wash and Repair',
    categoryDescription: 'Car Wash and Repair Description',
    dbReference: 'car_services',
    color: '',
    subcategories: [
      {
        id: '1.1',
        subcategoryTitle: 'Car Wash',
        subcategoryDescription: 'Car Wash Description',
        dbReference: 'car_wash'
      },
      {
        id: '1.2',
        subcategoryTitle: 'Tire Change',
        subcategoryDescription: 'tire change description',
        dbReference: 'tire_change'
      },
      {
        id: '1.3',
        subcategoryTitle: 'Mechanic',
        subcategoryDescription: 'Mechanic Description',
        dbReference: 'mechanic'
      }

    ]
  },
  {
    id: '2',
    categoryTitle: 'Handyman',
    categoryDescription: 'Handyman Description',
    dbReference: 'handyman',
    color: '',
    subcategories: [
      {
        id: '2.1',
        subcategoryTitle: 'A/C Repair',
        subcategoryDescription: 'A/C Repair Description',
        dbReference: 'ac_repair'
      },
      {
        id: '2.2',
        subcategoryTitle: 'Furniture Fix and Assembly',
        subcategoryDescription: 'Furniture Fix Assembly Description',
        dbReference: 'furniture_fix_assembly'
      },
      {
        id: '2.3',
        subcategoryTitle: 'Moving Help',
        subcategoryDescription: 'Moving Description',
        dbReference: 'moving'
      }
    ]
  },
  {
    id: '3',
    categoryTitle: 'Baby Sitting',
    categoryDescription: 'Baby Sitting Description',
    dbReference: 'baby_sitting',
    color: ''
  },
  {
    id: '4', 
    categoryTitle: 'Other',
    categoryTescription: 'Other Description',
    dbReference: 'other',
    color: ''
  }
];
