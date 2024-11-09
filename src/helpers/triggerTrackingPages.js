function triggerTrackingPages() {
    const { CustomEvent } = window;
    const event = new CustomEvent("tracking-pages");
    window.dispatchEvent(event);
}

export default triggerTrackingPages;
