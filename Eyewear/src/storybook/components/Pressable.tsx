import React from 'react';
import {Pressable as ReactPressable} from 'react-native';

import {Props} from './types';
import getStyle from '../shorthandhelper';

const Pressable = ({children, style, className, ...rest}: Props) => {
  const {tailWindClassName, customStyle} = getStyle(className);
  return (
    <ReactPressable
      className={tailWindClassName}
      style={[customStyle, style]}
      {...rest}>
      {children}
    </ReactPressable>
  );
};

export default Pressable;
