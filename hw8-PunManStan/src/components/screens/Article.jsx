import { useNavigation } from "@react-navigation/native";
import { View, Text, Image } from "react-native";
import { useState, useEffect } from "react";

export default function Article(props){
    const [data, setData] = useState();
    useEffect(() => {
        fetch('https://cs571api.cs.wisc.edu/rest/su24/hw8/articles?id=${props.fullArticleID}',{
        headers: {
            "X-CS571-ID": "bid_4e56e60a244aa22587a45f341df19b633e636dd904865759edddc497016dc93a"
        }
        
        }).then(data =>data.json()).then(json=>{
           setData(data);
        })
    },[])
    return<View>
        <Image alt = {props.title} style={{height:200, width:300, padding:20}} source={{uri:`https://raw.githubusercontent.com/CS571-SU24/hw8-api-static-content/main/${props.img}`}}/>
        <Text>{props.title}</Text>
        <Text>{props}</Text>
    </View>
}