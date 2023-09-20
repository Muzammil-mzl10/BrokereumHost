import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import Link from 'next/link'
import { setConfig } from 'next/config';
import { ThirdwebSDK } from "@thirdweb-dev/sdk/evm";
import { Web3Button, useSigner, useAddress, NATIVE_TOKEN_ADDRESS } from '@thirdweb-dev/react';
import { Mumbai } from '@thirdweb-dev/chains';
import { ethers } from "ethers";
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ContentTypeComposite } from '@xmtp/xmtp-js';


const ItemDetailsDescription = ({ days, hours, minutes, seconds, data }) => {
  // console.log(data)
  const [dateRange, setDateRange] = useState([null, null]);
  const [bidoutPrice,setBidOutPrice] = useState()
  const [expired,setExpired] = useState(false)

  const [startDate, endDate] = dateRange;
  const [formData, setFormData] = useState({
    listingType: "Auction",
    pricePerToken: "",
  });

  const [winnerUser,setWinnerUser] = useState()
  
  const fetchWinningBid = async () => {
    if (marketplaceModule && data) {
      setTestTrue(true);
      console.log("fetching..")
      const winner = await marketplaceModule.englishAuctions.getWinner(data?.id);
      console.log(winner)
     fetch(
       `${process.env.STRAPI_URL_PROD}/api/brokereum-user/?filters[walletAddress][$eq]=${winner}`
       )
       .then((res) => res.json())
       .then((res) => {
         console.log(res?.data[0]?.attributes);     
           setWinnerUser(res.data[0].attributes);
          });
          
          
        }
  }
  const [testTrue,setTestTrue] = useState(false)

  useEffect(() => {
    if (marketplaceModule) {
      
      if (days == 0 && hours == 0 && minutes == 0 && seconds == 0) { 
        if (!testTrue) { 
          console.log("Hello")
        fetchWinningBid()    
      }
      setExpired(true)
    } else {
      setExpired(false)
   }
      }
  },[days,hours,minutes,seconds])


  const handleChange = (e) => {
    console.log(e.target.name)
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  // console.log(days,hours,minutes,seconds)
  
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
  const [checkNotary,setCheckNotary] = useState(false)
  const signer = useSigner()
  const Address = useAddress()
  
   const [strapiWinBid, setStrapiWinBid] = useState();
   
   
   useEffect(() => {
     if (!Address) {
       router.push("/");
      }
 }, [Address, router]);

   useEffect(() => {
    fetch(
      `${process.env.STRAPI_URL_PROD}/api/bidding/?filters[listingID][$eq]=${data?.id}`
    )
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.data) {
          let winBid=0
          res.data.map((data) => {
            if (parseFloat(data.attributes.bidAmount) > winBid) {
              winBid = parseFloat(data.attributes.bidAmount);
            }
          })
          console.log(winBid)
          setStrapiWinBid(winBid)
          console.log(res.data)
          // setPRevBids(res.data);
        }
      })
      .then((err) => console.log(err));
  }, [data]);

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
           if (res.data[0]) {
             if (res.data[0].attributes.userType.Notaries == "Notaries") {
               setCheckNotary(true);
             } else {
               setCheckNotary(false);
             }
               console.log(res.data[0].attributes.userType.Notaries);
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
  
  const [currencyExchangeRate, setCurrencyExchangeRate] = useState()

  useEffect(() => {
    fetchCurrencyRate()
  },[])
  const fetchCurrencyRate = async () => {
    fetch(`https://api.coinbase.com/v2/exchange-rates?currency=matic`)
      .then((res) => res.json())
      .then((res) => {
        console.log(res.data.rates.CHF);
        setCurrencyExchangeRate(res.data.rates.CHF);
      });
  }
  useEffect(() => {
    async function fetchData() {
      if (marketplaceModule && data) {
        try {
          console.log(userData);
          console.log(data.id);

          const minimumBid = await marketplaceModule.englishAuctions.getMinimumNextBid(data?.id);
          console.log(minimumBid)
          setPropertyBuyout(parseFloat(minimumBid.displayValue));
          const downPaymentPercentage = data?.asset?.properties?.downPayment;
          const totalPropertyAmount =
            (parseFloat(minimumBid.displayValue) * 100) / downPaymentPercentage;
          console.log(totalPropertyAmount*currencyExchangeRate)
          setMinimumBidVal(totalPropertyAmount);
          onBidChange2();

          const winningBid = await marketplaceModule.englishAuctions.getWinningBid(data?.id);
          setWinningBid(winningBid);
        } catch (error) {
          console.log(error);
        }
      }
    }

    fetchData();
  }, [marketplaceModule, data]);

  useEffect(() => {
    if (minimumBidVal && currencyExchangeRate) {
      onBidChange2()
    }
  },[minimumBidVal, currencyExchangeRate])  

    // console.log(winningBid)
    // console.log(minimumBidVal)
 

  const placeBid = async (e) => {
    e.preventDefault()
    console.log(properyBuyOut / currencyExchangeRate);
    console.log(properyBuyOut)
    console.log(minimumBidVal)
    console.log(bidAmount / currencyExchangeRate)?.toFixed(2)
    console.log(minimumBidVal *currencyExchangeRate);
    if (bidAmount / currencyExchangeRate >= minimumBidVal) {
      setBidErrorMessage(false);
      console.log(data.id);
      try {
        const tx = await marketplaceModule.englishAuctions.makeBid(
          data.id,
          properyBuyOut / currencyExchangeRate
        );

        console.log(tx.receipt);
        if (tx) {
          const enterBidData = JSON.stringify({
            data: {
              listingID: data.id,
              bidAmount: String(bidAmount),
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
            .post(
              `${process.env.STRAPI_URL_PROD}/api/activities`,
              activityAdd,
              {
                headers: {
                  "Content-type": "application/json",
                },
              }
            )
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

  const updateListing = async (e) => {
    e.preventDefault()
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
        minimumBidAmount: bidoutPrice,
        // how much people would have to bid to instantly buy the asset
        buyoutBidAmount: formData.pricePerToken,
        // If a bid is made less than these many seconds before expiration, the expiration time is increased by this.
        timeBufferInSeconds: "300", // 5 minutes by default
        // A bid must be at least this much bps greater than the current winning bid
        bidBufferBps: "500", // 5% by default
        // when should the auction open up for bidding
        startTimestamp: startDate,
        // end time of auction
        endTimestamp: endDate,
      };
      
    // const tx = await marketplaceModule.englishAuctions.updateListing(data.id,auction)
    // console.log(tx)
  }

  const cancelAuction = async() => {
    try {
      
      const tx = await marketplaceModule.englishAuctions.cancelAuction(data.id)
      
      console.log(tx)
    toast.success("Successfully Cancelled Auction", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        })
        
        router.push("/")
    } catch (err) {
      console.log(err)
         toast.error("🦄 Can not Cancelled", {
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
  }

  const closeAuctionForBidders = async () => {
    try {
      
      const tx = await marketplaceModule.englishAuctions.executeSale(data.id);
      console.log(tx)
       toast.success("Successfully Closed Auction For Bidder", {
         position: "top-center",
         autoClose: 5000,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
         progress: undefined,
         theme: "light",
       });
    } catch (err) {

       console.log(err)
       toast.error("🦄 Listing can not be Closed", {
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
  }
  // console.log("notary:", checkNotary)
  // console.log(expired)
  // console.log(winningBid)
  const [properyBuyOut,setPropertyBuyout] = useState()
  const [downPayment,setDownPayment] = useState()
  const onBidChange = (e) => {
    console.log(e)
    const bidAmount = parseFloat(e.target.value); // Convert bidAmount to a number
    const downPaymentPercentage = data?.asset?.properties?.downPayment; // Replace with your down payment percentage
    console.log(e.target.value)
    setBidAmount(e.target.value)
 
    console.log(downPaymentPercentage)
    console.log(bidAmount)
    const totalPropertyAmount = (downPaymentPercentage / 100) * bidAmount;
    console.log(totalPropertyAmount)
    setPropertyBuyout(totalPropertyAmount)
    console.log("Total Property Amount:", totalPropertyAmount);
  };
  const onBidChange2 = () => {
    const bidAmount = parseFloat(minimumBidVal * currencyExchangeRate); // Convert bidAmount to a number
    const downPaymentPercentage = data?.asset?.properties?.downPayment; // Replace with your down payment percentage
    // console.log(e.target.value);
    // setBidAmount(minimumBidVal * currencyExchangeRate);

    console.log(downPaymentPercentage);
    console.log(bidAmount);
    const totalPropertyAmount = (downPaymentPercentage / 100) * bidAmount;
    console.log(totalPropertyAmount);
    setPropertyBuyout(totalPropertyAmount);
    // console.log("Total Property Amount:", totalPropertyAmount);
  };
  // console.log(`${process.env.STRAPI_URL_PROD}${OwnerData?.profilePicHash}`);
  // console.log(currencyExchangeRate)

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
          {/* <h3>
            Current Price {winningBid?.bidAmountCurrencyValue?.displayValue}{" "}
            {winningBid?.bidAmountCurrencyValue?.symbol}
          </h3> */}
          {/* <p>$1200</p>
          <span>1/10</span> */}
        </div>
        <ul>
          <li>
            Created
            <b>: 08 July, 2021</b>
          </li>

          <li>
            Category
            <b>: Artwork</b>
          </li>
        </ul>
      </div>
      {OwnerData && (
        <div className="item-details-user-item">
          <div className="images">
            <img
              src={`${process.env.STRAPI_URL_PROD}${OwnerData?.profilePicHash}`}
              alt="Image"
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
      )}

      <div className="item-details-in-content">
        <div className="item-left">
          <span>Auction Ends In</span>
          <div className="timer-text" data-countdown="2021/11/11">
            {days}:{hours}:{minutes}:{seconds}
          </div>
        </div>
        {strapiWinBid !== 0 ? (
          <div className="item-right">
            <h3 className="item-remaining">Highest Bid</h3>
            <h3 className="item-right-eth">{strapiWinBid?.toFixed(2)} CHF</h3>
          </div>
        ) : null}
      </div>
      {winningBid && expired && (
        <div className="item-details-in-content">
          <div className="item-left">
            <h3>Auction Winner</h3>
            <div className="timer-text" data-countdown="2021/11/11">
              {winningBid?.bidAmountCurrencyValue?.displayValue}{" "}
              {winningBid?.bidAmountCurrencyValue?.symbol}
            </div>
          </div>
          <div className="item-right">
            {data?.creatorAddress == Address || checkNotary ? (
              <Link href={`/chat/${winningBid?.bidderAddress}`}>
                <button className="btn default-btn">Chat</button>
              </Link>
            ) : null}
            <h3 className="item-remaining mt-3">
              {winningBid?.bidderAddress.slice(0, 10) +
                "......" +
                winningBid?.bidderAddress.slice(-4)}
            </h3>
          </div>
        </div>
      )}

      {data?.creatorAddress == Address ? (
        <form onSubmit={updateListing}>
          <div className="item-details-btn">
            <h2 className="text-danger"> You are the Owner of the Property</h2>
            <div className="side-bar-widget">
              <label
                style={{ fontSize: "30px", fontWeight: "bolder" }}
                className="mt-2"
              >
                Edit the Listing
              </label>
              <br />
            </div>
            {/* <div className="col-lg-12 mb-4">
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
              </button> */}
            <button
              type="button"
              onClick={cancelAuction}
              className="default-btn border-radius-50"
            >
              Cancel Listing
            </button>
            {expired && expired ? (
              <button
                type="button"
                onClick={closeAuctionForBidders}
                className="default-btn border-radius-50 mt-2"
              >
                Execute Sale
              </button>
            ) : null}
          </div>
        </form>
      ) : !expired ? (
        <>
          <form onSubmit={placeBid}>
            <div className="col-lg-12 my-3">
              <div className="form-group">
                <label>Your Bid for this property (CHF)</label>
                <input
                  type="float"
                  step="0.01"
                  value={bidAmount}
                  onChange={onBidChange}
                  placeholder={`Minimum Value ${(
                    minimumBidVal * currencyExchangeRate
                  )?.toFixed(2)} CHF`}
                  name="itemName"
                  className="form-control"
                />
              </div>
            </div>
            <div className="item-details-in-content">
              <div className="item-left">
                <h5 data-countdown="2021/11/11">
                  DownPayment: {data?.asset?.properties?.downPayment}%
                </h5>
                <h5>
                  Down Payment in CHF : {parseFloat(properyBuyOut)?.toFixed(2)}{" "}
                </h5>
                <h5>
                  Down Payment In MATIC :{" "}
                  {(properyBuyOut / currencyExchangeRate)?.toFixed(2)}
                </h5>
              </div>
            </div>
            <div className="form-group mb-5">
              <label>Your down payment (MATIC)</label>
              <input
                type="float"
                step="0.01"
                placeholder={`${(properyBuyOut / currencyExchangeRate)?.toFixed(
                  2
                )} MATIC`}
                name="itemName"
                disabled
                className="form-control"
              />
            </div>
            {/* <div className="item-details-in-content">
              <div className="item-left">
                <div className="timer-text" data-countdown="2021/11/11">
                  DownPayment: {data?.asset?.properties?.downPayment}%
                </div>
              </div>
              <div className="item-right">
                <span>Your bid for this property</span>
                <div
                  style={{ fontWeight: "bold", fontSize: "20px" }}
                  className="timer-text"
                >
                  {properyBuyOut?.toFixed(3)} CHF
                </div>
              </div>
            </div> */}

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
          </form>
          {bidErrorMessage ? (
            <span className="text-danger">
              Enter Amount must be greater than{" "}
              <span className="fs-bold">
                {minimumBidVal * currencyExchangeRate}
              </span>
            </span>
          ) : (
            ""
          )}
        </>
      ) : null}
    </>
  );
};

export default ItemDetailsDescription;
