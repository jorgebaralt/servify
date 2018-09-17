import React, { Component } from 'react';
import {
	View,
	ListView,
	TouchableOpacity,
	Dimensions,
	SafeAreaView,
	KeyboardAvoidingView,
	Platform
} from 'react-native';
import {
	Content,
	Header,
	Text,
	Card,
	CardItem,
	Body,
	Title,
	Container,
	Left,
	Button,
	Icon,
	Right,
	Spinner,
	Form,
	Item,
	Picker,
	Textarea
} from 'native-base';
import { connect } from 'react-redux';

class Feedback extends Component {
	state = {
		selectedOption: undefined,
		description: ''
	};

	onBackPress = () => {
		this.props.navigation.goBack(null);
	};

	renderDescription() {
		const { textAreaStyle, buttonStyle } = styles;
		if (this.state.selectedOption) {
			return (
				<View>
					<Textarea
						style={textAreaStyle}
						rowSpan={5}
						bordered
						placeholder="Describe here..."
						value={this.state.description}
						onChangeText={(text) => this.setState({ description: text })}
					/>
					<Button
						bordered
						dark
						style={buttonStyle}
						onPress={() => this.doPostService()}
					>
						<Text style={{ color: '#FF7043' }}>Submit</Text>
					</Button>
				</View>
			);
		}
	}

	render() {
		const { formStyle, DescriptionStyle, titleStyle } = styles;
		return (
			<Container style={{ flex: 1 }}>
				<Header>
					<Left>
						<Button
							transparent
							onPress={() => {
								this.onBackPress();
							}}
						>
							<Icon name="arrow-back" style={{ color: 'black' }} />
						</Button>
					</Left>
					<Body>
						<Title>Feedback</Title>
					</Body>
					<Right />
				</Header>
				<Content>
					<Text style={titleStyle}>How can we improve?</Text>
					<Text style={DescriptionStyle}>
						We are always looking for ways to improve, so we listen very close
						to every feedback. Please tell of what you love or what need some
						word so we can get to work.
					</Text>
					<View style={{ flex: 1, alignItems: 'center' }}>
						<Form style={formStyle}>
							<Item picker style={{ margin: 20, width: '100%' }}>
								<Picker
									mode="dropdown"
									style={{ width: undefined }}
									placeholder="Pick an Option"
									placeholderStyle={{ color: '#bfc6ea', left: -15 }}
									iosIcon={(
										<Icon
											name={
												this.state.selectedOption
													? undefined
													: 'ios-arrow-down-outline'
											}
										/>
									)}
									selectedValue={this.state.selectedOption}
									onValueChange={(value) => this.setState({ selectedOption: value })
									}
									textStyle={{ left: -15 }}
								>
									<Picker.Item label="Give some feedback" value="feedback" />
									<Picker.Item label="Report a bug" value="bug" />
								</Picker>
							</Item>
							{this.renderDescription()}
						</Form>
					</View>
				</Content>
			</Container>
		);
	}
}

const styles = {
	formStyle: {
		width: '80%'
	},
	textAreaStyle: {
		marginTop: 10,
		fontSize: 16
	},
	DescriptionStyle: {
		marginTop: 20,
		marginLeft: '10%',
		marginRight: '10%',
		fontSize: 16
	},
	titleStyle: {
		marginLeft: '10%',
		marginRight: '10%',
		marginTop: 20,
		fontSize: 20,
		fontWeight: 'bold'
	},
	buttonStyle: {
		top: 20,
		borderColor: '#FF7043',
	}
};

export default connect(null)(Feedback);
