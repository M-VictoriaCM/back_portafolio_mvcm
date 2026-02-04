import { AllowNull, Column, DataType, Default, ForeignKey, HasMany, IsUUID, Length, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
import { User } from "./User";

@Table({
    tableName: 'user_profile',
    timestamps: true
})

export class UserProfile extends Model{
    @PrimaryKey
        @IsUUID(4)
        @Default(DataType.UUIDV4)
        @Column(DataType.UUID)
        declare id: string;

    @ForeignKey(()=> User)
    @AllowNull(false)
    @Column(DataType.UUID)
    userId !: string;

    @AllowNull(true)
    @Unique
    @Length({ min: 3, max: 50 })
    @Column(DataType.STRING)
    username?: string;
    
    @Column(DataType.STRING)
    fullName ?: string;
    
    @AllowNull(true)
    @Default('https://robohash.org/tech123?size=50x50')
    @Column(DataType.STRING)
    urlAvatar?: string;

    @Column(DataType.TEXT)
    aboutMe ?: string;

    @Column(DataType.JSON)
    socialLinks ?: {linkedin ?: string, github ?: string};

}