/**
 * @swagger
 * components:
 *   schemas:
 *     MP3ProcessingResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: A message indicating the status of the MP3 processing.
 *         frameCount:
 *           type: integer
 *           description: The number of frames in the processed MP3 file.
 *
 * /file-upload:
 *   post:
 *     summary: Process MP3 file
 *     description: Endpoint to process an uploaded MP3 file.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               mp3File:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MP3ProcessingResponse'
 *       400:
 *         description: Invalid or missing parameters
 *         content:
 *           application/json:
 *             example:
 *               error: Missing or invalid mp3File parameter.
 *       500:
 *         description: Error processing the MP3 file
 *         content:
 *           application/json:
 *             example:
 *               error: Error processing the MP3 file.
 */

import { Request, Response } from 'express';
import { countMP3Frames } from '../services/mp3Services';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit, adjust as needed

export const processMP3 = async (req: Request, res: Response): Promise<void> => {
  try {
    const mp3File = req.file;

    if (!mp3File || !mp3File.buffer) {
      res.status(400).json({ error: 'Missing or invalid mp3File parameter.' });
      return;
    }

   if (!isMP3File(mp3File.originalname)) {
      res.status(400).json({ error: 'Only MP3 files are allowed!' });
      return;
    }

    if (mp3File.size > MAX_FILE_SIZE_BYTES) {
      res.status(400).json({ error: 'File size exceeds the maximum allowed limit.' });
      return;
    }

    const frameCount: number = await countMP3Frames(mp3File.buffer);

    res.json({ message: 'MP3 processing completed!', frameCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error processing the MP3 file.' });
  }
};

const isMP3File = (fileName: string): boolean => {
  const mp3Regex = /\.mp3$/i;
  return mp3Regex.test(fileName);
};
