function waitForMongo() {
    let isReady = false;
    const maxRetries = 10;
    const interval = 1000;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const result = db.runCommand({ ping: 1 });
            if (result.ok === 1) {
                print(`MongoDB is ready after ${attempt} attempt(s)`);
                isReady = true;
                break;
            }
        } catch (e) {
            print(`Attempt ${attempt}: MongoDB not ready, retrying...`);
        }
        sleep(interval);
    }

    if (!isReady) {
        throw new Error("MongoDB not ready after maximum retries");
    }
}

function initiateReplicaSet() {
    try {
        waitForMongo();

        const hostname = db.runCommand({ hostInfo: 1 }).system.hostname;
        const result = rs.initiate({
            _id: "rs0",
            members: [{ _id: 0, host: hostname + ":27017" }]
        });
        print("Replica set initiated:", JSON.stringify(result));
    } catch (e) {
        print("Replica set already initialized or failed:", e.message);
    }
}

initiateReplicaSet();
