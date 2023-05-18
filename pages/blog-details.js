import NavbarTwo from '../components/Layout/NavbarTwo';
import PageBanner from '../components/Common/PageBanner';
import Footer from '../components/Layout/Footer';
import Copyright from '../components/Common/Copyright';
import BlogDetailsArea from '../components/BlogDetails/BlogDetailsArea';
import Navbar from "../components/Layout/Navbar";

const BlogDetails = () => {
  return (
    <>
      <Navbar />
      <PageBanner
        bannerHeading='Blog Details Page'
        parentTitle='Community'
        pageTitle='Blog Details'
        bg='inner-bg6'
      />

      <BlogDetailsArea/>

      <Footer />
      <Copyright />
    </>
  );
};

export default BlogDetails;
