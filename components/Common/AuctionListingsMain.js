import React, {useState, useEffect} from 'react'
import Link from 'next/link';
import moment from "moment";
import Countdown from "react-countdown";
import { ThirdwebSDK } from "@thirdweb-dev/sdk/evm";
import { Web3Button, useSigner, useAddress } from "@thirdweb-dev/react";
import { Mumbai } from "@thirdweb-dev/chains";

const AuctionListings = ({ data }) => {
  //  const signer = useSigner();
  console.log(data)
  const [Bidders,setBidders] = useState()
  const [OwnerData,setOWnerData] = useState()
  const [MinimumBidVal, setMinimumBidVal] = useState();
  const [WinningBid, setWinningBid] = useState();
  const [marketplaceContract , setMarketplaceContract] = useState()
   const fetchOWnerInfo = () => {
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
      
      
      useEffect(async() => {
        console.log(data)
        fetchOWnerInfo()
        fetchBidder()
        const sdk = new ThirdwebSDK("mumbai", {
          clientId: process.env.thirdweb_CLIENTID,
        });
        setMarketplaceContract(
          await sdk.getContract(process.env.Marketplace_Contract)
          )
        }, [data])
  
  useEffect(async () => {
    if (marketplaceContract && data) {
      // console.log(data.id);
     const minimum = await marketplaceContract.englishAuctions.getMinimumNextBid(data?.id)
      // console.log(minimum)
       setMinimumBidVal(minimum)
      setWinningBid(
        await marketplaceContract.englishAuctions.getWinningBid(data?.id)
      );
    }
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
    const interval = setInterval(() => {
      comingSoonTime();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div style={{marginRight:"20px"}} className="col-lg-6 col-md-6 col-12">
      <div className="featured-item">
        <div className="featured-item-img d-flex justify-content-center align-items-center">
          <a>
            <img src={data.asset.image} alt="Images" />
          </a>

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
            <button type="button" className="default-btn border-radius-5">
              Place Bid
            </button>
          </Link>
          <div className="featured-item-clock" data-countdown="2021/09/09">
            {days} : {hours} : {minutes} : {seconds}
          </div>
        </div>

        <div className="content">
          <h3>
            <a>{data.asset.name}</a>
          </h3>
          <div className="content-in">
            <span>
              {data.buyoutCurrencyValue.displayValue}{" "}
              {data.buyoutCurrencyValue.symbol}
            </span>
            <h4>
              Bid {MinimumBidVal?.displayValue}{" "}
              {data.minimumBidCurrencyValue.symbol}
            </h4>
          </div>
          <div className="featured-content-list">
            <ul>
              {Bidders && (
                <>
                  {Bidders.map((data, index) => (
                    
                      index<3?
                    <li>
                      <img
                        src={`${process.env.STRAPI_URL_PROD}${data.attributes?.userInfo?.data?.profilePicHash}`}
                        alt="Images"
                      />
                    </li>
                    
                    :null
                  ))}
                  {Bidders.length == 0 ?
                  <li>
                    <img
                      src="../images/featured/featured-user2.jpg"
                      alt="Images"
                    />
                  </li> : null
                  }
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
