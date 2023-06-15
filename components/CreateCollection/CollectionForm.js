import React, { useState, useEffect } from "react";
import Link from "next/link";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios"; 
import Overlay from "./Overlay"


import { ReactComponentElement as Loader } from "../../public/images/loader.svg";
import {
  
  useAddress,
  useSigner,
  useContract,
  useCreateDirectListing,
  Web3Button,
  useStorageUpload,
} from "@thirdweb-dev/react";
import { ThirdwebSDK, NATIVE_TOKEN_ADDRESS } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";
import ScaleLoader from "react-spinners/ScaleLoader";

const CollectionForm = () => {
  const { mutateAsync: upload } = useStorageUpload({
    onProgress: (progress) => {
      console.log(progress);
    },
  });

  const [img1 , setImg1] = useState()
  const [img2 , setImg2] = useState()

  const [parcelID , setparcelID] = useState()
  const [loading, setLoading] = useState(false);
  const [tokenID, setTokenID] = useState();
  const [file, setFile] = useState();
  // const [Marketplace, setContract] = useState();
  const [docummentfile, setdocumentFile] = useState([]);

  const sdk = new ThirdwebSDK("mumbai");

  const { contract } = useContract(
    "0x7921eC9DF2eacB73d6C3879AB336dfF644536675",
    "nft-collection"
  );

  const { contract: Marketplace } = useContract(
    "0xB373A88c45d45c01582Bd2f46a9EF7141E5f65c0",
    "marketplace-v3"
  );

  const { mutate: createDirectListing } = useCreateDirectListing(Marketplace);

  // const sdk = new ThirdwebSDK("mumbai");
  // const Marketplace = useContract(
  //   "0xB373A88c45d45c01582Bd2f46a9EF7141E5f65c0",
  //   "marketplace-v3"
  // );

  // useEffect(() => {
  //    fetchContract();
  //  }, []);

  //  const fetchContract = async () => {
  //    try {
  //      const sdk = new ThirdwebSDK("mumbai");
  //      const fetchedContract = await sdk.getContract(
  //        "0xB373A88c45d45c01582Bd2f46a9EF7141E5f65c0","marketplace-v3"

  //      );
  //      setContract(fetchedContract);
  //      console.log(fetchedContract);
  //    } catch (error) {
  //      console.error("Error fetching contract:", error);
  //    }
  //  };

  const [mediaPreview, setMediaPreview] = React.useState("");
  const [apiData, setapiData] = useState();
  const [ipfsHash, setIPFSHASH] = useState();
  const options = [
    "Land",
    "Detached Semi Detached",
    "Multifamily",
    "Condo",
    "Flat",
  ];

  const address = useAddress();

  const propertyTypeChange = (e) => {
    console.log(e);
    formData.propertyType = e.value;
  };
  const [formData, setFormData] = useState({
    IDunique: "",
    itemName: "",
    propertyType: "",
    description: "",
    downPayment: "",
    priceType: "",
    coordinatesLng: "",
    coordinatesLat: "",
    price: ""
 
  });
  const [NFTmintsuccess, setNFTmintSuccess] = useState(false)

  const fetchAPI = () => {
    console.log(docummentfile);
    console.log(formData.coordinatesLat, formData.coordinatesLng);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("token", "DNfbHaqajFigz4jPX9B8vnatUduLKZXVwA83WKZG");
    var raw = JSON.stringify({
      lat: parseFloat(formData.coordinatesLat),
      lng: parseFloat(formData.coordinatesLng),
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    var requestOptionsGET = {
      headers: myHeaders,
      // body: raw,
    };

    fetch("http://46.243.90.203:3000/res_api/parcel_data", requestOptions)
      .then((response) => response.json())
      .then((result) => {


        // fetch(`http://46.243.90.203:3000/res_api/signal_data_all`, requestOptionsGET).then(res => res.json())
        // .then((res) => console.log(res))
       

      
        console.log(result);
        console.log(result.features[0].id);
        setparcelID(result.features[0].id);

        
        axios
          .get(
            `http://localhost:1337/api/parcel-ids/?filters[parcelIDs][$eq]=${result.features[0].id}`,
            {
              headers: {
                "Content-type": "application/json",
              },
            }
          )
          .then((res) => {
            console.log(res.data.data.length);
            if (res.data.data.length>0) {
               toast.error("🦄 This Property was published before NFT", {
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
            else {   
              setapiData(result);
                  setImg1(
                    result.features[0].properties.image_urls.satellite_image
                  );
                  setImg2(
                    result.features[0].properties.image_urls.world_topo_image
                  );

                  console.log(
                    result.features[0].properties.image_urls.world_topo_image
                  );
              toast.success("Data Fetched Successfully!", {
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
          })
          .catch((err) => {
            console.log(err);
            toast.error("🦄 This Property was published before NFT", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          });


      })
      .catch((error) => console.log("error", error));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const uploadToIpfs = async () => {
    toast.info("🦄 Minting started....", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    setLoading(true);

    const uploadUrl = await upload({
      data: [
        {
          image: file,
          parcelID: parcelID,
          parcelData: apiData.features[0].properties,
        },
      ],
      options: { uploadWithGatewayUrl: true },
    });
    setIPFSHASH(uploadUrl[0]);
    console.log(ipfsHash);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);

    uploadToIpfs();
  };
  useEffect(async () => {
    if (ipfsHash && loading) {
      const metadatas = {
        image: file,
        name: formData.itemName,
        description: formData.description,
        properties: {
          IPFSHash: ipfsHash,
          priceType: formData.priceType,
          salesDeadline: formData.salesDeadline,
          downPayment: formData.downPayment,
          propertyType: formData.propertyType,
        },
      };
      console.log(metadatas);
      try{
        const tx = await contract.erc721.mint.prepare(metadatas);
        // const gasCost = await tx.estimateGasCost()
        // const signedTx = await tx.sign();
        const gaslessOptions =  tx.getGaslessOptions();
        console.log(gaslessOptions)
    
        const tx1 = await contract.mint(metadatas)
        console.log(tx1)
        // console.log(simulatedTx)
        // console.log(signedTx)
        setLoading(false);
        setNFTmintSuccess(true)
        const userData = JSON.stringify({
          "data": {
            "parcelIDs": parcelID,
          },
        });
        console.log(userData);
        axios
          .post(`http://localhost:1337/api/parcel-ids`, userData, {
            headers: {
              "Content-type": "application/json",
            },
          })
          .then((res) => {
            toast("NFT Minted Successfully!", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          }).catch((err) => {
          console.log(err)
        toast.error("🦄 Error while Minting!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      })
      } catch (err) {
          console.log(err)
        toast.error("🦄 Error while Minting!", {
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
      
    
      

      // Data of the listing you want to create
      // const txResult = await createDirectListing({
      //   assetContractAddress: "0x7921ec9df2eacb73d6c3879ab336dff644536675",
      //   tokenId: "12",
      //   pricePerToken: "0.1",
      // });
      // const receipt = txResult.receipt; // the transaction receipt
      // const id = txResult.id; // the id of the newly created listing
      // console.log(id);
      // console.log(receipt);
    }
  }, [loading, ipfsHash]);

  const radioOnchange = (e) => {
    console.log(e.target.value);
    formData.priceType = e.target.value;
  };
  const radioOnchange1 = (e) => {
    console.log(e.target.value);
    formData.listingType = e.target.value;
  };

  return (
    <div className="collection-form">
      <div className="profile-outer">
        <h3>Upload Image</h3>
        <div className="profileButton">
          <input
            className="profileButton-input"
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            name="media"
            accept="image/*, application/pdf"
          />
        </div>
      </div>
      <img className="media-preview" src={mediaPreview} />

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-lg-12">
            <div className="form-group">
              <label>Property Name</label>
              <input
                type="t"
                value={formData.itemName}
                name="itemName"
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>

          <div className="col-lg-12 col-md-12">
            <div className="form-group">
              <label>Property Description</label>
              <textarea
                className="form-control"
                id="description"
                cols="30"
                rows="5"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="e. g. 'Write the description of the Property'"
              ></textarea>
            </div>
          </div>

          <svg
            width="13"
            height="14"
            viewBox="0 0 13 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.38798 12.616C3.36313 12.2306 2.46328 11.5721 1.78592 10.7118C1.10856 9.85153 0.679515 8.82231 0.545268 7.73564C0.411022 6.64897 0.576691 5.54628 1.02433 4.54704C1.47197 3.54779 2.1845 2.69009 3.08475 2.06684C3.98499 1.4436 5.03862 1.07858 6.13148 1.01133C7.22435 0.944078 8.31478 1.17716 9.28464 1.68533C10.2545 2.19349 11.0668 2.95736 11.6336 3.89419C12.2004 4.83101 12.5 5.90507 12.5 7"
              stroke="white"
            />
          </svg>

          <div className="col-lg-6">
            <div className="checkbox-method-area">
              <div className="form-group col-lg-6 col-md-12">
                <label>Price Type</label>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="checkbox-method">
                  <p>
                    <input
                      type="radio"
                      id="fixed-price1"
                      value={"Sale"}
                      onChange={radioOnchange}
                      name="radio-group1"
                    />
                    <label htmlFor="fixed-price1">Sale</label>
                  </p>
                </div>
              </div>

              <div className="col-lg-12 col-md-12">
                <div className="checkbox-method">
                  <p>
                    <input
                      type="radio"
                      value={"Monthly Rent"}
                      onChange={radioOnchange}
                      id="timed-auction1"
                      name="radio-group1"
                    />
                    <label htmlFor="timed-auction1">Monthly Rent</label>
                  </p>
                </div>
              </div>

              <div className="col-lg-12 col-md-12">
                <div className="checkbox-method">
                  <p>
                    <input
                      type="radio"
                      value={"Yearly Rent"}
                      onChange={radioOnchange}
                      id="open-bid1"
                      name="radio-group1"
                    />
                    <label htmlFor="open-bid1">Yearly Rent</label>
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="col-lg-6">
            <div className="checkbox-method-area">
              <div className="form-group col-lg-6 col-md-12">
                <label>Select Type of Listing</label>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="checkbox-method">
                  <p>
                    <input
                      type="radio"
                      id="fixed-price4"
                      value={"direct"}
                      onChange={radioOnchange1}
                      name="radio-group6"
                    />
                    <label htmlFor="fixed-price4">Direct Listing</label>
                  </p>
                </div>
              </div>

              <div className="col-lg-12 col-md-12">
                <div className="checkbox-method">
                  <p>
                    <input
                      type="radio"
                      id="timed-auction4"
                      name="radio-group6"
                      value={"auction"}
                      onChange={radioOnchange1}
                    />
                    <label htmlFor="timed-auction4">Auction</label>
                  </p>
                </div>
              </div>
            </div>
          </div> */}

          <div className="col-lg-6">
            <div className="form-group col-lg-6 col-md-12">
              <label>Property Type</label>
              <Dropdown
                options={options}
                onChange={propertyTypeChange}
                placeholder="Select an option"
              />
            </div>
          </div>

          <div className="col-lg-6">
            <div className="form-group">
              <label>Down Payment %</label>
              <input
                type="number"
                value={formData.downPayment}
                name="downPayment"
                onChange={handleChange}
                className="form-control"
                placeholder="5%"
              />
            </div>
          </div>
          {/* <div className="col-lg-6">
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                value={formData.price}
                name="price"
                onChange={handleChange}
                className="form-control"
                placeholder="0.2 ETH"
              />
            </div>
          </div> */}
          <div className="col-lg-6"></div>

          <div className="form-group col-lg-6 col-md-12">
            <label>Latitude</label>
            <input
              type="text"
              className="form-control"
              name="coordinatesLat"
              value={formData.coordinatesLat}
              onChange={handleChange}
            />
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <label>Longitude</label>
            <input
              type="text"
              className="form-control"
              name="coordinatesLng"
              value={formData.coordinatesLng}
              onChange={handleChange}
            />
          </div>

          <div
            className={
              apiData
                ? "form-group col-lg-12 col-md-12"
                : "form-group col-lg-12 col-md-12"
            }
          >
            <button
              type="button"
              disabled={apiData ? true : false}
              className={apiData ? "btn btn-success" : "btn btn-dark"}
              onClick={fetchAPI}
            >
              {apiData ? "Successfully Fetched" : "Submit"}
            </button>
          </div>
          <div>
            {img1 ? (
              <>
                <Overlay image1={img1} image2={img2} />
              </>
            ) : (
              ""
            )}
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <label>Upload Property Documents</label>
            <input
              type="file"
              multiple
              className="form-control"
              name="documentFiles"
              onChange={(e) => setdocumentFile(e.target.files)}
            />
          </div>

          {/* <div className="form-group col-lg-6 col-md-12">
            <label>Price</label>
            <input
              type="number"
              className="form-control"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </div> */}

          <div className="col-lg-12 col-md-12">
            <button
              disabled={!address || !apiData || NFTmintsuccess}
              type="submit"
              className={
                address
                  ? !apiData
                    ? "default p-2 bg-gray border-radius-5"
                    : NFTmintsuccess
                    ? "btn btn-success"
                    : "default-btn border-radius-5"
                  : "default p-2 bg-gray border-radius-5"
              }
            >
              {!loading ? (
                NFTmintsuccess ? (
                  "Successfully Published"
                ) : (
                  "Publish"
                )
              ) : (
                <ScaleLoader color="#8D99FF" />
              )}
            </button>
          </div>
          <span className="mt-3" style={{ color: "red" }}>
            {" "}
            {address
              ? !apiData
                ? "Please make sure to submit property coordinates above."
                : ""
              : "Please Connect your Crypto Wallet.....!"}
          </span>
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
      </form>
      {/* <Web3Button
        contractAddress={address}
        action={() =>
          createDirectListing({
            assetContractAddress: "0x7921eC9DF2eacB73d6C3879AB336dfF644536675",
            tokenId: "16",
            pricePerToken: "0.1",
            currencyContractAddress:"0x693ea3384f0C1Ad2B58d15623Dc326E2A380e1E0",
            isReservedListing: false,
            quantity: "1",
            startTimestamp: new Date(),
            endTimestamp: new Date(
              new Date().getTime() + 7 * 24 * 60 * 60 * 1000
            ),
          })
        }
      >
        Create Direct Listing
      </Web3Button> */}
    </div>
  );
};

export default CollectionForm;
