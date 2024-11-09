import { createTheme } from "@mui/material/styles";

export const theme = (mode) => createTheme({
    palette: {
        primary: {
          main: '#1976d2', // Ensure 'main' is defined
        },
        secondary: {
          main: '#dc004e', // Ensure 'main' is defined
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
                    color: 'black',
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
        //Navbar 
        MuiPaper:{
            styleOverrides: {
                root: {
                    background: mode === 'dark' ? 'black': "aliceblue",
                }
            }
        },
        //Navbar title: Main Items
        MuiListSubheader:{
            styleOverrides: {
                root: {
                    background: mode === 'dark' ? 'black': "aliceblue",
                }
            }
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    background: 'white',
                    width: '300px', // Default width
                    height: '40px',
                    margin: '10px',
                    borderRadius: '4px',
                    '@media (max-width:600px)': { // Use media query directly
                        width: 'fit-content', // Width on small screens and up
                    },
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
                            color: 'black',
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
