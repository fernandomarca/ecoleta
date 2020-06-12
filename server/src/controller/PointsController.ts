import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {
    // async create(request, response){
    // }

    async index(request: Request, response: Response) {
        //cidade,uf,items (Query, Params)
        const { city, uf, items } = request.query;
        //const city = request.query.city; //outra forma
        //transformar items String para array numerico
        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()));
        //split separa na virgula e trim tira o espaços
        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');

        const serializedPoints = points.map(point => {
            return {
                ...point,
                image_url: `http://192.168.1.13:3333/uploads/${point.image}`,
            };
        })

        return response.json(serializedPoints);

    }

    async show(request: Request, response: Response) {
        const id = request.params.id;

        const point = await knex('points').where('id', id).first();
        //const items = await knex('point_items').where('point_id', id);

        //outra forma: 

        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title');


        if (!point) {
            return response.status(400).json({ message: 'Point not found' })
        }

        const serializedPoint = {
            ...point,
            image_url: `http://192.168.1.13:3333/uploads/${point.image}`,
        };

        return response.json({
            point: serializedPoint, items
        });
    }


    async create(request: Request, response: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body; //const name = request.body.name;

        const trx = await knex.transaction();

        const point = {
            image: request.file.filename,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
        }//name:name,

        const insertedIds = await trx('points').insert(point);

        const point_id = insertedIds[0];

        const pointItems = items
            .split(',')
            .map((item: string) => Number(item.trim()))
            .map((item_id: number) => {
                return {
                    item_id,
                    point_id,
                }
            })

        await trx('point_items').insert(pointItems);

        await trx.commit();

        return response.json({
            id: point_id,
            items: items,
            ...point,
        });
    }
}

//serializaçào
//API Transform


export default PointsController;