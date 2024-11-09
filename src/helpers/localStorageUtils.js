export const saveToStorage = (name, data) => {
    localStorage.setItem(name, JSON.stringify(data));
};

export const getFromStorage = (name) => {
    return JSON.parse(localStorage.getItem(name));
};

export const removeFromStorage = (name) => {
    localStorage.removeItem(name);
};
