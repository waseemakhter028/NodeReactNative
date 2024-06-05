import {fp, hp, wp} from '../../helpers/responsive';

const resSize = (type: string, num: number) => {
  if (type === 'f') {
    return fp(num);
  } else if (type === 'h') {
    return hp(num);
  } else {
    return wp(num);
  }
};

const getStyle = (className = '') => {
  if (className !== '' && className !== null && className !== undefined) {
    const tailWind: string[] = [];
    const styles: any = [];

    const classNameArr = className.split(' ');

    for (let css of classNameArr) {
      if (css.startsWith('rs')) {
        styles.push(css);
      } else {
        tailWind.push(css);
      }
    }

    const reactNatieStyles: any = [];

    if (styles.length > 0) {
      styles.forEach((item: string) => {
        const cssData: any = item.split('-');
        const propertyName = cssData[0].replace('rs', '');
        let value = null;
        // pass property if string like red , center etc else
        if (cssData.length <= 2) {
          value = cssData[1];
        } else {
          //pass number if number like 10, 20 etc with responsive function
          value = resSize(cssData[1], Number(cssData[2]));
        }

        // getting property name and value
        reactNatieStyles.push({[propertyName]: value});
      });
    }

    return {
      tailWindClassName: tailWind.join(' '),
      customStyle: Object.assign({}, ...reactNatieStyles),
    };
  } else {
    return {
      tailWindClassName: '',
      customStyle: {},
    };
  }
};

export default getStyle;
