import { Pressable, StyleSheet, View, Text, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function BadgerCard(props) {
    const navigation = useNavigation();
    function press(){
        navigation.push("Article", props);
    }
    return <Pressable onPress={press}>
        <View style={[styles.card, props.style]}>
           <Image alt = {props.title} style={{height:200, width:300, padding:20}} source={{uri: `https://raw.githubusercontent.com/CS571-SU24/hw8-api-static-content/main/${props.img}`}}/>
           <Text>{props.title}</Text>
        </View>
    </Pressable>
}

const styles = StyleSheet.create({
    card: {
        padding: 16,
        elevation: 5,
        borderRadius: 10,
        backgroundColor: 'slategray',
        shadowOffset: {
          width: 4,
          height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1,
    }
})