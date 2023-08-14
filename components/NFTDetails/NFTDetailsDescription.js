import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  useAddress,
  NATIVE_TOKEN_ADDRESS,
  useSigner,
  useContractWrite,
  useContract,
  Web3Button,
  coinbaseWallet, localWallet, metamaskWallet, safeWallet, smartWallet, walletConnect 
} from "@thirdweb-dev/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {ethers} from "ethers";
import { ThirdwebSDK } from "@thirdweb-dev/sdk/evm";
import { SmartWallet } from "@thirdweb-dev/wallets";
import { Mumbai } from "@thirdweb-dev/chains";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { route } from "next/dist/server/router";
import axios from "axios";

const NFTDetailsDescription = ({ NFT, ipfsData }) => {

  const router = useRouter()
  const address = useAddress()
 
  useEffect(() => {
    if (!address) {
      router.push("/")
    }
  },[])


  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [formData, setFormData] = useState({
    listingType: "Auction",
    pricePerToken: "",
    bidoutPrice:"",
  });
  const [Clipboard, setclipboard] = useState(false);
  const [contract, setContract] = useState();

  const copytoClipboard = () => {
    navigator.clipboard.writeText(address);
    setclipboard(true);
  };


  const signer = useSigner()
  const marketplaceContract = async () => {
    const sdk = ThirdwebSDK.fromSigner(signer, "mumbai", {
      clientId: process.env.thirdweb_CLIENTID,
    });
    console.log(sdk);
    setContract(await sdk.getContract(process.env.Marketplace_Contract));
  };
  useEffect(() => {
    if (ThirdwebSDK, address) {
      
      marketplaceContract();
    }
  }, [ThirdwebSDK, address]);
 
    



  const ListForSale = async (e) => {
    e.preventDefault();
    console.log(formData);
    console.log(startDate);
    console.log(endDate);
    console.log("List");
   
    // Data of the listing you want to create
    const listing = {
      // address of the contract the asset you want to list is on
      assetContractAddress: process.env.ERC_Contract,
      // token ID of the asset you want to list
      tokenId: NFT.metadata.id,
      // how many of the asset you want to list
      quantity: 1,
      // address of the currency contract that will be used to pay for the listing
      currencyContractAddress: NATIVE_TOKEN_ADDRESS,
      // The price to pay per unit of NFTs listed.
      pricePerToken: formData.pricePerToken,
      // when should the listing open up for offers
      startTimestamp: startDate,
      // how long the listing will be open for
      endTimestamp: endDate,
      // Whether the listing is reserved for a specific set of buyers.
      isReservedListing: false,
    };

    const auction = {
      // address of the contract of the asset you want to auction
      assetContractAddress: process.env.ERC_Contract,
      // token ID of the asset you want to auction
      tokenId: NFT.metadata.id,
      // how many of the asset you want to auction
      quantity: 1,
      // address of the currency contract that will be used to pay for the auctioned tokens
      currencyContractAddress: NATIVE_TOKEN_ADDRESS,
      // the minimum bid that will be accepted for the token
      minimumBidAmount: "0.01",
      // how much people would have to bid to instantly buy the asset
      buyoutBidAmount: "1",
      // If a bid is made less than these many seconds before expiration, the expiration time is increased by this.
      timeBufferInSeconds: "300", // 5 minutes by default
      // A bid must be at least this much bps greater than the current winning bid
      bidBufferBps: "500", // 5% by default
      // when should the auction open up for bidding
      startTimestamp: startDate,
      // end time of auction
      endTimestamp: endDate,
    };
    console.log(contract)
    try {
      
    
      const tx = await contract.englishAuctions.createAuction(auction);
      if (tx) {

          const activityAdd = JSON.stringify({
            data: {
              Name: "List",
              address: address,
              ListID: NFT.metadata.id,
              imgHash: ipfsData.image_urls.satellite_image,
              Data: {
                data: tx.receipt,
              },
            },
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
          toast.success("Property listed Successfully!", {
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
      const receipt = tx.receipt; // the transaction receipt
      const id = tx.id; // the id of the newly created listing
      console.log(receipt);
      console.log(id);
    }
    catch (err) {
      console.log(err)
       toast.error("🦄 Error while listing the Property", {
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
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const radioButtonAuctionChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      listingType: "Auction",
    }));
  };
  const radioButtonDirectChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      listingType: "Direct",
    }));
  };

  console.log(formData.listingType);

  return (
    <>
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
      <div className="section-title">
        <h2>{NFT.metadata.name}</h2>
        <p>{NFT.metadata.description}</p>
      </div>

      <div className="item-details-price">
        <div className="item-details-title">
          <h3>Information Regarding this Property</h3>
        </div>
        <ul>
          {/* <li>
            Created
            <b>: 08 July, 2021</b>
          </li> */}
          <li>
            City
            <b>: {ipfsData.address.city}</b>
          </li>
          <li>
            Property Type
            <b>: MultiFamily</b>
          </li>
          <li>
            Price Type
            <b>: Sale</b>
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
          <div
            className="sp-title"
            style={
              Clipboard
                ? { color: "blue", cursor: "default" }
                : { color: "black", cursor: "pointer" }
            }
            onClick={copytoClipboard}
          >
            {address ? (
              <>{address.slice(0, 10) + "......" + address.slice(-4)}</>
            ) : (
              ""
            )}
            {/* 0x76669f...a0e9ca52{" "} */}
            <i
              style={Clipboard ? { color: "blue" } : { color: "black" }}
              className={
                Clipboard ? "ri-check-double-line ml-2" : "ri-folders-line ml-2"
              }
            ></i>
          </div>
        </div>
      </div>

      <form onSubmit={ListForSale}>
        <div className="item-details-btn">
          <div className="side-bar-widget">
            <label
              style={{ fontSize: "30px", fontWeight: "bolder" }}
              className="mt-2"
            >
              List your Property
            </label>
            <br />
            <label className="mt-5 font-weight-bold">
              Select Listings Type
            </label>
            <ul className="side-bar-widget-tag mt-4">
              <li
                onClick={radioButtonDirectChange}
                id="Direct"
                disabled={formData.listingType == "Direct"}
                className={formData.listingType == "Direct" ? "bg-danger" : ""}
                style={{ cursor: "pointer" }}
              >
                <a>Direct Listing</a>
              </li>
              <li
                onClick={radioButtonAuctionChange}
                aria-disabled={formData.listingType == "Auction"}
                className={formData.listingType == "Auction" ? "bg-danger" : ""}
                style={{ cursor: "pointer" }}
                id="Auction"
              >
                <a>Auction Listing</a>
              </li>
            </ul>
          </div>
          <div className="col-lg-12 mb-4">
            <div className="form-group">
              <label>Reserve Price</label>
              <input
                type="number"
                value={formData.pricePerToken}
                name="pricePerToken"
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="form-group mt-3">
              <label>Bidout Price</label>
              <input
                type="number"
                value={formData.bidoutPrice}
                name="bidoutPrice"
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>
          <div className="col-lg-12">
            <div className="">
              <label>Listing from/to</label>
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

          <button type="submit" className="default-btn border-radius-50">
            List for Sale
          </button>
        </div>
      </form>
    </>
  );
};

export default NFTDetailsDescription;
