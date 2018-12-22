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
import { logout } from '../../api';
import { pageHit } from '../../shared/ga_helper';

class SettingsScreen extends Component {

	componentDidMount() {
		pageHit('Settings Screen');
	}

	doLogOut = async () => {
		await logout();
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

export default SettingsScreen;
