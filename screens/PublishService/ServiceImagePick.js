import React, { Component } from 'react';
import {
	ScrollView,
	Text,
	View,
	StyleSheet,
	Platform,
} from 'react-native';
import { ImagePicker, Permissions } from 'expo';
import SortableList from 'react-native-sortable-list';
import _ from 'lodash';
import { Button, SortableRow } from '../../components/UI';
import { colors, globalStyles } from '../../shared/styles';


class ServiceImagePick extends Component {
	state = { imageCount: 0 };

	onNext = (props) => {
		props.onNext();
	};

	pickImage = async () => {
		const { status: cameraPerm } = await Permissions.askAsync(
			Permissions.CAMERA
		);

		const { status: cameraRollPerm } = await Permissions.askAsync(
			Permissions.CAMERA_ROLL
		);

		if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
			const result = await ImagePicker.launchImageLibraryAsync({
				allowsEditing: true
			});
			if (!result.cancelled) {
				this.props.addImage(this.state.imageCount, result.uri);
				this.setState((prevState) => {
					const imageCount = prevState.imageCount + 1;
					return { imageCount };
				});
			}
		}
	};

	_renderRow = ({ data, active }) => (
		<SortableRow data={data} active={active} removeImage={(position, newData) => this.props.removeImage(position,newData)} />
	);

	renderImages = () => {
		const data = _.keyBy(this.props.state.images, 'position');
		if (Object.keys(data).length > 0) {
			return (
				<View>
					<SortableList
						horizontal
						data={data}
						style={styles.list}
						contentContainerStyle={styles.contentContainer}
						renderRow={this._renderRow}
						autoscrollAreaSize={-200}
						onChangeOrder={(nextOrder) => this.props.changeOrder(nextOrder)}
					/>
				</View>
			);
		}
	};

	render() {
		const { ...props } = this.props;
		return (
			<ScrollView
				style={{
					width: props.width,
					paddingLeft: 20,
					paddingRight: 20
				}}
				keyboardShouldPersistTaps="handled"
			>
				<Text style={globalStyles.stepStyle}>Step 4 (optional)</Text>
				<Text style={[globalStyles.sectionTitle, { marginTop: 10 }]}>
					Pick some images for your service
				</Text>
				<Text style={globalStyles.publishDescriptionStyle}>
					Images are a good way to atract customers, make sure to pick
					good quality images.
				</Text>

				{this.renderImages()}

				<Button
					bordered
					color={colors.secondaryColor}
					textColor={colors.secondaryColor}
					onPress={() => this.pickImage()}
					disabled={this.props.state.images && this.props.state.images.length >= 5}
					style={{ marginTop: 10 }}
				>
					<Text>Add image</Text>
				</Button>

				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						marginTop: 40,
						marginBottom: 40
					}}
				>
					<Button
						bordered
						color={colors.primaryColor}
						onPress={props.onBack()}
						textColor={colors.primaryColor}
					>
						<Text>Back</Text>
					</Button>
					<Button
						color={colors.primaryColor}
						onPress={() => this.onNext(props)}
						style={{ width: '40%' }}
					>
						<Text>Next</Text>
					</Button>
				</View>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
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
});
export default ServiceImagePick;
