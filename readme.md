
# Weather Application Setup and Running Guide

## Overview
This document provides instructions on how to set up and run the weather application, which fetches weather data, calculates daily summaries, and provides forecasts for specified cities.

## Prerequisites
Before running the application, ensure you have the following installed on your machine:
- **Node.js** (version 12 or higher)
- **MongoDB** (either locally or a cloud instance like MongoDB Atlas)
- **npm** (Node Package Manager, comes with Node.js)

## Setup Instructions

### 1. Clone the Repository
Clone the repository to your local machine using Git:
```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Install Dependencies
Navigate to the project directory and install the required dependencies:
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root of your project directory and add the following variables:
```
MONGO_URI=<your_mongodb_connection_string>
OPENWEATHER_API_KEY=<your_openweathermap_api_key>
TEMPERATURE_THRESHOLD=35
CONSECUTIVE_UPDATES=2
PORT=5000
```
- Replace `<your_mongodb_connection_string>` with your MongoDB connection string.
- Replace `<your_openweathermap_api_key>` with your OpenWeatherMap API key.

### 4. Start the MongoDB Service
If you are using a local MongoDB instance, ensure that the MongoDB service is running. You can start it using:
```bash
mongod
```

### 5. Run the Application
```js
npm start
```


# Executing the Weather Application Using Docker

## Overview
This document provides instructions on how to execute the weather application locally using Docker. The application fetches weather data, calculates daily summaries, and provides forecasts for specified cities.

## Prerequisites
Before you begin, ensure you have the following installed on your machine:
- **Docker**: Follow the installation instructions for your operating system from the [official Docker documentation](https://docs.docker.com/get-docker/).

## Step 1: Pull the Docker Image (if not built locally)
If you haven't built the Docker image locally, you can pull it from Docker Hub. Open your terminal and run the following command:

```bash
docker pull sanjaybalam2003/weather-app:latest
```


### Step 2: Run the Docker Container with Inline Environment Variables

- Run the Docker container using the following command. This command maps port 5000 in the container to port 5004 on your host machine and sets the necessary environment variables inline:

```js
    docker run -p 5004:5000 \
  -e MONGO_URI=<your_mongodb_connection_string> \
  -e OPENWEATHER_API_KEY=<your_openweathermap_api_key> \
  -e TEMPERATURE_THRESHOLD=35 \
  -e CONSECUTIVE_UPDATES=2 \
  sanjaybalam2003/weather-app:latest
```

- Replace your Mongodb link, OPENWEATHER_API_KEY to run this application 

# Weather Application API Testing Guide

## Overview
This document provides instructions on how to test the API endpoints of the weather application. The application provides weather data, forecasts, and daily summaries for specified cities.

## Base URL
The base URL for the API is: http://localhost:5000/api


## Endpoints

### 1. Get Current Weather Data
**Endpoint:** `/weather`  
**Method:** `GET`  
**Query Parameters:**
- `city` (required): The name of the city for which to fetch the weather data.

**Example Request:**

http GET http://localhost:5000/api/weather?city=Delhi <br>


**Expected Response:**
- Status: `200 OK`
- Body: JSON object containing current weather data for the specified city.

### 2. Get Weather Forecast
**Endpoint:** `/forecast`  
**Method:** `GET`  
**Query Parameters:**
- `city` (required): The name of the city for which to fetch the weather forecast.

**Example Request:**

http GET http://localhost:5000/api/forecast?city=Delhi <br>


**Expected Response:**
- Status: `200 OK`
- Body: JSON array containing forecast data for the specified city.

### 3. Get Daily Summaries
**Endpoint:** `/visualize`  
**Method:** `GET`  
**Query Parameters:**
- `city` (required): The name of the city for which to fetch daily summaries.

**Example Request:**

http GET http://localhost:5000/api/visualize?city=Delhi <br>


**Expected Response:**
- Status: `200 OK`
- Body: JSON array containing daily summaries for the specified city.

## Testing with Postman
1. **Install Postman**: Download and install Postman from [Postman](https://www.postman.com/downloads/).
2. **Create a New Request**:
   - Open Postman and click on "New" to create a new request.
   - Select "GET" as the request type.
   - Enter the full URL for the endpoint you want to test (e.g., `http://localhost:5000/api/weather?city=Delhi`).
3. **Send the Request**: Click the "Send" button to send the request.
4. **View the Response**: Check the response section to see the status code and the returned data.

## Testing with curl
You can also test the API using `curl` from the command line.

### Example Commands:
1. **Get Current Weather Data**:
   ```bash
   curl "http://localhost:5000/api/weather"
   ```

2. **Get Weather Forecast**:
   ```bash
   curl "http://localhost:5000/api/forecast?city=Delhi"
   ```

3. **Get Daily Summaries**:
   ```bash
   curl "http://localhost:5000/api/visualize?city=Hyderabad"
   ```

## Error Handling
- If you do not provide a required query parameter (e.g., `city`), the API will respond with a `400 Bad Request` status and a message indicating that the parameter is required.
- If the specified city does not exist or there is an issue fetching data, the API will respond with a `404 Not Found` or `500 Internal Server Error` status.

## Conclusion
This guide provides a basic overview of how to test the API endpoints of your weather application. Ensure your server is running before making requests, and adjust the city names in the queries as needed to test different scenarios.
