import { useSDK } from '@thirdweb-dev/react';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import moment from 'moment/moment';

const ItemDetailsHistory = ({ data }) => {
  console.log(data?.id);

  const [prevBids, setPRevBids] = useState()
  useEffect(() => {
  fetch(
    `http://localhost:1337/api/bidding/?filters[listingID][$eq]=${data?.id}`
  )
    .then((res) =>  res.json())
    .then((res) => {
      console.log(res);
      setPRevBids(res.data);

    })
    .then((err) => console.log(err));
  },[data])

  return (
    <>
      <div className="item-details-content">
        <h3>History</h3>
        <div className="item-details-into">
          <div className="row">
            {prevBids &&
              prevBids.map((data) => (
                <div className="col-lg-12">
                  <div className="item-details-card">
                    <div className="item-details-card-img">
                      <img
                        src={`http://localhost:1337${data.attributes.userInfo.data.profilePicHash}`}
                        alt="Images"
                      />
                      <i className="ri-check-line"></i>
                    </div>
                    <div className="item-details-card-content">
                      <h3>
                        Bid Placed For <b>{data.attributes.bidAmount} MATIC</b>
                      </h3>
                      <span>@{data.attributes.userInfo.data.firstName}</span>
                    </div>
                    <div className="work-hours">
                      {moment(data.attributes.createdAt).fromNow()}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemDetailsHistory;
