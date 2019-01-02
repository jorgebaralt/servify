import React, { Component } from 'react';
import { Header } from 'react-navigation';
import { View, Text, TextInput, Animated, Keyboard } from 'react-native';
import { colors } from '../../../shared/styles';

class SearchHeader extends Component {
	state = { isFocused: false };

	componentWillMount() {
		// initialize animation according to value
		this._animatedIsFocused = new Animated.Value(
			this.props.value === '' ? 0 : 1
		);
	}

	componentDidUpdate() {
		Animated.timing(this._animatedIsFocused, {
			toValue: this.state.isFocused || this.props.value !== '' ? 1 : 0,
			duration: 300
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

	cancelPress = () => {
		this.handleBlur();
		this.props.onCancel();
		Keyboard.dismiss();
	};

	render() {
		const inputStyle = {
			width: this._animatedIsFocused.interpolate({
				inputRange: [0, 1],
				outputRange: ['100%', '70%']
			}),
		};

		const cancelStyle = {
			marginLeft: this._animatedIsFocused.interpolate({
				inputRange: [0, 1],
				outputRange: [30, 20]
			}),
			justifyContent: 'center'
		};

		return (
			<View
				style={{
					height: Header.HEIGHT,
					borderBottomWidth: 0.5,
					borderBottomColor: colors.lightGray,
					justifyContent: 'center',
					backgroundColor: colors.white,
					shadowOpacity: 0.05,
					shadowRadius: 5,
					shadowOffset: { width: 0, height: 5 }
				}}
			>
				<View
					style={{
						paddingLeft: 20,
						paddingRight: 20,
						flexDirection: 'row'
					}}
				>
					<Animated.View style={inputStyle}>
						<TextInput
							value={this.props.value}
							onFocus={this.handleFocus}
							onBlur={this.handleBlur}
							onChangeText={this.props.onChangeText}
							placeholder={this.props.placeholder}
							placeholderTextColor={colors.darkGray}
							style={styles.inputStyle}
						/>
					</Animated.View>
					<Animated.View style={cancelStyle}>
						<Text
							style={{ fontSize: 18, marginLeft: 5 }}
							onPress={() => this.cancelPress()}
						>
							Cancel
						</Text>
					</Animated.View>
				</View>
			</View>
		);
	}
}

const styles = {
	inputStyle: {
		borderWidth: 1,
		borderRadius: 5,
		fontSize: 18,
		padding: 5,
		borderColor: colors.darkGray,
		color: colors.darkerGray,
		backgroundColor: colors.white,
		shadowOpacity: 0.2,
		shadowColor: colors.black,
		shadowOffset: { width: 0, height: 0 },
		shadowRadius: 5
	}
};

export { SearchHeader };
