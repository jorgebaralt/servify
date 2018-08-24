 import React, { Component } from 'react';
import { View, ListView, TouchableOpacity } from 'react-native';
import { Header, Text, Card, CardItem, Body, Title, Container, Left, Button, Icon, Right, Spinner } from 'native-base';
import { connect } from 'react-redux';
import { getServicesSubcategory } from '../actions';

class SpecificCategoryScreen extends Component {
    state = { dataLoaded: false }

  componentWillMount = async () => {
      const categoryReference = this.props.category.dbReference;
      const subcategoryReference = this.props.subcategory.dbReference;
      await this.props.getServicesSubcategory(categoryReference, subcategoryReference);
      const { servicesList } = this.props;
      const ds = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2
      });
      this.dataSource = ds.cloneWithRows(servicesList);
      if(this.dataSource){
          this.setState({ dataLoaded: true });
      }
  }

  onBackPressed = () => {
    this.props.navigation.goBack();
    // TODO: DESELECT SERVICE-LIST
  }

  renderServices = (service) => {
    const { grayStyle, cardStyle, titleStyle, phoneLocationStyle } = styles;
    const displayDescription = service.description.substring(0, 30) + '...';
    return(
        <TouchableOpacity
            key={service.id}
            onPress={() => this.props.navigation.navigate('service')}
        >
            <Card style={cardStyle}>
                    <CardItem header>
                        <Text style={titleStyle}>{service.title}</Text>
                        <Right>
                            <Icon name="arrow-forward" />
                        </Right>
                    </CardItem>
                    <CardItem>
                        <Body style={phoneLocationStyle}>
                            <Text style={grayStyle}>{service.phone}</Text>
                            <Text style={[grayStyle, { marginLeft: '15%' }]}>{service.location.city}</Text>
                        </Body>
                    </CardItem>
                    <CardItem>
                        <Body>
                            <Text style={grayStyle}>{displayDescription}</Text>
                        </Body>
                    </CardItem>
            </Card>
        </TouchableOpacity>
    );
}

  renderListView(){
    if(this.state.dataLoaded){
        return(
            <ListView
                dataSource={this.dataSource}
                renderRow={(service) => this.renderServices(service)}
                enableEmptySections
            />
        );
    }
    return (<Spinner color="orange" />);
}

  render() {
    return (
      <Container>
        <Header style={{ backgroundColor: this.props.category.color[0] }}>
          <Left>
            <Button transparent onPress={() => this.onBackPressed()}>
              <Icon name="arrow-back" style={{ color: 'white' }} />
            </Button>
          </Left>
          <Body>
            <Title style={{ color: 'white' }}>{this.props.subcategory.title}</Title>
          </Body>
        </Header>
        {this.renderListView()}
      </Container>
    );
  }
}

const styles = {
    headerStyle: {
        
    },
    cardStyle: {
        width: '80%',
        marginLeft: '10%',
        marginTop: '2.5%',
    },
    contentStyle: {

    },
    grayStyle: {
        color: 'gray'
    },
    titleStyle: {
        fontSize: 18
    },
    phoneLocationStyle: {
        flexDirection: 'row',
        flex: 1,
    }

};

const mapStateToProps = (state) => ({ 
    subcategory: state.selectedCategory.subcategory,
    category: state.selectedCategory.category,
    servicesList: state.getServiceResult.servicesList
});

export default connect(mapStateToProps, { getServicesSubcategory })(SpecificCategoryScreen);
