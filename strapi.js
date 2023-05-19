import Strapi from "strapi-sdk-javascript/build/main";

const apiUrl = "http://localhost:1337"; // Update with your Strapi server URL

const strapi = new Strapi(apiUrl);

export default strapi;
