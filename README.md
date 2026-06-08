# MongoDB Aggregation API - Node.js & TypeScript

## Objective
A REST API application built using Express, TypeScript, and Mongoose that stores customer and order information, retrieving combined data using the MongoDB Aggregation Framework.

## Technology Stack
- Node.js & TypeScript
- Express.js
- MongoDB & Mongoose ODM
- Postman (Testing)

---

## Setup Instructions

### 1. Prerequisites
- Node.js installed (v16+)
- MongoDB running locally on `mongodb://127.0.0.1:27017`

### 2. Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### 3. Running the Server
Start the development server:
```bash
npm run dev
```
The server will start on `http://localhost:3000` and automatically connect to the `salesdb` database.

---

## API Endpoints & Sample Payloads

### 1. Create Customer
- **Endpoint:** `POST /api/customers`
- **Description:** Inserts a new customer. Validates email format.
- **Request Body:**
  ```json
  {
    "customerId": "C001",
    "name": "John Doe",
    "email": "john@example.com",
    "city": "Kochi"
  }
  ```
- **Response (201):**
- ```json
  {
    "message": "Customer inserted successfully"
  }
  ```

### 2. Create Order
- **Endpoint:** `POST /api/orders`
- **Description:** Inserts a new order. Validates that amount is positive.
- **Request Body:**
  ```json
  {
    "orderId": "O1001",
    "customerId": "C001",
    "product": "Laptop",
    "amount": 55000,
    "orderDate": "2026-06-01"
  }
  ```
- **Response (201):**
- ```json
  {
    "message": "Order inserted successfully"
  }
  ```

### 3. Get Customer Orders (Aggregation)
- **Endpoint:** `GET /api/customer-orders`
- **Description:** Uses `$lookup`, `$unwind`, and `$project` to join customers and orders.
- **Sample Response:**
  ```json
  [
    {
      "customerId": "C001",
      "customerName": "John Doe",
      "email": "john@example.com",
      "city": "Kochi",
      "orderId": "O1001",
      "product": "Laptop",
      "amount": 55000,
      "orderDate": "2026-06-01T00:00:00.000Z"
    }
  ]
  ```

### 4. Customer Purchase Summary (Bonus)
- **Endpoint:** `GET /api/customer-summary`
- **Description:** Uses `$group` and `$sort` to calculate total orders and total amount spent per customer, sorted by highest spender.
- **Sample Response:**
  ```json
  [
    {
      "customerId": "C001",
      "customerName": "John Doe",
      "totalOrders": 2,
      "totalPurchaseAmount": 85000
    }
  ]
  ```
