import React, { Component } from 'react';
import { SafeAreaView, Text } from 'react-native';
import { connect } from 'react-redux';
import { Button, FloatingLabelInput } from '../../components/UI';


class EditUserScreen extends Component{
	render() {
		return (
			<SafeAreaView>
				<Text>
					Testing
				</Text>
			</SafeAreaView>
		);
	}
}

const mapStateToProps = (state) => {
	console.log(state.auth.user);
	return {
		user: state.auth.user
	};
};

export default connect(mapStateToProps)(EditUserScreen);
