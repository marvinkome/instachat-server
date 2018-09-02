import 'reflect-metadata';
import { createConnection } from 'typeorm';

// entities
import User from './user';
import Group from './group';
import Role from './role';
import UserGroup from './userGroup';

export const connection = createConnection({
    type: 'postgres',
    host: 'localhost',
    username: 'marvinkome',
    password: 'postgres',
    database: 'chatdb',
    synchronize: true,
    logging: false,
    entities: [User, Group, Role, UserGroup]
});

export const userRepository = async () => {
    const db = await connection;
    return db.getRepository(User);
};

export const groupRepository = async () => {
    const db = await connection;
    return db.getRepository(Group);
};

export const roleRepository = async () => {
    const db = await connection;
    return db.getRepository(Role);
};
