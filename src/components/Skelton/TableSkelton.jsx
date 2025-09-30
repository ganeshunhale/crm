import React from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

export default function TableSkeleton() {
  const rows = 15; // number of rows
  const columns = 8; // number of columns to match your real table

  return (
    <Box sx={{ width: '100%', paddingX: 2 }}>
      {[...Array(rows)].map((_, rowIndex) => (
        <Box
          key={rowIndex}
          sx={{
            display: 'flex',
            gap: 2,
            mb: 1,
            alignItems: 'center',
          }}
        >
          {/* {[...Array(columns)].map((_, colIndex) => ( */}
            <Skeleton
              key={rowIndex}
              variant="rounded"
              width={`100%`} // spread across row
              height={30}
              sx={{ flex: 1 }}
            />
          {/* ))} */}
        </Box>
      ))}
    </Box>
  );
}
