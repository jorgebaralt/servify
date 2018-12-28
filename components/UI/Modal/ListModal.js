import React from 'react';
import { Header } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import {
	View,
	StyleSheet,
	Text,
	Modal,
	SafeAreaView,
	TouchableOpacity,
	FlatList,
	Dimensions
} from 'react-native';
import { colors } from '../../../shared/styles';

const SCREEN_WIDTH = Dimensions.get('window').width;

// TODO: new component here, without color
const renderList = (item, props) => <Text style={styles.cardStyle} onPress={() => props.callback(item)}>{item.title}</Text>;

const ListModal = (props) => {
	return (
		<Modal
			transparent={false}
			visible={props.visible}
			onRequestClose={() => props.closeModal}
			animationType="slide"
		>
			<SafeAreaView>
				<View
					style={{
						height: Header.HEIGHT,
						borderBottomWidth: 0.5,
						borderBottomColor: colors.lightGray,
						justifyContent: 'center'
					}}
				>
					<Text
						style={{
							textAlign: 'center',
							fontSize: 20,
							fontWeight: 'bold'
						}}
					>
						{props.title}
					</Text>
					<TouchableOpacity
						onPress={() => props.callback()}
						style={{ position: 'absolute', left: 5 }}
					>
						<Ionicons type="Ionicons" size={32} name="ios-arrow-back" />
					</TouchableOpacity>
				</View>
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
};

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
