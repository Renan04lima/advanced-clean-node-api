import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class PgUser {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: true })
    name?: string;

    @Column({ unique: true })
    email!: string;

    @Column({ name: 'facebook_id', nullable: true })
    facebookId?: number;
}
