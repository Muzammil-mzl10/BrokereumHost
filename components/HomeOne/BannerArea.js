import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAddress, ConnectWallet } from "@thirdweb-dev/react";
import { useWalletConnect } from "@thirdweb-dev/react";
const BannerArea = () => {
  //counter calculation
  const [days, setDays] = useState('');
   const walletaAddress = useAddress();
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
 
  const comingSoonTime = () => {
    let endTime = new Date('August 23, 2022 17:00:00 PDT');
    let endTimeParse = Date.parse(endTime) / 1000;
    let now = new Date();
    let nowParse = Date.parse(now) / 1000;
    let timeLeft = endTimeParse - nowParse;
    let countdays = Math.floor(timeLeft / 86400);
    let counthours = Math.floor((timeLeft - countdays * 86400) / 3600);
    let countminutes = Math.floor(
      (timeLeft - countdays * 86400 - counthours * 3600) / 60
    );
    let countseconds = Math.floor(
      timeLeft - countdays * 86400 - counthours * 3600 - countminutes * 60
    );
    if (counthours < '10') {
      counthours = '0' + counthours;
    }
    if (countminutes < '10') {
      countminutes = '0' + countminutes;
    }
    if (countseconds < '10') {
      countseconds = '0' + countseconds;
    }

    setDays(countdays);
    setHours(counthours);
    setMinutes(countminutes);
    setSeconds(countseconds);
  };

  useEffect(() => {
    setInterval(() => {
      comingSoonTime();
    }, 1000);
  }, []);

  return (
    <>
      <div className="banner-area">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="banner-content">
                <span className='text-white' style={{fontSize:"30px", fontWeight:"bolder"}}>Selling Real Estate Redefined</span>

                <ul style={{color:"whitesmoke"}} className=''>
                  <li>
                    Use Smart contracts for real estate negotiations and
                    auctions
                  </li>
                  <li>Reduce the influence of intermediaries</li>
                  <li>Sell real estate within hours not months </li>
                  <li>
                    Benefit from all types of brokerage models: fixed-price,
                    variable-price, zero-price Discover, Collect, and Sell
                    Extraordinary NFTs{" "}
                  </li>
                </ul>
                <p>
                  Are you tired of the complexities and delays in real estate
                  transactions? Introducing Brokereum, the game-changing
                  smart-contract platform in real estate brokerage.
                </p>
                <p>
                  With our tamper-proof blockchain-powered platform and
                  self-executing smart contracts, buying and selling property
                  becomes faster, more secure, and efficient.
                </p>
                <p>
                  Say hello to transparent auctions and fair price discovery
                  with reduced transaction costs.
                </p>
                <div
                  className=""
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Link href="/about">
                    <a className="default-btn border-radius-5">Explore More</a>
                  </Link>
                  {!walletaAddress ? (
                    <>
                      <a
                        style={{
                          marginLeft: "20px",
                          marginTop: "0px",
                        }}
                        className=""
                      >
                        <ConnectWallet
                          theme="dark"
                          style={{ padding: "15px 15px 15px 15px" }}
                          btnTitle="Login"
                        />
                      </a>
                    </>
                  ) : (
                    <a
                      className="default-btn two border-radius-5"
                      style={{ marginLeft: "20px", cursor: "pointer" }}
                    >
                      Connected Successfully
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="banner-card-area">
                <div className="row">
                  <div className="col-lg-6 col-sm-6">
                    <div className="banner-card">
                      <div className="banner-card-img">
                        <img
                          src="../images/home-one/home-one-img1.jpg"
                          alt="Images"
                        />
                        <div className="banner-card-content">
                          <div className="card-left">
                            <span>Start Bid</span>
                            <h3>15,00 ETH</h3>
                          </div>
                          <div className="card-right">
                            <h3>Remaining Time</h3>
                            <div
                              className="timer-text"
                              data-countdown="2021/10/10"
                            >
                              {days}:{hours}:{minutes}:{seconds}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="content">
                        <div className="banner-user-list">
                          <div className="banner-user-list-img">
                            <Link href="/author-profile">
                              <a>
                                <img
                                  src="../images/home-one/home-one-user1.jpg"
                                  alt="Images"
                                />
                              </a>
                            </Link>
                            <i className="ri-check-line"></i>
                          </div>
                          <h3>
                            <Link href="/author-profile">
                              <a>Flowers in Concrete</a>
                            </Link>
                          </h3>
                          <span>
                            Created by
                            <Link href="/author-profile">
                              <a>@Evelyn</a>
                            </Link>
                          </span>
                        </div>
                        <Link href="/author-profile">
                          <a className="banner-user-btn">
                            <i className="ri-arrow-right-line"></i>
                          </a>
                        </Link>
                        <button
                          type="button"
                          className="default-btn border-radius-5"
                        >
                          Place Bid
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6 col-sm-6">
                    <div className="banner-card banner-card-mt">
                      <div className="banner-card-img">
                        <img
                          src="../images/home-one/home-one-img2.jpg"
                          alt="Images"
                        />
                        <div className="banner-card-content">
                          <div className="card-left">
                            <span>Start Bid</span>
                            <h3>11,00 ETH</h3>
                          </div>
                          <div className="card-right">
                            <h3>Remaining Time</h3>
                            <div
                              className="timer-text"
                              data-countdown="2021/09/09"
                            >
                              {days}:{hours}:{minutes}:{seconds}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="content">
                        <div className="banner-user-list">
                          <div className="banner-user-list-img">
                            <Link href="/author-profile">
                              <a>
                                <img
                                  src="../images/home-one/home-one-user2.jpg"
                                  alt="Images"
                                />
                              </a>
                            </Link>
                            <i className="ri-check-line"></i>
                          </div>
                          <h3>
                            <Link href="/author-profile">
                              <a>Walking on Air</a>
                            </Link>
                          </h3>
                          <span>
                            Created by
                            <Link href="/author-profile">
                              <a>@Adison</a>
                            </Link>
                          </span>
                        </div>
                        <Link href="/author-profile">
                          <a className="banner-user-btn">
                            <i className="ri-arrow-right-line"></i>
                          </a>
                        </Link>
                        <button
                          type="button"
                          className="default-btn border-radius-5"
                        >
                          Place Bid
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="banner-shape">
          <div className="shape-circle1">
            <img src="../images/home-one/circle1.png" alt="Images" />
          </div>

          <div className="shape-circle2">
            <img src="../images/home-one/circle2.png" alt="Images" />
          </div>

          <div className="shape-bg">
            <img src="../images/home-one/bg-shape.png" alt="Images" />
          </div>
        </div>
      </div>
    </>
  );
};

export default BannerArea;
