import React, { Component } from 'react';
import { Animated, View, TouchableOpacity } from 'react-native';
import { colors } from '../../../shared/styles';

class FadeImage extends Component {
	state = { fadeAnimation: new Animated.Value(0) };

	onLoad = () => {
		Animated.timing(this.state.fadeAnimation, {
			toValue: 1,
			duration: 400
		}).start();
	};

	renderDots = () => {
		if (this.props.showDots) {
			const dots = [];
			for (let i = 0; i < this.props.dotCount; i++) {
				if (i === this.props.currentDot) {
					dots.push(<View key={i} style={styles.currentDot} />);
				} else {
					dots.push(<View key={i} style={styles.defaultDot} />);
				}
			}
			return (
				<View
					style={{
						flexDirection: 'row',
						position: 'absolute',
						bottom: 20,
						left: 0,
						right: 0,
						justifyContent: 'center',
						alignItems: 'center'
					}}
				>
					{dots}
				</View>
			);
		}
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
			<TouchableOpacity
				disabled={!this.props.onPress}
				onPress={this.props.onPress}
				style={[imageContainerStyle, this.props.style]}
			>
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
				{this.renderDots()}
			</TouchableOpacity>
		);
	}
}

const styles = {
	defaultDot: {
		top: 10,
		height: 10,
		width: 10,
		backgroundColor: colors.black,
		borderRadius: 100 / 2,
		margin: 10
	},
	currentDot: {
		top: 10,
		height: 10,
		width: 10,
		backgroundColor: colors.secondaryColor,
		borderRadius: 100 / 2,
		margin: 10
	}
};

export { FadeImage };
