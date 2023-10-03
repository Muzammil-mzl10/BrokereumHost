import { useEffect, useState } from "react";
import Link from "../../utils/ActiveLink";
import SearchModal from "./SearchModal";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [sticky, setSticky] = useState(false);

  const walletAddress = useAddress();



  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const toggleWallet = () => {
    setShowWallet(!showWallet);
  };

  const toggleSearchModal = () => {
    setShowSearchModal(!showSearchModal);
  };

  //sticky menu
  const showStickyMenu = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };
  if (typeof window !== "undefined") {
    // browser code
    window.addEventListener("scroll", showStickyMenu);
  }

  return (
    <>
      <div className={sticky ? "is-sticky navbar-area" : "navbar-area"}>
        <div className="mobile-responsive-nav">
          <div className="container-fluid">
            <div className="mobile-responsive-menu">
              <div
                onClick={() => toggleMenu()}
                className="hamburger-menu hamburger-two"
              >
                {showMenu ? (
                  <i className="ri-close-line"></i>
                ) : (
                  <i className="ri-menu-line"></i>
                )}
              </div>
              <div className="logo">
                <Link legacyBehavior href="/">
                  <a>
                    <img
                      style={{ height: "65px", width: "200px" }}
                      src="../images/logo.png"
                      alt="logo"
                    />
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div
          className={
            showMenu
              ? "show desktop-nav desktop-nav-one nav-area"
              : "desktop-nav desktop-nav-one nav-area"
          }
        >
          <div className="container-fluid">
            <nav className="navbar navbar-expand-md navbar-light ">
              <Link legacyBehavior href="/">
                <a className="navbar-brand" style={{ width: "12rem" }}>
                  <img src="../images/footer-logo2.png" alt="Logo" />
                </a>
              </Link>

              <div className="nav-widget-form">
                <form className="search-form">
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Search items, Creators "
                  />
                  <button type="submit">
                    <i className="ri-search-line"></i>
                  </button>
                </form>
              </div>

              <div
                className="collapse navbar-collapse mean-menu"
                id="navbarSupportedContent"
              >
                <ul className="navbar-nav m-auto">
                  <li className="nav-item">
                    <Link legacyBehavior href="/" activeClassName="active">
                      <a className="nav-link active">Home</a>
                    </Link>
                  </li>

                  {/* <li className="nav-item">
                    <a href="#" className="nav-link ">
                      Discover
                      <i className="ri-arrow-down-s-line"></i>
                    </a>
                    <ul className="dropdown-menu">
                      <li className="nav-item">
                        <Link legacyBehavior href="/auction" activeClassName="active">
                          <a className="nav-link">Live Auction</a>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link legacyBehavior href="/discover-1" activeClassName="active">
                          <a className="nav-link">Discover Style One</a>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link legacyBehavior href="/discover-2" activeClassName="active">
                          <a className="nav-link">Discover Style Two</a>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link legacyBehavior href="/item-details" activeClassName="active">
                          <a className="nav-link">Item Details</a>
                        </Link>
                      </li>
                    </ul>
                  </li> */}

                  <li className="nav-item">
                    <Link
                      legacyBehavior
                      href="/activity"
                      activeClassName="active"
                    >
                      <a className="nav-link">Activity</a>
                    </Link>
                  </li>

                  <li className="nav-item">
                    <a href="#" className="nav-link">
                      Pages
                      <i className="ri-arrow-down-s-line"></i>
                    </a>
                    <ul className="dropdown-menu">
                      {/* <li className="nav-item">
                        <Link
                          legacyBehavior
                          href="/collection"
                          activeClassName="active"
                        >
                          <a className="nav-link">Collection</a>
                        </Link>
                      </li> */}

                      <li className="nav-item">
                        <Link
                          legacyBehavior
                          href="/create-collection"
                          activeClassName="active"
                        >
                          <a className="nav-link">Add Property</a>
                        </Link>
                      </li>

                      <li className="nav-item">
                        <Link
                          legacyBehavior
                          href="/batchUpload"
                          activeClassName="active"
                        >
                          <a className="nav-link">Batch Upload</a>
                        </Link>
                      </li>

                      <li className="nav-item">
                        <Link
                          legacyBehavior
                          href="/author-profile"
                          activeClassName="active"
                        >
                          <a className="nav-link">My Property</a>
                        </Link>
                      </li>

                      {/* <li className="nav-item">
                        <Link legacyBehavior href="/team" activeClassName="active">
                          <a className="nav-link">Team</a>
                        </Link>
                      </li> */}

                      {/* <li className="nav-item">
                        <Link legacyBehavior href="/testimonials" activeClassName="active">
                          <a className="nav-link">Testimonials</a>
                        </Link>
                      </li> */}

                      {/* <li className="nav-item">
                        <a href="#" className="nav-link">
                          User
                          <i className="ri-arrow-down-s-line"></i>
                        </a>
                        <ul className="dropdown-menu">
                          <li className="nav-item">
                            <Link legacyBehavior href="/login" activeClassName="active">
                              <a className="nav-link">Log In</a>
                            </Link>
                          </li>
                          <li className="nav-item">
                            <Link legacyBehavior href="/register" activeClassName="active">
                              <a className="nav-link">Register</a>
                            </Link>
                          </li>
                          <li className="nav-item">
                            <Link legacyBehavior
                              href="/forgot-password"
                              activeClassName="active"
                            >
                              <a className="nav-link">Forgot Password</a>
                            </Link>
                          </li>
                        </ul>
                      </li> */}

                      <li className="nav-item">
                        <Link
                          legacyBehavior
                          href="/terms-condition"
                          activeClassName="active"
                        >
                          <a className="nav-link">Terms & Conditions</a>
                        </Link>
                      </li>

                      <li className="nav-item">
                        <Link
                          legacyBehavior
                          href="/privacy-policy"
                          activeClassName="active"
                        >
                          <a className="nav-link">Privacy Policy</a>
                        </Link>
                      </li>

                      {/* <li className="nav-item">
                        <Link legacyBehavior href="/404" activeClassName="active">
                          <a className="nav-link">404 Page</a>
                        </Link>
                      </li> */}

                      {/* <li className="nav-item">
                        <Link legacyBehavior href="/coming-soon" activeClassName="active">
                          <a className="nav-link">Coming Soon</a>
                        </Link>
                      </li> */}
                    </ul>
                  </li>

                  <li className="nav-item">
                    <a href="#" className="nav-link">
                      Community
                      <i className="ri-arrow-down-s-line"></i>
                    </a>
                    <ul className="dropdown-menu">
                      <li className="nav-item">
                        <Link
                          legacyBehavior
                          href="/about"
                          activeClassName="active"
                        >
                          <a className="nav-link">About Us</a>
                        </Link>
                      </li>

                      <li className="nav-item">
                        <Link
                          legacyBehavior
                          href="/add-wallet"
                          activeClassName="active"
                        >
                          <a className="nav-link">Add Wallet</a>
                        </Link>
                      </li>

                      {/* <li className="nav-item">
                        <a href="#" className="nav-link">
                          Blog
                          <i className="ri-arrow-down-s-line"></i>
                        </a>
                        <ul className="dropdown-menu">
                          <li className="nav-item">
                            <Link
                              legacyBehavior
                              href="/blog-1"
                              activeClassName="active"
                            >
                              <a className="nav-link">Blog Grid</a>
                            </Link>
                          </li>
                          <li className="nav-item">
                            <Link
                              legacyBehavior
                              href="/blog-2"
                              activeClassName="active"
                            >
                              <a className="nav-link">Blog Left Sidebar</a>
                            </Link>
                          </li>
                          <li className="nav-item">
                            <Link
                              legacyBehavior
                              href="/blog-3"
                              activeClassName="active"
                            >
                              <a className="nav-link">Blog Right Sidebar</a>
                            </Link>
                          </li>
                          <li className="nav-item">
                            <Link
                              legacyBehavior
                              href="/blog-details"
                              activeClassName="active"
                            >
                              <a className="nav-link">Blog Details</a>
                            </Link>
                          </li>

                          <li className="nav-item">
                            <Link
                              legacyBehavior
                              href="/categories"
                              activeClassName="active"
                            >
                              <a className="nav-link">Categories</a>
                            </Link>
                          </li>

                          <li className="nav-item">
                            <Link
                              legacyBehavior
                              href="/tags"
                              activeClassName="active"
                            >
                              <a className="nav-link">Tags</a>
                            </Link>
                          </li>
                        </ul>
                      </li> */}

                      <li className="nav-item">
                        <Link
                          legacyBehavior
                          href="/help-center"
                          activeClassName="active"
                        >
                          <a className="nav-link">Help Center</a>
                        </Link>
                      </li>
                    </ul>
                  </li>

                  <li className="nav-item">
                    <Link
                      legacyBehavior
                      href="/contact"
                      activeClassName="active"
                    >
                      <a className="nav-link">Contact Us</a>
                    </Link>
                  </li>
                  {walletAddress ? (
                    <>
                      <li className="nav-item">
                        <Link
                          legacyBehavior
                          href="/profile"
                          activeClassName="active"
                        >
                          <a className="nav-link">Profile</a>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          legacyBehavior
                          href="https://xmtp.chat/inbox"
                          activeClassName="active"
                        >
                          <a target="_blank" className="nav-link">
                            Chats
                          </a>
                        </Link>
                      </li>
                    </>
                  ) : (
                    ""
                  )}
                </ul>

                <div className="others-options">
                  <ul className="optional-item-list">
                    <li>
                      <ConnectWallet theme="dark" btnTitle="Connect Wallet" />
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          </div>
        </div>

        <div className="mobile-nav">
          <div
            className="search-btn global-pointer"
            onClick={() => toggleSearchModal()}
          >
            <a data-bs-toggle="modal" data-bs-target="#searchmodal">
              <i className="ri-search-line"></i>
            </a>
          </div>
        </div>

        <div className="side-nav-responsive">
          <div className="container-max">
            <div
              className="dot-menu dot-menu-mt"
              onClick={() => toggleWallet()}
            >
              <div style={{ marginTop: "-7px" }} className="circle-inner">
                <div className="circle circle-one"></div>
                <div className="circle circle-two"></div>
                <div className="circle circle-three"></div>
              </div>
            </div>

            <div
              className={
                showWallet
                  ? "container container-mt active"
                  : "container container-mt"
              }
            >
              <div className="side-nav-inner">
                <div className="side-nav justify-content-center align-items-center">
                  <div className="side-nav-item">
                    <ul className="optional-item-list">
                      <li>
                        <Link
                          legacyBehavior
                          href="/create-collection"
                          activeClassName="active"
                        >
                          <a>Create</a>
                        </Link>
                      </li>
                      <li>
                        <ConnectWallet theme="dark" btnTitle="Connect Wallet" />
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SearchModal
        showSearchModal={showSearchModal}
        toggleSearchModal={toggleSearchModal}
      />
    </>
  );
};

export default Navbar;
