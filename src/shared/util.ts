/**
 * Takes an array and an item which will be removed from the array if contained
 * @param arr the array
 * @param item the item to remove
 * @return if the item was removed (will return false if it was not contained)
 */
export const removeItem = <T>(arr: T[], item: T): boolean => {
    const index: number = arr.indexOf(item);
    if (index > -1) {
        arr.splice(index, 1);
        return true;
    }
    return false;
};
