import React, { Component } from 'react';
import { TextInput, Animated, View } from 'react-native';

// TODO: animate size of box
export class TextArea extends Component {
	state = { isFocused: false };

	componentWillMount() {
		// start position according to if there is a value
		this._animatedIsFocused = new Animated.Value(
			this.props.value === '' ? 0 : 1
		);
	}

	// every time there is a change on state.
	componentDidUpdate() {
		// on component update, look at isFocus and value to see if we animate (1) or not (0)
		Animated.timing(this._animatedIsFocused, {
			toValue: this.state.isFocused || this.props.value !== '' ? 1 : 0,
			duration: 200
		}).start();
	}

	handleFocus = () => {
		this.setState({ isFocused: true });
		if (this.props.onFocus) {
			this.props.onFocus();
		}
	};

	handleBlur = () => {
		this.setState({ isFocused: false });
		if (this.props.onBlur) {
			this.props.onBlur();
		}
	};

	render() {
		const { ...props } = this.props;
		const textInputStyle = {
			padding: props.bordered ? 5 : 0,
			height: '100%'
		};

		const labelStyle = {
			fontSize: this._animatedIsFocused.interpolate({
				inputRange: [0, 1],
				outputRange: [18, 14]
			}),
			color: this._animatedIsFocused.interpolate({
				inputRange: [0, 1],
				outputRange: [props.firstColor, props.secondColor]
			})
		};
		const viewStyle = {
			height: this._animatedIsFocused.interpolate({
				inputRange: [0, 1],
				outputRange: [props.size, props.size * props.numberOfLines / 2]
			}),
			borderWidth: props.bordered ? 1 : 0,
			borderRadius: props.bordered ? 5 : 0,
			borderColor: this._animatedIsFocused.interpolate({
				inputRange: [0, 1],
				outputRange: [props.firstColor, props.secondColor]
			})
		};

		return (
			<View style={props.style}>
				<Animated.Text style={labelStyle}>
					{this.props.label}
				</Animated.Text>
				<Animated.View style={viewStyle}>
					<TextInput
						{...props}
						style={textInputStyle}
						onFocus={this.handleFocus}
						onBlur={this.handleBlur}
					/>
				</Animated.View>
			</View>
		);
	}
}
