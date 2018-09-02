import 'reflect-metadata';
import { createConnection } from 'typeorm';
import User from './user';

export const connection = createConnection({
    type: 'postgres',
    host: 'localhost',
    username: 'marvinkome',
    password: 'postgres',
    database: 'chatdb',
    synchronize: true,
    logging: false,
    entities: [User]
});

export const userRepository = async () => {
    const db = await connection;
    return db.getRepository(User);
};
