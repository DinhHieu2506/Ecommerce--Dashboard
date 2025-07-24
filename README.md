# Challenge: E-commerce Dashboard with Redux
Practice frontend development with React.js and Redux Toolkit  
Understand how to manage complex application state  
Work with product management, user management, and order management  
Simulate backend interaction using mock APIs or json-server  

## Description:
Build a dashboard interface for managing an e-commerce platform.  
The UI should provide functionalities to manage products, users, and orders.

### 1. Product Management:
- View product list
- Add new product
- Edit product information
- Delete product

**Product Model:**
- `id` (auto-increment, primary key)
- `name` (string, required)
- `description` (string, optional)
- `price` (number, required)
- `stock` (number, required)
- `category` (string, optional)

### 2. User Management:
- View all users
- Search/filter users
- Edit user profile
- Delete user

**User Model:**
- `id` (auto-increment, primary key)
- `name` (string, required)
- `email` (string, unique, required)
- `role` (enum: admin, customer)
- `createdAt` (datetime)

### 3. Order Management:
- View list of orders
- View order details
- Change order status (pending → processing → shipped → delivered)

**Order Model:**
- `id` (auto-increment, primary key)
- `userId` (foreign key)
- `productIds` (array of product ids)
- `status` (enum: pending, processing, shipped, delivered)
- `totalPrice` (calculated)
- `createdAt` (datetime)

---

### Technical Requirements:
- React.js
- Redux Toolkit (RTK) for state management
- Redux Thunk for async logic
- React Router v6 for routing
- Material UI/Antd or Chakra UI (for styling, optional)
- json-server or mock API service (e.g., Mockoon) for simulating backend
