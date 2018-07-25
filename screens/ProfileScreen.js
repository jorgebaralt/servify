import React, { Component } from 'react';
import { Container, Header, Body, Right, Button, Icon, Title,Text} from 'native-base';
import {connect} from 'react-redux'
class ProfileScreen extends Component {
    render() {
        const {user} = this.props;
        return (
            <Container >
                <Header >
                    <Body>
                    <Title>{user.displayName}</Title>
                    </Body>
                    <Right>
                        <Button transparent title={'Settings'} >
                            <Icon type={'Entypo'} name='dots-three-horizontal' style={{color:'black'}} onPress={()=>this.props.navigation.navigate('settings')} />
                        </Button>
                    </Right>
                </Header>
            </Container>
        );
    }
}

function mapStateToProps(state){
    return{user:state.currentUser};
}

export default connect(mapStateToProps)(ProfileScreen);