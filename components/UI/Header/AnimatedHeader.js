import React, { Component } from 'react';
import { Header } from 'react-navigation';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { colors } from '../../../shared/styles';

class AnimatedHeader extends Component {
	render() {
		const { ...props } = this.props;

		const defaultStyle = {
			height: 90,
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
			right: 0,
			zIndex: 100,
		};

		return (
			<View style={defaultStyle}>
				<View style={{ marginTop: 30 }}>
					<Text
						style={{
							textAlign: 'center',
							fontSize: 20,
							fontWeight: 'bold',
							color: props.titleColor
								? props.titleColor
								: colors.black,
							marginTop: 5,
							opacity: props.transparent ? 0 : 1
						}}
					>
						{props.title ? props.title : null}
					</Text>
					<TouchableOpacity
						style={{ position: 'absolute', left: 10 }}
					>
						{props.left}
					</TouchableOpacity>
					<TouchableOpacity
						style={{ position: 'absolute', right: 10 }}
					>
						{props.right}
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}

export { AnimatedHeader };
