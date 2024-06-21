import React, { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";

import {
  CardMedia,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { ArrowLeft as ArrowLeftIcon } from "../../../icons/arrow-left";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ImageIcon from "@mui/icons-material/Image";
import RectangleIcon from "@mui/icons-material/RectangleOutlined";
import VideocamIcon from "@mui/icons-material/Videocam";
import AccessTime from "@mui/icons-material/AccessTime";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import TwitterIcon from "@mui/icons-material/Twitter";
import FilterDramaIcon from "@mui/icons-material/FilterDrama";
import LanguageIcon from "@mui/icons-material/Language";
import FacebookIcon from "@mui/icons-material/Facebook";
import { FileDropzone } from "../../file-dropzone";

import { gtm } from "../../../lib/gtm";
import { fileToBase64 } from "../../../utils/file-to-base64";
import { useSelector } from "react-redux";

export default function ProfilePendingReview({ children, onClick }) {
  const [cover, setCover] = useState("/static/mock-images/covers/cover_4.jpeg");
  const creator = useSelector((state) => state.creator);
  const [info, setInfo] = useState("");

  const handleDropCover = async ([file]) => {
    const data = await fileToBase64(file);
    setCover(data);
  };

  const handleRemove = () => {
    setCover(null);
  };

  return (
    <>
      <Container
        maxWidth="md"
      // style={{ margin: "0 20px", padding: "0 50px" }}
      >
        <Card sx={{ display: "flex" }}>
          <Box sx={{ width: "500px" }}>
            <CardMedia
              backgroundSize="contain"
              height="100%"
              width="100%"
              component="img"
              image={creator?.profile}
              alt="green iguana"
            />
          </Box>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item></Grid>
              <Grid item xs={12}>
                <Typography variant="h5">Profile pending review...</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="secondary" style={{ color: "grey" }}>
                  Thanks for taking your time and applying to this position.
                  We'll review your application and get back to you shortly.
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
