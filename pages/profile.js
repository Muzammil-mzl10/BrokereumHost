import NavbarTwo from "../components/Layout/NavbarTwo";
import PageBanner from "../components/Common/PageBanner";
import Footer from "../components/Layout/Footer";
import Copyright from "../components/Common/Copyright";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { useState , useEffect } from "react";
import Multiselect from "multiselect-react-dropdown";
import Navbar from "../components/Layout/Navbar";
import ReactFacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";
import { useAddress } from "@thirdweb-dev/react";
import axios from "axios";

const Login = () => {
  const [file, setFile] = useState();
   const [userData, setUserData] = useState();
  const [IDDocument, setIDDocument] = useState();
  const address = useAddress();
  const [area, setarea] = useState([
    "AG",
    "AR",
    "AI",
    "BL",
    "BS",
    "BE",
    "FR",
    "GE",
    "GL",
    "GR",
    "JU",
    "LU",
    "NE",
    "NW",
    "OW",
    "SH",
    "SZ",
    "SO",
    "SG",
    "TG",
    "TI",
    "UR",
    "VS",
    "VD",
    "ZG",
    "ZH",
  ]);
  const [userDataID, setUSerDataID] = useState()

  const [selectedAREA , setSelectAREA] = useState([])
  const [formData, setFormData] = useState({
    firstName: "",
    lastName:"",
    email: "",
    phoneNumber: "",
    companyName: "",
    website: "",
    companyAddress: "",
    about: "",
    Broker: "",
    Buyer: "",
    Seller: "",
    Notaries: "",
    walletAddress: address,
    country: "",
    Language: "",
    IDDocument:""
  });
  const options = [
    "Germany",
    "France",
    "SwitZerland",
    "Norway",
    "Spain",
  ];
  const Languageoptions = [
    "EN",
    "DE",
    "FR",
    "IT"
  ];

  const countryTypeChange = (e) => {
    console.log(e);
    formData.country = e.value;
  };

  const LanguageTypeChange = (e) => {
    console.log(e);
    formData.Language = e.value;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const radioButtonSeller = (e) => {
    if (formData.Seller == "") {
      setFormData((prevData) => ({
        ...prevData,
        Seller: "Seller",
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        Seller: "",
      }));
    }
  };
  const radioButtonBuyer = (e) => {
    if (formData.Buyer == "") {
      setFormData((prevData) => ({
        ...prevData,
        Buyer: "Buyer",
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        Buyer: "",
      }));
    }
  };
  const radioButtonNotaries = (e) => {
    if (formData.Notaries == "") {
      setFormData((prevData) => ({
        ...prevData,
        Notaries: "Notaries",
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        Notaries: "",
      }));
    }
  };
  const radioButtonBroker = (e) => {
    if (formData.Broker == "") {
      setFormData((prevData) => ({
        ...prevData,
        Broker: "Broker",
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        Broker: "",
      }));
    }
  };

  const responseFacebook = (e) => {
    console.log("Auth completed");
    console.log(e);
  };
  const responseGoogle = (e) => {
    console.log("Auth completed");
    console.log(e);
    };
  const formSubmit = (e) => {
    console.log(file)
    e.preventDefault()

    console.log(formData)
    // axios.post("http://localhost:1337/api/upload", file).then((res) => {

      console.log(res)
      
      const userData = JSON.stringify({
        "data": {
          "firstName": formData.firstName,
          "lastName": formData.lastName,
          "Email": formData.email,
          "profilePicture": file,
          "IDDocument": IDDocument,
          "Website": formData.website,
          "Address": formData.companyAddress,
          "Country": formData.country,
          "Company": formData.companyName,
          "phoneNumber": formData.phoneNumber,
          "About": formData.about,
          "Language": formData.Language,
          "area": selectedAREA,
          "walletAddress": address,
          "userType": {
            "Broker": formData.Broker,
            "Buyer": formData.Buyer,
            "Seller": formData.Seller,
            "Notaries": formData.Notaries,
          },
        },
      });
      console.log(userData)
      fetch(`http://localhost:1337/api/brokereum-user`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },

        body: userData,
      })
        .then((res) => {
          if (res.ok) {
            console.log(res);
            toast.success("Data Saved Successfully!", {
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
            toast.error("🦄 Error while Saving!", {
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
          toast.error("🦄 Error while Saving!", {
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
   
  }
  const areaSelected = (e) => {
    console.log(e)
     setSelectAREA(e)
  }
  const areaRemoved = (e) => {
    setSelectAREA(e)
  };

   const fetchUserInfo = () => {
     if (address) {
       fetch(
         `http://localhost:1337/api/brokereum-user/?filters[walletAddress][$eq]=${address}`
       )
         .then((res) => res.json())
         .then((res) => {
          
           if (res.data[0]) {
             setUSerDataID(res.data[0].id)
             setUserData(res.data[0].attributes);
             console.log(userData)

           } else {
             setFormData({
               firstName: "",
               lastName: "",
               email: "",
               phoneNumber: "",
               companyName: "",
               website: "",
               companyAddress: "",
               about: "",
               Broker: "",
               Buyer: "",
               Seller: "",
               Notaries: "",
               walletAddress: address,
               country: "",
               Language: "",
               IDDocument: ""
             })
             setUserData();
           }
         });
     }
  };
  
  useEffect(() => {
    if (userData) {
      setSelectAREA(userData.area);
      setFormData({
        firstName: userData?.firstName,
        lastName: userData?.lastName,
         email: userData?.Email,
         phoneNumber: userData?.phoneNumber,
         companyName: userData?.Company,
         website: userData?.Website,
         companyAddress: userData?.Address,
         about: userData?.About,
         Broker: userData?.userType.Broker,
         Buyer: userData?.userType.Buyer,
         Seller: userData?.userType.Seller,
         Notaries: userData?.userType.Notaries,
         walletAddress: address,
         country: userData?.Country,
         Language: userData?.Language,
         IDDocument: "",
       });
      }
  },[userData])


  const formUpdateSubmit = async(e) => {
     e.preventDefault();

     console.log(formData);
     const userData = JSON.stringify({
       "data": {
         "firstName": formData.firstName,
         "lastName": formData.lastName,
         "Email": formData.email,
         "profilePicture": file,
         "IDDocument": IDDocument,
         "Website": formData.website,
         "Address": formData.companyAddress,
         "Country": formData.country,
         "Company": formData.companyName,
         "phoneNumber": formData.phoneNumber,
         "About": formData.about,
         "Language": formData.Language,
         "area": selectedAREA,
         "walletAddress": address,
         "userType": {
           "Broker": formData.Broker,
           "Buyer": formData.Buyer,
           "Seller": formData.Seller,
           "Notaries": formData.Notaries,
         },
       },
     });
     console.log(userData);
     axios
       .put(
         `http://localhost:1337/api/brokereum-user/${userDataID}`,
         userData,
         {
           headers: {
             "Content-type": "application/json",
           },
         }
       )
       .then((res) => {
         
         if (res.status==200) {
           toast.success("Data Updated Successfully!", {
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
           toast.error("🦄 Error while Updating!", {
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
         toast.error("🦄 Error while Saving!", {
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
  }


   useEffect(() => {
     fetchUserInfo();
   }, [address]);

  return (
    <>
      <Navbar />
      <PageBanner
        bannerHeading="Profile"
        parentTitle="Pages"
        pageTitle="Details"
        bg="inner-bg4"
      />

      <div className="user-area pt-100 pb-70">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-12">
              <div className="user-all-form">
                <div className="contact-form">
                  {!userData ? (
                    <>
                      <h3>Enter your Personal Information</h3>
                      <form onSubmit={formSubmit} id="contactForm">
                        <div className="row">
                          <div className="col-lg-12 ">
                            <div className="form-group">
                              <label>Profile Picture</label>
                              <br />
                              <input
                                className="profileButton-input"
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                                name="media"
                                data-error="Please enter your Profile Picture"
                              />
                            </div>
                          </div>
                          <div className="col-lg-6 ">
                            <div className="form-group">
                              <label>
                                First Name{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                onChange={handleChange}
                                name="firstName"
                                id="firstName"
                                value={formData.firstName}
                                className="form-control"
                                required
                                data-error="Please enter your First Name"
                              />
                            </div>
                          </div>
                          <div className="col-lg-6 ">
                            <div className="form-group">
                              <label>
                                Last Name <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                onChange={handleChange}
                                name="lastName"
                                id="lastName"
                                value={formData.lastName}
                                className="form-control"
                                required
                                data-error="Please enter your Last Name"
                              />
                            </div>
                          </div>

                          <div className="col-6">
                            <div className="form-group">
                              <label>
                                Email <span className="text-danger">*</span>
                              </label>
                              <input
                                className="form-control"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                name="email"
                                required
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="form-group">
                              <label>
                                Phone Number{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <input
                                className="form-control"
                                type="text"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                name="phoneNumber"
                                required
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="form-group">
                              <label>
                                Company Name{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <input
                                className="form-control"
                                type="text"
                                value={formData.companyName}
                                onChange={handleChange}
                                name="companyName"
                                required
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="form-group">
                              <label>
                                Website <span className="text-danger">*</span>
                              </label>
                              <input
                                className="form-control"
                                type="text"
                                value={formData.website}
                                onChange={handleChange}
                                name="website"
                                required
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="form-group">
                              <label>
                                Company Address{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <textarea
                                className="form-control"
                                type="text"
                                value={formData.companyAddress}
                                onChange={handleChange}
                                name="companyAddress"
                                cols={30}
                                row={30}
                                required
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="form-group">
                              <label>
                                About <span className="text-danger">*</span>
                              </label>
                              <textarea
                                className="form-control"
                                type="text"
                                value={formData.about}
                                onChange={handleChange}
                                name="about"
                                cols={30}
                                row={30}
                                required
                              />
                            </div>
                          </div>

                          <div className="form-group col-lg-6 col-md-12">
                            <label>
                              Country <span className="text-danger">*</span>
                            </label>
                            <Dropdown
                              options={options}
                              onChange={countryTypeChange}
                              placeholder="Select an option"
                              value={formData.country}
                              required
                            />
                          </div>
                          <div className="form-group col-lg-6 col-md-12">
                            <label>
                              Language <span className="text-danger">*</span>
                            </label>
                            <Dropdown
                              options={Languageoptions}
                              onChange={LanguageTypeChange}
                              placeholder="Select an option"
                              required
                            />
                          </div>
                          <div className="form-group col-lg-6 col-md-12">
                            <label>
                              Select Area <span className="text-danger">*</span>
                            </label>
                            <Multiselect
                              onSelect={areaSelected}
                              onRemove={areaRemoved}
                              isObject={false}
                              options={area} // Options to display in the dropdown
                              displayValue="select area" // Property name to display in the dropdown options
                              required
                            />
                          </div>
                          <div className="side-bar-widget">
                            <label>
                              Select Tags <span className="text-danger">*</span>
                            </label>
                            <ul className="side-bar-widget-tag">
                              <li
                                onClick={radioButtonSeller}
                                id="Seller"
                                className={
                                  formData.Seller == "" ? "" : "bg-danger"
                                }
                                style={{ cursor: "pointer" }}
                              >
                                <a>Seller</a>
                              </li>
                              <li
                                onClick={radioButtonBuyer}
                                className={
                                  formData.Buyer == "" ? "" : "bg-danger"
                                }
                                style={{ cursor: "pointer" }}
                                id="Buyer"
                              >
                                <a>Buyer</a>
                              </li>
                              <li
                                id="Broker"
                                onClick={radioButtonBroker}
                                className={
                                  formData.Broker == "" ? "" : "bg-danger"
                                }
                                style={{ cursor: "pointer" }}
                              >
                                <a>Broker</a>
                              </li>
                              <li
                                id="Notaries"
                                className={
                                  formData.Notaries == "" ? "" : "bg-danger"
                                }
                                onClick={radioButtonNotaries}
                                style={{ cursor: "pointer" }}
                              >
                                Notary
                              </li>
                            </ul>
                          </div>
                          <div className="col-lg-12 ">
                            <div className="form-group">
                              <label>
                                Upload ID Document{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <br />
                              <input
                                className="profileButton-input"
                                type="file"
                                onChange={(e) =>
                                  setIDDocument(e.target.files[0])
                                }
                                name="media"
                                required
                                data-error="Please enter your ID Document"
                              />
                            </div>
                          </div>

                          {/* <div className="col-lg-12 form-condition">
                        <div className="agree-label">
                          <input type="checkbox" id="chb1" />
                          <label htmlFor="chb1">
                            Remember Me
                            <Link href="/forgot-password">
                              <a className="forget">Forgot My Password?</a>
                            </Link>
                          </label>
                        </div>
                      </div> */}

                          <div className="col-lg-12 col-md-12 text-center">
                            <button
                              type="submit"
                              disabled={!address}
                              className={
                                address
                                  ? "default-btn"
                                  : "btn-disabled py-3 px-5 rounded "
                              }
                            >
                              Submit
                            </button>
                            {address ? (
                              ""
                            ) : (
                              <p className="text-danger">
                                Please Connect your wallet first
                              </p>
                            )}
                          </div>

                          <div className="col-12">
                            <div className="sub-title">
                              <span>Or</span>
                            </div>
                          </div>

                          <div className="login-with-account w-24 d-flex justify-content-center align-items-center">
                            <ul>
                              <li>
                                <ReactFacebookLogin
                                  appId="387146413112611" //APP ID NOT CREATED YET
                                  fields="name,email,picture"
                                  callback={responseFacebook}
                                  className=""
                                />
                              </li>

                              <li className="d-flex justify-content-center align-items-center">
                                <GoogleLogin
                                  clientId="963336589187-hh5a8m67cd54jgoqeob02hlgqmktbrtt.apps.googleusercontent.com" //CLIENTID NOT CREATED YET
                                  buttonText="LOGIN WITH GOOGLE"
                                  onSuccess={responseGoogle}
                                  style={{
                                    padding: "5px 13px 5px 13px !important;",
                                  }}
                                  // onFailure={responseGoogle}
                                />
                              </li>
                            </ul>
                          </div>
                        </div>
                      </form>
                    </>
                  ) : (
                    <>
                      <h3>Edit your Personal Information</h3>
                      <form onSubmit={formUpdateSubmit} id="contactForm">
                        <div className="row">
                          <div className="col-lg-12 ">
                            <div className="form-group">
                              <label>Profile Picture</label>
                              <br />
                              <input
                                className="profileButton-input"
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                                name="media"
                                data-error="Please enter your Profile Picture"
                              />
                            </div>
                          </div>
                          <div className="col-lg-6 ">
                            <div className="form-group">
                              <label>
                                First Name{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                onChange={handleChange}
                                name="firstName"
                                id="firstName"
                                value={formData.firstName}
                                className="form-control"
                                required
                                data-error="Please enter your First Name"
                              />
                            </div>
                          </div>
                          <div className="col-lg-6 ">
                            <div className="form-group">
                              <label>
                                Last Name <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                onChange={handleChange}
                                name="lastName"
                                id="lastName"
                                value={formData.lastName}
                                className="form-control"
                                required
                                data-error="Please enter your Last Name"
                              />
                            </div>
                          </div>

                          <div className="col-6">
                            <div className="form-group">
                              <label>
                                Email <span className="text-danger">*</span>
                              </label>
                              <input
                                className="form-control"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                name="email"
                                required
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="form-group">
                              <label>
                                Phone Number{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <input
                                className="form-control"
                                type="text"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                name="phoneNumber"
                                required
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="form-group">
                              <label>
                                Company Name{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <input
                                className="form-control"
                                type="text"
                                value={formData.companyName}
                                onChange={handleChange}
                                name="companyName"
                                required
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="form-group">
                              <label>
                                Website <span className="text-danger">*</span>
                              </label>
                              <input
                                className="form-control"
                                type="text"
                                value={formData.website}
                                onChange={handleChange}
                                name="website"
                                required
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="form-group">
                              <label>
                                Company Address{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <textarea
                                className="form-control"
                                type="text"
                                value={formData.companyAddress}
                                onChange={handleChange}
                                name="companyAddress"
                                cols={30}
                                row={30}
                                required
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="form-group">
                              <label>
                                About <span className="text-danger">*</span>
                              </label>
                              <textarea
                                className="form-control"
                                type="text"
                                value={formData.about}
                                onChange={handleChange}
                                name="about"
                                cols={30}
                                row={30}
                                required
                              />
                            </div>
                          </div>

                          <div className="form-group col-lg-6 col-md-12">
                            <label>
                              Country <span className="text-danger">*</span>
                            </label>
                            <Dropdown
                              options={options}
                              onChange={countryTypeChange}
                              placeholder="Select an option"
                              value={formData.country}
                              required
                            />
                          </div>
                          <div className="form-group col-lg-6 col-md-12">
                            <label>
                              Language <span className="text-danger">*</span>
                            </label>
                            <Dropdown
                              options={Languageoptions}
                              onChange={LanguageTypeChange}
                              placeholder="Select an option"
                              value={formData.Language}
                              required
                            />
                          </div>
                          <div className="form-group col-lg-6 col-md-12">
                            <label>
                              Select Area <span className="text-danger">*</span>
                            </label>
                            <Multiselect
                              onSelect={areaSelected}
                              onRemove={areaRemoved}
                              isObject={false}
                              selectedValues={selectedAREA}
                              options={area} // Options to display in the dropdown
                              // Property name to display in the dropdown options
                              required
                            />
                          </div>
                          <div className="side-bar-widget">
                            <label>
                              Select Tags <span className="text-danger">*</span>
                            </label>
                            <ul className="side-bar-widget-tag">
                              <li
                                onClick={radioButtonSeller}
                                id="Seller"
                                className={
                                  formData.Seller == "" ? "" : "bg-danger"
                                }
                                style={{ cursor: "pointer" }}
                              >
                                <a>Seller</a>
                              </li>
                              <li
                                onClick={radioButtonBuyer}
                                className={
                                  formData.Buyer == "" ? "" : "bg-danger"
                                }
                                style={{ cursor: "pointer" }}
                                id="Buyer"
                              >
                                <a>Buyer</a>
                              </li>
                              <li
                                id="Broker"
                                onClick={radioButtonBroker}
                                className={
                                  formData.Broker == "" ? "" : "bg-danger"
                                }
                                style={{ cursor: "pointer" }}
                              >
                                <a>Broker</a>
                              </li>
                              <li
                                id="Notaries"
                                className={
                                  formData.Notaries == "" ? "" : "bg-danger"
                                }
                                onClick={radioButtonNotaries}
                                style={{ cursor: "pointer" }}
                              >
                                Notary
                              </li>
                            </ul>
                          </div>
                          <div className="col-lg-12 ">
                            <div className="form-group">
                              <label>
                                Upload ID Document{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <br />
                              <input
                                className="profileButton-input"
                                type="file"
                                onChange={(e) =>
                                  setIDDocument(e.target.files[0])
                                }
                                name="media"
                                required
                                data-error="Please enter your ID Document"
                              />
                            </div>
                          </div>

                          {/* <div className="col-lg-12 form-condition">
                        <div className="agree-label">
                          <input type="checkbox" id="chb1" />
                          <label htmlFor="chb1">
                            Remember Me
                            <Link href="/forgot-password">
                              <a className="forget">Forgot My Password?</a>
                            </Link>
                          </label>
                        </div>
                      </div> */}

                          <div className="col-lg-12 col-md-12 text-center">
                            <button
                              type="submit"
                              disabled={!address}
                              className={
                                address
                                  ? "default-btn"
                                  : "btn-disabled py-3 px-5 rounded "
                              }
                            >
                              Update
                            </button>
                            {address ? (
                              ""
                            ) : (
                              <p className="text-danger">
                                Please Connect your wallet first
                              </p>
                            )}
                          </div>

                          <div className="col-12">
                            <div className="sub-title">
                              <span>Or</span>
                            </div>
                          </div>

                          <div className="login-with-account w-24 d-flex justify-content-center align-items-center">
                            <ul>
                              <li>
                                <ReactFacebookLogin
                                  appId="387146413112611" //APP ID NOT CREATED YET
                                  fields="name,email,picture"
                                  callback={responseFacebook}
                                  className=""
                                />
                              </li>

                              <li className="d-flex justify-content-center align-items-center">
                                <GoogleLogin
                                  clientId="963336589187-hh5a8m67cd54jgoqeob02hlgqmktbrtt.apps.googleusercontent.com" //CLIENTID NOT CREATED YET
                                  buttonText="LOGIN WITH GOOGLE"
                                  onSuccess={responseGoogle}
                                  style={{
                                    padding: "5px 13px 5px 13px !important;",
                                  }}
                                  // onFailure={responseGoogle}
                                />
                              </li>
                            </ul>
                          </div>
                        </div>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
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
      <Footer />
      <Copyright />
    </>
  );
};

export default Login;
