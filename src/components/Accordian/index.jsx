import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

/**
 * Reusable Accordion Component
 * 
 * Props:
 * - title: string (accordion header text)
 * - children: ReactNode (accordion body content)
 * - actions?: ReactNode (optional footer actions like buttons)
 * - defaultExpanded?: boolean
 */
export default function CustomAccordion({
  title,
  children,
  actions,
  defaultExpanded = true,
}) {
  return (
    <Accordion defaultExpanded={defaultExpanded} sx={{backgroundColor:'#fff', color:'black'}}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{color:'black'}} />}
        aria-controls={`${title}-content`}
        id={`${title}-header`}
      >
        {title && <Typography component="span">{title}</Typography>}
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>

      {actions && <AccordionActions>{actions}</AccordionActions>}
    </Accordion>
  );
}
