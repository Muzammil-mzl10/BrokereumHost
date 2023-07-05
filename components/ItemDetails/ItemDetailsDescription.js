import React, { useState , useEffect} from 'react';
import Link from 'next/link'
import { setConfig } from 'next/config';
import { ThirdwebSDK } from "@thirdweb-dev/sdk/evm";
import { Web3Button } from '@thirdweb-dev/react';
import { ethers } from "ethers";

const ItemDetailsDescription = ({ days,hours,minutes , seconds,data }) => {
  const [bidAmount, setBidAmount] = useState()
  const [bidErrorMessage, setBidErrorMessage] = useState(false)
  const [marketplaceModule, setMarketplaceModule] = useState();
  const [provider, setProvider] = useState();
  const signer = new ethers.Wallet(process.env.private_Key);

  const sdk = ThirdwebSDK.fromSigner(signer, "mumbai");
  //  const sdk = new ThirdwebSDK("mumbai");

   useEffect(async () => {
     setMarketplaceModule(
       await sdk.getContract(process.env.Marketplace_Contract)
     );
   }, []);
   useEffect(async () => {
     if (marketplaceModule && data) {
       let minimumNextBid =
         await marketplaceModule.englishAuctions.getMinimumNextBid(
           data.id
         );
       const winningBid = await marketplaceModule.englishAuctions.getWinningBid(
         data.id
       );
       console.log(winningBid)
       console.log(minimumNextBid)
      }
     
   }, [marketplaceModule]);

 

  const placeBid =async(e) => {
    e.preventDefault()
    if (bidAmount >= parseFloat(data?.minimumBidCurrencyValue.displayValue))
    {
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
        console.log(data.id)
      const tx = await marketplaceModule.englishAuctions.makeBid(
        data.id,
        bidAmount
      );
      console.log(tx)
     
    } else {
      setBidErrorMessage(true)
      console.log("Error")
    }
  } 
  
  
  return (
    <>
      <div className="section-title">
        <h2>{data?.asset.name}</h2>
        <p>{data?.asset.description}</p>
      </div>

      <div className="row">
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
      </div>

      <div className="item-details-price">
        <div className="item-details-title">
          <h3>Current Price 324 ETH</h3>
          <p>$1200</p>
          <span>1/10</span>
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
          <h3>Jecob Martin</h3>
          <span>Item Owner</span>
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
          <h3 className="item-right-eth">15,00 ETH</h3>
        </div>
      </div>
      <form onSubmit={placeBid}>
        <div className="col-lg-12 my-3">
          <div className="form-group">
            <label>Enter Bidding Amount</label>
            <input
              type="float"
              step="0.01"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder={`Minimum Bid Value ${data?.minimumBidCurrencyValue.displayValue}`}
              name="itemName"
              className="form-control"
            />
          </div>
        </div>
        <Web3Button
          contractAddress={process.env.Marketplace_Contract}
          action={async () => await placeBid()}
          // className={styles.btn}
          onSuccess={() => {
            toast(`Bid success!`, {
              icon: "✅",
              style: toastStyle,
              position: "bottom-center",
            });
          }}
          onError={(e) => {
            console.log(e);
            toast(`Bid failed! Reason: ${e.message}`, {
              icon: "❌",
              style: toastStyle,
              position: "bottom-center",
            });
          }}
        >
          Place bid
        </Web3Button>
        <div className="item-details-btn">
          <button type="submit" className="default-btn border-radius-50">
            {" "}
            Place Bid
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
      </form>
    </>
  );
};

export default ItemDetailsDescription;
