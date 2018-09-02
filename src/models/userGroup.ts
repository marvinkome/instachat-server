import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import User from './user';
import Group from './group';
import Role from './role';

export default class UserGroupLink {
    @PrimaryGeneratedColumn()
    // @ts-ignore
    id: number;

    @ManyToOne(() => Role, (role) => role.userRoleInGroup)
    // @ts-ignore
    role: Role;

    @ManyToOne(() => User, (user) => user.groupAssocs)
    // @ts-ignore
    user: User;

    @ManyToOne(() => Group, (group) => group.userAssocs)
    // @ts-ignore
    group: Group;
}
