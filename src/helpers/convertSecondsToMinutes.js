export const convertStoMs = (seconds) => {
    let minutes = Math.floor(seconds / 60);
    let extraSeconds = seconds % 60;
    const minuteValue =
        minutes > 0
            ? minutes + ` minute${minutes > 1 ? "s" : ""} `
            : "0 minutes ";
    const secondValue =
        extraSeconds > 0
            ? extraSeconds + ` second${extraSeconds > 1 ? "s" : ""} `
            : "";
    return minuteValue + secondValue;
};
