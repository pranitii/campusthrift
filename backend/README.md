# CampusThrift Backend

A production-grade backend for CampusThrift, a campus marketplace platform.

## Features

- **User Authentication**: Google OAuth + Email/Password with JWT tokens
- **Marketplace Listings**: CRUD operations with QR code generation
- **Rent/Borrow System**: Request and respond to borrow requests
- **Night Market**: Food/snack availability by hostel
- **Search & Filters**: Advanced filtering and sorting
- **Admin Panel**: User and content management
- **Image Uploads**: Local storage with Cloudinary support
- **Validation**: Zod schemas for input validation
- **Security**: Helmet, CORS, rate limiting

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Passport.js (Google OAuth + Local)
- **Validation**: Zod
- **File Uploads**: Multer
- **QR Codes**: qrcode library
- **Testing**: Jest
- **Linting**: ESLint + Prettier

## Project Structure

```
src/
├── config/          # Environment and Passport config
├── controllers/     # Route handlers
├── middleware/      # Auth, upload, validation middleware
├── routes/          # API routes
├── services/        # Business logic
├── types/           # TypeScript types and Zod schemas
├── utils/           # Helper functions
├── prisma/          # Database client
└── index.ts         # Application entry point

prisma/
├── schema.prisma    # Database schema
└── seed.ts          # Database seeding script

tests/               # Unit tests
public/uploads/      # Uploaded files
```

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Seed database (optional)**
   ```bash
   npm run seed
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:push` - Push schema to database
- `npm run prisma:migrate` - Create and run migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run seed` - Seed database

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token
- `GET /auth/google` - Google OAuth login
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile

### Listings
- `GET /listings` - Get all listings with filters
- `GET /listings/:id` - Get listing by ID
- `POST /listings` - Create new listing
- `PUT /listings/:id` - Update listing
- `DELETE /listings/:id` - Delete listing

### Borrow Requests
- `GET /borrow` - Get borrow requests
- `GET /borrow/:id` - Get borrow request by ID
- `POST /borrow` - Create borrow request
- `PUT /borrow/:id` - Update borrow request
- `DELETE /borrow/:id` - Delete borrow request
- `POST /borrow/:id/respond` - Respond to borrow request

### Night Market
- `GET /night-market` - Get night market posts grouped by hostel
- `GET /night-market/:id` - Get night market post by ID
- `POST /night-market` - Create night market post
- `PUT /night-market/:id` - Update night market post
- `DELETE /night-market/:id` - Delete night market post

### Share
- `GET /share/generate-message/:id` - Generate shareable message for listing

## Database Schema

See `prisma/schema.prisma` for the complete database schema.

## Testing

Run tests with:
```bash
npm test
```

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Set environment variables for production

3. Start the server:
   ```bash
   npm start
   ```

## Environment Variables

See `.env.example` for required environment variables.

## Contributing

1. Follow the existing code style
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting PR

## License

ISC