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
        // supportedChainIDs={supportedChainIDs}
        // sdkOptions={{
        //   gasless: {
        //     openzeppelin: {
        //       relayerUrl:
        //         "https://api.defender.openzeppelin.com/autotasks/0d75d6f6-db48-4efe-8631-4e3e6f624598/runs/webhook/aaaabf92-6135-4d67-9a24-27dbf665f52e/2RSWaUL7oi7Pqhz6kXmJvd",
        //     },
        //     experimentalChainlessSupport: true,
        //   },
        // }}

        supportedWallets={[
          smartWallet({
            factoryAddress: "0x908b34d67E12ef5B9C5e8CBD5cD78fAe228EeD7B",
            gasless: true,
            thirdwebApiKey:
              "00769a973f738369c6fbb0e397abcb23c356ceb6a44d275aae296619eb945b47cd00d4caee7155485391e058c7210708f33d0814592ec6028ad2f92e6ae035e1",
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
