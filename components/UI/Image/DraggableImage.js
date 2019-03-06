import React, { Component } from 'react';
import { Animated, PanResponder, View } from 'react-native';
import { FadeImage } from '..';

class DraggableImage extends Component {
	state = { position: new Animated.ValueXY() };

	componentWillMount() {
		this.panResponder = PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onPanResponderMove: (event, gesture) => {
				// console.log(gesture);
				this.setState((prevState) => {
					const pos = prevState.position;
					pos.setValue({
						x: 0,
						y: gesture.dy
					});
					return { position: pos };
				});
			},
			onPanResponderRelease: (e, gesture) => {
				if (gesture.dy > 120) {
					this.props.closeModal();
				}
				this.setState((prevState) => {
					const pos = prevState.position;
					pos.setValue({
						x: 0,
						y: 0
					});
					return { position: pos };
				});
			},
			onPanResponderTerminate: (e, gesture) => {
				if (gesture.dy > 120) {
					this.props.closeModal();
				}
				this.setState((prevState) => {
					const pos = prevState.position;
					pos.setValue({
						x: 0,
						y: 0
					});
					return { position: pos };
				});
			}
		});
	}

	render() {
		const { ...props } = this.props;
		return (
			<Animated.View
				{...this.panResponder.panHandlers}
				style={this.state.position.getLayout()}
			>
				<FadeImage uri={props.uri} style={props.style} />
			</Animated.View>
		);
	}
}

export { DraggableImage };
