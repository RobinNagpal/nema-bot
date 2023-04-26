import 'styles/global.scss';
import { NotificationProvider, useNotificationContext } from 'contexts/NotificationContext';
import Notification from 'components/core/notify/Notification';

import type { AppProps } from 'next/app';
import { FpjsProvider } from '@fingerprintjs/fingerprintjs-pro-react';
import { configureAbly } from '@ably-labs/react-hooks';
import { ApolloProvider } from '@apollo/client';
import client from '../lib/apolloClient';

const prefix = process.env.API_ROOT || '';

const clientId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

configureAbly({
  authUrl: `${prefix}/api/createTokenRequest?clientId=${clientId}`,
  clientId: clientId,
});

const fpjsPublicApiKey = process.env.FINGERPRINT as string;

const NotificationWrapper = () => {
  const { notification } = useNotificationContext();

  if (!notification) return null;

  const key = `${notification.heading}_${notification.type}_${notification.duration}_${Date.now()}`;

  return <Notification key={key} type={notification.type} duration={notification.duration} heading={notification.heading} details={notification.details} />;
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <NotificationProvider>
        <FpjsProvider
          loadOptions={{
            apiKey: fpjsPublicApiKey,
          }}
        >
          <Component {...pageProps} />
        </FpjsProvider>
        <NotificationWrapper />
      </NotificationProvider>
    </ApolloProvider>
  );
}
