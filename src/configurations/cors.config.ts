export const corsOptions = {
    origin: (origin: string, callback: Function) => {
        // Разрешить запросы без origin (например, из Postman, curl)
        if (!origin) return callback(null, true);

        const allowedOrigins = [
            'http://localhost:3000',    // Dev фронтенд
            'http://localhost:80',      // Prod фронтенд
            'http://localhost',         // Prod фронтенд (без порта)
            'http://frontend:80',       // Внутри Docker сети
            'http://frontend',          // Внутри Docker сети
        ];

        // Добавить кастомные origins из переменных окружения
        if (process.env.ALLOWED_ORIGINS) {
            allowedOrigins.push(...process.env.ALLOWED_ORIGINS.split(','));
        }

        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization, Accept, X-Requested-With',
    exposedHeaders: 'Authorization', // Если фронтенд читает кастомные заголовки
};
