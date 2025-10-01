import { Card, Chip } from "@mui/material"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Box, Typography } from "@mui/material";

const SingleMethod = ({ method, onSelect, accType }) => {
    return (
        <Card
            variant="outlined"
            sx={{
                borderRadius: 2,
                border: "1px solid",
                borderColor: "#eaeaea",
                position: "relative",
                minHeight: 140,
                display: "flex",
                alignItems: "center",
                p: 2,
                flex: {
                    xs: "1 1 100%", // full width on mobile
                    md: "1 1 calc(50% - 12px)", // half width on desktop
                },
                cursor: (accType === "Demo" || method.unavailable) ? "not-allowed" : "pointer",
                opacity: (accType === "Demo" || method.unavailable) ? 0.5 : 1,
                transition: "all 0.2s ease",
                "&:hover": {
                    boxShadow: (accType === "Demo" || method.unavailable) ? "none" : "0 4px 12px rgba(0,0,0,0.1)",
                    transform: (accType === "Demo" || method.unavailable) ? "none" : "translateY(-2px)",
                },
            }}
            onClick={() => {
                if (accType !== "Demo" && !method.unavailable) {
                    onSelect(method);
                }
            }}
        >
            {/* Unavailable badge */}
            {(accType === "Demo" || method.unavailable) && (
                <Chip
                    icon={<LockOutlinedIcon sx={{ fontSize: 14 }} />}
                    label="Unavailable"
                    sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        borderRadius: "999px",
                        bgcolor: "#fff7e6",
                        border: "1px solid #f3e0bf",
                        fontWeight: 700,
                        fontSize: 12,
                        height: 28,
                        px: 1,
                    }}
                />
            )}

            {/* Left: logo */}
            <Box
                sx={{
                    width: 80,
                    height: 80,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#f5f5f5",
                    borderRadius: 1.5,
                    mr: 2,
                    flexShrink: 0,
                }}
            >
                <img
                    src={method.logo}
                    alt={method.name}
                    style={{ width: 36, height: 36 }}
                />
            </Box>

            {/* Right: content */}
            <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {method.name}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Processing time {method.processing}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Fee {method.fee}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Limits {method.minLimit} - {method.maxLimit} USD
                </Typography>
            </Box>
        </Card>
    )
}
export default SingleMethod