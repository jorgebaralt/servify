import React from 'react';
import { View, StyleSheet, Modal, Dimensions } from 'react-native';
import { Button, Text } from 'native-base';

const {width} = Dimensions.get('window');

const CustomModal = (props) => {
	return (
		<Modal
			animationType="fade"
			transparent
			visible={props.modalVisible}
			onRequestClose={() => props.closeModal}
		>
			<View style={styles.modalStyle}>
				<View style={styles.containerStyle}>
					{props.children}
					<View
						style={{
							display: 'flex',
							flexDirection: 'row',
							flexGrow: 1,
							width: '100%',
							marginTop: 20,
						}}
					>
						<Button primary style={{ width: '50%', justifyContent: 'center', borderRadius: 0, borderLeftColor: 'transparent', borderBottomColor:'transparent'}} onPress={props.done}>
							<Text> Done </Text>
						</Button>
						<Button bordered style={{ width: '50%', justifyContent: 'center', borderRadius: 0, borderRightColor:'transparent', borderBottomColor:'transparent'}} onPress={props.closeModal}>
							<Text>Close</Text>
						</Button>
					</View>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalStyle: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.6)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	containerStyle: {
		height: 'auto',
		width: width * (7 / 10),
		backgroundColor: 'white',
		opacity: 0.99,
		borderRadius: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.8,
		shadowRadius: 2,
		elevation: 1,
		zIndex: 10,
		overflow:'hidden'
	},
});

export default CustomModal;
