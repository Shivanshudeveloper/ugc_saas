import React, { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";
import {
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  Stack,
  TextField,
} from "@mui/material";
import { ArrowLeft as ArrowLeftIcon } from "../../../icons/arrow-left";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ImageIcon from "@mui/icons-material/Image";
import VideocamIcon from "@mui/icons-material/Videocam";
import PricingCard from "./cards/pricing-card";
import VideoTimeCard from "./cards/video-time-card";
import AccessTime from "@mui/icons-material/AccessTime";
import AspectRatio from "@mui/joy/AspectRatio";
import Sheet from "@mui/joy/Sheet";
import CreatorLevelCard from "./cards/creator-level-card";
import InfoIcon from "@mui/icons-material/Info";
import ContentFormatCard from "./cards/content-format-card";

import { useDispatch, useSelector } from "react-redux";

import {
  imageContents,
  videoContents,
  videoDurationContents,
  creatorLevels,
  contentFormatContents,
} from "../../../content-data/data";
import { useRouter } from "next/router";

export default function ContentAndCreators({
  content,
  setContent,
  genderC,
  setGenderC,
}) {
  const { male, female, nonBinary } = genderC;
  const router = useRouter();
  const { campaignId } = router.query;
  const campaign = useSelector((state) => state.campaign);

  const handleGenderChange = (event) => {
    setGenderC({
      ...genderC,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <>
      <Container
        maxWidth="md"
        // style={{ margin: "0 20px", padding: "0 50px" }}
      >
        <NextLink href="/dashboard" passHref>
          <Button component="a" startIcon={<ArrowLeftIcon fontSize="small" />}>
            Dashboard
          </Button>
        </NextLink>
        <Typography variant="h5" sx={{ mt: 3 }}>
          {`${campaignId ? "Edit" : "New"} Campaign`}: {campaign?.campaignName}
        </Typography>

        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6">Content Type</Typography>
            <Box sx={{ width: "100%", py: 2 }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  name="contentType"
                  value={content?.contentType}
                  onChange={(e, newValue) => {
                    {
                      console.log(newValue);
                      setContent({ ...content, contentType: newValue });
                    }
                  }}
                  aria-label="basic tabs example"
                >
                  <Tab
                    label={
                      <Box
                        sx={{
                          display: "flex",
                        }}
                      >
                        <ImageIcon sx={{ mr: 1 }} />
                        Image
                      </Box>
                    }
                    {...a11yProps(0)}
                  />
                  <Tab
                    label={
                      <Box
                        sx={{
                          display: "flex",
                        }}
                      >
                        <VideocamIcon sx={{ mr: 1 }} />
                        Video
                      </Box>
                    }
                    {...a11yProps(1)}
                  />
                </Tabs>
              </Box>
              <TabPanel value={content?.contentType} index={0}>
                <Grid container spacing={2}>
                  {imageContents.map((item, index) => {
                    {
                      /* console.log(content.imageContent, item); */
                    }

                    return (
                      <Grid item xs={12} md={6} lg={3}>
                        <PricingCard
                          name="imageContent"
                          onClick={() => {
                            console.log(item);
                            setContent({ ...content, imageContent: item });
                          }}
                          selected={
                            JSON.stringify(content.imageContent) ===
                            JSON.stringify(item)
                          }
                          title={item.title}
                          description={item.description}
                          price={item.price.toFixed(2)}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </TabPanel>
              <TabPanel value={content?.contentType} index={1}>
                <Grid container spacing={2}>
                  {videoContents.map((item, index) => {
                    return (
                      <Grid item xs={12} md={6} lg={3}>
                        <PricingCard
                          name="videoContent"
                          onClick={(e) =>
                            setContent({ ...content, videoContent: item })
                          }
                          selected={
                            JSON.stringify(content.videoContent) ===
                            JSON.stringify(item)
                          }
                          title={item.title}
                          description={item.description}
                          price={item.price.toFixed(2)}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </TabPanel>
            </Box>
          </CardContent>
        </Card>
      </Container>
      {content?.contentType == 1 && (
        <Container maxWidth="md">
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6">Video Duration</Typography>
              <Box sx={{ width: "100%", py: 4 }}>
                <Grid container spacing={2}>
                  {videoDurationContents.map((item, index) => (
                    <Grid item xs={12} md={6} lg={3}>
                      <VideoTimeCard
                        name="videoDuration"
                        onClick={(e) =>
                          setContent({ ...content, videoDuration: item })
                        }
                        selected={
                          JSON.stringify(content.videoDuration) ===
                          JSON.stringify(item)
                        }
                        banner={item.banner}
                        time={item.time}
                        price={item.price.toFixed(2)}
                        icon={item.icon}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Container>
      )}

      <Container maxWidth="md">
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6">Content Format</Typography>
            <Box sx={{ width: "100%", py: 4 }}>
              <Grid container spacing={2}>
                {contentFormatContents.map((item, index) => (
                  <Grid item>
                    <ContentFormatCard
                      name="contentFormat"
                      onClick={(e) =>
                        setContent({ ...content, contentFormat: item })
                      }
                      selected={
                        JSON.stringify(content.contentFormat) ===
                        JSON.stringify(item)
                      }
                      title={item.title}
                      ratio={item.ratio}
                      height={item.height}
                      width={item.width}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Container>
      <Container maxWidth="md">
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6">Content Description</Typography>
            <Box sx={{ width: "100%", pt: 4 }}>
              <TextField
                name="contentDescription"
                value={content?.contentDescription}
                onChange={(e) =>
                  setContent({ ...content, contentDescription: e.target.value })
                }
                fullWidth
                rows={3}
                id="outlined-textarea"
                // label="Multiline Placeholder"
                placeholder="Please describe in detail what you wan the content to look like"
                multiline
                inputProps={{ maxLength: 600 }}
              />
              <div
                style={{ marginTop: "20px" }}
              >{`Characters: ${content?.contentDescription?.length}/600`}</div>
              <div style={{ marginTop: "30px" }}>
                Recommendations on what to mention in the description:
              </div>
              <div>1. Specify what you exactly want to see. </div>
              <div>
                2. Specify the location in which the content should be filmed.
              </div>
            </Box>
          </CardContent>
        </Card>
      </Container>
      <Container maxWidth="md">
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6">Creators</Typography>
            <Typography
              variant="secondary"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                marginTop: "10px",
              }}
            >
              <div>Creator Level</div>
              <InfoIcon />
            </Typography>

            <Box sx={{ width: "100%", py: 4 }}>
              <Grid container spacing={2}>
                {creatorLevels.map((item, index) => (
                  <Grid item xs={12} md={6} lg={3}>
                    <CreatorLevelCard
                      name="creatorLevel"
                      onClick={(e) =>
                        setContent({ ...content, creatorLevel: item })
                      }
                      selected={
                        JSON.stringify(content.creatorLevel) ===
                        JSON.stringify(item)
                      }
                      title={item.title}
                      price={item.price}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
            <Box sx={{ width: "100%", pt: 4 }}>
              <div>Gender</div>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={male}
                      name="male"
                      onChange={handleGenderChange}
                    />
                  }
                  label="Male"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={female}
                      name="female"
                      onChange={handleGenderChange}
                    />
                  }
                  label="Female"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={nonBinary}
                      name="nonBinary"
                      onChange={handleGenderChange}
                    />
                  }
                  label="Non Binary"
                />
              </FormGroup>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
