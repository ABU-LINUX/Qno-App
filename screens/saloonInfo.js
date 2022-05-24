import React,{useEffect,useState} from 'react';

import { View,
    StyleSheet,
    Text,
    StatusBar, 
    Image,
    Dimensions, 
    TouchableOpacity, 
    TextInput,
    BackHandler,
    ActivityIndicator,
    ScrollView,
    FlatList,} from 'react-native';
    import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import Icon2 from 'react-native-vector-icons/dist/Fontisto';
import Icon4 from 'react-native-vector-icons/dist/Feather';
import { initializeApp } from "firebase/app";
import {firebaseConfig} from "../config"
import { getDatabase, ref, child, get,set, push,update,remove } from "firebase/database";
import { SliderBox } from "react-native-image-slider-box";
const width=Dimensions.get('window').width;

const height=Dimensions.get('window').height;

export default function SaloonInfo({route,navigation}){
    const {id}=route.params;
    const [data,setData]=useState(null);
    const [min,setMin] =useState(0);
    const [price,setPrice] =useState(null);
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    const dbRef = ref(getDatabase());
    function time(){
        
        var x = parseInt(parseInt(data[0].ett.min)-min);
        console.log(min+" sdsadsdsa");
        if(x>59){
            return parseInt(x/60)+" hr "+x%60+" min"
        }
        if(x<0){
            return "00 min."
        }
        
        return x%60+" min";
    }
  function handleBackButton() {
    navigation.goBack();
     return true;
   } 
  useEffect(()=>{
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    
    async function fatchTime(){
        try {
            const response = await fetch('https://www.timeapi.io/api/Time/current/coordinate?latitude=26.144518&longitude=91.736237');
            const json = await response.json();
            
            setMin(json.minute+json.hour*60);
            console.log(json.minute+json.hour*60+" "+min);
            
        } catch (error) {
            console.error(error);
        } 
    }
    console.log("going"); 
    
    get(child(dbRef, `shop`)).then((snapshot) => {
        if (snapshot.exists()) {
            
            setData(Object.values(snapshot.val()).filter( element => element.id ==id))
            setPrice(Object.entries(Object.values(snapshot.val()).filter( element => element.id ==id)[0].pricing));
          
          
        } else {
          console.log("No data available");
          
        }
      }).catch((error) => {
          
        console.error(error," XXX");
        
      });
      console.log(data+"data");
      fatchTime();
      const intervalId = setInterval(async() => {
        get(child(dbRef, `shop`)).then((snapshot) => {
            if (snapshot.exists()) {
                
                setData(Object.values(snapshot.val()).filter( element => element.id ==id))
                setPrice(Object.entries(Object.values(snapshot.val()).filter( element => element.id ==id)[0].pricing));
              
            } else {
              console.log("No data available");
              
            }
          }).catch((error) => {
              
            console.error(error," XXX");
            
          });
        fatchTime();
        console.log("sssssss "+min)
        console.log("price               "+price);
      }, 1000);
      return () => {
          clearInterval(intervalId);
          BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        }
      
      
},[navigation])
    return(
      <View style={styles.view}>
        <View style={{backgroundColor: '#00b894',elevation:5,}}>
          <View style={styles.top}>
                      <Icon name="arrow-back-ios" size={25} color="white" onPress={()=>navigation.goBack()}/>
                      <Text style={styles.topText}>
                          Saloon Information
                      </Text>
                      
                      
            </View>
        </View>
        {data===null?
        <View style={{width: '100%',height: height*0.08,
            alignItems: 'center',justifyContent: 'center',
            position: 'absolute'}}>
            <ActivityIndicator size="large" color={'black'} />
        </View>:
        <ScrollView>
            <SliderBox
            images={Object.values(data[0].image)}
            dotColor="#FFEE58"
            inactiveDotColor="#90A4AE"
            />
            <ScrollView>
                

                    
                <View style={{backgroundColor:'white',marginHorizontal:25,borderRadius:10,elevation:5,marginTop:20}}>
                    <View style={{flexDirection:'row',alignItems:'center',marginHorizontal:20,borderBottomWidth:0.2,borderColor:"#acacac",paddingVertical:15,}}>
                            <Text style={styles.details} >
                                {data[0].name}
                            </Text>
                    </View>
                
                    <View style={{flexDirection:'row',alignItems:'center',marginHorizontal:20,borderBottomWidth:0.2,borderColor:"#acacac",paddingVertical:15,}}>
                            <Text style={styles.details} >
                            Contact - {data[0].phone}
                            </Text>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center',marginHorizontal:20,borderBottomWidth:0.2,borderColor:"#acacac",paddingVertical:15,}}>
                        <Text style={styles.details} >
                            Address - {data[0].address}
                            </Text>
                        
                    </View>
                    
                    {/* <View style={{flexDirection:'row',alignItems:'center',marginHorizontal:20,borderBottomWidth:0.2,borderColor:"#acacac",paddingVertical:15,}}>
                            <Text style={styles.details} >
                            {data[0].barbers} brarbers are present in the shop
                            </Text>
                    </View> */}
                
                    <View style={{flexDirection:'row',alignItems:'center',marginHorizontal:20,borderBottomWidth:0.2,borderColor:"#acacac",paddingVertical:15,}}>
                            <Text style={styles.details} >
                                Status - {data[0].status}
                            </Text>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center',marginHorizontal:20,borderBottomWidth:0.2,borderColor:"#acacac",paddingVertical:15,}}>
                        <Text style={styles.details} >
                        Waiting Time is {time()}
                            </Text>
                        
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center',marginHorizontal:20,borderBottomWidth:0.2,borderColor:"#acacac",paddingVertical:15,}}>
                            <Text style={styles.details} >
                            {data[0].queue} People are in waitng Queue
                            </Text>
                    </View>
                    
                    
                    {/* <Dropdown
                            data={price}
                            maxHeight={300}
                            labelField="name"
                            valueField="price"
                            value={}
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                            onChange={item => {
                                setValue(item.value);
                                setIsFocus(false);
                            }}
                            renderLeftIcon={() => (
                                <AntDesign
                                style={styles.icon}
                                color={isFocus ? 'blue' : 'black'}
                                name="Safety"
                                size={20}
                                />
                            )}
                            /> */}

                    
                    </View>
                    
                  
                    <View style={{height:10}}/>
                    </ScrollView>
                    <View style={{backgroundColor:'white',marginHorizontal:25,borderRadius:10,elevation:5,marginTop:10}}>
                        <View style={{flexDirection:'row',alignItems:'center',marginHorizontal:20,borderBottomWidth:0.2,borderColor:"#acacac",paddingVertical:15,}}>
                                <Text style={styles.details} >
                                    Pricing information
                                </Text>
                                
                            
                            </View>
                            <FlatList
                                key={(item) => '' + item}
                                data={price}
                                renderItem={({item})=><View style={{flex:1,marginHorizontal:40,paddingVertical:7,borderBottomWidth:0.2,borderColor:"#acacac",}}>
                                    <Text style={{color:"black"}}>
                                        {item[0]} - {item[1]}
                                    </Text>
                                    </View>
                            }
                                keyExtractor={(item) => '' + item}
                                style={{marginTop:5}}
                            />
                        </View>
                        <View style={{height:10}}/>
                    </ScrollView>
            
        
}
                        

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
    color:'black'
},
  })
  
  
  