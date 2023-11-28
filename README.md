# Test assignment 3205.team November 2023

## [Demo here]()

## Deploy commands:

Build frontend:

```sh
npm run build
```

Start server (frontend + backend) on localhost:4173:

```sh
npm start
```

Start dev server (frontend + backend) on localhost:5173:

```sh
npm run dev
```

Assignment:

### Frontend:

SPA with form that have two fields: email (required) and number (optional), and submit button.

Requirements:

- If request was repeated before it finished, abort that request and send new request
- Add mask on number field in format: 00-00-00
- Validation
- React

### Backend:

Find users from JSON-file by given from frontend email and/or number.

Requirements:

- Imitate 5 seconds delay
- Validation
- Node.js (with TypeScript)
