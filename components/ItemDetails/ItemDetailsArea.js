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
  console.log(tokenID);

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
      })
      .catch((err) => {
        console.log(err);
      });
  }, [data]);
  console.log(satelitleImg)
  
  console.log(data);
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
                  {
                    satelitleImg && worktopoImg ? 
                      
                  <OverlayImage image1={satelitleImg} image2={worktopoImg} />
                  :""}
                  <span>
                    <i className="ri-heart-line"></i> 340
                  </span>
                </div>

                <ItemDetailsHistory />
              </div>
            </div>

            <div className="col-lg-5">
              <div className="item-details-dsce">
                <ItemDetailsDescription data={data} ipfsData = {ipfsData} />

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
