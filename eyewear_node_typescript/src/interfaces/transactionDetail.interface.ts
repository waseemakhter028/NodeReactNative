export interface Root {
  transaction_detail: TransactionDetail;
}

export interface TransactionDetail {
  id?: string;
  entity?: string;
  amount?: number;
  currency?: string;
  status?: string;
  order_id?: any;
  invoice_id?: any;
  international?: boolean;
  method?: string;
  amount_refunded?: number;
  refund_status?: any;
  captured?: boolean;
  description?: string;
  card_id?: any;
  card?: Card;
  bank?: any;
  wallet?: any;
  vpa?: string;
  email?: string;
  contact?: string;
  notes?: any[];
  fee?: number | null;
  tax?: number | null;
  error_code?: string | null;
  error_description?: string | null;
  error_source?: string | null;
  error_step?: string | null;
  error_reason?: string | null;
  acquirer_data?: AcquirerData;
  created_at: number;
  upi: Upi;
}

export interface AcquirerData {
  rrn?: string;
  upi_transaction_id?: string;
  auth_code?: string;
}

export interface Upi {
  vpa?: string;
}

export interface Card {
  id?: string;
  entity?: string;
  name?: string;
  last4?: string;
  network?: string;
  type?: string;
  issuer?: string;
  international?: boolean;
  emi?: boolean;
  sub_type?: string;
  token_iin?: string | null;
}
