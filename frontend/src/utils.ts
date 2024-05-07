export const formattedDateString = (): string => {
    const currentDate = new Date();

    // Get the individual components
    const year = currentDate.getFullYear();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Adding 1 because months are zero-based
    const day = ('0' + currentDate.getDate()).slice(-2);
    const hours = ('0' + currentDate.getHours()).slice(-2);
    const minutes = ('0' + currentDate.getMinutes()).slice(-2);
    const seconds = ('0' + currentDate.getSeconds()).slice(-2);

    // Concatenate them in the desired format
    return `${year}-${month}-${day} ${hours}-${minutes}-${seconds}`;
};

export const parseFormattedDateString = (formattedDate: string): Date => {
    // Split the formatted string into date and time components
    const [datePart, timePart] = formattedDate.split(' ');

    // Split the date component into year, month, and day
    const [year, month, day] = datePart.split('-').map(Number);

    // Split the time component into hours, minutes, and seconds
    const [hours, minutes, seconds] = timePart.split('-').map(Number);

    // Return a new Date object with the extracted components
    return new Date(year, month - 1, day, hours, minutes, seconds);
};
