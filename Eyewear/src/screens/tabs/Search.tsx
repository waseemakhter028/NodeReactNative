import React from 'react';
import {StyleSheet} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import Header from '../../components/Header';
import Colors from '../../constants/Colors';
import {wp} from '../../helpers/responsive';
import {View} from '../../storybook';

const Search = () => {
  return (
    <LinearGradient
      colors={[Colors.botLinearOne, Colors.botLinearTwo]}
      style={styles.container}>
      {/* header section */}
      <View className="rspaddingTop-h-2">
        <Header />
      </View>
      {/* product list */}
    </LinearGradient>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
});
