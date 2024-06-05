import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native';

import {useContext} from '../context/ToastContext';
import axios from '../helpers/axios';
import {Text, TouchableOpacity, View} from '../storybook';
import {CategoriesCompProps, CategoriesProps} from '../types';

const Categories = ({filterProductByCategory}: CategoriesCompProps) => {
  const {Toast} = useContext();
  const [selected, setSelected] = useState('All');
  const [data, setData] = useState<CategoriesProps[]>([]);

  const fetchCategories = async () => {
    try {
      const info = await axios.get('/category');
      const res = info.data;
      if (res.success === true) {
        const allCates = res.data;
        allCates.unshift({
          name: 'All',
          id: '6162e52c2df235900000000',
        });
        setData(allCates);
      } else {
        Toast('danger', 'Error !', res.message);
      }
    } catch (e: any) {
      Toast('warning', 'Warning !', e.message);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <View>
      <FlatList
        horizontal
        data={data}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() => {
                setSelected(item.name);
                const category = item.name !== 'All' ? [item.id] : [];
                filterProductByCategory(1, category, true);
              }}
              key={item.id}>
              <Text
                className={`rsfontSize-f-1.8 rsborderRadius-w-2.5 rspaddingHorizontal-w-5.2 rspaddingVertical-h-1.2 rsmarginHorizontal-w-2.5 ${
                  selected === item.name
                    ? 'bg-cprimaryDark text-white'
                    : 'bg-catBgColor text-catColor'
                } rsfontWeight-900`}>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default Categories;
