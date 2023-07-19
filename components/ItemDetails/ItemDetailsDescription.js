import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import Link from 'next/link'
import { setConfig } from 'next/config';
import { ThirdwebSDK } from "@thirdweb-dev/sdk/evm";
import { Web3Button, useSigner, useAddress } from '@thirdweb-dev/react';
import { Mumbai } from '@thirdweb-dev/chains';
import { ethers } from "ethers";
import axios from 'axios';



import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const ItemDetailsDescription = ({ days, hours, minutes, seconds, data }) => {
  const router = useRouter();
  const [bidAmount, setBidAmount] = useState()
  const [userData,setUserData] = useState()
  const [OwnerData,setOwnerData] = useState()
  const [bidErrorMessage, setBidErrorMessage] = useState(false)
  const [marketplaceModule, setMarketplaceModule] = useState();
  const [bidComplete, SetBidComplete] = useState(false)
  const [provider, setProvider] = useState();
  const [winningBid, setWinningBid]= useState()
  const [minimumBidVal, setMinimumBidVal] =useState()
  const signer = useSigner()
  const sdk = ThirdwebSDK.fromSigner(signer, Mumbai);
  const Address = useAddress()
  
  //  const sdk = new ThirdwebSDK("mumbai");

   const fetchUserInfo = () => {
     if (Address) {
       fetch(`http://localhost:1337/api/brokereum-user/?filters[walletAddress][$eq]=${Address}`)
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
       fetch(`http://localhost:1337/api/brokereum-user/?filters[walletAddress][$eq]=${data?.creatorAddress}`)
         .then((res) => res.json())
         .then((res) => {
           console.log(res?.data[0]?.attributes);
           setOwnerData(res.data[0].attributes);
         })
         .catch((err) => console.log(err));
   };

  useEffect(async () => {
    fetchUserInfo()
    fetchOWnerInfo()
     setMarketplaceModule(
       await sdk.getContract(process.env.Marketplace_Contract)
     );
   }, []);
   useEffect(async () => {
     if (marketplaceModule && data) {
       console.log(userData)
       console.log(data.id)
      setMinimumBidVal(
         await marketplaceModule.englishAuctions.getMinimumNextBid(
           data?.id
         ))
      setWinningBid(await marketplaceModule.englishAuctions.getWinningBid(
         data?.id
       ))
      }
      
    }, [marketplaceModule, data]);
    
    // console.log(winningBid)
    // console.log(minimumBidVal)
 

  const placeBid = async (e) => {
    e.preventDefault()

    if (bidAmount >= parseFloat(minimumBidVal.displayValue)) {
      setBidErrorMessage(false);
      const offer = {
        // address of the contract the asset you want to make an offer for
        assetContractAddress: data.assetContractAddress,
        // token ID of the asset you want to buy
        tokenId: data.tokenId,
        // how many of the asset you want to buy
        quantity: 1,
        // address of the currency contract that you offer to pay in
        currencyContractAddress: data.currencyContractAddress,
        // Total price you offer to pay for the mentioned token(s)
        totalPrice: bidAmount,
        // Offer valid until
        endTimestamp: new Date(),
      };
      console.log(data.id);
      try {
        
        const tx = await marketplaceModule.englishAuctions.makeBid(
          data.id,
          bidAmount
        );

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

         axios
           .post(`http://localhost:1337/api/bidding`, enterBidData, {
             headers: {
               "Content-type": "application/json",
             },
           })
           .then((res) => {
             console.log("Successfully Uploaded...!!");
             console.log(res);
           })
           .then((err) => {
             console.log(err);
           });
        
        console.log(tx);
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
  
  
  return (
    <>
      <div className="section-title">
        <h2>{data?.asset.name}</h2>
        <p>{data?.asset.description}</p>
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
          <span className="fs-bold ">You are the Owner of this NFT</span>
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
