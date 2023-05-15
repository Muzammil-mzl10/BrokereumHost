import Navbar from '../components/Layout/Navbar';
import BannerArea from '../components/HomeOne/BannerArea';
import TrendingArea from '../components/HomeOne/TrendingArea';
import TopSeller from '../components/Common/TopSeller';
import AuctionArea from '../components/HomeOne/AuctionArea';
import FeaturedArea from '../components/Common/FeaturedArea';
import CreateArea from '../components/HomeOne/CreateArea';
import AuthorArea from '../components/HomeOne/AuthorArea';
import CollectionsArea from '../components/Common/CollectionsArea';
import Footer from '../components/Layout/Footer';
import Copyright from '../components/Common/Copyright';
import { useState } from 'react';

const Index = () => {

  const [address, setAddress] = useState();

  console.log(address)

  return (
    <>
      <Navbar address={setAddress} />
      <BannerArea />
      <TrendingArea />
      <TopSeller />
      <AuctionArea />
      <FeaturedArea title="Featured Assets" />
      <CreateArea />
      <AuthorArea />
      <CollectionsArea />
      <Footer />
      <Copyright />
    </>
  );
};

export default Index;
