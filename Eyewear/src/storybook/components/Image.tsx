import React from 'react';
import {Image as ReactImage} from 'react-native';

import {Props} from './types';
import getStyle from '../shorthandhelper';

const Image = ({style, className, ...rest}: Props) => {
  const {tailWindClassName, customStyle} = getStyle(className);

  return (
    <ReactImage
      className={tailWindClassName}
      style={[customStyle, style]}
      {...rest}
    />
  );
};

export default Image;
