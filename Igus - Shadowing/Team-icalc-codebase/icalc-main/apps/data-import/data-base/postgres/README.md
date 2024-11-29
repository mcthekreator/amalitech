# Icalc postgres db

### You can create and view a database instance in a docker container following these steps:

Optional: Copy icalc dump sql into a new folder named data and rename it to 'icalc.sql'

    .
    ├── data                                # create new
    │   └── icalc.sql                       # copy and rename
    ├── env
    │   └── postgres.env
    ├── docker-compose.yml
    └── README.md

Use docker compose to create the images and build the containers:

Execute

```bash
docker-compose up
```

After the container for the database is up and running it automatically executes the icalc.sql. (If available)

Once the containers and the execution of the sql dump is finished you can view the DB with the adminer tool by accessing it on localhost:8080

Use the user and password defined inside the .env file to navigate through the tables and

Before running the migration change the local IP 127.0.0.1 in the flyway.conf file to the IP address of your machine
