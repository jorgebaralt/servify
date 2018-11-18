import React, { Component } from 'react';
import {
	Container,
	Header,
	Body,
	Right,
	Button,
	Icon,
	Title,
	Text,
	Left,
	Content
} from 'native-base';
import { connect } from 'react-redux';
import { logOut } from '../actions';

class SettingsScreen extends Component {
	doLogOut = async () => {
    await this.props.logOut();
    await this.props.navigation.navigate('home');
    await this.props.navigation.navigate('auth');
	};

	render() {
		return (
			<Container>
				<Content>
					<Header>
						<Left>
							<Button
								transparent
								onPress={() => {
									this.props.navigation.goBack();
								}}
							>
								<Icon
									name="ios-arrow-back"
									type="Ionicons"
									style={{ color: 'black' }}
								/>
							</Button>
						</Left>
						<Body>
							<Title>Settings</Title>
						</Body>
						<Right />
					</Header>
					<Button block danger title="log out" onPress={this.doLogOut}>
						<Text>Log out</Text>
					</Button>
				</Content>
			</Container>
		);
	}
}

export default connect(
	null,
	{ logOut }
)(SettingsScreen);
