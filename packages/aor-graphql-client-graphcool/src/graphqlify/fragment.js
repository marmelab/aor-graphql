export default function Fragment(params) {
    return new _fragment(params);
}

export class _fragment {
    constructor(params) {
        this.name = params.name;
        this.type = params.type;
        this.fields = params.fields;
        this.fragments = params.fragments;
    }
}
