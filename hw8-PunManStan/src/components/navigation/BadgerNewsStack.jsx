import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BadgerNewsScreen from "../screens/BadgerNewsScreen";
import Article from "../screens/Article";

function BadgerNewsStack(props){
    
    const stack = createNativeStackNavigator();
    return <>
        <stack.Navigator>
            <stack.Screen name = "Articles" component={BadgerNewsScreen}/>
            <stack.Screen name = "Article" component={Article}/>
        </stack.Navigator>
    </>
}

export default BadgerNewsStack;