import NavbarTwo from "../components/Layout/NavbarTwo";
import PageBanner from "../components/Common/PageBanner";
import Footer from "../components/Layout/Footer";
import Copyright from "../components/Common/Copyright";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import Navbar from "../components/Layout/Navbar";
import ReactFacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";
import { useAddress } from "@thirdweb-dev/react";

const Login = () => {
  const [file, setFile] = useState();
  const address = useAddress();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profilePic: "",
    Broker: "",
    Buyer: "",
    Seller: "",
    Notaries: "",
    walletAddress: address,
  });

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
  const profilePicChange = (e) => {
  console.log(e)
}
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
    const userData = JSON.stringify({
      "data": {
        "userName": formData.name,
        "Email": formData.email,
        "profilePicture": file,
        "userType": {
          "Broker": formData.Broker,
          "Buyer": formData.Buyer,
          "Seller": formData.Seller,
          "Notaries": formData.Notaries,
        },
        "walletAddress": address
        
      }
    })
    console.log(userData)
      
      fetch(
        `http://localhost:1337/api/brokereum-user`,
        {
          method:"POST",
          headers: {
            "Content-type": "application/json",
          },
          
          body: userData,
        }
      ).then((res) => {
        if (res.ok) {
          
          console.log(res)
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
      }).catch((err) => {
        console.log(err)
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
      })
    }

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
                  <h3>Enter your Personal Information</h3>
                  <form onSubmit={formSubmit} id="contactForm">
                    <div className="row">
                      <div className="col-lg-12 ">
                        <div className="form-group">
                          <label>Profile Picture</label>
                          <input
                            className="profileButton-input"
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            name="media"
                            data-error="Please enter your Profile Picture"
                          />
                        </div>
                      </div>
                      <div className="col-lg-12 ">
                        <div className="form-group">
                          <label>Name</label>
                          <input
                            type="text"
                            onChange={handleChange}
                            name="name"
                            id="name"
                            value={formData.name}
                            className="form-control"
                            required
                            data-error="Please enter your Username"
                          />
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-group">
                          <label>Email</label>
                          <input
                            className="form-control"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            name="email"
                          />
                        </div>
                      </div>
                      <div className="side-bar-widget">
                        <label>Select Tag</label>
                        <ul className="side-bar-widget-tag">
                          <li
                            onClick={radioButtonSeller}
                            id="Seller"
                            className={formData.Seller == "" ? "" : "bg-danger"}
                            style={{ cursor: "pointer" }}
                          >
                            <a>Seller</a>
                          </li>
                          <li
                            onClick={radioButtonBuyer}
                            className={formData.Buyer == "" ? "" : "bg-danger"}
                            style={{ cursor: "pointer" }}
                            id="Buyer"
                          >
                            <a>Buyer</a>
                          </li>
                          <li
                            id="Broker"
                            onClick={radioButtonBroker}
                            className={formData.Broker == "" ? "" : "bg-danger"}
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <Copyright />
    </>
  );
};

export default Login;
