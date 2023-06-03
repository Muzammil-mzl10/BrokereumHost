import NavbarTwo from '../../components/Layout/NavbarTwo';
import PageBanner from '../../components/Common/PageBanner';
import ItemDetailsArea from '../../components/ItemDetails/ItemDetailsArea';
import NFTDetailsArea from '../../components/NFTDetails/NFTDetailsArea';
import TrendingArea from '../../components/Common/TrendingArea';
import Footer from '../../components/Layout/Footer';
import Copyright from '../../components/Common/Copyright';
import Navbar from "../../components/Layout/Navbar";
import { useRouter } from "next/router";
 


const ItemDetails = () => {


    const router = useRouter();
    console.log(router.query.nft)

  return (
    <>
      <Navbar />
      <PageBanner
        bannerHeading="List Your Property"
        parentTitle="Discover"
        pageTitle="NFT Details"
        bg="inner-bg12"
      />
      <NFTDetailsArea
      tokenID={router.query.nft}
      />
      <Footer />
      <Copyright />
    </>
  );
};

export default ItemDetails;
