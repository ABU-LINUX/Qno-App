import React,{useState,useEffect} from 'react';

import { View,
    StyleSheet,
    Text,
    StatusBar, 
    Image,
    Dimensions, 
    TouchableOpacity, 
    TextInput,
    BackHandler,
    ScrollView,
    ToastAndroid,} from 'react-native';
    import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import Icon2 from 'react-native-vector-icons/dist/Fontisto';
import Icon4 from 'react-native-vector-icons/dist/Feather';
import { getDatabase, ref, child, get,set, push,update,remove } from "firebase/database";
import AsyncStorage from '@react-native-async-storage/async-storage';
const width=Dimensions.get('window').width;

const height=Dimensions.get('window').height;

export default function PInfo({navigation}){
  const [name,setName]=useState("");
    const [phone,setPhone]=useState("");
    const [address,setAddress]=useState("");
    async function getName(){
      const jsonValue = await AsyncStorage.getItem('name')
      setName(jsonValue);
      return JSON.stringify(jsonValue).toString();
      
  }
  async function getPhone(){
      const jsonValue = await AsyncStorage.getItem('phone')
      setPhone(jsonValue);
      return JSON.stringify(jsonValue).toString();
  }
  async function getAddress(){
      const jsonValue = await AsyncStorage.getItem('address')
      console.log(JSON.stringify(jsonValue).toString());
      setAddress(jsonValue);
      return JSON.stringify(jsonValue).toString();
  }
  async function setNewName(newName){
      setName(newName)
      AsyncStorage.setItem("name",newName);
      
  }
  async function setNewAddress(newAddress){
      setAddress(newAddress)
      AsyncStorage.setItem("address",newAddress);
  }
  function handleBackButton() {
    navigation.goBack();
     return true;
   } 

   function saveChanges(){

      console.log("new name is " + name)
      console.log("new address is " + address)
      const db = getDatabase();
      set(ref(db, 'users/' + phone), {
        name: name,
        phone: phone,
        address : address
    });
    setNewAddress(address);
    setNewName(name);
    ToastAndroid.showWithGravity(
      "Changes saved Successfully",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );

   }
  useEffect(()=>{
    getAddress();
    getPhone();
    getName();


    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    
      return () => {
          BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        }
      
      
},[navigation])
    return(
      <View style={styles.view}>
        <View style={{backgroundColor: '#00b894',elevation:5,}}>
          <View style={styles.top}>
                      <Icon name="arrow-back-ios" size={25} color="white" onPress={()=>navigation.goBack()}/>
                      <Text style={styles.topText}>
                          Personal information
                      </Text>
                      
                      
            </View>
        </View>
        <ScrollView>
                

                    
                    <View style={{backgroundColor:'white',marginHorizontal:25,borderRadius:10,elevation:5,marginTop:20}}>
                        <View style={{flexDirection:'row',alignItems:'center',paddingHorizontal:15,borderTopLeftRadius:10,borderTopRightRadius:10,borderBottomWidth:0.2,borderColor:"#acacac",paddingVertical:15,backgroundColor:"#00b894"}}>
                                <Text style={styles.details} >
                                    Phone no.-  {phone}
                                </Text>
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center',marginHorizontal:15,borderBottomWidth:0.2,borderColor:"#acacac",paddingVertical:15,}}>
                                
                                <TextInput style={styles.details} value={name} onChangeText={(txt)=>setName(txt)} maxLength={15}/>
                                    
                        </View>
                    
                        
                        <View style={{flexDirection:'row',alignItems:'center',marginHorizontal:15,borderBottomWidth:0.2,borderColor:"#acacac",paddingVertical:15,}}>
                          <TextInput style={styles.details} value={address} onChangeText={(txt)=>setAddress(txt)}/>
                            
                        </View>
                        
                        
                        
                        </View>
                        <View style={{alignItems:'flex-end',marginTop:20,marginBottom:25,marginEnd:25}}>
                            <TouchableOpacity style={{backgroundColor:'#00b894',padding:10,flexDirection:'row',borderRadius:15,elevation:5}}  activeOpacity={0.8} onPress={()=>saveChanges()}>
                              <Text style={{color:'white',fontSize:15,marginHorizontal:20}}>
                                  Save Changes
                              </Text>
                            </TouchableOpacity>
                            
                        </View> 
                        <View style={{height:10}}/>
                        </ScrollView>
                        

      </View>
    )
  }
  const styles = StyleSheet.create({
    view:{
      flex:1,
      backgroundColor:'white',
    },
    top:{
      flexDirection:'row',
        alignItems:'center',
        paddingLeft:20,
        
        height:height*0.08
    },
    topText:{
      color:'white',
      fontSize:21,
      marginHorizontal:10
  },
  text:{
    color:'black',
    fontSize:14
  },
  details:{
    fontSize:14,
    color:'black',
    padding:0,
    flex:1,
    justifyContent:"center",
    alignContent:'center'
},
  })
  
  
  