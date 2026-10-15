
# PrepPath — Your Exam Companion

PrepPath is a full-stack exam preparation application designed to help students organize their study topics and prepare for exams through a centralized dashboard.

## Features

- Dashboard displaying the total number of study topics.
- Create topics with a name and description.
- View topics retrieved from the database.
- Edit existing topics.
- Delete topics with confirmation.
- Search topics by name or description.
- Persistent topic storage using MySQL.

## Technology Stack

### Frontend
- React
- Vite
- JavaScript
- CSS
- Lucide React icons

### Backend
- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA
- Maven

### Database
- MySQL 8

## Project Structure

```text
PrepPath/
├── preppath/
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/com/preppath/preppath/
│           │   ├── config/
│           │   ├── controller/
│           │   ├── entity/
│           │   ├── repository/
│           │   └── service/
│           └── resources/
│               └── application.properties
├── preppath-ui/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## Prerequisites

Install the following before running the project:

- Java Development Kit (JDK) 21
- Apache Maven
- Node.js and npm
- MySQL Server 8
- Git

## Database Setup

1. Start MySQL Server.
2. Create the database:

```sql
CREATE DATABASE preppath;
```

3. Configure your local database connection in:

`preppath/src/main/resources/application-local.properties`

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/preppath
spring.datasource.username=root
spring.datasource.password=YOUR_LOCAL_PASSWORD
```

Replace `YOUR_LOCAL_PASSWORD` with your own MySQL password. Never commit this local file or publish database credentials.

The main `application.properties` imports the optional local configuration file. Keep `application-local.properties` excluded through `.gitignore`.

## Running the Backend

Open a terminal at the backend directory:

```bash
cd preppath
mvn spring-boot:run
```

The backend runs at:

`http://localhost:8080`

## Running the Frontend

Open another terminal at the frontend directory:

```bash
cd preppath-ui
npm install
npm run dev
```

Open the local URL displayed by Vite, usually:

`http://localhost:5173`

Keep both applications running while using the dashboard.

## REST API

Base URL: `http://localhost:8080/api/topics`

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/topics` | Retrieve all topics |
| GET | `/api/topics/{id}` | Retrieve one topic |
| POST | `/api/topics` | Create a topic |
| PUT | `/api/topics/{id}` | Update a topic |
| DELETE | `/api/topics/{id}` | Delete a topic |

### Example: Create a Topic

```bash
curl -X POST http://localhost:8080/api/topics ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Indian Polity\",\"description\":\"Study of the Indian Constitution\"}"
```

The command above uses Windows Command Prompt syntax.

## Current Status

The current implementation supports topic creation, listing, editing, deletion, and frontend search.

Mock tests, study-session tracking, performance analytics, and user authentication are planned for future development and are not yet complete.

## Future Improvements

- User registration and authentication
- Subject and topic organization
- Study-session tracking
- Mock tests and automatic scoring
- Performance analytics
- Improved validation and error handling
- Automated backend and frontend tests

## Repository

GitHub: https://github.com/srikar545/PrepPath
