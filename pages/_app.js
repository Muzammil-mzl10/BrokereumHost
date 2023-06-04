import React, { useState, useEffect } from "react";
import "../public/fonts/remixicon.css";
import "../public/css/bootstrap.min.css";
import "../public/css/style.css";
import "../public/css/responsive.css";

import Head from "next/head";
import GoTop from "../components/Shared/GoTop";
import Loader from "../components/Shared/Loader";

import { ThirdwebProvider, coinbaseWallet, localWallet, metamaskWallet, safeWallet, smartWallet, walletConnect } from "@thirdweb-dev/react";
import { Gnosis } from "@thirdweb-dev/chains";


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
        supportedChainIDs={supportedChainIDs}
        connectors={connectors}
        sdkOptions={{
          gasless: {
            openzeppelin: {
              relayerUrl:
                "https://api.defender.openzeppelin.com/autotasks/ffa92450-68df-484c-8bac-e6dbd5a82fe4/runs/webhook/aaaabf92-6135-4d67-9a24-27dbf665f52e/Mw7FQsDb2VrwacKpoDwBz8",
            },
          },
        }}
        supportedWallets={[
          smartWallet({
            factoryAddress: "0x12553A94e9c1D60c04Cd24b45263c42d7d15d375",
            thirdwebApiKey:
              "ec47c8cd19d2bfc4ccdbcaf0edcac215e55415e2d810f15a291486c29be80811194b693406d96a7dec6dd5822b843c195b2f7096e27709802866536b17d1f639",
            gasless: true,
            personalWallets: [
              metamaskWallet(),
              localWallet(),
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
