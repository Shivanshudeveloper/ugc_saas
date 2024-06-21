import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ImageIcon from "@mui/icons-material/Image";
import VideocamIcon from "@mui/icons-material/Videocam";
import AccessTime from "@mui/icons-material/AccessTime";
import AspectRatio from "@mui/joy/AspectRatio";
import Sheet from "@mui/joy/Sheet";

import InfoIcon from "@mui/icons-material/Info";

const imageContents = [
  {
    title: "Selfie with creators",
    description: "Selfies with content creators",
    price: 20,
  },
  {
    title: "Selfie with creators",
    description: "Selfies with content creators",
    price: 30,
  },
  {
    title: "Selfie with creators",
    description: "Selfies with content creators",
    price: 40,
  },
  {
    title: "Selfie with creators",
    description: "Selfies with content creators",
    price: 50,
  },
];

const videoContents = [
  {
    title: "Product Demo",
    description: "Detailed on-camera demonstration",
    price: 20,
  },
  {
    title: "Product Demo",
    description: "Detailed on-camera demonstration",
    price: 30,
  },
  {
    title: "Product Demo",
    description: "Detailed on-camera demonstration",
    price: 40,
  },
  {
    title: "Product Demo",
    description: "Detailed on-camera demonstration",
    price: 50,
  },
];

const videoDurationContents = [
  {
    banner: "",
    time: 15,
    price: 0,
    icon: 0,
  },
  {
    banner: "Save 30%",
    time: 30,
    price: 18,
    icon: 1,
  },
  {
    banner: "Save 50%",
    time: 60,
    price: 30,
    icon: 1,
  },
];

const contentFormatContents = [
  { title: "Any", height: "100px", width: "120px", ratio: "" },
  {
    title: "Portrait",
    height: "192px",
    width: "108px",
    ratio: "16:9",
  },
  {
    title: "Landscape",
    height: "108px",
    width: "192px",
    ratio: "9:16",
  },
  {
    title: "Square",
    height: "100px",
    width: "100px",
    ratio: "1:1",
  },
];

const creatorLevels = [
  { title: "Level 1", price: 0 },
  { title: "Level 2", price: 4.5 },
  { title: "Level 3", price: 9 },
  { title: "Pro Level", price: 15 },
];

const videoLinks = [
  {
    url: "/static/videos/Bliese-Men-3.mp4",
  },
  {
    url: "/static/videos/Easy-Muqaddam.mp4",
  },
  {
    url: "/static/videos/Foot-Peel-Mask-Qila.mp4",
  },

  {
    url: "/static/videos/MasheFace.mp4",
  },
  {
    url: "/static/videos/Rissa-Skincare.mp4",
  },
  {
    url: "/static/videos/Sacha-Inchi.mp4",
  },
  {
    url: "/static/videos/Sambal-Ghasoo-1-Final.mp4",
  },
  {
    url: "/static/videos/Yen-&-Den-Brownies-2.mp4",
  },
  {
    url: "/static/videos/GebuGlow.mov",
  },
  {
    url: "/static/videos/AdeAzhar.mov",
  },
];

const imageLinks = [
  {
    src: "/static/dashboard_photos/IMG_5248.png",
  },
  {
    src: "/static/dashboard_photos/IMG_5247.png",
  },
  {
    src: "/static/dashboard_photos/IMG_5246.png",
  },
  {
    src: "/static/dashboard_photos/IMG_5245.png",
  },
  {
    src: "/static/dashboard_photos/IMG_5244.png",
  },
  {
    src: "/static/dashboard_photos/IMG_5241.jpg",
  },
  {
    src: "/static/dashboard_photos/IMG_5237.jpg",
  },
  {
    src: "/static/dashboard_photos/IMG_5233.jpg",
  },
  {
    src: "/static/dashboard_photos/IMG_5230.jpg",
  },
  {
    src: "/static/dashboard_photos/IMG_3276.jpg",
  },
  {
    src: "/static/dashboard_photos/IMG_2835.jpg",
  },
  {
    src: "/static/dashboard_photos/IMG_0490.jpg",
  },
  {
    src: "/static/dashboard_photos/IMG_0476.jpg",
  },
];

module.exports = {
  imageContents,
  videoContents,
  videoDurationContents,
  contentFormatContents,
  creatorLevels,
  videoLinks,
  imageLinks,
};
