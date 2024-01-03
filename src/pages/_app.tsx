import '../../public/styles/globals.css';
import Layout from '@@/components/Layout';
import { ApolloProvider } from '@apollo/client'
import apolloClient from '../lib/apollo'
import type { AppProps } from 'next/app';
import { Toaster } from "react-hot-toast";


function MyApp({ Component, pageProps }:AppProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <Layout>
        <Toaster position={"top-right"} />
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  );
}

export default MyApp;
