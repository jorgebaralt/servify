import React, { Component } from 'react';
import { Container, Header, Left, Body, Right, Button, Icon, Title,Text} from 'native-base';

class ProfileScreen extends Component {
    render() {
        return (
            <Container>
                <Header>
                    <Body>
                    <Title>Jorge Baralt</Title>
                    </Body>
                    <Right>
                        <Button transparent>
                            <Icon type={'Entypo'} name='dots-three-horizontal' style={{color:'black'}} />
                        </Button>
                    </Right>
                </Header>
            </Container>
        );
    }
}

export default ProfileScreen;