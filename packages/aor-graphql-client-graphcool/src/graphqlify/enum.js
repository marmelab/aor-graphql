export default function Enum(name) {
    return new _enum(name);
}

export class _enum {
    constructor(name) {
        this.name = name;
    }
}
