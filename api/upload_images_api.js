import axios from 'axios';

export const uploadImages = async (imagesDataArray, callback) => {
	try {
		const promises = await Promise.all(imagesDataArray.map(async (imageData) => {
			const formData = new FormData();
			formData.append('photo', {
				uri: imageData.image,
				name: imageData.name,
				type: imageData.type
			});
	
			const { data } = await axios.post(
				'https://us-central1-servify-716c6.cloudfunctions.net/uploadFile',
				formData
			);
			return (data.signedUrls[0]);
		}));
		
		callback(promises);
		// imageURLS.concat(promises);
		// console.log(imageURLS);


		// const formData = new FormData();
		// formData.append('photo', {
		// 	uri: imagesUriArray[0].image,
		// 	name: imagesUriArray[0].name,
		// 	type: imagesUriArray[0].type
		// });

		// const { data } = await axios.post(
		// 	'https://us-central1-servify-716c6.cloudfunctions.net/uploadFile',
		// 	formData
		// );

	} catch (e) {
		console.log(e);
	}
};
