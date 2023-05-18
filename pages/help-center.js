import NavbarTwo from '../components/Layout/NavbarTwo';
import PageBanner from '../components/Common/PageBanner';
import Footer from '../components/Layout/Footer';
import Copyright from '../components/Common/Copyright';
import HelpWidget from '../components/HelpCenter/HelpWidget';
import HelpCenterArea from '../components/HelpCenter/HelpCenterArea';
import PromoteArea from '../components/HelpCenter/PromoteArea';
import Navbar from "../components/Layout/Navbar";

const HelpCenter = () => {
  return (
    <>
      <Navbar />
      <PageBanner
        bannerHeading='Get Help'
        parentTitle='Community'
        pageTitle='Help Center'
        bg='inner-bg5'
      />

      <HelpWidget />
      <HelpCenterArea/>
      <PromoteArea/>

      <Footer />
      <Copyright />
    </>
  );
};

export default HelpCenter;
