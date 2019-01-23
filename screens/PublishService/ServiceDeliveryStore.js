import React, { Component } from 'react';
import { ScrollView, Text, View, Keyboard } from 'react-native';
import { Button, ListPicker } from '../../components/UI';
import { colors, globalStyles } from '../../shared/styles';

const onNext = (props) => {
	Keyboard.dismiss();
	props.onNext();
};

class ServiceDeliveryStore extends Component {
	state = { modalVisible: false };

	render() {
		const options = [
			{ title: 'We only Deliver', option: 0 },
			{ title: 'We have Physical Location', option: 1 },
			{ title: 'We do Both', option: 2 }
		];
		return (
			<ScrollView
				style={{
					width: this.props.width,
					paddingLeft: 20,
					paddingRight: 20
				}}
				keyboardShouldPersistTaps="handled"
			>
				<Text style={globalStyles.stepStyle}>Step 3</Text>
				<Text style={[globalStyles.sectionTitle, { marginTop: 10 }]}>
					More info about your service
				</Text>
				<Text style={globalStyles.publishDescriptionStyle}>
					we need to know if either you have a physical location
					(store), you can deliver your service, or both.
				</Text>
				<ListPicker
					onPress={() => this.setState({ modalVisible: true })}
					visible={this.state.modalVisible}
					callback={(deliveryStore) => {
						this.props.selectDeliveryStore(deliveryStore);
						this.setState({ modalVisible: false });
					}}
					label="Option"
					selected={this.props.state.deliveryStore}
					placeholder="Pick an option"
					title="Option"
					data={options}
					color={colors.secondaryColor}
					style={{ marginTop: 50 }}
				/>
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
						onPress={() => this.props.onBack()}
						textColor={colors.primaryColor}
					>
						<Text>Back</Text>
					</Button>
					<Button
						color={colors.primaryColor}
						onPress={() => onNext(this.props)}
						style={{ width: '40%' }}
						disabled={!this.props.state.deliveryStore}
					>
						<Text>Next</Text>
					</Button>
				</View>
			</ScrollView>
		);
	}
}

export default ServiceDeliveryStore;
