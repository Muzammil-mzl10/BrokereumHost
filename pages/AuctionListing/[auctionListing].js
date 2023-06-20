import React, { useEffect, useState } from 'react'
import Footer from "../../components/Layout/Footer";
import Copyright from "../../components/Common/Copyright";
import Navbar from "../../components/Layout/Navbar";
import { useRouter } from "next/router";
import { ThirdwebSDK } from "@thirdweb-dev/sdk/evm";
import ListingDetailArea from "../../components/ItemDetails/ItemDetailsArea"


const auctionListing = () => {

    const router = useRouter();
    const [marketplaceModule, setMarketplaceModule] = useState()
    const [listingData , setListingData] = useState()
    const sdk = new ThirdwebSDK("mumbai");
    console.log(router.query.auctionListing);

    useEffect(async() => {
      setMarketplaceModule(await sdk.getContract(process.env.Marketplace_Contract))  
    }, [])
      
     useEffect(async () => {
       console.log(marketplaceModule);
       if (marketplaceModule) {
         setListingData(
           await marketplaceModule.englishAuctions.getAuction(
             router.query.auctionListing
           )
         );
       }
     }, [marketplaceModule]);
    
     console.log(listingData)


    return (
      <>
        <Navbar />
        <ListingDetailArea data={listingData} tokenID={router.query.nft} />
        <Footer />
        <Copyright />
      </>
    );
}

export default auctionListing
