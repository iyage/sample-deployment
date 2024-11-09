export const getOperatingSystem = () => {
    // const userAgent = window.navigator.userAgent;
    let path = "https://play.google.com/store/search?q=fleetplus&c=apps";

    // const isIOS =
    //     (/iPad|iPhone|iPod/.test(userAgent) ||
    //         (/Mac|Mac OS|MacIntel/gi.test(userAgent) &&
    //             (navigator.maxTouchPoints > 1 || "ontouchend" in document))) &&
    //     !window.MSStream;

    // if (/Macintosh|Mac|Mac OS|MacIntel|MacPPC|Mac68K/gi.test(userAgent)) {
    //     path = "https://apps.apple.com/us/app/tradeally/id6444654640";
    // } else if (isIOS) {
    //     path = "https://apps.apple.com/us/app/tradeally/id6444654640";
    // } else if (/'Win32|Win64|Windows|Windows NT|WinCE/gi.test(userAgent)) {
    //     path = "https://play.google.com/store/search?q=tradeally&c=apps";
    // } else if (/Android/gi.test(userAgent)) {
    //     path = "https://play.google.com/store/search?q=tradeally&c=apps";
    // } else if (/Linux/gi.test(userAgent)) {
    //     path = "https://apps.apple.com/us/app/tradeally/id6444654640";
    // }

    return path;
};
