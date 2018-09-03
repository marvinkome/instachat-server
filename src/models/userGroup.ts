import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import User from './user';
import Group from './group';
import Role from './role';

@Entity()
export default class UserGroupLink {
    @PrimaryGeneratedColumn()
    // @ts-ignore
    id: number;

    @ManyToOne(() => User, (user) => user.groupAssocs, {
        eager: true
    })
    // @ts-ignore
    user: User;

    @ManyToOne(() => Group, (group) => group.userAssocs, {
        eager: true
    })
    // @ts-ignore
    group: Group;

    @ManyToOne(() => Role, (role) => role.userRoleInGroup, {
        eager: true
    })
    // @ts-ignore
    role: Role;
}
