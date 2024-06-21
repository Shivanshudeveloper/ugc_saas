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
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "../../../hooks/use-auth";
import { API_SERVICE } from "../../../config";
import { useRouter } from "next/router";

export default function Disclaimer({ onClick, onEdit }) {
  const [cover, setCover] = useState("/static/mock-images/covers/cover_4.jpeg");
  const creator = useSelector((state) => state.creator);
  const router = useRouter();
  const { user } = useAuth();

  const addCreator = async () => {
    try {
      const response = await fetch(`${API_SERVICE}/add_creator`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...creator, userId: user?.id, isActive: "false" }),
      });
      if (response.status === 200) {
        console.log(response);
        alert("Submitted for Review");
        router.push("/dashboard/orders");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Container
        maxWidth="md"
      // style={{ margin: "0 20px", padding: "0 50px" }}
      >
        <Card sx={{ display: "flex" }}>
          <Box>
            <CardMedia
              backgroundSize="contain"
              height="100%"
              width="100%"
              component="img"
              image={cover}
              alt="green iguana"
            />
          </Box>

          <CardContent>
            <Grid container spacing={3}>
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h5">Personal Information</Typography>
                <Typography
                  variant="secondary"
                  sx={{ color: "gray" }}
                  onClick={() => onEdit(0)}
                >
                  Edit
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ mb: 3 }}>
                <Box
                  sx={{
                    width: "100px",
                    height: "100px",
                  }}
                >
                  <CardMedia
                    backgroundSize="contain"
                    height="100%"
                    width="100%"
                    component="img"
                    image={creator?.profile}
                    alt="green iguana"
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <div style={{ fontWeight: "bold" }}>First name</div>
                <div style={{ color: "gray" }}>
                  {creator?.first || "Not provided"}
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <div style={{ fontWeight: "bold" }}>Last name</div>
                <div style={{ color: "gray" }}>
                  {creator?.last || "Not provided"}
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <div style={{ fontWeight: "bold" }}>Date of Birth</div>
                <div style={{ color: "gray" }}>
                  {creator?.DOB || "Not provided"}
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <div style={{ fontWeight: "bold" }}>Gender</div>
                <div style={{ color: "gray" }}>
                  {creator?.gender || "Not provided"}
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <div style={{ fontWeight: "bold" }}>Phone Number</div>
                <div style={{ color: "gray" }}>
                  {creator?.contact || "Not provided"}
                </div>
              </Grid>

              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 3,
                }}
              >
                <Typography variant="h5">Address</Typography>
                <Typography
                  variant="secondary"
                  sx={{ color: "gray" }}
                  onClick={() => onEdit(0)}
                >
                  Edit
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <div style={{ fontWeight: "bold" }}>Country</div>
                <div style={{ color: "gray" }}>
                  {creator?.address?.country || "Not provided"}
                </div>
              </Grid>
              <Grid item xs={12}>
                <div style={{ fontWeight: "bold" }}>Address Line 1</div>
                <div style={{ color: "gray" }}>
                  {creator?.address?.line1 || "Not provided"}
                </div>
              </Grid>
              <Grid item xs={12}>
                <div style={{ fontWeight: "bold" }}>Address Line 2</div>
                <div style={{ color: "gray" }}>
                  {creator?.address?.line2 || "Not provided"}
                </div>
              </Grid>
              <Grid item xs={12}>
                <div style={{ fontWeight: "bold" }}>City/Town</div>
                <div style={{ color: "gray" }}>
                  {creator?.address?.city || "Not provided"}
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <div style={{ fontWeight: "bold" }}>State</div>
                <div style={{ color: "gray" }}>
                  {creator?.address?.state || "Not provided"}
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <div style={{ fontWeight: "bold" }}>Zip Code</div>
                <div style={{ color: "gray" }}>
                  {creator?.address?.zip || "Not provided"}
                </div>
              </Grid>

              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 3,
                }}
              >
                <Typography variant="h5">Social Media Links</Typography>
                <Typography
                  variant="secondary"
                  sx={{ color: "gray" }}
                  onClick={() => onEdit(2)}
                >
                  Edit
                </Typography>
              </Grid>

              <Grid item xs={12} sx={{ display: "flex" }}>
                <InstagramIcon sx={{ mr: 2 }}></InstagramIcon>
                <div style={{ color: "gray" }}>
                  {creator?.social?.instagram || "Not provided"}
                </div>
              </Grid>
              <Grid item xs={12} sx={{ display: "flex" }}>
                <FacebookIcon sx={{ mr: 2 }}></FacebookIcon>
                <div style={{ color: "gray" }}>
                  {creator?.social?.facebook || "Not provided"}
                </div>
              </Grid>
              <Grid item xs={12} sx={{ display: "flex" }}>
                <TwitterIcon sx={{ mr: 2 }}></TwitterIcon>
                <div style={{ color: "gray" }}>
                  {creator?.social?.twitter || "Not provided"}
                </div>
              </Grid>
              <Grid item xs={12} sx={{ display: "flex" }}>
                <YouTubeIcon sx={{ mr: 2 }}></YouTubeIcon>
                <div style={{ color: "gray" }}>
                  {creator?.social?.youtube || "Not provided"}
                </div>
              </Grid>
              <Grid item xs={12} sx={{ display: "flex" }}>
                <FilterDramaIcon sx={{ mr: 2 }}></FilterDramaIcon>
                <div style={{ color: "gray" }}>
                  {creator?.social?.amazon || "Not provided"}
                </div>
              </Grid>
              <Grid item xs={12} sx={{ display: "flex" }}>
                <LanguageIcon sx={{ mr: 2 }}></LanguageIcon>
                <div style={{ color: "gray" }}>
                  {creator?.social?.website || "Not provided"}
                </div>
              </Grid>

              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 3,
                }}
              >
                <Typography variant="h5">Categories</Typography>
                <Typography
                  variant="secondary"
                  sx={{ color: "gray" }}
                  onClick={() => onEdit(3)}
                >
                  Edit
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <div style={{ fontWeight: "bold" }}>Primary Category</div>
                <div style={{ color: "gray" }}>
                  {creator?.categories?.primary || "Not provided"}
                </div>
              </Grid>
              <Grid item xs={12}>
                <div style={{ fontWeight: "bold" }}>Secondary Category</div>
                <div style={{ color: "gray" }}>
                  {creator?.categories?.secondary || "Not provided"}
                </div>
              </Grid>
              <Grid item xs={12}>
                <div style={{ fontWeight: "bold" }}>Third Category</div>
                <div style={{ color: "gray" }}>
                  {creator?.categories?.tertiary || "Not provided"}
                </div>
              </Grid>

              <Grid
                item
                xs={12}
                sx={{
                  mt: 3,
                }}
              >
                <Typography variant="h5">Certification</Typography>
              </Grid>

              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 3,
                }}
              >
                <Typography variant="secondary" sx={{ fontWeight: "bold" }}>
                  Image Certification
                </Typography>
                <Typography
                  variant="secondary"
                  sx={{ color: "gray" }}
                  onClick={() => onEdit(4)}
                >
                  Edit
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Box
                  sx={{
                    width: "100px",
                    height: "100px",
                  }}
                >
                  {creator?.brandSelfie ? (
                    <CardMedia
                      backgroundSize="contain"
                      height="100%"
                      width="100%"
                      component="img"
                      image={creator?.brandSelfie}
                      alt="green iguana"
                    />
                  ) : (
                    <div style={{ color: "gray" }}>Not provided</div>
                  )}
                </Box>
              </Grid>

              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 3,
                }}
              >
                <Typography variant="secondary" sx={{ fontWeight: "bold" }}>
                  Video Certification
                </Typography>
                <Typography
                  variant="secondary"
                  sx={{ color: "gray" }}
                  onClick={() => onEdit(5)}
                >
                  Edit
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Box
                  sx={{
                    width: "200px",
                    height: "150px",
                  }}
                >
                  {creator?.productDemo ? (
                    <video
                      controls
                      height="100%"
                      width="100%"
                      component="video"
                      src={creator?.productDemo}
                    />
                  ) : (
                    <div style={{ color: "gray" }}>Not provided</div>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Button
                  onClick={async () => {
                    console.log("Hello");
                    await addCreator();
                    onClick();
                  }}
                  fullWidth
                  sx={{ backgroundColor: "black", color: "white" }}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
