import React, { Component } from 'react';
import { View, SafeAreaView } from 'react-native';
import { Text, Container, Content } from 'native-base';
import { connect } from 'react-redux';
import { getCurrentUserDisplayName } from '../actions';

class HomeScreen extends Component {
	async componentWillMount() {
		await this.props.getCurrentUserDisplayName();
	}

	componentWillUpdate(nextProps) {}

	render() {
		return (
			<SafeAreaView style={{ flex: 1 }}>
				<Content>
					<Text>Home Screen</Text>
					<Text>Home Screen</Text>
					<Text>Home Screen</Text>
					<Text>Home Screen</Text>
					<Text>Home Screen</Text>
					<Text>Home Screen</Text>
					<Text>Home Screen</Text>
					<Text>Home Screen</Text>
				</Content>
			</SafeAreaView>
		);
	}
}

export default connect(
	null,
	{ getCurrentUserDisplayName }
)(HomeScreen);
