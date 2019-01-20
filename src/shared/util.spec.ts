import {removeItem} from './util';

describe('Util', () => {

    describe('removeItem', () => {
        it('should remove an item from a list and return true', () => {
            const list = ['A', 'B', 'C', 'D'];
            const res = removeItem(list, 'C');

            expect(res).toBe(true);
            expect(list).toEqual(['A', 'B', 'D']);
        });

        it('should do nothing and return false if the item was not in the list', () => {
            const list = ['A', 'B', 'C', 'D'];
            const res = removeItem(list, 'E');

            expect(res).toBe(false);
            expect(list).toEqual(['A', 'B', 'C', 'D']);
        });
    });
});
