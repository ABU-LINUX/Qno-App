import React, { useEffect,useState } from 'react';

import { View,
    StyleSheet,
    Text,
    StatusBar, 
    Image,
    Dimensions, 
    TouchableOpacity, 
    TextInput,
    ActivityIndicator,
    ScrollView,
    BackHandler,
    Alert,ToastAndroid
  
  } from 'react-native';
    import Icon from 'react-native-vector-icons/dist/FontAwesome';
import Icon2 from 'react-native-vector-icons/dist/Fontisto';
import { initializeApp } from "firebase/app";
import {firebaseConfig} from "../config"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase, ref, child, get,set, push,update,remove } from "firebase/database";
const width=Dimensions.get('window').width;

const height=Dimensions.get('window').height;


export default function HomeScreen({navigation}){
  const [exitApp, setExitApp] = useState(0);
  const [log,setLog] = useState(false);
  const [load,setLoad]=useState(false);
  const [time,setTime] = useState(0);
  const [ett,setEtt] = useState("00");

  
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  const dbRef = ref(getDatabase());
  async function cancel(){
        
        
    const db = getDatabase();
    const key =  await AsyncStorage.getItem('key');
    const data=JSON.parse( await AsyncStorage.getItem('data'))
    const id =  await AsyncStorage.getItem('id');
    console.log(data+" "+data.time);
    update(ref(db, 'shop/'+id), {
        
        time : data.time,
        queue : data.queue
    })

    // // );
    // // console.log(key);
    
    update(ref(db, 'shop/'+id+"/ett"), {
    
        min : data.ett.min,
    })
   
    remove(ref(db,'shop/'+id+"/costomers/"+key));
    await AsyncStorage.removeItem('checkedIn')
    await AsyncStorage.removeItem('id')
    await AsyncStorage.removeItem('key')
    await AsyncStorage.removeItem('data')
    setLog(false);
    navigation.navigate("App");

  }

  function getSec(){
    var x=ett*60-time;
    if(x<0){
        return "00";
    }
    if(x%60<10)
        return "0"+x%60
    else 
        return x%60;
}
function getMin(){
    var x=ett*60-time;
    if(x >= 60){
        var t=Math.floor((x/60)%60)
        if(t<10){
            return "0"+t;
        }
        else{
            return t;
        }
    }
    else{
        return "00"
    }
}
function getHr(){
    var x=ett*60-time;
    if(x >= 3600){
        var t = Math.floor(x/3600);
        if(t<10){
            return "0"+t;
        }
        else{
            return t;
        }
    }
    else{
        return "00"
    }
}

   useEffect(()=>{
    var y;
    setLoad(true);
    
    async function find(){
      y = await AsyncStorage.getItem('checkedIn')
      console.log(y+" xxx");
      setLog(y!==null);
      return y;
    }
    
    async function fatchTime(){
      try {
          const response = await fetch('https://www.timeapi.io/api/Time/current/coordinate?latitude=26.144518&longitude=91.736237');
          const json = await response.json();
          
          setTime(json.hour*60*60+json.minute*60+json.seconds);
          
          console.log(json.seconds+" "+time);
          
          
      } catch (error) {
          console.error(error);
      } 
    }
    const unsubscribe = navigation.addListener('focus', () => {
      
      
      
    async function fatchData(){
      const key =  await AsyncStorage.getItem('key');
      console.log(key+"  kkkkkkkkk");
      const id =  await AsyncStorage.getItem('id');
      console.log(id+"  kkkkkkkkk");
      get(child(dbRef, `shop/${id}/costomers/${key}`)).then((snapshot) => {
      
        if (snapshot.exists()) {
          // console.log(snapshot.val());
          setEtt(Object.values(snapshot.val())[0])
          console.log(Object.values(snapshot.val())[0]);
        
      } else {
        console.log("No data available");
        
      }
    }).catch((error) => {
        
      console.error(error," XXX");
      
    });
  }
  
  fatchData();
  
  find()     
    
    
  });
    const intervalId = setInterval(() => {
      fatchTime();
      
      // getTime();
      
    }, 1000);
  
  
  find().then(()=>console.log(log+" cc"))
   let x=0;
  const backAction = ()=> {
    setTimeout(() => {
      x=0
    }, 2000); // 2 seconds to tap second-time
    console.log(x);
    if (x === 0) {
      x=1
      console.log(x);
      ToastAndroid.show("please press back button again for exit", ToastAndroid.SHORT);
    } else if (x === 1) {
      console.log("exit app");
      BackHandler.exitApp();
    }
    return true;
  };
  const backHandler = BackHandler.addEventListener(
    'hardwareBackPress',
    backAction,
  );
  setTimeout(()=>{
    setLoad(false);
  },2000)
  return () => {
    
    backHandler.remove()
    return unsubscribe;
  };
          
  // Return the function to unsubscribe from the event so it gets removed on unmount
  
   },[navigation])
    return(
      <View style={styles.container}>
        <StatusBar backgroundColor={"#00b894"}/>
        <View style={styles.top}>
        <View style={styles.logoView}>
            <Image source={require('/home/abu/qno/logo.png')} style={styles.logo}/>
          </View>
          

        </View>
          
          {/* <View style={styles.locView}>
            <TouchableOpacity activeOpacity={0.8} onPress={()=>navigation.navigate('map')}>
              <Image source={require('/home/abu/qno/location.png')} style={styles.image}/>
            
            </TouchableOpacity>
            <View style={{width:width*3/4}}>
              <Text style={styles.text}>
                Search here for your favourite saloon
              </Text>
            </View>
            <View style={styles.input}>
              <TextInput style={styles.inputText} placeholder='Search here'/>
              <TouchableOpacity activeOpacity={0.7} style={styles.searchView}>
                <Icon2 name="search" size={25} color='#1A374D'/>
                <Text style={styles.searchText}>
                  Search
                </Text>
            
                
              </TouchableOpacity>
            </View>
            
          </View> */}
          {log?
            load?<ActivityIndicator size="large" style={{flex:1}} color={'black'} />:
              
              <View style={{}}>
                  <View style={styles.time}>
                    <Text style={styles.timeText}>
                        {getHr()}:{getMin()}
                    </Text>
                    <Text style={styles.secText}>
                        :{getSec()}
                    </Text>
                </View>
                <View>
                  <TouchableOpacity style={styles.btn} activeOpacity={0.7} onPress={()=>cancel()}>
                    <Text style={styles.btnTxt}>
                        Cancel
                    </Text>
                  </TouchableOpacity>

                  </View>
                  
                </View>
              :
              <View>
                <Text style={styles.text}>
                  Walcome !
                </Text>
                <Text style={styles.text2}>
                  Why you wait, {'\n'}If you know your {'\n'}appointmant time
                </Text>
              </View>
          }
          
           <View style={{alignItems:'center',justifyContent:'flex-end',flex:1,}}>
            {/* <Icon2 name="arrow-down-l" size={70} color={"white"} style={{opacity:1,margin:20}}/> */}
            <Text style={{color:'white'}}>
              find a saloon near to you , and chack wait 
            </Text>
            <Text style={{color:'white'}}>
            time for your haircut
            </Text>
            
            <Image source={require('/home/abu/qno/down.png')} style={{width:100,height:200}}/>
           </View>
      </View>
    )
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#00b894',
    },
    text: {
      fontSize:30,
      marginStart:25,
      fontWeight:'500',
      color:'white',
      opacity:0.9
    },
    text2: {
      fontSize:25,
      marginStart:25,
      marginTop:10,
      fontWeight:'400',
      color:'white',
      opacity:0.8
    },
    top:{
        height:height*0.15,
        flexDirection:'row',
    },
    sign:{
        flex:1,
        justifyContent:'flex-end',
        alignItems:'center',
        alignContent:'flex-end',
        margin:30,
        flexDirection:'row',
    },
    logo :{
      backgroundColor:'#00b894',
      margin:30,
      width:65,
      height:35,
      
    },
    logoView:{
      
      justifyContent:'center'
    },
    image: {
      height:width*1.1,
      width:width*3/4,
      alignContent:'center',
      marginBottom:40
    },
    locView:{
      flex:1,
      alignContent:'center',
      alignItems:'center',
      height:height*0.85,
      
    },
    input:{
      height:40,
      width:width*3/4,
      borderColor:'#1A374D',
      borderRadius:10,
      borderWidth:1,
      flexDirection:'row'
      
    },
    inputText:{
      flex:0.70,
      borderRightWidth:1,
      paddingLeft:10
      
    },
    searchText:{
      fontSize:16,
      color:'#1A374D'
    },
    searchView:{
      flex:0.30,
      borderTopRightRadius:10,
      borderBottomRightRadius:10,
      borderColor:'#1A374D',
      
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center'
    },
    time:{
      justifyContent:'center',
      alignItems:'center',
      alignSelf:'center',
      marginTop:10,
      borderRadius:20,
      elevation:10,
      backgroundColor:'white',
      flexDirection:'row'
  },
  timeText:{
      fontSize:80,
      color:'#00b894',
      paddingStart:25,
      paddingVertical:10,
  },
  secText:{
    fontSize:20,
    color:'#00b894',
    paddingEnd:15,
    flexDirection:'column',
    paddingVertical:25,
    alignSelf:'flex-end',
  },
  btn:{
        
    justifyContent:'flex-end',
    alignContent:'flex-end',
    flexDirection:'row',
    marginTop:25,
    marginEnd:20,
    alignSelf:'flex-end',
    paddingHorizontal:20,
    paddingVertical:10,
    borderRadius:10,
    backgroundColor:'white',
    elevation:5,
    marginRight:60
  },
  btnTxt:{
    
    fontSize:16,
    fontWeight:'600',
    color:'#00b894'
  },
  })
  
  
  