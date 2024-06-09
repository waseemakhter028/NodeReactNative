import React from 'react';
import {View as ReactView} from 'react-native';

import {Props} from './types';
import getStyle from '../shorthandhelper';

const View = ({children, style, className, ...rest}: Props) => {
  const {tailWindClassName, customStyle} = getStyle(className);

  return (
    <ReactView
      className={tailWindClassName}
      {...rest}
      style={[customStyle, style]}>
      {children}
    </ReactView>
  );
};

export default View;
