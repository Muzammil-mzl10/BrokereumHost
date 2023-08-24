import React from 'react';
import Link from 'next/link'

const PageBanner = ({ bannerHeading, parentTitle, pageTitle,bg }) => {
  return (
    <>
      <div style={{height:"50vh"}} className={`inner-banner  bg-activity-img`}>
        <div className="container">
          <div className="inner-title">
            <h3>{bannerHeading}</h3>
            <ul>
              <li>
                <Link legacyBehavior href="/">
                  <a>Home</a>
                </Link>
              </li>
              <li>{parentTitle}</li>
              {pageTitle && <li>{pageTitle}</li>}
            </ul>

            {/* <div className="inner-shape">
              <img src="../images/inner-banner/inner-shape1.png" alt="Images" />
              <img src="../images/inner-banner/inner-shape2.png" alt="Images" />
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default PageBanner;
