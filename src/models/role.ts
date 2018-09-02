import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import UserGroups from './userGroup';

@Entity()
export default class Role {
    @PrimaryGeneratedColumn()
    // @ts-ignore
    id: number;

    @Column()
    // @ts-ignore
    name: string;

    @Column()
    // @ts-ignore
    default: boolean;

    @Column()
    // @ts-ignore
    permission: number;

    @OneToMany(() => UserGroups, (userGroup) => userGroup.role)
    // @ts-ignore
    userRoleInGroup: UserGroups[];
}
