export const getImagePath = (reference) => {
	switch (reference) {
		// Home
		case 'home_cleaning':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fhome_cleaning.jpg?alt=media&token=2d38159b-bc5f-45d9-9eab-65f3cca273a9';
		case 'home_painting':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fhome_painting.jpg?alt=media&token=ede065e1-960e-46f4-b2e2-4c497a2f71c0';
		case 'pool':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fpool_services.jpg?alt=media&token=e1f88dff-d71a-4b63-8158-5b953ebff3a7';
		case 'carpet':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fcarpet_clean.jpg?alt=media&token=45342bd3-b15b-4567-9754-286512640429';
		case 'fence':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Ffence.jpg?alt=media&token=15036da7-4cdb-4f56-b96d-c7b1b6a7107e';
		case 'other_home':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fother_home.jpg?alt=media&token=acd3032d-87b3-4506-8b64-54522ac00f24';
		// Auto
		case 'car_wash':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fcar_wash.jpg?alt=media&token=2bc9153c-a63a-40e8-8810-e46b4103b0cc';
		case 'tire_change':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Ftire_change.jpg?alt=media&token=27fc59e7-fa2f-4ba9-8ee1-29a1906e7b74';
		case 'mechanic':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fmechanic.jpg?alt=media&token=a292fc6b-54de-433a-86e8-ce348b5466db';
		case 'other_car':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fother_car.jpg?alt=media&token=cd755a76-dcc1-401f-8c54-793d69958f23';
		// Plumbing
		case 'water_leak':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fwater_leak.jpg?alt=media&token=d28306e4-9b0f-46bd-a5ec-7d0844f574bb';
		case 'toilet':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Ftoilet.jpg?alt=media&token=6408d08d-c674-478f-97b6-7b1bafe39527';
		case 'drains':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fdrains.jpg?alt=media&token=558df9c5-2c95-47a2-9e4d-2c60636143bc';
		case 'other_plumbing':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fother_plumbing.jpg?alt=media&token=8ae19976-2207-4b47-9018-06ddfbb4530d';
		// Handyman
		case 'ac_repair':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fac_repair.jpg?alt=media&token=3aca8d58-9b44-4cec-b8e4-b43824dfa47d';
		case 'moving':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fmoving.jpg?alt=media&token=53419e34-01bc-4033-b32e-30b326edf9bb';
		case 'furniture_fix_assembly':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Ffurniture_fix_assembly.jpg?alt=media&token=f4bc5724-8142-40cf-bbf8-04eabb562c1d';
		case 'other_handyman':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fother_handyman.jpg?alt=media&token=7a9cd6bf-baf0-43fe-a25d-91f3bd6cecf6';
		// Beauty
		case 'nails':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fnails.jpg?alt=media&token=6b3a7a84-a0f2-4c66-974a-becc8206e7c9';
		case 'hair':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fhair.jpg?alt=media&token=dd0ec818-7057-48eb-9464-249ec44f77c2';
		case 'spa':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fspa.jpg?alt=media&token=1c639e87-eb5c-4ad1-ae4f-eb9fb2480000';
		case 'make_up':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fmake_up.jpg?alt=media&token=bba27476-dcc9-4110-aec9-c2ef5792f061';
		case 'other_beauty':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/subcategory_default%2Fother_beauty.jpg?alt=media&token=5b1ab231-baaa-4b4c-aa2e-2f28d9aeddc7';
		default:
			return null;
	}
};
