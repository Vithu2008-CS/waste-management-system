# Eastern University - Waste Management System (WMS)

A modern, full-stack waste management system built with Next.js 14, TypeScript, Prisma, and SQLite. Features real-time tracking, intelligent route optimization, and role-based access control.

## 🌟 Features

### Core Functionality
- **User Authentication**: Secure login system with JWT tokens and role-based access control
- **Student Portal**: Report full dustbins, track complaint status, view history
- **Driver Dashboard**: View assigned tasks, update status, navigate to locations
- **Admin Panel**: Comprehensive management of users, dustbins, faculties, and system logs
- **Real-time Tracking**: Google Maps integration for live driver and dustbin locations
- **Smart Allocation**: Automatic assignment to nearest available driver using Haversine formula
- **Route Optimization**: Google Maps API integration for optimal collection routes

### Technical Features
- **Modern UI**: Glassmorphism design with Framer Motion animations
- **Responsive**: Works seamlessly on desktop, tablet, and mobile
- **Type-Safe**: Full TypeScript implementation
- **Database**: SQLite with Prisma ORM
- **API Routes**: RESTful API with Next.js App Router
- **Security**: Password hashing with bcrypt, JWT authentication
- **Logging**: Comprehensive system activity logging

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Install Dependencies**
```bash
npm install
```

2. **Set Up Environment Variables**
Create a `.env.local` file in the root directory (already created) and update:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
```

3. **Initialize Database**
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

4. **Run Development Server**
```bash
npm run dev
```

5. **Open Application**
Navigate to [http://localhost:3000](http://localhost:3000)

## 👥 Demo Credentials

After seeding the database, use these credentials:

### Student Account
- Email: `student@eu.edu`
- Password: `password123`

### Driver Account
- Email: `driver@eu.edu`
- Password: `password123`

### Admin Account
- Email: `admin@eu.edu`
- Password: `password123`

## 📁 Project Structure

```
WMS/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── complaints/   # Complaint management
│   │   └── dustbins/     # Dustbin management
│   ├── student/          # Student dashboard
│   ├── driver/           # Driver dashboard
│   ├── admin/            # Admin dashboard
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Landing page
│   └── globals.css       # Global styles
├── lib/
│   ├── prisma.ts         # Prisma client
│   ├── auth.ts           # Authentication utilities
│   └── location.ts       # Location & routing logic
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed data
├── public/               # Static assets
├── .env.local            # Environment variables
├── next.config.js        # Next.js configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies
```

## 🎨 Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations
- **Lucide React**: Beautiful icons
- **React Hot Toast**: Toast notifications

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **Prisma**: Type-safe ORM
- **SQLite**: Lightweight database
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication

### External Services
- **Google Maps API**: Location tracking and route optimization

## 📊 Database Schema

### User Roles
- **STUDENT**: Can report complaints and track status
- **DRIVER**: Can view assigned tasks and update status
- **ADMIN**: Full system access and management

### Main Models
- **User**: Base user authentication
- **Student**: Student-specific data
- **Driver**: Driver details and location
- **Admin**: Administrator details
- **Faculty**: University faculties/buildings
- **Dustbin**: Dustbin locations and details
- **Complaint**: Waste collection complaints
- **Collection**: Collection activity logs
- **SystemLog**: System activity audit trail

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm start            # Start production server

# Database
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema to database
npx prisma db seed   # Seed database with initial data
npx prisma studio    # Open Prisma Studio (database GUI)

# Linting
npm run lint         # Run ESLint
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Complaints
- `GET /api/complaints` - Get complaints (role-based)
- `POST /api/complaints` - Create new complaint

### Dustbins
- `GET /api/dustbins` - Get all dustbins
- `POST /api/dustbins` - Create dustbin (admin only)

## 🔐 Security Features

- Password hashing with bcrypt (12 rounds)
- JWT token-based authentication
- Role-based access control (RBAC)
- Secure HTTP-only cookies
- Input validation and sanitization
- SQL injection prevention (Prisma)
- XSS protection

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🎯 Key Algorithms

### Haversine Formula
Used to calculate the distance between two geographic coordinates:
```typescript
distance = 2 * R * arcsin(√(sin²(Δlat/2) + cos(lat1) * cos(lat2) * sin²(Δlon/2)))
```

### Nearest Driver Algorithm
1. Fetch all active drivers with current locations
2. Calculate distance from dustbin to each driver
3. Select driver with minimum distance
4. Assign complaint and update driver status

## 🚧 Future Enhancements

- [ ] Real-time WebSocket notifications
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] SMS alerts
- [ ] Multi-language support
- [ ] Dark/Light theme toggle
- [ ] Export reports (PDF/Excel)
- [ ] Driver performance metrics
- [ ] Predictive maintenance

## 📄 License

This project is developed for Eastern University.

## 👨‍💻 Development

Built with ❤️ using modern web technologies.

---

For questions or support, please contact the development team.
