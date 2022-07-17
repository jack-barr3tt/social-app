import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm'
import { v4 } from 'uuid'

@Entity()
export class User {
    @PrimaryColumn()
    id!: string

    @Column({ unique: true })
    googleId: string

    @Column({ length: 100, unique: true, nullable: true })
    username: string

    @BeforeInsert()
    generateId() {
        this.id = v4()
    }
}
