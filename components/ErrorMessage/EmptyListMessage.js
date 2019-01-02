import React, { Component } from 'react';
import { View, Animated, Text } from 'react-native';
import { DangerZone } from 'expo';
import { Button } from '../UI';

const { Lottie } = DangerZone;

class EmptyListMessage extends Component {
	state = { fadeAnimation: new Animated.Value(0) };

	componentDidMount() {
		this.animation.play();
		Animated.timing(this.state.fadeAnimation, {
			toValue: 1,
			duration: 2500
		}).start();
	}

	render() {
		const { titleStyle, descriptionStyle } = styles;
		return (
			<View
				style={{
					flex: 1,
				}}
			>
				<View
					style={{
						width: 250,
						height: 250,
						alignSelf: 'center'
					}}
				>
					<Lottie
						ref={(animation) => {
							this.animation = animation;
						}}
						style={{
							width: 250,
							height: 250
						}}
						loop={false}
						source={require('../../assets/lottie/search&locate.json')}
					/>
				</View>

				<Animated.Text
					style={[titleStyle, { opacity: this.state.fadeAnimation }]}
				>
					Oops!
				</Animated.Text>

				<Animated.Text
					style={[
						descriptionStyle,
						{ opacity: this.state.fadeAnimation }
					]}
				>
					{this.props.children}
				</Animated.Text>
				<Button
					style={{ alignSelf: 'center', marginTop: 40 }}
					color="#C62828"
					onPress={this.props.buttonPress}
				>
					<Text>Go Back!</Text>
				</Button>
			</View>
		);
	}
}

const styles = {
	titleStyle: {
		fontSize: 20,
		fontWeight: 'bold',
		textAlign: 'center',
		marginTop: 20
	},
	descriptionStyle: {
		fontSize: 16,
		textAlign: 'center',
		marginLeft: 20,
		marginRight: 20,
		marginTop: 20
	}
};

export default EmptyListMessage;
