import React, { useEffect } from "react";
import Shepherd from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css";

function Tour() {
  useEffect(() => {
    // Check if the tour has been completed before
    const isTourCompleted = localStorage.getItem("tourCompleted") === "true";

    if (!isTourCompleted) {
      const tour = new Shepherd.Tour({
        defaultStepOptions: {
          scrollTo: { behavior: "smooth", block: "center" },
          classes: "shepherd-element z-[100] shadow-lg bg-blue-500 text-blue-100",
        },
      });

      tour.addStep({
        id: "step-1",
        title: "Welcome to the Tour",
        text: "Here you can connect your Wallet.",
        attachTo: { element: ".wallet-connect-button", on: "bottom-start" },
        buttons: [
          {
            text: "Next",
            action: tour.next,
          },
        ],
      });

      tour.addStep({
        id: "step-2",
        title: "Why Profile Creation Required?",
        text: "You need to set up your profile so you can make an impression and list your properties for sale.",
        attachTo: { element: ".profile-creation", on: "bottom" },
        buttons: [
          {
            text: "Next",
            action: tour.next,
          },
        ],
      });

      tour.addStep({
        id: "step-3",
        title: "Live Auctions",
        text: "You can bid on any property.",
        attachTo: { element: ".live-auction-listing", on: "right" },
        buttons: [
          {
            text: "Next",
            action: tour.next,
          },
        ],
      });

      tour.addStep({
        id: "step-4",
        title: "List your property",
        text: "Here you can view and list properties you own.",
        attachTo: { element: ".list-nfts", on: "bottom" },
        buttons: [
          {
            text: "Finish",
            action: () => {
              tour.complete();
              localStorage.setItem("tourCompleted", "true"); // Mark the tour as completed
            },
          },
        ]
      })
    

      tour.start();
    }
  }, []);

  return null;
}

export default Tour;
