import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAddress, ConnectWallet } from "@thirdweb-dev/react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk/evm";
import AuctionListings from "../Common/AuctionListingsMain";


const BannerArea = () => {
  //counter calculation
  const [days, setDays] = useState('');
   const walletaAddress = useAddress();
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
 
  const comingSoonTime = () => {
    let endTime = new Date('August 23, 2022 17:00:00 PDT');
    let endTimeParse = Date.parse(endTime) / 1000;
    let now = new Date();
    let nowParse = Date.parse(now) / 1000;
    let timeLeft = endTimeParse - nowParse;
    let countdays = Math.floor(timeLeft / 86400);
    let counthours = Math.floor((timeLeft - countdays * 86400) / 3600);
    let countminutes = Math.floor(
      (timeLeft - countdays * 86400 - counthours * 3600) / 60
    );
    let countseconds = Math.floor(
      timeLeft - countdays * 86400 - counthours * 3600 - countminutes * 60
    );
    if (counthours < '10') {
      counthours = '0' + counthours;
    }
    if (countminutes < '10') {
      countminutes = '0' + countminutes;
    }
    if (countseconds < '10') {
      countseconds = '0' + countseconds;
    }

    setDays(countdays);
    setHours(counthours);
    setMinutes(countminutes);
    setSeconds(countseconds);
  };

  useEffect(() => {
    setInterval(() => {
      comingSoonTime();
    }, 1000);
  }, []);


  
  const [marketplaceContract, setMarketplaceContract] = useState();
  const [AuctionListing, setAuctionListing] = useState();
  const sdk = new ThirdwebSDK("mumbai", {
    clientId: process.env.thirdweb_CLIENTID,
  });

  useEffect(async () => {
    setMarketplaceContract(
      await sdk.getContract(process.env.Marketplace_Contract)
    );
  }, []);
  useEffect(async () => {
    console.log(marketplaceContract);
    if (marketplaceContract) {
      try {
        setAuctionListing(
          await marketplaceContract.englishAuctions.getAllValid()
        );
      } catch (err) {
        console.log(err);
      }
    }
  }, [marketplaceContract]);







  return (
    <>
      <div className="banner-area">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="banner-content">
                <p className="h1 text-danger fw-bold">
                  Reshape Real Estate Selling
                </p>

                <ul style={{ color: "whitesmoke" }} className="h3">
                  <li>Use Smart contracts for real estate auctions</li>
                  <li>Reduce the influence of intermediaries</li>
                  <li>Avoid delays in real estate transactions</li>
                  <li>Sell real estate within hours not months</li>
                </ul>
                <p className="mt-5">
                  Introducing Brokereum, the game-changing platform with
                  tamper-proof smart contracts. Make buying and selling property
                  faster, more efficient, and more secure.
                </p>
                <p>
                  Benefit from fair price discovery with heavily reduced
                  transaction costs.
                </p>
                <div
                  className=""
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Link href="/about">
                    <a className="default-btn border-radius-5">Explore More</a>
                  </Link>
                  {!walletaAddress ? (
                    <>
                      <a
                        style={{
                          marginLeft: "20px",
                          marginTop: "0px",
                        }}
                        className=""
                      >
                        <ConnectWallet
                          theme="dark"
                          style={{ padding: "15px 15px 15px 15px" }}
                          btnTitle="Login"
                        />
                      </a>
                    </>
                  ) : (
                    <a
                      className="default-btn two border-radius-5"
                      style={{ marginLeft: "20px", cursor: "pointer" }}
                    >
                      Connected Successfully
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="banner-card-area">
                <div className="d-flex flex-lg-row flex-column justify-content-center">
                  {AuctionListing &&
                    AuctionListing.map((data, index) =>
                      index < 2 ? (
                        <AuctionListings data={data} key={index} />
                      ) : null
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="banner-shape">
          <div className="shape-circle1">
            <img src="../images/home-one/circle1.png" alt="Images" />
          </div>

          <div className="shape-circle2">
            <img src="../images/home-one/circle2.png" alt="Images" />
          </div>

          <div className="shape-bg">
            <img src="../images/home-one/bg-shape.png" alt="Images" />
          </div>
        </div>
      </div>
    </>
  );
};

export default BannerArea;
