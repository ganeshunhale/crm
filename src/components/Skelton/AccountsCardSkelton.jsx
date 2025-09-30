import {
    Card,
    Stack,
    Chip,
    Typography,
    Skeleton,
    Box,
    Button
} from "@mui/material";


export const SkeletonCard = () => {
    return (
        <Card
            sx={{
                borderRadius: 2,
                p: 5,
                boxShadow: 0,
                border: '1px solid',
                borderColor: 'grey.200',
                backgroundColor: "#fff",
                color: "black",
                mb: 3
            }}
        >
            {/* Header */}
            <Stack direction="row" alignItems="center" gap={1}>
                <Skeleton variant="rounded" width={50} height={24} />
                <Skeleton variant="rounded" width={40} height={24} />
                <Skeleton variant="rounded" width={70} height={24} />
                <Skeleton variant="text" width={100} height={24} />
                <Skeleton variant="text" width={80} height={24} />
                <Box sx={{ flex: 1 }} />

            </Stack>

            {/* Balance */}
            <Stack my={2} direction="row" justifyContent="space-between" alignItems="center">
                <Skeleton variant="text" width={160} height={40} />

                <Stack direction="row">
                    <Skeleton variant="circular" width={80} height={32} sx={{ borderRadius: 1, mr: 2 }} />
                    <Skeleton variant="rounded" width={80} height={32} sx={{ borderRadius: 1 }} />
                </Stack>
            </Stack>

            {/* Table (optional: show if needed for loading state) */}
            <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", width: "100%" }}>
                {/* Left Box */}
                <Box sx={{ flex: '1 1 48%', p: 2, backgroundColor: "#f9fafb", display: "flex", flexDirection: "column", gap: 1 }}>
                    <Skeleton variant="text" width="100%" />
                    <Skeleton variant="text" width="80%" />
                    <Skeleton variant="text" width="70%" />
                </Box>

                {/* Right Box */}
                <Box sx={{ flex: '1 1 48%', p: 2, backgroundColor: "#f9fafb", display: "flex", flexDirection: "column", gap: 1 }}>
                    <Skeleton variant="text" width="100%" />
                    <Skeleton variant="text" width="80%" />
                    <Skeleton variant="text" width="70%" />
                </Box>
            </Box>

            {/* Bottom Actions */}
            <Stack direction="row" gap={3} mt={2}>
                <Skeleton variant="text" width={120} height={20} />
                <Skeleton variant="text" width={140} height={20} />
                <Skeleton variant="text" width={180} height={20} />
            </Stack>
        </Card>
    );
};
