import React, { Component } from 'react';
import {
	SafeAreaView,
	Text,
	ActivityIndicator,
	ScrollView,
	View,
	Alert
} from 'react-native';
import { connect } from 'react-redux';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import {
	Button,
	FloatingLabelInput,
	CustomHeader,
	FadeImage
} from '../../components/UI';
import { colors } from '../../shared/styles';

class EditUserScreen extends Component {
	state = { loading: false };

	async componentDidMount() {
		await this.setState({
			email: this.props.user.email,
			username: this.props.user.displayName,
			imageURL: this.props.user.imageInfo.url || this.props.user.photoURL
		});
	}

	updateProfile = () => {
		// TODO: update profile
		console.log('update profile');
	};

	headerLeftIcon = () => (
		<Ionicons
			name="ios-arrow-back"
			size={32}
			style={{ color: colors.black }}
			onPress={() => this.props.navigation.pop()}
			disabled={this.state.loading}
		/>
	);

	deleteImage = () => {
		console.log('delete image');
	}

	deleteAlert = () => {
		Alert.alert('Delete', 'Are you sure you want to delete your profile image?', [
			{
				text: 'Delete',
				onPress: () => this.deleteImage(),
				style: 'destructive'
			},
			{
				text: 'Cancel'
			}
		]);
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
					{/* TODO: else, show image picker */}
					{this.state.imageURL != null ? (
						<View>
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
							<FadeImage
								uri={this.state.imageURL}
								style={{
									width: '100%',
									heigth: 200,
									marginTop: 20,
									borderRadius: 8,
									zIndex: -1
								}}
							/>
						</View>
					) : null}

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
					{this.props.user.provider === 'password' ? (
						<FloatingLabelInput
							label="Username"
							value={this.state.username}
							firstColor={colors.darkGray}
							secondColor={colors.secondaryColor}
							onChangeText={(username) => this.setState({ username })
							}
							fontColor={colors.black}
							maxLength={25}
							style={{ marginTop: 20 }}
						/>
					) : null}
					<Button
						bordered
						disabled={this.state.loading}
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

export default connect(mapStateToProps)(EditUserScreen);
