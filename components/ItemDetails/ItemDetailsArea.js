import React , {useState , useEffect} from 'react';
import ItemDetailsDescription from './ItemDetailsDescription';
import ItemDetailsHistory from './ItemDetailsHistory';
import ItemDetailsUser from './ItemDetailsUser';
import { ThirdwebSDK } from "@thirdweb-dev/sdk/evm";
import OverlayImage from './Overlay';

const ItemDetailsArea = ({tokenID , data}) => {
  const [ipfsData, setipfsData] = useState();
  const [marketplaceModule, setMarketplaceModule] = useState();
  const [satelitleImg, setSateliteImg] = useState();
  const [worktopoImg, setWorldTopoImg] = useState();
  const sdk = new ThirdwebSDK("mumbai");
  // console.log(tokenID);

  useEffect(async () => {
    setMarketplaceModule(
      await sdk.getContract(process.env.Marketplace_Contract)
    );
  }, []);

  useEffect(() => {
    console.log(data?.asset.properties.IPFSHash);
    fetch(data?.asset.properties.IPFSHash)
      .then((res) => res.json())
      .then((res) => {
        setipfsData(res.propertyData);
        console.log(res.propertyData);
        setSateliteImg(res.parcelData.image_urls.satellite_image);
        setWorldTopoImg(res.parcelData.image_urls.world_topo_image);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [data]);
  // console.log(satelitleImg)
  
const [days, setDays] = useState("");
const [hours, setHours] = useState("");
const [minutes, setMinutes] = useState("");
const [seconds, setSeconds] = useState("");


const comingSoonTime = () => {
  const endTimeInSeconds = data?.endTimeInSeconds; // Set the endTimeInSeconds variable
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
}, [data]);
  



  return (
    <>
      <div className="item-details-area pt-100 pb-70">
        <div className="container">
          <div className="row">
            <div className="col-lg-7">
              <div className="item-details-left-side pr-20">
                <div className="item-details-img">
                  {/* <img
                    src={data.asset.image}
                    alt='Images'
                  /> */}
                  {satelitleImg && worktopoImg ? (
                    <OverlayImage image1={satelitleImg} image2={worktopoImg} />
                  ) : (
                    ""
                  )}
                  <span>
                    <i className="ri-heart-line"></i> 340
                  </span>
                </div>

                <ItemDetailsHistory />
              </div>
            </div>

            <div className="col-lg-5">
              <div className="item-details-dsce">
                <ItemDetailsDescription
                  days={days}
                  hours={hours}
                  minutes={minutes}
                  seconds = {seconds}
                  data={data}
                  ipfsData={ipfsData}
                />

                <ItemDetailsUser />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemDetailsArea;
