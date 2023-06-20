import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAddress, NATIVE_TOKEN_ADDRESS } from "@thirdweb-dev/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {ethers} from "ethers";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";


const NFTDetailsDescription = ({ NFT, ipfsData }) => {
  const [provider, setProvider] = useState();
  const signer = new ethers.Wallet(process.env.private_Key);

  // useEffect(() => {
  //     const connectToProvider = async () => {
  //       const connectedProvider = new ethers.providers.JsonRpcProvider(
  //         "https://polygon-mumbai.g.alchemy.com/v2/qn9dx3qezc7yOPnRF7ZJA1atSdIDIcCg"
  //       );
  //       await signer.connect(connectedProvider);
  //       setProvider(connectedProvider);
  //     };

  //     connectToProvider();
  //   }, []);

  const [dateRange, setDateRange] = useState([null, null]);

  const [startDate, endDate] = dateRange;
  const address = useAddress();
  const [formData, setFormData] = useState({
    listingType: "Auction",
    pricePerToken: "",
  });
  const [Clipboard, setclipboard] = useState(false);
  const [contract, setContract] = useState();

  const copytoClipboard = () => {
    navigator.clipboard.writeText(address);
    setclipboard(true);
  };

  const sdk = ThirdwebSDK.fromSigner(signer, "mumbai");
  const marketplaceContract = async () => {
    setContract(await sdk.getContract(process.env.Marketplace_Contract));
  };
  useEffect(() => {
    marketplaceContract();
  }, []);

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
      minimumBidAmount: "1.5",
      // how much people would have to bid to instantly buy the asset
      buyoutBidAmount: "10",
      // If a bid is made less than these many seconds before expiration, the expiration time is increased by this.
      timeBufferInSeconds: "300", // 5 minutes by default
      // A bid must be at least this much bps greater than the current winning bid
      bidBufferBps: "500", // 5% by default
      // when should the auction open up for bidding
      startTimestamp: startDate,
      // end time of auction
      endTimestamp: endDate,
    };

    const tx = await contract.englishAuctions.createAuction(auction);
    const receipt = tx.receipt; // the transaction receipt
    const id = tx.id; // the id of the newly created listing
    console.log(receipt);
    console.log(id);
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
      <div className="section-title">
        <h2>Title</h2>
        <p>{NFT.metadata.name}</p>
      </div>

      <div className="item-details-price">
        <div className="item-details-title">
          <h3>Information Regarding this Property</h3>
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
            City
            <b>: Osnabruck</b>
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

          <button type="submit" className="default-btn border-radius-50">
            List for Sale
          </button>
        </div>
      </form>
    </>
  );
};

export default NFTDetailsDescription;
