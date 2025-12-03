import { Router } from 'express';
import { ListingController } from '../controllers/listingController';
import { verifyToken } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// Public routes
router.get('/', ListingController.getListings);
router.get('/:id', ListingController.getListingById);

// Protected routes
router.get('/user/listings', verifyToken, ListingController.getUserListings);
router.post('/', verifyToken, upload.array('images', 5), ListingController.createListing);
router.put('/:id', verifyToken, ListingController.updateListing);
router.delete('/:id', verifyToken, ListingController.deleteListing);

export default router;