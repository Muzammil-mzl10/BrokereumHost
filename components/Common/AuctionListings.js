import React, {useState, useEffect} from 'react'
import Link from 'next/link';
import moment from "moment";
import Countdown from "react-countdown";

const AuctionListings = ({data}) => {
  const Completionist = () => (
    <span className="text-danger">Time for Bidding is Over...!</span>
  );
  const [days, setDays] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");

  const endTimeInSeconds = data.endTimeInSeconds; // Set the endTimeInSeconds variable

  const comingSoonTime = () => {
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

  useEffect(() => {
    const interval = setInterval(() => {
      comingSoonTime();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="col-lg-3 col-md-6">
      <div className="featured-item">
        <div className="featured-item-img">
          
            <a>
              <img src={data.asset.image} alt="Images" />
            </a>
          
          <div className="featured-user">
            
              <a className="featured-user-option">
                <img src="../images/featured/featured-user1.jpg" alt="Images" />
                <span>Created by @Farnil</span>
              </a>
            
          </div>
          <Link href={`/AuctionListing/${data.id}`}>
          <button type="button" className="default-btn border-radius-5">
            Place Bid
          </button>
          </Link>
          <div className="featured-item-clock" data-countdown="2021/09/09">
            {days} : {hours} : {minutes} : {seconds}
          </div>
        </div>

        <div className="content">
          <h3>
            
              <a>{data.asset.name}</a>
            
          </h3>
          <div className="content-in">
            <span>
              {data.buyoutCurrencyValue.displayValue}{" "}
              {data.buyoutCurrencyValue.symbol}
            </span>
            <h4>
              Bid {data.minimumBidCurrencyValue.displayValue}{" "}
              {data.minimumBidCurrencyValue.symbol}
            </h4>
          </div>
          <div className="featured-content-list">
            <ul>
              <li>
                <img src="../images/featured/featured-user1.jpg" alt="Images" />
              </li>
              <li>
                <img src="../images/featured/featured-user2.jpg" alt="Images" />
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
  );
}

export default AuctionListings
