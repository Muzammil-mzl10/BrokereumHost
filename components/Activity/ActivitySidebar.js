import React from "react";
import Link from "next/link";

const ActivitySidebar = () => {
	return (
    <>
      <div className="side-bar-area pl-20">
        <div className="side-bar-widget">
          <h3 className="title">
            Filter
            <Link href="/activity" legacyBehavior>
              <a>Clear All</a>
            </Link>
          </h3>
          <form className="search-form">
            <input
              type="search"
              className="form-control"
              placeholder="Search keyword"
            />
            <button type="submit">
              <i className="ri-search-line"></i>
            </button>
          </form>
        </div>

        <div className="side-bar-widget-categories">
          <h3 className="title">Categories</h3>
          <ul>
            <li>
              <Link href="/categories" legacyBehavior>
                <a>Art</a>
              </Link>
            </li>
            <li>
              <Link href="/categories" legacyBehavior>
                <a>Virtual Worlds</a>
              </Link>
            </li>
            <li>
              <Link href="/categories" legacyBehavior>
                <a>Collectibles</a>
              </Link>
            </li>
            <li>
              <Link href="/categories" legacyBehavior>
                <a>Music</a>
              </Link>
            </li>
            <li>
              <Link href="/categories" legacyBehavior>
                <a>Games</a>
              </Link>
            </li>
            <li>
              <Link href="/categories" legacyBehavior>
                <a>Domains</a>
              </Link>
            </li>
            <li>
              <Link href="/categories" legacyBehavior>
                <a>Memes</a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default ActivitySidebar;
