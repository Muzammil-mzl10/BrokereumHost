import NavbarTwo from '../components/Layout/NavbarTwo';
import PageBanner from '../components/Common/PageBanner';
import AuthorArea from '../components/Authors/AuthorArea';
import InvolvedArea from '../components/Common/InvolvedArea';
import Footer from '../components/Layout/Footer';
import Copyright from '../components/Common/Copyright';
import Navbar from "../components/Layout/Navbar";

const Authors = () => {
  return (
    <>
      <Navbar />
      <PageBanner
        bannerHeading='Batch Upload Using Our RES API'
        parentTitle='Batch'
        pageTitle='Authors'
        bg='inner-bg9'
        
      />
      <AuthorArea/>
      <InvolvedArea />
      <Footer />
      <Copyright />
    </>
  );
};

export default Authors;
