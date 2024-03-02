# Node.js Task Management With Twilio automatic calling API

This repository contains the code for a Node.js Task Management API built with Express.js. The API provides endpoints to manage tasks and subtasks, including authentication.

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/mohitsolanki026/twilio-calling
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and define the following variables:
   ```plaintext
   JWT_SECRET=your_jwt_secret
   auth_token=your_auth_token
   account_sid=your_account_sid
   twilio_phone_number=your_twilio_phone_number
   url_to_twilio_xml=your_url_to_twilio_xml
   MONGO_URL=your_mongo_url
   PORT=your_port_number
   ```

## Usage

1. **Run the server:**

   ```bash
   npm start
   ```

2. **The API will be available at:** `http://localhost:3000`.

## API Endpoints

- `POST /user/auth`: Authenticate and get a JWT token.
- `POST /user/create-task`: Create a new task.
- `POST /user/create-subtask`: Create a new subtask.
- `GET /user/get-tasks`: Get tasks based on filters like priority and due date.
- `GET /user/get-subTask`: Get subtasks based on task ID and status.
- `PUT /user/update-task/:id`: Update a task by ID.
- `PUT /user/update-subTask/:id`: Update a subtask by ID.
- `DELETE /user/delete-task/:id`: Delete a task by ID.
- `DELETE /user/delete-subTask/:id`: Delete a subtask by ID.

## Request Bodies and Parameters

1. **POST /auth**:

   - `phone_number`: String representing the user's phone number.

2. **POST /create-task**:

   - `title`: String representing the title of the task.
   - `description`: String representing the description of the task.
   - `due_date`: Date representing the due date of the task.

3. **POST /create-subtask**:

   - `task_id`: String representing the ID of the task for which the subtask is being created.

4. **GET /get-tasks**:

   - Query Parameters:
     - `page` (optional): Number representing the page number for pagination (default is 1).
     - `limit` (optional): Number representing the maximum number of tasks to return per page (default is 10).
     - `priority` (optional): String representing the priority of the tasks.
     - `due_date` (optional): Date representing the due date of the tasks.

5. **GET /get-subTask**:

   - Query Parameters:
     - `page` (optional): Number representing the page number for pagination (default is 1).
     - `limit` (optional): Number representing the maximum number of subtasks to return per page (default is 10).
     - `task_id` (optional): String representing the ID of the task to filter subtasks.
     - `status` (optional): Number representing the status of the subtasks.

6. **PUT /update-task/:id**:

   - Request Body:
     - `due_date`: Updated due date of the task.
     - `status`: Updated status of the task.

7. **PUT /update-subTask/:id**:

   - Request Body:
     - `status`: Updated status of the subtask (`0` for incomplete, `1` for complete).

8. **DELETE /delete-task/:id**:

   - Path Parameter:
     - `id`: String representing the ID of the task to be deleted.

9. **DELETE /delete-subTask/:id**:
   - Path Parameter:
     - `id`: String representing the ID of the subtask to be deleted.

## Controllers and Middleware

- `user.controller.js`: Contains controller functions for user-related operations.
- `user.auth.js`: Middleware for user authentication.

## Models

- `user.model.js`: Model for user data.
- `task.model.js`: Model for tasks.
- `subTask.model.js`: Model for subtasks.

## Validation

- `task.validation.js`: Validation schema for task creation.

Feel free to contribute by opening issues or pull requests. Thank you!
