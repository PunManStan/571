import { Text, View } from "react-native";
import BadgerCard from "../BadgerCard";
import { useState, useEffect } from "react";
function BadgerNewsScreen(props) {
  
    const [news, setNews] = useState([]);
   
    useEffect(() => {
        fetch('https://cs571api.cs.wisc.edu/rest/su24/hw8/articles?',{
        headers: {
            "X-CS571-ID": "bid_4e56e60a244aa22587a45f341df19b633e636dd904865759edddc497016dc93a"
        }
        
        }).then(data =>data.json()).then(json=>{
            setNews(json);
        })
    },[])

   
    
    return <View>
       
        {news ? news.map((prop) => <BadgerCard{...prop} key={prop.id}/>): ""}
        
    </View>
}

export default BadgerNewsScreen;