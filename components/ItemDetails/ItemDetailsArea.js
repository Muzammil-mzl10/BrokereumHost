import React, { useState, useEffect, useRef } from "react";
import ItemDetailsDescription from "./ItemDetailsDescription";
import ItemDetailsHistory from "./ItemDetailsHistory";
import ItemDetailsUser from "./ItemDetailsUser";
import { ThirdwebSDK } from "@thirdweb-dev/sdk/evm";
import OverlayImage from "./Overlay";
import { Swiper, SwiperSlide } from "swiper/react";
import {Autoplay, Navigation, Pagination} from "swiper"
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";



var Carousel = require("react-responsive-carousel").Carousel;
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";

// Demo styles, see 'Styles' section below for some notes on use.
import "react-accessible-accordion/dist/fancy-example.css";

const ItemDetailsArea = ({ tokenID, data }) => {
  const [ipfsData, setipfsData] = useState();
  const [marketplaceModule, setMarketplaceModule] = useState();
  const [satelitleImg, setSateliteImg] = useState();
  const [parcelImg, setParcelImg] = useState();
  const [worktopoImg, setWorldTopoImg] = useState();
  const sdk = new ThirdwebSDK("mumbai", {
    clientId: process.env.thirdweb_CLIENTID,
  });
  // console.log(tokenID);

   const progressCircle = useRef(null);
   const progressContent = useRef(null);
   const onAutoplayTimeLeft = (s, time, progress) => {
     progressCircle.current.style.setProperty("--progress", 1 - progress);
     progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
   };

 useEffect(() => {
   async function fetchMkData() {
     try {
       const marketplaceContract = await sdk.getContract(
         process.env.Marketplace_Contract
       );
       setMarketplaceModule(marketplaceContract);
     } catch (error) {
       console.error("Error fetching marketplace data:", error);
     }
   }
   fetchMkData();
 }, []);


  useEffect(() => {
    async function fetchIpfsData() {
      try {
        console.log(data?.asset.properties.IPFSHash);
        const response = await fetch(data?.asset.properties.IPFSHash);
        const ipfsData = await response.json();
        setipfsData(ipfsData.parcelData);
        console.log(ipfsData.parcelData);
        setSateliteImg(ipfsData.parcelData.image_urls.satellite_image);
        setParcelImg(ipfsData.parcelData.image_urls.world_topo_image);
        let parcelimg = ipfsData.parcelData.image_urls.parcel_image.replace(
          "<Your_Token_Here>",
          "DNfbHaqajFigz4jPX9B8vnatUduLKZXVwA83WKZG"
        );
        console.log(parcelimg)
        setWorldTopoImg(parcelimg);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchIpfsData();
  }, [data]);
  // console.log(satelitleImg)

  const [days, setDays] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");

  const comingSoonTime = () => {
    const endTimeInSeconds = data?.endTimeInSeconds; // Set the endTimeInSeconds variable
    const now = Math.floor(Date.now() / 1000); // Convert milliseconds to seconds
    const timeLeft = endTimeInSeconds - now;

    if (timeLeft > 0) {
      const countdays = Math.floor(timeLeft / 86400);
      const counthours = Math.floor((timeLeft % 86400) / 3600);
      const countminutes = Math.floor((timeLeft % 3600) / 60);
      const countseconds = Math.floor(timeLeft % 60);

      setDays(countdays);
      setHours(counthours);
      setMinutes(countminutes);
      setSeconds(countseconds);
    } else {
      // Bidding is over
      setDays(0);
      setHours(0);
      setMinutes(0);
      setSeconds(0);
    }
  };

  // console.log(data)
  useEffect(() => {
    const interval = setInterval(() => {
      comingSoonTime();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [data]);

  return (
    <>
      <div className="item-details-area pt-100 pb-70">
        <div className="container">
          <div className="row">
            <div className="col-lg-7">
              <div className="item-details-left-side pr-20">
                <div className="item-details-img">
                  {/* {satelitleImg && worktopoImg ? (
                    <>
                      <OverlayImage
                        image1={satelitleImg}
                        image2={worktopoImg}
                      />
                    </>
                  ) : (
                    ""
                  )} */}
                  {/* <span>
                    <i className="ri-heart-line"></i> 340
                  </span> */}
                </div>
                {satelitleImg && worktopoImg && parcelImg && (
                  <Swiper
                    spaceBetween={30}
                    centeredSlides={true}
                    autoplay={{
                      delay: 2500,
                      disableOnInteraction: false,
                    }}
                    pagination={{
                      clickable: true,
                    }}
                    navigation={true}
                    modules={[Autoplay, Pagination, Navigation]}
                    onAutoplayTimeLeft={onAutoplayTimeLeft}
                    className="mySwiper"
                  >
                    <SwiperSlide>
                      <div className="img-responsive">
                        <img
                          src={satelitleImg}
                          alt="Background"
                          className="worktopoImg"
                        />
                        <img
                          src={worktopoImg}
                          alt="Overlay"
                          className="worktopoImg"
                        />
                      </div>
                    </SwiperSlide>
                    <SwiperSlide>
                      <div className="img-responsive">
                        <img
                          src={satelitleImg}
                          alt="Background"
                          className="worktopoImg"
                        />
                      </div>
                    </SwiperSlide>
                    <SwiperSlide>
                      {" "}
                      <div  className="img-responsive">
                        <img
                          src={parcelImg}
                          alt="Overlay"
                          className="worktopoImg"
                        />
                      </div>
                    </SwiperSlide>
                    <SwiperSlide>
                      {" "}
                      <div  className="img-responsive">
                        <img
                          src={worktopoImg}
                          alt="Overlay"
                          className="worktopoImg"
                        />
                      </div>
                    </SwiperSlide>

                    <div className="autoplay-progress" slot="container-end">
                      <svg viewBox="0 0 48 48" ref={progressCircle}>
                        <circle cx="24" cy="24" r="20"></circle>
                      </svg>
                      <span ref={progressContent}></span>
                    </div>
                  </Swiper>
                )}

                {/* <Carousel showArrows={true}>
                  <div>
                    <img src={data?.asset.image} alt="Images" />
                  </div>
                  <div>
                    <img src={satelitleImg} alt="Images" />
                  </div>

                  <div>
                    <img src={worktopoImg} alt="Images" />
                  </div>
                </Carousel> */}

                {data && (
                  <div className="item-details-left-side pr-20">
                    {/* <div className="item-details-img"></div> */}
                    <div
                      style={{
                        backgroundColor: "whitesmoke",
                        borderRadius: "20px",
                      }}
                      className="px-3 py-3"
                    >
                      <div className="section-title px-2">
                        <div className="fs-5">Description</div>
                        <hr className="mt-0" />
                        <p className="pt-0">{data?.asset.description}</p>
                      </div>
                    </div>
                    <div
                      className="mt-2 px-3 py-3"
                      style={{
                        backgroundColor: "whitesmoke",
                        borderRadius: "20px",
                      }}
                    >
                      <div className="d-flex justify-content-between px-2">
                        <div className="fs-5">Address</div>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${data?.asset.lat},${data?.asset.lng}`}
                          target="_blank"
                          className="btn btn-success h4 "
                        >
                          Open in google maps
                        </a>
                      </div>
                      <hr className="mt-0" />
                      <div className="d-flex justify-content-between mt-2 px-2">
                        <div className="fw-bold">
                          <div>
                            Street
                            <b className="fw-normal px-4 mx-2">
                              {ipfsData?.address?.street}
                            </b>
                          </div>
                          <div className="my-0">
                            City
                            <b className="fw-normal  mx-5">
                              {ipfsData?.address?.city}
                            </b>
                          </div>
                          <div>
                            Canton
                            <b className="fw-normal px-3 mx-2">
                              {ipfsData ? ipfsData?.address?.canton : ""}
                            </b>
                          </div>
                        </div>
                        <div className="fw-bold">
                          <div>
                            ZIP
                            <b
                              style={{ marginLeft: "70px" }}
                              className="fw-normal"
                            >
                              {ipfsData?.address?.zip}
                            </b>
                          </div>
                          <div className="my-0">
                            Latitude
                            <b
                              style={{ marginLeft: "32px" }}
                              className="fw-normal "
                            >
                              {parseFloat(data?.asset.lat).toFixed(5)}
                            </b>
                          </div>
                          <div>
                            Longitude
                            <b
                              style={{ marginLeft: "20px" }}
                              className="fw-normal "
                            >
                              {parseFloat(data?.asset.lng).toFixed(5)}
                            </b>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        backgroundColor: "whitesmoke",
                        borderRadius: "20px",
                      }}
                      className="px-3 py-3 mt-2"
                    >
                      <div className="section-title px-2">
                        <div className="fs-5">Building</div>
                        <hr className="mt-0" />
                        <div className="d-flex justify-content-between mt-2 px-0">
                          <div>
                            <div className="fw-bold">
                              Bldg Constr Year
                              <b className="fw-normal px-1">
                                {ipfsData?.building?.bldg_constr_year}
                              </b>
                            </div>
                            <div className="my-0 fw-bold">
                              Bldg Flats
                              <b className="fw-normal px-5 mx-2">
                                {ipfsData?.building?.bldg_flats}
                              </b>
                            </div>
                            <div className="fw-bold">
                              Bldg Floors
                              <b className="fw-normal px-5">
                                {ipfsData?.building?.bldg_floors}
                              </b>
                            </div>
                          </div>
                          <div>
                            <div className="fw-bold">
                              Bldg Size
                              <b
                                style={{ marginLeft: "30px" }}
                                className="fw-normal"
                              >
                                {ipfsData?.building?.bldg_size}
                              </b>
                            </div>
                            <div className="my-0 fw-bold">
                              Bldg Vol
                              <b
                                style={{ marginLeft: "37px" }}
                                className="fw-normal "
                              >
                                {ipfsData?.building?.bldg_vol}
                              </b>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        backgroundColor: "whitesmoke",
                        borderRadius: "20px",
                      }}
                      className="px-4 py-3 mt-2"
                    >
                      <div className="fs-5">Plot</div>
                      <hr className="mt-0" />

                      <Accordion>
                        <AccordionItem>
                          <AccordionItemHeading>
                            <AccordionItemButton>
                              Parcel Information
                            </AccordionItemButton>
                          </AccordionItemHeading>
                          <AccordionItemPanel>
                            <div>
                              <div className="fw-bold">
                                Parcel Area
                                <b className="fw-normal px-3 mx-1">
                                  {ipfsData?.plot?.parcel_area}
                                </b>
                              </div>
                              <div className="my-0 fw-bold">
                                Ratio_S
                                <b className="fw-normal px-5">
                                  {ipfsData?.plot?.ratio_s}
                                </b>
                              </div>
                              <div className="fw-bold">
                                Ratio S Free
                                <b className="fw-normal px-2 mx-1">
                                  {ipfsData?.plot?.ratio_s_free}
                                </b>
                              </div>
                            </div>
                          </AccordionItemPanel>
                        </AccordionItem>
                        <AccordionItem>
                          <AccordionItemHeading>
                            <AccordionItemButton>Area</AccordionItemButton>
                          </AccordionItemHeading>
                          <AccordionItemPanel>
                            <div className="d-flex justify-content-between  px-2">
                              <div>
                                <div className="fw-bold">
                                  Ratio V
                                  <b
                                    style={{ marginLeft: "50px" }}
                                    className="fw-normal"
                                  >
                                    {ipfsData?.plot?.ratio_v}
                                  </b>
                                </div>
                                <div className="my-0 fw-bold">
                                  Ratio V Free
                                  <b
                                    style={{ marginLeft: "10px" }}
                                    className="fw-normal "
                                  >
                                    {ipfsData?.plot?.ratio_v_free}
                                  </b>
                                </div>
                                <div className="fw-bold">
                                  Ratio S Free
                                  <b
                                    style={{ marginLeft: "13px" }}
                                    className="fw-normal"
                                  >
                                    {ipfsData?.plot?.ratio_s_free}
                                  </b>
                                </div>
                              </div>
                              <di className="fw-bold" v>
                                <div className="my-0">
                                  Area Max
                                  <b
                                    style={{ marginLeft: "20px" }}
                                    className="fw-normal "
                                  >
                                    {ipfsData?.plot?.area_max}
                                  </b>
                                </div>
                                <div>
                                  Vol Max
                                  <b
                                    style={{ marginLeft: "33px" }}
                                    className="fw-normal"
                                  >
                                    {ipfsData?.plot?.vol_max}
                                  </b>
                                </div>
                                <div>
                                  Ratio S
                                  <b
                                    style={{ marginLeft: "40px" }}
                                    className="fw-normal"
                                  >
                                    {ipfsData?.plot?.ratio_s}
                                  </b>
                                </div>
                              </di>
                            </div>
                          </AccordionItemPanel>
                        </AccordionItem>
                      </Accordion>
                    </div>
                    <div
                      style={{
                        backgroundColor: "whitesmoke",
                        borderRadius: "20px",
                      }}
                      className="px-4 py-3 mt-2"
                    >
                      <div className="fs-5">Aditional Information</div>
                      <hr className="mt-0" />

                      <Accordion>
                        <AccordionItem>
                          <AccordionItemHeading>
                            <AccordionItemButton>
                              Construction Zone
                            </AccordionItemButton>
                          </AccordionItemHeading>
                          <AccordionItemPanel>
                            <div className="d-flex justify-content-between">
                              <div className="fw-bold">
                                <div>
                                  CZ abbreveiation
                                  <b className="fw-normal px-3">
                                    {ipfsData?.construction_zone?.cz_abbrev}
                                  </b>
                                </div>
                                <div className="my-0">
                                  CZ Floors Usual
                                  <b className="fw-normal px-1 mx-4">
                                    :{" "}
                                    {
                                      ipfsData?.construction_zone
                                        ?.cz_floors_usual
                                    }
                                  </b>
                                </div>
                                <div>
                                  CZ Height Usual
                                  <b className="fw-normal px-1 mx-3">
                                    :{" "}
                                    {
                                      ipfsData?.construction_zone
                                        ?.cz_height_usual
                                    }
                                  </b>
                                </div>
                              </div>
                              <div className="fw-bold">
                                <div>
                                  CZ Local
                                  <b className="fw-normal px-3 mx-3">
                                    {ipfsData?.construction_zone?.cz_local}
                                  </b>
                                </div>
                                <div className="my-0">
                                  CZ type
                                  <b className="fw-normal px-4 mx-3">
                                    {ipfsData?.construction_zone?.cz_type}
                                  </b>
                                </div>
                                <div>
                                  CZ Util EST
                                  <b className="fw-normal px-1 mx-2">
                                    {ipfsData?.construction_zone?.cz_util_est}
                                  </b>
                                </div>
                              </div>
                            </div>
                          </AccordionItemPanel>
                        </AccordionItem>
                        <AccordionItem>
                          <AccordionItemHeading>
                            <AccordionItemButton>Noise</AccordionItemButton>
                          </AccordionItemHeading>
                          <AccordionItemPanel>
                            <div className="d-flex justify-content-between  px-2">
                              <div className="fw-bold">
                                <div>
                                  Noise Bahn Night
                                  <b
                                    style={{ marginLeft: "30px" }}
                                    className="fw-normal"
                                  >
                                    {ipfsData?.noise?.noise_bahn_night}
                                  </b>
                                </div>
                                <div className="my-0">
                                  Noise Bahn Day
                                  <b
                                    style={{ marginLeft: "43px" }}
                                    className="fw-normal "
                                  >
                                    {ipfsData?.noise?.noise_bahn_day}
                                  </b>
                                </div>
                              </div>
                              <div className="fw-bold">
                                <div>
                                  Noise Street Night
                                  <b
                                    style={{ marginLeft: "24px" }}
                                    className="fw-normal"
                                  >
                                    {ipfsData?.noise?.noise_street_night}
                                  </b>
                                </div>
                                <div className="my-0">
                                  Noise Street Day
                                  <b
                                    style={{ marginLeft: "37px" }}
                                    className="fw-normal "
                                  >
                                    {ipfsData?.noise?.noise_street_day}
                                  </b>
                                </div>
                              </div>
                            </div>
                          </AccordionItemPanel>
                        </AccordionItem>
                        <AccordionItem>
                          <AccordionItemHeading>
                            <AccordionItemButton>Travel</AccordionItemButton>
                          </AccordionItemHeading>
                          <AccordionItemPanel>
                            <div className="d-flex justify-content-between  px-2">
                              <div className="fw-bold">
                                <div>
                                  TT Agglo Pubt
                                  <b
                                    style={{ marginLeft: "30px" }}
                                    className="fw-normal"
                                  >
                                    {ipfsData?.travel?.tt_agglo_pubt}
                                  </b>
                                </div>
                              </div>
                              <div className="fw-bold">
                                <div>
                                  TT Agglo Road
                                  <b
                                    style={{ marginLeft: "30px" }}
                                    className="fw-normal"
                                  >
                                    {ipfsData?.travel?.tt_agglo_road}
                                  </b>
                                </div>
                              </div>
                            </div>
                          </AccordionItemPanel>
                        </AccordionItem>
                        <AccordionItem>
                          <AccordionItemHeading>
                            <AccordionItemButton>Vacancies</AccordionItemButton>
                          </AccordionItemHeading>
                          <AccordionItemPanel>
                            <div className="d-flex justify-content-between  px-2">
                              <div className="fw-bold">
                                <div>
                                  Vac All
                                  <b
                                    style={{ marginLeft: "30px" }}
                                    className="fw-normal"
                                  >
                                    {ipfsData?.vacancies?.vac_all}
                                  </b>
                                </div>
                              </div>
                              <div className="fw-bold">
                                <div>
                                  Vac New
                                  <b
                                    style={{ marginLeft: "30px" }}
                                    className="fw-normal"
                                  >
                                    {ipfsData?.vacancies?.vac_new}
                                  </b>
                                </div>
                              </div>
                              <div className="fw-bold">
                                <div>
                                  Vac Old
                                  <b
                                    style={{ marginLeft: "30px" }}
                                    className="fw-normal"
                                  >
                                    {ipfsData?.vacancies?.vac_old}
                                  </b>
                                </div>
                              </div>
                            </div>
                          </AccordionItemPanel>
                        </AccordionItem>
                        <AccordionItem>
                          <AccordionItemHeading>
                            <AccordionItemButton>Tax</AccordionItemButton>
                          </AccordionItemHeading>
                          <AccordionItemPanel>
                            <div className="d-flex justify-content-between  px-2">
                              <div className="fw-bold">
                                <div>
                                  Tax 100k Pa
                                  <b
                                    style={{ marginLeft: "30px" }}
                                    className="fw-normal"
                                  >
                                    {ipfsData?.tax?.tax_100k_pa}
                                  </b>
                                </div>
                              </div>
                              <div className="fw-bold">
                                <div>
                                  Tax Scale
                                  <b
                                    style={{ marginLeft: "30px" }}
                                    className="fw-normal"
                                  >
                                    {ipfsData?.tax?.tax_scale}
                                  </b>
                                </div>
                              </div>
                            </div>
                          </AccordionItemPanel>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="col-lg-5 mt-lg-0 mt-md-0 mt-3">
              <div className="item-details-dsce">
                <ItemDetailsDescription
                  days={days}
                  hours={hours}
                  minutes={minutes}
                  seconds={seconds}
                  data={data}
                  ipfsData={ipfsData}
                />

                <ItemDetailsHistory data={data} />
                {/* <ItemDetailsUser /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemDetailsArea;
