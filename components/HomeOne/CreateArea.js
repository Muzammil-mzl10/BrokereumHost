import Link from 'next/link';

const CreateArea = () => {
  return (
    <>
      <div className="create-area pt-100 pb-70">
        <div className="container">
          <div className="section-title text-center">
            <h2>Sell Your Real Estate with Ease</h2>
          </div>

          <div className="row align-items-center pt-45">
            <div className="col-lg-6">
              <div className="create-img">
                <img
                  height={500}
                  src="../images/create/Front_page_image.jpeg"
                  alt="Images"
                />
              </div>
            </div>

            <div className="col-lg-6">
              <div className="create-card-right pl-20">
                <div className="row justify-content-center">
                  <div className="col-lg-6 col-6">
                    <div className="create-card">
                      <img src="../images/create/2.png" alt="Images" />
                      <h3>
                        {" "}
                        <Link legacyBehavior href="/add-wallet">
                          <a>Authenticate and Log-In</a>
                        </Link>
                      </h3>
                      <p>
                        Authenticate yourself by clicking the wallet button in
                        the top right corner. Learn about the wallets we
                        support.
                      </p>
                    </div>
                  </div>

                  <div className="col-lg-6 col-6">
                    <div className="create-card">
                      <img src="../images/create/3.png" alt="Images" />
                      <h3>
                        <Link legacyBehavior href="/create-collection">
                          <a>Edit Your Profile</a>
                        </Link>
                      </h3>
                      <p>
                        Add your contact information and see your activity
                        history.
                      </p>
                    </div>
                  </div>

                  <div className="col-lg-6 col-6">
                    <div className="create-card">
                      <img src="../images/create/1.png" alt="Images" />
                      <h3>
                        <Link legacyBehavior href="/help-center">
                          <a>Add Your Real Estate</a>
                        </Link>
                      </h3>
                      <p>
                        Showcase your real estate (image, video, text), add a
                        title and description, and further details such as
                        ownership documents. The more detailed, the faster the
                        sale will be.
                      </p>
                    </div>
                  </div>

                  <div className="col-lg-6 col-6">
                    <div className="create-card">
                      <img src="../images/create/4.png" alt="Images" />
                      <h3>
                        <Link legacyBehavior href="/activity">
                          <a>List Property For Sale</a>
                        </Link>
                      </h3>
                      <p>
                        Choose between auctions and fixed-price listings. You
                        choose how you want to sell your property.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateArea;
