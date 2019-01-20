import React, { Component } from 'react';
import {
	Alert,
	KeyboardAvoidingView,
	View,
	Keyboard,
	DeviceEventEmitter,
	ActivityIndicator,
	SafeAreaView,
	ScrollView,
	Text,
	Slider,
	Platform
} from 'react-native';
import SortableList from 'react-native-sortable-list';
import { MapView, Permissions, ImagePicker } from 'expo';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import _ from 'lodash';
import { connect } from 'react-redux';
import { showToast } from '../../actions';
import { pageHit } from '../../shared/ga_helper';
import {
	deleteService,
	updateService,
	getLocationFromAddress,
	updateImages,
	deleteImage
} from '../../api';
import {
	CustomHeader,
	FloatingLabelInput,
	TextArea,
	Button,
	SortableRow
} from '../../components/UI';
import { colors, globalStyles } from '../../shared/styles';
import { formatPhone } from '../../shared/helpers';

let willFocusSubscription;
let backPressSubscriptions;
class EditServiceScreen extends Component {
	state = {
		service: this.props.navigation.getParam('service'),
		loading: false,
		imageArray: null,
		position: 0,
		deleteImagesArray: []
	};

	componentWillMount() {
		// Filling all values from current service
		// if service has images
		const imageArray = [];
		if (
			this.state.service.imagesInfo
			&& this.state.service.imagesInfo.length > 0
		) {
			this.state.service.imagesInfo.forEach((image, index) => {
				imageArray.push({
					position: index,
					image: image.url,
					fileName: image.fileName
				});
				this.setState({ position: index });
			});
			this.setState({ imageArray });
		}
		// fill rest of the service info
		this.setState((prevState) => ({
			title: prevState.service.title,
			description: prevState.service.description,
			phone: prevState.service.phone,
			location:
				prevState.service.locationData.city
				+ ', '
				+ prevState.service.locationData.region
				+ ' '
				+ prevState.service.locationData.postalCode,
			miles: prevState.service.miles,
			region: {
				latitude: prevState.service.geolocation.latitude,
				longitude: prevState.service.geolocation.longitude,
				latitudeDelta: 0.03215 * prevState.service.miles,
				longitudeDelta: 0.0683 * prevState.service.miles
			},
			radius: prevState.service.miles * 1609.34,
			center: {
				latitude: prevState.service.geolocation.latitude,
				longitude: prevState.service.geolocation.longitude
			}
		}));

		willFocusSubscription = this.props.navigation.addListener(
			'willFocus',
			this.handleAndroidBack
		);
	}

	componentDidMount() {
		pageHit('Edit Service Screen');
	}

	componentWillUnmount() {
		willFocusSubscription.remove();
	}

	// Location handlers
	updateLocation = async (text) => {
		// if empty the text box, go to current location
		if (text.length < 2) {
			const { coords } = this.props.userLocation;
			this.setState((prevState) => ({
				region: {
					latitude: coords.latitude,
					longitude: coords.longitude,
					latitudeDelta: prevState.latitudeDelta,
					longitudeDelta: prevState.longitudeDelta
				},
				center: {
					latitude: coords.latitude,
					longitude: coords.longitude
				}
			}));
		} else {
			// update map to new location
			const newAddress = await getLocationFromAddress(text);
			if (newAddress.longitude && newAddress.latitude) {
				this.setState((prevState) => ({
					region: {
						latitude: newAddress.latitude,
						longitude: newAddress.longitude,
						latitudeDelta: prevState.latitudeDelta,
						longitudeDelta: prevState.longitudeDelta
					},
					center: {
						latitude: newAddress.latitude,
						longitude: newAddress.longitude
					}
				}));
			}
		}
	};

	onLocationChange = async (location) => {
		this.setState({ location });
		this.updateLocation(location);
	};

	// update map with miles
	onMilesChange = (value) => {
		this.setState({ miles: value });
		this.setState((prevState) => ({
			radius: value * 1609.34,
			region: {
				latitude: prevState.region.latitude,
				longitude: prevState.region.longitude,
				latitudeDelta: 0.03215 * value,
				longitudeDelta: 0.0683 * value
			}
		}));
	};

	showToast = (text, type) => {
		this.setState({ loading: false });
		this.props.showToast({ message: text, type, duration: 3000 });
	};

	handleAndroidBack = () => {
		backPressSubscriptions = new Set();
		DeviceEventEmitter.removeAllListeners('hardwareBackPress');
		DeviceEventEmitter.addListener('hardwareBackPress', () => {
			const subscriptions = [];

			backPressSubscriptions.forEach((sub) => subscriptions.push(sub));
			for (let i = 0; i < subscriptions.reverse().length; i += 1) {
				if (subscriptions[i]()) {
					break;
				}
			}
		});
		backPressSubscriptions.add(() => this.props.navigation.pop());
	};

	deleteService = async () => {
		Keyboard.dismiss();
		this.setState({ loading: true });
		// Delete service images from firestore
		const toDelete = [];
		if (this.state.imageArray) {
			this.state.imageArray.forEach((imageInfo) => {
				toDelete.push(imageInfo.fileName);
			});
			this.setState({ deleteImagesArray: toDelete });
			await this.deleteImages();
		}

		// delete service
		await deleteService(this.state.service);
		this.setState({
			title: '',
			description: '',
			phone: '',
			location: '',
			miles: '',
			loading: false
		});
		this.props.navigation.pop(3);
	};

	deleteAlert = () => {
		Alert.alert('Delete', 'Are you sure you want to delete this service?', [
			{
				text: 'Delete',
				onPress: () => this.deleteService(),
				style: 'destructive'
			},
			{
				text: 'Cancel'
			}
		]);
	};

	updateService = async () => {
		Keyboard.dismiss();
		this.scrollRef.scrollTo({ x: 0, y: 0, animated: true });
		this.setState({ loading: true });
		const { service } = this.state;
		// according to order, assign position number, to push images in order
		this.fixPositions();
		// Delete images from db
		await this.deleteImages();
		// Upload new images
		await updateImages(this.state.imageArray, (imageArray) => this.setState({ imageArray }));
		// set updated service information
		const updatedService = {
			id: service.id,
			timestamp: service.timestamp,
			category: service.category,
			subcategory: service.subcategory,
			title: this.state.title,
			phone: this.state.phone,
			location: this.state.location,
			miles: this.state.miles,
			description: this.state.description,
			displayName: this.props.user.displayName,
			email: this.props.user.email,
			ratingCount: service.ratingCount,
			ratingSum: service.ratingSum,
			rating: service.rating,
			priceCount: service.priceCount,
			priceSum: service.priceSum,
			price: service.price,
			favUsers: service.favUsers,
			imagesInfo: this.state.imageArray
		};
		// post service (update)
		await updateService(updatedService, (text, type) => this.showToast(text, type));
		this.props.navigation.pop(3);
	};

	// format phone text
	phoneChangeText = (text) => {
		const result = formatPhone(text);
		this.setState({ phone: result });
	};

	// Icon on left header
	headerLeftIcon = () => (
		<Ionicons
			name="ios-arrow-back"
			size={32}
			style={{ color: colors.black }}
			onPress={() => this.props.navigation.pop(2)}
			disabled={this.state.loading}
		/>
	);

	headerRightIcon = () => (
		<MaterialIcons
			name="delete"
			size={32}
			style={{ color: colors.danger }}
			onPress={() => this.deleteAlert()}
			disabled={this.state.loading}
		/>
	);

	pickImage = async () => {
		const { status: cameraPerm } = await Permissions.askAsync(
			Permissions.CAMERA
		);
		const { status: cameraRollPerm } = await Permissions.askAsync(
			Permissions.CAMERA_ROLL
		);
		if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
			const result = await ImagePicker.launchImageLibraryAsync({
				allowsEditing: true,
				base64: true
			});
			if (!result.cancelled) {
				const fileName = result.uri.split('/').pop();
				// Infer the type of the image
				const match = /\.(\w+)$/.exec(fileName);
				const type = match ? `image/${match[1]}` : 'image';
				// add to our image array state to keep track
				this.setState((prevState) => {
					let { imageArray } = prevState;
					const currentPosition = prevState.position;
					if (imageArray === null) {
						imageArray = [];
					}
					imageArray.push({
						position: currentPosition + 1,
						image: result.uri,
						fileName,
						type
					});
					return {
						imageArray,
						position: currentPosition + 1
					};
				});
			}
		}
	};

	// fix positions of imageArray
	fixPositions = () => {
		this.setState((prevState) => {
			const currentImagesArray = prevState.imageArray;
			const resultArray = [];
			currentImagesArray.forEach((image, index) => {
				const newImage = image;
				newImage.position = index;
				resultArray.push(newImage);
			});
			return { imageArray: resultArray };
		});
	};

	changeOrder = (orderArray) => {
		const reorderedImages = [];
		this.setState((prevState) => {
			const currentImagesArray = prevState.imageArray;
			// find and copy one by one, according to the order array received
			orderArray.forEach((index) => {
				const result = currentImagesArray.find(
					(obj) => obj.position === parseInt(index, 10)
				);
				reorderedImages.push(result);
			});
			return { imageArray: reorderedImages };
		});
	};

	deleteImages = async () => {
		if (this.state.deleteImagesArray.length > 0) {
			await deleteImage(this.state.deleteImagesArray);
		}
	};

	removeImage = async (position, fileName) => {
		this.setState((prevState) => {
			const { imageArray, deleteImagesArray } = prevState;
			// filter, copy all but the same position (the one deleted)
			const result = imageArray.filter(
				(obj) => obj.position !== position
			);
			// deleted add to array for later delete
			const deleteResult = deleteImagesArray;
			deleteResult.push(fileName);
			return { imageArray: result, deleteImagesArray: deleteResult };
		});
	};

	renderRow = ({ data, active }) => (
		<SortableRow
			data={data}
			active={active}
			removeImage={(position, fileName) => this.removeImage(position, fileName)
			}
		/>
	);

	editImages = () => {
		const data = _.keyBy(this.state.imageArray, 'position');
		// if there are images on the service already, edit
		if (this.state.imageArray) {
			return (
				<View>
					<Text
						style={[
							globalStyles.sectionTitle,
							{ color: colors.secondaryColor }
						]}
					>
						Edit images
					</Text>
					<View>
						<SortableList
							horizontal
							data={data}
							style={styles.list}
							contentContainerStyle={styles.contentContainer}
							renderRow={this.renderRow}
							autoscrollAreaSize={-200}
							onChangeOrder={(nextOrder) => this.changeOrder(nextOrder)
							}
						/>
					</View>
					<Text style={{ fontSize: 12, color: colors.darkGray }}>
						Reorder images as you want them to be seen by customers
						(press and hold to reorder). the first image will be the
						main image of your service
					</Text>
					<Button
						bordered
						color={colors.secondaryColor}
						textColor={colors.secondaryColor}
						onPress={() => this.pickImage()}
						disabled={
							this.state.imageArray
							&& this.state.imageArray.length >= 5
						}
						style={{ marginTop: 10 }}
					>
						<Text>Add image</Text>
					</Button>
				</View>
			);
		}
		// Else. option to add images
		return (
			<View>
				<Text
					style={[
						globalStyles.sectionTitle,
						{ color: colors.secondaryColor }
					]}
				>
					Add images
				</Text>
				<Text style={{ fontSize: 14, color: colors.darkGray }}>
					Customers love to see images, pick some good quality images
					to atract more customers to use your services
				</Text>
				{this.state.imageArray && this.state.imageArray.length > 0 ? (
					<SortableList
						horizontal
						data={data}
						style={styles.list}
						contentContainerStyle={styles.contentContainer}
						renderRow={this.renderRow}
						autoscrollAreaSize={-200}
						onChangeOrder={(nextOrder) => this.changeOrder(nextOrder)
						}
					/>
				) : null}
				<Button
					bordered
					color={colors.secondaryColor}
					textColor={colors.secondaryColor}
					onPress={() => this.pickImage()}
					disabled={
						this.state.imageArray
						&& this.state.imageArray.length >= 5
					}
					style={{ marginTop: 10 }}
				>
					<Text>Add image</Text>
				</Button>
			</View>
		);
	};

	renderSpinner() {
		if (this.state.loading) {
			return (
				<ActivityIndicator
					size="large"
					color={colors.primaryColor}
					style={{ marginTop: 10 }}
				/>
			);
		}
		return <View />;
	}

	render() {
		const { contentStyle, buttonStyle } = styles;
		// TODO: WORKING HERE
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
				<CustomHeader
					title="Edit your Service"
					left={this.headerLeftIcon()}
					right={this.headerRightIcon()}
				/>
				<KeyboardAvoidingView
					behavior="padding"
					style={{ flex: 1, justifyContent: 'center' }}
				>
					<ScrollView
						style={contentStyle}
						keyboardShouldPersistTaps="handled"
						ref={(scrollRef) => {
							this.scrollRef = scrollRef;
						}}
					>
						{this.renderSpinner()}
						<FloatingLabelInput
							label="Service title"
							value={this.state.title}
							firstColor={colors.darkGray}
							secondColor={colors.secondaryColor}
							onChangeText={(title) => this.setState({ title })}
							fontColor={colors.black}
							maxLength={25}
							style={{ marginTop: 20 }}
						/>
						<TextArea
							style={{ marginTop: 20 }}
							label="Description"
							size={40}
							firstColor={colors.darkGray}
							secondColor={colors.secondaryColor}
							fontColor={colors.black}
							multiline
							bordered
							numberOfLines={6}
							placeholder="Describe your Service Here"
							value={this.state.description}
							onChangeText={(description) => this.setState({ description })
							}
						/>

						<FloatingLabelInput
							value={this.state.phone}
							label="Contact phone"
							firstColor={colors.darkGray}
							secondColor={colors.secondaryColor}
							fontColor={colors.black}
							onChangeText={(phone) => this.phoneChangeText(phone)
							}
							style={{ marginTop: 20 }}
							maxLength={16}
							keyboardType="phone-pad"
						/>
						<FloatingLabelInput
							value={this.state.location}
							label="Address, Zip Code, or Location"
							firstColor={colors.darkGray}
							secondColor={colors.secondaryColor}
							fontColor={colors.black}
							onChangeText={(text) => this.onLocationChange(text)}
							style={{ marginTop: 20 }}
						/>
						<Text
							style={[
								globalStyles.sectionTitle,
								{ marginTop: 10, fontWeight: '300' }
							]}
						>
							Distance:{' '}
							<Text style={{ fontWeight: '400' }}>
								{this.state.miles} miles
							</Text>
						</Text>
						<Slider
							onValueChange={(value) => this.onMilesChange(value)}
							value={this.state.miles}
							step={1}
							minimumValue={1}
							maximumValue={60}
							minimumTrackTintColor={colors.secondaryColor}
							thumbTintColor={colors.secondaryColor}
						/>
						<View pointerEvents="none">
							<MapView
								style={{
									height: 200,
									width: '100%',
									marginTop: 20,
									borderRadius: 8
								}}
								region={this.state.region}
							>
								<MapView.Circle
									center={this.state.center}
									radius={this.state.radius}
									strokeColor="#FF7043"
								/>
							</MapView>
						</View>
						{this.editImages()}
						<Button
							bordered
							disabled={this.state.loading}
							style={buttonStyle}
							onPress={() => this.updateService()}
							color={colors.primaryColor}
							textColor={colors.primaryColor}
						>
							<Text>Update Service</Text>
						</Button>
					</ScrollView>
				</KeyboardAvoidingView>
			</SafeAreaView>
		);
	}
}
const styles = {
	contentStyle: {
		flex: 1,
		marginTop: 10,
		paddingLeft: 20,
		paddingRight: 20
	},
	buttonStyle: {
		top: 20,
		marginBottom: 30,
		width: '100%'
	},
	list: {
		height: 160,
		width: '100%'
	},

	contentContainer: {
		...Platform.select({
			ios: {
				paddingVertical: 30
			},

			android: {
				paddingVertical: 0
			}
		})
	}
};

const mapStateToProps = (state) => ({
	user: state.auth.user
});

export default connect(
	mapStateToProps,
	{ showToast }
)(EditServiceScreen);
