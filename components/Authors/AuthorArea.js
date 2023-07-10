import React, { useEffect ,useState} from 'react';
import Pagination from '../Common/Pagination';
import Link from 'next/link'
import {useStorageUpload , useAddress , useSigner} from "@thirdweb-dev/react"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThirdwebSDK } from "@thirdweb-dev/sdk/evm";
import { Goerli, Mumbai } from "@thirdweb-dev/chains";

const AuthorArea = () => {
  const [contract, setContract] = useState()
  const [lengthIPFS, setlengthIPFS] = useState(1)
  const [metadata,setmetadata] = useState([])

  const walletAddress = useAddress()

  const signer = useSigner()
  const getNFTColleciton = async () => {
    const sdk = ThirdwebSDK.fromSigner(signer, "mumbai");
    setContract(await sdk.getContract(process.env.ERC_Contract))
  }
  
  useEffect(() => {
    getNFTColleciton()
  },[])


  const { mutateAsync: upload } = useStorageUpload({
    onProgress: (progress) => {
      console.log(progress);
    },
  });

   const uploadToIpfs = async (data) => {

     const uploadUrl = await upload({
       data: [
         {
           parcelID: data.parcelID,
           parcelData: data.properties,
         },
       ],
       options: { uploadWithGatewayUrl: true },
     });
     console.log(uploadUrl[0])
     return uploadUrl[0]
   };
  

  useEffect(async() => {
    console.log(metadata)
    if (metadata.length == lengthIPFS) {
      console.log("Finally the time has come.....!!")
      try{
        
        const tx = await contract.erc721.mintBatchTo(walletAddress, metadata);
        console.log(tx)
        toast.success("Batch Minted Successfully!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } catch (Err) {
        console.log(Err)
        toast.error("🦄 Error while batch minting", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  },[metadata])

  const uploadBatch = async() => {
    toast.info("🦄 Minting started....", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    console.log("Uploading....!")
     var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("token", "DNfbHaqajFigz4jPX9B8vnatUduLKZXVwA83WKZG");
  

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };


    fetch("http://46.243.90.203:3000/res_api/signal_data_all", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        setlengthIPFS(result.length)
        result.map(async(data) => {
          const ipfsHash = await uploadToIpfs(data)
          console.log(ipfsHash)
          let data1 = {
            image: data.properties.image_urls.satellite_image,
            name: "Name of the property",
            description: "Description",
            lat: "47.649482",
            lng: "9.160064",
            properties: {
              IPFSHash: ipfsHash,
              priceType: "formData.priceType",
              salesDeadline: "formData.salesDeadline",
              downPayment: "formData.downPayment",
              propertyType: "formData.propertyType",
            },
          }
          setmetadata((prevValue)=> [...prevValue , data1])
        })
        console.log(metadata)
      });
  }
  return (
    <>
      <div className="author-widget-bg author-area-bg pt-100 pb-70">
        <div className="container">
          <div className="section-title">
            <h2>Batch Upload</h2>
          </div>
          <button
            onClick={uploadBatch}
            className="default-btn border-radius-5 mt-5"
          >
            Batch Upload
          </button>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default AuthorArea;
