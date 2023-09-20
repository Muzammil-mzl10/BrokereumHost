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

 useEffect(() => {
   async function fetchMarketplaceContract() {
     try {
       const contract = await sdk.getContract(process.env.Marketplace_Contract);
       setMarketplaceContract(contract);
     } catch (error) {
       console.error("Error fetching marketplace contract:", error);
     }
   }

   fetchMarketplaceContract();
 }, []);

 useEffect(() => {
   async function fetchAuctionListing() {
     if (marketplaceContract) {
       try {
         const auctionList =
           await marketplaceContract.englishAuctions.getAllValid();
         setAuctionListing(auctionList);
       } catch (error) {
         console.error("Error fetching auction listing:", error);
       }
     }
   }

   fetchAuctionListing();
 }, [marketplaceContract]);






  return (
    <div>
      <div className="banner-area-three">
        <div style={{ marginLeft: "3.5vw" }} className="container-fluid">
          <div className="row align-items-center">
            <div className="col-lg-6 mt-4">
              <div className="banner-content">
                <p className="h1 text-danger fw-bold">
                  Real Estate Selling Redefined
                </p>

                <ul class="benefitsText">
                  <li>Use Smart Contract based Auctions</li>
                  <li>Benefit from Fair Price Discovery</li>
                  <li>Sell Yourself Without Intermediaries</li>
                  <li>Transact within Hours not Months</li>
                </ul>

                <div
                  className=""
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Link legacyBehavior href="/about">
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
          </div>
        </div>

        {/* <div className="banner-shape"></div> */}
      </div>
      <div style={{ marginLeft: "3.5vw" }} className="container-fluid">
        <div
          style={{ fontWeight: "bold" }}
          className=" mt-4 text-danger bottom-section-text"
        >
          Benefits of Brokereum
        </div>
        <ul
          style={{ color: "gray", width: "80vw", fontWeight: "normal" }}
          className="h3 mt-2 benefitsText1"
        >
          <li>Experience how smart contracts revolutionize transactions</li>
          <li className="mt-lg-0 mt-md-0  mt-2">
            Make buying and selling real estate faster and more secure
          </li>
          <li className="mt-lg-0 mt-md-0  mt-2">
            Benefit from heavily reduced transaction costs
          </li>
          <li className="mt-lg-0 mt-md-0  mt-2">
            Retain full control over the sale of your property from A-Z
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BannerArea;
