import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import boothRoutes from './routes/boothRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import spotifyRoutes from './routes/spotifyRoutes.js';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = Number(process.env.SERVER_PORT) || 5000;
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(
  cors({
    origin: corsOrigin
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));

app.get('/', (_request, response) => {
  response.json({
    name: 'Boothify API',
    status: 'running'
  });
});

app.use('/api/health', healthRoutes);
app.use('/api/spotify', spotifyRoutes);
app.use('/api/booth', boothRoutes);

app.listen(port, () => {
  console.log(`Boothify API listening on http://localhost:${port}`);
});

