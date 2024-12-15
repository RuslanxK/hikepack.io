import React, { useState } from "react";
import Modal from "./Modal";
import {
  PayPalScriptProvider,
  PayPalButtons,
  ReactPayPalScriptOptions,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { MdClose } from "react-icons/md";
import Spinner from "../loading/Spinner";
import Message from "../message/Message";

interface SupportUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SupportUsModal: React.FC<SupportUsModalProps> = ({ isOpen, onClose }) => {
  const [selectedCoffee, setSelectedCoffee] = useState<number>(1);
  const [customCoffeeAmount, setCustomCoffeeAmount] = useState<number | null>(null);
  const [message, setMessage] = useState<{ title: string; message: string; type: string } | null>(null);
  const coffeeOptions = [1, 3, 5, 10, 15];
  const pricePerCoffee = 1;

  const paypalOptions: ReactPayPalScriptOptions = {
    clientId: process.env.REACT_APP_PAYPAL_CLIENT || "",
    currency: "USD",
  };



  const PayPalButtonsWrapper: React.FC = () => {
    const [{ isPending }] = usePayPalScriptReducer();

    return isPending ? (
      <div className="flex justify-center items-center h-32">
        <Spinner w={4} h={4} />
      </div>
    ) : (
      <PayPalButtons
  style={{
    shape: "rect",
    layout: "vertical",
    color: "gold",
    label: "pay",
  }}
  createOrder={(data, actions) => {
    return actions.order.create({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: (
              (customCoffeeAmount ?? selectedCoffee) * pricePerCoffee
            ).toFixed(2),
          },
        },
      ],
    });
  }}
  onApprove={(data, actions) => {
    if (actions.order) {
      return actions.order.capture().then((details) => {
        setMessage({
          title: "Thank You for Supporting Our Mission!",
          message:
            "We're deeply grateful for your generosity. Every coffee you buy keeps us innovating for you and our outdoor-loving community!",
          type: "success",
        });
      });
    }
    return Promise.reject("Order action is not available");
  }}
  onError={(err) => {
    setMessage({
      title: "Error",
      message: `Something went wrong: ${err}`,
      type: "error",
    });
  }}
/>
    );
  };


  const handleClose = () => {
    setMessage(null); 
    onClose(); 
  };


  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Get Us a Coffee!"
      customClassName="sm:max-w-4xl"
    >
      <div
        className="flex flex-col items-start justify-between md:flex-row w-full gap-6"
        style={{
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        
        <div className="md:w-7/12 sm:sticky sm:top-0">

          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            We are a team of developers and designers who love hiking and actively enjoy the outdoors. Our mission is to help hikers organize their trips & bags with ease and share their journeys with others.
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            If our work has made a positive impact on your hiking experience and you’d like to show your support, feel free to buy us a coffee!
          </p>
          <p className="text-sm text-gray-800 dark:text-gray-200 mb-1 mt-4 font-semibold">Choose your coffee amount:</p>

          <div className="mt-4 bg-gray-100 dark:bg-box sm:p-4 p-3 border dark:border-accent rounded-lg">
            <div className="flex flex-wrap gap-3 items-center">
              <img src="/images/coffee-cup.png" width={32} height={32} alt="coffee" />
              <MdClose size={25} className="text-accent dark:text-gray-300" />
              {coffeeOptions.map((option) => (
                <button
                  key={option}
                  className={`px-4 py-1 rounded-lg border ${
                    selectedCoffee === option
                      ? "bg-primary text-white"
                      : "bg-white dark:bg-black text-gray-800 dark:text-gray-200 dark:border-accent"
                  } hover:bg-primary hover:text-white transition`}
                  onClick={() => setSelectedCoffee(option)}
                >
                  {option}
                </button>
              ))}

            </div>

            <input
  type="number"
  min="1"
  value={customCoffeeAmount ?? ""}
  placeholder="Enter your amount – every drop counts!"
  className="text-sm w-full mt-4 pl-2 pr-2 py-2 border text-md rounded-lg text-gray-800 dark:text-gray-200 dark:bg-black dark:border-accent focus:outline-none focus:ring focus:ring-primary placeholder:text-gray-400"
  onChange={(e) => {
    const value = parseInt(e.target.value, 10);
    setCustomCoffeeAmount(!isNaN(value) && value > 0 ? value : null);
  }}
/>

          </div>
          <div className="text-sm text-gray-800 dark:text-gray-200 mt-5">
          <p>
  You are about to donate:{" "}
  <span className="font-semibold text-primary">
    ${((customCoffeeAmount ?? selectedCoffee) * pricePerCoffee).toFixed(2)}
  </span>
</p>
          </div>
        </div>

       
        <div className="sm:w-5/12 w-full">
        <div className="bg-gray-100 dark:bg-theme-dark border dark:border-accent rounded-lg p-4">
          <div className="flex flex-row justify-between w-full items-center mb-4">
            <h3 className="text-lg font-semibold dark:text-white">Donate Method</h3>
          </div>
          <PayPalScriptProvider options={paypalOptions}>
            <PayPalButtonsWrapper />
          </PayPalScriptProvider>
          </div>
          {message && (
            <div className="mt-4">
              <Message
                padding="p-4"
                width='w-full'
                title={message.title}
                message={message.message}
                type={message.type as "success" | "error"}
              />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default SupportUsModal;
