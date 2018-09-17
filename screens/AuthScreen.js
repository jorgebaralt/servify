import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Button, Text, Icon } from 'native-base';
import { LinearGradient } from 'expo';
import { facebookLogin } from '../actions';

class AuthScreen extends Component {
	componentWillUpdate(nextProps) {
		this.onAuthComplete(nextProps);
	}

	onAuthComplete(props) {
		if (props.displayName) {
			this.props.navigation.navigate('main');
		}
	}
 
	loginWithFacebook = async () => {
		await this.props.facebookLogin();
		//
		// await AsyncStorage.removeItem('login_token');
		this.onAuthComplete(this.props);
	}

	render() {
		return (
			<LinearGradient colors={['#FF7043', '#F4511E', '#BF360C']} style={{ flex: 1 }}>
				<View style={styles.authStyle}>
					<Text style={styles.titleStyle}> Servify </Text>

					{/* //Create account with email */}
					<View style={styles.buttonStyle}>
						<Button 
							bordered 
							light  
							title="Servify" 
							onPress={() => { this.props.navigation.navigate('createAccount'); }}
						>
							<Text style={styles.textStyle}>
									Create Account With Email
							</Text>
						</Button>
					</View>
					{/* //log in with facebook */}
					<View style={styles.buttonStyle}>
						<Button
							bordered
							light
							title="Facebook"
							onPress={this.loginWithFacebook}
						>
							<Text style={styles.textStyle}>
								{' '}
								<Icon
									style={{
										color: 'white',
										fontSize: 16,
										marginRight: 10,
									}}
									type="Entypo"
									name="facebook"
								/>
								{' '}
								Log in with Facebook
							</Text>
						</Button>
					</View>
				</View>
				{/* //go to login screen */}
				<TouchableOpacity style={{ position: 'absolute', bottom: 30, right: 30 }}>
					<Text
						style={{ fontSize: 16, color: 'white' }}
						onPress={() => {
							this.props.navigation.navigate('login');
						}}
					>
						Login

					</Text>
				</TouchableOpacity>
				{/* //go to welcome screen (tutorial) */}
				<TouchableOpacity style={{ position: 'absolute', bottom: 30, left: 30 }}>
					<Text 
						style={{ fontSize: 16, color: 'white' }}
						onPress={() => {
							this.props.navigation.navigate('welcome');
						}}
					>
						Tutorial
					</Text>
				</TouchableOpacity>
			</LinearGradient>
		);
	}
}

const styles = {
	titleStyle: {
		fontSize: 40,
		color: 'white',
		marginBottom: 100,
		fontWeight: 'bold',
	},
	authStyle: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonStyle: {
		marginBottom: 30,
	},
	textStyle: {
		fontSize: 16,
	},
};

function mapStateToProps(state) {
	return { displayName: state.auth.displayName };
}

export default connect(
	mapStateToProps,
	{ facebookLogin },
)(AuthScreen);
