import { Request, Response } from 'express';
import { BorrowService } from '../services/borrowService';
import { AuthRequest } from '../middleware/auth';

export class BorrowController {
  static async createBorrowRequest(req: AuthRequest, res: Response) {
    try {
      const request = await BorrowService.createBorrowRequest(req.user!.id, req.body);
      res.status(201).json(request);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getBorrowRequests(req: Request, res: Response) {
    try {
      const filters = req.query;
      const result = await BorrowService.getBorrowRequests(filters);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getBorrowRequestById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const request = await BorrowService.getBorrowRequestById(id);
      res.json(request);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  static async updateBorrowRequest(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const request = await BorrowService.updateBorrowRequest(id, req.user!.id, req.body);
      res.json(request);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteBorrowRequest(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      await BorrowService.deleteBorrowRequest(id, req.user!.id);
      res.json({ message: 'Borrow request deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getUserBorrowRequests(req: AuthRequest, res: Response) {
    try {
      const requests = await BorrowService.getUserBorrowRequests(req.user!.id);
      res.json(requests);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async respondToBorrowRequest(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { response } = req.body;
      const result = await BorrowService.respondToBorrowRequest(id, req.user!.id, response);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}