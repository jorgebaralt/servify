export const defaultImage = (category) => {
	switch (category) {
		case 'home_services':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/category_default%2Fhome_services.jpg?alt=media&token=dd006b7f-a768-42ac-b07b-ecf10c5db9fe';
		case 'car_services':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/category_default%2Fcar_services.jpg?alt=media&token=65d06664-0fa1-47ca-a68a-f6c28d2626d7';
		case 'handyman':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/category_default%2Fhandyman.jpg?alt=media&token=a6e20474-8a5c-46e9-990a-160078c0769a';
		case 'baby_sitting':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/category_default%2Fbaby_sitting.jpg?alt=media&token=68fdea57-1a53-45b2-8e6c-e4505f3d792b';
		case 'plumbing':
			return;
		case 'electrical':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/category_default%2Felectrical.jpg?alt=media&token=89327866-1863-4d8a-8697-a62072cea187';
		case 'pet':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/category_default%2Fpet.jpg?alt=media&token=70ee28e7-664f-49e1-adce-4aef634c28a5';
		case 'food':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/category_default%2Ffood.jpg?alt=media&token=1fa79d02-3e91-4479-94d5-fcbb2628c900';
		case 'beauty':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/category_default%2Fbeauty.jpg?alt=media&token=633170f3-1d46-4c2b-8b6c-01669e0a11a1';
		case 'tutoring':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/category_default%2Ftutoring.jpg?alt=media&token=33292070-1628-49dd-800b-0a68d389bb8c';
		case 'health':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/category_default%2Fhealth.jpg?alt=media&token=6d8b8ecd-9970-4a8c-928f-1bb63a4a4304';
		case 'real_estate':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/category_default%2Freal_estate.jpg?alt=media&token=9e9a57ea-d6d1-46c1-a2bf-6473f43f27e0';
		case 'fit':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/category_default%2Ffit.jpg?alt=media&token=60a6669f-736d-4f5e-954b-2ad8c8198abd';
		case 'insurance':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/category_default%2Finsurance.jpg?alt=media&token=1d488bfa-6e4c-4b68-bc0b-d4f413adbe61';
		case 'handmade':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/category_default%2Fhandmade.jpg?alt=media&token=d5734c87-c55d-4ace-b253-696862bf5de0';
		case 'other':
			return 'https://firebasestorage.googleapis.com/v0/b/servify-716c6.appspot.com/o/category_default%2Fother.jpg?alt=media&token=78450869-0cc1-4545-b170-ba4ad0f65e1d';
		default:
			return null;
	}
};
