import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import UserLink from './userGroup';

@Entity()
export default class Group {
    @PrimaryGeneratedColumn()
    // @ts-ignore
    id: number;

    @Column({
        length: 32
    })
    // @ts-ignore
    name: string;

    @Column({
        length: 128,
        nullable: true
    })
    // @ts-ignore
    topic: string;

    @Column({
        default: new Date()
    })
    // @ts-ignore
    createdOn: Date;

    @OneToMany(() => UserLink, (link) => link.group)
    // @ts-ignore
    userAssocs: UserLink[];
}
