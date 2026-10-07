# Task Manager

A full-stack task management web application built with **Spring Boot** and **React**.

Users can create projects, manage project members, create and assign tasks, and track their progress.

## Screenshots

### HomePage

![HomePage](./Documentation/screenShots/homepage.png)

### Task Dashboard

![Task Dashboard](./Documentation/screenShots/taskDashboard.png)

### Add New Task

![Add New Task](./Documentation/screenShots/addNewTask.png)


## Tech Stack

**Backend**

* Java
* Spring Boot
* Spring Security
* Spring Data JPA / Hibernate
* Maven

**Frontend**

* React
* Vite
* JavaScript

**Database**

* PostgreSQL
* [Neon](https://neon.tech/) — remote PostgreSQL database

## Project Structure

```text
grad-prep-01-task-manager/
├── backend/
│   └── task-manager-backend/
│       ├── src/
│       │   └── main/java/com/yaman/task_manager_backend/
│       │       ├── config/
│       │       ├── controller/
│       │       ├── dto/
│       │       ├── exception/
│       │       ├── mapper/
│       │       ├── model/
│       │       ├── repository/
│       │       ├── security/
│       │       └── service/
│       └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   └── pages/
│   └── package.json
│
└── Project Documentation/
    ├── Software Requirements Specification.docx
    ├── User Stories.docx
    └── Task manager ERD.png
```

## Documentation

The **Project Documentation** folder contains:

* **Software Requirements Specification (SRS)** — system requirements and functionality.
* **User Stories** — user requirements and expected system behavior.
* **ERD** — database entities and relationships.

## Running the Project

### Backend

```bash
cd backend/task-manager-backend
./mvnw spring-boot:run
```

Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The backend uses the project's **remote Neon PostgreSQL database**.
