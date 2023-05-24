import React, {useState,useEffect} from "react";
import Link from "next/link";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { useAddress, useSigner,useContract , useStorageUpload } from "@thirdweb-dev/react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk/evm";
import { ethers } from "ethers";


const CollectionForm = () => {
  const { mutateAsync: upload } = useStorageUpload({
    onProgress: (progress) => {
      console.log(progress);
    }
  })
  
const [file, setFile] = useState();

const signer = useSigner();
  console.log(signer)
  const { contract } = useContract(
    "0x7921eC9DF2eacB73d6C3879AB336dfF644536675",
    "nft-collection"
  );
  // useEffect(() => {
  //    fetchContract();
  //  }, []);

  //  const fetchContract = async () => {
  //    try {
  //      const sdk = new ThirdwebSDK("mumbai");
  //      const fetchedContract = await sdk.getContract(
  //        "0x7921eC9DF2eacB73d6C3879AB336dfF644536675",signer
  //      );
  //      setContract(fetchedContract);
  //      console.log(fetchedContract);
  //    } catch (error) {
  //      console.error("Error fetching contract:", error);
  //    }
  //  };
  
  const [mediaPreview, setMediaPreview] = React.useState("");
  const [apiData,setapiData] = useState()
  const options = [
    "Land",
    "Detached Semi Detached",
    "Multifamily",
    "Condo",
    "Flat",
  ];

  const address= useAddress()
 
  const propertyTypeChange = (e) => {
    console.log(e)
  }
  console.log(address);
  const handleChange1 = (e) => {
    const { name, file } = e.target;
    console.log(file)
    console.log(name)
    setMediaPreview(window.URL.createObjectURL(file[0]));
  };
  

    const [formData, setFormData] = useState({
      IDunique: "",
      propertyType: "",
      salesDeadline: "",
      propertySize: "",
      landPlotSize: "",
      description: "",
      propertyZone: "",
      utilization: "",
      volume: "",
      volumeMax: "",
      coordinatesLng:"",
      coordinatesLat:"",
      address: "",
      zipCode: "",
      price: "",
      priceType: "",
      rooms: "",
      siteScore: "",
    });
  
  const fetchAPI = () => {

    console.log(formData.coordinatesLat, formData.coordinatesLng)
    
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
      setapiData(result)
      console.log(result)
      console.log(result.features[0].properties.score);
    })
    .catch((error) => console.log("error", error));

  }
  
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const uploadToIpfs = async () => {
   const uploadUrl = await upload({
     data: [
       {
         image: file,
         propertyData: {
           properties: {
             id: apiData.features[0].properties.score,
             Owner: apiData.features[0].properties.owner,
             address: {
               street: "",
               city: "",
               canton: "",
               zip: "",
               parcel_id: "",
               coordinates: {
                 lat: coordinatesLat,
                 lng: coordinatesLng,
               },
             },
             building: {
               bldg_constr_year: "",
               bldg_flats: "",
               bldg_floors: "",
               bldg_size: "",
               bldg_vol: "",
             },
             plot: {
               parcel_area: "",
               ratio_s: "",
               ratio_s_free: "",
               ratio_v: "",
               ratio_v_free: "",
               area_max: "",
               vol_max: "",
               gfa_now: "",
               gfa_max: "",
               cy_min: "",
             },
             construction_zone: {
               cz_abbrev: "",
               cz_floors_usual: "",
               cz_height_usual: "",
               cz_local: "",
               cz_type: "",
               cz_util_est: "",
               cz_util_now: "",
             },
             noise: {
               noise_bahn_night: "",
               noise_bahn_day: "",
               noise_street_night: "",
               noise_street_day: "",
             },
             travel: {
               tt_agglo_pubt: "",
               tt_agglo_road: "",
             },
             vacancies: {
               vac_all: "",
               vac_new: "",
               vac_old: "",
             },
             tax: {
               tax_100k_pa: "",
               tax_scale:"",
             },
           },
         },
       },
     ],
     options: { uploadWithGatewayUrl: true },
   });
   alert(uploadUrl);
 };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);

   
   uploadToIpfs();
    const metadatas = 
      {
        name: "Test NFT",
        description: "Testing"
      };

    console.log(address)
    // const results = await contract.mint(metadatas);
    // console.log(results)
  };
  return (
    <div className="collection-form">
      <div className="profile-outer">
        <h3>Upload File</h3>
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
                type="text"
                name="iTemName"
                id="name"
                className="form-control"
                placeholder="e. g. “walking in the air”"
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

          <div className="col-lg-6">
            <div className="checkbox-method-area">
              <div className="form-group col-lg-6 col-md-12">
                <label>Price Type</label>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="checkbox-method">
                  <p>
                    <input type="radio" id="fixed-price1" name="radio-group1" />
                    <label htmlFor="fixed-price1">Sales</label>
                  </p>
                </div>
              </div>

              <div className="col-lg-12 col-md-12">
                <div className="checkbox-method">
                  <p>
                    <input
                      type="radio"
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
                    <input type="radio" id="open-bid1" name="radio-group1" />
                    <label htmlFor="open-bid1">Yearly Rent</label>
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
              <label>Royalties</label>
              <input type="text" className="form-control" placeholder="5%" />
            </div>
          </div>
          {/* <div className="form-group col-lg-6 col-md-12">
            <label>IDunique</label>
            <input
              type="text"
              className="form-control"
              name="IDunique"
              value={formData.IDunique}
              onChange={handleChange}
            />
          </div> */}
          <div className="form-group col-lg-6 col-md-12">
            <label>Sales Deadline</label>
            <input
              type="number"
              className="form-control col-lg-6 col-md-12"
              name="salesDeadline"
              value={formData.salesDeadline}
              onChange={handleChange}
            />
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <label>Land Plot Size</label>
            <input
              type="number"
              className="form-control"
              name="landPlotSize"
              value={formData.landPlotSize}
              onChange={handleChange}
            />
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <label>Property Zone</label>
            <input
              type="text"
              className="form-control"
              name="propertyZone"
              value={formData.propertyZone}
              onChange={handleChange}
            />
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <label>Utilization</label>
            <input
              type="number"
              step="any"
              className="form-control"
              name="utilization"
              value={formData.utilization}
              onChange={handleChange}
            />
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <label>Volume</label>
            <input
              type="number"
              className="form-control"
              name="volume"
              value={formData.volume}
              onChange={handleChange}
            />
          </div>
          <div className="form-group col-lg-12 col-md-12">
            <label>Max Volume</label>
            <input
              type="number"
              className="form-control"
              name="volumeMax"
              value={formData.volumeMax}
              onChange={handleChange}
            />
          </div>
          <div className="form-group col-lg-12 col-md-12">
            <label style={{ fontWeight: "bold", marginTop: "10px" }}>
              Enter Property Coordinates :
            </label>
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
            <label>Address</label>
            <input
              type="text"
              className="form-control"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <label>Zip Code</label>
            <input
              type="text"
              className="form-control"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
            />
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <label>Price</label>
            <input
              type="number"
              className="form-control"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <label>Rooms</label>
            <input
              type="number"
              step="any"
              className="form-control"
              name="rooms"
              value={formData.rooms}
              onChange={handleChange}
            />
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <label>Site Score</label>
            <input
              type="number"
              step="any"
              className="form-control"
              name="siteScore"
              value={formData.siteScore}
              onChange={handleChange}
            />
          </div>

          <div className="col-lg-12 col-md-12">
            <button
              disabled={!address}
              type="submit"
              className={
                address
                  ? "default-btn border-radius-5"
                  : "default p-2 bg-gray border-radius-5"
              }
            >
              Create Item
            </button>
          </div>
          <span className="mt-3" style={{ color: "red" }}>
            {" "}
            {address ? "" : "Please Connect your Crypto Wallet.....!"}
          </span>
        </div>
      </form>
    </div>
  );
};

export default CollectionForm;
