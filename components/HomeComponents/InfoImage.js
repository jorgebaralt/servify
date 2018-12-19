import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, ImageBackground, TouchableOpacity, Animated } from 'react-native';
import { Text, Button } from 'native-base';

const { width } = Dimensions.get('window');

class InfoImage extends Component{
	state = { fadeAnimation: new Animated.Value(0) }

	onLoad = () => {
		Animated.timing(this.state.fadeAnimation, {
			toValue: 1,
			duration: 400
		}).start();
	};

	render() {
		return (
			<TouchableOpacity style={styles.content}>
				<Animated.View style={{ opacity: this.state.fadeAnimation }}>
					<ImageBackground
						source={require('../../assets/backgrounds/yellow.jpg')}
						style={{ width: 'auto', height: '100%'}}
						onLoad={this.onLoad}
						resizeMode="cover"
					>
						<View style={{ position: 'absolute', left: 20, bottom: 20, right: 5 }}>
							<Text style={{ fontSize: 30, color: 'white', fontWeight: '600', marginBottom: 50 }}>{this.props.text}</Text>
							<Button bordered light>
								<Text style={{ fontSize: 20 }}>{this.props.buttonText}</Text>
							</Button>
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
		height: 300,
		marginTop: 15,
		width: width - 40,
		marginLeft: 20,
		overflow: 'hidden',
		borderRadius: 8,
		marginBottom: 40,
	}
});

export default InfoImage;
