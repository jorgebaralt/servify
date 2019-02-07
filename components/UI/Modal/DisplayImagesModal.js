import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
	View,
	StyleSheet,
	Modal,
	Dimensions,
	Text,
	FlatList,
	TouchableOpacity
} from 'react-native';
import { FadeImage } from '..';

const WIDTH = Dimensions.get('window').width;

const renderHeaderImages = (imagesInfo) => (
	<FadeImage uri={imagesInfo.url} style={{ height: 350, width: WIDTH }} />
);

export const DisplayImagesModal = (props) => (
	<Modal
		animationType="fade"
		transparent
		visible={props.imageModalVisible}
		onRequestClose={() => props.closeImageModal()}
	>
		<View style={styles.modalStyle}>
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
				renderItem={({ item }) => renderHeaderImages(item)}
				keyExtractor={(item) => item.fileName}
				pagingEnabled
				contentContainerStyle={{
					flexGrow: 1,
					justifyContent: 'center',
					alignItems: 'center'
				}}
				style={{ marginTop: 150, marginBottom: 150 }}
			/>
		</View>
	</Modal>
);

const styles = StyleSheet.create({
	modalStyle: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.95)',
		justifyContent: 'center',
		alignItems: 'center'
	}
});
