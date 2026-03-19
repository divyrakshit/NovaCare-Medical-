# Hospital Management System with AI Integration
## Final Year Project - Presentation & Viva Preparation Guide

This document contains a comprehensive list of potential questions (with suggested answers based on your project's architecture) that examiners might ask during your final year project presentation.

---

### 1. General Project Concept & Motivation
**Q1: What is the primary objective of your Hospital Management System (HMS)?**
**A:** The main objective is to modernize traditional hospital workflows by integrating Artificial Intelligence. It bridges the gap between doctors, patients, and administrators through features like an AI Symptom Checker (Nova AI), automated EMR (Electronic Medical Record) summaries, voice-dictated clinical notes, and real-time inventory tracking for critical resources like blood.

**Q2: How is your system different from existing hospital management systems?**
**A:** Traditional systems are mostly data-entry focused and rigid. Our system proactively assists both patients and doctors using AI. For patients, the Nova AI Concierge triages symptoms and helps book appointments. For doctors, it uses Speech-to-Text to natively transcribe clinical notes in any language, and it automatically drafts prescriptions based on patient history, saving valuable time.

**Q3: Who are the target users for this application?**
**A:** The system operates using a Role-Based Access Control (RBAC) model targeting three main users:
1. **Patients:** To book appointments, consult the AI triage, and manage health records.
2. **Doctors:** To manage their schedule, conduct telehealth video consultations, and use AI to draft prescriptions.
3. **Administrators:** To monitor critical hospital capacity (ICU beds, general wards) and manage pharmacy/blood bank inventory.

---

### 2. Technology Stack & Architecture
**Q4: Can you explain the technology stack you used and why you chose it?**
**A:** 
- **Frontend & Backend:** Next.js (React framework) because it allows for seamless full-stack development with Server-Side Rendering (SSR) for fast load times and API route integration.
- **Database ORM:** Prisma with SQLite. Prisma provides type-safe database queries, making the data layer secure and easy to migrate.
- **Styling:** Tailwind CSS and Shadcn UI components for a highly responsive, modern, and accessible design.
- **Authentication:** NextAuth.js for secure, session-based role authentication (Admin/Doctor/Patient).

**Q5: How did you implement the database design?**
**A:** The database is relational. We have a core `User` table that uses One-to-One relationships with `Patient`, `Doctor`, and `BloodDonor` specific tables. This keeps authentication centralized while allowing role-specific data to be linked efficiently. We also have tables for `Appointment`, `MedicalRecord`, and inventory tracking (`BloodInventory`, `BloodRequest`).

**Q6: Does your application support Real-Time features?**
**A:** Yes, the system simulates real-time dashboard updates for bed availability and pharmacy stock. We also integrated WebRTC concepts for the Live Consultation (Telemedicine) video portal.

---

### 3. Artificial Intelligence & Advanced Features
**Q7: How does the AI Assistant (Nova AI Concierge) work on the backend?**
**A:** The AI leverages the Vercel AI SDK integration. When a user sends a message, it is processed through a specialized system prompt that instructs the AI to act as a medical triage assistant. It parses symptoms and provides preliminary advice safely, always adding a disclaimer that it does not replace emergency services.

**Q8: You mentioned voice input support. How is that implemented, and how does it handle multiple languages?**
**A:** We integrated the native **Web Speech API** (`SpeechRecognition`). It's highly efficient because it runs directly in the browser without requiring a heavy backend audio-processing server. To support multiple languages, it dynamically reads the user's operating system/browser language (`navigator.language`) and transcribes speech natively in the user's preferred language.

**Q9: How are PDF Prescriptions generated?**
**A:** The doctor portal uses the AI to draft the prescription text based on patient history. We then use a combination of `html2canvas` and `jsPDF` libraries on the frontend to capture a hidden DOM element formatted like an official hospital document and convert it into a downloadable PDF for the patient.

---

### 4. Security & Error Handling
**Q10: Since this deals with medical data, how is user security handled?**
**A:** 
1. **Authentication:** NextAuth securely handles session tokens.
2. **Passwords:** Passwords are never stored in plain text. They are hashed using `bcrypt` (with a salt round of 10) securely on the server-side before being inserted into the database.
3. **Authorization:** Middleware and protected routes ensure that a Patient cannot access the Doctor Portal or Admin Dashboard.

**Q11: What happens if the AI gives incorrect medical advice?**
**A:** The system prompt restricts the AI from making definitive medical diagnoses. The UI also presents clear visual disclaimers. The AI's purpose is exclusively *triage* (guiding them to the right specialist) and *drafting* (assisting the doctor who must ultimately review and approve the prescription).

---

### 5. Future Scope & Limitations
**Q12: What are the current limitations of your project?**
**A:** 
- The telemedicine video call interface is currently a frontend simulation and would require a dedicated WebRTC server (like LiveKit or Twilio) for full production capability.
- The AI relies on external LLM providers, meaning it requires an active internet connection to function.

**Q13: How would you scale this system in the future?**
**A:** 
- Migrate the SQLite database to a scalable cloud PostgreSQL instance (like Supabase or AWS RDS).
- Implement WebSockets (Socket.io) for live chat support between doctors and patients outside of video calls.
- Integrate a payment gateway (e.g., Stripe or Razorpay) for appointment booking fees.
- Integrate actual IoT devices to automatically update ICU bed availability.
