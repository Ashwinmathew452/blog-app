# AWS Blog App 🚀

## Project Description
AWS Blog App is a secure cloud-based blog management system developed using Node.js, Express.js, MySQL, and AWS EC2.

The application allows users to:
- Register accounts
- Login securely
- Create blog posts
- Edit blog posts
- Delete blog posts
- View all blog posts

The project demonstrates cloud deployment, authentication, database integration, and security implementation.

---

## Technologies Used
- Node.js
- Express.js
- MySQL
- AWS EC2
- GitHub
- HTML
- CSS
- bcrypt
- Helmet
- xss-clean
- express-rate-limit

---

## Features
### Authentication
- User Registration
- User Login
- Password Hashing using bcrypt

### Blog Management
- Create Posts
- Read Posts
- Update Posts
- Delete Posts

### Security
- SQL Injection Protection
- XSS Protection
- Security Headers using Helmet
- Rate Limiting

### Cloud Deployment
- AWS EC2 Deployment
- GitHub Version Control
- Cloud Monitoring using AWS CloudWatch

---

## Project Structure

```bash
blog-app/
│
├── routes/
├── views/
├── node_modules/
├── server.js
├── app.js
├── db.js
├── package.json
