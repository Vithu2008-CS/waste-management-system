# Quick Setup Guide - Eastern University WMS

## 🚀 Quick Start (5 Minutes)

Follow these steps to get the Waste Management System running:

### Step 1: Install Dependencies
```bash
npm install
```
Wait for all packages to install (this may take 2-3 minutes).

### Step 2: Set Up Database
```bash
npx prisma generate
npx prisma db push
```

### Step 3: Seed Database with Demo Data
```bash
npx prisma db seed
```

This will create:
- 1 Admin account
- 1 Student account  
- 2 Driver accounts
- 3 Faculties
- 4 Dustbins

### Step 4: Start Development Server
```bash
npm run dev
```

### Step 5: Open Application
Navigate to: **http://localhost:3000**

## 🔑 Demo Login Credentials

### Student
- **Email:** student@eu.edu
- **Password:** password123

### Driver
- **Email:** driver@eu.edu
- **Password:** password123

### Admin
- **Email:** admin@eu.edu
- **Password:** password123

## 🗺️ Google Maps API (Optional)

To enable real-time location tracking and route optimization:

1. Get a Google Maps API key from: https://console.cloud.google.com/
2. Enable these APIs:
   - Maps JavaScript API
   - Directions API
   - Geocoding API
3. Update `.env.local`:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-api-key-here"
   ```

## 📱 Testing the Application

### As a Student:
1. Login with student credentials
2. Click "Report New Complaint"
3. Select a dustbin location
4. Submit the complaint
5. View complaint status on dashboard

### As a Driver:
1. Login with driver credentials
2. Toggle status to "Active"
3. View assigned complaints
4. Click "Navigate" to open Google Maps
5. Update complaint status (Start → Complete)

### As an Admin:
1. Login with admin credentials
2. View system statistics
3. Access management panels
4. Monitor all activities

## 🛠️ Troubleshooting

### Database Issues
If you encounter database errors:
```bash
# Delete the database and start fresh
rm prisma/dev.db
npx prisma db push
npx prisma db seed
```

### Port Already in Use
If port 3000 is busy:
```bash
# Use a different port
npm run dev -- -p 3001
```

### Module Not Found Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📊 Database Management

### View Database in Browser
```bash
npx prisma studio
```
Opens at: http://localhost:5555

### Reset Database
```bash
npx prisma db push --force-reset
npx prisma db seed
```

## 🎨 Features to Test

✅ User authentication with role-based access
✅ Student complaint submission
✅ Automatic driver assignment (nearest driver)
✅ Driver status management
✅ Real-time complaint tracking
✅ Admin dashboard with statistics
✅ Responsive design (mobile-friendly)
✅ Beautiful animations and transitions

## 📝 Next Steps

1. **Customize**: Update colors, branding, and content
2. **Add Data**: Create more faculties, dustbins, and users
3. **Configure**: Set up Google Maps API for full functionality
4. **Deploy**: Deploy to Vercel, Netlify, or your preferred platform

## 🚀 Production Deployment

### Environment Variables for Production
```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="generate-a-strong-secret-key"
NEXTAUTH_URL="https://your-domain.com"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-api-key"
```

### Build for Production
```bash
npm run build
npm start
```

## 💡 Tips

- Use Chrome DevTools to test responsive design
- Check browser console for any errors
- Use Prisma Studio to inspect database records
- Test all user roles to understand the full workflow

## 🆘 Need Help?

- Check the main README.md for detailed documentation
- Review the code comments for implementation details
- Inspect the API routes in `/app/api` for backend logic

---

**Enjoy building with the Eastern University Waste Management System!** 🎉
