import React, { Component } from 'react';
import { View, StyleSheet, TextInput, Animated } from 'react-native';
import { colors } from '../../../shared/styles';


export class FloatingLabelInput extends Component {
    state = {
        isFocused: false,
    };

    componentWillMount() {
        // start position of animation
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

    handleFocus = () => this.setState({ isFocused: true });

    handleBlur = () => this.setState({ isFocused: false });

    render() {
        const { label, ...props } = this.props;

        // look for changes from 0 to 1, and animate each style accordingly
        const labelStyle = {
            position: 'absolute',
            left: 0,
            top: this._animatedIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [18, 0]
            }),
            fontSize: this._animatedIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 14]
            }),
            color: this._animatedIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [this.props.firstColor, this.props.secondColor]
            })
        };

        // Animate border bottom
        const borderBottomAnimation = {
            height: 1.5,
            backgroundColor: this.props.secondColor,
            // alignSelf: 'center',
            width: this._animatedIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%']
            })
        };
        const initialBorderBottom = {
            alignSelf: 'flex-end',
            height: this._animatedIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 0]
            }),
            backgroundColor: this.props.firstColor,
            width: this._animatedIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: ['100%', '0%']
            })
        };

        return (
            <View style={[{ paddingTop: 18 }, this.props.style]}>
                {/* Apply animation to label text */}
                <Animated.Text style={labelStyle}>{label}</Animated.Text>
                <Animated.View>
                    <TextInput
                        onChangeText={this.props.onChangeText}
                        value={this.props.value}
                        style={{
                            height: 26,
                            width: '100%',
                            paddingBottom: 0,
                            fontSize: 16,
                            color: this.props.firstColor,
                        }}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        secureTextEntry={this.props.secureTextEntry}
                        autoCapitalize={this.props.autoCapitalize}
                    />
                    <View style={styles.RightIconStyle}>{props.children}</View>
                    <Animated.View style={initialBorderBottom} />
                    <Animated.View style={borderBottomAnimation} />
                </Animated.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    RightIconStyle: {
        position: 'absolute',
        right: 10,
        top: 0,
        flexDirection: 'row'
    }
});
