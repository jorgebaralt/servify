import React, { Component } from 'react';
import { Animated, View, TouchableHighlight } from 'react-native';

class FadeImage extends Component {
	state = { fadeAnimation: new Animated.Value(0) };

	onLoad = () => {
		Animated.timing(this.state.fadeAnimation, {
			toValue: 1,
			duration: 400
		}).start();
	};

	render() {
		const { width, height } = this.props.style;
		const imageContainerStyle = {
			width,
			height,
			backgroundColor: '#EEEEEE',
			overflow: 'hidden',
			borderRadius: this.props.circle ? width / 2 : null
		};
		return (
			<TouchableHighlight
				disabled={!this.props.onPress}
				onPress={this.props.onPress}
				style={[imageContainerStyle, this.props.style]}
			>
				<View>
					<Animated.Image
						source={
							this.props.uri
								? { uri: this.props.uri }
								: this.props.image
						}
						style={{
							width: 'auto',
							height: '100%',
							opacity: this.state.fadeAnimation,
							borderRadius: this.props.circle ? width / 2 : null
						}}
						onLoad={this.onLoad}
						resizeMode="cover"
					/>
				</View>
			</TouchableHighlight>
		);
	}
}

export { FadeImage };
