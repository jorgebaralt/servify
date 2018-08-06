import React, { Component } from 'react';
import { View, SafeAreaView } from 'react-native';
import { Text, Container, Content, Icon } from 'native-base';
import { connect } from 'react-redux';
import { Location, Permissions } from 'expo';
import { getCurrentUserDisplayName } from '../actions';

class HomeScreen extends Component {
	static navigationOptions={
		title: 'Home',
		tabBarIcon: ({ tintColor }) => (<Icon type="MaterialCommunityIcons" name="home-outline" style={{color: tintColor }} />)
	};
	
	// <Icon type="Entypo" name="dots-three-horizontal" style={{ color: 'black' }} />

	async componentWillMount() {
        await this.props.getCurrentUserDisplayName();
        this.getLocationAsync();
    }

    componentWillUpdate(nextProps) {}

    getLocationAsync = async () => {
        const { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status === 'granted') {
          return Location.getCurrentPositionAsync({ enableHighAccuracy: true });
        } 
          throw new Error('Location permission not granted');
        }
      
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
