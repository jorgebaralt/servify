import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
	StyleSheet,
	Text,
	Modal,
	SafeAreaView,
	FlatList,
	Dimensions
} from 'react-native';
import { CustomHeader } from '..';

const SCREEN_WIDTH = Dimensions.get('window').width;

// TODO: new component here, without color
const renderList = (item, props) => (
	<Text style={styles.cardStyle} onPress={() => props.callback(item)}>
		{item.title}
	</Text>
);

const renderIcon = (props) => (
		<Ionicons
			type="Ionicons"
			size={32}
			name="md-close"
			onPress={() => props.callback()}
		/>
	);

const ListModal = (props) => (
	<Modal
		transparent={false}
		visible={props.visible}
		onRequestClose={() => props.closeModal}
		animationType="slide"
	>
		<SafeAreaView>
			<CustomHeader title={props.title} left={renderIcon(props)} />
			<FlatList
				data={props.data}
				renderItem={({ item }) => renderList(item, props)}
				numColumns={2}
				keyExtractor={(category) => category.title}
				style={{ marginTop: 10, marginBottom: 10 }}
			/>
		</SafeAreaView>
	</Modal>
);

const styles = StyleSheet.create({
	cardStyle: {
		height: 60,
		borderRadius: 8,
		marginLeft: 10,
		marginTop: 5,
		width: SCREEN_WIDTH / 2 - 15,
		overflow: 'hidden'
	}
});

export default ListModal;
