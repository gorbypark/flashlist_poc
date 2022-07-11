import React, {useRef, useState, useEffect, useMemo} from 'react';

import {
  View,
  FlatList,
  Pressable,
  Text,
  PlatformColor,
  useWindowDimensions,
} from 'react-native';

import {FlashList} from '@shopify/flash-list';

import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {useScrollToTop, useNavigation} from '@react-navigation/native';

import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';

import ListItem from './ListItem';

import Icon from 'react-native-vector-icons/Ionicons';

import SegmentedControl from '@react-native-segmented-control/segmented-control';

type DataType = {
  title: string;
  isHeader?: boolean;
};

import {DATA} from './DATA';

const List = () => {
  const listRef = useRef<FlashList<DataType>>(null);
  const headerRef = useRef<FlatList>(null);
  const listInteractionType = useRef<'click' | 'scroll'>('scroll');

  const [selectedHeaderIndex, setSelectedHeaderIndex] = useState<number>(0);
  const [numOfCols, setNumOfCols] = useState<number>(1);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const {top} = useSafeAreaInsets();
  const bottomTabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation();
  const {height} = useWindowDimensions();

  // Hook from react-navigation that scrolls to top of list when an already selected tab is pressed again.
  // The any type is because listRef is a FlashList type but react-navigation internally expects a
  // type (ScrollableWrapper) that isn't even exported from the package.  Since FlashList has the same
  // scrollToTop method, "it just works" when we force typescript not to complain.
  useScrollToTop(listRef as any);

  // Finds all items that are headers, returns array of indexes
  const findHeaders = useMemo(() => {
    return DATA.map((item, index) => {
      if (item.isHeader) {
        return index;
      } else {
        return null;
      }
    }).filter(item => item !== null) as number[];
  }, [DATA]);

  // Finds all first items in a category, returns array of indexes
  const findFirstItems = useMemo(() => {
    return DATA.map((item, index) => {
      if (item.isHeader) {
        return index + 1;
      } else {
        return null;
      }
    }).filter(item => item !== null) as number[];
  }, [DATA]);

  // Finds all last items in a category, returns array of indexes
  const findLastItems = useMemo(() => {
    return DATA.map((item, index) => {
      if (item.isHeader) {
        if (index - 1 >= 0) {
          // return index -1 except if it's the first header
          return index - 1;
        } else {
          return null;
        }
      } else if (index === DATA.length - 1 && !item.isHeader) {
        // return the last element as long as it's not a header (empty category, I guess?)
        return index;
      } else {
        return null;
      }
    }).filter(item => item !== null) as number[];
  }, [DATA]);

  // Work-around for weird behavior in FlashList where changing numOfCols causes list to jump to index 0
  // and hiding the header.  setTimeout so it doesn't happen until the next cycle.  requestAnimationFrame()
  // did not work.
  useEffect(() => {
    setTimeout(() =>
      listRef?.current?.scrollToOffset({offset: 0, animated: false}),
    );
  }, [numOfCols]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 3000);
  };

  return (
    <>
      <View
        style={{
          backgroundColor: PlatformColor('systemBackground'),
          paddingTop: top,
          flexDirection: 'row',
          marginBottom: 20,
        }}>
        <Pressable
          onPress={() => navigation.navigate('Search' as any)}
          hitSlop={20}
          style={{width: 20, marginRight: 20, paddingTop: 1, marginLeft: 20}}>
          <Icon name="ios-search" size={24} color={PlatformColor('label')} />
        </Pressable>
        <FlatList
          ref={headerRef}
          horizontal
          data={DATA}
          contentContainerStyle={{paddingBottom: 8}}
          renderItem={({item, index}) => {
            if (item.isHeader) {
              return (
                <Pressable
                  hitSlop={10}
                  style={{
                    borderBottomColor: PlatformColor('systemGreen'),
                    borderBottomWidth: index === selectedHeaderIndex ? 2 : 0,
                    marginRight: 20,
                  }}
                  onPress={() => {
                    // Sets the interaction type to click.  Logic in the FlashList will now ignore sticky header
                    // render events and the category header will be set here instead of via sticky header render events
                    listInteractionType.current = 'click';
                    setSelectedHeaderIndex(index);

                    listRef.current?.scrollToIndex({
                      index: index,
                      animated: true,
                    });

                    // Scroll the category header
                    headerRef.current?.scrollToIndex({
                      index: index,
                      animated: true,
                    });
                  }}>
                  <Text
                    style={{
                      color: PlatformColor('label'),
                      fontWeight: '500',
                      fontSize: 16,
                    }}>
                    {item.title}
                  </Text>
                </Pressable>
              );
            } else {
              return null;
            }
          }}
        />
      </View>
      <View style={{flex: 1, overflow: 'hidden', paddingLeft: 20}}>
        <FlashList
          ref={listRef}
          onRefresh={() => handleRefresh()}
          refreshing={refreshing}
          extraData={numOfCols}
          numColumns={numOfCols + 1}
          contentContainerStyle={{
            paddingBottom: bottomTabBarHeight,
          }}
          data={DATA}
          ListHeaderComponent={() => (
            <View style={{flexDirection: 'row', marginRight: 20}}>
              <View style={{flex: 1}}></View>
              <View style={{width: 80}}>
                <SegmentedControl
                  values={['List', 'Grid']}
                  // @ts-expect-error
                  tintColor={PlatformColor('systemGreen')}
                  activeFontStyle={{color: 'black'}}
                  selectedIndex={numOfCols}
                  onChange={event => {
                    setNumOfCols(event.nativeEvent.selectedSegmentIndex);
                  }}
                />
              </View>
            </View>
          )}
          onScrollBeginDrag={() => {
            // Set the interaction type to scroll so that sticky header render events trigger the header list to scroll/update
            listInteractionType.current = 'scroll';
          }}
          renderItem={({item, index, target}) => {
            return (
              <ListItem
                title={item.title}
                isHeader={item.isHeader || false}
                index={index}
                onRenderCallback={() => {
                  // Only listen for StickyHeader target events and only when interaction type is 'scroll'
                  if (
                    target === 'StickyHeader' &&
                    listInteractionType.current === 'scroll'
                  ) {
                    setSelectedHeaderIndex(index);
                    headerRef?.current?.scrollToIndex({
                      animated: true,
                      index: index,
                    });
                  }
                }}
              />
            );
          }}
          estimatedItemSize={height / 7}
          stickyHeaderIndices={findHeaders}
          overrideItemLayout={(layout, item) => {
            // Make headers span both columns
            if (item.isHeader) {
              layout.span = numOfCols + 1;
            }
          }}
        />
      </View>
    </>
  );
};

export default List;
