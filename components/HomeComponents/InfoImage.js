import React, { Component } from 'react';
import {
	View,
	StyleSheet,
	ImageBackground,
	TouchableOpacity,
	Animated,
} from 'react-native';

class InfoImage extends Component {
	state = { fadeAnimation: new Animated.Value(0) };

	onLoad = () => {
		Animated.timing(this.state.fadeAnimation, {
			toValue: 1,
			duration: 400
		}).start();
	};

	render() {
		return (
			<TouchableOpacity style={[styles.content, this.props.style, {borderRadius: this.props.rounded ? 8 : 0 }]} disabled={this.props.disablePress}>
				<Animated.View style={{ opacity: this.state.fadeAnimation }}>
					<ImageBackground
						source={this.props.image}
						style={{ width: 'auto', height: '100%' }}
						onLoad={this.onLoad}
						resizeMode="cover"
					>
						<View
							style={[
								styles.darkenImageStyle,
								{
									backgroundColor: `rgba(0,0,0,${
										this.props.opacity ? this.props.opacity : 0
									})`
								}
							]}
						>
							{this.props.children}
						</View>
					</ImageBackground>
				</Animated.View>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	content: {
		flex: 1,
		width: '100%',
		height: 300,
		overflow: 'hidden',
		backgroundColor: '#EEEEEE'
	},
	darkenImageStyle: {
		position: 'absolute',
		left: 0,
		bottom: 0,
		right: 0,
		top: 0
	}
});

export default InfoImage;
