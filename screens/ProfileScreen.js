import React, { Component } from 'react';
import { Container, Header, Body, Right, Button, Icon, Title,Text} from 'native-base';
import {connect} from 'react-redux'
import {getCurrentUserDisplayName} from "../actions";

class ProfileScreen extends Component {
    componentWillMount(){
        if(!this.props.displayName){
            this.props.getCurrentUserDisplayName();
        }
    }

    render() {
        return (
            <Container >
                <Header >
                    <Body>
                    <Title>{this.props.displayName}</Title>
                    </Body>
                    <Right>
                        <Button transparent title={'Settings'} onPress={()=>this.props.navigation.navigate('settings')}>
                            <Icon type={'Entypo'} name='dots-three-horizontal' style={{color:'black'}}  />
                        </Button>
                    </Right>
                </Header>
            </Container>
        );
    }
}

function mapStateToProps(state){
    return{displayName : state.auth.displayName}
}

export default connect(mapStateToProps,{getCurrentUserDisplayName})(ProfileScreen);