import React, { Component } from 'react';
import { Animated, Easing, StyleSheet, Image, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FadeImage } from '..';
import { colors } from '../../../shared/styles';

class SortableRow extends Component {
	constructor(props) {
		super(props);

		this._active = new Animated.Value(0);

		this._style = {
			...Platform.select({
				ios: {
					transform: [
						{
							scale: this._active.interpolate({
								inputRange: [0, 1],
								outputRange: [1, 1.1]
							})
						}
					],
					shadowRadius: this._active.interpolate({
						inputRange: [0, 1],
						outputRange: [2, 10]
					})
				},

				android: {
					transform: [
						{
							scale: this._active.interpolate({
								inputRange: [0, 1],
								outputRange: [1, 1.07]
							})
						}
					],
					elevation: this._active.interpolate({
						inputRange: [0, 1],
						outputRange: [2, 6]
					})
				}
			})
		};
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.active !== nextProps.active) {
			Animated.timing(this._active, {
				duration: 300,
				easing: Easing.bounce,
				toValue: Number(nextProps.active)
			}).start();
		}
	}

	render() {
		const { data, active } = this.props;

		return (
			<Animated.View style={[styles.row, this._style]}>
				<FadeImage uri={data.image} style={styles.image} />
				<MaterialIcons
					name="delete"
					size={18}
					style={{ color: colors.danger, position: 'absolute', right: 5, top: 5 }}
					onPress={() => this.props.removeImage(data.position)}
				/>
			</Animated.View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#eee',

		...Platform.select({
			ios: {
				paddingTop: 20
			}
		})
	},

	row: {
		flexDirection: 'column',
		alignItems: 'center',
		backgroundColor: colors.white,
		marginHorizontal: 10,
		borderRadius: 5,
		...Platform.select({
			ios: {
				shadowColor: 'rgba(0,0,0,0.2)',
				shadowOpacity: 1,
				shadowOffset: { height: 2, width: 2 },
				shadowRadius: 2
			},

			android: {
				elevation: 0,
				marginHorizontal: 30
			}
		})
	},

	image: {
		width: 100,
		height: 100,
		borderRadius: 5
	},

	text: {
		fontSize: 18,
		color: '#222222'
	}
});
export { SortableRow };
