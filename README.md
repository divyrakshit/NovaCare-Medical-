# 🏥 NovaCare Medical - AI Hospital Management System

NovaCare Medical is a modern, full-stack Hospital Management System designed to bridge the gap between healthcare professionals and patients through the power of Artificial Intelligence. Built as a comprehensive final year project, it modernizes traditional hospital workflows with intelligent symptom triage, multilingual voice dictation, and real-time inventory tracking.

## ✨ Key Features
- **🤖 Nova AI Concierge**: An intelligent symptom triage assistant that helps patients identify their needs and book appropriate appointments.
- **🎙️ Speech-to-Text Clinical Notes**: Native Web Speech API integration allows doctors to dictate clinical notes seamlessly, supporting global language accessibility.
- **📝 Automated Prescriptions**: AI-generated prescription drafting based on patient history, reducing administrative overhead for doctors. Includes secure PDF generation capabilities.
- **💻 Telemedicine Portal**: Integrated UI simulating a live video consultation room between patients and doctors.
- **📊 Admin Dashboard**: Real-time tracking of critical hospital resources, including ICU bed availability, pharmacy stock, and blood bank inventory alerts.
- **🔒 Secure Authentication**: Full Role-Based Access Control (RBAC) with secure, database-backed registration and bcrypt password hashing for Patients, Doctors, and Administrators.

## 🛠️ Technology Stack
- **Frontend & API:** [Next.js](https://nextjs.org/) (React Framework)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Database ORM:** [Prisma](https://www.prisma.io/) (with SQLite for easy setup)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **AI Integration:** [Vercel AI SDK](https://sdk.vercel.ai/)

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js (v18+) and npm installed.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/divyrakshit/NovaCare-Medical-.git
   cd NovaCare-Medical-
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the Database:
   ```bash
   npx prisma db push
   ```
4. Seed the Database with Demo Data (Appointments, Patient History, etc.):
   ```bash
   npx prisma db seed
   ```
5. Run the Development Server:
   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Accounts

You can register a completely new account directly through the UI via the "Register New Account" page, or test the application instantly using one of the pre-seeded demo accounts:

- **Admin Account**: `admin@hospital.com` / `admin123`
- **Doctor Account**: `doctor@hospital.com` / `doctor123`
- **Patient Account**: `patient@hospital.com` / `patient123`

*(A quick toggle on the Login page will auto-fill these for you!)*

## 📄 License
This project is open-source and created for educational/demonstration purposes.
