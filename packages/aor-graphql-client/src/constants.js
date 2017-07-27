export const GET_LIST = 'GET_LIST';
export const GET_ONE = 'GET_ONE';
export const GET_MANY = 'GET_MANY';
export const GET_MANY_REFERENCE = 'GET_MANY_REFERENCE';
export const CREATE = 'CREATE';
export const UPDATE = 'UPDATE';
export const DELETE = 'DELETE';

export const QUERY_TYPES = [GET_LIST, GET_MANY, GET_MANY_REFERENCE, GET_ONE];
export const MUTATION_TYPES = [CREATE, UPDATE, DELETE];
export const ALL_TYPES = QUERY_TYPES.concat(MUTATION_TYPES);
