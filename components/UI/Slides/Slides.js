import React, { Component } from 'react';
import { View, ScrollView, Dimensions, TouchableOpacity, Text } from 'react-native';
import { Button } from '..';

const SCREEN_WIDTH = Dimensions.get('window').width;

class Slides extends Component {
	// Render button on last slide
	renderLastSlide(i) {
		if (i === this.props.data.length - 1) {
			return (
				<View style={styles.buttonStyle}>
					<Button
						bordered
						onPress={this.props.onComplete}
					>
						Lets Go!
					</Button>
				</View>
			);
		}
		return <View />;
	}

	// Render progress dots dots depending on slide
	renderDots(current) {
		return this.props.data.map((slide, i) => {
			if (i === current) {
				return <View key={i} style={styles.currentDot} />;
			}
			return <View key={i} style={styles.defaultDot} />;
		});
	}

	// Render skip button on first slide
	renderSkipButton(current) {
		if (current === 0) {
			return (
				<TouchableOpacity
					style={{ position: 'absolute', bottom: 30, right: 20 }}
					// onPress={} Navigate to Login Screen
				>
                    <Text
                        style={{ fontSize: 16, color: 'white' }}
                        onPress={this.props.onComplete}
                    >
                        Skip Tutorial
                    </Text>
				</TouchableOpacity>
			);
		}
		return <View />;
	}

	renderSlides = () => this.props.data.map((slide, i) => (
			<View
				key={slide.text}
				style={[styles.slideStyle, { backgroundColor: slide.color }]}
			>
				<Text style={styles.textStyle}>{slide.text}</Text>
				<View style={{ flexDirection: 'row' }}>{this.renderDots(i)}</View>
				{this.renderLastSlide(i)}
				{this.renderSkipButton(i)}
			</View>
		));

	render() {
		return (
			<ScrollView horizontal style={{ flex: 1 }} pagingEnabled>
				{this.renderSlides()}
			</ScrollView>
		);
	}
}
const styles = {
	slideStyle: {
		flex: 1,
		alignItems: 'center',
		width: SCREEN_WIDTH,
		justifyContent: 'center'
	},
	textStyle: {
		fontSize: 30,
		color: 'white',
		textAlign: 'center'
	},
	buttonStyle: {
		position: 'absolute',
		bottom: 40
	},
	defaultDot: {
		top: 10,
		height: 10,
		width: 10,
		backgroundColor: '#bbb',
		borderRadius: 100 / 2,
		margin: 10
	},
	currentDot: {
		top: 10,
		height: 10,
		width: 10,
		backgroundColor: '#FAFAFA',
		borderRadius: 100 / 2,
		margin: 10
	}
};
export default Slides;