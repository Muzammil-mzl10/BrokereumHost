import NavbarTwo from '../components/Layout/NavbarTwo';
import PageBanner from '../components/Common/PageBanner';
import CreateCollectionArea from '../components/CreateCollection/CreateCollectionArea';
import Footer from '../components/Layout/Footer';
import Copyright from '../components/Common/Copyright';
import Navbar from '../components/Layout/Navbar';
import { useAddress } from '@thirdweb-dev/react';

const CreateCollection = () => {
  return (
    <>
      <Navbar />
      <PageBanner
        bannerHeading='Recent Activity'
        parentTitle='Activity'
        pageTitle=''
        bg='inner-bg13'
      />
      <CreateCollectionArea/>
      <Footer />
      <Copyright />
    </>
  );
};

export default CreateCollection;
