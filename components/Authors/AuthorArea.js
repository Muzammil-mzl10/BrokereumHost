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
  const [adminContract,setAdminContract] = useState()
  const [lengthIPFS, setlengthIPFS] = useState(1)
  const [metadata,setmetadata] = useState([])

  const walletAddress = useAddress()

  const signer = useSigner()
  const getNFTColleciton = async () => {
    const sdk = ThirdwebSDK.fromSigner(signer, "mumbai", {
      clientId: process.env.thirdweb_CLIENTID,
    });
    setContract(await sdk.getContract(process.env.ERC_Contract))
  }
  const getAdminNFTContract = async () => {
    const sdk = ThirdwebSDK.fromPrivateKey(process.env.private_Key, "mumbai", {
      clientId: process.env.thirdweb_CLIENTID,
    });
    setAdminContract(await sdk.getContract(process.env.ERC_Contract))
  }
  
  // useEffect(async() => {
  //   if (contract) {
  //    const data =  await contract.roles.get(
  //      "minter"
  //      )
  //     console.log(data[0])
  //     console.log(walletAddress)
  //     if (data[0] !== walletAddress) {
  //       const tx = await contract.roles.grant("minter",walletAddress);
  //     }
  //   }
  // },[contract])

  useEffect(() => {
    if (ThirdwebSDK && signer) {
      getNFTColleciton();
      getAdminNFTContract();
    }
  }, [ThirdwebSDK, signer]);


  const { mutateAsync: upload } = useStorageUpload( {
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
  

useEffect(() => {
  const mintBatch = async () => {
    console.log(metadata);
    if (metadata.length === lengthIPFS) {
      console.log("Finally the time has come.....!!");
      try {
        const rolesAndMembers = await adminContract.roles.getAll();
        console.log(rolesAndMembers);
        const data = await adminContract.roles.grant("minter", walletAddress);
        console.log(data);
        if (data) {
          const tx = await contract.erc721.mintBatchTo(walletAddress, metadata);
          console.log(tx);
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
        }
      } catch (err) {
        console.log(err);
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
  };

  mintBatch();
}, [metadata]);


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
            name: data.properties?.name,
            description: data.properties?.description,
            lat: data.properties.address.coordinates.lat,
            lng: data.properties.address.coordinates.lng,
            properties: {
              IPFSHash: ipfsHash,
              priceType: "formData.priceType",
              salesDeadline: "formData.salesDeadline",
              downPayment: 5,
              propertyType: "formData.propertyType",
            },
          };
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
