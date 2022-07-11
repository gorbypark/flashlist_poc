import React, {useEffect} from 'react';

import {
  View,
  Text,
  Pressable,
  useWindowDimensions,
  PlatformColor,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';

import Icon from 'react-native-vector-icons/Ionicons';

type ItemProps = {
  title: string;
  isHeader: boolean;
  index: any;
  onRenderCallback: () => void;
};

type HeaderProps = {
  title: string;
};

const Header = ({title}: HeaderProps) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'flex-start',
        marginBottom: 10,
        borderRadius: 0,
        backgroundColor: PlatformColor('systemBackground'),
        borderBottomColor: PlatformColor('separator'),
        borderBottomWidth: 1,
        marginRight: 20,
      }}>
      <Text
        style={{
          color: PlatformColor('label'),
          fontSize: 26,
          fontWeight: '500',
        }}>
        {title}
      </Text>
    </View>
  );
};

const ListItem = ({title, isHeader, index, onRenderCallback}: ItemProps) => {
  const {height} = useWindowDimensions();
  const navigation = useNavigation();

  useEffect(() => {
    onRenderCallback();
  }, [onRenderCallback]);

  if (isHeader) {
    return <Header title={title} />;
  } else {
    return (
      <Pressable
        onPress={() => navigation.navigate('Item' as any)}
        style={{
          flex: 1,
          height: height / 7,
          marginRight: 20,
          marginBottom: 30,
          borderRadius: 12,
          backgroundColor: PlatformColor('systemFill'),
        }}>
        <View style={{flexDirection: 'row', margin: 12}}>
          <View style={{flex: 1}}>
            <Text>{title}</Text>
            <Text>index: {index}</Text>
          </View>
          <View>
            <Icon
              name="ios-heart-outline"
              size={18}
              color={PlatformColor('systemGreen')}
            />
          </View>
        </View>
      </Pressable>
    );
  }
};

export default ListItem;
