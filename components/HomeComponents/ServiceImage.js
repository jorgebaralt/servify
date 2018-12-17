import React, { Component } from 'react';
import { Image, Animated, StyleSheet, View } from 'react-native';

class ServiceImage extends Component {
	state = { fadeAnimation: new Animated.Value(0) }

	onLoad = () => {
		Animated.timing(
			this.state.fadeAnimation, {
				toValue: 1,
				duration: 400
			}
		).start();
	}

	render() {
		return (
			<View style={{width: 'auto', height: 100, backgroundColor: '#EEEEEE'}}>
				<Animated.Image source={require('../../assets/default/food/1.jpg')} style={{ width: 'auto', height: 100, opacity: this.state.fadeAnimation }} onLoad={this.onLoad} />
			</View>
		);
	}
}

export default ServiceImage;
