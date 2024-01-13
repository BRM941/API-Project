# Reynold's Number API
Caclulates the Reynold's number of a fluid given the density, velocity, pipe diameter and dynamic viscosity in the HTTP request headers.

### Protected by API key authentication
Go to /request to receive an API key. The /reynolds branch will not respond with a number without a valid API key.

### Uses two different data base types
The API uses sqlite3 if the .env parameters for a mongoDB username, password, and cluster are not set. Otherwise it connects to a mongoDB cluster to store the api keys.

