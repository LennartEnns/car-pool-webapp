import knex from '~/server/db/knex';
import { error403, error500 } from '~/server/errors';

export const checkRouteOwner = async (mustBeOwner: boolean, userID: string, routeID: string) => knex('route')
    .first(1)
    .where({ routeID, userID })
    .catch(err => {
      throw createError(error500);
    })
    .then(res => {
      if (mustBeOwner ? !res : !!res) throw createError(error403);
    });
