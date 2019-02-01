export const getImagePath = (reference) => {
	switch (reference) {
		// Home
		case 'home_cleaning':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fhome_cleaning.jpeg?alt=media&token=e05ea99d-6377-461a-ba33-11e7bb85f2c6';
		case 'home_painting':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fhome_painting.jpeg?alt=media&token=366c18ad-61bc-4f81-a31d-555968468abf';
		case 'carpet':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fcarpet_clean.jpeg?alt=media&token=e97689f3-8dbb-4db5-ab01-8ab15b4e9f5c';
		case 'windows':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fwindows.jpeg?alt=media&token=45a4f028-e380-4ead-94d7-49b844191427';
		case 'other_home':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fother_home.jpeg?alt=media&token=cffb4b08-98c3-461f-8614-1bafeea90759';

		// Home Outdoor
		case 'pool':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fpool_services.jpeg?alt=media&token=d50ba7c0-f76e-4368-9d42-b6cfe66de555';
		case 'pest_control':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fpest.jpeg?alt=media&token=8ebfe5ab-2f41-49c1-823b-af7be25a724f';
		case 'screen_repair':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fhome_screen.jpeg?alt=media&token=b49bcdf8-5818-4c3c-b48c-321ce19f434e';
		case 'fence':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Ffence.jpeg?alt=media&token=4743c74e-338c-446b-822e-649096cdcf06';
		case 'landscape':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Flandscape.jpeg?alt=media&token=d5554e08-17de-4b7f-8c72-a970596c2250';
		case 'garage_doors':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fgarage_door.jpeg?alt=media&token=9ccc9d52-f403-4e5c-ac69-d09f76c6c2f9';
		case 'other_home_outdoor':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fother_home_outdoor.jpeg?alt=media&token=b35fbee1-75ed-4c18-b0b3-b89bad5f4c64';
		// Auto
		case 'car_wash':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fcar_wash.jpeg?alt=media&token=3dfe64a4-c79f-487e-9179-4dbf7eef281c';
		case 'tire_change':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Ftire_change.jpeg?alt=media&token=7d6780b9-1799-4932-b73c-48fc62690097';
		case 'mechanic':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fmechanic.jpeg?alt=media&token=9cede6a2-56c1-4c95-89a9-0c2ae28dca2c';
		case 'other_car':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fother_car.jpeg?alt=media&token=74782102-e4ca-4e22-93bf-f267118c16b4';
		// Handyman
		case 'ac_repair':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fac_repair.jpeg?alt=media&token=b0e99e72-2f91-4c8d-90b1-ab9f8df8c31f';
		case 'moving':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fmoving.jpeg?alt=media&token=4ba6ca42-a412-4a25-bb3d-939c59a40ce0';
		case 'furniture_fix_assembly':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Ffurniture_fix_assembly.jpeg?alt=media&token=08982a50-b7a4-4af5-aff6-d8f980579085';
		case 'carpentry':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fcarpentry.jpeg?alt=media&token=5df2dfc4-973b-47ad-a8b3-c46ae9860bcd';
		case 'other_handyman':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fother_handyman.jpeg?alt=media&token=46c5ef5a-1689-464c-a909-6bbedcd859d2';

		// Plumbing
		case 'water_leak':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fwater_leak.jpeg?alt=media&token=53a9e67c-0e20-4c02-b1b8-c9a7433d53fa';
		case 'toilet':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Ftoilet.jpeg?alt=media&token=51e368cb-93b9-4ded-84f2-8c22cec538fe';
		case 'drains':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fdrains.jpeg?alt=media&token=bdc6af03-0887-4bd1-83aa-98352d323e77';
		case 'other_plumbing':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fother_plumbing.jpeg?alt=media&token=d95aba8a-0e29-4701-92c2-28f79416db54';

		// food
		case 'restaurant':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Frestaurant.jpeg?alt=media&token=f9fbae88-dab3-483a-a236-45a3882dd65b';
		case 'catering':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fcatering.jpeg?alt=media&token=74bc0854-32f6-41d2-88af-f1fee8586c66';
		case 'food_delivery':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Ffood_delivery.jpeg?alt=media&token=a88c9fe2-6977-4fa7-9d65-2ea9b289e446';
		case 'other_food':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fother_food.jpeg?alt=media&token=69680b19-db8c-44d0-9c4c-76eb493d5dc7';

		// Beauty
		case 'nails':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fnails.jpeg?alt=media&token=8b5e3485-4882-46b3-bb73-22f649861a1d';
		case 'hair':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fhair.jpeg?alt=media&token=df7b40f1-be11-428e-a662-8f65cd6a5bbb';
		case 'spa':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fspa.jpeg?alt=media&token=5270c06e-d1ae-45e8-bf24-7b6e9d7f3dec';
		case 'make_up':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fmake_up.jpeg?alt=media&token=f972fb6e-6908-4cc0-a3a9-9a7657943848';
		case 'other_beauty':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fother_beauty.jpeg?alt=media&token=7d6cfac9-46c2-4ddf-9461-be8e591399f1';

		// Insurance
		case 'car_insurance':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fother_car.jpeg?alt=media&token=74782102-e4ca-4e22-93bf-f267118c16b4';
		case 'home_insurance':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fother_remodel.jpeg?alt=media&token=a572b3c9-0687-4e76-b07b-aaf238925969';
		case 'health_insurance':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/category_default%2Fhealth.jpeg?alt=media&token=b8709b1c-dd17-464e-af43-06b991e0b784';
		case 'business_insurance':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fbusiness_insurance.jpeg?alt=media&token=90473155-bb23-46ec-9665-b37bbc06dc4c';
		case 'other_insurance':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/category_default%2Ffit.jpeg?alt=media&token=96e061cb-1159-4199-be82-4813f393b8c9';

		// Remodel
		case 'kitchen_remodel':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fkitchen_remodel.jpeg?alt=media&token=4a024b92-f1ab-4bfb-8477-b82c62e025b1';
		case 'bathroom_remodel':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fbathroom_remodel.jpeg?alt=media&token=05374857-9271-4470-93b3-643d47616e6e';
		case 'floor_remodel':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Ffloor_remodel.jpeg?alt=media&token=bde9786d-eeae-4f95-8fed-b846d10626fd';
		case 'cabinets_remodel':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fcabinets.jpeg?alt=media&token=1f457003-41f7-450c-9836-3b4343497f06';
		case 'other_remodel':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fother_remodel.jpeg?alt=media&token=a572b3c9-0687-4e76-b07b-aaf238925969';
		default:
			return null;
	}
};
