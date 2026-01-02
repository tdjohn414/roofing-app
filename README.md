# Roofing Estimate Pro

A professional roofing estimate generator for contractors. Create detailed insurance-style PDF estimates with scope of work templates.

## Features

- **User Registration/Login** - JWT-based authentication with business profile setup
- **Customer Management** - Add customers with multiple job addresses
- **Estimate Generation** - Create professional estimates with:
  - Shingle roof replacements
  - Optional AC unit handling
  - Optional flat roof sections
  - Manual or calculated pricing
- **PDF Generation** - Download professional PDFs with:
  - Company branding/logo
  - Customer information
  - Job address
  - Detailed scope of work (phased breakdown)
  - Wood price list
  - Total pricing

## Tech Stack

- **Frontend**: Next.js 14 with React
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Railway)
- **File Storage**: Cloudinary
- **Authentication**: JWT with bcrypt
- **PDF Generation**: jsPDF
- **Styling**: Tailwind CSS

## Deployment Instructions

### 1. Set Up Railway Database

Your Railway PostgreSQL is already provisioned. The database schema will be created automatically on first deployment.

**Database URL**: Already configured in your `.env` files

### 2. Deploy to Vercel

#### Option A: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   cd roofing-app
   vercel
   ```

4. Add environment variables in Vercel Dashboard:
   - `DATABASE_URL` = `postgresql://postgres:rUMxgjeqHCVskCedvnnIIVaxgMszuVWK@mainline.proxy.rlwy.net:11405/railway`
   - `JWT_SECRET` = (generate a random 32+ character string)
   - `CLOUDINARY_CLOUD_NAME` = `Root`
   - `CLOUDINARY_API_KEY` = `879335926276132`
   - `CLOUDINARY_API_SECRET` = `3nySMS91G_QACHrSV-IDwhKI1Os`

#### Option B: Deploy via GitHub

1. Create a new GitHub repository
2. Push the code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/roofing-estimate-app.git
   git push -u origin main
   ```
3. Go to [vercel.com](https://vercel.com)
4. Click "New Project"
5. Import your GitHub repository
6. Add the environment variables listed above
7. Deploy

### 3. Initialize the Database

After deploying, you need to create the database tables. Run this from your local machine:

```bash
# Clone your repo
git clone https://github.com/YOUR_USERNAME/roofing-estimate-app.git
cd roofing-estimate-app

# Install dependencies
npm install

# Create .env file with your DATABASE_URL
echo 'DATABASE_URL="postgresql://postgres:rUMxgjeqHCVskCedvnnIIVaxgMszuVWK@mainline.proxy.rlwy.net:11405/railway"' > .env

# Push the database schema
npx prisma db push

# (Optional) Open Prisma Studio to view your data
npx prisma studio
```

Alternatively, run this SQL directly in Railway's database console:

```sql
-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  business_name VARCHAR(255) NOT NULL,
  business_address VARCHAR(500) NOT NULL,
  business_phone VARCHAR(50),
  rep_name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create customers table
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create job_addresses table
CREATE TABLE job_addresses (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  street_address VARCHAR(500) NOT NULL,
  city VARCHAR(255) NOT NULL,
  state VARCHAR(50) NOT NULL,
  zip VARCHAR(20) NOT NULL,
  aerial_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create estimates table
CREATE TABLE estimates (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  job_address_id INTEGER NOT NULL REFERENCES job_addresses(id),
  roofing_type VARCHAR(50) DEFAULT 'shingles',
  has_ac_unit BOOLEAN DEFAULT FALSE,
  has_flat_section BOOLEAN DEFAULT FALSE,
  pricing_method VARCHAR(50) NOT NULL,
  manual_price DECIMAL(10, 2),
  price_per_square DECIMAL(10, 2),
  total_squares DECIMAL(10, 2),
  waste_percentage DECIMAL(5, 2),
  total_price DECIMAL(10, 2) NOT NULL,
  scope_of_work TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Usage

1. **Register** - Create your contractor account with business details and logo
2. **Add Customers** - Add customer name and phone number
3. **Add Job Addresses** - Add one or more job addresses per customer (with optional aerial images)
4. **Create Estimates** - Select customer, address, options, and pricing
5. **Download PDF** - Generate and download professional PDF estimates

## Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Push database schema
npx prisma db push

# Generate Prisma client
npx prisma generate

# Run development server
npm run dev
```

Visit `http://localhost:3000`

## Project Structure

```
roofing-app/
├── prisma/
│   └── schema.prisma      # Database schema
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   │   ├── auth/      # Authentication endpoints
│   │   │   ├── customers/ # Customer CRUD
│   │   │   ├── estimates/ # Estimate CRUD
│   │   │   └── job-addresses/
│   │   ├── dashboard/     # Protected dashboard pages
│   │   ├── login/         # Login page
│   │   └── register/      # Registration page
│   ├── components/        # Reusable components
│   └── lib/               # Utilities
│       ├── auth.ts        # Authentication helpers
│       ├── cloudinary.ts  # Image upload
│       ├── prisma.ts      # Database client
│       └── scopeOfWork.ts # Scope templates
├── .env.local             # Environment variables
└── package.json
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

## License

Private - For authorized use only.
