import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BeforeInsert,
    OneToMany
} from 'typeorm';
import { hash, compare } from 'bcrypt';
import GroupLink from './userGroup';

@Entity()
export default class User {
    @PrimaryGeneratedColumn()
    // @ts-ignore
    id: number;

    @Column({
        length: 24,
        unique: true
    })
    // @ts-ignore
    username: string;

    @Column({
        length: 64,
        unique: true
    })
    // @ts-ignore
    email: string;

    @Column({
        length: 128
    })
    // @ts-ignore
    password: string;

    @Column({
        length: 128,
        nullable: true
    })
    // @ts-ignore
    about: string;

    @Column({
        nullable: true
    })
    // @ts-ignore
    clientId: string;

    @Column({
        nullable: true
    })
    // @ts-ignore
    sessionId: string;

    @OneToMany(() => GroupLink, (link) => link.user)
    // @ts-ignore
    groupAssocs: GroupLink[];

    @BeforeInsert()
    async hashPassword() {
        const passwordHash = await hash(this.password, 10);
        this.password = passwordHash;
    }

    verifyPassword(password: string) {
        return compare(password, this.password);
    }
}
