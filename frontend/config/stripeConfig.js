// stripeConfig.js

import { StripeProvider } from '@stripe/stripe-react-native';

const publishableKey = 'pk_live_51PTOawJdOeTJY9u5Wcy1w8zHrLoV1Vl61U6J5IyIldZGPReM6ioGmdfM7HHtN32hHHPlsZ7usnjjHDLRWU1xx3aY00mSJZnpHl';
//const publishableKeyTest = 'pk_test_51PTOawJdOeTJY9u5fHQOCXcZHLTHKmvjQ7Hc23MbHOq1YgfRIWF5HlCBx9vKResKyViYcGJGp2K2Gudj6evpflXq004q5HusZT'
export const stripeConfig = {
  publishableKey,
};

export const StripeWrapper = ({ children }) => (
  <StripeProvider publishableKey={publishableKey}>
    {children}
  </StripeProvider>
);
