-- Create tables for roofing estimate app

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  business_name VARCHAR(255) NOT NULL,
  business_address TEXT NOT NULL,
  business_phone VARCHAR(50),
  rep_name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Job addresses table
CREATE TABLE IF NOT EXISTS job_addresses (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  street_address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  zip VARCHAR(20) NOT NULL,
  aerial_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Estimates table
CREATE TABLE IF NOT EXISTS estimates (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  job_address_id INTEGER NOT NULL REFERENCES job_addresses(id),
  roofing_type VARCHAR(50) DEFAULT 'shingles',
  has_ac_unit BOOLEAN DEFAULT FALSE,
  has_flat_section BOOLEAN DEFAULT FALSE,
  pricing_method VARCHAR(20) NOT NULL,
  manual_price DECIMAL(10, 2),
  price_per_square DECIMAL(10, 2),
  total_squares DECIMAL(10, 2),
  waste_percentage DECIMAL(5, 2),
  total_price DECIMAL(10, 2) NOT NULL,
  scope_of_work TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_job_addresses_customer_id ON job_addresses(customer_id);
CREATE INDEX IF NOT EXISTS idx_estimates_user_id ON estimates(user_id);
CREATE INDEX IF NOT EXISTS idx_estimates_customer_id ON estimates(customer_id);
