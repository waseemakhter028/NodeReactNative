import {NativeEventSubscription} from 'react-native';

import {NavigationProp, ParamListBase} from '@react-navigation/native';

/*** Navigation Interfaces Start ***/

export interface ComponentNavigationProps {
  navigation: NavigationProp<ParamListBase>;
  navigate: (value: string) => void;
}

export interface NavigationProps {
  navigate: (value: string) => void;
  push: (value: string, data?: object) => void;
  openDrawer: () => void;
  goBack: () => void;
}

export interface BackHandlerProps extends NativeEventSubscription {
  removeEventListener?: (value: string) => void;
}
/*** Navigation Interfaces End ***/

/*** Common Props Start ***/
export interface Toast {
  Toast: (
    type?: string,
    title?: string,
    message?: string,
    timeout?: number,
  ) => void;
}
/*** Common Props End ***/

/*** Auth Interfaces Start ***/
export interface ForgotPassValidationProps {
  email: string;
}

export interface LoginValidationProps extends ForgotPassValidationProps {
  password: string;
  login_type: number;
}

export interface SignUpValidationProps extends LoginValidationProps {
  name: string;
}

export interface SignUpVerifyValidationProps extends ForgotPassValidationProps {
  otp: string[];
}
/*** Auth Interfaces End ***/

/*** Home Page Interfaces Start ***/
export interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  lastPage: number;
}

export interface HomeProductsProps {
  image: string;
  name: string;
  price: number;
  qty: number;
  id: string;
  reviewCount?: number;
  avgRating?: number;
}

export interface HomeRatingProps {
  price: string | null;
  categories: string[];
  rating: string[];
}
/*** Home Page Interfaces End ***/

/*** Product Detail Page Interfaces Start ***/
export interface RouteProps {
  key: string;
  name: string;
  params: Params;
}

export interface Params {
  item: ItemProps;
}

export interface ItemProps {
  id: string;
  image: string;
  name: string;
  price: number;
  qty: number;
  reviewCount?: number;
  avgRating?: number;
  order_id?: string;
}

export interface ExtraProps {
  top_information: string;
  reviewsCount: number;
  avg_rating: number;
  isCart: boolean;
}

export interface ReviewProps {
  rating: number;
  comment: string;
  name: string;
  image: string;
  created_at: Date;
}

export interface RelatedProductProps extends ItemProps {
  category: string;
}

export interface ProductProps {
  _id: string;
  image: string;
  name: string;
  price: number;
  category: string;
  information: string;
  qty: number;
  reviewCount?: number;
  avgRating?: number;
}
/*** Product Detail Page Interfaces End ***/

/*** Checkout Page Interfaces Start ***/
export interface CouponProps {
  title: string;
  code: string;
  description: string;
  amount: number;
  validity: string;
}

export interface CartProps {
  user_id: string;
  product_id: string;
  quantity: number;
  id: string;
  image: string;
  name: string;
  price: number;
}

export interface AddressProps {
  _id: string;
  user_id: string;
  address_type: string;
  street: string;
  address: string;
  city: string;
  state: string;
  zipcode: number;
  landmark: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  id: string;
}

export interface SelectedAddressProps {
  id: string;
  type: string;
}

export interface SelectedCouponProps {
  coupon: string;
  amount: number;
}

export interface UserProps {
  id: string;
  name: string;
  email: string;
  login_type: number;
  api_token: string;
  role: number;
  image: string;
  cartCount: number;
}

export interface RazorpayProps {
  description: string;
  image: string;
  currency: string;
  key: string;
  amount: number;
  name: string;
  prefill: {
    email: string;
    contact: string;
    name: string;
  };
  theme: {color: string};
}

export interface ProductItemProps {
  item: CartProps;
}
/*** Checkout Page Interfaces End ***/

/*** tabs Pages Interfaces Start ***/
export interface CartItemsProps {
  _id: string;
  user_id: string;
  product_id: ProductIdProps;
  quantity: number;
  size: string;
  color: string;
  id: string;
}

export interface ProductIdProps {
  _id: string;
  image: string;
  name: string;
  price: number;
}

export interface NotificationsPaginationProps {
  total: number;
  limit: number;
  lastPage: number;
  page: number;
  slNo: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prev: null | number;
  next: null | number;
}

export interface NotificationsProps {
  _id: string;
  user_id: string;
  title: string;
  body: string;
  read_at: Date;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface NotificationsIconProps {
  status: string;
}

export interface NotificationsCardProps {
  data: NotificationsProps;
}

export interface OrderProps {
  order_id: string;
  transaction_detail: OrderTransactionDetail;
  address_detail: OrderAddressDetail;
  notes: string;
  rated: number;
  delivery_charge: number;
  status: number;
  total: number;
  productOrders: OrderProductOrders;
  product: OrderProduct;
  id: string;
}

export interface OrderTransactionDetail {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  status: string;
  order_id: null | string;
  invoice_id: null | number | string;
  international: boolean;
  method: string;
  amount_refunded: number;
  refund_status: null | string;
  captured: boolean;
  description: string;
  card_id: string;
  card: OrderPaymentMethod;
  bank: null | string;
  wallet: null | string;
  vpa: null | number | string;
  email: string;
  contact: string;
  notes: null | string;
  fee: null | number;
  tax: null | number;
  error_code: any;
  error_description: any;
  error_source: any;
  error_step: any;
  error_reason: any;
  acquirer_data: OrderPaymentMethodAuthData;
  created_at: number;
}

export interface OrderPaymentMethod {
  id: string;
  entity: string;
  name: string;
  last4: string;
  network: string;
  type: string;
  issuer: string;
  international: boolean;
  emi: boolean;
  sub_type: string;
  token_iin: any;
}

export interface OrderPaymentMethodAuthData {
  auth_code: string;
}

export interface OrderAddressDetail {
  _id: string;
  user_id: string;
  address_type: string;
  street: string;
  address: string;
  city: string;
  state: string;
  zipcode: number;
  landmark: string;
  country: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface OrderProductOrders {
  price: number;
  quantity: number;
  size: string;
  color: string;
}

export interface OrderProduct {
  image: string;
  name: string;
}

export interface OrderPaginationProps {
  page: number;
  limit: number;
  total: number;
  lastPage: number;
}

export interface OrderCardProps {
  item: OrderProps;
}

export interface DisplayPdfProps {
  fileName: string;
  base64: string;
  filePath: string;
}

/*** tabs Pages Interfaces End ***/

/*** Dashboard Pages Interfaces Start ***/
export interface AddressCardProps {
  item: AddressProps;
  updateAddress: (item: AddressProps) => void;
  deleteAddress: (addressId: string) => void;
}

export interface AddAddressProps {
  address_type: string;
  street: string;
  address: string;
  landmark: string;
  city: string;
  state: string;
  zipcode: number | string;
}

export interface AddAddressCompProps {
  modalOpen: boolean;
  setModalOpen: (isModal: boolean) => void;
  selectedAddress: AddressProps | undefined;
  handleCheckout?: (addressInfo: AddressProps[]) => void;
}

export interface ContactUsProps {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface CouponProps {
  title: string;
  code: string;
  description: string;
  amount: number;
  validity: string;
}

export interface CouponCardProps {
  item: CouponProps;
}

export interface ProfilePhotoProps {
  assets: ProfilePhoto[];
}

export interface ProfilePhoto {
  fileName: string;
  fileSize: number;
  height: number;
  originalPath: string;
  type: string;
  uri: string;
  width: number;
}

export interface LanguageProps {
  name: string;
  code: string;
}
/*** Dashboard Pages Interfaces End ***/

/*** Common Pages Interfaces Start ***/
export interface ToastProps {
  success: {
    backgroundColor: string;
    icon: string;
  };
  danger: {
    backgroundColor: string;
    icon: string;
  };
  info: {
    backgroundColor: string;
    icon: string;
  };
  warning: {
    backgroundColor: string;
    icon: string;
  };
}

export interface ToastDataProps {
  showToast: boolean;
  type: string;
  title: string;
  message: string;
  timeoutToast: number;
}

export interface ProductInfoAndReviewProps {
  information: string;
  reviews: ReviewProps[];
}

export interface ProductReviewProps {
  data: ReviewProps;
}

export type ProductCardProps = {
  item: ItemProps;
  isLiked?: string[];
  setIsLiked?: (likes: string[]) => void;
  isHideLikeSection?: boolean;
};

export interface NotesModalProps extends Toast {
  modalOpen: boolean;
  setModalOpen: (isModal: boolean) => void;
  notes: string;
  setNotes: (note: string) => void;
}

export interface DeleteModalProps {
  modalOpen: boolean;
  setModalOpen: (isModal: boolean) => void;
  handleDelete: () => void;
  message: string;
}

export interface CouponModalProps {
  modalOpen: boolean;
  setModalOpen: (isModal: boolean) => void;
  selectedCoupon: (coupon: string, amount: number) => void;
  appliedCoupon: {
    coupon: string;
    amount: number;
  };
  coupons: CouponProps[];
}

export interface CouponModalCardProps {
  applyCoupon: (coupon_code: string, amount: number) => void;
  item: CouponProps;
  appliedCoupon: {
    coupon: string;
    amount: number;
  };
  selectedCoupon: (coupon: string, amount: number) => void;
}

export interface AddressModalProps {
  modalOpen: boolean;
  selectedAddress: (address_type: string, addressId: string) => void;
  address: AddressProps[];
}

export interface AddressModalCardProps {
  selectedAddress: (address_type: string, addressId: string) => void;
  item: AddressProps;
}

export interface CategoriesCompProps {
  filterProductByCategory: (
    pageNumber: number,
    categories: string[],
    reset: boolean,
  ) => Promise<void>;
}

export interface CategoriesProps {
  name: string;
  id: string;
}

export interface CardProps extends Toast {
  item: CartItemsProps;
  handleDelete: (id: string) => void;
  handleUpdate: (id: string, qty: number) => void;
}

export interface ProfileChangePasswordProps {
  current_password: string;
  new_password: string;
  confirm_password: string;
}
/*** Common Pages Interfaces End ***/
