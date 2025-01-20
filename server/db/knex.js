import Knex from 'knex';
import knexConfig from './knexfile.js';

const environment = process.env.NODE_ENV || 'development'; // Default to development
const knex = Knex(knexConfig[environment]);

export default knex;