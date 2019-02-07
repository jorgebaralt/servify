import React, { Component } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	Dimensions,
	Animated
} from 'react-native';
import { colors } from '../../../shared/styles';

const { height, width } = Dimensions.get('window');

class AnimatedHeader extends Component {
	state = { opacity: new Animated.Value(0) };

	componentDidUpdate() {
		Animated.timing(this.state.opacity, {
			toValue: this.props.showTitle ? 1 : 0,
			duration: 10
		}).start();
	}

	render() {
		const { ...props } = this.props;

		const defaultStyle = {
			height: height > 800 ? 90 : 70,
			borderBottomWidth: props.transparent ? 0 : 0.5,
			borderBottomColor: colors.lightGray,
			justifyContent: 'center',
			backgroundColor: props.transparent
				? 'rgba(0,0,0,0.02)'
				: colors.white,
			shadowOpacity: 0.05,
			shadowRadius: 5,
			shadowOffset: { width: 0, height: 5 },
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0
		};
		return (
			<View style={defaultStyle}>
				<View style={{ marginTop: 30 }}>
					<Animated.Text
						style={{
							textAlign: 'center',
							fontSize: 18,
							fontWeight: 'bold',
							color: props.titleColor
								? props.titleColor
								: colors.black,
							marginTop: 5,
							opacity: this.state.opacity
						}}
					>
						{props.title ? props.title : null}
					</Animated.Text>
					<TouchableOpacity
						style={{
							position: 'absolute',
							left: 10,
							justifyContent: 'center'
						}}
					>
						{props.left}
					</TouchableOpacity>
					<TouchableOpacity
						style={{
							position: 'absolute',
							right: 10,
							justifyContent: 'center'
						}}
					>
						{props.right}
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}

export { AnimatedHeader };
