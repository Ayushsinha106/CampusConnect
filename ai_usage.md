# AI Usage Declaration and Clarification

## 1. Purpose

This document provides a transparent declaration of the use of AI assistance during the development of the CampusConnect full-stack web application.

AI tools were used as a development aid for selected parts of the project. The assistance was primarily used for understanding implementation approaches, generating or improving portions of code, debugging errors, reviewing existing code, and suggesting ways to structure features.

AI-generated suggestions were reviewed, adapted to the existing project architecture, tested, and modified where necessary rather than being used as an unchanged application-wide solution.

## 2. Areas Where AI Assistance Was Used

### Frontend

#### Components
AI assistance was used for parts of reusable React UI components and for improving component structure and presentation.

Examples:
- Suggestions for component structure and JSX.
- Improvements to UI behavior and conditional rendering.
- Debugging component state and display issues.

#### Pages
AI assistance was used selectively while implementing and improving application pages.

Examples:
- Suggestions for page structure and React state management.
- Event-related page implementation and modification.
- Filtering, sorting, pagination, loading, and error-state improvements.
- Debugging incorrect API response handling and rendering errors.

The suggested code was adapted to the existing application and its requirements.

#### API Services
AI assistance was used for parts of the frontend API service layer.

Examples:
- Structuring `fetch` requests.
- Authentication-token handling.
- API response and error handling.
- API helpers for events, categories, venues, registrations, reviews, and related features.

#### Routing and Application Setup
AI assistance was used when working with application routing and navigation.

Examples:
- Route organization.
- Role-based navigation.
- Dashboard links.
- Debugging navigation behavior.

### Backend

#### Entities
AI assistance was used while designing and reviewing some TypeORM entities and their relationships.

Examples:
- Entity structure suggestions.
- Relationships among users, events, categories, venues, registrations, companions, and reviews.
- Reviewing fields and database relationships.

The resulting entities were adjusted to match the project's actual database design.

#### Controllers and API Logic
AI assistance was used selectively for backend API implementation and debugging.

Examples:
- CRUD implementation suggestions.
- Request validation.
- Query construction.
- Error handling.
- Role-based authorization.
- Event creation, editing, deletion, registration, attendance, reviews, and event approval functionality.

Existing code was reviewed and modified according to project requirements.

#### Routes and Middleware
AI assistance was used for parts of route organization and authentication/authorization logic.

Examples:
- Express route structure.
- Connecting routes to controllers.
- Authentication middleware.
- Role-based access restrictions.

#### Database and Server Configuration
AI assistance was used as a reference while working with TypeORM, PostgreSQL, and Express configuration. The configuration was tested and adjusted for the actual project environment.

## 3. Nature of AI Assistance

The AI assistance used during development can broadly be described as:

- **Code suggestions:** Possible implementations for specific features or functions.
- **Debugging:** Help identifying causes of errors and possible fixes.
- **Code review:** Reviewing existing code and identifying inconsistencies or potential problems.
- **Architecture suggestions:** Discussing ways to organize pages, controllers, routes, and API calls.
- **Explanation:** Explaining implementation concepts and unfamiliar APIs.
- **Iteration:** Refining solutions after testing or changing requirements.

AI was therefore used as a development assistant rather than as a replacement for understanding, testing, and decision-making.

## 4. Approximate AI Contribution

The project guidelines require the contribution to be calculated using component weights and, for partially assisted components, an approximate percentage of AI involvement.

**Approximate AI contribution:** 
`
Frontend: (10)* 0.50[components] + (15)* 0.50[pages] + (5)* 0.50[services] + (5)* 0.50[Hooks] = 17.5%
`
`
Backend: (10)* 0.50[Entities] + (15)* 0.50[Controller] + (5)* 0.50[Routes] + (5)* 0.50[Middlewares] + (5)* 1.0[Utils] = 21.5%
`
`
Optional: 6* 0.50 (tsconfig file)= 3%
`

The percentage should be calculated from the actual components that received AI assistance. Partially assisted components should be counted proportionally rather than automatically being treated as completely AI-generated.

## 5. Human Contribution and Verification

AI-generated suggestions were not treated as automatically correct. Development involved:

- Deciding which features were required.
- Designing application functionality and workflows.
- Providing project-specific requirements and constraints.
- Reviewing suggested implementations.
- Integrating code with the existing project.
- Testing API requests and application behavior.
- Debugging errors encountered during development.
- Modifying solutions that did not match the project requirements.
- Making final decisions about the application's structure and behavior.

## 6. Tools Used

The primary AI tool used during development was:

- **ChatGPT**
- **Copilot**

AI assistance was used through conversational prompts for implementation discussions, debugging, code structure, and feature development.


# Prompt History

This section contains a record of the prompts and AI-assisted discussions used during the development of the CampusConnect project. The conversations covered implementation, debugging, architecture decisions, API design, database design, and documentation.

---

## 1. TypeScript Configuration Debugging

### Module / Feature
tsconfig.json

### Prompt Used

I was debugging TypeScript configuration and problems related to running the Express backend with TypeScript.

### AI Response Summary

The AI helped diagnose TypeScript configuration problems involving Node.js modules and the project's ESM setup.

The discussion covered issues such as:

- `module` and `moduleResolution`
- NodeNext / ESM configuration
- import paths
- TypeScript compilation errors
- `verbatimModuleSyntax`
- running TypeScript directly during development
- the relationship between `package.json` and `tsconfig.json`

The backend was configured so that TypeScript could be executed correctly in the Node.js environment.

### My Understanding / Modification

I learned that TypeScript's module configuration needs to match the Node.js module system being used.

I also understood why local imports may need `.js` extensions when using the NodeNext/ESM configuration even though the source files themselves are `.ts`.


---

### 2. Middlewares and Authentication

### Module / Feature
Authorization and Authentication

### Prompt Used
I was implementing authentication and authorization middlewares for the backend.

### AI Response Summary
The AI helped structure the authentication and authorization middlewares, explaining how to:
- Extract and verify JWT tokens from requests. 
- Check user roles for access control.


### My Understanding / Modification
I adapted the middleware to the CampusConnect requirements, ensuring that:
- JWT tokens are correctly extracted from the `Authorization` header.
- User roles are checked against the required roles for specific routes.


## 3. User Entity

### Module / Feature
User Entity

### Prompt Used

I was implementing the User entity and user-related backend functionality.

### AI Response Summary

The AI helped structure the TypeORM User entity and explained fields such as:

- ID
- name
- email
- password
- role
- etc

It also helped with the corresponding controller and API operations. After that I create other Entities based on this

### My Understanding / Modification

I adapted the entity to the CampusConnect requirements and used roles to distinguish:

- Student
- Organizer
- Admin

---

## 4. Event Filtering and Sorting

### Module / Feature
Event filtering and sorting

### Prompt Used

> this is how my event filter works but the problem is that we don't have visibility in our result object we have isPublic I tried something and it works for Public event but it doesn't show anything for college only

### AI Response / Discussion

The AI reviewed the frontend filtering and identified that the frontend was already using `event.isPublic`, but that the backend response and visibility filtering needed to be considered. The discussion also identified that the frontend could not display college-only events if the backend was returning only public events.

### Modification / Outcome

The event visibility logic was changed to distinguish between:

- Public events → `isPublic = true`
- College-only events → `isPublic = false`
- All events → no visibility restriction

Also we make the whole filtering and sorting logic on the backend so that the frontend can just display the results.



---

## 7. Declaration

I declare that AI assistance was used during the development of the CampusConnect project for selected implementation, debugging, explanation, and code-review tasks. AI-assisted portions were reviewed, modified, integrated, and tested during development.

The AI was used as a supporting development tool, while the final implementation decisions, integration, testing, and project-specific modifications were carried out during the development process.

