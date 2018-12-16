import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import { Text, Card, CardItem, Button } from 'native-base';
import { DangerZone } from 'expo';

const { Lottie } = DangerZone;

class EmptyListMessage extends Component {
	componentDidMount() {
		this.animation.play();
	}

	render() {
		const {
			iconStyle,
			cardStyle,
			titleStyle,
			descriptionStyle,
			buttonStyleiOS,
			buttonStyleAndroid
		} = styles;
		return (
			<View
				style={{
					flex: 1,
					alignItems: 'center'
				}}
			>
				<Card bordered={false} style={cardStyle}>
					<CardItem>
						<Lottie
							ref={(animation) => {
								this.animation = animation;
							}}
							style={{
								width: 200,
                                height: 200,
                                marginLeft: 20,
                            }}
                            loop={false}
							source={require('../assets/lottie/search&locate.json')}
						/>
					</CardItem>
					<CardItem>
						<Text style={titleStyle}>Oops!</Text>
					</CardItem>
					<CardItem>
						<Text style={descriptionStyle}>
							{this.props.children}
						</Text>
					</CardItem>
				</Card>
				<View
					style={
						Platform.OS === 'android'
							? buttonStyleAndroid
							: buttonStyleiOS
					}
				>
					<Button
						style={{ backgroundColor: '#C62828' }}
						onPress={this.props.buttonPress}
					>
						<Text>Go Back!</Text>
					</Button>
				</View>
			</View>
		);
	}
}

const styles = {
	iconStyle: {
		fontSize: 100,
		flex: 1,
		color: '#C62828',
		textAlign: 'center'
	},
	cardStyle: {
		top: '5%',
		width: '90%',
		height: '80%',
		alignContent: 'center',
		justifyContent: 'center'
	},
	titleStyle: {
		fontSize: 20,
		fontWeight: 'bold',
		alignContent: 'center',
		justifyContent: 'center',
		textAlign: 'center',
		flex: 1,
		marginTop: '10%'
	},
	descriptionStyle: {
		fontSize: 16,
		alignContent: 'center',
		justifyContent: 'center',
		textAlign: 'center',
		flex: 1,
		marginTop: '10%'
	},
	buttonStyleiOS: {
		position: 'absolute',
		top: '83%',
		alignItems: 'center'
	},
	buttonStyleAndroid: {
		top: 35
	}
};

export default EmptyListMessage;
