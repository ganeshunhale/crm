import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Menu,
    MenuItem,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const FilterChip = ({ label, options = [], onChange }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedOption, setSelectedOption] = useState(options[0]);

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget, label);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelect = (option) => {
        setSelectedOption(option);
        setAnchorEl(null);

        if (onChange) {
            onChange(label, option.value); // ✅ Pass filter key AND value
        }
    };

    return (
        <>
            <Box
                onClick={handleClick}
                sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '16px',
                    border: '1px solid #ccc',
                    backgroundColor: '#f5f5f5',
                    cursor: 'pointer',
                    userSelect: 'none',
                    mr: 1,
                }}
            >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {selectedOption?.label || label}
                </Typography>
                <KeyboardArrowDownIcon
                    sx={{
                        ml: 0.5,
                        fontSize: 20,
                        transition: 'transform 0.2s ease-in-out',
                        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                />
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                sx={{
                    mt: 1,
                    '& .MuiPaper-root': {
                        minWidth: 250,
                        borderRadius: 2,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                        border: '1px solid rgba(255,255,255,0.1)',
                    },
                }}
            >
                {options.map((option, index) => (
                    <MenuItem key={index} onClick={() => handleSelect(option)}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '100%',
                                alignItems: 'center',
                            }}
                        >
                            <Typography
                                sx={{
                                    textAlign: 'start',
                                    minWidth: '120px',
                                    fontWeight: 500,
                                    color: 'text.secondary',
                                }}
                            >
                                {option.label}
                            </Typography>
                            {selectedOption?.value === option.value && (
                                <Typography
                                    sx={{
                                        textAlign: 'end',
                                        fontWeight: 600,
                                        color: 'primary.main',
                                    }}
                                >
                                    ✓
                                </Typography>
                            )}
                        </Box>
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

export default FilterChip;
