## Adam test task

### Just run the following commands
```
docker-compose up mongo -d
docker exec -it painter-mongo mongosh /mongo-init/init.js // Need to run once to init RS
docker-compose up -d
```

It will be available on http://localhost:5173

Painters: 
alice@example.com / password
bob@example.com / password
charlie@example.com / password

Customer:
john@example.com / password


P.S. Proper error handling, generic response types, test and etc are not implemented, 
but it’s more than enough for the test task.

