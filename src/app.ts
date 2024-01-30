import express, { Express } from 'express';
import multer from 'multer';
import { processMP3 } from './controller/mp3Controller';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import dotenv from 'dotenv';

dotenv.config();
const app: Express = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Swagger options
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MP3 Processing API',
      version: '1.0.0',
      description: 'API for processing MP3 files',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Local server',
      },
    ],
  },
  apis: ['./controllers/*.ts'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.post('/file-upload', upload.single('mp3File'), processMP3);

app.listen(PORT, () => {
  console.log(`Main API server is running on port ${PORT}`);
});
