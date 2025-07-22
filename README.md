
# 🧠 AI Document Chat Application

A full-stack AI-powered document Q\&A web application built with **Next.js 15**, **Google AI (Gemini 2.0 Flash)**. Users can upload PDF documents, view intelligent summaries, and ask contextual questions in a real-time chat interface.

---

## 🚀 Features

* **📄 PDF Document Upload**: Drag-and-drop or browse file upload
* **🧠 AI-Powered Summarization**: Context-aware summaries of uploaded PDFs using Gemini AI
* **💬 Chat Interface**: Ask questions with full conversation history support
* **⏱️ Real-Time Responses**: Streamed answers with live loading indicators
* **⚠️ Error Handling**: Graceful error messages and recovery flows
* **📱 Responsive UI**: Clean, mobile-friendly design built with Tailwind CSS and `shadcn/ui`

---

## 🏗️ Architecture Overview

### **Frontend (Next.js 15)**

* **Framework**: App Router with server actions
* **Styling**: Tailwind CSS + `shadcn/ui` (Radix UI-based)
* **PDF Processing**: `PDF.js` for client-side text extraction
* **State Management**: React hooks and context
* **Type Safety**: TypeScript + Zod

### **Backend ( Google AI)**

* **AI Orchestration**: Firebase Genkit pipelines
* **LLM Provider**: Google Gemini 2.0 Flash
* **APIs**: Server Actions for endpoints and processing
* **Secure Access**: API key stored and used only on server

---

## 🔑 Key Components

### 1. 🗂️ Document Processing Flow

* Accepts PDF as base64 or `File` object (via client)
* Uses `PDF.js` to extract raw text on the client
* Sends text to backend Genkit pipeline
* Generates and returns:

  * **Summaries** (semantic + bullet points)
  * **Metadata** (e.g., page count)

### 2. ❓ Question Answering Flow

* Receives user query + document text + chat history
* AI generates accurate, grounded response via Gemini
* Maintains conversational context across turns

### 3. 💻 Chat Interface

* User-driven interactions
* Bubbles for AI and user messages
* Typing animations and loading indicators
* Reset button to clear document and chat session

---

## 📁 Project Structure

```
ai-doc-chat-app/
├── frontend/               # Next.js 15 app
│   ├── app/                # App Router structure
│   ├── components/         # Reusable UI components
│   ├── lib/                # Utility and PDF handling
│   ├── actions/            # Server actions
│   └── styles/             # Tailwind + global styles
├── genkit/                 # Firebase Genkit pipelines
│   ├── flows/              # AI summarization and Q&A logic
│   └── plugins/            # Gemini plugin config
├── public/                 # Static assets
├── .env                    # API keys and secrets
└── README.md
```

---

## 🛠️ Technology Stack

| Category       | Tech Used                            |
| -------------- | ------------------------------------ |
| Frontend       | Next.js 15, React, TypeScript        |
| Styling        | Tailwind CSS, shadcn/ui, Radix UI    |
| PDF Processing | PDF.js (client-side)                 |
| AI Platform    | Firebase Genkit, Google Gemini Flash |
| Validation     | Zod (schema validation)              |
| Forms          | React Hook Form                      |
| Dates/Utils    | date-fns                             |

---

## ⚙️ Setup & Installation

### ✅ Prerequisites

* Node.js `v18+`
* Google AI API key (Gemini 2.0)
* Firebase Genkit CLI installed

### 🧑‍💻 Local Installation

```bash
git clone https://github.com/follow-prince/ai-doc-chat-app.git
cd ai-doc-chat-app

# Install frontend dependencies
cd frontend
npm install

# Install backend (Genkit) dependencies
cd ../genkit
npm install
```

### 🌐 Environment Configuration

Create a `.env` file in both `frontend/` and `genkit/` directories:

```env
# frontend/.env
NEXT_PUBLIC_GENKIT_API_URL=http://localhost:4000
```

```env
# genkit/.env
GOOGLE_API_KEY=your_google_api_key_here
```

---

## 🏁 Running the App Locally

### Start Genkit Backend

```bash
cd genkit
genkit dev
```

> Genkit UI: [http://localhost:4000](http://localhost:4000)

### Start Frontend

```bash
cd frontend
npm run dev
```

> App: [http://localhost:9002](http://localhost:9002)

---

## 🎯 Usage Guide

### 📄 Upload Process

1. Drag-and-drop or click to upload PDF
2. Text is extracted client-side using `PDF.js`
3. Summary is generated using Gemini
4. Chat interface becomes active

### 💬 Chat Interaction

* Type any question based on the document
* Answers appear in real-time with typing animation
* Context is preserved throughout the session
* Click **Reset** to upload a new document

---

## 🔧 Feature Breakdown

### ✅ PDF Text Extraction

* Extracts content using `PDF.js`
* Cleaned and passed to backend for semantic use

### ✅ AI-Powered Summarization

* Gemini AI generates:

  * Key points
  * Overview
  * Summary tags

### ✅ Question Answering

* Maintains chat memory
* Resilient to vague or ambiguous queries

---

## 🔐 Security & Edge Handling

| Area             | Implementation                               |
| ---------------- | -------------------------------------------- |
| API Key Security | Server-only usage (not exposed to client)    |
| File Validation  | Client-side + Zod type validation            |
| Format Checks    | Only PDF allowed (MIME + extension check)    |
| Error Handling   | Comprehensive error boundaries and UI alerts |

---

## 🚀 Deployment

The app is designed for Firebase Hosting:

* Use Genkit's hosting integration to deploy backend
* Deploy frontend using Firebase Hosting or Vercel

```bash
cd frontend
npm run build
```


---

## 📊 Performance Considerations

* ✅ Client-side text parsing offloads backend
* ✅ Streaming responses for better UX
* ✅ Optimized Tailwind build and minimal dependencies
* ✅ State is co-located per route for performance

---

## 🧪 Development & Scripts

| Script            | Description                 |
| ----------------- | --------------------------- |
| `npm run dev`     | Run app in development mode |
| `genkit dev`      | Start Genkit backend + UI   |
| `npm run build`   | Production frontend build   |
| `firebase deploy` | Deploy to Firebase          |

---

## 📝 Technical Specifications

| Specification     | Value                           |
| ----------------- | ------------------------------- |
| Next.js Version   | `15.3.3`                        |
| Node.js Target    | `ES2017`                        |
| TypeScript Mode   | `strict`                        |
| CSS Framework     | Tailwind CSS                    |
| Component Library | shadcn/ui + Radix UI Primitives |

---
