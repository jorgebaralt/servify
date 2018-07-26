import React, {Component} from 'react';
import {View} from 'react-native';
import {Text} from 'native-base'
import {connect} from 'react-redux'
import {getCurrentUserDisplayName} from "../actions";

class HomeScreen extends Component {
    async componentWillMount() {
        console.log('getting display name');
        await this.props.getCurrentUserDisplayName();
    }
    componentWillUpdate(nextProps){
    }

    render() {
        return (
            <View>
                <Text>Home Screen</Text>
                <Text>Home Screen</Text>
                <Text>Home Screen</Text>
                <Text>Home Screen</Text>
                <Text>Home Screen</Text>
                <Text>Home Screen</Text>
                <Text>Home Screen</Text>
                <Text>Home Screen</Text>
            </View>
        )
    }
}

export default connect(null,{getCurrentUserDisplayName})(HomeScreen);