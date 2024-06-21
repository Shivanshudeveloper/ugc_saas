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
import InfoIcon from "@mui/icons-material/Info";
import LockIcon from "@mui/icons-material/Lock";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import MonitorIcon from "@mui/icons-material/Monitor";
import { FileDropzone } from "../../file-dropzone";

import { gtm } from "../../../lib/gtm";
import { fileToBase64 } from "../../../utils/file-to-base64";

export default function Disclaimer({ children, onClick }) {
  const [cover, setCover] = useState("/static/mock-images/covers/cover_4.jpeg");
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
              <Grid item xs={12}>
                <Typography variant="h5">Disclaimer</Typography>
              </Grid>
              <Grid item xs={12} sx={{ mb: 3 }}>
                <Typography variant="secondary" sx={{ color: "gray" }}>
                  We care about your safety on CyberClick. Please avoid the
                  following actions to keep it line with our community standards
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoIcon />
                <div style={{ color: "gray" }}>
                  Providing any false or misleading information about your
                  identity
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <LockIcon />
                <div style={{ color: "gray" }}>
                  Taking communication and payment outside of the CyberClick
                  platform
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <BusinessCenterIcon />
                <div style={{ color: "gray" }}>
                  Returning free or reimbursed products and asking for refund
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <MonitorIcon />
                <div style={{ color: "gray" }}>Opening duplicate accounts</div>
              </Grid>

              <Grid item xs={12}>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="I have read and accept the TOS and privacy policy"
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={12}>
                <Button
                  onClick={onClick}
                  fullWidth
                  sx={{ backgroundColor: "black", color: "white" }}
                >
                  Accept & Continue
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
