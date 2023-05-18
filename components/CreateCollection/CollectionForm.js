import React, {useState} from "react";
import Link from "next/link";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { useAddress } from "@thirdweb-dev/react";

const CollectionForm = () => {
  const [mediaPreview, setMediaPreview] = React.useState("");
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
    const { name, files } = e.target;
    setMediaPreview(window.URL.createObjectURL(files[0]));
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
      coordinates: "",
      address: "",
      zipCode: "",
      price: "",
      priceType: "",
      rooms: "",
      siteScore: "",
    });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
  };
  return (
    <div className="collection-form">
      <div className="profile-outer">
        <h3>Upload File</h3>
        <div className="profileButton">
          <input
            className="profileButton-input"
            type="file"
            name="media"
            accept="image/*, application/pdf"
            onChange={handleChange1}
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
            <label>Property Type</label>
            <input
              type="text"
              className="form-control col-lg-6 col-md-12"
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
            />
          </div>
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
          <div className="form-group col-lg-6 col-md-12">
            <label>Max Volume</label>
            <input
              type="number"
              className="form-control"
              name="volumeMax"
              value={formData.volumeMax}
              onChange={handleChange}
            />
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <label>Coordinates</label>
            <input
              type="text"
              className="form-control"
              name="coordinates"
              value={formData.coordinates}
              onChange={handleChange}
            />
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
            <label>Price Type</label>
            <input
              type="text"
              className="form-control"
              name="priceType"
              value={formData.priceType}
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
           <span className="mt-3" style={{color:"red"}}> {address?'':"Please Connect your Crypto Wallet.....!"}</span>
        </div>
      </form>
    </div>
  );
};

export default CollectionForm;
