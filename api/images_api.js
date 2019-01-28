/* eslint-disable no-param-reassign */
import axios from 'axios';

const imagesServiceURL =	'https://us-central1-servify-716c6.cloudfunctions.net/images_service';
const profileImageURL =	'https://us-central1-servify-716c6.cloudfunctions.net/images_profile';

export const uploadImages = async (imagesDataArray, callback) => {
	try {
		if (imagesDataArray.length > 0) {
			const promises = await Promise.all(
				imagesDataArray.map(async (imageData) => {
					const formData = new FormData();
					formData.append('photo', {
						uri: imageData.image,
						name: imageData.fileName,
						type: imageData.type
					});

					const { data } = await axios.post(
						imagesServiceURL,
						formData
					);
					return data;
				})
			);
			return callback(promises);
		}
		return callback(null);
	} catch (e) {
		console.log(e);
	}
};

export const updateImages = async (imagesDataArray, callback) => {
	if (imagesDataArray.length === 0) {
		callback(null);
	}
	const uploadedArray = [];
	const toUpload = [];
	// split into to arrays, one already uploaded, and one needs to be uploaded to storage
	imagesDataArray.forEach((imageInfo) => {
		if (imageInfo.type === undefined) {
			uploadedArray.push(imageInfo);
		} else {
			toUpload.push(imageInfo);
		}
	});
	try {
		// upload what needs to be uploaded
		const promises = await Promise.all(
			toUpload.map(async (imageData) => {
				const formData = new FormData();
				formData.append('photo', {
					uri: imageData.image,
					name: imageData.fileName,
					type: imageData.type
				});

				const { data } = await axios.post(imagesServiceURL, formData);
				// add position, so we can keep track of the order
				data.position = imageData.position;
				return data;
			})
		);
		// merge the 2 arrays
		const array = uploadedArray.concat(promises);
		// sort them according to position
		array.sort((a, b) => {
			if (a.position < b.position) {
				return -1;
			}
			return 1;
		});
		// make sure props are correct before sending update
		array.forEach((imageInfo) => {
			delete imageInfo.position;
			if (imageInfo.image) {
				imageInfo.url = imageInfo.image;
				delete imageInfo.image;
			}
		});
		// return updated image array
		return callback(array);
	} catch (e) {
		console.log(e);
	}
};

export const profileImageUpload = async (imageData) => {
	const formData = new FormData();
	formData.append('photo', {
		uri: imageData.image,
		name: imageData.fileName,
		type: imageData.type
	});
	try {
		const { data } = await axios.post(profileImageURL, formData);
		return data;
	} catch (e) {
		console.log(e);
	}
};

export const deleteServiceImage = async (deleteImagesArray, serviceId) => {
	try {
		await Promise.all(
			deleteImagesArray.map(async (fileName) => {
				const { data } = await axios.delete(imagesServiceURL, {
					data: {
						fileName,
						serviceId
					}
				});
				console.log(data);
				return data;
			})
		);
	} catch (e) {
		console.log(e);
	}
};

export const deleteProfileImage = async (uid, fileName, callback) => {
	try {
		await axios.delete(profileImageURL, {
			data: {
				fileName,
				uid
			}
		});
		callback();
	} catch (e) {
		console.log(e);
	}
};
