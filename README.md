# Personal Portfolio with Express and Supabase

This project is a personal portfolio website built with Node.js, Express, EJS, and Supabase. It includes an admin dashboard for managing content dynamically.

## Features

- **Dynamic Content Management**: Edit all portfolio content through an admin dashboard
- **Authentication**: Secure admin access with authentication
- **Responsive Design**: Maintains the original responsive design
- **Blog System**: Create, edit, and delete blog posts
- **Projects Portfolio**: Showcase your work with detailed project pages
- **Services Section**: Display your service offerings
- **Contact Form**: Collect and manage contact submissions

## Setup Instructions

### 1. Install Dependencies

All required dependencies have been installed. If you need to reinstall them:

```bash
npm install
```

### 2. Set Up Supabase

1. Create a Supabase account at [https://supabase.com](https://supabase.com)
2. Create a new project in Supabase
3. Go to SQL Editor and run the SQL queries from `supabase-schema.sql`
4. Get your Supabase URL and anon key from Project Settings > API

### 3. Create Environment Variables

Create a `.env` file in the root directory with the following content:

```
PORT=3000
NODE_ENV=development
SESSION_SECRET=your_session_secret_here
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_anon_key_here
```

### 4. Start the Server

```bash
node server.js
```

The application should now be running at [http://localhost:3000](http://localhost:3000)

## Admin Access

- **URL**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Default Email**: admin@example.com
- **Default Password**: password123

*Change these credentials immediately after first login!*

## Project Structure

```
server/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middleware/     # Express middleware
├── public/         # Static assets
│   └── assets/     # Images, CSS, JS
│       ├── css/    # Stylesheets
│       ├── js/     # JavaScript files
│       └── images/ # Image files
├── routes/         # Express routes
└── views/          # EJS templates
    ├── admin/      # Admin dashboard views
    ├── auth/       # Authentication views
    ├── partials/   # Reusable template parts
    └── layouts/    # Layout templates
```

## Customization

### Styling

- Admin dashboard styles: `server/public/assets/css/admin.css`
- Auth page styles: `server/public/assets/css/auth.css`
- Main site styles: Original CSS files in `server/public/assets/css/`

### Views

- Modify EJS templates in the `server/views` directory to customize the layout and content

## Deployment

For production deployment:

1. Set `NODE_ENV=production` in your environment variables
2. Use a process manager like PM2: `pm2 start server.js --name "portfolio"`
3. Set up a reverse proxy with Nginx or similar

## Security Notes

- Update the default admin password immediately after first login
- Keep your Supabase credentials secure
- Consider enabling RLS (Row Level Security) in Supabase for production

## License

This project is licensed under the MIT License.
