import React, { Component } from 'react';
import {
	SafeAreaView,
	Text,
	ActivityIndicator,
	ScrollView,
	View,
	Alert,
	Dimensions,
	TouchableOpacity
} from 'react-native';
import { Permissions, ImagePicker } from 'expo';
import { connect } from 'react-redux';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { updateCurrentUser } from '../../actions';
import {
	Button,
	FloatingLabelInput,
	CustomHeader,
	FadeImage
} from '../../components/UI';
import { deleteProfileImage, profileImageUpload } from '../../api';
import { colors } from '../../shared/styles';

const WIDTH = Dimensions.get('window').width;

class EditUserScreen extends Component {
	state = {
		loading: false,
		deleteImage: false,
		uploadImage: false,
		email: ''
	};

	async componentDidMount() {
		await this.setState({
			email: this.props.user.email,
			displayName: this.props.user.displayName,
			imageURL: this.props.user.imageInfo
				? this.props.user.imageInfo.url
				: null,
			fileName: this.props.user.imageInfo
				? this.props.user.imageInfo
				: null
		});
	}

	headerLeftIcon = () => (
		<Ionicons
			name="ios-arrow-back"
			size={32}
			style={{ color: colors.black }}
			onPress={() => this.props.navigation.pop()}
			disabled={this.state.loading}
		/>
	);

	deleteImage = async () => {
		if (this.props.user.imageInfo) {
			this.setState({
				fileName: null,
				imageURL: null,
				type: null,
				deleteImage: true
			});
			// TODO: fire action to update user
		} else {
			this.setState({ imageURL: null, fileName: null, type: null });
		}
	};

	deleteAlert = () => {
		Alert.alert(
			'Delete',
			'Are you sure you want to delete your profile image?',
			[
				{
					text: 'Delete',
					onPress: () => this.deleteImage(),
					style: 'destructive'
				},
				{
					text: 'Cancel'
				}
			]
		);
	};

	// Pick image
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
				const match = /\.(\w+)$/.exec(fileName);
				const type = match ? `image/${match[1]}` : 'image';
				this.setState({
					imageURL: result.uri,
					fileName,
					type,
					uploadImage: true
				});
			}
		}
	};

	updateProfile = async () => {
		this.setState({ loading: true });
		// TODO: update profile
		if (this.state.deleteImage && this.props.user.imageInfo != null) {
			console.log('deleting image');
			await deleteProfileImage(
				this.props.user.uid,
				this.props.user.imageInfo.fileName,
				() => this.setState({ fileName: null, imageURL: null })
			);
		}
		let imageInfo = null;
		if (this.state.uploadImage && this.state.fileName) {
			console.log('updating image');
			imageInfo = await profileImageUpload({
				image: this.state.imageURL,
				fileName: this.state.fileName,
				type: this.state.type
			});
		}
		const updatedUser = {
			email: this.state.email,
			displayName: this.state.displayName,
			imageInfo
		};
		await this.props.updateCurrentUser(updatedUser, this.props.user.uid);
		this.setState({ loading: false });
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
	}

	render() {
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
				<CustomHeader
					title="Edit your Profile"
					left={this.headerLeftIcon()}
				/>
				<ScrollView
					style={{ flex: 1, paddingLeft: 20, paddingRight: 20 }}
				>
					{this.renderSpinner()}
					{/* TODO: else, show image picker */}
					{this.state.imageURL != null ? (
						<View>
							{this.state.imageURL ? (
								<MaterialIcons
									name="delete"
									size={32}
									style={{
										color: colors.danger,
										position: 'absolute',
										right: 0,
										top: 20
									}}
									onPress={() => this.deleteAlert()}
									disabled={this.state.loading}
								/>
							) : null}

							<FadeImage
								uri={this.state.imageURL}
								style={{
									width: WIDTH - 40,
									heigth: 200,
									marginTop: 20,
									borderRadius: 8,
									zIndex: -1
								}}
							/>
						</View>
					) : (
						<TouchableOpacity
							style={{
								marginTop: 20,
								width: WIDTH - 40,
								backgroundColor: colors.lightGray,
								height: 200,
								borderRadius: 8,
								justifyContent: 'center'
							}}
							onPress={() => this.pickImage()}
						>
							<Text
								style={{
									color: colors.secondaryColor,
									fontSize: 40,
									alignSelf: 'center',
									fontWeight: 'bold'
								}}
							>
								Add Image
							</Text>
						</TouchableOpacity>
					)}

					<FloatingLabelInput
						label="Email"
						value={this.state.email}
						firstColor={colors.darkGray}
						secondColor={colors.secondaryColor}
						onChangeText={(email) => this.setState({ email })}
						fontColor={colors.black}
						maxLength={25}
						style={{ marginTop: 20 }}
					/>
					{this.state.email.includes('@') ? null : (
						<Text style={{ fontSize: 12, color: colors.danger }}>
							Email is bad formatted
						</Text>
					)}

					{this.props.user.provider === 'password' ? (
						<FloatingLabelInput
							label="Username"
							value={this.state.displayName}
							firstColor={colors.darkGray}
							secondColor={colors.secondaryColor}
							onChangeText={(displayName) => this.setState({ displayName })
							}
							fontColor={colors.black}
							maxLength={25}
							style={{ marginTop: 20 }}
						/>
					) : null}
					<Button
						bordered
						disabled={
							this.state.loading
							|| !this.state.email.includes('@')
						}
						style={{
							marginTop: 20,
							marginBottom: 30,
							width: '100%'
						}}
						onPress={() => this.updateProfile()}
						color={colors.primaryColor}
						textColor={colors.primaryColor}
					>
						<Text>Update Profile</Text>
					</Button>
				</ScrollView>
			</SafeAreaView>
		);
	}
}

const mapStateToProps = (state) => ({
	user: state.auth.user
});

export default connect(
	mapStateToProps,
	{ updateCurrentUser }
)(EditUserScreen);
