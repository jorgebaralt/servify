import axios from 'axios';

export const uploadImages = async (imagesArray) => {
	try {

		console.log(imagesArray[0]);

		const formData = new FormData();
		formData.append('photo', {
			uri: imagesArray[0].image,
			name: imagesArray[0].name,
			type: imagesArray[0].type
		});

		const { data } = await axios.post(
			'https://us-central1-servify-716c6.cloudfunctions.net/uploadFile',
			formData
		);

		console.log(data);
	} catch (e) {
		console.log(e);
	}
};
