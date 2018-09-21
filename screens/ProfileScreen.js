import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { Container, Header, Body, Right, Button, Icon, Title, Text, Content, List, ListItem, Left } from 'native-base';
import { connect } from 'react-redux';
import { getCurrentUserDisplayName } from '../actions';

class ProfileScreen extends Component {
    static navigationOptions={
        title: 'Profile',
        tabBarIcon: ({ tintColor }) => (<Icon type="Feather" name="user" style={{ color: tintColor }} />)
    };

    componentWillMount(){
        if(!this.props.displayName){
            this.props.getCurrentUserDisplayName();
        }
    }

    goSelectedScreen = (item) => {
        if(item.isList){
            this.props.navigation.navigate('profileService', { item });
        } else if (item.id === 'feedback'){
            this.props.navigation.navigate('feedback');
        }
    }

    renderListItems = (item) => (
            <ListItem onPress={() => this.goSelectedScreen(item)}>
                <Left>
                    <Text>{item.title}</Text>
                </Left>
                <Right>
                    <Icon type={item.iconType} name={item.iconName} style={{ color: 'black', fontSize: 28 }} />
                </Right>
            </ListItem>
    )

    render() {
        return (
            <Container>
                <Header>
                    <Left style={{ flex: 4 }}>
                        <Title>{this.props.displayName}</Title>
                    </Left>
                    <Right>
                        <Button transparent title="Settings" onPress={() => this.props.navigation.navigate('settings')}>
                            <Icon type="Entypo" name="dots-three-horizontal" style={{ color: 'black' }} />
                        </Button>
                    </Right>
                </Header>
                <Content>
                    <FlatList
                        data={this.props.profileList}
                        renderItem={({ item }) => this.renderListItems(item)}
                        keyExtractor={(item) => item.title}
                    />
                </Content>
            </Container>
        );
    }
}

function mapStateToProps(state){
    return{ 
        displayName: state.auth.displayName,
        profileList: state.profileList
    };
}

export default connect(mapStateToProps, { getCurrentUserDisplayName })(ProfileScreen);
