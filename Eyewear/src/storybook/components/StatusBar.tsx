import React from 'react';
import {StatusBar as ReactStatusBar} from 'react-native';

import {Props} from './types';
import getStyle from '../shorthandhelper';

const StatusBar = ({style, className, ...rest}: Props) => {
  const {customStyle} = getStyle(className);

  const barStyle = {
    ...customStyle,
    ...style,
  };

  return <ReactStatusBar barStyle={barStyle} {...rest} />;
};

export default StatusBar;
