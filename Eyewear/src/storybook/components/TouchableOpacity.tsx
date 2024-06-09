import React from 'react';
import {TouchableOpacity as ReactTouchableOpacity} from 'react-native';

import {Props} from './types';
import getStyle from '../shorthandhelper';

const TouchableOpacity = ({children, style, className, ...rest}: Props) => {
  const {tailWindClassName, customStyle} = getStyle(className);
  return (
    <ReactTouchableOpacity
      className={tailWindClassName}
      style={[customStyle, style]}
      {...rest}>
      {children}
    </ReactTouchableOpacity>
  );
};

export default TouchableOpacity;
