import React, {useEffect, useLayoutEffect} from 'react';
import {
  View,
  StatusBar,
  Text,
  Button,
  PlatformColor,
  ScrollView,
} from 'react-native';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';

import List from './components/List/List';

import Icon from 'react-native-vector-icons/Ionicons';

import useFavs from './hooks/useFavs';

const HomeScreen = () => {
  return (
    <View style={{flex: 1}}>
      <List />
    </View>
  );
};

const FavsScreen = () => {
  const {favs, addFav, removeFav, clearFavs} = useFavs();

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{color: 'red'}}>{JSON.stringify(favs)}...</Text>
      <Button title="set" onPress={() => addFav(66)} />
      <Button title="remove" onPress={() => removeFav(66)} />
      <Button title="clear" onPress={() => clearFavs()} />
    </View>
  );
};

const CartScreen = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Cart Screen!</Text>
    </View>
  );
};

const SettingsScreen = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Settings Screen!</Text>
    </View>
  );
};

const TabsScreen = () => {
  const {favs} = useFavs();

  return (
    <Tab.Navigator
      screenOptions={{
        // @ts-expect-error
        tabBarActiveTintColor: PlatformColor('systemGreen'),
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: PlatformColor('systemBackground'),
        },
        // tabBarBackground: () => <BlurView ... />,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="ios-home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Favs"
        component={FavsScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="ios-heart-outline" size={size} color={color} />
          ),
          tabBarBadge: favs.length,
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="ios-cart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="ios-person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const ItemScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{flex: 1, backgroundColor: 'red'}}>
      <Button title="Done" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
};

const SearchScreen = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        tintColor: PlatformColor('systemGreen'),
        hideWhenScrolling: false,
        placeholder: 'Search menu',
      },
      headerRight: () => (
        <Button
          title="Done"
          color={PlatformColor('systemGreen')}
          onPress={() => navigation.goBack()}
        />
      ),
    });
  }, [navigation]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{flex: 1}}></ScrollView>
  );
};

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  useEffect(() => StatusBar.setBarStyle('light-content'), []);

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Tabs" component={TabsScreen} />
      <Stack.Screen
        name="Item"
        component={ItemScreen}
        options={{
          presentation: 'formSheet',
          headerTitle: 'Item',
          headerBlurEffect: 'regular',
        }}
      />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{
          presentation: 'formSheet',
          headerShown: true,
          headerTitle: 'Search',
          headerTransparent: true,
          headerBlurEffect: 'regular',
        }}
      />
    </Stack.Navigator>
  );
};

export default App;
