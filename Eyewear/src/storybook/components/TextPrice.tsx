import React from 'react';
import {Text as ReactText, StyleSheet} from 'react-native';

import {Props} from './types';
import getStyle from '../shorthandhelper';

const TextPrice = ({children, style, className, ...rest}: Props) => {
  const {tailWindClassName, customStyle} = getStyle(className);
  return (
    <ReactText
      className={tailWindClassName}
      style={[customStyle, style, styles.text]}
      {...rest}>
      &#8377;{children}
    </ReactText>
  );
};

export default TextPrice;

const styles = StyleSheet.create({
  text: {fontFamily: 'Rubik-Medium'},
});
