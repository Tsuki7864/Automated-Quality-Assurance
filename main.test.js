function processAnimeData(apiResponse) {
    if (!apiResponse || typeof apiResponse !== 'object') {
        throw new Error("Invalid API payload");
    }
    return {
        id: apiResponse.id,
        title: apiResponse.title,
        score: apiResponse.mean || 0
    };
}

describe("Core Logic: API Data Processing", () => {
    test("SUCCESS: should successfully parse valid raw API data into normalized structure", () => {
        const sampleApiResponse = {
            id: 12345,
            title: "Attack on Titan",
            mean: 8.54,
            synopsis: "Some descriptive text we do not need..."
        };

        const result = processAnimeData(sampleApiResponse);

        expect(result).toHaveProperty("id", 12345);
        expect(result).toHaveProperty("title", "Attack on Titan");
        expect(result).toHaveProperty("score", 8.54);
        expect(result).not.toHaveProperty("synopsis"); 
    });

    test("ERROR: should throw an explicit error if the API payload is invalid or empty", () => {
        expect(() => processAnimeData(null)).toThrow("Invalid API payload");
        expect(() => processAnimeData("Not a JSON object")).toThrow("Invalid API payload");
    });
});

function isCacheValid(fetchedTimestamp, ttlMs) {
    if (typeof fetchedTimestamp !== 'number' || typeof ttlMs !== 'number') {
        throw new Error("Invalid timestamp or TTL configuration");
    }
    const currentTimestamp = Date.now();
    return (currentTimestamp - fetchedTimestamp) < ttlMs;
}

describe("Core Logic: Cache TTL Validation", () => {
    test("SUCCESS: should identify cache as valid if current time is within TTL window", () => {
        const fetchTimeInPast = Date.now() - 5000; // 5 seconds ago
        const ttlWindow = 60000; // 60 second TTL (1 minute)

        const isValid = isCacheValid(fetchTimeInPast, ttlWindow);

        expect(isValid).toBe(true);
    });

    test("SUCCESS: should identify cache as expired if current time exceeds TTL window", () => {
        const fetchTimeLongAgo = Date.now() - 70000; // 70 seconds ago
        const ttlWindow = 60000; // 60 second TTL

        const isValid = isCacheValid(fetchTimeLongAgo, ttlWindow);

        expect(isValid).toBe(false);
    });

    test("ERROR: should throw an error if configuration values are not numbers", () => {
        expect(() => isCacheValid("invalid-time", 60000)).toThrow("Invalid timestamp or TTL configuration");
        expect(() => isCacheValid(Date.now(), null)).toThrow("Invalid timestamp or TTL configuration");
    });
});

function interceptApiResponse(httpStatus) {
    if (httpStatus === 429) {
        return { error: true, code: 429, message: "Rate limit reached. Please try again later." };
    }
    if (httpStatus >= 400) {
        throw new Error(`Server returned fatal network status: ${httpStatus}`);
    }
    return { error: false, code: httpStatus, message: "Success" };
}

describe("Core Logic: API Rate-Limit Interception", () => {
    test("SUCCESS: should catch 429 status gracefully without throwing a system crash", () => {
        const networkResponse = interceptApiResponse(429);

        expect(networkResponse.error).toBe(true);
        expect(networkResponse.code).toBe(429);
        expect(networkResponse.message).toContain("Rate limit reached");
    });

    test("SUCCESS: should return standard success object for 200 HTTP status", () => {
        const networkResponse = interceptApiResponse(200);

        expect(networkResponse.error).toBe(false);
        expect(networkResponse.code).toBe(200);
    });

    test("ERROR: should throw a fatal exception for a 500 server breakdown error", () => {
        expect(() => interceptApiResponse(500)).toThrow("Server returned fatal network status: 500");
    });
});