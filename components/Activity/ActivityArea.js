import React, { useEffect, useState } from 'react';
import Pagination from '../Common/Pagination';
import ActivitySidebar from './ActivitySidebar';
import { useAddress } from '@thirdweb-dev/react';
import moment from "moment/moment";
import Link from 'next/link';

const ActivityArea = () => {

  const [activity,setActivity]= useState()

  const address=  useAddress()
  useEffect(() => {
    if (address) {
      fetch(
        `${process.env.STRAPI_URL_PROD}/api/activities/?filters[address][$eq]=${address}`
      )
        .then((res) => res.json())
        .then((res) => {
          console.log(res.data)
          setActivity(res.data)
        })
    }
  },[address])

  return (
    <>
      <div className="activity-area pt-100 pb-70">
        <div className="container">
          <div className="section-title">
            <h2>Activity</h2>
          </div>

          <div className="row pt-45">
            <div className="col-lg-9">
              <div className="row justify-content-center">
                {activity
                  ?.slice()
                  ?.reverse()
                  .map((data) => (
                    <div className="col-lg-12">
                      <div className="activity-card">
                        <div className="activity-img">
                          <img
                            src="../images/activity/activity-img1.jpg"
                            alt="Images"
                          />
                        </div>

                        <div className="activity-content">
                          <p>
                            <i className="ri-calendar-2-line"></i>{" "}
                            {moment(data.attributes.createdAt).fromNow()}
                          </p>
                          <span>
                            <i className="ri-time-line"></i>{" "}
                            {data.attributes.createdAt.split("T")[0]}
                          </span>
                        </div>

                        <div className="activity-into">
                          <h3
                            onClick={() =>
                              navigator.clipboard.writeText(
                                data.attributes.Data.data.transactionHash
                              )
                            }
                            style={{ cursor: "pointer" }}
                          >
                            {data.attributes.Data.data.transactionHash.slice(
                              0,
                              10
                            )}
                            ...
                            {data.attributes.Data.data.transactionHash.slice(
                              -10
                            )}
                          </h3>
                          <span style={{fontWeight:"bold", fontSize:"20px"}} >{data.attributes.Name} a Property</span>
                        </div>

                        <div className="activity-btn">
                          <Link
                            passHref
                            href={`https://mumbai.polygonscan.com/tx/${data.attributes.Data.data.transactionHash}`}
                          >
                            <a target="_blank" rel="noopener noreferrer">
                            <i
                              style={{ cursor: "pointer" }}
                              class="ri-arrow-up-circle-fill"
                            ></i>
                             </a>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                {/* <div className="col-lg-12">
                  <div className="activity-card">
                    <div className="activity-img">
                      <img
                        src="../images/activity/activity-img2.jpg"
                        alt="Images"
                      />
                    </div>

                    <div className="activity-content">
                      <p>
                        <i className="ri-calendar-2-line"></i> 7 June, 2021
                      </p>
                      <span>
                        <i className="ri-time-line"></i> 10:49 AM
                      </span>
                    </div>

                    <div className="activity-into">
                      <h3>Walking On Air</h3>
                      <span>
                        Listed By <b>@Henry </b> For <b>130 ETH</b> Each
                      </span>
                    </div>

                    <div className="activity-btn">
                      <i className="ri-delete-bin-4-line"></i>
                    </div>
                  </div>
                </div> */}

                <Pagination />
              </div>
            </div>

            <div className="col-lg-3">
              <ActivitySidebar />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ActivityArea;
