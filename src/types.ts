export type MonnifyMode = "TEST" | "LIVE";

export interface MonnifyPaymentParams {
  apiKey: string; // Monnify public key
  contractCode: string;
  amount: number;
  currency?: string; // default NGN
  reference: string; // unique per attempt
  customerFullName: string;
  customerEmail: string;
  customerMobileNumber?: string;
  paymentDescription?: string;
  redirectUrl?: string; // for hosted success/failure pages
  metadata?: Record<string, any>;
  incomeSplitConfig?: any[]; // keep wide for now
  mode?: MonnifyMode; // default TEST
}

export interface MonnifyProps {
  visible: boolean;
  paymentParams: MonnifyPaymentParams;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
  onDismiss?: (data?: any) => void;
  /** Optional: style overrides for the internal WebView */
  customStyles?: {
    webViewContainer?: any;
  };
}
