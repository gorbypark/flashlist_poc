import React, {useRef, useEffect, useState, RefObject} from 'react';

import {View, Text, FlatList, Pressable} from 'react-native';

import {FlashList} from '@shopify/flash-list';

import {DATA} from '../components/List/DATA';

import {useSafeAreaInsets} from 'react-native-safe-area-context';

type DATAT = {
  title: string;
  isHeader?: boolean;
};

type ListHeaderProps = {
  selectedIndex: number;
  listRef: RefObject<FlashList<DATAT>>;
};

const ListHeader = ({selectedIndex, listRef}: ListHeaderProps) => {
  const headerRef = useRef<FlatList>(null);

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const {top} = useSafeAreaInsets();

  // const listInteractionTypeRef = useRef<'click' | 'scroll' | null>(null);

  useEffect(() => console.log('header render'));

  useEffect(() => {
    setCurrentIndex(selectedIndex);
  }, [selectedIndex]);

  // useEffect(() => {
  //   headerRef.current?.scrollToIndex({
  //     index: currentIndex,
  //     animated: true,
  //   });
  // }, [currentIndex]);

  return (
    <View
      style={{
        height: top + 30,
        backgroundColor: 'orange',
        paddingTop: top,
      }}>
      <FlatList
        ref={headerRef}
        horizontal
        data={DATA}
        renderItem={({item, index}) => {
          if (item.isHeader) {
            return (
              <Pressable
                style={{
                  borderBottomWidth: index === currentIndex ? 3 : 0,
                  marginHorizontal: 10,
                }}
                onPress={() => {
                  // Sets the interaction type to click.  Logic in the flash list will now ignore sticky header
                  // render eventsand the category header will be set here instead of via sticky header render events
                  // listInteractionTypeRef.current = 'click';
                  // selectedIndex = index;

                  // This gets the sticky headers Y value so we can scroll to that offset + 1 so the sticky header is activated
                  //  If scrollToIndex is used, sticky isn't activated until flash list scrolled by 1 px.

                  setCurrentIndex(index);

                  const positionY =
                    listRef?.current?.recyclerlistview_unsafe?.getLayout(index)
                      ?.y || 0;

                  // Scroll to the offset of the sticky header + 1
                  listRef.current?.scrollToOffset({
                    offset: positionY + 1,
                    animated: true,
                  });

                  // Scroll the category header
                  // headerRef.current?.scrollToIndex({
                  //   index: index,
                  //   animated: true,
                  // });
                }}>
                <Text
                  style={{
                    fontWeight: index === currentIndex ? '900' : '400',
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
  );
};

export default ListHeader;
