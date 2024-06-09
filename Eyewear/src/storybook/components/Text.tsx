import React from 'react';
import {Text as ReactText, StyleSheet} from 'react-native';

import {Props} from './types';
import getStyle from '../shorthandhelper';

const Text = ({children, style, className, ...rest}: Props) => {
  const {tailWindClassName, customStyle} = getStyle(className);
  return (
    <ReactText
      className={tailWindClassName}
      style={[customStyle, style, styles.text]}
      {...rest}>
      {children}
    </ReactText>
  );
};

export default Text;

const styles = StyleSheet.create({
  text: {fontFamily: 'Rubik-Medium'},
});
