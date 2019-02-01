import React, { Component } from 'react';
import { Animated } from 'react-native';

class ProgressBar extends Component {
	componentWillMount() {
		this.barWidth = new Animated.Value(this.props.width);
	}

	componentDidUpdate() {
		Animated.timing(this.barWidth, {
			toValue: this.props.width,
			duration: 300
		}).start();
	}

	render() {
		return (
			<Animated.View
				style={{
					backgroundColor: this.props.color,
					height: this.props.heigth,
					width: this.barWidth
				}}
			/>
		);
	}
}

export { ProgressBar };
