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

module.exports = {
  imageContents,
  videoContents,
  videoDurationContents,
  contentFormatContents,
  creatorLevels,
};
