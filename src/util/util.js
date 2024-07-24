// Utility function to parse dates
export const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split('/');
    const date = new Date(Date.UTC(year, month - 1, day));
    if (isNaN(date.getTime())) {
        throw new Error('Invalid date format');
    }
    return date;
};
