import React, {Component} from 'react';
import {View, Text,ScrollView,Dimensions,Button} from 'react-native'
//import {Button} from 'react-native-elements';

const SCREEN_WIDTH = Dimensions.get('window').width;

class Slides extends Component{
    renderSlides=()=>{
        return this.props.data.map((slide,i)=>{
            return(
                <View key={slide.text} style={[styles.slideStyle,{backgroundColor: slide.color}]}>
                    <Text style={styles.textStyle}>{slide.text}</Text>
                    {this.renderLastSlide(i)}
                </View>
            );
        })
    };
    renderLastSlide(i){
        if(i === this.props.data.length - 1){
            return (

                <Button
                    title={"onwards!"}
                    raised
                    buttonStyle={styles.buttonStyle}
                    onPress={this.props.onComplete}
                />

            )
        }
    }
    render(){
        return(
            <ScrollView
                horizontal
                style={{flex:1}}
                pagingEnabled
            >
                {this.renderSlides()}
            </ScrollView>
        )
    }
}
const styles={
    slideStyle:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        width:SCREEN_WIDTH
    },
    textStyle:{
        fontSize:30,
        color:'white',
        textAlign:'center'

    },
    buttonStyle:{
        backgroundColor:'#0288D1',
        marginTop: 15,

    }
};
export default Slides;