# Chat Application

A full‑stack real‑time chat application built with Next.js, NestJS, PostgreSQL, Prisma, and Socket.IO. This project includes user authentication, conversation management, real‑time messaging, and a clean UI.

---

## Features

* User authentication (signup & login) with form validation
* Real‑time messaging using Socket.IO
* Conversation creation (auto create-or-get between two users)
* Message history loading
* Responsive UI (mobile-friendly layout)
* Protected APIs with JWT
* Clean and scalable folder structure

---

### Project Documentation & Preview
 Preview Video: A walkthrough video demonstrating the app workflow:
👉 docs/preview.mp4

### Full Project Documentation
Detailed architecture, API details, DB schema, diagrams, and implementation notes:
👉 docs/Documentation.pdf

---

##  Technologies Used

### **Frontend**

* **Next.js 14 (App Router)**
* **Zustand** for global state
* **Axios** for API calls
* **Socket.IO Client**
* **TailwindCSS**, **ShadCn** for styling

### **Backend**

* **NestJS**
* **Prisma ORM**
* **PostgreSQL**
* **Socket.IO Gateway**
* **JWT Authentication**

---

## Setup Instructions

### **1. Clone the Repository**

```
git clone <https://github.com/BinuMDX/Chat-Application>
cd your-project
```

---

##  Backend Setup (NestJS)

Navigate into the backend directory:

```
cd backend
```

### **Install dependencies**

```
npm install
```

### **Configure Environment Variables**

Create a `.env` file:

```
DATABASE_URL="postgresql://username:password@localhost:5432/chatapp"
JWT_SECRET="your-secret"
```

### **Run Prisma migrations**

```
npx prisma migrate dev
```

### **Start the backend**

```
npm run start:dev
```

---

## Frontend Setup (Next.js)

Navigate into the frontend directory:

```
cd frontend
```

### **Install dependencies**

```
npm install
```

### **Create `.env.local` file**

```
NEXT_PUBLIC_API_URL="http://localhost:3033"
NEXT_PUBLIC_SOCKET_URL="http://localhost:3033"
```

### **Run the frontend**

```
npm run dev
```

Your app will now be running at: `http://localhost:3000`

---

## API Endpoints

### **Auth**

* `POST /auth/signup`
* `POST /auth/login`

### **Chat**

* `GET /chat/conversations`
* `POST /chat/conversations` → create or get existing
* `GET /chat/messages/:conversationId`
* `POST /chat/messages/:conversationId`

---

## Responsiveness

The UI is optimized for:

* Desktop
* Tablets
* Mobile (sidebar collapses, chat takes full width)

---

## Assumptions & Limitations

* Messages are **not encrypted** end‑to‑end.
* Only **one-to-one conversations** (no group chats).
* User list is assumed to come from authenticated backend.
* Socket reconnection assumes stable network.
* No file uploads (images, documents) yet.

---

## Future Improvements

* Group chats
* Typing indicators
* Message read receipts
* Image & file sharing
* Push notifications

---

## License

MIT
