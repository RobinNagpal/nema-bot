import 'styles/global.scss';

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

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <FpjsProvider
        loadOptions={{
          apiKey: fpjsPublicApiKey,
        }}
      >
        <Component {...pageProps} />
      </FpjsProvider>
    </ApolloProvider>
  );
}
