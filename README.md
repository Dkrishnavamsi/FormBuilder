# **Form Builder**

A dynamic form builder application built using **React**, **TypeScript**, **Material UI (MUI)**, and **Redux**, with form schemas persisted in **localStorage**.  
This app allows users to create customizable forms, preview them in real-time, and save them for future use — all without a backend.

---

## 🚀 **Features**

### **Form Builder (/create)**

- Add dynamic fields:
  - **Text**, **Number**, **Textarea**, **Select**, **Radio**, **Checkbox**, **Date**
- Configure each field:
  - Label
  - Required toggle
  - Default value
  - Validation rules:
    - Not empty
    - Min/Max length
    - Email format
    - Password rules (min 8 chars, contains number)
- **Derived Fields**:
  - Auto-computed based on other fields
  - Define parent field(s) and formula/logic
- Reorder or delete fields
- Save form schema with:
  - Form name
  - Creation date
  - Stored in `localStorage` (schema only, not user inputs)

---

### **Form Preview (/preview)**

- Fully functional form as seen by end users
- Supports all configured validations
- Displays validation error messages
- Auto-updates derived fields as parent fields change

---

### **My Forms (/myforms)**

- List of all saved forms from `localStorage`
- Shows:
  - Form name
  - Date of creation
- Click to open form in **Preview** mode

---

## 🛠 **Tech Stack**

- **React + TypeScript**
- **Redux Toolkit** for state management
- **Material UI (MUI)** for UI components
- **LocalStorage** for persistence
- **React Router** for navigation

---

## 📂 **Project Structure**

```
src/
│── components/       # Reusable UI components
│── pages/            # Route-specific pages (/create, /preview, /myforms)
│── store/            # Redux slices & store config
│── types/            # TypeScript type definitions
│── utils/            # Utility functions (validation, derived fields, etc.)
│── App.tsx           # Route configuration
│── main.tsx          # App entry point
```

---

## ⚡ **Getting Started**

### **1. Clone the Repository**

```bash
git clone https://github.com/Dkrishnavamsi/FormBuilder.git
cd FormBuilder
```

### **2. Install Dependencies**

```bash
npm install
```

### **3. Run the Application**

```bash
npm run dev
```

App will be available at **`http://localhost:5173`**

---

## 📦 **Build for Production**

```bash
npm run build
```

---

## 🌐 **Deployment**

You can deploy this app on **Vercel**, **Netlify**, or any static hosting service.

Example (Vercel):

```bash
npm install -g vercel
vercel
```

---

## 📌 **Evaluation Criteria**

- Clean, modular, and extensible code
- Predictable and organized state management with Redux
- Strong type safety with TypeScript
- Proper handling of edge cases and validation errors
- Accurate preview with validations and derived fields
- Intuitive UI & UX

---

## 📝 **License**

This project is licensed under the MIT License.
