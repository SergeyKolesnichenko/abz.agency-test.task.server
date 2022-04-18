const userModel = require("../models/usersModel");
const queryString = require('query-string');

class PaginationService{

    getPagination(page, size){
        const limit = size ? +size : process.env.DEFAULT_PAGINATION_COUNT;

        page--;
        const offset = page ? page * limit : 0;
        return { limit, offset };
    };

    async getDataByPage(model, page, count, orderColumn) {
        const { limit, offset } = this.getPagination(page, count)
        return this.getDataByOffset(model, limit, offset, orderColumn)
    }

    async getDataByOffset(model, limit, offset, orderColumn) {
        await model.sync();

        const order = []

        if(orderColumn){
            order.push([orderColumn, 'ASC'])
        }

        let result = await model.findAndCountAll({
            limit,
            offset,
            where: {},
            order
        });

        for(let i=0;i<result.rows.length;i++){
            result.rows[i].createdAt = undefined
            delete result.rows[i].updatedAt
        }

        result.total_count = await model.count({})
        result.total_pages = Math.ceil(result.total_count / limit);
        result.page = Math.ceil(offset / limit) + 1
        result.count = result.rows.length

        return result
    }

    createLinks(link, page, total_pages, count){
        const next_info = page < total_pages ? { page: page + 1 , count } : null
        const prev_info = page > 1 ? { page: page - 1 , count } : null

        let links = {}

        links.next_url = next_info ? `${link}?${queryString.stringify(next_info)}` : null;
        links.prev_url = prev_info ? `${link}?${queryString.stringify(prev_info)}` : null;

        return links
    }
}

module.exports = new PaginationService();