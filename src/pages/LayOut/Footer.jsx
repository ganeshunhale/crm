// Footer.jsx
import React from "react";
import { Box, Grid, Link, Typography, Container } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        mt: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Left Section - Company Info */}
          <Grid size={{ xs: 12, md: 9 }}>
            <Typography variant="caption" color="text.secondary" paragraph>
              CDFUP (SC) LTD is a Securities Dealer registered in Dubai
              with registration number 75######1 and authorised by the Financial
              Services Authority (FSA) with licence number DU####1. The registered
              office of CDFUP (SC) LTD is at 2nd floor,
              JLT cluster E, Dubai.
            </Typography>

            <Typography variant="caption" color="text.secondary" paragraph>
              The information on this website may only be copied with the
              express written permission of CFDUP. <b>General Risk Warning:</b>{" "}
              CFDs are leveraged products. Trading in CFDs carries a high level
              of risk thus may not be appropriate for all investors. The
              investment value can both increase and decrease and the investors
              may lose all their invested capital. Under no circumstances shall
              the Company have any liability to any person or entity for any
              loss or damage in whole or part caused by, resulting from, or
              relating to any transactions related to CFDs.{" "}
              <Link href="#" underline="hover" color="info">
                Learn more
              </Link>
              .
            </Typography>

            <Typography variant="caption" color="text.secondary">
              CFDUP complies with the Payment Card Industry Data Security
              Standard (PCI DSS) to ensure your security and privacy. We conduct
              regular vulnerability scans and penetration tests in accordance
              with the PCI DSS requirements for our business model.
            </Typography>
          </Grid>

          {/* Right Section - Links */}
          <Grid
           size={{ xs: 12, md: 3 }}
            sx={{
              display:{md: "flex", sm:"block"},
              flexDirection:{md: "column", sm:"row-reverse"},
              gap: 1,
              mt: { xs: 2, md: 0 },
              
            }}
          >
            <Link href="#" underline="always" variant="body2" color="info">
              Privacy Agreement
            </Link>
            <Link href="#"underline="always" variant="body2" color="info">
              Risk Disclosure
            </Link>
            <Link href="#" underline="always" variant="body2" color="info">
              Preventing Money Laundering
            </Link>
            <Link href="#" underline="always" variant="body2" color="info">
              Security instructions
            </Link>
            <Link href="#" underline="always" variant="body2" color="info">
              Legal documents
            </Link>
            <Link href="#" underline="always" variant="body2" color="info">
              Complaints Handling Policy
            </Link>
            <Link href="#"underline="always" variant="body2" color="info">
              Contact
            </Link>
          </Grid>
        </Grid>

        {/* Bottom Copyright */}
        <Box
          sx={{
            borderTop: "1px solid #e0e0e0",
            mt: 3,
            pt: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © 2020 - 2025. CFDUP
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
