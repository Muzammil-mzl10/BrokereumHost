import { Client } from "@xmtp/xmtp-js";
import { ethers } from "ethers";
import React, { useEffect, useState, useRef } from "react";
import Chat from "../../components/XMTPChat/Chat";;
import styles from "../../public/css/Home.module.css";
import Footer from "../../components/Layout/Footer";
import Navbar from "../../components/Layout/Navbar";
import { useAddress, useSigner } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// const PEER_ADDRESS = "0x0Dd6F513D90EFADAf7902a705509C370e6088C52";

export default function Home() {
    const router = useRouter();
    const address = useAddress()
  const [messages, setMessages] = useState(null);
  const convRef = useRef(null);
  const clientRef = useRef(null);
  const [signer, setSigner] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isOnNetwork, setIsOnNetwork] = useState(false);
  console.log(router.query.chat);
  // Function to load the existing messages in a conversation
  const newConversation = async function (xmtp_client, addressTo) {
    //Creates a new conversation with the address
    if (await xmtp_client?.canMessage(router.query.chat)) {
      const conversation = await xmtp_client.conversations.newConversation(
        addressTo
      );
      convRef.current = conversation;
      //Loads the messages of the conversation
      const messages = await conversation.messages();
      setMessages(messages);
    } else {
      console.log("cant message because is not on the network.");
      //cant message because is not on the network.
    }
  };

  // Function to initialize the XMTP client
  const initXmtp = async function () {
    try {
      
      // Create the XMTP client
      const xmtp = await Client.create(signer, { env: "production" });
      toast.success("Successfully Connected to XMTP", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      //Create or load conversation with Gm bot
      newConversation(xmtp, router.query.chat);
      // Set the XMTP client in state for later use
      setIsOnNetwork(!!xmtp.address);
      //Set the client in the ref
      clientRef.current = xmtp;
    } catch (err) {
      console.log(err)
       toast.error("Error While making the connection", {
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
  };

  // Function to connect to the wallet
  const connectWallet = async function () {
    // Check if the ethereum object exists on the window object
    if (typeof window.ethereum !== "undefined") {
      try {
        // Request access to the user's Ethereum accounts
        await window.ethereum.enable();

        // Instantiate a new ethers provider with Metamask
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        // Get the signer from the ethers provider
        setSigner(provider.getSigner());

        // Update the isConnected data property based on whether we have a signer
        setIsConnected(true);
      } catch (error) {
        console.error("User rejected request", error);
      }
    } else {
      console.error("Metamask not found");
    }
  };
  const ThirdwebSigner = useSigner()
  useEffect(() => {
    if (address) {
      setIsConnected(true);
      setSigner(ThirdwebSigner);
    }
  },[address])

  useEffect(() => {
    if (isOnNetwork && convRef.current) {
      // Function to stream new messages in the conversation
      const streamMessages = async () => {
        const newStream = await convRef.current.streamMessages();
        for await (const msg of newStream) {
          const exists = messages.find((m) => m.id === msg.id);
          if (!exists) {
            setMessages((prevMessages) => {
              const msgsnew = [...prevMessages, msg];
              return msgsnew;
            });
          }
        }
      };
      streamMessages();
    }
  }, [messages, isConnected, isOnNetwork]);

  return (
      <div className={styles.Home}>
          <Navbar/>
      {/* Display the ConnectWallet component if not connected */}
      {!isConnected && (
        <div className={styles.walletBtn}>
          <button onClick={connectWallet} className={styles.btnXmtp}>
            Connect Wallet
          </button>
        </div>
      )}
      {/* Display XMTP connection options if connected but not initialized */}
      {isConnected && !isOnNetwork && (
        <div className={styles.xmtp}>
          {signer?.address}
          <button onClick={initXmtp} className={styles.btnXmtp}>
            Connect to XMTP
          </button>
        </div>
      )}
      {/* Render the Chat component if connected, initialized, and messages exist */}
      {isConnected && isOnNetwork && messages && (
        <Chat
          client={clientRef.current}
          conversation={convRef.current}
          messageHistory={messages}
        />
          )}
          <Footer/>
    </div>
  );
}
