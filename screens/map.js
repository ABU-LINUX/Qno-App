import React,{useState,useEffect} from "react";
import { 
    View,
    Text,
    StyleSheet,
    Dimensions,
    TextInput,
    TouchableOpacity,
    ScrollView,
    FlatList,
    ActivityIndicator,
    BackHandler

 } from "react-native";
 import { SearchBar } from 'react-native-elements';
 import Icon from 'react-native-vector-icons/dist/MaterialIcons';
 import Icon2 from 'react-native-vector-icons/dist/EvilIcons';
 import Icon3 from 'react-native-vector-icons/dist/FontAwesome';

 import { initializeApp } from "firebase/app";
 import {firebaseConfig} from "../config"
 import { getDatabase, ref, child, get } from "firebase/database";



 import Card from "./card";

 const width=Dimensions.get('window').width;
 const height=Dimensions.get('window').height;

export default function Map({navigation}){
    const [search,setSearch]=useState(""); 
    const [data,setData]=useState(null);
    const [isLoading,setIsLoading]=useState(true);
    const [min,setMin]=useState(0);
    
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    const dbRef = ref(getDatabase());
    // const data=[
    //     {id:1,name:"iitg shop",address:"iitg market complex",status:"active",dist:20,},
    //     {id:2,name:"Khokha shop1",address:"Khokha market",status:"active",dist:10,},
    //     {id:3,name:"Khokha shop2",address:"Khokha market",status:"active",dist:10,},
    //     {id:4,name:"Khokha shop3",address:"Khokha market",status:"active",dist:10,}
    // ];
    function handleBackButton() {
        navigation.navigate("Home");
         return true;
       } 
    useEffect(()=>{
        // BackHandler.addEventListener('hardwareBackPress', handleBackButton);
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
            
            
            get(child(dbRef, `shop`)).then((snapshot) => {
                if (snapshot.exists()) {
                setData(Object.values(snapshot.val()));
                
                
                } else {
                console.log("No data available");
                if(data===null){
                    return(
                        <View>
                            <Text>
                                no shope in your area
                            </Text>
                        </View>
                    )
                }
                }
            }).catch((error) => {
                console.error(error," XXX");
                
            });
            setIsLoading(false);
            fatchTime();
            console.log("sssssss "+min)
            const intervalId = setInterval(async() => {
                fatchTime();
                get(child(dbRef, `shop`)).then((snapshot) => {
                    if (snapshot.exists()) {
                    setData(Object.values(snapshot.val()));
                    
                    
                    } else {
                    console.log("No data available");
                    if(data===null){
                        return(
                            <View>
                                <Text>
                                    no shope in your area
                                </Text>
                            </View>
                        )
                    }
                    }
                }).catch((error) => {
                    console.error(error," XXX");
                    
                });
            console.log("sssssss "+min)
            
          }, 1000);
          return () => {
            clearInterval(intervalId); 
            // BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
          }

    },[navigation])
    return(
        <View style={styles.view}>
            <View style={styles.top}>
                <SearchBar
                    placeholder="Search Here..."
                    onChangeText={(txt)=>setSearch(txt)}
                    value={search}
                    containerStyle={styles.searchView}
                    inputContainerStyle={styles.searchText}
                />
            </View>
            {
                data===-1?
                <View>
                    
                </View>:
                data===null?
                      <View style={{width: '100%',height: '100%',
                              alignItems: 'center',justifyContent: 'center',
                              position: 'absolute'}}>
                          <ActivityIndicator size="large" color={'black'} />
                      </View>:
                      
                      <FlatList
                      key={(item) => '' + item.id}
                      data={data}
                      renderItem={({item})=><Card item={item} min={min} />}
                      keyExtractor={(item) => '' + item.id}
                      style={{marginTop:15}}
                      
                  />
                  
            }
            
            
                
            

            
            {/* <View style={styles.bottom}>
                <Icon3 name='copyright' color={'#1A374D'} size={15}/>
                <Text style={{fontSize:12,color:'#1A374D'}}>{" "} Copyright 2022 @ the</Text>
                <Text style={{fontSize:14,color:'#0E49B5'}}>
                    Qno
                </Text>
                <Text style={{fontSize:12,color:'#1A374D'}}> pvt ltd{" "}| All rights reserved</Text>
            </View> */}
            
        </View>
    )
}
const styles =StyleSheet.create({
    text:{
        fontSize:40,
        color:'black'

    },
    view:{
        flex:1,
    },
    scrollView:{
        paddingBottom:10,
    },
    top:{
        flexDirection:'row',
        alignItems:'center',
        height:height/10,
        backgroundColor: '#00b894',
        elevation:5,
        justifyContent:'center',
        


        
    },
    input:{
        height:40,
        width:width*5/7,
        borderColor:'#1A374D',
        borderRadius:10,
        borderWidth:1,
        flexDirection:'row',
        margin:10,
        
      },
      inputText:{
        flex:0.70,
        borderRightWidth:1,
        paddingLeft:10
        
      },
      searchText:{
        fontSize:16,
        color:'#1A374D',
        backgroundColor:'white',
        elevation:5,
        borderRadius:15,
      },
      searchView:{
        width:width-40,
        backgroundColor:'#00000000',
        
        borderTopWidth:0,
        borderBottomWidth:0
      },
      bottom:{
        borderTopWidth:0.2,
        borderColor:'#1A374D',
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row'
    },
})