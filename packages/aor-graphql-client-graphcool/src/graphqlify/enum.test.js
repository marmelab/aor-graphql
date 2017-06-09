import { default as Enum, _enum } from './enum';

describe('Enum', function() {
    it('should store the name', function() {
        const e = Enum('foo');
        expect(e).toBeInstanceOf(_enum);
        expect(e.name).toEqual('foo');
    });
});
