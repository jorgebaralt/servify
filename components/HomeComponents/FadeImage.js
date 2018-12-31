import React, { Component } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

class FadeImage extends Component {
	state = { fadeAnimation: new Animated.Value(0) };

	onLoad = () => {
		Animated.timing(this.state.fadeAnimation, {
			toValue: 1,
			duration: 400
		}).start();
	};

	render() {
		return (
			<View
				style={[styles.imageContainerStyle, this.props.style]}
			>
				<Animated.Image
					source={this.props.image}
					style={{
						width: 'auto',
						height: '100%',
						opacity: this.state.fadeAnimation,
					}}
					onLoad={this.onLoad}
					resizeMode="cover"
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	imageContainerStyle: {
		width: 'auto',
		height: 'auto',
		backgroundColor: '#EEEEEE',
		overflow: 'hidden'
	}
});

export default FadeImage;
