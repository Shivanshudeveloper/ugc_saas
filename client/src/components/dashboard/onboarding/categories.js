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

import { FileDropzone } from "../../file-dropzone";

import { gtm } from "../../../lib/gtm";
import { fileToBase64 } from "../../../utils/file-to-base64";

export default function Categories({ state, handleChange, categories }) {
  return (
    <>
      <Container
        maxWidth="md"
        // style={{ margin: "0 20px", padding: "0 50px" }}
      >
        <Card sx={{ mt: 4 }} variant="outlined">
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="h5">
                  Select your preferred Categories
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ mb: 2 }}>
                <Typography variant="secondary" style={{ color: "gray" }}>
                  It will help us connect you to the right brands.
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-filled-label">
                    Primary
                  </InputLabel>
                  <Select
                    name="primary"
                    label="Please select a category"
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    value={state.primary}
                    onChange={handleChange}
                  >
                    <MenuItem value="">
                      <em>Please select a category</em>
                    </MenuItem>
                    {categories?.map((category, index) => (
                      <MenuItem key={index} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-filled-label">
                    Secondary
                  </InputLabel>
                  <Select
                    name="secondary"
                    label="Please select a category"
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    value={state.secondary}
                    onChange={handleChange}
                  >
                    <MenuItem value="">
                      <em>Please select a category</em>
                    </MenuItem>
                    {categories?.map((category, index) => (
                      <MenuItem key={index} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-filled-label">
                    Tertiary
                  </InputLabel>
                  <Select
                    label="Please select a category"
                    name="tertiary"
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    value={state.tertiary}
                    onChange={handleChange}
                  >
                    <MenuItem value="">
                      <em>Please select a category</em>
                    </MenuItem>
                    {categories?.map((category, index) => (
                      <MenuItem key={index} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
