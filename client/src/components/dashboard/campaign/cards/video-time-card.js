import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Link,
  Typography,
} from "@mui/material";

import React from "react";
import AccessTime from "@mui/icons-material/AccessTime";

function VideoTimeCard({ icon, time, banner, price, selected, onClick }) {
  return (
    <Card
      onClick={onClick}
      variant="outlined"
      align="center"
      style={{
        borderColor: selected ? "#5048E5" : "#E6E8F0",
        backgroundColor: selected ? "#dcdaf9" : "white",
      }}
    >
      <CardContent>
        <Grid container>
          <Grid item xs={12}>
            {banner ? (
              <Box sx={{ mb: 1 }}>
                <span
                  style={{
                    fontSize: "12px",
                    backgroundColor: "#E8C309",
                    padding: "2px 5px",
                    fontWeight: "bold",
                  }}
                >
                  {banner}
                </span>
              </Box>
            ) : (
              <Box sx={{ mb: 1 }}>
                <span
                  style={{
                    fontSize: "12px",
                    // backgroundColor: "#E8C309",
                    padding: "2px 5px",
                    fontWeight: "bold",
                  }}
                >
                  Free
                </span>
              </Box>
            )}
          </Grid>
          <Grid item xs={12}>
            {icon === 0 ? (
              <AccessTime fontSize="large" />
            ) : (
              <AccessTime fontSize="large" />
              // <MoreTime fontSize="large" />
            )}
          </Grid>
          <Grid item xs={12}>
            <div style={{ fontSize: "12px" }}>{`${time} seconds`}</div>
          </Grid>
          <Grid item xs={12}>
            <div style={{ fontSize: "20px" }}>
              {price ? `+$${price}` : "Included"}
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default VideoTimeCard;
