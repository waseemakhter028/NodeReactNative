import React from 'react';
import {ActivityIndicator, TouchableOpacity} from 'react-native';

import {Props} from './types';
import Colors from '../../constants/Colors';
import getStyle from '../shorthandhelper';

interface ButtonLoaderProps extends Props {
  loading: boolean;
}

const ButtonWithLoader = ({
  children,
  style,
  className,
  loading,
  ...rest
}: ButtonLoaderProps) => {
  const {tailWindClassName, customStyle} = getStyle(className);
  return loading ? (
    <TouchableOpacity
      className={`${tailWindClassName} bg-border items-center justify-center`}
      style={[customStyle, style]}
      disabled={true}>
      <ActivityIndicator size="large" color={Colors.cprimaryDark} />
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      className={tailWindClassName}
      style={[customStyle, style]}
      {...rest}>
      {children}
    </TouchableOpacity>
  );
};

export default ButtonWithLoader;
