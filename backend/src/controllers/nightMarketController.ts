import { Request, Response } from 'express';
import { NightMarketService } from '../services/nightMarketService';
import { AuthRequest } from '../middleware/auth';

export class NightMarketController {
  static async createNightMarketPost(req: AuthRequest, res: Response) {
    try {
      const post = await NightMarketService.createNightMarketPost(req.user!.id, req.body);
      res.status(201).json(post);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getNightMarketPosts(req: Request, res: Response) {
    try {
      const posts = await NightMarketService.getNightMarketPosts();
      res.json(posts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getNightMarketPostById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const post = await NightMarketService.getNightMarketPostById(id);
      res.json(post);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  static async updateNightMarketPost(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const post = await NightMarketService.updateNightMarketPost(id, req.user!.id, req.body);
      res.json(post);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteNightMarketPost(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      await NightMarketService.deleteNightMarketPost(id, req.user!.id);
      res.json({ message: 'Night market post deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getUserNightMarketPosts(req: AuthRequest, res: Response) {
    try {
      const posts = await NightMarketService.getUserNightMarketPosts(req.user!.id);
      res.json(posts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}