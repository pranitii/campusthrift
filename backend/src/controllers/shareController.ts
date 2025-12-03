import { Request, Response } from 'express';
import { generateShareMessage } from '../utils/shareMessage';

export class ShareController {
  static async generateMessage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      
      const message = await generateShareMessage(id, frontendUrl);
      res.json({ message });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}
