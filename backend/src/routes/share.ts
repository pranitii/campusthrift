import { Router } from 'express';
import { ListingService } from '../services/listingService';
import { generateShareMessage } from '../utils/shareMessage';

const router = Router();

router.get('/generate-message/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await ListingService.getListingById(id);

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const message = await generateShareMessage(id, baseUrl);

    res.json({ message });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

export default router;