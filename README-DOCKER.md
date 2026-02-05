# This repository has Dockerfiles for the backend and frontend and a docker-compose.yml to run everything locally.

Quick start (PowerShell):

# Build and run both services
docker-compose up --build

# Build only backend image
docker build -t rtns-backend .
# Run backend
docker run -p 8080:8080 rtns-backend

# Build frontend image
cd frontend; docker build -t rtns-frontend .
# Run frontend
docker run -p 4200:80 rtns-frontend

Notes:
- The backend Dockerfile uses Maven to build a fat jar; Java 17 is used at runtime.
- The frontend uses Node 20 (alpine) for building and nginx for serving the built files.
- The provided docker-compose also includes an optional Postgres service for development. Update `application.properties` or environment variables to match DB credentials.

Security:
- The compose file exposes a Postgres password openly for convenience; don't use this in production.

If you want, I can:
- Add a Spring profile and application-dev.properties that point to the postgres container
- Make the frontend reverse-proxy requests to the backend (nginx config)
- Publish images to a registry with a GitHub Actions workflow


Running with the development profile (docker-compose)

The backend ships an `application-dev.properties` file that is configured to connect to the `db` service defined in `docker-compose.yml`.
To start the stack with that profile enabled use:

```powershell
# from repository root
docker-compose up --build
```

The backend will be available at http://localhost:8080 and the frontend at http://localhost:4200.

To run only the backend and have it use the dev DB container:

```powershell
# build backend image
docker build -t rtns-backend .
# run with spring profile dev and connect to the db network (compose creates a network automatically)
docker run --env SPRING_PROFILES_ACTIVE=dev --network "host" -p 8080:8080 rtns-backend
```

Note: On Windows `--network "host"` behaves differently; prefer using `docker-compose` to ensure containers can reach the `db` service by hostname `db`.
