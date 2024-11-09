const dev = {
    API_KEY: "EV4KG3C-KTWMB96-G8REDF9-JF88AAR",
    API_URL: process.env.REACT_APP_API_URL || "https://staging.api.relay.mvxchange.com",
    PUBLIC_FINCRA_API_KEY: "pk_test_NjM4NzdhYzZkOGI0NTNhYjg3YmEyYTQ1OjoxMjUyODY=",
    PUBLIC_PAYSTACK_API_KEY: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY_DEV,
    GOOGLE_API_KEY: "AIzaSyDrnnF7pToY6bYN2a3TWZvOaiaVRk9qBqg",
    BASE_URL: "https://dev.mcb.mvxchange.com",
    FB: {
        apiKey: "AIzaSyAbLIqCPBlO-wo4wqxWQDBO5UW6CsadTf4",
        authDomain: "mvxchange-fb-staging.firebaseapp.com",
        databaseURL: "https://mvxchange-fb-staging.firebaseio.com",
        projectId: "mvxchange-fb-staging",
        storageBucket: "mvxchange-fb-staging.appspot.com",
        messagingSenderId: "191408714565",
        appId: "1:191408714565:web:15e9031971dab0e049c42c",
        measurementId: "G-05CYFCGZZ5",
    },
    NGN_TRANSACTION_PERCENTAGE_RATE: 0.035,
    NGN_TRANSACTION_FEE_CAP: 5000,
};

const local = {
    API_KEY: "EV4KG3C-KTWMB96-G8REDF9-JF88AAR",
    API_URL: process.env.REACT_APP_API_URL || "https://staging.api.relay.mvxchange.com",
    PUBLIC_FINCRA_API_KEY: "pk_test_NjM4NzdhYzZkOGI0NTNhYjg3YmEyYTQ1OjoxMjUyODY=",
    PUBLIC_PAYSTACK_API_KEY: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY_DEV,
    GOOGLE_API_KEY: "AIzaSyDrnnF7pToY6bYN2a3TWZvOaiaVRk9qBqg",
    BASE_URL: "http://localhost:3000",
    FB: {
        apiKey: "AIzaSyAbLIqCPBlO-wo4wqxWQDBO5UW6CsadTf4",
        authDomain: "mvxchange-fb-staging.firebaseapp.com",
        databaseURL: "https://mvxchange-fb-staging.firebaseio.com",
        projectId: "mvxchange-fb-staging",
        storageBucket: "mvxchange-fb-staging.appspot.com",
        messagingSenderId: "191408714565",
        appId: "1:191408714565:web:15e9031971dab0e049c42c",
        measurementId: "G-05CYFCGZZ5",
    },
    NGN_TRANSACTION_PERCENTAGE_RATE: 0.035,
    NGN_TRANSACTION_FEE_CAP: 5000,
};

const prod = {
    API_KEY: "M4C0F2Q-5E24DEK-KV671VN-GFBE17Z",
    API_URL: "https://api.relay.mvxchange.com",
    PUBLIC_FINCRA_API_KEY: "pk_NjM4NzdhYzRkMGNkNjMzZmUzZjQyYzQ1OjoxODkxMzk=",
    PUBLIC_PAYSTACK_API_KEY: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY_PROD,
    GOOGLE_API_KEY: "AIzaSyDrnnF7pToY6bYN2a3TWZvOaiaVRk9qBqg",
    BASE_URL: "https://fleetplus.io",
    FB: {
        apiKey: "AIzaSyBsksT0LHGaG3yjvoldK79Z9cGd7ILBj8M",
        authDomain: "mvxchange-fb.firebaseapp.com",
        databaseURL: "https://mvxchange-fb.firebaseio.com",
        projectId: "mvxchange-fb",
        storageBucket: "mvxchange-fb.appspot.com",
        messagingSenderId: "609366678845",
        appId: "1:609366678845:web:7553549ca2ec41d869b954",
        measurementId: "G-6NSCPCT4NB",
    },
    NGN_TRANSACTION_PERCENTAGE_RATE: 0.035,
    NGN_TRANSACTION_FEE_CAP: 5000,
};

const config =
    process.env.REACT_APP_STAGE === "production"
        ? prod
        : process.env.REACT_APP_STAGE === "local"
        ? local
        : dev;

export default config;
