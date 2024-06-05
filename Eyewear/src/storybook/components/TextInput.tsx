import React from 'react';
import {TextInput as ReactTextInput} from 'react-native';

import {Props} from './types';
import getStyle from '../shorthandhelper';

const TextInput = ({style, className, ...rest}: Props) => {
  const {tailWindClassName, customStyle} = getStyle(className);

  return (
    <ReactTextInput
      className={tailWindClassName}
      style={[customStyle, style]}
      {...rest}
    />
  );
};

export default TextInput;
