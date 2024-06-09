import React, {useEffect, useRef, useState} from 'react';
import {FlatList} from 'react-native';

import {ImageBackground, View} from '../storybook';

interface CarouselProps {
  id: number;
  uri: string;
}

const data: CarouselProps[] = [
  {
    id: 1,
    uri: require('../../assets/images/banner1.jpg'),
  },
  {
    id: 2,
    uri: require('../../assets/images/banner2.jpg'),
  },
  {
    id: 3,
    uri: require('../../assets/images/banner3.jpg'),
  },
  {
    id: 4,
    uri: require('../../assets/images/banner4.jpg'),
  },
  {
    id: 5,
    uri: require('../../assets/images/banner5.jpg'),
  },
];

interface ImageProps {
  uri: string;
  index: number;
}

const RenderImage = ({uri, index}: ImageProps) => {
  const currentIndex = index === 0 ? index + 1 : index;
  return (
    <View>
      <View className="rsheight-h-25 rswidth-w-120">
        <ImageBackground
          source={uri}
          className="rsheight-h-25 rswidth-w-100"
          resizeMode="contain">
          <View className="flex-row justify-center items-end rspaddingTop-h-20.5 rsgap-w-4">
            {[1, 2, 3, 4, 5].map(item => (
              <View
                key={item}
                className={`${
                  currentIndex === item ? 'bg-cprimaryDark' : 'bg-white'
                } rsheight-h-0.7 rswidth-w-6.5 rsborderRadius-w-2`}
              />
            ))}
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

const ImageCarousel = () => {
  const flatListRef = useRef<any>(null);
  const [index, setIndex] = useState<number>(0);
  const totalIndex = data.length;

  useEffect(() => {
    const imageCarousel = setInterval(() => {
      setIndex(index + 1);
      if (index < totalIndex) {
        flatListRef.current.scrollToIndex({animated: true, index: index});
      } else {
        flatListRef.current.scrollToIndex({animated: true, index: 0});
        setIndex(0);
      }
    }, 2000);
    return () => {
      clearInterval(imageCarousel);
    };
  }, [index, totalIndex]);

  return (
    <View>
      <FlatList
        ref={flatListRef}
        horizontal
        data={data}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => <RenderImage uri={item.uri} index={index} />}
        scrollEnabled={false}
      />
    </View>
  );
};

export default ImageCarousel;
