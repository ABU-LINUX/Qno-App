import React,{useEffect, useState} from "react";
import { 
    View,
    StyleSheet,
    Dimensions,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Animated,
    ActivityIndicator,
    ToastAndroid
    

} from "react-native";
import Icon from 'react-native-vector-icons/dist/AntDesign';
import Icon2 from 'react-native-vector-icons/dist/EvilIcons';

import Icon3 from 'react-native-vector-icons/dist/Ionicons';
import Icon5 from 'react-native-vector-icons/dist/FontAwesome';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon4 from 'react-native-vector-icons/dist/Feather';
import { CheckBox } from 'react-native-elements';
import { BottomSheet } from "react-native-elements/dist/bottomSheet/BottomSheet";
import { initializeApp } from "firebase/app";
import {firebaseConfig} from "../config"
import { getDatabase, ref, child, get,set, push,update,remove } from "firebase/database";
// import { getAuth, signInWithPhoneNumber ,RecaptchaVerifier} from "firebase/auth";
import auth from '@react-native-firebase/auth';
import { async } from "@firebase/util";
// import { firebase } from "@react-native-firebase/auth";
const width=Dimensions.get('window').width;
 
const height=Dimensions.get('window').height;


export default function Profile({navigation}){
    const [log,setLog] = useState(false);
    const [load,setLoad] = useState(false);
    const [isVisible1, setIsVisible1] = useState(false);
    const [isVisible2, setIsVisible2] = useState(false);
    const [otp,setOtp]=useState(false);
    const [press,setPress]=useState(false);
    const [confirm, setConfirm] = useState(null);
    const [num,setNum]=useState("");
    const [name,setName]=useState("");
    const [phone,setPhone]=useState("");
    const [address,setAddress]=useState("");
  const [code, setCode] = useState('');
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
// const app=firebase.initializeApp(firebaseConfig);
        async function getName(){
            const jsonValue = await AsyncStorage.getItem("name")
            setName(jsonValue);
            return JSON.stringify(jsonValue).toString();
            
        }
        async function getPhone(){
            const jsonValue = await AsyncStorage.getItem("phone")
            setPhone(jsonValue);
            return JSON.stringify(jsonValue).toString();
        }
        async function getAddress(){
            const jsonValue = await AsyncStorage.getItem("address")
            console.log(JSON.stringify(jsonValue).toString());
            setAddress(jsonValue);
            return JSON.stringify(jsonValue).toString();
        }
        async function setNewName(x){
            AsyncStorage.setItem("name",x);
            
        }
        async function setNewPhone(){
            AsyncStorage.setItem("phone",num);
        }
        async function setNewAddress(x){
            AsyncStorage.setItem("address",x);
        }
        // const auth = getAuth();
           
        useEffect(()=>{
            // firebase.auth().onAuthStateChanged((user) => {
            //     if (user) {
            //         // if user data exist

            //         //clear previous user session
            //         firebase.auth().signOut();
            //     }
            // });
            const unsubscribe = navigation.addListener('focus', () => {
                // The screen is focused
                // Call any action

                async function check()  {
                    try {
                        
                        const jsonValue = await AsyncStorage.getItem('isLoggedIn')
                        const xxx= jsonValue !== null ? true: false;
                        if(xxx){
                            getAddress();
                            getPhone();
                            getName();
                        }
                        console.log(xxx + "   xxxxxx "+JSON.stringify(jsonValue).toString());
                        setLog(xxx);
                        return xxx;
                
                    } catch(e) {
                    // read error
                    
                    return false
                    }
                }
                check();
                
              });
          
              // Return the function to unsubscribe from the event so it gets removed on unmount
              return unsubscribe;
            
        //     const jsonValue = await AsyncStorage.getItem('isLoggedIn')
        //     // const xxx= jsonValue != null ? JSON.stringify(jsonValue):
        //   console.log(JSON.stringify(jsonValue).toString() + "  ssssssssss");
        //     setLog(JSON.stringify(jsonValue).toString().length===1);
        //     console.log(AsyncStorage.getItem("isLoggedIn")+"                 x");
        },[navigation])
        
  async function signinWithPhoneNumber(phoneNumber) {
   
    
        try{
            setPress(true);
            setOtp(false);
            setCode("");
            console.log("log1");
            const confirmation = await auth().signInWithPhoneNumber(phoneNumber,true);
            console.log("log2");

            setConfirm(confirmation);
            setOtp(true);
            
    }
        catch(e){
            setPress(false);
            ToastAndroid.showWithGravity(
                "Please enter a correct number "+e,
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
              );
              setOtp(false);
              console.log(e);
        }
  }
  async function reSend(){
    console.log(num);
    signinWithPhoneNumber("+91"+num)
  }
  
  async function confirmCode() {
    try {
        console.log(code);
        console.log(confirm);
        
        confirm.confirm(code.toString()).then(
            ()=>{
                ToastAndroid.showWithGravity(
                    "Login Successfull",
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER
                    );
                    logIn();
                    setPress(false);
            }
        )
        
        
        
      
    } catch (error) {
      console.log('got an error '+" "+error);
      
    }
  }
  function newUser(){

    const dbref = getDatabase();
    set(ref(dbref, 'users/'+num), {
        name: "@exampleName",
        phone: num,
        address: "@exampleAddress"
    })
    setNewAddress("@exampleAddress");
    setNewName("@exampleName");
    setNewPhone();


  }
  


    // const auth = getAuth();

    

    const check = async () => {
        try {
            
            const jsonValue = await AsyncStorage.getItem('login')
            const xxx= jsonValue != null ? JSON.stringify(jsonValue).toString().length==4: false;
            
            setLog(xxx);
            return xxx;
    
        } catch(e) {
          // read error
          
          return false
        }
      }
      const signIn = async () => {
        // try {
        //   await AsyncStorage.setItem('login', "11")
        // } catch (e) {
        //   // saving error
        //   console.log('err')
        // }
        // check();
        
        setIsVisible2(false);
        setIsVisible1(true);
        
        // inModal();
      }
      function logIn(){
          setOtp(false);
          setPress(false);
          setCode("");
        AsyncStorage.setItem("isLoggedIn","1");
        setLoad(true);
        setIsVisible2(false);
        setIsVisible1(false);
        
        const db = ref(getDatabase());
        
        console.log(num + "              ppppp");
        // get(child(dbRef, ``)).then((snapshot) => {
        //     console.log("database fatched");
        // if (snapshot.exists()) {
        //     console.log(snapshot.val()+"            lllllllllll");
        // } else {
        //     console.log("No data available");
        // }
        // }).catch((error) => {
        // console.error(error);
        // });
        get(child(db, `users/${num}`)).then((snapshot) => {
            
            if (snapshot.exists()) {
                console.log("snapshot data geted");
    
                setNewAddress(Object.values(snapshot.val())[0]);
                setNewName(Object.values(snapshot.val())[1]);
                setNewPhone();
            } else {
              console.log("No data available");
            //   set(ref(dbref, 'users/'+num), {
            //     name: "@exampleName",
            //     phone: num,
            //     address: "@exampleAddress"
            //     })
            //     setNewAddress("@exampleAddress");
            //     setNewName("@exampleName");
            //     setNewPhone();
    
                newUser();
            }
          }).catch((error) => {
    
            console.log(num+"                    ll");
            console.error("cccccccccc " + error);
          }).then(()=>{
            getAddress();
            getPhone();
            getName();
            setLog(true);
    
    
            setLoad(false);
    
    
    
    
          })
      console.log("loggedIn");
        setLog(true)
      }

    //   function getOtp(){
    //     const phoneNumber = "+918875805806"
    //     window.recaptchaVerifier = new RecaptchaVerifier('sign-in-button', {
    //         'size': 'invisible',
    //         'callback': (response) => {
    //           // reCAPTCHA solved, allow signInWithPhoneNumber.
    //           onSignInSubmit();
    //         }
    //       }, auth);
    //       const appVerifier = window.recaptchaVerifier;
    //       signInWithPhoneNumber(auth, phoneNumber,appVerifier)
    //         .then((confirmationResult) => {
    //         // SMS sent. Prompt user to type the code from the message, then sign the
    //         // user in with confirmationResult.confirm(code).
    //         console.log(confirmationResult+"  "+appVerifier+"  cccccccc");
    //         window.confirmationResult = confirmationResult;
    //         // ...
    //         }).catch((error) => {
    //         // Error; SMS not sent
    //         // ...
    //         console.log(error);
    //         });
    //       setOtp(true);
    //   }
      async function logOut(){
          setLog(false);
          AsyncStorage.removeItem("phone");
          AsyncStorage.removeItem("name");
          AsyncStorage.removeItem("address");
          AsyncStorage.removeItem("isLoggedIn");
          AsyncStorage.removeItem("checkedIn")
          
      }
    //   function inModal(){
    //       return(
            
    //       )
    //   }
      function LogedIn(){
        return(
            <View>
                <View style={{marginStart:10,marginEnd:10,flex:1,justifyContent:'flex-end'}}>
                    <Text style={styles.name}>
                        {name}
                    </Text>
                    <Text style={styles.phone}>
                        {phone}
                    </Text>
                    <Text style={styles.loc}>
                        {address}
                    </Text>
                </View>
                <View style={{alignItems:'flex-end',flexDirection:'row',marginTop:20,justifyContent:'flex-end',marginBottom:25}} >
                    <Icon4 name="edit" size={20} color={"white"} style={{opacity:0.75}} onPress={()=>navigation.navigate("PInfo")}/>
                    <Text style={{color:'white',fontSize:15,opacity:0.75}} onPress={()=>navigation.navigate("PInfo")}>
                        {" "}edit details
                    </Text>
                </View>
            
            </View>
            
        );
    }
    
    function New(){
        return(
            <View style={{marginStart:10,marginEnd:10,flex:1,justifyContent:'flex-end'}}>
                <TouchableOpacity style={styles.signIn} onPress={()=>signIn()} activeOpacity={0.8}>
                    <Text style={styles.signInTxt}>
                        Sign in
                    </Text>
                </TouchableOpacity>
                {/* <Text style={styles.txt}>
                    or Don't have an Account
                </Text>
                <Text style={styles.signUpTxt} onPress={()=>signOut()}>
                    Sign up
                </Text> */}
            </View>
        )
    }
    function OTP(){
        return(
            <View style={{marginStart:10,marginEnd:10,flex:1,alignItems:'center'}}>
                <TextInput onChangeText={(txt)=>setCode(txt)} value={code} keyboardType="number-pad" style={{color:'black',borderColor:"black",borderBottomWidth:0.5,width:width/2,paddingBottom:0,marginTop:20,paddingHorizontal:20}}/>
                
                <View style={{marginTop:14}}>
                    <Text style={{color:'#00b894',}} onPress={()=>reSend()}>
                        re-send
                    </Text>

                </View>
                <TouchableOpacity style={styles.modalbtn} activeOpacity={0.8} onPress={() => confirmCode()}>
                    <Text style={styles.modalbtntxt}>
                        Submit
                    </Text>
                </TouchableOpacity>
                
            </View>
        )
    }
    
      
    return(
    <View>
            <View style={styles.top}>
                <View style={{flexDirection:'row',flex:1,alignItems:'center'}}>
                    <View style={{marginStart:0}}>
                        <Icon2 name="user" size={150} color={"white"} />
                    </View>
                    {load ? <View style={{width: '100%',height: '100%',
                            alignItems: 'center',justifyContent: 'center',
                            position: 'absolute'}}>
                            <ActivityIndicator size="large" color={'black'} />
                        </View> :
                        log? <LogedIn /> : <New/>}
                    {/* <LogedIn /> */}
                    {/* {log ? <Text onPress={()=>signOut()}>xxxxx</Text> : <Text onPress={()=>signIn()}>yyyyy</Text>}
                    */}

                </View>
                
                
            </View>
            <ScrollView>
                

                    <Text style={styles.help}>
                        Help and Policies
                    </Text>
                    <View style={{backgroundColor:'white',marginHorizontal:25,borderRadius:10,elevation:5,marginTop:20}}>
                        <View style={{flexDirection:'row',alignItems:'center',marginHorizontal:15}}>
                            <Icon2 name="user" size={35} color={"black"}/>
                            <TouchableOpacity style={styles.view} activeOpacity={0.8} onPress={()=>{log?navigation.navigate("PInfo"):ToastAndroid.showWithGravity("Please log in to your account",ToastAndroid.SHORT,ToastAndroid.CENTER);}}>
                                <Text style={styles.details} >
                                    Personal Info
                                </Text>
                            </TouchableOpacity>
                        </View>
                    
                        <View style={{flexDirection:'row',alignItems:'center',marginHorizontal:15}} activeOpacity={0.8}>
                            <Icon3 name="help-circle-outline" size={30} color={"black"}/>
                            <TouchableOpacity style={styles.view} activeOpacity={0.8}>
                                <Text style={styles.details} >
                                    Help
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center',marginHorizontal:15}} activeOpacity={0.8}>
                            <Icon3 name="information-circle-outline" size={30} color={"black"}/>
                            <TouchableOpacity style={styles.view} activeOpacity={0.8}>
                                <Text style={styles.details} >
                                    About Us
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center',marginHorizontal:15}} activeOpacity={0.8}> 
                            <Icon name="file1" size={20} color={"black"} />
                            <TouchableOpacity style={styles.view} activeOpacity={0.8}>
                                <Text style={styles.details}>
                                    Terms and Conditions
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center',marginHorizontal:15}} activeOpacity={0.8}>
                            <Icon3 name="lock-closed-outline" size={25} color={"black"} />
                            <TouchableOpacity style={styles.view} activeOpacity={0.8}>
                                <Text style={styles.details}>
                                    Privacy Policies
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {log?<View style={{flexDirection:'row',alignItems:'center',marginHorizontal:15}} activeOpacity={0.9}>
                            <Icon name="logout" size={24} color={"black"}/>
                            <TouchableOpacity style={styles.view} activeOpacity={0.7} onPress={()=>logOut()}>
                                <Text style={styles.details}>
                                    LogOut
                                </Text>
                            </TouchableOpacity>
                        </View>:<View/>}
                        

                    </View>
                    <View style={{height:10}}/>
                    <BottomSheet
                        isVisible={isVisible1}
                        containerStyle={styles.sgnInModal}
                        modalProps={{
                            animated:'false',
                            animationType:'slide',
                            statusBarTranslucent:true,
                            
                        }
                        }
                        
                    >
                        <View style={styles.modal1View}>
                            <View style={{margin:30,marginBottom:20,flexDirection:'row',alignItems:'center'}}>
                                <Icon3 name="arrow-back-circle-outline" size={35} color={"black"} onPress={()=>setIsVisible1(false)}/>
                                <Text style={{color:'black',marginStart:20,fontSize:22}}>
                                    Welcome !
                                </Text>
                            </View>
                            <View style={{borderBottomColor:'grey',borderBottomWidth:0.5,marginBottom:10}}/>
                            <ScrollView >
                                <View style={styles.inputText}> 
                                        <Icon4 name="phone" size={23} color={"black"} style={{opacity:0.8}} />
                                        <TextInput  style={{marginStart:10,borderBottomWidth:0.5,flex:1,color:'black'}} keyboardType="phone-pad"  placeholder="Phone No." maxLength={10} placeholderTextColor={'#D3D3D3'} onChangeText={(text)=>setNum(text)}/>


                                    </View>
                                    {/* <View style={styles.inputText}> 
                                        <Icon2 name="lock" size={30} color={"black"} style={{opacity:0.8}} />
                                        <TextInput style={{marginStart:5,borderBottomWidth:0.5,flex:1,color:'black'}} keyboardType='visible-password'  placeholder="Password" placeholderTextColor={'#D3D3D3'}/>


                                    </View> */}
                                    <TouchableOpacity key={'sign-in-button'} style={styles.modalbtn} activeOpacity={0.8} onPress={()=>signinWithPhoneNumber("+91"+num)}>
                                        <Text style={styles.modalbtntxt}>
                                            Get Otp
                                        </Text>
                                    </TouchableOpacity>
                                    {/* <Text style={styles.Modaltxt}>
                                        or Don't have an Account
                                    </Text>
                                    <Text style={styles.modalsignUpTxt} onPress={()=>signOut()}>
                                        Sign up
                                    </Text> */}
                                    {press?
                                        otp?
                                        <View style={{marginStart:10,marginEnd:10,flex:1,alignItems:'center'}}>
                                        <TextInput onChangeText={(txt)=>setCode(txt)} value={code} keyboardType="number-pad" maxLength={6} style={{color:'black',borderColor:"black",borderBottomWidth:0.5,width:width/2,paddingBottom:0,marginTop:20,paddingHorizontal:20}}/>
                                        
                                        <View style={{marginTop:14}}>
                                            <Text style={{color:'#00b894',}} onPress={()=>reSend()}>
                                                re-send
                                            </Text>
                        
                                        </View>
                                        <TouchableOpacity style={styles.modalbtn} activeOpacity={0.8} onPress={() => confirmCode()}>
                                            <Text style={styles.modalbtntxt}>
                                                Submit
                                            </Text>
                                        </TouchableOpacity>
                                        
                                    </View>
                                    :<ActivityIndicator size="small" color={'black'} style={{margin:20}}/>:<View/>
                                    }
                                
                                
                            </ScrollView>
                            
                        </View>
                    </BottomSheet>
                    <BottomSheet
                        isVisible={isVisible2}
                        containerStyle={styles.sgnInModal}
                        modalProps={{
                            animated:'false',
                            animationType:'slide',
                            statusBarTranslucent:true,
                            
                        }
                        }
                        
                    >
                        <View style={styles.modal1View}>
                            <View style={{margin:30,marginBottom:20,flexDirection:'row',alignItems:'center'}}>
                                <Icon3 name="arrow-back-circle-outline" size={35} color={"black"} onPress={()=>setIsVisible2(false)}/>
                                <Text style={{color:'black',marginStart:20,fontSize:22}}>
                                    Welcome !
                                </Text>
                            </View>
                            <View style={{borderBottomColor:'grey',borderBottomWidth:0.5,marginBottom:10}}/>
                            <ScrollView >
                                <View style={styles.inputText}> 
                                        <TextInput  style={{marginStart:10,borderBottomWidth:0.5,flex:1,color:'black'}} keyboardType="default"  placeholder="Name" maxLength={10} placeholderTextColor={'#D3D3D3'} onChangeText={(text)=>setName(text)}/>
                                        
                                    </View>
                                    {/* <View style={styles.inputText}> 
                                        <Icon2 name="lock" size={30} color={"black"} style={{opacity:0.8}} />
                                        <TextInput style={{marginStart:5,borderBottomWidth:0.5,flex:1,color:'black'}} keyboardType='visible-password'  placeholder="Password" placeholderTextColor={'#D3D3D3'}/>


                                    </View> */}
                                    <TouchableOpacity style={styles.modalbtn} activeOpacity={0.8} onPress={()=>signinWithPhoneNumber("+91 "+num)}>
                                        <Text style={styles.modalbtntxt}>
                                            Get Otp
                                        </Text>
                                    </TouchableOpacity>
                                    {/* <Text style={styles.Modaltxt}>
                                        or Don't have an Account
                                    </Text>
                                    <Text style={styles.modalsignUpTxt} onPress={()=>signOut()}>
                                        Sign up
                                    </Text> */}
                                    {press?
                                        otp?
                                        <View style={{marginStart:10,marginEnd:10,flex:1,alignItems:'center'}}>
                                        <TextInput onChangeText={(txt)=>setCode(txt)} value={code} keyboardType="number-pad" maxLength={6} style={{color:'black',borderColor:"black",borderBottomWidth:0.5,width:width/2,paddingBottom:0,marginTop:20,paddingHorizontal:20}}/>
                                        
                                        <View style={{marginTop:14}}>
                                            <Text style={{color:'#00b894',}} >
                                                re-send
                                            </Text>
                        
                                        </View>
                                        <TouchableOpacity style={styles.modalbtn} activeOpacity={0.8} onPress={() => confirmCode()}>
                                            <Text style={styles.modalbtntxt}>
                                                Submit
                                            </Text>
                                        </TouchableOpacity>
                                        
                                    </View>
                                    :<ActivityIndicator size="small" color={'black'} style={{margin:20}}/>:<View/>
                                    }
                                
                                
                            </ScrollView>
                            
                        </View>
                    </BottomSheet>
                    
                
            </ScrollView>
        
    </View>
    )
}
const styles =StyleSheet.create({
    top:{
        height:height/3.5,
        backgroundColor:'#00b894',
        justifyContent:'center',
        elevation:5,
    },
    name:{
        color:'white',
        fontSize:25,
        marginTop:5,
        
    },
    phone:{
        color:'white',
        fontSize:18,
        marginTop:5,
        opacity:0.85
    },
    loc:{
        color:'white',
        fontSize:18,
        marginTop:5,
        opacity:0.85
    },
    help:{
        color:'black',
        fontSize:12,
        marginTop:20,
        marginStart:20,
        opacity:0.8
    },
    details:{
        fontSize:20,
        color:'black'
    },
    view:{
        flexDirection:'row',
        paddingTop:15,
        borderBottomWidth:0.2,
        borderColor:"#acacac",
        paddingBottom:15,
        flex:1,
        paddingHorizontal:15
    },
    signIn:{
        backgroundColor:'white',
        alignSelf:'center',
        alignItems:'center',
        paddingVertical:5,
        paddingHorizontal:15,
        borderRadius:7,
        elevation:5,
    },
    signInTxt:{
        fontSize:18,
        color:'#00b894',
        fontWeight:'600'
    },
    signUpTxt:{
        fontSize:18,
        color:'white',
        fontWeight:'600',
        alignItems:'center',
        alignSelf:'center',
        textDecorationLine: "underline"
    },
    txt:{
        marginTop:20,
        marginBottom:5,
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'center',
        fontSize:14,
        color:'white',
        opacity:0.8,


    },
    sgnInModal:{
        
    },
    modal1View:{
        backgroundColor:'white',
        height:height/1.2,
        borderTopLeftRadius:50,
        borderTopRightRadius:50,
        elevation:5

    },
    inputText:{
        paddingLeft:0,
        backgroundColor:'white',
        borderRadius:10,
        marginHorizontal:50,
        marginVertical:7,
        color:'black',
        flexDirection:'row',
        alignItems:'center',
        
      },
      modalbtntxt:{
        fontSize:20,
        color:'white',
        marginVertical:8,
        fontWeight:'500',
        paddingHorizontal:30
      },
      modalbtn:{
        marginHorizontal:40,
        marginTop:30,
        backgroundColor:'#00b894',
        alignItems:'center',
        borderRadius:14
      },
      modalsignUpTxt:{
        fontSize:20,
        color:'#00b894',
        fontWeight:'600',
        alignItems:'center',
        alignSelf:'center',
        textDecorationLine: "underline",
        fontWeight:'500'
      },
      Modaltxt:{
        marginTop:20,
        marginBottom:5,
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'center',
        fontSize:16,
        color:'#00b894',
        opacity:0.8,

      },

})