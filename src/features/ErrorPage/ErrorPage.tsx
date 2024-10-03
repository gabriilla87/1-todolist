import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const ErrorPage: React.FC = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <Container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                textAlign: 'center',
            }}
        >
            <Box>
                <Typography variant="h1" component="h1" gutterBottom>
                    404
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                    Страница не найдена
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Извините, но запрашиваемая страница не существует.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleGoHome}
                    sx={{ marginTop: '16px' }}
                >
                    Вернуться на главную
                </Button>
            </Box>
        </Container>
    );
};