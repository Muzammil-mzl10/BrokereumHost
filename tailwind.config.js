// tailwind.config.js
module.exports = {
  // ... other Tailwind CSS configuration ...
  purge: {
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
    options: {
      whitelist: [
        // Add any Shepherd classes you want to keep here
        "shepherd-element",
        "shadow-lg",
        "bg-blue-500",
        "text-blue-100",
      ],
    },
  },
};
