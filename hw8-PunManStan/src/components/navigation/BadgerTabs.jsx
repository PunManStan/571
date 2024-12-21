import * as React from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import BadgerPreferences from "./../screens/BadgerPreferencesScreen";
import BadgerNewsStack from "./BadgerNewsStack";
import { useState, useEffect } from "react";

function BadgerTabs(props) {
    const newsTabs = createBottomTabNavigator();
    return <>
       
        <newsTabs.Navigator>
            <newsTabs.Screen name="News" component={BadgerNewsStack}/>

            <newsTabs.Screen name="Prefrences" component={BadgerPreferences}/>
        </newsTabs.Navigator>

    </>
}

export default BadgerTabs;