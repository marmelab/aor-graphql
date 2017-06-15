import { filterTypesByIncludeExclude } from './introspection';

describe('introspection', () => {
    describe('filterTypesByIncludeExclude', () => {
        it('return false with an include option containing an array and tested type is not in it', () => {
            expect(filterTypesByIncludeExclude({ include: ['Post', 'Comment'] })({ name: 'NotMe' })).toBe(false);
        });

        it('return true with an include option containing an array and tested type is in it', () => {
            expect(filterTypesByIncludeExclude({ include: ['Post', 'Comment'] })({ name: 'Post' })).toBe(true);
        });

        it('return false with an exclude option containing an array and tested type is in it', () => {
            expect(filterTypesByIncludeExclude({ exclude: ['NotMe'] })({ name: 'NotMe' })).toBe(false);
        });

        it('return true with an include option containing an array and tested type is not in it', () => {
            expect(filterTypesByIncludeExclude({ exclude: ['NotMe'] })({ name: 'Post' })).toBe(true);
        });

        it('return true with an include option being a function returning true', () => {
            const include = jest.fn(() => true);
            const type = { name: 'Post' };
            expect(filterTypesByIncludeExclude({ include })(type)).toBe(true);
            expect(include).toHaveBeenCalledWith(type);
        });

        it('return false with an include option being a function returning false', () => {
            const include = jest.fn(() => false);
            const type = { name: 'Post' };
            expect(filterTypesByIncludeExclude({ include })(type)).toBe(false);
            expect(include).toHaveBeenCalledWith(type);
        });

        it('return false with an exclude option being a function returning true', () => {
            const exclude = jest.fn(() => true);
            const type = { name: 'Post' };
            expect(filterTypesByIncludeExclude({ exclude })(type)).toBe(false);
            expect(exclude).toHaveBeenCalledWith(type);
        });

        it('return true with an exclude option being a function returning false', () => {
            const exclude = jest.fn(() => false);
            const type = { name: 'Post' };
            expect(filterTypesByIncludeExclude({ exclude })(type)).toBe(true);
            expect(exclude).toHaveBeenCalledWith(type);
        });
    });
});
