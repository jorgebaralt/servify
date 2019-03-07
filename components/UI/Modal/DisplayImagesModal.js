import React, { Component } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
	View,
	StyleSheet,
	Modal,
	Dimensions,
	FlatList,
	TouchableOpacity,
	Animated
} from 'react-native';
import { DraggableImage } from '..';

const WIDTH = Dimensions.get('window').width;

class DisplayImagesModal extends Component {
	state = {
		backgroundOpacity: new Animated.Value(1),
		scrollEnabled: true
	};

	renderHeaderImages = (imagesInfo, props) => (
		<DraggableImage
			uri={imagesInfo.url}
			style={{ height: 350, width: WIDTH }}
			closeModal={() => props.closeImageModal()}
			onDragDown={() => {
				Animated.timing(this.state.backgroundOpacity, {
					toValue: 0,
					duration: 200
				}).start();
			}}
			onDragUp={() => {
				Animated.timing(this.state.backgroundOpacity, {
					toValue: 1,
					duration: 25
				}).start();
			}}
		/>
	);

	render() {
		const { ...props } = this.props;
		Animated.timing(this.state.backgroundOpacity, {
			toValue: 1,
			duration: 25
		}).start();
		const modalStyle = {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: this.state.backgroundOpacity.interpolate({
				inputRange: [0, 1],
				outputRange: ['rgba(0,0,0,0.45)', 'rgba(0,0,0,0.95)']
			})
		};
		return (
			<Modal
				animationType="fade"
				transparent
				visible={props.imageModalVisible}
				onRequestClose={() => props.closeImageModal()}
			>
				<Animated.View style={modalStyle}>
					<TouchableOpacity
						style={{
							position: 'absolute',
							top: 30,
							left: 15,
							heigth: 80,
							width: 50
						}}
						onPress={() => props.closeImageModal()}
					>
						<Ionicons
							style={{
								color: 'white'
							}}
							type="Ionicons"
							size={32}
							name="md-close"
							onPress={() => props.closeImageModal()}
						/>
					</TouchableOpacity>

					<FlatList
						horizontal
						data={props.images}
						renderItem={({ item }) => this.renderHeaderImages(item, props)
						}
						keyExtractor={(item) => item.fileName}
						pagingEnabled
						contentContainerStyle={{
							flexGrow: 1,
							justifyContent: 'center',
							alignItems: 'center'
						}}
						style={{ marginTop: 50 }}
						scrollEnabled={this.state.scrollEnabled}
					/>
				</Animated.View>
			</Modal>
		);
	}
}

export { DisplayImagesModal };
