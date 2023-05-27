import React, { useState, useEffect } from "react";
import Link from "next/link";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { ReactComponentElement as Loader } from "../../public/images/loader.svg";
import {
  useAddress,
  useSigner,
  useContract,
  useCreateDirectListing,
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

  const { contract: Marketplace, isLoading: loadingContract } = useContract(
    "0xb373a88c45d45c01582bd2f46a9ef7141e5f65c0",
    "marketplace-v3"
  );

  const { mutateAsync: createDirectListing } = useCreateDirectListing(Marketplace);
 
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
    salesDeadline: "",
    propertySize: "",
    landPlotSize: "",
    description: "",
    downPayment: "",
    priceType: "",
    propertyZone: "",
    listingType: "",
    utilization: "",
    volume: "",
    volumeMax: "",
    coordinatesLng: "",
    coordinatesLat: "",
    address: "",
    zipCode: "",
    price: "",
    priceType: "",
    rooms: "",
    siteScore: "",
  });

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

    fetch("http://46.243.90.203:3000/res_api/parcel_data", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setapiData(result);
        console.log(result);
        console.log(result.features[0].properties.score);
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
    setLoading(true);
    const uploadUrl = await upload({
      data: [
        {
          image: file,
          propertyData: {
            properties: {
              id: apiData.features[0].properties.score,
              Owner: apiData.features[0].properties.owner,
              address: {
                street: apiData.features[0].properties.streetname,
                city: apiData.features[0].properties.cityname,
                canton: apiData.features[0].properties.canton,
                zip: apiData.features[0].properties.zip,
                parcel_id: apiData.features[0].properties.parcel_id,
                coordinates: apiData.features[0].geometry.coordinates,
              },
              building: {
                bldg_constr_year:
                  apiData.features[0].properties.bldg_constr_year,
                bldg_flats: apiData.features[0].properties.bldg_flats,
                bldg_floors: apiData.features[0].properties.bldg_floors,
                bldg_size: apiData.features[0].properties.bldg_size,
                bldg_vol: apiData.features[0].properties.bldg_vol_gwr,
              },
              plot: {
                parcel_area: apiData.features[0].properties.parcel_area,
                ratio_s: apiData.features[0].properties.ratio_s,
                ratio_s_free: apiData.features[0].properties.ratio_s_free,
                ratio_v: apiData.features[0].properties.ratio_v,
                ratio_v_free: apiData.features[0].properties.ratio_v_free,
                area_max: apiData.features[0].properties.area_max,
                vol_max: apiData.features[0].properties.vol_max,
                gfa_now: apiData.features[0].properties.gfa_now,
                gfa_max: apiData.features[0].properties.gfa_max,
                cy_min: apiData.features[0].properties.cy_min,
              },
              construction_zone: {
                cz_abbrev: apiData.features[0].properties.cz_abbrev,
                cz_floors_usual: apiData.features[0].properties.cz_floors_usual,
                cz_height_usual: apiData.features[0].properties.cz_height_usual,
                cz_local: apiData.features[0].properties.cz_local,
                cz_type: apiData.features[0].properties.cz_type,
                cz_util_est: apiData.features[0].properties.cz_util_est,
                cz_util_now: apiData.features[0].properties.cz_util_now,
              },
              noise: {
                noise_bahn_night:
                  apiData.features[0].properties.noise_bahn_night,
                noise_bahn_day: apiData.features[0].properties.noise_bahn_day,
                noise_street_night:
                  apiData.features[0].properties.noise_street_day,
                noise_street_day:
                  apiData.features[0].properties.noise_street_night,
              },
              travel: {
                tt_agglo_pubt: apiData.features[0].properties.tt_agglo_pubt,
                tt_agglo_road: apiData.features[0].properties.tt_agglo_road,
              },
              vacancies: {
                vac_all: apiData.features[0].properties.vac_all,
                vac_new: apiData.features[0].properties.vac_new,
                vac_old: apiData.features[0].properties.vac_old,
              },
              tax: {
                tax_100k_pa: apiData.features[0].properties.tax_100k_pa,
                tax_scale: apiData.features[0].properties.tax_scale,
              },
              document: docummentfile,
            },
          },
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
      // const tx = await contract.mint(metadatas).prepare(1);
      // const gasCost = await tx.estimateGasCost(); // Estimate the gas cost
      // const simulatedTx = await tx.simulate(); // Simulate the transaction
      // const signedTx = await tx.sign();
      // const tx = await contract.mint(metadatas)
      // console.log(tx)
      // setTokenID(tx.id)

      console.log(tokenID);
      // Data of the listing you want to create

      const tx1 = await createDirectListing({
        assetContractAddress: "0x7921eC9DF2eacB73d6C3879AB336dfF644536675",
        tokenId: "12",
        pricePerToken: "1.5",
      });
      const receipt = tx1.receipt; // the transaction receipt
      const id = tx1.id; // the id of the newly created listing
      setLoading(false);
      console.log(id);
      console.log(receipt);
    }
  }, [uploadToIpfs, ipfsHash]);

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
      {/* <div className="collection-category">
        <h3>Choose Item Category</h3>
        <ul>
          <li>
            <Link href="/create-collection">
              <a target="_blank">Art</a>
            </Link>
          </li>
          <li>
            <Link href="/create-collection">
              <a target="_blank">Virtual Worlds</a>
            </Link>
          </li>
          <li>
            <Link href="/create-collection">
              <a target="_blank">Trending Cards</a>
            </Link>
          </li>
          <li>
            <Link href="/create-collection">
              <a target="_blank">Collectibles</a>
            </Link>
          </li>
          <li>
            <Link href="/create-collection">
              <a target="_blank">Music</a>
            </Link>
          </li>
          <li>
            <Link href="/create-collection">
              <a target="_blank">Games</a>
            </Link>
          </li>
          <li>
            <Link href="/create-collection">
              <a target="_blank">Domains</a>
            </Link>
          </li>
          <li>
            <Link href="/create-collection">
              <a target="_blank">Memes</a>
            </Link>
          </li>
          <li>
            <Link href="/create-collection">
              <a target="_blank">NFT Gifts</a>
            </Link>
          </li>
        </ul>
      </div> */}

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
                      value={"Sales"}
                      onChange={radioOnchange}
                      name="radio-group1"
                    />
                    <label htmlFor="fixed-price1">Sales</label>
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
          <div className="col-lg-6">
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
          </div>
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
          <div className="col-lg-6">
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                value={formData.downPayment}
                name="downPayment"
                onChange={handleChange}
                className="form-control"
                placeholder="0.2 ETH"
              />
            </div>
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <label>Sales Deadline</label>
            <input
              type="date"
              className="form-control col-lg-6 col-md-12"
              name="salesDeadline"
              value={formData.salesDeadline}
              onChange={handleChange}
            />
          </div>

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
              disabled={!address || !apiData}
              type="submit"
              className={
                address
                  ? !apiData
                    ? "default p-2 bg-gray border-radius-5"
                    : "default-btn border-radius-5"
                  : "default p-2 bg-gray border-radius-5"
              }
            >
              {!loading ? "Mint NFT" : <ScaleLoader color="#8D99FF" />}
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
      </form>
    </div>
  );
};

export default CollectionForm;
