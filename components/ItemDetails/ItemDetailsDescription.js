import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import Link from 'next/link'
import { setConfig } from 'next/config';
import { ThirdwebSDK } from "@thirdweb-dev/sdk/evm";
import { Web3Button, useSigner, useAddress } from '@thirdweb-dev/react';
import { Mumbai } from '@thirdweb-dev/chains';
import { ethers } from "ethers";
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const ItemDetailsDescription = ({ days, hours, minutes, seconds, data }) => {

  const [dateRange, setDateRange] = useState([null, null]);
  const [bidoutPrice,setBidOutPrice] = useState()
  
  const [startDate, endDate] = dateRange;
  const [formData, setFormData] = useState({
    listingType: "Auction",
    pricePerToken: "",
  });
  
  const handleChange = (e) => {
    console.log(e.target.name)
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
   function calculatePercent(totalAmount) {
     const returnedPercentage =
       (data?.asset.properties.downPayment / 100) * totalAmount;
       setBidOutPrice(returnedPercentage);
   }

  useEffect(() => {
    calculatePercent(formData.pricePerToken)
    console.log(bidoutPrice)

  },[formData])

  // ...

  const router = useRouter();
  const [bidAmount, setBidAmount] = useState()
  const [userData,setUserData] = useState()
  const [OwnerData,setOwnerData] = useState()
  const [bidErrorMessage, setBidErrorMessage] = useState(false)
  const [marketplaceModule, setMarketplaceModule] = useState();
  const [bidComplete, SetBidComplete] = useState(false)
  const [winningBid, setWinningBid]= useState()
  const [minimumBidVal, setMinimumBidVal] = useState()
  const [ipfsData, setipfsData] = useState();
  const signer = useSigner()
  const Address = useAddress()
  
 useEffect(() => {
   if (!Address) {
     router.push("/");
   }
 }, [Address, router]);


   useEffect(() => {
     async function fetchIpfsData() {
       try {
         console.log(data?.asset.properties.IPFSHash);
         const response = await fetch(data?.asset.properties.IPFSHash);
         const ipfsData = await response.json();
         setipfsData(ipfsData.parcelData);
         console.log(ipfsData.parcelData);
       } catch (error) {
         console.log(error);
       }
     }
     fetchIpfsData();
   }, [data]);



  //  const sdk = new ThirdwebSDK("mumbai");

   const fetchUserInfo = () => {
     if (Address) {
       fetch(`${process.env.STRAPI_URL_PROD}/api/brokereum-user/?filters[walletAddress][$eq]=${Address}`)
         .then((res) => res.json())
         .then((res) => {
           console.log(res?.data[0]?.attributes);
           if (res.data[0]) {
             setUserData(res.data[0].attributes);
           } else {
             router.push("/profile");
           }
         });
     }
   };
   const fetchOWnerInfo = () => {
       fetch(`${process.env.STRAPI_URL_PROD}/api/brokereum-user/?filters[walletAddress][$eq]=${data?.creatorAddress}`)
         .then((res) => res.json())
         .then((res) => {
           console.log(res?.data[0]?.attributes);
           setOwnerData(res.data[0]?.attributes);
         })
         .catch((err) => console.log(err));
   };

 useEffect(() => {
   async function fetchData() {
     if (Mumbai && ThirdwebSDK && signer) {
       try {
         const sdk = ThirdwebSDK.fromSigner(signer, Mumbai, {
           clientId: process.env.thirdweb_CLIENTID,
         });
         const marketplaceModule = await sdk.getContract(
           process.env.Marketplace_Contract
         );
         setMarketplaceModule(marketplaceModule);
       } catch (error) {
         console.log(error);
       }
     }
   }

   fetchData();
 }, [Mumbai, ThirdwebSDK, signer]);


  useEffect(() => {
    fetchUserInfo()
    fetchOWnerInfo()
   }, []);
  useEffect(() => {
    async function fetchData() {
      if (marketplaceModule && data) {
        try {
          console.log(userData);
          console.log(data.id);

          const minimumBid =
            await marketplaceModule.englishAuctions.getMinimumNextBid(data?.id);
          setMinimumBidVal(minimumBid);

          const winningBid =
            await marketplaceModule.englishAuctions.getWinningBid(data?.id);
          setWinningBid(winningBid);
        } catch (error) {
          console.log(error);
        }
      }
    }

    fetchData();
  }, [marketplaceModule, data]);

    
    // console.log(winningBid)
    // console.log(minimumBidVal)
 

  const placeBid = async (e) => {
    e.preventDefault()

    if (bidAmount >= parseFloat(minimumBidVal.displayValue)) {
      setBidErrorMessage(false);
      console.log(data.id);
      try {
        
        const tx = await marketplaceModule.englishAuctions.makeBid(
          data.id,
          bidAmount
        );

        console.log(tx.receipt);
        if (tx) {
          
          const enterBidData = JSON.stringify({
            data: {
             listingID: data.id,
             bidAmount: bidAmount,
             userInfo: {
               data: userData,
               address: Address,
             },
           },
          });
          
          const activityAdd = JSON.stringify({
            data: {
              Name: "Bid",
              address: Address,
              ListID: parseInt(data.id),
              imgHash: ipfsData.image_urls.satellite_image,
              Data: {
                data: tx.receipt,
              },
            },
          });

         axios
           .post(`${process.env.STRAPI_URL_PROD}/api/bidding`, enterBidData, {
             headers: {
               "Content-type": "application/json",
             },
           })
           .then((res) => {
             console.log("Successfully Uploaded...!!");
             console.log(res);
           })
           .catch((err) => {
             console.log(err);
           });
          
         axios
           .post(`${process.env.STRAPI_URL_PROD}/api/activities`, activityAdd, {
             headers: {
               "Content-type": "application/json",
             },
           })
           .then((res) => {
             console.log("Successfully Uploaded...!!");
             console.log(res);
           })
           .catch((err) => {
             console.log(err);
           });
        
           SetBidComplete(true);
               
           toast.success("Your Bid was Successfull....!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        } else {
           toast.error("🦄 Bid was not successfull", {
             position: "top-center",
             autoClose: 5000,
             hideProgressBar: false,
             closeOnClick: true,
             pauseOnHover: true,
             draggable: true,
             progress: undefined,
             theme: "light",
           });
      }
      } catch (err) {

        console.log(err);
        toast.error("🦄 Bid was not successfull", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } else {
      setBidErrorMessage(true);
      console.log("Error");
    }
  } 

  const updateListing = () => {
    console.log(formData)
    console.log(dateRange);
      const auction = {
        // address of the contract of the asset you want to auction
        assetContractAddress: process.env.ERC_Contract,
        // token ID of the asset you want to auction
        tokenId: data.id,
        // how many of the asset you want to auction
        quantity: 1,
        // address of the currency contract that will be used to pay for the auctioned tokens
        currencyContractAddress: NATIVE_TOKEN_ADDRESS,
        // the minimum bid that will be accepted for the token
        minimumBidAmount: finalbidamount,
        // how much people would have to bid to instantly buy the asset
        buyoutBidAmount: bidoutPrice,
        // If a bid is made less than these many seconds before expiration, the expiration time is increased by this.
        timeBufferInSeconds: "300", // 5 minutes by default
        // A bid must be at least this much bps greater than the current winning bid
        bidBufferBps: "500", // 5% by default
        // when should the auction open up for bidding
        startTimestamp: startDate,
        // end time of auction
        endTimestamp: endDate,
      };
      
    
    
  }
  
  
  return (
    <>
      <div className="section-title">
        <h2>{data?.asset.name}</h2>
        <p>{ipfsData?.address?.street}</p>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* <div className="row">
        <div className="col-lg-6 col-6">
          <div className="item-details-user">
            <h3>Creator</h3>
            <div className="content">
              <div className="images">
                <img
                  src="../images/Item-details/Item-details-user2.jpg"
                  alt="Images"
                />
                <i className="ri-check-line"></i>
              </div>

              <span>@Maxwell</span>
            </div>
          </div>
        </div>

        <div className="col-lg-6 col-6">
          <div className="item-details-user">
            <h3>Collection</h3>
            <div className="content">
              <div className="images">
                <img
                  src="../images/Item-details/Item-details-user1.jpg"
                  alt="Images"
                />
              </div>

              <span>Rose Gold</span>
            </div>
          </div>
        </div>
      </div> */}

      <div className="item-details-price">
        <div className="item-details-title">
          <h3>
            Current Price {winningBid?.bidAmountCurrencyValue?.displayValue}{" "}
            {winningBid?.bidAmountCurrencyValue?.symbol}
          </h3>
          {/* <p>$1200</p>
          <span>1/10</span> */}
        </div>
        <ul>
          <li>
            Size
            <b>: 3000 x 3000</b>
          </li>
          <li>
            Created
            <b>: 08 July, 2021</b>
          </li>
          <li>
            Collection
            <b>: Rose Gold</b>
          </li>
          <li>
            Category
            <b>: Artwork</b>
          </li>
        </ul>
      </div>

      <div className="item-details-user-item">
        <div className="images">
          <img
            src="../images/Item-details/Item-details-user4.jpg"
            alt="Images"
          />
          <i className="ri-check-line"></i>
        </div>

        <div className="content">
          <h3>
            {OwnerData?.firstName} {OwnerData?.lastName}
          </h3>
          <span>{OwnerData?.Email}</span>
        </div>
      </div>

      <div className="item-details-in-content">
        <div className="item-left">
          <span>Auction Ends In</span>
          <div className="timer-text" data-countdown="2021/11/11">
            {days}:{hours}:{minutes}:{seconds}
          </div>
        </div>
        <div className="item-right">
          <h3 className="item-remaining">Highest Bid</h3>
          <h3 className="item-right-eth">
            {winningBid?.bidAmountCurrencyValue?.displayValue}{" "}
            {winningBid?.bidAmountCurrencyValue?.symbol}
          </h3>
        </div>
      </div>
      <form onSubmit={placeBid}>
        {data?.creatorAddress == Address ? (
          <form onSubmit={updateListing}>
            <div className="item-details-btn">
              <h2 className='text-danger'> You are the Owner of the Property</h2>
              <div className="side-bar-widget">
                <label
                  style={{ fontSize: "30px", fontWeight: "bolder" }}
                  className="mt-2"
                >
                  Edit the Listing
                </label>
                <br />

              </div>
              <div className="col-lg-12 mb-4">
                <div className="form-group">
                  <label>Price of the Property</label>
                  <input
                    type="number"
                    value={formData.pricePerToken}
                    name="pricePerToken"
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-lg-12 mb-4">
                <div className="form-group">
                  <label>Big Out Amount will be: {bidoutPrice }</label>
                </div>
              </div>
              <div className="col-lg-12">
                <div className="">
                  <label>Listing for specific date</label>
                  <DatePicker
                    selectsRange={true}
                    startDate={startDate}
                    placeholderText="Select the Date Range"
                    endDate={endDate}
                    style={{ width: "inherit" }}
                    onChange={(update) => {
                      setDateRange(update);
                    }}
                    className="px-5 py-2 mb-4 text-center"
                    minDate={new Date()}
                    withPortal
                  />
                </div>
              </div>

              <button type="submit" style={{backgroundColor:"gray"}}  className="default-btn btn-info mb-2 border-radius-50">
                Update Listing
              </button>
              <button type="button" className="default-btn border-radius-50">
                Cancel Listing
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="col-lg-12 my-3">
              <div className="form-group">
                <label>Enter Bidding Amount</label>
                <input
                  type="float"
                  step="0.01"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder={`Minimum Bid Value ${minimumBidVal?.displayValue} ${minimumBidVal?.symbol}`}
                  name="itemName"
                  className="form-control"
                />
              </div>
            </div>
            <div className="item-details-btn">
              <button
                type="submit"
                className={
                  bidComplete
                    ? "btn btn-success w-100 border-radius-50"
                    : "default-btn border-radius-50"
                }
              >
                {" "}
                {bidComplete ? "Your Bid was Successfull" : "Place Bid"}
              </button>
            </div>
            {bidErrorMessage ? (
              <span className="text-danger">
                Enter Amount must be greater than{" "}
                <span className="fs-bold">
                  {data?.minimumBidCurrencyValue.displayValue}
                </span>
              </span>
            ) : (
              ""
            )}
          </>
        )}
      </form>
    </>
  );
};

export default ItemDetailsDescription;
