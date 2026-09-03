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

**Approximate AI contribution:** `[TBD.]`

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

AI assistance was used through conversational prompts for implementation discussions, debugging, code structure, and feature development.

# Prompt History

The project guidelines require a chronological prompt history containing the prompts used, relevant AI response excerpts or summaries, and an explanation of how the responses were understood or modified.

The following format can be used for each entry.

## Prompt History Entry Template

### Module / Feature

`[Feature or module name]`

### Prompt Used

`[Insert the actual prompt used during development.]`

### AI Response Summary

`[Briefly describe the relevant suggestion or code provided by the AI.]`

### My Understanding / Modification

`[Explain what was understood, what was changed, and how the solution was adapted or tested.]`

## Example Entries

### Event Management / API Integration

**Prompt Used**

`[Insert the actual prompt used during development.]`

**AI Response Summary**

The AI suggested structuring the event API call around the fields expected by the backend and using the authenticated request when required.

**My Understanding / Modification**

I compared the suggestion with the existing backend controller and adjusted the request fields and authentication handling to match the actual API.

### Event Filtering and Sorting

**Prompt Used**

`[Insert the actual prompt used during development.]`

**AI Response Summary**

The AI reviewed the frontend filtering and sorting logic and explained how the backend API could perform search, filtering, sorting, and pagination through query parameters.

**My Understanding / Modification**

I changed the frontend to use backend query parameters instead of performing all filtering and sorting locally, and adjusted the API service function accordingly.

### Event Approval Workflow

**Prompt Used**

`[Insert the actual prompt used during development.]`

**AI Response Summary**

The AI suggested a separate pending-event workflow where organizer-created events are stored for administrator approval before becoming regular events.

**My Understanding / Modification**

I adapted the workflow to the project's role system and database structure. Organizers submit events for approval, while administrators review and approve or reject them.

### Debugging

**Prompt Used**

`[Insert the actual prompt used during development.]`

**AI Response Summary**

The AI helped analyze an error or unexpected behavior, identify the likely cause, and suggest a modification.

**My Understanding / Modification**

I tested the suggested change and modified the implementation where necessary to fit the existing codebase.

## 7. Declaration

I declare that AI assistance was used during the development of the CampusConnect project for selected implementation, debugging, explanation, and code-review tasks. AI-assisted portions were reviewed, modified, integrated, and tested during development.

The AI was used as a supporting development tool, while the final implementation decisions, integration, testing, and project-specific modifications were carried out during the development process.

The approximate contribution percentage will be determined using the component-weighting method specified in the project guidelines.

## Reference

This document follows the **AI Usage Quantification Guidelines for App Dev Lab Project**. The guidelines require students to identify AI-assisted components, estimate contribution using the provided component weights, and submit relevant chronological prompt history. They also explicitly state that prompt history should not be fabricated or unnecessarily r