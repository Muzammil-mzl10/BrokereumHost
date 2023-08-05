import React, { useState, useEffect } from "react";
import "../public/fonts/remixicon.css";
import "../public/css/bootstrap.min.css";
import "../public/css/style.css";
import "../public/css/responsive.css";

import Head from "next/head";
import GoTop from "../components/Shared/GoTop";
import Loader from "../components/Shared/Loader";

import { ThirdwebProvider, coinbaseWallet, localWallet, metamaskWallet, paperWallet,safeWallet, smartWallet,ChainId, walletConnect, useConnect } from "@thirdweb-dev/react";
import { Gnosis, Mumbai } from "@thirdweb-dev/chains";


const supportedChainIDs = [1,3,4,5];
const connectors = {
  injected: {},
};

function MyApp({ Component, pageProps }) {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setTimeout(() => setLoading(false), 2000);
	}, []);

	return (
    <>
      <Head>
        <title>Brokereum </title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <ThirdwebProvider
        clientId={process.env.thirdweb_CLIENTID}
        activeChain={"mumbai"}
        autoConnect={true}
        sdkOptions={{
          gasless: {
            openzeppelin: {
              relayerUrl:
                "https://api.defender.openzeppelin.com/autotasks/16d7ca5d-5132-4c3b-86bb-a381e37e9dc8/runs/webhook/aaaabf92-6135-4d67-9a24-27dbf665f52e/5uDQeW3qK6A51PAQoPTHxP",
            },
          },
        }}
        supportedWallets={[
          smartWallet({
            factoryAddress: process.env.factoryAddress,
            thirdwebApiKey: process.env.thirdwebApiKey,
            gasless: true,
            personalWallets: [
              metamaskWallet(),
              paperWallet({
                paperClientId: "2631fa89-19e6-4fb1-b2dc-49ff23ce0b1d",
              }),
              localWallet({ persist: true }),
              coinbaseWallet(),
              safeWallet(),
              walletConnect(),
            ],
          }),
        ]}
      >
        <Component {...pageProps} />
      </ThirdwebProvider>

      {/* Preloader */}
      <Loader loading={loading} />

      {/* go top */}
      <GoTop scrollStepInPx="100" delayInMs="10.50" />
    </>
  );
}

export default MyApp;
