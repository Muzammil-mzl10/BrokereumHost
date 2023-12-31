import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
const OwlCarousel = dynamic(import('react-owl-carousel3'));

const options = {
  loop: true,
  margin: 0,
  nav: false,
  mouseDrag: false,
  dots: false,
  autoplay: true,
  smartSpeed: 500,
  responsive: {
    0: {
      items: 1,
    },
    768: {
      items: 2,
    },
    1000: {
      items: 3,
    },
  },
};

const AuctionArea = () => {
  const [display, setDisplay] = useState(false);
  const [isMounted, setisMounted] = useState(false);

  useEffect(() => {
    setisMounted(true);
    setDisplay(true);
  }, []);

  //counter calculation
  const [days, setDays] = useState('');
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
      <div className='auctions-area-two pb-100'>
        <div className='container'>
          <div className='row align-items-center'>
            <div className='col-lg-8 col-md-6'>
              <div className='section-title'>
                <h2>Live Auctions</h2>
              </div>
            </div>

            <div className='col-lg-4 col-md-6'>
              <div className='auction-btn text-end'>
                <Link legacyBehavior href='/auction'>
                  <a className='default-btn border-radius-5'>
                    Explore More
                  </a>
                </Link>
              </div>
            </div>
          </div>

          <div className='auctions-slider-two owl-theme pt-45'>
            {display ? (
              <OwlCarousel {...options}>
                <div className='auction-card'>
                  <div className='auction-card-img'>
                    <Link legacyBehavior href='/auction'>
                      <a>
                        <img
                          src='../images/auctions/auctions-img5.jpg'
                          alt='Images'
                        />
                      </a>
                    </Link>
                    <div className='auction-card-user'>
                      <Link legacyBehavior href='/author-profile'>
                        <a className='auction-card-user-option'>
                          <img
                            src='../images/auctions/auctions-user1.jpg'
                            alt='Images'
                          />
                          <span>Created by @Adison</span>
                        </a>
                      </Link>
                    </div>
                    <div className='auction-card-into'>
                      <h3>Remaining Time</h3>
                      <div className='auction-timer'>
                        <div
                          className='auction-title'
                          data-countdown='2021/10/10'
                        >
                          {days}:{hours}:{minutes}:{seconds}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='content'>
                    <h3>
                      <Link legacyBehavior href='/auction'>
                        <a>To Infinity And Beyond</a>
                      </Link>
                    </h3>
                    <p>
                      <i className='ri-heart-line'></i> 142
                    </p>
                    <div className='auction-card-content'>
                      <div className='card-left'>
                        <span>Start Bid</span>
                        <h4>15,00 ETH</h4>
                      </div>
                      <div className='card-right'>
                        <span>Highest Bid</span>
                        <h4>15,00 ETH</h4>
                      </div>
                    </div>
                    <Link legacyBehavior href='/auction'>
                      <a className='place-btn'>Place Bid</a>
                    </Link>
                  </div>
                </div>

                <div className='auction-card'>
                  <div className='auction-card-img'>
                    <Link legacyBehavior href='/auction'>
                      <a>
                        <img
                          src='../images/auctions/auctions-img6.jpg'
                          alt='Images'
                        />
                      </a>
                    </Link>
                    <div className='auction-card-user'>
                      <Link legacyBehavior href='/auction'>
                        <a className='auction-card-user-option'>
                          <img
                            src='../images/auctions/auctions-user2.jpg'
                            alt='Images'
                          />
                          <span>Created by @Emilia</span>
                        </a>
                      </Link>
                    </div>
                    <div className='auction-card-into'>
                      <h3>Remaining Time</h3>
                      <div className='auction-timer'>
                        <div
                          className='auction-title'
                          data-countdown='2021/10/10'
                        >
                          {days}:{hours}:{minutes}:{seconds}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='content'>
                    <h3>
                      <Link legacyBehavior href='/auction'>
                        <a>Walking On Air</a>
                      </Link>
                    </h3>
                    <p>
                      <i className='ri-heart-line'></i> 162
                    </p>
                    <div className='auction-card-content'>
                      <div className='card-left'>
                        <span>Start Bid</span>
                        <h4>16,00 ETH</h4>
                      </div>
                      <div className='card-right'>
                        <span>Highest Bid</span>
                        <h4>12,00 ETH</h4>
                      </div>
                    </div>
                    <Link legacyBehavior href='/auction'>
                      <a className='place-btn'>Place Bid</a>
                    </Link>
                  </div>
                </div>

                <div className='auction-card'>
                  <div className='auction-card-img'>
                    <Link legacyBehavior href='/auction'>
                      <a>
                        <img
                          src='../images/auctions/auctions-img7.jpg'
                          alt='Images'
                        />
                      </a>
                    </Link>
                    <div className='auction-card-user'>
                      <Link legacyBehavior href='/author-profile'>
                        <a className='auction-card-user-option'>
                          <img
                            src='../images/auctions/auctions-user3.jpg'
                            alt='Images'
                          />
                          <span>Created by @Daniel</span>
                        </a>
                      </Link>
                    </div>
                    <div className='auction-card-into'>
                      <h3>Remaining Time</h3>
                      <div className='auction-timer'>
                        <div
                          className='auction-title'
                          data-countdown='2021/10/10'
                        >
                          {days}:{hours}:{minutes}:{seconds}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='content'>
                    <h3>
                      <Link legacyBehavior href='/auction'>
                        <a>Industrial Revolution</a>
                      </Link>
                    </h3>
                    <p>
                      <i className='ri-heart-line'></i> 142
                    </p>
                    <div className='auction-card-content'>
                      <div className='card-left'>
                        <span>Start Bid</span>
                        <h4>14,00 ETH</h4>
                      </div>
                      <div className='card-right'>
                        <span>Highest Bid</span>
                        <h4>11,00 ETH</h4>
                      </div>
                    </div>
                    <Link legacyBehavior href='/auction'>
                      <a className='place-btn'>Place Bid</a>
                    </Link>
                  </div>
                </div>

                <div className='auction-card'>
                  <div className='auction-card-img'>
                    <Link legacyBehavior href='/auction'>
                      <a>
                        <img
                          src='../images/auctions/auctions-img8.jpg'
                          alt='Images'
                        />
                      </a>
                    </Link>
                    <div className='auction-card-user'>
                      <Link legacyBehavior href='/author-profile'>
                        <a className='auction-card-user-option'>
                          <img
                            src='../images/auctions/auctions-user4.jpg'
                            alt='Images'
                          />
                          <span>Created by @Jekob</span>
                        </a>
                      </Link>
                    </div>
                    <div className='auction-card-into'>
                      <h3>Remaining Time</h3>
                      <div className='auction-timer'>
                        <div
                          className='auction-title'
                          data-countdown='2021/10/10'
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className='content'>
                    <h3>
                      <Link legacyBehavior href='/auction'>
                        <a>Become On Nature</a>
                      </Link>
                    </h3>
                    <p>
                      <i className='ri-heart-line'></i> 142
                    </p>
                    <div className='auction-card-content'>
                      <div className='card-left'>
                        <span>Start Bid</span>
                        <h4>17,00 ETH</h4>
                      </div>
                      <div className='card-right'>
                        <span>Highest Bid</span>
                        <h4>13,00 ETH</h4>
                      </div>
                    </div>
                    <Link legacyBehavior href='/auction'>
                      <a className='place-btn'>Place Bid</a>
                    </Link>
                  </div>
                </div>
              </OwlCarousel>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AuctionArea;
