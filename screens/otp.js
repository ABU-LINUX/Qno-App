import React,{useState} from "react";
import { 
    View,
    StyleSheet,
    Dimensions,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,

} from "react-native";
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import Icon2 from 'react-native-vector-icons/dist/EvilIcons';

import Icon3 from 'react-native-vector-icons/dist/FontAwesome';

import { CheckBox } from 'react-native-elements';
const width=Dimensions.get('window').width;
 
const height=Dimensions.get('window').height;

export default function Otp({navigation}){

    function verifyOTP(){
        
        navigation.navigate("wait");
    };
    return(
        <View style={styles.view}>
            <View style={styles.top}>
                <Icon name="arrow-back-ios" size={25} color="#1A374D" onPress={()=>navigation.goBack()}/>
                <Text style={styles.topText}>
                    OTP
                </Text>
                <TouchableOpacity style={styles.topRight}>
                <Text style={styles.topText2}>
                    About Us
                </Text>
                </TouchableOpacity>
                
            </View>
            <ScrollView style={styles.scrollView}>
                <Text style={styles.text}>
                    Please Confirm OTP
                </Text>

                <TextInput style={styles.inputText} placeholder="Add Your OTP here" keyboardType="numeric" placeholderTextColor={'#D3D3D3'}/>
                <TouchableOpacity style={styles.verify} activeOpacity={0.75} onPress={()=>verifyOTP()}>
                    <Text style={styles.VerifyText}>
                        Verify
                    </Text>
                </TouchableOpacity>
            </ScrollView>
            <View style={styles.bottom}>
                <Icon3 name='copyright' color={'#1A374D'} size={15}/>
                <Text style={{fontSize:12,color:'#1A374D'}}>{" "} Copyright 2022 @ </Text>
                <Text style={{fontSize:14,color:'#0E49B5'}}>
                    Qno
                </Text>
                <Text style={{fontSize:12,color:'#1A374D'}}> pvt ltd{" "}| All rights reserved</Text>
            </View>
            
        </View>
    )
}
const styles =StyleSheet.create({
    view:{
        flex:1,
        backgroundColor:'#B1D0E0',
        
    },
    top:{
        flexDirection:'row',
        alignItems:'center',
        paddingLeft:20,
        backgroundColor: '#B1D0E0',
        elevation:5,
        height:height*0.08
    },
    topText:{
        color:'#1A374D',
        fontSize:21,
        marginHorizontal:10
    },
    topText2:{
        color:'blue',
        fontSize:19,
        marginHorizontal:15,
    },
    topRight:{
        flex:1,
        alignItems:'flex-end',
        marginEnd:10
    },
    text:{
        fontSize:20,
        color:'#1A374D',
        marginTop:10,
        alignSelf:'center',

    },
    scrollView:{
        paddingTop:30,
        paddingHorizontal:40,
    },

      bottom:{
          borderTopWidth:0.2,
          borderColor:'#1A374D',
          justifyContent:'center',
          alignItems:'center',
          flexDirection:'row'
      },
      inputText:{
        flex:0.70,
        paddingLeft:10,
        backgroundColor:'white',
        borderRadius:10,
        paddingVertical:7,
        color:'#1A374D',
        marginHorizontal:16,
        marginVertical:20
      },
      verify:{
        backgroundColor:'green',
        marginVertical:25,
        alignContent:'center',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10
    },
    VerifyText:{
        fontSize:22,
        marginVertical:7
    },

})