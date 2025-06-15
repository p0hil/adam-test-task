## Adam test task

### Just run the following commands
```
docker-compose up mongo -d
docker exec -it painter-mongo mongosh /mongo-init/init.js // Need to run once to init RS
docker-compose up -d
```

It will be available on http://localhost:5173


P.S. Proper error handling and generic response types are not implemented, 
but it’s more than enough for the test task.

