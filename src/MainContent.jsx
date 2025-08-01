import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { red } from '@mui/material/colors';


const bg = {
    maxWidth: 345,
    mx: 'auto',
    textAlign: 'center',
    background: 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)'
}

function MainContent() {
    const storageCity = localStorage.getItem("cityName") || "taipei";

    const [inputCity, setInputCity] = useState("");
    const [cityName, setCityName] = useState(storageCity);
    const [weatherData, setWeatherData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const { name, main, weather } = weatherData || {};

    let apiIconUrl = null;

    if (!!weather) {
        const icon = weather[0].icon;

        apiIconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    }


    function handleSubmitForm() {
        if (!inputCity) {
            setError('請輸入城市名');

            return;
        }

        setCityName(inputCity);
    }


    function handleInputChange(e) {
        e.preventDefault();

        setInputCity(e.target.value);
    }


    useEffect(() => {
        async function fetchData() {
            const city = cityName;

            if (!city) {
                return;
            }


            // try {
                setIsLoading(true);
                setError(null);

                const apiKey = import.meta.env.VITE_WEATHER_API_KEY;console.log(apiKey);
                const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=zh_tw`;
                const response = await fetch(apiUrl);
                const weatherJson = await response.json();

                if (!response.ok) {
                    throw new Error(weatherJson.message);
                }

                setWeatherData(weatherJson);
            // }
            // catch (err) {
                setError(err.message);
            // }
            // finally {
                setIsLoading(false);

                localStorage.setItem('cityName', cityName);
            // }
        }

        fetchData();

    }, [cityName])


    return (
        <>
            <Box sx={{ pt: 5 }}>
                <Typography gutterBottom variant="h5" component="div" sx={{ textAlign: 'center', mx: 1, py: 3 }}>
                    最新天氣狀況
                </Typography>

                <Grid container spacing={1} columns={12}
                    sx={{
                        justifyContent: "center",
                        alignItems: "stretch",
                        pb: 4
                    }}
                >
                    <Grid size={{ xs: 12, sm: 8 }}>
                        <Stack
                            component="form"
                            sx={{
                                justifyContent: "center",
                                alignItems: "stretch"
                            }}
                            spacing={2}
                            noValidate
                            autoComplete="off"
                            direction="row"
                        >
                            <TextField
                                id="cityName" label="輸入城市的英文名" variant="standard" size="small" onChange={handleInputChange}
                            />
                            <Button variant="contained" size="small" type="button" onClick={handleSubmitForm}>取得</Button>
                        </Stack>
                    </Grid>

                    {
                        error &&
                        <Grid size={{ xs: 12, sm: 8 }} sx={{ display: "flex", justifyContent: "space-around" }}>
                            <Typography variant="p" sx={{ m: 0, color: red[600], fontWeight: 500 }}> {error}</Typography>
                        </Grid>
                    }
                </Grid>

                <Grid container spacing={2} columns={12}
                    sx={{
                        justifyContent: "center",
                        alignItems: "stretch"
                    }}
                >
                    <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                        <Card sx={bg}>
                            {
                                !isLoading ?
                                    <CardContent>
                                        <Typography variant="h5" component="div" sx={{ py: 2.5, fontWeight: 'bold' }}>
                                            {name}
                                        </Typography>
                                        <Typography variant="h5" component="div" sx={{ pb: 2, fontWeight: 600 }}>
                                            {!!main && main.temp}°C
                                        </Typography>
                                        <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
                                            溼度：{!!main && main.humidity}%
                                        </Typography>
                                        <Typography sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                            {!!weather && weather[0].description}
                                        </Typography>
                                        <img
                                            component="img"
                                            src={apiIconUrl}
                                            loading="lazy"
                                        />
                                    </CardContent>
                                    :
                                    <CardContent>載入中</CardContent>
                            }
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default MainContent;
