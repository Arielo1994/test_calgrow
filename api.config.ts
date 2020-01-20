export const apiConfig = {
    development: {
        authUrl: "https://dashboard.calgrow.cl/auth/",
        apiUrl: "https://dashboard.calgrow.cl/db/",

    },
    test: {
        authUrl: "https://dashboard.calgrow.cl/auth/",
        apiUrl: "https://dashboard.calgrow.cl/db/",

    },
    production: {
        authUrl: "3.212.121.127:3000/auth/",
        apiUrl: "3.212.121.127:3002/db/",

    },
    weather: {
        apiUrl: "https://api.openweathermap.org/data/2.5/",
        apiKey: "1bc23c3d8b48169e639890f55d76f0f7"
    }
}