# Srivalli Creations - E-commerce Platform

A full-stack e-commerce web application built for a family business, featuring a modern React TypeScript frontend and Django REST API backend. The platform enables seamless product browsing, secure admin management, and streamlined order processing.

## 🚀 Features

### Customer Features
- **Browse Products**: View product catalog and detailed product pages without authentication
- **Secure Shopping**: Login-protected cart functionality and checkout process
- **Responsive Design**: Mobile-friendly interface for optimal user experience across devices

### Admin Features
- **Product Management**: Add, edit, and manage product inventory
- **Order Management**: Track and process customer orders
- **Payment Processing**: Handle payment transactions securely
- **JWT Authentication**: Secure admin access with token-based authentication

### Technical Features
- **Pagination**: Optimized product listing with backend pagination to prevent server overload
- **Form Validation**: Dual-layer validation using React Hook Form + Zod (frontend) and Django serializers (backend)
- **Loading States**: Custom loading components for smooth user experience during API calls
- **RESTful API**: Clean, organized API endpoints following REST principles

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **React Hook Form** for form handling
- **Zod** for schema validation
- **Custom pagination components**
- **Responsive CSS/Styling**

### Backend
- **Django** with Django REST Framework
- **JWT Authentication** for secure API access
- **Django Serializers** for data validation
- **Pagination** for optimized data delivery
- **SQLite/PostgreSQL** database

## 📋 Prerequisites

Before running this project, make sure you have the following installed:
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- npm or yarn
- pip

## 🔧 Installation & Setup

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/ThermalDust095/srivallicreations.git
cd srivallicreations

# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (for admin access)
python manage.py createsuperuser

# Start the development server
python manage.py runserver
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

## 🌐 Usage

1. **Access the application**: Open your browser and navigate to `http://localhost:3000`

2. **Browse Products**: View the product catalog and individual product details without logging in

3. **Admin Access**: 
   - Login with admin credentials
   - Access product management and order processing features
   - Add new products, edit existing ones, and manage inventory

4. **Customer Journey**:
   - Browse products as a guest
   - Register/login to add items to cart
   - Proceed through secure checkout process

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/login/` - User login
- `POST /api/auth/register/` - User registration
- `POST /api/auth/refresh/` - Token refresh

### Products
- `GET /api/products/` - Get paginated product list
- `GET /api/products/{id}/` - Get product details
- `POST /api/products/` - Create product (Admin only)
- `PUT /api/products/{id}/` - Update product (Admin only)
- `DELETE /api/products/{id}/` - Delete product (Admin only)

### Orders
- `GET /api/orders/` - Get user orders
- `POST /api/orders/` - Create new order
- `GET /api/admin/orders/` - Get all orders (Admin only)

## 🚀 Deployment

The application is designed to be easily deployable to various platforms:
- **Frontend**: Can be deployed to Netlify, Vercel, or any static hosting service
- **Backend**: Can be deployed to Heroku, AWS, or any cloud platform supporting Django

## 🤝 Contributing

This is a personal project for a family business. However, suggestions and feedback are welcome!

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

Developed by [ThermalDust095](https://github.com/ThermalDust095) for Srivalli Creations family business.

---

**Note**: This application is currently in production use, serving real customers and processing actual orders for the family business.
