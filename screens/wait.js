import React,{useState,useEffect} from "react";
import { 
    View,
    StyleSheet,
    Dimensions,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    BackHandler,
    Alert

} from "react-native";
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import Icon2 from 'react-native-vector-icons/dist/EvilIcons';
import { initializeApp } from "firebase/app";
import {firebaseConfig} from "../config"
import Icon3 from 'react-native-vector-icons/dist/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import { CheckBox } from 'react-native-elements';
import { getDatabase, ref, child, get,set, push,update,remove } from "firebase/database";
const width=Dimensions.get('window').width;
 
const height=Dimensions.get('window').height;

export default function Wait({navigation}){
    const [hr,setHr] = useState("00");
    const [min,setMin] = useState("00");
    const [time,setTime] = useState(0);
    const [ett,setEtt] = useState("00");
    const [sec,setSec] = useState(0);
    // const [id,setId] = useState();
    // const [key,setKey] = useState();
    // const [data,setData] = useState({});

    const [isLoading,setIsLoading]=useState(true);
    
    // Not started = 0
    // started = 1
    // stopped = 2
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    const dbRef = ref(getDatabase());
    // const navigation = useNavigation(); 
    // async function getKey(){
    //     try {
    //         // console.log(AsyncStorage.getItem('key'));
    //         const val =  await AsyncStorage.getItem('key');
    //         setKey(val);
    //         console.log(val);
    //         return val;
    //     } catch(e) {
    //       // read error
    //     }
    //   }
    //   async function getId(){
    //     try {
    //         const val =  await AsyncStorage.getItem('id');
    //         setId(val);
    //         console.log(val);
    //         return val;
    //     } catch(e) {
    //       // read error
    //     }
    //   }
    //   async function getData(){
    //     try {
    //         const jsonValue = await AsyncStorage.getItem('data')
    //         jsonValue != null ? setData(JSON.parse(jsonValue)) : setData(null);
            
    //         console.log(data);
    //         return data;
    //     } catch(e) {
    //       // read error
    //     }
    //   }
    function handleBackButton() {
        Alert.alert(
            'Exit App',
            'Exiting the application?', [{
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
            }, {
                text: 'OK',
                onPress: () => BackHandler.exitApp()
            }, ], {
                cancelable: false
            }
         )
         return true;
       } 
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
        BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        navigation.navigate("App");

    }
    function getTime(){
        var x=ett*60-time;
        if(x>0){
            setSec(x%60);
            if(x >= 60){
                setMin((parseInt(x/60)%60));
                if(x >= 3600){
                    setHr(parseInt(x/3600));
                }
                else{
                    setHr(0);
                }
            }
            else{
                setMin(0);
            }
        }
        else{
            setSec("00")
            setHr("00")
            setMin("00")
        }
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
    useEffect( ()=>{
        // setTimeout(()=>{
        //     if(time>0)
        //         setTime(time-1)
                
        // },1000)
        // setSec((time%60).toString().length==1?'0'+(time%60).toString():(time%60).toString());
        // setMin(Math.floor(time/60).toString().length==1?'0'+Math.floor(time/60).toString():Math.floor(time/60).toString());
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);
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
        
        setIsLoading(true);
        
        // getId().then(()=>{
        //     getKey().then(()=>{
                
    
        //     });
        // })
        async function fatchData(){
            const key =  await AsyncStorage.getItem('key');
            console.log(key+"  kkkkkkkkk");
            const id =  await AsyncStorage.getItem('id');

            get(child(dbRef, `shop/`+id+"/costomers/"+key)).then((snapshot) => {
            if (snapshot.exists()) {
                
                setEtt(Object.values(snapshot.val())[0])
                
              
            } else {
              console.log("No data available");
              
            }
          }).catch((error) => {
              
            console.error(error," XXX");
            
          });
        }
        
        // try {
        //     // console.log(AsyncStorage.getItem('key'));
            
        //     setKey(val);
        //     console.log(val);
        //     return val;
        // } catch(e) {
        //   // read error
        // }
        // get(child(dbRef, `shop/`+getId()+"/costomers/"+getKey())).then((snapshot) => {
        //     if (snapshot.exists()) {
                
        //         setEtt(Object.values(snapshot.val())[0])
                
              
        //     } else {
        //       console.log("No data available");
              
        //     }
        //   }).catch((error) => {
              
        //     console.error(error," XXX");
            
        //   });
        // getData();
        fatchData();
        
            
          fatchTime();
          const intervalId = setInterval(() => {
            fatchTime();
            
            // getTime();
            
          }, 1000);
          
          return () => {
              clearInterval(intervalId),
              setEtt();
              setTime();
              BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
            };
        
    },[navigation])
    return(
        <View style={styles.view}>
            <View style={{backgroundColor: '#00b894',elevation:5,paddingBottom:25}}>
            
                <View style={styles.top}>
                    <Text style={styles.topText}>
                        Wait Please !
                    </Text>
                    <TouchableOpacity style={styles.topRight}>
                    <Text style={styles.topText2}>
                        About Us
                    </Text>
                    </TouchableOpacity>


                    
                </View>
                <View style={styles.time}>
                    <Text style={styles.timeText}>
                        {getHr()}:{getMin()}
                    </Text>
                    <Text style={styles.secText}>
                        :{getSec()}
                    </Text>
                </View>
            </View>
            
            <ScrollView style={styles.scrollView}>

                
                <Text style={styles.text}>
                    Hey there, you just check in for xyz in ABC shop. 
                </Text >
                <Text style={styles.text2}>
                    your waiting time is {getHr()} hour {getMin()} minutes
                </Text>
                <TouchableOpacity style={styles.btn} activeOpacity={0.7} onPress={()=>cancel()}>
                    <Text style={styles.btnTxt}>
                        Cancel
                    </Text>
                </TouchableOpacity>
                <View style={{height:30}}/>
            </ScrollView>
            <View style={styles.bottom}>
                <Icon3 name='copyright' color={'#1A374D'} size={15}/>
                <Text style={{fontSize:12,color:'#1A374D'}}>{" "} Copyright 2022 @ </Text>
                <Text style={{fontSize:14,color:'#00b894'}}>
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
    topText2:{
        color:'white',
        fontSize:19,
        marginHorizontal:15,
        textDecorationLine:'underline'
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
      text2:{
        fontSize:20,
        color:'#00b894',
        marginTop:10,
        alignSelf:'center',

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
        borderWidth:2,
        borderColor:'#00b894',
        backgroundColor:'#00b894',
        elevation:5
      },
      btnTxt:{
        
        fontSize:16,
        fontWeight:'600',
        color:'white'
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
      }

})