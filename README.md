# Product Management Application

A modern Angular application for managing and displaying products. This application fetches data from the JSONPlaceholder API and presents it in a clean, user-friendly interface.

## Features

- Product listing with pagination
- Product details view
- Search and category filtering
- Responsive design
- Clean data presentation with loading states and error handling

## Tech Stack

- Angular 17+
- TypeScript
- RxJS for reactive programming
- Tailwind CSS for styling

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm (v8 or later)

### Installation

1. Clone the repository or download the source code
2. Navigate to the project directory:
   ```
   cd product-app
   ```
3. Install dependencies:
   ```
   npm install
   ```

### Running the Application

To start the development server:

```
npx ng serve
```

This will start the application on `http://localhost:4200/` by default. The application will automatically reload if you change any of the source files.

### Building for Production

To build the application for production:

```
npx ng build --prod
```

The build artifacts will be stored in the `dist/` directory.

## API Integration

This application uses the JSONPlaceholder API (`https://jsonplaceholder.typicode.com`) to fetch mock data, which is then transformed into product data.

## Project Structure

- `src/app/components/` - All application components
- `src/app/services/` - Services for API communication and data handling
- `src/app/models/` - Data models and interfaces

## Additional Commands

- Running tests: `npx ng test`
- Running linting: `npx ng lint`
- Running end-to-end tests: `npx ng e2e`

## Note

This is a demonstration application. In a production environment, you would want to:
- Implement proper authentication
- Add more comprehensive error handling
- Set up proper data validation
- Implement more advanced state management
