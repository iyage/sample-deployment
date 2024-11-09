# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


<!-- Current location firebase call for movement -->
<!-- Check all firebase calls are unsubscribed like that of latestLocations-->
<!-- Check for bugs on the chat page -->
<!-- Add `Every data collected and stored on Fleet+ is governed by and in compliance with GDPR Policies` on delete Account -->
<!-- Add timer and resend otp to delete account flow -->
<!-- Delete account flow -->
<!-- Update password flow -->
<!-- Tradelanes loading flow for mobile -->
<!-- Remove from team flow -->

<!--
HOT DEALS: Get Request

/api/v1/website/deals?limit=3&page=1

{
    "success": true,
    "message": "Deals found successfully",
    "data": {
        "deals": [
            {
                "_id": "20",
                "deal": [
                    {
                        "_id": {
                            "id": "6479e444310a0c00e4588eb6",
                            "loadType": "20"
                        },
                        "totalCharges": 10,
                        "originPort": "NGAPP",
                        "destinationPort": "USTXT",
                        "originCountry": "NG",
                        "destinationCountry": "US"
                    },
                    {
                        "_id": {
                            "id": "6475c70630caed00ea0279d1",
                            "loadType": "20"
                        },
                        "totalCharges": 633289591,
                        "originPort": "AEKLB",
                        "destinationPort": "GBHE2",
                        "originCountry": "AE",
                        "destinationCountry": "CA"
                    },
                    {
                        "_id": {
                            "id": "6478a0de8ed8cc00e4550dcd",
                            "loadType": "20"
                        },
                        "totalCharges": 1140,
                        "originPort": "GBAN2",
                        "destinationPort": "AEDAS",
                        "originCountry": "CA",
                        "destinationCountry": "AE"
                    }
                ]
            },
            {
                "_id": "40",
                "deal": [
                    {
                        "_id": {
                            "id": "6479e823310a0c00e458910a",
                            "loadType": "40"
                        },
                        "totalCharges": 5,
                        "originPort": "NGAPP",
                        "destinationPort": "USTXT",
                        "originCountry": "NG",
                        "destinationCountry": "US"
                    }
                ]
            },
            {
                "_id": "noncontainers",
                "deal": [
                    {
                        "_id": {
                            "id": "646e9937ae92d600e49de469",
                            "loadType": "noncontainers"
                        },
                        "totalCharges": 6500,
                        "originPort": "DE82V",
                        "destinationPort": "AEDXB",
                        "originCountry": "DE",
                        "destinationCountry": "AE"
                    }
                ]
            }
        ],
        "count": 7
    }
}
 -->