import { Request, Response } from 'express';
import { ListingService } from '../services/listingService';
import { AuthRequest } from '../middleware/auth';
import { env } from '../config/env';

export class ListingController {
  static async createListing(req: AuthRequest, res: Response) {
    try {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const listing = await ListingService.createListing(req.user!.id, req.body, baseUrl);
      res.status(201).json(listing);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getListings(req: Request, res: Response) {
    try {
      const filters = req.query;
      const result = await ListingService.getListings(filters);
      res.json(result);
    } catch (error: any) {
      console.error('Error fetching listings:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch listings' });
    }
  }

  static async getListingById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const listing = await ListingService.getListingById(id);
      res.json(listing);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  static async updateListing(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const listing = await ListingService.updateListing(id, req.user!.id, req.body);
      res.json(listing);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteListing(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      await ListingService.deleteListing(id, req.user!.id);
      res.json({ message: 'Listing deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getUserListings(req: AuthRequest, res: Response) {
    try {
      const listings = await ListingService.getUserListings(req.user!.id);
      res.json(listings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}