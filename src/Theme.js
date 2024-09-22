import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    palette: {
        primary: {
            main: "#f8f8f8",
        },
        secondary: {
            main: "#fff",
        },
        error: {
            main: "#f5c2c7",
        },
        success: {
            main: "#83a929",
        },
        buttonBackground: {
            main: "#83A929",
        },
    },
    typography: {
        h1: {
            fontWeight: 400,
        },
        h3: {
            fontWeight: 300,
        },
        h4: {
            fontWeight: 300,
        },
    },
    components: {
        // Buttons
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: "30px",
                    margin: "10px",
                    padding: "10px 20px",
                    color: '#FFFFFF',
                    backgroundColor: '#B8F3FF',
                    "&:hover": {
                        backgroundColor: '#0082AD',
                        color: '#FFFFFF'
                    }
                },
            },
            variants: [
                {
                    props: { variant: 'splash_primary' },
                    style: {
                        backgroundColor: "white",
                        border: "2px solid #83A929",
                        padding: "15px 80px",
                        borderRadius: "30px",
                        width: "50%",
                        minHeight: "60px",
                        color: "#83A929",
                        fontWeight: 500,
                        fontSize: "medium",
                        whiteSpace: 'nowrap',
                        '&:hover': {
                            backgroundColor: "#83A929",
                            border: "2px solid white",
                            color: "white",
                        },
                        "@media (min-width:1920px)": {
                            maxWidth: "280px"
                        },
                        "@media (max-width:344px)": {
                            whiteSpace: 'wrap',
                            height: "65px",
                        }
                    }
                },
                {
                    props: { variant: 'secondary' },
                    style: {
                        color: '#f8f8f8',
                        backgroundColor: '#83A929',
                        "&:hover": {
                            backgroundColor: '#f8f8f8',
                            color: '#83A929'
                        }
                    }
                },
            ]
        },
        // Inputs
        MuiInput: {
            styleOverrides: {
                input: {
                    color: '#f8f8f8',
                    backgroundColor: '#83A929',
                    "&:hover": {
                        backgroundColor: '#f8f8f8',
                        color: '#83A929'
                    }
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    background:'white',
                    width: '300px',
                    height: '40px',
                    margin: '10px',
                    borderRadius: '4px',
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#3B3C86', // Consistent border color
                        },
                        '&:hover fieldset': {
                            borderColor: '#3B3C86',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#3B3C86',
                        },
                        '& input': {
                            color: 'black', // Set text color to black
                            padding: '10px', // Consistent padding
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: 'black', // Set label color to black
                    },
                },
            },
        },
        MuiFormHelperText: {
            styleOverrides: {
                root: {
                    marginLeft: "10px",
                    marginTop: "7px",
                }
            }
        }        
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1200,
            xl: 1920,
            galaxyFold: 344, // galaxyfold specific size
            iphonePro: 430,
            iphoneSE: 375
        },
    },
});