import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ThirdwebSDK } from "@thirdweb-dev/sdk/evm";
import AuctionListings from './AuctionListings';
const Tabs = dynamic(
  import('react-tabs').then((mod) => mod.Tabs),
  { ssr: false }
);
import { resetIdCounter, Tab, TabList, TabPanel } from 'react-tabs';
import Pagination from './Pagination';
resetIdCounter();

const FeaturedArea = ({ title, pagination }) => {
   const [totalPages, setTotalPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [fullNFTdata , setfullNFTData]=useState()
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

  const [marketplaceContract, setMarketplaceContract] = useState()
  const [AuctionListing , setAuctionListing] = useState()
  const sdk = new ThirdwebSDK("mumbai", {
    clientId: process.env.thirdweb_CLIENTID,
  });

useEffect(() => {
  async function fetchMarketplaceData() {
    try {
      const contract = await sdk.getContract(process.env.Marketplace_Contract);
      setMarketplaceContract(contract);
    } catch (error) {
      console.error("Error fetching marketplace contract:", error);
    }
  }

  fetchMarketplaceData();
}, []);

useEffect(() => {
  async function fetchAuctionListing() {
    console.log(marketplaceContract);
    if (marketplaceContract) {
      try {
        let auctionList = await marketplaceContract.englishAuctions.getAll();
        auctionList = auctionList.filter((data) => data.status !== 2);
        auctionList = auctionList.sort((a, b) => {
          if (a.status === 4 && b.status === 5) return -1;
          if (a.status === 5 && b.status === 4) return 1;
          return 0;
        });
        console.log(auctionList)
        setfullNFTData(auctionList)
         const numberOfPages = Math.ceil(auctionList.length / 8);
         console.log(numberOfPages);
         setTotalPages(
           Array.from({ length: numberOfPages }, (_, index) => index + 1)
         );
         console.log(totalPages);
         const filteredArray = getPageFromArray(auctionList, currentPage, 8);
        console.log(auctionList);
        setAuctionListing(filteredArray);

      } catch (error) {
        console.error("Error fetching auction listing:", error);
      }
    }
  }

  fetchAuctionListing();
}, [marketplaceContract]);

  
  
  function getPageFromArray(dataArray, currentPage, itemsPerPage) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return dataArray.slice(startIndex, endIndex);
  }
  useEffect(() => {
    if (fullNFTdata) {
      const data = getPageFromArray(fullNFTdata, currentPage, 8);
      console.log(data);
      setAuctionListing(data);
    }
  }, [currentPage]);
  
  console.log(currentPage)
  // console.log(AuctionListing)


  return (
    <>
      <div className="featured-area pt-100 pb-70">
        <div className="container">
          <div className="tab featured-tab-area">
            <div className="row align-items-center ">
              <div className="col-lg-6 col-md-4">
                <div className="section-title ">
                  <h2
                    className="live-auction-listing"
                    style={{ width: "max-content" }}
                  >
                    {title}
                  </h2>
                </div>
              </div>
            </div>

            <Tabs>
              <div className="col-lg-6 col-md-8">
                <ul className="tabs">
                  <TabList>
                    <Tab>
                      <a>All</a>
                    </Tab>
                    {/* <Tab>
                      <a>Art</a>
                    </Tab>

                    <Tab>
                      <a>Virtual Worlds</a>
                    </Tab>
                    <Tab>
                      <a>Collectibles</a>
                    </Tab>
                    <Tab>
                      <a>Music</a>
                    </Tab> */}
                  </TabList>
                </ul>
              </div>

              <div className="tab_content pt-45">
                <TabPanel>
                  <div className="tabs_item">
                    <div className="row justify-content-center">
                      {AuctionListing &&
                        AuctionListing.map((data, index) => (
                          <AuctionListings data={data} key={index} />
                        ))}
                    </div>
                    <div className="col-lg-12 col-md-12">
                      <div className="pagination-area">
                        <a href="#" className="prev page-numbers">
                          <i className="ri-arrow-left-s-line"></i>
                        </a>
                        {totalPages.map((data, index) => (
                          <span
                            style={{ marginLeft: "5px", marginBottom: "20px" }}
                            className="page-numbers current"
                            aria-current="page"
                            onClick={() => setCurrentPage(data)}
                          >
                            <span
                              className={
                                data == currentPage
                                  ? data > 21
                                    ? "btn btn-danger mt-2"
                                    : "btn btn-danger"
                                  : data > 21
                                  ? "mt-2 btn btn-primary"
                                  : "btn btn-primary"
                              }
                            >
                              {data}
                            </span>
                          </span>
                        ))}

                        <a href="#" className="next page-numbers">
                          <i className="ri-arrow-right-s-line"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </TabPanel>

                <TabPanel>
                  <div className="tabs_item">
                    <div className="row justify-content-center">
                      <div className="col-lg-3 col-md-6">
                        <div className="featured-item">
                          <div className="featured-item-img">
                            <Link legacyBehavior href="/item-details">
                              <a>
                                <img
                                  src="../images/featured/featured-img5.jpg"
                                  alt="Images"
                                />
                              </a>
                            </Link>
                            <div className="featured-user">
                              <Link legacyBehavior href="/author-profile">
                                <a className="featured-user-option">
                                  <img
                                    src="../images/featured/featured-user5.jpg"
                                    alt="Images"
                                  />
                                  <span>Created by @Daniel</span>
                                </a>
                              </Link>
                            </div>
                            <button
                              type="button"
                              className="default-btn border-radius-5"
                            >
                              Place Bid
                            </button>
                          </div>

                          <div className="content">
                            <h3>
                              <Link legacyBehavior href="/author-profile">
                                <a>Walking On Air</a>
                              </Link>
                            </h3>
                            <div className="content-in">
                              <span>110 ETH 12/14</span>
                              <h4>Bid 90 ETH </h4>
                            </div>
                            <div className="featured-content-list">
                              <ul>
                                <li>
                                  <img
                                    src="../images/featured/featured-user6.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li>
                                  <img
                                    src="../images/featured/featured-user7.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li className="title">10+ People Placed Bid</li>
                              </ul>

                              <p>
                                <i className="ri-heart-line"></i> 112
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-3 col-md-6">
                        <div className="featured-item">
                          <div className="featured-item-img">
                            <Link legacyBehavior href="/author-profile">
                              <a>
                                <img
                                  src="../images/featured/featured-img6.jpg"
                                  alt="Images"
                                />
                              </a>
                            </Link>
                            <div className="featured-user">
                              <Link legacyBehavior href="/author-profile">
                                <a className="featured-user-option">
                                  <img
                                    src="../images/featured/featured-user6.jpg"
                                    alt="Images"
                                  />
                                  <span>Created by @Samuel</span>
                                </a>
                              </Link>
                            </div>
                            <button
                              type="button"
                              className="default-btn border-radius-5"
                            >
                              Place Bid
                            </button>
                          </div>

                          <div className="content">
                            <h3>
                              <Link legacyBehavior href="/author-profile">
                                <a>Supper Nuemorphism</a>
                              </Link>
                            </h3>
                            <div className="content-in">
                              <span>130 ETH 12/14</span>
                              <h4>Bid 70 ETH </h4>
                            </div>
                            <div className="featured-content-list">
                              <ul>
                                <li>
                                  <img
                                    src="../images/featured/featured-user7.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li>
                                  <img
                                    src="../images/featured/featured-user8.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li className="title">10+ People Placed Bid</li>
                              </ul>

                              <p>
                                <i className="ri-heart-line"></i> 162
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-3 col-md-6">
                        <div className="featured-item">
                          <div className="featured-item-img">
                            <Link legacyBehavior href="/item-details">
                              <a>
                                <img
                                  src="../images/featured/featured-img7.jpg"
                                  alt="Images"
                                />
                              </a>
                            </Link>
                            <div className="featured-user">
                              <Link legacyBehavior href="/author-profile">
                                <a className="featured-user-option">
                                  <img
                                    src="../images/featured/featured-user7.jpg"
                                    alt="Images"
                                  />
                                  <span>Created by @Martina</span>
                                </a>
                              </Link>
                            </div>
                            <button
                              type="button"
                              className="default-btn border-radius-5"
                            >
                              Place Bid
                            </button>
                          </div>

                          <div className="content">
                            <h3>
                              <Link legacyBehavior href="/author-profile">
                                <a>Dark-light Angel</a>
                              </Link>
                            </h3>
                            <div className="content-in">
                              <span>110 ETH 12/14</span>
                              <h4>Bid 80 ETH </h4>
                            </div>
                            <div className="featured-content-list">
                              <ul>
                                <li>
                                  <img
                                    src="../images/featured/featured-user8.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li>
                                  <img
                                    src="../images/featured/featured-user1.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li className="title">10+ People Placed Bid</li>
                              </ul>

                              <p>
                                <i className="ri-heart-line"></i> 162
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-3 col-md-6">
                        <div className="featured-item">
                          <div className="featured-item-img">
                            <Link legacyBehavior href="/item-details">
                              <a>
                                <img
                                  src="../images/featured/featured-img8.jpg"
                                  alt="Images"
                                />
                              </a>
                            </Link>
                            <div className="featured-user">
                              <Link legacyBehavior href="/author-profile">
                                <a className="featured-user-option">
                                  <img
                                    src="../images/featured/featured-user8.jpg"
                                    alt="Images"
                                  />
                                  <span>Created by @Henry</span>
                                </a>
                              </Link>
                            </div>
                            <button
                              type="button"
                              className="default-btn border-radius-5"
                            >
                              Place Bid
                            </button>
                          </div>

                          <div className="content">
                            <h3>
                              <Link legacyBehavior href="/author-profile">
                                <a>Exe Dream Hight</a>
                              </Link>
                            </h3>
                            <div className="content-in">
                              <span>160 ETH 12/14</span>
                              <h4>Bid 90 ETH </h4>
                            </div>
                            <div className="featured-content-list">
                              <ul>
                                <li>
                                  <img
                                    src="../images/featured/featured-user1.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li>
                                  <img
                                    src="../images/featured/featured-user3.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li className="title">10+ People Placed Bid</li>
                              </ul>

                              <p>
                                <i className="ri-heart-line"></i> 182
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-3 col-md-6">
                        <div className="featured-item">
                          <div className="featured-item-img">
                            <Link legacyBehavior href="/item-details">
                              <a>
                                <img
                                  src="../images/featured/featured-img1.jpg"
                                  alt="Images"
                                />
                              </a>
                            </Link>
                            <div className="featured-user">
                              <Link legacyBehavior href="/author-profile">
                                <a className="featured-user-option">
                                  <img
                                    src="../images/featured/featured-user1.jpg"
                                    alt="Images"
                                  />
                                  <span>Created by @Farnil</span>
                                </a>
                              </Link>
                            </div>
                            <button
                              type="button"
                              className="default-btn border-radius-5"
                            >
                              Place Bid
                            </button>
                          </div>

                          <div className="content">
                            <h3>
                              <Link legacyBehavior href="/author-profile">
                                <a>Industrial Revolution</a>
                              </Link>
                            </h3>
                            <div className="content-in">
                              <span>100 ETH 12/14</span>
                              <h4>Bid 80 ETH </h4>
                            </div>
                            <div className="featured-content-list">
                              <ul>
                                <li>
                                  <img
                                    src="../images/featured/featured-user1.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li>
                                  <img
                                    src="../images/featured/featured-user2.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li className="title">10+ People Placed Bid</li>
                              </ul>

                              <p>
                                <i className="ri-heart-line"></i> 122
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-3 col-md-6">
                        <div className="featured-item">
                          <div className="featured-item-img">
                            <Link legacyBehavior href="/item-details">
                              <a>
                                <img
                                  src="../images/featured/featured-img2.jpg"
                                  alt="Images"
                                />
                              </a>
                            </Link>
                            <div className="featured-user">
                              <Link legacyBehavior href="/author-profile">
                                <a className="featured-user-option">
                                  <img
                                    src="../images/featured/featured-user2.jpg"
                                    alt="Images"
                                  />
                                  <span>Created by @Adison</span>
                                </a>
                              </Link>
                            </div>
                            <button
                              type="button"
                              className="default-btn border-radius-5"
                            >
                              Place Bid
                            </button>
                          </div>

                          <div className="content">
                            <h3>
                              <Link legacyBehavior href="/author-profile">
                                <a>Love In The Air</a>
                              </Link>
                            </h3>
                            <div className="content-in">
                              <span>110 ETH 12/14</span>
                              <h4>Bid 70 ETH </h4>
                            </div>
                            <div className="featured-content-list">
                              <ul>
                                <li>
                                  <img
                                    src="../images/featured/featured-user3.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li>
                                  <img
                                    src="../images/featured/featured-user2.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li className="title">10+ People Placed Bid</li>
                              </ul>

                              <p>
                                <i className="ri-heart-line"></i> 112
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-3 col-md-6">
                        <div className="featured-item">
                          <div className="featured-item-img">
                            <Link legacyBehavior href="/item-details">
                              <a>
                                <img
                                  src="../images/featured/featured-img3.jpg"
                                  alt="Images"
                                />
                              </a>
                            </Link>
                            <div className="featured-user">
                              <Link legacyBehavior href="/author-profile">
                                <a className="featured-user-option">
                                  <img
                                    src="../images/featured/featured-user3.jpg"
                                    alt="Images"
                                  />
                                  <span>Created by @Jekob</span>
                                </a>
                              </Link>
                            </div>
                            <button
                              type="button"
                              className="default-btn border-radius-5"
                            >
                              Place Bid
                            </button>
                          </div>

                          <div className="content">
                            <h3>
                              <Link legacyBehavior href="/author-profile">
                                <a>Become One With Nature</a>
                              </Link>
                            </h3>
                            <div className="content-in">
                              <span>120 ETH 12/14</span>
                              <h4>Bid 90 ETH </h4>
                            </div>
                            <div className="featured-content-list">
                              <ul>
                                <li>
                                  <img
                                    src="../images/featured/featured-user4.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li>
                                  <img
                                    src="../images/featured/featured-user5.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li className="title">10+ People Placed Bid</li>
                              </ul>

                              <p>
                                <i className="ri-heart-line"></i> 132
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-3 col-md-6">
                        <div className="featured-item">
                          <div className="featured-item-img">
                            <Link legacyBehavior href="/item-details">
                              <a>
                                <img
                                  src="../images/featured/featured-img4.jpg"
                                  alt="Images"
                                />
                              </a>
                            </Link>
                            <div className="featured-user">
                              <Link legacyBehavior href="/author-profile">
                                <a className="featured-user-option">
                                  <img
                                    src="../images/featured/featured-user4.jpg"
                                    alt="Images"
                                  />
                                  <span>Created by @Jekob</span>
                                </a>
                              </Link>
                            </div>
                            <button
                              type="button"
                              className="default-btn border-radius-5"
                            >
                              Place Bid
                            </button>
                          </div>

                          <div className="content">
                            <h3>
                              <Link legacyBehavior href="/author-profile">
                                <a>Twilight Fracture City</a>
                              </Link>
                            </h3>
                            <div className="content-in">
                              <span>130 ETH 12/14</span>
                              <h4>Bid 80 ETH </h4>
                            </div>
                            <div className="featured-content-list">
                              <ul>
                                <li>
                                  <img
                                    src="../images/featured/featured-user5.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li>
                                  <img
                                    src="../images/featured/featured-user6.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li className="title">10+ People Placed Bid</li>
                              </ul>

                              <p>
                                <i className="ri-heart-line"></i> 142
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabPanel>

                <TabPanel>
                  <div className="tabs_item">
                    <div className="row justify-content-center">
                      <div className="col-lg-3 col-md-6">
                        <div className="featured-item">
                          <div className="featured-item-img">
                            <Link legacyBehavior href="/item-details">
                              <a>
                                <img
                                  src="../images/featured/featured-img3.jpg"
                                  alt="Images"
                                />
                              </a>
                            </Link>
                            <div className="featured-user">
                              <Link legacyBehavior href="/author-profile">
                                <a className="featured-user-option">
                                  <img
                                    src="../images/featured/featured-user3.jpg"
                                    alt="Images"
                                  />
                                  <span>Created by @Jekob</span>
                                </a>
                              </Link>
                            </div>
                            <button
                              type="button"
                              className="default-btn border-radius-5"
                            >
                              Place Bid
                            </button>
                          </div>

                          <div className="content">
                            <h3>
                              <Link legacyBehavior href="/author-profile">
                                <a>Become One With Nature</a>
                              </Link>
                            </h3>
                            <div className="content-in">
                              <span>120 ETH 12/14</span>
                              <h4>Bid 90 ETH </h4>
                            </div>
                            <div className="featured-content-list">
                              <ul>
                                <li>
                                  <img
                                    src="../images/featured/featured-user4.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li>
                                  <img
                                    src="../images/featured/featured-user5.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li className="title">10+ People Placed Bid</li>
                              </ul>

                              <p>
                                <i className="ri-heart-line"></i> 132
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-3 col-md-6">
                        <div className="featured-item">
                          <div className="featured-item-img">
                            <Link legacyBehavior href="/item-details">
                              <a>
                                <img
                                  src="../images/featured/featured-img4.jpg"
                                  alt="Images"
                                />
                              </a>
                            </Link>
                            <div className="featured-user">
                              <Link legacyBehavior href="/author-profile">
                                <a className="featured-user-option">
                                  <img
                                    src="../images/featured/featured-user4.jpg"
                                    alt="Images"
                                  />
                                  <span>Created by @Jekob</span>
                                </a>
                              </Link>
                            </div>
                            <button
                              type="button"
                              className="default-btn border-radius-5"
                            >
                              Place Bid
                            </button>
                          </div>

                          <div className="content">
                            <h3>
                              <Link legacyBehavior href="/author-profile">
                                <a>Twilight Fracture City</a>
                              </Link>
                            </h3>
                            <div className="content-in">
                              <span>130 ETH 12/14</span>
                              <h4>Bid 80 ETH </h4>
                            </div>
                            <div className="featured-content-list">
                              <ul>
                                <li>
                                  <img
                                    src="../images/featured/featured-user5.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li>
                                  <img
                                    src="../images/featured/featured-user6.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li className="title">10+ People Placed Bid</li>
                              </ul>

                              <p>
                                <i className="ri-heart-line"></i> 142
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-3 col-md-6">
                        <div className="featured-item">
                          <div className="featured-item-img">
                            <Link legacyBehavior href="/item-details">
                              <a>
                                <img
                                  src="../images/featured/featured-img5.jpg"
                                  alt="Images"
                                />
                              </a>
                            </Link>
                            <div className="featured-user">
                              <Link legacyBehavior href="/author-profile">
                                <a className="featured-user-option">
                                  <img
                                    src="../images/featured/featured-user5.jpg"
                                    alt="Images"
                                  />
                                  <span>Created by @Jekob</span>
                                </a>
                              </Link>
                            </div>
                            <button
                              type="button"
                              className="default-btn border-radius-5"
                            >
                              Place Bid
                            </button>
                          </div>

                          <div className="content">
                            <h3>
                              <Link legacyBehavior href="/author-profile">
                                <a>Walking On Air</a>
                              </Link>
                            </h3>
                            <div className="content-in">
                              <span>110 ETH 12/14</span>
                              <h4>Bid 90 ETH </h4>
                            </div>
                            <div className="featured-content-list">
                              <ul>
                                <li>
                                  <img
                                    src="../images/featured/featured-user6.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li>
                                  <img
                                    src="../images/featured/featured-user7.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li className="title">10+ People Placed Bid</li>
                              </ul>

                              <p>
                                <i className="ri-heart-line"></i> 112
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-3 col-md-6">
                        <div className="featured-item">
                          <div className="featured-item-img">
                            <Link legacyBehavior href="/item-details">
                              <a>
                                <img
                                  src="../images/featured/featured-img6.jpg"
                                  alt="Images"
                                />
                              </a>
                            </Link>
                            <div className="featured-user">
                              <Link legacyBehavior href="/author-profile">
                                <a className="featured-user-option">
                                  <img
                                    src="../images/featured/featured-user6.jpg"
                                    alt="Images"
                                  />
                                  <span>Created by @Jekob</span>
                                </a>
                              </Link>
                            </div>
                            <button
                              type="button"
                              className="default-btn border-radius-5"
                            >
                              Place Bid
                            </button>
                          </div>

                          <div className="content">
                            <h3>
                              <Link legacyBehavior href="/author-profile">
                                <a>Supper Nuemorphism</a>
                              </Link>
                            </h3>
                            <div className="content-in">
                              <span>130 ETH 12/14</span>
                              <h4>Bid 70 ETH </h4>
                            </div>
                            <div className="featured-content-list">
                              <ul>
                                <li>
                                  <img
                                    src="../images/featured/featured-user7.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li>
                                  <img
                                    src="../images/featured/featured-user8.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li className="title">10+ People Placed Bid</li>
                              </ul>

                              <p>
                                <i className="ri-heart-line"></i> 162
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-3 col-md-6">
                        <div className="featured-item">
                          <div className="featured-item-img">
                            <Link legacyBehavior href="/item-details">
                              <a>
                                <img
                                  src="../images/featured/featured-img7.jpg"
                                  alt="Images"
                                />
                              </a>
                            </Link>
                            <div className="featured-user">
                              <Link legacyBehavior href="/author-profile">
                                <a className="featured-user-option">
                                  <img
                                    src="../images/featured/featured-user7.jpg"
                                    alt="Images"
                                  />
                                  <span>Created by @Jekob</span>
                                </a>
                              </Link>
                            </div>
                            <button
                              type="button"
                              className="default-btn border-radius-5"
                            >
                              Place Bid
                            </button>
                          </div>

                          <div className="content">
                            <h3>
                              <Link legacyBehavior href="/author-profile">
                                <a>Dark-light Angel</a>
                              </Link>
                            </h3>
                            <div className="content-in">
                              <span>110 ETH 12/14</span>
                              <h4>Bid 80 ETH </h4>
                            </div>
                            <div className="featured-content-list">
                              <ul>
                                <li>
                                  <img
                                    src="../images/featured/featured-user8.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li>
                                  <img
                                    src="../images/featured/featured-user1.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li className="title">10+ People Placed Bid</li>
                              </ul>

                              <p>
                                <i className="ri-heart-line"></i> 162
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-3 col-md-6">
                        <div className="featured-item">
                          <div className="featured-item-img">
                            <Link legacyBehavior href="/item-details">
                              <a>
                                <img
                                  src="../images/featured/featured-img8.jpg"
                                  alt="Images"
                                />
                              </a>
                            </Link>
                            <div className="featured-user">
                              <Link legacyBehavior href="/author-profile">
                                <a className="featured-user-option">
                                  <img
                                    src="../images/featured/featured-user8.jpg"
                                    alt="Images"
                                  />
                                  <span>Created by @Jekob</span>
                                </a>
                              </Link>
                            </div>
                            <button
                              type="button"
                              className="default-btn border-radius-5"
                            >
                              Place Bid
                            </button>
                          </div>

                          <div className="content">
                            <h3>
                              <Link legacyBehavior href="/author-profile">
                                <a>Exe Dream Hight</a>
                              </Link>
                            </h3>
                            <div className="content-in">
                              <span>160 ETH 12/14</span>
                              <h4>Bid 90 ETH </h4>
                            </div>
                            <div className="featured-content-list">
                              <ul>
                                <li>
                                  <img
                                    src="../images/featured/featured-user1.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li>
                                  <img
                                    src="../images/featured/featured-user3.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li className="title">10+ People Placed Bid</li>
                              </ul>

                              <p>
                                <i className="ri-heart-line"></i> 182
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-3 col-md-6">
                        <div className="featured-item">
                          <div className="featured-item-img">
                            <Link legacyBehavior href="/item-details">
                              <a>
                                <img
                                  src="../images/featured/featured-img1.jpg"
                                  alt="Images"
                                />
                              </a>
                            </Link>
                            <div className="featured-user">
                              <Link legacyBehavior href="/author-profile">
                                <a className="featured-user-option">
                                  <img
                                    src="../images/featured/featured-user1.jpg"
                                    alt="Images"
                                  />
                                  <span>Created by @Jekob</span>
                                </a>
                              </Link>
                            </div>
                            <button
                              type="button"
                              className="default-btn border-radius-5"
                            >
                              Place Bid
                            </button>
                          </div>

                          <div className="content">
                            <h3>
                              <Link legacyBehavior href="/author-profile">
                                <a>Industrial Revolution</a>
                              </Link>
                            </h3>
                            <div className="content-in">
                              <span>100 ETH 12/14</span>
                              <h4>Bid 80 ETH </h4>
                            </div>
                            <div className="featured-content-list">
                              <ul>
                                <li>
                                  <img
                                    src="../images/featured/featured-user1.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li>
                                  <img
                                    src="../images/featured/featured-user2.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li className="title">10+ People Placed Bid</li>
                              </ul>

                              <p>
                                <i className="ri-heart-line"></i> 122
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-3 col-md-6">
                        <div className="featured-item">
                          <div className="featured-item-img">
                            <Link legacyBehavior href="/item-details">
                              <a>
                                <img
                                  src="../images/featured/featured-img2.jpg"
                                  alt="Images"
                                />
                              </a>
                            </Link>
                            <div className="featured-user">
                              <Link legacyBehavior href="/author-profile">
                                <a className="featured-user-option">
                                  <img
                                    src="../images/featured/featured-user3.jpg"
                                    alt="Images"
                                  />
                                  <span>Created by @Jekob</span>
                                </a>
                              </Link>
                            </div>
                            <button
                              type="button"
                              className="default-btn border-radius-5"
                            >
                              Place Bid
                            </button>
                          </div>

                          <div className="content">
                            <h3>
                              <Link legacyBehavior href="/author-profile">
                                <a>Love In The Air</a>
                              </Link>
                            </h3>
                            <div className="content-in">
                              <span>110 ETH 12/14</span>
                              <h4>Bid 70 ETH </h4>
                            </div>
                            <div className="featured-content-list">
                              <ul>
                                <li>
                                  <img
                                    src="../images/featured/featured-user3.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li>
                                  <img
                                    src="../images/featured/featured-user2.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li className="title">10+ People Placed Bid</li>
                              </ul>

                              <p>
                                <i className="ri-heart-line"></i> 112
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabPanel>

                <TabPanel>
                  <div className="tabs_item">
                    <div className="row justify-content-center">
                      <div className="col-lg-3 col-md-6">
                        <div className="featured-item">
                          <div className="featured-item-img">
                            <Link legacyBehavior href="/item-details">
                              <a>
                                <img
                                  src="../images/featured/featured-img5.jpg"
                                  alt="Images"
                                />
                              </a>
                            </Link>
                            <div className="featured-user">
                              <Link legacyBehavior href="/author-profile">
                                <a className="featured-user-option">
                                  <img
                                    src="../images/featured/featured-user5.jpg"
                                    alt="Images"
                                  />
                                  <span>Created by @Jekob</span>
                                </a>
                              </Link>
                            </div>
                            <button
                              type="button"
                              className="default-btn border-radius-5"
                            >
                              Place Bid
                            </button>
                          </div>

                          <div className="content">
                            <h3>
                              <Link legacyBehavior href="/author-profile">
                                <a>Walking On Air</a>
                              </Link>
                            </h3>
                            <div className="content-in">
                              <span>110 ETH 12/14</span>
                              <h4>Bid 90 ETH </h4>
                            </div>
                            <div className="featured-content-list">
                              <ul>
                                <li>
                                  <img
                                    src="../images/featured/featured-user6.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li>
                                  <img
                                    src="../images/featured/featured-user7.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li className="title">10+ People Placed Bid</li>
                              </ul>

                              <p>
                                <i className="ri-heart-line"></i> 112
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-3 col-md-6">
                        <div className="featured-item">
                          <div className="featured-item-img">
                            <Link legacyBehavior href="/item-details">
                              <a>
                                <img
                                  src="../images/featured/featured-img6.jpg"
                                  alt="Images"
                                />
                              </a>
                            </Link>
                            <div className="featured-user">
                              <Link legacyBehavior href="/author-profile">
                                <a className="featured-user-option">
                                  <img
                                    src="../images/featured/featured-user6.jpg"
                                    alt="Images"
                                  />
                                  <span>Created by @Jekob</span>
                                </a>
                              </Link>
                            </div>
                            <button
                              type="button"
                              className="default-btn border-radius-5"
                            >
                              Place Bid
                            </button>
                          </div>

                          <div className="content">
                            <h3>
                              <Link legacyBehavior href="/author-profile">
                                <a>Supper Nuemorphism</a>
                              </Link>
                            </h3>
                            <div className="content-in">
                              <span>130 ETH 12/14</span>
                              <h4>Bid 70 ETH </h4>
                            </div>
                            <div className="featured-content-list">
                              <ul>
                                <li>
                                  <img
                                    src="../images/featured/featured-user7.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li>
                                  <img
                                    src="../images/featured/featured-user8.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li className="title">10+ People Placed Bid</li>
                              </ul>

                              <p>
                                <i className="ri-heart-line"></i> 162
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-3 col-md-6">
                        <div className="featured-item">
                          <div className="featured-item-img">
                            <Link legacyBehavior href="/item-details">
                              <a>
                                <img
                                  src="../images/featured/featured-img7.jpg"
                                  alt="Images"
                                />
                              </a>
                            </Link>
                            <div className="featured-user">
                              <Link legacyBehavior href="/author-profile">
                                <a className="featured-user-option">
                                  <img
                                    src="../images/featured/featured-user7.jpg"
                                    alt="Images"
                                  />
                                  <span>Created by @Jekob</span>
                                </a>
                              </Link>
                            </div>
                            <button
                              type="button"
                              className="default-btn border-radius-5"
                            >
                              Place Bid
                            </button>
                          </div>

                          <div className="content">
                            <h3>
                              <Link legacyBehavior href="/author-profile">
                                <a>Dark-light Angel</a>
                              </Link>
                            </h3>
                            <div className="content-in">
                              <span>110 ETH 12/14</span>
                              <h4>Bid 80 ETH </h4>
                            </div>
                            <div className="featured-content-list">
                              <ul>
                                <li>
                                  <img
                                    src="../images/featured/featured-user8.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li>
                                  <img
                                    src="../images/featured/featured-user1.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li className="title">10+ People Placed Bid</li>
                              </ul>

                              <p>
                                <i className="ri-heart-line"></i> 162
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-3 col-md-6">
                        <div className="featured-item">
                          <div className="featured-item-img">
                            <Link legacyBehavior href="/item-details">
                              <a>
                                <img
                                  src="../images/featured/featured-img8.jpg"
                                  alt="Images"
                                />
                              </a>
                            </Link>
                            <div className="featured-user">
                              <Link legacyBehavior href="/author-profile">
                                <a className="featured-user-option">
                                  <img
                                    src="../images/featured/featured-user8.jpg"
                                    alt="Images"
                                  />
                                  <span>Created by @Jekob</span>
                                </a>
                              </Link>
                            </div>
                            <button
                              type="button"
                              className="default-btn border-radius-5"
                            >
                              Place Bid
                            </button>
                          </div>

                          <div className="content">
                            <h3>
                              <Link legacyBehavior href="/author-profile">
                                <a>Exe Dream Hight</a>
                              </Link>
                            </h3>
                            <div className="content-in">
                              <span>160 ETH 12/14</span>
                              <h4>Bid 90 ETH </h4>
                            </div>
                            <div className="featured-content-list">
                              <ul>
                                <li>
                                  <img
                                    src="../images/featured/featured-user1.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li>
                                  <img
                                    src="../images/featured/featured-user3.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li className="title">10+ People Placed Bid</li>
                              </ul>

                              <p>
                                <i className="ri-heart-line"></i> 182
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-3 col-md-6">
                        <div className="featured-item">
                          <div className="featured-item-img">
                            <Link legacyBehavior href="/item-details">
                              <a>
                                <img
                                  src="../images/featured/featured-img1.jpg"
                                  alt="Images"
                                />
                              </a>
                            </Link>
                            <div className="featured-user">
                              <Link legacyBehavior href="/author-profile">
                                <a className="featured-user-option">
                                  <img
                                    src="../images/featured/featured-user1.jpg"
                                    alt="Images"
                                  />
                                  <span>Created by @Jekob</span>
                                </a>
                              </Link>
                            </div>
                            <button
                              type="button"
                              className="default-btn border-radius-5"
                            >
                              Place Bid
                            </button>
                          </div>

                          <div className="content">
                            <h3>
                              <Link legacyBehavior href="/author-profile">
                                <a>Industrial Revolution</a>
                              </Link>
                            </h3>
                            <div className="content-in">
                              <span>100 ETH 12/14</span>
                              <h4>Bid 80 ETH </h4>
                            </div>
                            <div className="featured-content-list">
                              <ul>
                                <li>
                                  <img
                                    src="../images/featured/featured-user1.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li>
                                  <img
                                    src="../images/featured/featured-user2.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li className="title">10+ People Placed Bid</li>
                              </ul>

                              <p>
                                <i className="ri-heart-line"></i> 122
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-3 col-md-6">
                        <div className="featured-item">
                          <div className="featured-item-img">
                            <Link legacyBehavior href="/item-details">
                              <a>
                                <img
                                  src="../images/featured/featured-img2.jpg"
                                  alt="Images"
                                />
                              </a>
                            </Link>
                            <div className="featured-user">
                              <Link legacyBehavior href="/author-profile">
                                <a className="featured-user-option">
                                  <img
                                    src="../images/featured/featured-user3.jpg"
                                    alt="Images"
                                  />
                                  <span>Created by @Jekob</span>
                                </a>
                              </Link>
                            </div>
                            <button
                              type="button"
                              className="default-btn border-radius-5"
                            >
                              Place Bid
                            </button>
                          </div>

                          <div className="content">
                            <h3>
                              <Link legacyBehavior href="/author-profile">
                                <a>Love In The Air</a>
                              </Link>
                            </h3>
                            <div className="content-in">
                              <span>110 ETH 12/14</span>
                              <h4>Bid 70 ETH </h4>
                            </div>
                            <div className="featured-content-list">
                              <ul>
                                <li>
                                  <img
                                    src="../images/featured/featured-user3.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li>
                                  <img
                                    src="../images/featured/featured-user2.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li className="title">10+ People Placed Bid</li>
                              </ul>

                              <p>
                                <i className="ri-heart-line"></i> 112
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-3 col-md-6">
                        <div className="featured-item">
                          <div className="featured-item-img">
                            <Link legacyBehavior href="/item-details">
                              <a>
                                <img
                                  src="../images/featured/featured-img3.jpg"
                                  alt="Images"
                                />
                              </a>
                            </Link>
                            <div className="featured-user">
                              <Link legacyBehavior href="/author-profile">
                                <a className="featured-user-option">
                                  <img
                                    src="../images/featured/featured-user3.jpg"
                                    alt="Images"
                                  />
                                  <span>Created by @Jekob</span>
                                </a>
                              </Link>
                            </div>
                            <button
                              type="button"
                              className="default-btn border-radius-5"
                            >
                              Place Bid
                            </button>
                          </div>

                          <div className="content">
                            <h3>
                              <Link legacyBehavior href="/author-profile">
                                <a>Become One With Nature</a>
                              </Link>
                            </h3>
                            <div className="content-in">
                              <span>120 ETH 12/14</span>
                              <h4>Bid 90 ETH </h4>
                            </div>
                            <div className="featured-content-list">
                              <ul>
                                <li>
                                  <img
                                    src="../images/featured/featured-user4.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li>
                                  <img
                                    src="../images/featured/featured-user5.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li className="title">10+ People Placed Bid</li>
                              </ul>

                              <p>
                                <i className="ri-heart-line"></i> 132
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-3 col-md-6">
                        <div className="featured-item">
                          <div className="featured-item-img">
                            <Link legacyBehavior href="/item-details">
                              <a>
                                <img
                                  src="../images/featured/featured-img4.jpg"
                                  alt="Images"
                                />
                              </a>
                            </Link>
                            <div className="featured-user">
                              <Link legacyBehavior href="/author-profile">
                                <a className="featured-user-option">
                                  <img
                                    src="../images/featured/featured-user4.jpg"
                                    alt="Images"
                                  />
                                  <span>Created by @Jekob</span>
                                </a>
                              </Link>
                            </div>
                            <button
                              type="button"
                              className="default-btn border-radius-5"
                            >
                              Place Bid
                            </button>
                          </div>

                          <div className="content">
                            <h3>
                              <Link legacyBehavior href="/author-profile">
                                <a>Twilight Fracture City</a>
                              </Link>
                            </h3>
                            <div className="content-in">
                              <span>130 ETH 12/14</span>
                              <h4>Bid 80 ETH </h4>
                            </div>
                            <div className="featured-content-list">
                              <ul>
                                <li>
                                  <img
                                    src="../images/featured/featured-user5.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li>
                                  <img
                                    src="../images/featured/featured-user6.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li className="title">10+ People Placed Bid</li>
                              </ul>

                              <p>
                                <i className="ri-heart-line"></i> 142
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabPanel>

                <TabPanel>
                  <div className="tabs_item">
                    <div className="row justify-content-center">
                      <div className="col-lg-3 col-md-6">
                        <div className="featured-item">
                          <div className="featured-item-img">
                            <Link legacyBehavior href="/item-details">
                              <a>
                                <img
                                  src="../images/featured/featured-img3.jpg"
                                  alt="Images"
                                />
                              </a>
                            </Link>
                            <div className="featured-user">
                              <Link legacyBehavior href="/author-profile">
                                <a className="featured-user-option">
                                  <img
                                    src="../images/featured/featured-user3.jpg"
                                    alt="Images"
                                  />
                                  <span>Created by @Jekob</span>
                                </a>
                              </Link>
                            </div>
                            <button
                              type="button"
                              className="default-btn border-radius-5"
                            >
                              Place Bid
                            </button>
                          </div>

                          <div className="content">
                            <h3>
                              <Link legacyBehavior href="/author-profile">
                                <a>Become One With Nature</a>
                              </Link>
                            </h3>
                            <div className="content-in">
                              <span>120 ETH 12/14</span>
                              <h4>Bid 90 ETH </h4>
                            </div>
                            <div className="featured-content-list">
                              <ul>
                                <li>
                                  <img
                                    src="../images/featured/featured-user4.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li>
                                  <img
                                    src="../images/featured/featured-user5.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li className="title">10+ People Placed Bid</li>
                              </ul>

                              <p>
                                <i className="ri-heart-line"></i> 132
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-3 col-md-6">
                        <div className="featured-item">
                          <div className="featured-item-img">
                            <Link legacyBehavior href="/item-details">
                              <a>
                                <img
                                  src="../images/featured/featured-img4.jpg"
                                  alt="Images"
                                />
                              </a>
                            </Link>
                            <div className="featured-user">
                              <Link legacyBehavior href="/author-profile">
                                <a className="featured-user-option">
                                  <img
                                    src="../images/featured/featured-user4.jpg"
                                    alt="Images"
                                  />
                                  <span>Created by @Jekob</span>
                                </a>
                              </Link>
                            </div>
                            <button
                              type="button"
                              className="default-btn border-radius-5"
                            >
                              Place Bid
                            </button>
                          </div>

                          <div className="content">
                            <h3>
                              <Link legacyBehavior href="/author-profile">
                                <a>Twilight Fracture City</a>
                              </Link>
                            </h3>
                            <div className="content-in">
                              <span>130 ETH 12/14</span>
                              <h4>Bid 80 ETH </h4>
                            </div>
                            <div className="featured-content-list">
                              <ul>
                                <li>
                                  <img
                                    src="../images/featured/featured-user5.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li>
                                  <img
                                    src="../images/featured/featured-user6.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li className="title">10+ People Placed Bid</li>
                              </ul>

                              <p>
                                <i className="ri-heart-line"></i> 142
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-3 col-md-6">
                        <div className="featured-item">
                          <div className="featured-item-img">
                            <Link legacyBehavior href="/item-details">
                              <a>
                                <img
                                  src="../images/featured/featured-img5.jpg"
                                  alt="Images"
                                />
                              </a>
                            </Link>
                            <div className="featured-user">
                              <Link legacyBehavior href="/author-profile">
                                <a className="featured-user-option">
                                  <img
                                    src="../images/featured/featured-user5.jpg"
                                    alt="Images"
                                  />
                                  <span>Created by @Jekob</span>
                                </a>
                              </Link>
                            </div>
                            <button
                              type="button"
                              className="default-btn border-radius-5"
                            >
                              Place Bid
                            </button>
                          </div>

                          <div className="content">
                            <h3>
                              <Link legacyBehavior href="/author-profile">
                                <a>Walking On Air</a>
                              </Link>
                            </h3>
                            <div className="content-in">
                              <span>110 ETH 12/14</span>
                              <h4>Bid 90 ETH </h4>
                            </div>
                            <div className="featured-content-list">
                              <ul>
                                <li>
                                  <img
                                    src="../images/featured/featured-user6.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li>
                                  <img
                                    src="../images/featured/featured-user7.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li className="title">10+ People Placed Bid</li>
                              </ul>

                              <p>
                                <i className="ri-heart-line"></i> 112
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-3 col-md-6">
                        <div className="featured-item">
                          <div className="featured-item-img">
                            <Link legacyBehavior href="/item-details">
                              <a>
                                <img
                                  src="../images/featured/featured-img6.jpg"
                                  alt="Images"
                                />
                              </a>
                            </Link>
                            <div className="featured-user">
                              <Link legacyBehavior href="/author-profile">
                                <a className="featured-user-option">
                                  <img
                                    src="../images/featured/featured-user6.jpg"
                                    alt="Images"
                                  />
                                  <span>Created by @Jekob</span>
                                </a>
                              </Link>
                            </div>
                            <button
                              type="button"
                              className="default-btn border-radius-5"
                            >
                              Place Bid
                            </button>
                          </div>

                          <div className="content">
                            <h3>
                              <Link legacyBehavior href="/author-profile">
                                <a>Supper Nuemorphism</a>
                              </Link>
                            </h3>
                            <div className="content-in">
                              <span>130 ETH 12/14</span>
                              <h4>Bid 70 ETH </h4>
                            </div>
                            <div className="featured-content-list">
                              <ul>
                                <li>
                                  <img
                                    src="../images/featured/featured-user7.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li>
                                  <img
                                    src="../images/featured/featured-user8.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li className="title">10+ People Placed Bid</li>
                              </ul>

                              <p>
                                <i className="ri-heart-line"></i> 162
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-3 col-md-6">
                        <div className="featured-item">
                          <div className="featured-item-img">
                            <Link legacyBehavior href="/item-details">
                              <a>
                                <img
                                  src="../images/featured/featured-img7.jpg"
                                  alt="Images"
                                />
                              </a>
                            </Link>
                            <div className="featured-user">
                              <Link legacyBehavior href="/author-profile">
                                <a className="featured-user-option">
                                  <img
                                    src="../images/featured/featured-user7.jpg"
                                    alt="Images"
                                  />
                                  <span>Created by @Jekob</span>
                                </a>
                              </Link>
                            </div>
                            <button
                              type="button"
                              className="default-btn border-radius-5"
                            >
                              Place Bid
                            </button>
                          </div>

                          <div className="content">
                            <h3>
                              <Link legacyBehavior href="/author-profile">
                                <a>Dark-light Angel</a>
                              </Link>
                            </h3>
                            <div className="content-in">
                              <span>110 ETH 12/14</span>
                              <h4>Bid 80 ETH </h4>
                            </div>
                            <div className="featured-content-list">
                              <ul>
                                <li>
                                  <img
                                    src="../images/featured/featured-user8.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li>
                                  <img
                                    src="../images/featured/featured-user1.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li className="title">10+ People Placed Bid</li>
                              </ul>

                              <p>
                                <i className="ri-heart-line"></i> 162
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-3 col-md-6">
                        <div className="featured-item">
                          <div className="featured-item-img">
                            <Link legacyBehavior href="/item-details">
                              <a>
                                <img
                                  src="../images/featured/featured-img8.jpg"
                                  alt="Images"
                                />
                              </a>
                            </Link>
                            <div className="featured-user">
                              <Link legacyBehavior href="/author-profile">
                                <a className="featured-user-option">
                                  <img
                                    src="../images/featured/featured-user8.jpg"
                                    alt="Images"
                                  />
                                  <span>Created by @Jekob</span>
                                </a>
                              </Link>
                            </div>
                            <button
                              type="button"
                              className="default-btn border-radius-5"
                            >
                              Place Bid
                            </button>
                          </div>

                          <div className="content">
                            <h3>
                              <Link legacyBehavior href="/author-profile">
                                <a>Exe Dream Hight</a>
                              </Link>
                            </h3>
                            <div className="content-in">
                              <span>160 ETH 12/14</span>
                              <h4>Bid 90 ETH </h4>
                            </div>
                            <div className="featured-content-list">
                              <ul>
                                <li>
                                  <img
                                    src="../images/featured/featured-user1.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li>
                                  <img
                                    src="../images/featured/featured-user3.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li className="title">10+ People Placed Bid</li>
                              </ul>

                              <p>
                                <i className="ri-heart-line"></i> 182
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-3 col-md-6">
                        <div className="featured-item">
                          <div className="featured-item-img">
                            <Link legacyBehavior href="/item-details">
                              <a>
                                <img
                                  src="../images/featured/featured-img1.jpg"
                                  alt="Images"
                                />
                              </a>
                            </Link>
                            <div className="featured-user">
                              <Link legacyBehavior href="/author-profile">
                                <a className="featured-user-option">
                                  <img
                                    src="../images/featured/featured-user1.jpg"
                                    alt="Images"
                                  />
                                  <span>Created by @Jekob</span>
                                </a>
                              </Link>
                            </div>
                            <button
                              type="button"
                              className="default-btn border-radius-5"
                            >
                              Place Bid
                            </button>
                          </div>

                          <div className="content">
                            <h3>
                              <Link legacyBehavior href="/author-profile">
                                <a>Industrial Revolution</a>
                              </Link>
                            </h3>
                            <div className="content-in">
                              <span>100 ETH 12/14</span>
                              <h4>Bid 80 ETH </h4>
                            </div>
                            <div className="featured-content-list">
                              <ul>
                                <li>
                                  <img
                                    src="../images/featured/featured-user1.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li>
                                  <img
                                    src="../images/featured/featured-user2.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li className="title">10+ People Placed Bid</li>
                              </ul>

                              <p>
                                <i className="ri-heart-line"></i> 122
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-3 col-md-6">
                        <div className="featured-item">
                          <div className="featured-item-img">
                            <Link legacyBehavior href="/item-details">
                              <a>
                                <img
                                  src="../images/featured/featured-img2.jpg"
                                  alt="Images"
                                />
                              </a>
                            </Link>
                            <div className="featured-user">
                              <Link legacyBehavior href="/author-profile">
                                <a className="featured-user-option">
                                  <img
                                    src="../images/featured/featured-user2.jpg"
                                    alt="Images"
                                  />
                                  <span>Created by @Jekob</span>
                                </a>
                              </Link>
                            </div>
                            <button
                              type="button"
                              className="default-btn border-radius-5"
                            >
                              Place Bid
                            </button>
                          </div>

                          <div className="content">
                            <h3>
                              <Link legacyBehavior href="/author-profile">
                                <a>Love In The Air</a>
                              </Link>
                            </h3>
                            <div className="content-in">
                              <span>110 ETH 12/14</span>
                              <h4>Bid 70 ETH </h4>
                            </div>
                            <div className="featured-content-list">
                              <ul>
                                <li>
                                  <img
                                    src="../images/featured/featured-user3.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li>
                                  <img
                                    src="../images/featured/featured-user2.jpg"
                                    alt="Images"
                                  />
                                </li>
                                <li className="title">10+ People Placed Bid</li>
                              </ul>

                              <p>
                                <i className="ri-heart-line"></i> 112
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabPanel>
              </div>
            </Tabs>
          </div>
        </div>
        {pagination && <Pagination />}
      </div>
    </>
  );
};

export default FeaturedArea;
