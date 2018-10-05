import {
    GET_LIST as AOR_GET_LIST,
    GET_ONE as AOR_GET_ONE,
    GET_MANY as AOR_GET_MANY,
    GET_MANY_REFERENCE as AOR_GET_MANY_REFERENCE,
    CREATE as AOR_CREATE,
    UPDATE as AOR_UPDATE,
    DELETE as AOR_DELETE,
} from 'react-admin';

export const GET_LIST = AOR_GET_LIST;
export const GET_ONE = AOR_GET_ONE;
export const GET_MANY = AOR_GET_MANY;
export const GET_MANY_REFERENCE = AOR_GET_MANY_REFERENCE;
export const CREATE = AOR_CREATE;
export const UPDATE = AOR_UPDATE;
export const DELETE = AOR_DELETE;

export const QUERY_TYPES = [GET_LIST, GET_MANY, GET_MANY_REFERENCE, GET_ONE];
export const MUTATION_TYPES = [CREATE, UPDATE, DELETE];
export const ALL_TYPES = QUERY_TYPES.concat(MUTATION_TYPES);
