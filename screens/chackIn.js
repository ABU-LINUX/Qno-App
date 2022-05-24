import React,{useState,useEffect} from "react";
import { 
    View,
    StyleSheet,
    Dimensions,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    ActivityIndicator,
    BackHandler,
    ToastAndroid,

} from "react-native"; 
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import Icon2 from 'react-native-vector-icons/dist/EvilIcons';

import Icon3 from 'react-native-vector-icons/dist/FontAwesome';

import { CheckBox } from 'react-native-elements';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import {firebaseConfig} from "../config"
import { getDatabase, ref, child, get,set, push,update,remove } from "firebase/database";
import { SliderBox } from "react-native-image-slider-box";
import { FlatList } from "react-native-gesture-handler";
const width=Dimensions.get('window').width;
 
const height=Dimensions.get('window').height;

  
export default function CheckIn({route,navigation}){
    const [log,setLog] = useState(false);
    const [check1, setCheck1] = useState({});
    const [check2, setCheck2] = useState({});
    const [name,setName] = useState("");
    const [q,setQ] = useState(0);
    const [x,setX] = useState(0);
    const [num, setNum] = useState(1);
    const {id}=route.params;
    const [min,setMin] =useState(0);
    const [m,setM]=useState(true);
    const [data,setData]=useState(null);
    const [isLoading,setIsLoading]=useState(true);
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    const dbRef = ref(getDatabase());
    const [estTime,setEstTime] = useState(0);
    const [checkedIn,setCheckedIn] = useState(false);
    async function checkIn() {


        console.log(estTime+"          cccccccccccccbb");
        if(!log){
            ToastAndroid.showWithGravity(
                "Sorry you are not allowed to check in without logIn",
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
              );
        }

        else{
            if(estTime===0){
                ToastAndroid.showWithGravity(
                    "Please select any service",
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER
                  );
            }
            else{
                let l=0;
                if(data[0].costomers!==undefined)
                l=Object.values(data[0].costomers).length;
                const db = getDatabase();
                const key = push(ref(db, 'shop/'+data[0].id+"/" + 'costomers'), {
                    name: name,
                    quantity: 1,
                    time : estTime,
                    ett:data[0].ett.min
                }).key;
                update(ref(db, 'shop/'+data[0].id), {
                    
                    time : data[0].time + estTime,
                    queue : data[0].queue + 1
                }

                );
                console.log(key);
                if(min>=data[0].ett.min){
                    update(ref(db, 'shop/'+data[0].id+"/ett"), {
                    
                        min : min+estTime
                    })
                }
                else{
                    update(ref(db, 'shop/'+data[0].id+"/ett"), {
                    
                        min : data[0].ett.min+estTime,
                    })
                }

                try {
                    await AsyncStorage.setItem('checkedIn', "1")
                    await AsyncStorage.setItem("key", key)
                    await AsyncStorage.setItem("id", data[0].id)
                    
                    const jsonValue = JSON.stringify(data[0])
                    await AsyncStorage.setItem('data', jsonValue)
                } catch (e) {
                    // saving error
                    console.log(e);
                }
                
                //   console.log(key+" "+data[0].id);
                setCheckedIn(true);
                navigation.navigate("Home");

                }
            }
            
        
        
        
    }
    function getQ(){
        console.log(data+"data");
        if(data!==null){
            var costomers=data[0].costomers;
            var qu=0;
            for(var val in costomers) {
                var obj = costomers[val];
                qu+=obj.quantity;
                
            }
            
        }
        return qu
        
    }
    function time(){
        
        var x = parseInt(parseInt(data[0].ett.min)-min);
        console.log(min+" sdsadsdsa");
        if(x>59){
            return parseInt(x/60)+" hr "+ x%60 +" min"
        }
        if(x<0){
            return "00 min."
        }
        
        return x%60+" min";
    }
    function handleBackButton() {
        navigation.navigate("App");
         return true;
       } 
    useEffect(()=>{

        var y;
    async function find(){
      y = await AsyncStorage.getItem('checkedIn')
      console.log(y+" xxx");
      setCheckedIn(y!==null);
      return y;
    }
    find().then(()=>console.log(log+" cc"))

        BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        async function check()  {
            try {
                
                const jsonValue = await AsyncStorage.getItem('isLoggedIn')
                const xxx= jsonValue !== null ? true: false;
                
                console.log(xxx + "   xxxxxx "+JSON.stringify(jsonValue).toString());
                setLog(xxx);
                return xxx;
        
            } catch(e) {
            // read error
            
                return false
            }
        }
        check();
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
        
        setIsLoading(true);
        console.log("going"); 
        
        get(child(dbRef, `shop`)).then((snapshot) => {
            if (snapshot.exists()) {
                
                setData(Object.values(snapshot.val()).filter( element => element.id ==id))
                
              
              
            } else {
              console.log("No data available");
              
            }
          }).catch((error) => {
              
            console.error(error," XXX");
            
          });
          console.log(data+"data");
          fatchTime();
          console.log(estTime+"                  mmmmm");
          const intervalId = setInterval(async() => {
 
            get(child(dbRef, `shop`)).then((snapshot) => {
                console.log("data get successfull");
                if (snapshot.exists()) {
                    
                    setData(Object.values(snapshot.val()).filter( element => element.id ==id))
                    } else {
                  console.log("No data available");
                  
                }
              }).catch((error) => {
                  
                console.error(error," XXX");
                
              });
            fatchTime();
            
          }, 1000);
          return () => {
              clearInterval(intervalId);
              BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
            }
          
          
    },[navigation])


    function Service(){
        return(
            <View style={{flex:1}}>
                <View style={{flexDirection:'row',flex:1,justifyContent:'center',marginVertical:14}}>
                    <TouchableOpacity style={{flex:1,alignItems:'center',borderRightColor:'black',borderRightWidth:0.5}} onPress={()=>setM(true)} activeOpacity={0.8}>
                        <Text style={[styles.heading,{color:m?"#00b894":"black",}]} >
                            Male
                        </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={{flex:1,alignItems:'center'}} onPress={()=>setM(false)} activeOpacity={0.8}>
                        <Text style={[styles.heading,{color:m?"black":"#00b894",}]}  >
                            Female
                        </Text>
                    </TouchableOpacity>

                </View>
                {
                    m?

                    Object.values(data[0].service.man).map(item => {
                        return (
                            <TouchableOpacity activeOpacity={0.9} onPress={() => {
                                
                                check1[item.name]?setEstTime(estTime-parseInt(item.time)):setEstTime(estTime+parseInt(item.time)),
                                
                                check1[item.name]?setNum(num-1):setNum(num+1),
                                setCheck1({...check1, [item.name]: !check1[item.name]})}} key={item.name} style={{flexDirection:'row',flex:1,marginHorizontal:20,paddingVertical:10,borderTopColor:'black',borderTopWidth:0.5,alignContent:'center',alignItems:'center'}}>
                            
                            <CheckBox
                                title=""
                                checked={check1[item.name]}
                                onPress={() => {
                                
                                    check1[item.name]?setEstTime(estTime-parseInt(item.time)):setEstTime(estTime+parseInt(item.time)),
                                    
                                    check1[item.name]?setNum(num-1):setNum(num+1),
                                    setCheck1({...check1, [item.name]: !check1[item.name]})}}
                                activeOpacity={0.8}
                                containerStyle={styles.CheckBox}
                                textStyle={styles.text3}
                                checkedColor="#00b894"
                                uncheckedColor="#1A374D"
                            />
                            <View style={{flexDirection:'column'}}>
                                <Text style={{color:"black",fontSize:17}}>
                                    {item.name}
                                </Text>
                                <Text style={{color:"black",fontSize:12,opacity:0.7}}>
                                    cost - {"₹"} {item.price}
                                </Text>
                            </View>
                            <View style={{flex:1,alignItems:'flex-end'}}>
                                <Text style={{color:"#00b894",fontSize:17}}>
                                    {item.time} min.
                                </Text>

                            </View>
                            
                            
                            </TouchableOpacity>
                         )
                     })


                    :

                    Object.values(data[0].service.woman).map(item => {
                        return (
                            <TouchableOpacity activeOpacity={0.9} onPress={() => {
                                
                                check2[item.name]?setEstTime(estTime-parseInt(item.time)):setEstTime(estTime+parseInt(item.time)),
                                
                                check2[item.name]?setNum(num-1):setNum(num+1),
                                setCheck2({...check2, [item.name]: !check2[item.name]})}} key={item.name} style={{flexDirection:'row',flex:1,marginHorizontal:20,paddingVertical:10,borderTopColor:'black',borderTopWidth:0.5,alignContent:'center',alignItems:'center'}}>
                            
                            <CheckBox
                                title=""
                                checked={check2[item.name]}
                                onPress={() => setCheck2({...check2, [item.name]: !check2[item.name]})}
                                activeOpacity={0.8}
                                containerStyle={styles.CheckBox}
                                textStyle={styles.text3}
                                checkedColor="#00b894"
                                uncheckedColor="#1A374D"
                            />
                            <View style={{flexDirection:'column'}}>
                                <Text style={{color:"black",fontSize:17}}>
                                    {item.name}
                                </Text>
                                <Text style={{color:"black",fontSize:12,opacity:0.7}}>
                                    cost - {"₹"} {item.price}
                                </Text>
                            </View>
                            <View style={{flex:1,alignItems:'flex-end'}}>
                                <Text style={{color:"#00b894",fontSize:17}}>
                                    {item.time} min.
                                </Text>

                            </View>
                            
                            
                            </TouchableOpacity>
                         )
                     })

                }
                




            </View>
        )

    }






    return(
        <View style={styles.view}>
            <View style={{backgroundColor: 'white',}}>
                <View style={styles.top}>
                    <Icon name="arrow-back-ios" size={25} color="white" onPress={()=>navigation.goBack()}/>
                    <Text style={styles.topText}>
                        Check In
                    </Text>
                    
                    
                </View>
                
            </View>
            { data===null?
                        <View style={{width: '100%',height: '100%',
                            alignItems: 'center',justifyContent: 'center',
                            position: 'absolute'}}>
                            <ActivityIndicator size="large" color={'black'} />
                        </View>:
                        <ScrollView style={styles.scrollView} >
                            <View >
                            <SliderBox
                            images={Object.values(data[0].image)}
                            dotColor="#00b894"
                            inactiveDotColor="#90A4AE"
                            autoplay={true}
                            disableOnPress
                            
                            />
                            <View style={{flexDirection:'row'}}>
                                <View>
                                    <View>
                                        <Text style={styles.text}>
                                            {data[0].name}
                                        </Text>
                                        

                                    </View>
                                    <View>
                                        <Text style={styles.add}>
                                            {data[0].address}
                                        </Text>
                                    </View>

                                </View>
                                <View style={styles.waitTime}>
                                    <Text style={styles.text4}>
                                            Est. Time
                                        </Text>
                                        <Text style={styles.timeText}>
                                            {time()}
                                        </Text>
                                        
                                    </View>
                                
                                

                            </View>
                            
                            

                        </View>
                        {/* <View style={styles.waitView}>
                            <Text style={styles.text2}>
                                Waiting Time is {time()} 
                            </Text>
                            <Text style={styles.text2}>
                                {data[0].queue} People are in waitng Queue
                            </Text>
        
                        </View> */}
                        <View style={styles.regView}>





                            <Service/>
                            {/* <Text style={styles.head}>
                                Select service -
                            </Text>
                            <CheckBox
                                title="Cutting"
                                checked={check1}
                                onPress={() => setCheck1(!check1)}
                                activeOpacity={0.8}
                                containerStyle={styles.CheckBox}
                                textStyle={styles.text3}
                                uncheckedColor="#1A374D"
                                checkedColor="#00b894"
                            />
                            <CheckBox
                                title="Shaving"
                                checked={check2}
                                onPress={() => setCheck2(!check2)}
                                activeOpacity={0.8}
                                containerStyle={styles.CheckBox}
                                textStyle={styles.text3}
                                checkedColor="#00b894"
                                uncheckedColor="#1A374D"
                            />
                            <CheckBox
                                title="Something else"
                                checked={check3}
                                onPress={() => setCheck3(!check3)}
                                activeOpacity={0.8}
                                containerStyle={styles.CheckBox}
                                textStyle={styles.text3}
                                uncheckedColor="#1A374D"
                                checkedColor="#00b894"
                            /> */}



        
                            {/* <Text style={styles.head}>
                                Your Name -
                            </Text>
                            <TextInput onChangeText={(txt)=>setName(txt)} style={styles.inputText} placeholder="Add Your Name here" placeholderTextColor={'#D3D3D3'}/> */}
                            {/* <Text style={styles.head}>
                                Number of people -
                            </Text>
                            <View style={styles.numberIncriment}>
                                
                                
                                
                                <TouchableOpacity activeOpacity={0.8} onPress={()=>num!=1 ? setNum(num-1):setNum(1)}>
                                <Icon2 name="minus" size={40} color={'red'} />
                                </TouchableOpacity>
                                <Text style={{fontSize:24,marginHorizontal:20,color:'#1A374D'}}>
                                    {num}
                                </Text>
                                <TouchableOpacity activeOpacity={0.8} onPress={()=>num!=10 ? setNum(num+1):setNum(10)}>
                                <Icon2 name="plus" size={40} color={'#00b894'}/>
                                </TouchableOpacity>
                            </View> */}
                        </View>
                        {
                            !checkedIn?
                            <TouchableOpacity style={styles.checkIn} activeOpacity={0.75} onPress={()=>checkIn()}>
                                <Text style={styles.checkInText}>
                                    Check In
                                </Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={styles.checkedIn} activeOpacity={1}>
                                <Text style={styles.checkInText}>
                                    Already Checked In
                                </Text>
                            </TouchableOpacity>
                        }
                        
                        
        
                    </ScrollView>

                        
                    
                }
            
            {/* <View style={styles.bottom}>
                <Icon3 name='copyright' color={'#1A374D'} size={15}/>
                <Text style={{fontSize:12,color:'#1A374D'}}>{" "} Copyright 2022 @ </Text>
                <Text style={{fontSize:14,color:'#00b894'}}>
                    Qno
                </Text>
                <Text style={{fontSize:12,color:'#1A374D'}}> pvt ltd{" "}| All rights reserved</Text>
            </View> */}
            
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
        backgroundColor:'#00b894',
        elevation:5,
        
        height:height*0.07
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
        color:'#00b894',
        marginTop:10,
        fontWeight:'600',
        marginStart:30

    },
    add:{
        fontSize:14,
        color:'#00b894',
        marginTop:10,
        opacity:0.8,
        marginStart:30,
        marginBottom:20,

    },
    scrollView:{
        
    },
    waitView:{
        borderColor:'#9B0000',
        borderRadius:10,
        paddingHorizontal:10,
        marginTop:15,
        paddingVertical:5,
        elevation:5,
        backgroundColor:'white',
        marginHorizontal:20,
    },
    text2:{
        fontSize:20,
        color:'#00b894',
        marginVertical:5,
        marginHorizontal:10
    },
    regView:{
        borderColor:'#1A374D',
        borderRadius:10,
        paddingHorizontal:10,
        marginTop:15,
        paddingVertical:5,
        elevation:5,
        backgroundColor:'white',
        marginHorizontal:20,
    },
    head:{
        fontSize:14,
        color:'#1A374D',
        marginVertical:5,
        marginHorizontal:10
    },
    CheckBox:{
        backgroundColor:'white',
        borderWidth:0,
        margin:0,
        justifyContent:'center'
    },
    text3:{
        fontSize:15,
        color:'#1A374D',
        marginVertical:0,
        fontWeight:'200'
    },
    inputText:{
        flex:0.70,
        paddingLeft:10,
        backgroundColor:'white',
        borderRadius:10,
        paddingVertical:7,
        color:'#1A374D',
        marginHorizontal:16,
        marginVertical:7,
        borderBottomWidth:0.5
      },
      numberIncriment:{
        flexDirection:'row',
        marginHorizontal:16,
        marginVertical:7
      },
      checkIn:{
          backgroundColor:'#00b894',
          marginVertical:25,
          alignContent:'center',
          alignItems:'center',
          justifyContent:'center',
          borderRadius:10,
          marginHorizontal:40,
          elevation:5,
      },
      checkedIn:{
        backgroundColor:'#90A4AE',
        marginVertical:25,
        alignContent:'center',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10,
        marginHorizontal:40,
        elevation:5,
    },
      
      checkInText:{
          fontSize:22,
          marginVertical:7,
          color:"white",
          fontWeight:'500'
      },
      bottom:{
          borderTopWidth:0.2,
          borderColor:'#1A374D',
          justifyContent:'center',
          alignItems:'center',
          flexDirection:'row'
      },
      text4:{
        fontSize:16,
        color:'#00b894',
        opacity:0.8,
        
    },
    waitTime:{
        justifyContent:'center',
        alignItems:'flex-end',
        marginEnd:25,
        flex:1
    },
    timeText:{
        fontSize:20,
        fontWeight:'700',
        color:'#00b894',
        
    },
    heading:{
        fontSize:18
    }

})