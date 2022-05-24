import React from "react";
import { 
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,

    Text,
    
} from "react-native";
import Icon from 'react-native-vector-icons/dist/Entypo';
import Icon2 from 'react-native-vector-icons/dist/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
const width=Dimensions.get('window').width;
 
const height=Dimensions.get('window').height;

export default function Card({item,min}){
    
    function time(){
        
        var x = parseInt(parseInt(item.ett.min)-min);
        if(x>59){
            return parseInt(x/60)+" hr "+x%60+" min"
        }
        if(x<0){
            return "00 min."
        }
        
        return x%60+" min";
    }
    const navigation = useNavigation();
    return (
        <TouchableOpacity style={styles.cardView} activeOpacity={0.8} onPress={()=>navigation.navigate("checkIn",{id:item.id,min:min})}>
            
            <View style={styles.context}>
                <Text style={styles.text1}>
                    {item.name}
                </Text>
                <Text style={styles.text2}>
                    {item.address}
                </Text>
                <View style={{flexDirection:'row',marginTop:5,}}> 
                    <Text style={styles.text3}>
                        {item.status}
                    </Text>
                    <Icon name="dot-single" size={12} color={"black"} style={{opacity:0.5,alignSelf:'center'}}/>
                    <Icon2 name="car" size={15} color={"black"} style={{opacity:0.5,alignSelf:'center'}}/>
                    <Text style={styles.text3}>
                        {" "}{item.dist}
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
            
        </TouchableOpacity>
    )
}
const styles =StyleSheet.create({
    cardView:{
        marginHorizontal:20,
        marginBottom:15,
        height:width/3,
        backgroundColor:'white',
        borderRadius:8,
        elevation:5,
        flexDirection:'row',
    },
    
    context:{
        justifyContent:'center',
        alignContent:'center',
        marginStart:25,
        flex:0.7,
    },
    text1:{
        fontSize:17,
        color:'#1A374D',
        marginTop:5
    },
    text2:{
        fontSize:15,
        color:'#1A374D',
        opacity:0.8,
        marginTop:5
    },
    text3:{
        fontSize:12,
        color:'#1A374D',
        opacity:0.8,
        
        
    },
    text4:{
        fontSize:16,
        color:'#00b894',
        opacity:0.8,
        
    },
    waitTime:{
        flex:0.4,
        width:width/4,
        justifyContent:'center',
        alignItems:'flex-end',
        marginEnd:25
    },
    timeText:{
        fontSize:20,
        fontWeight:'700',
        color:'#00b894',
        
    },
})