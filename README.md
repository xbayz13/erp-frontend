# ERP Frontend

Modern ERP system frontend built with Next.js 14 (App Router), providing comprehensive user interface for inventory, finance, production, and reporting modules.

## 🚀 Tech Stack

- **Framework**: Next.js 14.2 (App Router)
- **Language**: TypeScript
- **UI**: React 18.3
- **Charts**: Chart.js 4.4 + react-chartjs-2
- **Real-time**: Socket.IO Client
- **Data Fetching**: Custom hooks + SWR
- **Styling**: CSS Modules + Inline Styles

## 📦 Features

### Dashboard & Modules

1. **Main Dashboard** (`/`)
   - Real-time operational snapshot
   - KPI cards (Inventory, Procurement, Finance, Production)
   - Interactive charts (Top items, Financial health, PO status)
   - Real-time data updates via WebSocket

2. **Inventory Module** (`/inventory`)
   - Item management (Create, Read, Update)
   - Stock level monitoring
   - Low stock alerts
   - Warehouse management

3. **Purchasing Module** (`/purchasing`)
   - Purchase Order management
   - Supplier management
   - Purchase Requisition workflow
   - RFQ management

4. **Finance Module** (`/finance`)
   - Invoice management
   - Financial transactions
   - Multi-currency support
   - Budget & forecasting

5. **Production Module** (`/production`)
   - Production Order management
   - BOM management
   - Work Center & Routing
   - Quality Control

6. **Analytics Dashboard** (`/analytics`)
   - Advanced analytics with metrics
   - Interactive charts (Line, Bar, Doughnut)
   - Date range filtering
   - Trend analysis

7. **Custom Reports** (`/reports`)
   - Dynamic report builder
   - Entity-based reporting
   - Custom field selection
   - Export capabilities

8. **System Management** (`/system`)
   - Notifications management
   - Document management
   - Session management
   - Data import/export
   - Multi-language support
   - Integration management
   - Workflow management
   - Two-Factor Authentication setup

## 🔧 Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp env.example .env.local

# Configure environment variables
# Edit .env.local file with your API URL
```

## ⚙️ Configuration

Create a `.env.local` file in the frontend directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Optional: WebSocket URL (defaults to API URL)
NEXT_PUBLIC_WS_URL=ws://localhost:3000
```

## 🏃 Running the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm run start

# Lint
npm run lint
```

The application will be available at `http://localhost:3001` (default Next.js port).

## 🗂️ Project Structure

```
app/
├── (modules)/        # Feature modules
│   ├── analytics/    # Analytics dashboard
│   ├── finance/      # Finance module
│   ├── inventory/    # Inventory module
│   ├── production/   # Production module
│   ├── purchasing/   # Purchasing module
│   ├── reports/      # Reports module
│   └── system/       # System management
├── layout.tsx        # Root layout with navigation
└── page.tsx          # Main dashboard

components/           # Reusable UI components
├── DataTable.tsx
├── ItemForm.tsx
├── KpiCard.tsx
├── LoginPanel.tsx
├── Navigation.tsx
├── StatusPill.tsx
├── TwoFactorAuth.tsx
├── WorkflowManager.tsx
└── ...

lib/
├── services/         # API service layer
│   ├── api-client.ts
│   ├── analytics-service.ts
│   ├── auth-service.ts
│   ├── data-import-export-service.ts
│   ├── finance-service.ts
│   ├── i18n-service.ts
│   ├── integration-hub-service.ts
│   ├── inventory-service.ts
│   ├── production-service.ts
│   ├── purchasing-service.ts
│   ├── report-builder-service.ts
│   ├── reports-service.ts
│   ├── service-registry.ts
│   ├── system-service.ts
│   ├── types.ts
│   └── workflow-service.ts
├── hooks/            # Custom React hooks
│   └── use-realtime.ts
├── chart.ts          # Chart.js configuration
└── ...
```

## 🔐 Authentication

The frontend uses JWT token-based authentication. Tokens are stored in `localStorage` and automatically included in API requests.

### Login

Use the login form on the dashboard. The system requires valid credentials from the backend.

## 🎨 UI Components

### Reusable Components

- **KpiCard**: Display key performance indicators
- **DataTable**: Sortable, filterable data table
- **StatusPill**: Status indicators with color variants
- **Navigation**: Main navigation bar with active state
- **LoginPanel**: Authentication form
- **WorkflowManager**: Workflow creation and management
- **TwoFactorAuth**: 2FA setup and management

## 📊 Data Visualization

The application uses Chart.js for data visualization:

- **Bar Charts**: Top items, inventory distribution
- **Doughnut Charts**: Status distribution, financial breakdown
- **Line Charts**: Sales trends, time series data

## 🔄 Real-time Updates

Real-time data updates are provided via WebSocket (Socket.IO). The dashboard automatically refreshes when data changes.

## 📤 Data Import/Export

- **Export**: Download data as Excel files
  - Export Items
  - Export Customers
  - Download import templates

- **Import**: Upload Excel files to import data
  - Import Items
  - Import Customers

## 🌍 Multi-Language Support

The frontend supports multiple languages through the i18n service:
- English (en)
- Indonesian (id)

Language selection can be configured through the System Management page.

## 🔗 API Integration

All API calls go through the `ApiClient` class which handles:
- Token management
- Request/response formatting
- Error handling
- Base URL configuration

Services are organized by module and registered in `service-registry.ts` for easy access.

## 🛠️ Development

### Adding a New Page

1. Create page file in `app/(modules)/your-module/page.tsx`
2. Create service in `lib/services/your-service.ts`
3. Register service in `service-registry.ts`
4. Add navigation link in `components/Navigation.tsx`

### Adding a New Component

1. Create component file in `components/YourComponent.tsx`
2. Use TypeScript for type safety
3. Follow existing component patterns

### API Service Pattern

```typescript
import { ApiClient } from './api-client';

export class YourService {
  constructor(private readonly apiClient: ApiClient) {}

  async getData(): Promise<DataType[]> {
    return this.apiClient.get<DataType[]>('/your-endpoint');
  }

  async createData(data: CreateDto): Promise<DataType> {
    return this.apiClient.post<DataType>('/your-endpoint', data);
  }
}
```

## 🧪 Testing

```bash
# Run linting
npm run lint
```

## 📱 Responsive Design

The frontend is designed to be responsive and works on:
- Desktop browsers
- Tablets
- Mobile devices (limited features)

## 🔒 Security

- JWT token stored securely in localStorage
- Automatic token refresh handling
- Protected routes with authentication checks
- Session management

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3000/api` |
| `NEXT_PUBLIC_WS_URL` | WebSocket URL | Same as API URL |

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm run start
```

### Static Export (Optional)

For static hosting, you can configure Next.js to export static files. Note that this disables server-side features.

## 📄 License

Private project - All rights reserved

## 👨‍💻 Author

ERP Development Team

---

**Version**: 0.1.0  
**Last Updated**: 2024

