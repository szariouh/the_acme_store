The Database schema:
User
  id (UUID)
  username (STRING) UNIQUE
  password (STRING) UNIQUE

Product
  id (UUID)
  name (STRING)

Favorite
  id (UUID)
  product_id (UUID REFERENCES products table NOT NULL)
  user_id (UUID REFERENCES users table NOT NULL) 
  CONSTRAINT combination of user_id and product_id should be unique
