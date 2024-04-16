import 'react-native-gesture-handler';
import {  TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import Home from './screens/Home';
import AddContacts from './screens/AddContacts';
import { Icon, IconButton, MD3Colors,  } from 'react-native-paper';
import { DrawerActions, NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UpdateContact from './screens/UpdateContact';
import FavoriteContact from './screens/FavoriteContact';
import { createDrawerNavigator } from '@react-navigation/drawer';


const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const navigation:any = useNavigation();
  return (

    <Stack.Navigator>
      <Stack.Screen 
        name='Home' 
        component={Home} 
        options={{ title: 'Contact List', headerTitleAlign: 'center', statusBarColor:'white', statusBarStyle:'dark', headerLeft : () => {
            return (
              <TouchableOpacity
              onPress={() => {
                navigation.dispatch(DrawerActions.openDrawer())
              }}
            >
              <IconButton
                icon="menu"
                iconColor={MD3Colors.primary0}
                size={30}
                style={{margin:0}}
              />
            </TouchableOpacity>
            );
          }, 
        }} 
      />
      <Stack.Screen name='AddContact' component={AddContacts} options={{ title: 'Add Contact', headerTitleAlign: 'center', statusBarColor:'white', statusBarStyle:'dark'  }} />
      <Stack.Screen name='UpdateContact' component={UpdateContact} options={{ title: 'Update Contact', headerTitleAlign: 'center', statusBarColor:'white', statusBarStyle:'dark' }} />
    </Stack.Navigator>
  )
}

const AppNavigator = () => {
  const Drawer = createDrawerNavigator();

  return (
    <NavigationContainer>

      <Drawer.Navigator screenOptions={{drawerStyle: styles.drawerContainer , drawerLabelStyle:styles.drawerContent ,}}>
        <Drawer.Screen name="ContactListScreen" component={StackNavigator} options={{title:'Contact List', headerTitleAlign:'center',headerShown:false, drawerItemStyle:{backgroundColor:'#f1e4f3'}}}/>
        <Drawer.Screen name="FavoriteContact" component={FavoriteContact} options={{title: 'Favourite Contact ⭐', headerTitleAlign: 'center', drawerItemStyle:{backgroundColor:'#f1e4f3'}}}/>
      </Drawer.Navigator>

    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  drawerContainer:{
    backgroundColor: '#f1e4f3',
      width: 265,
      borderRadius:5,
      paddingVertical:10,
      
  },
  drawerContent:{
    color: 'black',
  }

});

export default AppNavigator