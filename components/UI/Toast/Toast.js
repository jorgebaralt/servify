import React, { Component } from 'react';
import { View, Text, Animated } from 'react-native';
import { connect } from 'react-redux';
import { colors } from '../../../shared/styles';
import { hideToast } from '../../../actions';

class Toast extends Component {
	componentWillMount() {
		this._showToast = new Animated.Value(0);
	}

	componentDidUpdate() {
		if (this.props.toast.show) {
			this.showToast();
			setTimeout(() => this.hideToast(), this.props.toast.duration);
		}
	}

	showToast = () => {
		Animated.timing(this._showToast, {
			toValue: 1,
			duration: 400
		}).start();
	};

	hideToast = () => {
		Animated.timing(this._showToast, {
			toValue: 0,
			duration: 400
		}).start();
	};

	render() {
		let colorStyle;
		switch (this.props.toast.type) {
			case 'warning':
				colorStyle = colors.warning;
				break;
			case 'success':
				colorStyle = colors.success;
				break;
			default:
				colorStyle = colors.success;
		}
		const animatedViewStyle = {
			zIndex: this._showToast.interpolate({
				inputRange: [0, 1],
				outputRange: [-1, 0]
			}),
			opacity: this._showToast.interpolate({
				inputRange: [0, 1],
				outputRange: [0, 1]
			}),
			position: 'absolute',
			bottom: 30,
			left: 20,
			right: 20,
			borderRadius: 5,
			backgroundColor: colorStyle,
			justifyContent: 'space-between',
			padding: 10,
			flexDirection: 'row'
		};

		return (
			<Animated.View style={animatedViewStyle}>
				<Text style={{ color: colors.white, fontSize: 18, marginRight: 10 }}>
					{this.props.toast.message}
				</Text>
				<Text
					onPress={() => this.hideToast()}
					style={{ color: colors.white, fontSize: 18 }}
				>
					OK
				</Text>
			</Animated.View>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		toast: state.toast
	};
};

export default connect(
	mapStateToProps,
	{ hideToast }
)(Toast);
