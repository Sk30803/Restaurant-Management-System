# Gourmet Flow - Full-Stack Restaurant Management System

Gourmet Flow is a full-stack web application designed to streamline restaurant operations, integrating a Node.js/Prisma backend with a reactive Tailwind-styled frontend to deliver a complete digital hospitality experience.

## 📑 Project Structure & Documentation
This project is structured as a monorepo to maintain a clean separation between the API logic and the user interface:

*   **[Frontend Implementation](frontend.md):** Built with React + Vite. Focuses on Component Architecture, Global State Management, and API Integration.
*   **[Backend Implementation](./backend/README.md):** Built with Node.js + Express + Prisma. Focuses on RBAC Security, State Machines, and Relational Database Integrity.

## 🛠️ Tech Stack
*   **Frontend:** React 18 (Vite), Tailwind CSS, Lucide Icons, Axios.
*   **Backend:** Node.js, Express.js, PostgreSQL, Prisma ORM.
*   **Security:** JWT (JSON Web Tokens), Bcrypt password hashing, Server-side Token Blacklisting.
*   **Testing:** Jest & Supertest (Integration and Unit testing).

## 👥 Team Members (Group 8)
*   **Rohan Riaz (26916)** 
*   **Zain Sharjeel (26922)** 
*   **Sahil Kumar (27149)** 

## 🤝 Team Contributions
The project was developed collaboratively with a focus on modular ownership:
*   **Rohan Riaz:** Responsible for the implementation of the **Table Reservations Workflow**. Handled the database schema design, documentation and API design.
*   **Zain Sharjeel(UI/UX Lead):** Responsible for the implementation of the **Online Ordering Workflow**. Provided the main UI design and theme. Helped with testing.
*   **Sahil Kumar:** Implemented the **Catering & Event Planning Workflow**. Helped with ensuring smooth integration of the frontend and backend.

## ✅ Core Workflows Implemented
1.  **Table Reservations & Pre-Orders:** Interactive visual floor plan with **2-hour collision validation** and an integrated pre-order menu system.
2.  **Online Ordering (Delivery/Takeaway):** Multi-step cart and checkout flow with fulfillment type selection and mock payment gateway integration.
3.  **Catering & Event Planning:** Specialized logic for high-volume bookings featuring a **Price-per-Head calculation engine** and administrative approval pipelines.