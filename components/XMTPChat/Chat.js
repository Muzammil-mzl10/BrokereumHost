import React, { useEffect, useState } from "react";
import styles from "./Chat.module.css";
import { useAddress } from "@thirdweb-dev/react";
import emailjs from "@emailjs/browser"; 

function Chat({ client, messageHistory, conversation, receiverAddress }) {
  const [inputValue, setInputValue] = useState("");
  const [receiverData, setReceiverData] = useState();
  const [senderrData, setSenderData] = useState();
  const [check, setCheck] = useState(true);
  const address = useAddress();

  // Function to handle sending a message
  const handleSend = async () => {
    if (inputValue) {
      await onSendMessage(inputValue);
      setInputValue("");
    }
  };

  const fetchReceiverUser = () => {
    fetch(
      `${process.env.STRAPI_URL_PROD}/api/brokereum-user/?filters[walletAddress][$eq]=${address}`
    )
      .then((res) => res.json())
      .then((res) => {
        console.log(res?.data[0]?.attributes);
        setReceiverData(res.data[0].attributes);
      });
  };

  const fetchSenderUser = () => {
    fetch(
      `${process.env.STRAPI_URL_PROD}/api/brokereum-user/?filters[walletAddress][$eq]=${receiverAddress}`
    )
      .then((res) => res.json())
      .then((res) => {
        console.log(res?.data[0]?.attributes);
        setSenderData(res.data[0].attributes);
      });
  };

  useEffect(() => {
    fetchReceiverUser();
    fetchSenderUser();
  }, [address, receiverAddress]);

  // Function to handle sending a text message
  const onSendMessage = async (value) => {
    console.log(receiverAddress);
    console.log(address);
    console.log("Hello");
    if (check) {
      var templateParams = {
        to_name: senderrData?.Email,
        first_name: senderrData?.firstName,
        from_name: "Brokereum",
        message: `You have received a message from ${receiverData?.firstName}.....!
        https://xmtp.chat`,
        reply_to: senderrData?.Email,
      };
      emailjs
        .send(
          "service_2okvhy7",
          "template_2fgrzgm",
          templateParams,
          "IFlIpDYbo60B9ZY6b"
        )
        .then(
          function (response) {
            console.log("SUCCESS!", response);
          },
          function (error) {
            console.log("FAILED...", error);
          }
        );
      setCheck(false);
    }

    return conversation.send(value);
  };

  // MessageList component to render the list of messages
  const MessageList = ({ messages }) => {
    // Filter messages by unique id
    messages = messages.filter(
      (v, i, a) => a.findIndex((t) => t.id === v.id) === i
    );

    return (
      <ul className="messageList">
        {messages.map((message, index) => (
          <li
            key={message.id}
            className="messageItem"
            title="Click to log this message to the console"
          >
            <strong>
              {message.senderAddress === client.address ? "You" : "Notary"}:
            </strong>
            <span>{message.content}</span>
            <span className="date"> ({message.sent.toLocaleTimeString()})</span>
            <span className="eyes" onClick={() => console.log(message)}></span>
          </li>
        ))}
      </ul>
    );
  };

  // Function to handle input change (keypress or change event)
  const handleInputChange = (event) => {
    if (event.key === "Enter") {
      handleSend();
    } else {
      setInputValue(event.target.value);
    }
  };
  return (
    <div className={styles.Chat}>
      <div className={styles.messageContainer}>
        <MessageList messages={messageHistory} />
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          className={styles.inputField}
          onKeyPress={handleInputChange}
          onChange={handleInputChange}
          value={inputValue}
          placeholder="Type your text here "
        />
        <button className={styles.sendButton} onClick={handleSend}>
          &#128073;
        </button>
      </div>
    </div>
  );
}

export default Chat;
