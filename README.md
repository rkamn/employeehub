# Employeehub

This has been develop using new AI model available in the market
replit : https://replit.com/@study458458/WorkforceHub

This is a web based application for employee management with their attandance

EmployeeHub/
├── 📁 client/ # Frontend React Application
│ ├── index.html # Main HTML template
│ └── 📁 src/
│ ├── App.tsx # Main App component with routing
│ ├── main.tsx # React entry point
│ ├── index.css # Global styles & Tailwind
│ ├── 📁 components/
│ │ ├── add-employee-modal.tsx # Add new employee form
│ │ ├── attendance-clock.tsx # Clock in/out component
│ │ ├── delete-confirmation-modal.tsx # Delete confirmation
│ │ ├── employee-card.tsx # Employee display card
│ │ ├── header.tsx # Navigation header
│ │ └── 📁 ui/ # Shadcn UI components (50+ files)
│ │ ├── button.tsx
│ │ ├── card.tsx
│ │ ├── form.tsx
│ │ ├── input.tsx
│ │ └── ... (complete UI library)
│ ├── 📁 hooks/
│ │ ├── use-mobile.tsx # Mobile detection hook
│ │ └── use-toast.ts # Toast notifications
│ ├── 📁 lib/
│ │ ├── date-utils.ts # Date formatting utilities
│ │ ├── queryClient.ts # TanStack Query setup
│ │ └── utils.ts # General utilities
│ └── 📁 pages/
│ ├── dashboard.tsx # Main dashboard page
│ ├── employees.tsx # Employee directory
│ ├── employee-profile.tsx # Individual employee profile
│ ├── attendance.tsx # Attendance tracking
│ └── not-found.tsx # 404 page
│
├── 📁 server/ # Backend Express API
│ ├── index.ts # Server entry point
│ ├── routes.ts # API route handlers
│ ├── storage.ts # Database abstraction layer
│ └── vite.ts # Vite server integration
│
├── 📁 shared/ # Shared Type Definitions
│ └── schema.ts # Database schemas & validation
│
└── 📄 Configuration Files
├── package.json # Dependencies & scripts
├── package-lock.json # Dependency lock file
├── tsconfig.json # TypeScript configuration
├── vite.config.ts # Vite build configuration
├── tailwind.config.ts # Tailwind CSS configuration
├── postcss.config.js # PostCSS configuration
├── components.json # Shadcn UI configuration
├── drizzle.config.ts # Database ORM configuration
└── replit.md # Project documentation
