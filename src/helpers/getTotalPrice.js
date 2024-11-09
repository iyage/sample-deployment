export const getTotalPrice = (array) => {
    return array?.reduce((acc, curr) => {
        return acc + Number(curr?.price);
    }, 0);
};
