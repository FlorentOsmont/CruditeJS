# CruditeJS

A React library for building CRUD tables with filtering and pagination capabilities.

![Demo of CruditeJS table](demo.png)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/crudites-js.git
cd crudites-js
```

2. Install dependencies:
```bash
npm install
```

3. Build the library:
```bash
npm run build
```

4. Link the library for local development:
```bash
npm link
```

5. In your project directory, link to the library:
```bash
cd your-project
npm link crudites-js
```

## Quick Start

```jsx
import { Crudite } from "crudites-js";

const config = {
  apiUrl: "your-api-endpoint",
  pagination: { limit: 10, offset: 0 },
  columns: [
    { key: "id", label: "ID", type: "text", visible: true },
    { key: "name", label: "Name", type: "text", visible: true },
  ]
};

function App() {
  return <Crudite config={config} />;
}
```

## Features

- Dynamic table with pagination
- Advanced filtering (text, date range, boolean, multiple choice)
- Customizable via Tailwind CSS
- CRUD actions

## Development

1. Start the development build:
```bash
npm run dev
```

2. When making changes to the library while developing your main project:
```bash
# In the library directory
npm run build

# The changes will automatically be reflected in your linked project
```

## Complete Example

Here's a comprehensive example showing all available features:

```jsx
"use client";

import React from "react";
import { Crudite } from "crudites-js";

const cruditeConfig = {
  apiUrl: "http://127.0.0.1:8000/api/animals/",
  pagination: { limit: 10, offset: 0 },
  columns: [
    // Basic text column
    { 
      key: "id", 
      label: "ID", 
      type: "text", 
      visible: true 
    },
    
    // Text column with search filter
    { 
      key: "name", 
      label: "Name", 
      type: "text", 
      visible: true,
      filter: "text" 
    },
    
    // Date column with range filter
    { 
      key: "birth_date", 
      label: "Birth Date", 
      type: "date", 
      visible: true, 
      filter: "dateRange", 
      value: { start: "", end: "" } 
    },
    
    // Multiple choice filter
    { 
      key: "gender", 
      label: "Gender", 
      type: "text", 
      visible: true, 
      filter: "choices", 
      choices: ["M", "F"] 
    },
    
    // Boolean filter
    { 
      key: "active", 
      label: "Active", 
      type: "boolean", 
      visible: true, 
      filter: "bool" 
    },
    
    // Custom choices
    { 
      key: "size", 
      label: "Size", 
      type: "text", 
      visible: true, 
      filter: "choices", 
      choices: ["Small", "Medium", "Large"] 
    },
    
    // Actions column (edit, delete buttons)
    { 
      key: "actions", 
      label: "Actions", 
      type: "actions", 
      visible: true 
    },
  ],
};

function App() {
  return (
    <div className="w-[80%] h-[70%] p-5 bg-gray-100 rounded">
      <Crudite config={cruditeConfig} />
    </div>
  );
}

export default App;
```

## Column Types

- `text`: Simple text field
- `date`: Date field with optional range filter
- `boolean`: Boolean field with true/false filter
- `choices`: Field with predefined choices
- `actions`: Action buttons column

## Contributing

Feel free to open issues and pull requests!

## License

MIT