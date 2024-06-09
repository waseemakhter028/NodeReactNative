import React, {useState} from 'react';
import {StyleSheet} from 'react-native';

import {useTranslation} from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';

import Header from '../../components/Header';
import Colors from '../../constants/Colors';
import {useContext} from '../../context/ToastContext';
import {rand, saveToAsyncStorage} from '../../helpers/common';
import {wp} from '../../helpers/responsive';
import {Text, TouchableOpacity, View} from '../../storybook';
import {LanguageProps} from '../../types';

const LanguageScreen = () => {
  const [languages] = useState<LanguageProps[]>([
    {
      name: 'English',
      code: 'en',
    },

    {
      name: 'Hindi',
      code: 'hi',
    },
  ]);
  const {Toast} = useContext();
  const {i18n} = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<string>(i18n.language);

  const saveChangedLanguage = async () => {
    i18n.changeLanguage(currentLanguage);
    await saveToAsyncStorage({
      language: currentLanguage,
    });
    Toast('success', 'Success !', 'Language Changed Successfully !', 2000);
  };

  return (
    <LinearGradient
      colors={[Colors.botLinearOne, Colors.botLinearTwo]}
      style={styles.container}>
      {/* header section */}
      <View className="rspaddingTop-h-2">
        <Header isFromDrawer={true} />
      </View>
      <View className="rspaddingTop-h-3">
        <Text className="rsfontSize-f-2.5 text-productTitle rsfontWeight-500 text-center">
          Change App Language
        </Text>
        {/* languages view */}
        <View className="items-center justify-center rsmarginTop-h-10">
          {languages.map(lang => (
            <View
              className="flex-row rsgap-w-3 rswidth-w-50 rsmarginTop-h-2"
              key={rand()}>
              <TouchableOpacity
                className={`rsheight-h-5.65 rswidth-h-5.65 rsborderRadius-h-2.82 items-center justify-center rsmarginHorizontal-w-1.22 ${
                  lang.code === currentLanguage &&
                  'rsborderColor-' + Colors.cprimaryDark
                } ${lang.code === currentLanguage && 'rsborderWidth-h-0.2'}`}
                onPress={() => setCurrentLanguage(lang.code)}>
                <View
                  className={`rsheight-h-4 rswidth-h-4 rsborderRadius-h-2 ${
                    lang.code === currentLanguage
                      ? 'bg-cprimaryDark'
                      : 'bg-cinputCol'
                  }`}
                />
              </TouchableOpacity>
              <Text className="rsfontSize-f-2.5 text-productTitle rsmarginTop-h-1">
                {lang.name}
              </Text>
            </View>
          ))}
          {/* change language  button */}

          <TouchableOpacity
            className="bg-cprimaryDark rounded-full  rsheight-h-5 rswidth-w-50 justify-center rsmarginTop-h-5"
            onPress={() => saveChangedLanguage()}>
            <Text className="text-center rsfontSize-f-2.5 font-bold text-white">
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default LanguageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
});
