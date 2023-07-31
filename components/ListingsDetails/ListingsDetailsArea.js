import React, { useEffect, useState } from "react";
import NFTDetailsDescription from "./ListingsDetailsDescription";
import NFTDetailsHistory from "./ListingsDetailsHistory";
import NFTDetailsUser from "./ListingsDetailsUser";
import { ThirdwebSDK } from "@thirdweb-dev/sdk/evm";
import HashLoader from "react-spinners/HashLoader";
import OverlayImage from "../ItemDetails/Overlay";
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

const ItemDetailsArea = ({ tokenID }) => {
  const [loading, setLoading] = useState(true)
  const [ipfsData, setipfsData] = useState();
   const [marketplaceModule, setMarketplaceModule] = useState();
   const [NFT, setNFT] = useState();
   const sdk = new ThirdwebSDK("mumbai", {
     clientId: process.env.thirdweb_CLIENTID,
   });
   console.log(tokenID);

   useEffect(async () => {
     setMarketplaceModule(
       await sdk.getContract(process.env.Marketplace_Contract)
     );
   }, []);

   useEffect(async () => {
     console.log(marketplaceModule);
     if (marketplaceModule) {
       setNFT(
         await marketplaceModule.englishAuctions.getAuction(
          tokenID
         )
       )
      }
    }, [marketplaceModule]);
    
    useEffect(() => {
      console.log(NFT?.metadata.properties.IPFSHash);
      fetch(NFT?.metadata.properties.IPFSHash)
        .then((res) => res.json())
        .then((res) => {
          setipfsData(res.propertyData);
          console.log(res.propertyData);
          setSateliteImg(res.parcelData.image_urls.satellite_image);
          setWorldTopoImg(res.parcelData.image_urls.world_topo_image);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }, [NFT]);

   console.log(NFT);

  
  return (
    <>
      <div
        style={
          loading
            ? { marginTop: "40px", marginBottom: "100px" }
            : { marginTop: "0px", marginBottom: "0px" }
        }
        className={
          loading
            ? "d-flex justify-content-center align-items-center"
            : "item-details-area pt-100 pb-70"
        }
      >
        {loading && ipfsData == undefined ? (
          <HashLoader className="mt-5" size={150} color="#F14D5D" />
        ) : (
          <div className="container">
            <div className="row">
              <div className="col-lg-7">
                <div className="item-details-left-side pr-20">
                  <div className="item-details-img">
                    <Carousel showArrows={true}>
                      <div>
                        <img src={NFT?.metadata.image} alt="Images" />
                      </div>
                      {/* <div>
                        <img
                          src={ipfsData.image_urls.parcel_image}
                          alt="Images"
                        />
                      </div> */}
                      <div>
                        <img src={satelitleImg} alt="Images" />
                      </div>
                      <div>
                        <img src={worktopoImg} alt="Images" />
                      </div>
                      {/* <OverlayImage
                        image1={ipfsData?.image_urls.satellite_image}
                        image2={ipfsData?.image_urls.world_topo_image}
                      /> */}
                      {/* <div>
                        <img src={NFT.metadata.image} alt="Images" />
                      </div> */}
                    </Carousel>

                    {/* <span>
                    <i className="ri-heart-line"></i> 30
                  </span> */}
                  </div>
                  <div
                    style={{
                      backgroundColor: "whitesmoke",
                      borderRadius: "20px",
                    }}
                    className="px-3 py-5"
                  >
                    <div className="section-title px-2">
                      <div className="fs-5">Description</div>
                      <hr />
                      <p>{NFT.metadata.description}</p>
                    </div>
                  </div>
                  <div
                    className="mt-5 px-3 py-5"
                    style={{
                      backgroundColor: "whitesmoke",
                      borderRadius: "20px",
                    }}
                  >
                    <div className="d-flex justify-content-between px-2">
                      <div className="fs-5">Address</div>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${NFT.metadata.lat},${NFT.metadata.lng}`}
                        target="_blank"
                        className="btn btn-success h4 "
                      >
                        Open in google maps
                      </a>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between mt-5 px-2">
                      <div>
                        <div>
                          Street
                          <b className="text-primary px-3">
                            : {ipfsData?.streetname}
                          </b>
                        </div>
                        <div className="my-2">
                          City
                          <b className="text-primary px-3">
                            : {ipfsData?.cityname}
                          </b>
                        </div>
                        <div>
                          Canton
                          <b className="text-primary px-3">
                            : {ipfsData? ipfsData.canton:""}
                          </b>
                        </div>
                      </div>
                      <div>
                        <div>
                          ZIP
                          <b
                            style={{ marginLeft: "65px" }}
                            className="text-primary"
                          >
                            : 45100
                          </b>
                        </div>
                        <div className="my-2">
                          Latitude
                          <b
                            style={{ marginLeft: "30px" }}
                            className="text-primary "
                          >
                            : 4.87665
                          </b>
                        </div>
                        <div>
                          Longitude
                          <b
                            style={{ marginLeft: "20px" }}
                            className="text-primary "
                          >
                            : 8.542125
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
                    className="px-3 py-5 mt-5"
                  >
                    <div className="section-title px-2">
                      <div className="fs-5">Building</div>
                      <hr />
                      <div className="d-flex justify-content-between mt-5 px-2">
                        <div>
                          <div>
                            Bldg Constr Year
                            <b className="text-primary px-3">: Null</b>
                          </div>
                          <div className="my-2">
                            Bldg Flats
                            <b className="text-primary px-3">: Null</b>
                          </div>
                          <div>
                            Bldg Floors
                            <b className="text-primary px-3">: Null</b>
                          </div>
                        </div>
                        <div>
                          <div>
                            Bldg Size
                            <b
                              style={{ marginLeft: "30px" }}
                              className="text-primary"
                            >
                              : 0
                            </b>
                          </div>
                          <div className="my-2">
                            Bldg Vol
                            <b
                              style={{ marginLeft: "37px" }}
                              className="text-primary "
                            >
                              : 0
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
                    className="px-3 py-5 mt-5"
                  >
                    <div className="fs-5">Plot</div>
                    <hr />

                    <Accordion>
                      <AccordionItem>
                        <AccordionItemHeading>
                          <AccordionItemButton>
                            Parcel Information
                          </AccordionItemButton>
                        </AccordionItemHeading>
                        <AccordionItemPanel>
                          <div>
                            <div>
                              Parcel Area
                              <b className="text-primary px-3">: 2483.74</b>
                            </div>
                            <div className="my-2">
                              Ratio_S
                              <b className="text-primary px-3">: 0</b>
                            </div>
                            <div>
                              Ratio S Free
                              <b className="text-primary px-3">: 100</b>
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
                              <div>
                                Ratio V
                                <b
                                  style={{ marginLeft: "30px" }}
                                  className="text-primary"
                                >
                                  : 0
                                </b>
                              </div>
                              <div className="my-2">
                                Ratio V Free
                                <b
                                  style={{ marginLeft: "37px" }}
                                  className="text-primary "
                                >
                                  : 0
                                </b>
                              </div>
                            </div>
                            <div>
                              <div>
                                Ratio V Free
                                <b
                                  style={{ marginLeft: "30px" }}
                                  className="text-primary"
                                >
                                  : 100
                                </b>
                              </div>
                              <div className="my-2">
                                Area Max
                                <b
                                  style={{ marginLeft: "37px" }}
                                  className="text-primary "
                                >
                                  : 455.4
                                </b>
                              </div>
                              <div>
                                Vol Max
                                <b
                                  style={{ marginLeft: "30px" }}
                                  className="text-primary"
                                >
                                  : 4098.6
                                </b>
                              </div>
                            </div>
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
                    className="px-3 py-5 mt-5"
                  >
                    <div className="fs-5">Aditional Information</div>
                    <hr />

                    <Accordion>
                      <AccordionItem>
                        <AccordionItemHeading>
                          <AccordionItemButton>
                            Construction Zone
                          </AccordionItemButton>
                        </AccordionItemHeading>
                        <AccordionItemPanel>
                          <div className="d-flex justify-content-between">
                            <div>
                              <div>
                                CZ abbreveiation
                                <b className="text-primary px-3">: K</b>
                              </div>
                              <div className="my-2">
                                cz_floors_usual
                                <b className="text-primary px-3">: 3</b>
                              </div>
                              <div>
                                cz_height_usual
                                <b className="text-primary px-3">: 8</b>
                              </div>
                            </div>
                            <div>
                              <div>
                                CZ Local
                                <b className="text-primary px-3">: Null</b>
                              </div>
                              <div className="my-2">
                                CZ type
                                <b className="text-primary px-3">: DOM</b>
                              </div>
                              <div>
                                CZ Util EST
                                <b className="text-primary px-3">: 55</b>
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
                            <div>
                              <div>
                                Noise Bahn Night
                                <b
                                  style={{ marginLeft: "30px" }}
                                  className="text-primary"
                                >
                                  : 10
                                </b>
                              </div>
                              <div className="my-2">
                                Noise Bahn Day
                                <b
                                  style={{ marginLeft: "37px" }}
                                  className="text-primary "
                                >
                                  : 15
                                </b>
                              </div>
                            </div>
                            <div>
                              <div>
                                Noise Street Night
                                <b
                                  style={{ marginLeft: "30px" }}
                                  className="text-primary"
                                >
                                  : 60
                                </b>
                              </div>
                              <div className="my-2">
                                Noise Street Day
                                <b
                                  style={{ marginLeft: "37px" }}
                                  className="text-primary "
                                >
                                  : 42
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
                            <div>
                              <div>
                                TT Agglo Pubt
                                <b
                                  style={{ marginLeft: "30px" }}
                                  className="text-primary"
                                >
                                  : 14
                                </b>
                              </div>
                            </div>
                            <div>
                              <div>
                                TT Agglo Road
                                <b
                                  style={{ marginLeft: "30px" }}
                                  className="text-primary"
                                >
                                  : 13
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
                            <div>
                              <div>
                                Vac All
                                <b
                                  style={{ marginLeft: "30px" }}
                                  className="text-primary"
                                >
                                  : 0.17
                                </b>
                              </div>
                            </div>
                            <div>
                              <div>
                                Vac New
                                <b
                                  style={{ marginLeft: "30px" }}
                                  className="text-primary"
                                >
                                  : 0.01
                                </b>
                              </div>
                            </div>
                            <div>
                              <div>
                                Vac Old
                                <b
                                  style={{ marginLeft: "30px" }}
                                  className="text-primary"
                                >
                                  : 0.16
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
                            <div>
                              <div>
                                Tax 100k Pa
                                <b
                                  style={{ marginLeft: "30px" }}
                                  className="text-primary"
                                >
                                  : 15172
                                </b>
                              </div>
                            </div>
                            <div>
                              <div>
                                Tax Scale
                                <b
                                  style={{ marginLeft: "30px" }}
                                  className="text-primary"
                                >
                                  : 78.1
                                </b>
                              </div>
                            </div>
                          </div>
                        </AccordionItemPanel>
                      </AccordionItem>
                    </Accordion>
                  </div>

                  <div></div>

                  {/* <NFTDetailsHistory NFT={ NFT} /> */}
                </div>
              </div>

              <div className="col-lg-5">
                <div className="item-details-dsce">
                  <NFTDetailsDescription ipfsData={ipfsData} NFT={NFT} />
                  {/* <NFTDetailsUser NFT={NFT} /> */}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ItemDetailsArea;
