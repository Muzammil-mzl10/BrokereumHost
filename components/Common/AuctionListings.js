import React, {useState, useEffect} from 'react'
import Link from 'next/link';
import moment from "moment";
import Countdown from "react-countdown";
import { ThirdwebSDK } from "@thirdweb-dev/sdk/evm";
import { Web3Button, useSigner, useAddress } from "@thirdweb-dev/react";
import { Mumbai } from "@thirdweb-dev/chains";

const AuctionListings = ({ data }) => {
  //  const signer = useSigner();
  // console.log(data)
  const [Bidders,setBidders] = useState()
  const [OwnerData,setOWnerData] = useState()
  const [MinimumBidVal, setMinimumBidVal] = useState();
  const [WinningBid, setWinningBid] = useState();
  const [marketplaceContract , setMarketplaceContract] = useState()
  const [ipfsData, setipfsData] = useState();
  const [satelittleImg, setSateliteImg] = useState()
  const [worldTopoImg, setWorldTopoImg] = useState();

   useEffect(() => {
     async function fetchIpfsData() {
       try {
         console.log(data?.asset.properties.IPFSHash);
         const response = await fetch(data?.asset.properties.IPFSHash);
         const ipfsData = await response.json();
         setipfsData(ipfsData.parcelData);
         console.log(ipfsData.parcelData);
         setSateliteImg(ipfsData.parcelData.image_urls.satellite_image);
         let parcelimg = ipfsData.parcelData.image_urls.parcel_image.replace(
           "<Your_Token_Here>",
           "DNfbHaqajFigz4jPX9B8vnatUduLKZXVwA83WKZG"
         );
         console.log(parcelimg);
         setWorldTopoImg(parcelimg);
         console.log(data);
       } catch (error) {
         console.log(error);
       }
     }

     fetchIpfsData();
   }, [data]);



  const fetchOwnerInfo = () => {
     fetch( `${process.env.STRAPI_URL_PROD}/api/brokereum-user/?filters[walletAddress][$eq]=${data.creatorAddress}`)
       .then((res) => res.json())
       .then((res) => {
         console.log(res?.data[0]?.attributes);
         setOWnerData(res.data[0].attributes);
       })
       .catch((err) => console.log(err));
  };
   const fetchBidder = () => {
     fetch(
       `${process.env.STRAPI_URL_PROD}/api/bidding/?filters[listingID][$eq]=${data?.id}`
     )
       .then((res) => res.json())
       .then((res) => {
         console.log(res);
         setBidders(res.data);
        })
        .then((err) => console.log(err));
      };
      
      
    useEffect(() => {
      async function fetchData() {
        console.log(data);
         fetchOwnerInfo();
         fetchBidder();
        const sdk = new ThirdwebSDK("mumbai", {
          clientId: process.env.thirdweb_CLIENTID,
        });
        setMarketplaceContract(
          await sdk.getContract(process.env.Marketplace_Contract)
        );
      }

      fetchData();
    }, [data]);

    useEffect(() => {
      async function fetchMinimumAndWinningBid() {
        if (marketplaceContract && data) {
          try {
            const minimum =
              await marketplaceContract.englishAuctions.getMinimumNextBid(
                data?.id
              );
            setMinimumBidVal(minimum);
            setWinningBid(
              await marketplaceContract.englishAuctions.getWinningBid(data?.id)
            );
          } catch (error) {
            console.error("Error fetching minimum and winning bid:", error);
          }
        }
      }

      fetchMinimumAndWinningBid();
    }, [marketplaceContract, data]);

 

  const Completionist = () => (
    <span className="text-danger">Time for Bidding is Over...!</span>
  );
  const [days, setDays] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");

  const endTimeInSeconds = data.endTimeInSeconds; // Set the endTimeInSeconds variable

  const comingSoonTime = () => {
    const now = Math.floor(Date.now() / 1000); // Convert milliseconds to seconds
    const timeLeft = endTimeInSeconds - now;

    if (timeLeft > 0) {
      const countdays = Math.floor(timeLeft / 86400);
      const counthours = Math.floor((timeLeft % 86400) / 3600);
      const countminutes = Math.floor((timeLeft % 3600) / 60);
      const countseconds = Math.floor(timeLeft % 60);

      setDays(countdays);
      setHours(counthours);
      setMinutes(countminutes);
      setSeconds(countseconds);
    } else {
      // Bidding is over
      setDays(0);
      setHours(0);
      setMinutes(0);
      setSeconds(0);
    }
  };

useEffect(() => {
  async function updateComingSoonTime() {
    comingSoonTime();
  }

  const interval = setInterval(updateComingSoonTime, 1000);

  return () => {
    clearInterval(interval);
  };
}, []);
  
    const [currencyExchangeRate, setCurrencyExchangeRate] = useState();

    useEffect(() => {
      fetchCurrencyRate();
    }, []);
    const fetchCurrencyRate = async () => {
      fetch(`https://api.coinbase.com/v2/exchange-rates?currency=matic`)
        .then((res) => res.json())
        .then((res) => {
          console.log(res.data.rates.CHF);
          setCurrencyExchangeRate(res.data.rates.CHF);
        });
    };
  



  return (
    <div className="col-lg-3 col-md-6">
      <div className="featured-item">
        <div className="featured-item-img">
          {/* <a>
            <img
              style={{ width: "100vw" }}
              src={data.asset.image}
              alt="Images"
            />
          </a> */}
          {satelittleImg && worldTopoImg && (
            <div >
              <div className='d-flex justify-content-center align-items-center'>
                <img
                  src={satelittleImg}
                  alt="Background"
                  style={{ position: "relative" }}
                  className="worktopoImg1"
                />
                <img
                  style={{ position: "absolute", zIndex:"1" }}
                  src={worldTopoImg}
                  alt="Overlay"
                  className="worktopoImg1"
                />
              </div>
            </div>
          )}

          <div className="featured-user">
            <a className="featured-user-option">
              <img
                src={`${process.env.STRAPI_URL_PROD}${OwnerData?.profilePicHash}`}
                alt="Images"
              />
              <span>Created by @{OwnerData?.firstName}</span>
            </a>
          </div>
          <Link href={`/AuctionListing/${data.id}`}>
            <button type="button" style={{zIndex:"100"}} className="default-btn border-radius-5">
              Place Bid
            </button>
          </Link>
          <div className="featured-item-clock" data-countdown="2021/09/09">
            {days} : {hours} : {minutes} : {seconds}
          </div>
        </div>

        <div className="content">
          <h3>
            <a>
              {data.asset.name.slice(0, 20)}{" "}
              {data.asset.name.length > 20 ? "___" : null}
            </a>
          </h3>
          <div className="content-in pb-0">
            {/* <span>
               {parseFloat(data.buyoutCurrencyValue.displayValue).toFixed(2)}{" "}
              {data.buyoutCurrencyValue.symbol}
            </span> */}
            <h3>
              Bid{" "}
              {(
                parseFloat(MinimumBidVal?.displayValue) * currencyExchangeRate
              ).toFixed(2)}{" "}
              CHF
            </h3>
          </div>
          <div className="featured-content-list">
            <ul>
              {Bidders && (
                <>
                  {Bidders.map((data, index) =>
                    index < 4 ? (
                      <li>
                        <img
                          src={`${process.env.STRAPI_URL_PROD}${data.attributes?.userInfo?.data?.profilePicHash}`}
                          alt="Images"
                        />
                      </li>
                    ) : null
                  )}
                  {Bidders.length == 0 ? (
                    <li>
                      <img
                        src="../images/featured/featured-user2.jpg"
                        alt="Images"
                      />
                    </li>
                  ) : null}
                </>
              )}
              <li className="title">{Bidders?.length}+ People Placed Bid</li>
            </ul>
            <p>
              <i className="ri-heart-line"></i> 122
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuctionListings
