const { Client } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:rUMxgjeqHCVskCedvnnIIVaxgMszuVWK@mainline.proxy.rlwy.net:11405/railway";

const schema = `
-- Drop existing tables if they exist (in reverse order due to foreign keys)
DROP TABLE IF EXISTS estimates CASCADE;
DROP TABLE IF EXISTS job_addresses CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

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

-- Create indexes for better query performance
CREATE INDEX idx_customers_user_id ON customers(user_id);
CREATE INDEX idx_job_addresses_customer_id ON job_addresses(customer_id);
CREATE INDEX idx_estimates_user_id ON estimates(user_id);
CREATE INDEX idx_estimates_customer_id ON estimates(customer_id);
CREATE INDEX idx_estimates_job_address_id ON estimates(job_address_id);
`;

async function initializeDatabase() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected successfully!');

    console.log('Creating schema...');
    await client.query(schema);
    console.log('Schema created successfully!');

    // Verify tables were created
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('\\nTables created:');
    result.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\\nDatabase initialization complete!');
  }
}

initializeDatabase();
