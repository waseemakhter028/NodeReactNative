import React from 'react';
import {ImageBackground as ReactImageBackground} from 'react-native';

import {Props} from './types';
import getStyle from '../shorthandhelper';

const ImageBackground = ({children, style, className, ...rest}: Props) => {
  const {tailWindClassName, customStyle} = getStyle(className);
  return (
    <ReactImageBackground
      className={tailWindClassName}
      style={[customStyle, style]}
      {...rest}>
      {children}
    </ReactImageBackground>
  );
};

export default ImageBackground;
