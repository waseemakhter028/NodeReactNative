import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Dimensions, StyleSheet} from 'react-native';

import {useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import RNFS from 'react-native-fs';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import LinearGradient from 'react-native-linear-gradient';
import Pdf from 'react-native-pdf';
import Feather from 'react-native-vector-icons/Feather';

import Header from '../components/Header';
import Loader from '../components/Loader';
import Colors from '../constants/Colors';
import {useContext} from '../context/ToastContext';
import genterateInvoiceHtml from '../helpers/invoicesHtml';
import {fp, wp} from '../helpers/responsive';
import useAxios from '../hooks/useAxios';
import {Pressable, Text, View} from '../storybook';
import {DisplayPdfProps, RouteProps} from '../types';

const DisplayOrderPdf = () => {
  const {Toast} = useContext();
  const {t} = useTranslation();
  const route: RouteProps = useRoute();
  const {axiosCall} = useAxios();
  const product = route.params.item;
  const [loading, setLoading] = useState<boolean>(true);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [pdfInfo, setPdfInfo] = useState<DisplayPdfProps>({
    fileName: '',
    base64: '',
    filePath: '',
  });

  const generatePDF = async () => {
    try {
      const {data, error} = await axiosCall(
        'orderinvoiceinfo?order_id=' + product.id,
      );
      const res = data;
      if (error) {
        Toast('warning', t('common.warning'), error.message);
      } else if (!error) {
        if (res.success === true) {
          const html = genterateInvoiceHtml(res.data);

          const fileName =
            product.order_id +
            '_' +
            Math.floor(Math.random() * 100000 + 999999);
          const options = {
            html,
            fileName: fileName,
            directory: 'Downloads',
            base64: true,
          };
          const file = await RNHTMLtoPDF.convert(options);
          if (file.filePath !== undefined && file.base64) {
            setPdfInfo({
              fileName: fileName,
              base64: file.base64,
              filePath: file.filePath,
            });
          }
        } else {
          Toast('danger', t('common.error'), res.message);
        }
      }
    } catch (error: any) {
      Toast('danger', t('common.error'), error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    setDownloading(true);
    setTimeout(() => {
      const filePath = RNFS.DownloadDirectoryPath + `/${pdfInfo.fileName}.pdf`;
      RNFS.writeFile(filePath, pdfInfo.base64, 'base64')
        .then(() => {
          Toast('success', t('common.success'), t('order.res.pdf'), 4000);
          setDownloading(false);
        })
        .catch(() => {
          Toast('danger', t('common.error'), t('order.res.error'));
          setDownloading(false);
        });
    }, 1000);
  };

  useEffect(() => {
    generatePDF();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      <LinearGradient
        colors={[Colors.botLinearOne, Colors.botLinearTwo]}
        style={styles.container}>
        {/* header section */}
        <View className="rspaddingTop-h-2">
          <Header isBack={true} />
        </View>
        {/* content */}
        <View className="rspaddingTop-h-3 rspaddingBottom-h-2">
          {!downloading ? (
            <Pressable
              className="rsheight-w-12 rswidth-w-12 rsborderRadius-w-6 bg-cprimaryDark justify-center items-center"
              onPress={downloadPDF}>
              <Text className="rsfontSize-f-2.5 rsfontWeight-500 text-white">
                <Feather name="download" size={fp(2.5)} color={Colors.white} />
              </Text>
            </Pressable>
          ) : (
            <Pressable className="rsheight-w-12 rswidth-w-12 rsborderRadius-w-6 bg-cinputBg justify-center items-center">
              <Text className="rsfontSize-f-2.5 rsfontWeight-500 text-cprimaryDark">
                <ActivityIndicator size="small" color={Colors.cprimaryDark} />
              </Text>
            </Pressable>
          )}
        </View>
      </LinearGradient>
      {/* Pdf View */}
      <View className="flex-1 justify-start items-center">
        <Pdf
          trustAllCerts={false}
          source={{
            uri: `data:application/pdf;base64,${pdfInfo.base64}`,
          }}
          style={styles.pdf}
        />
      </View>
    </React.Fragment>
  );
};

export default DisplayOrderPdf;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    paddingHorizontal: wp(4),
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
