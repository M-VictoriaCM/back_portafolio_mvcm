import { BelongsToMany, Model } from "sequelize-typescript";
import { AllowNull, Column, DataType, Default, ForeignKey, IsUUID, Length, PrimaryKey, Table, BelongsTo } from "sequelize-typescript";
import { Category } from "./Category";
import { ProjectTechnology } from "./ProjectTechnology";
import { Project } from "./Project";
import { User } from "./User";

@Table({
    tableName:'technologies',
    timestamps:true
})
export class Technology extends Model{
    @PrimaryKey
    @IsUUID(4)
    @Default(DataType.UUIDV4)  
    @Column(DataType.UUID)
    declare id: string;

    @AllowNull(false)
    @Length({min:2, max:255})
    @Column(DataType.STRING)
    nombre !: string;

    @AllowNull(true)
    @Length({min:2, max:255})
    @Default('https://robohash.org/tech123?size=150x150')
    @Column(DataType.STRING)
    image !: string;    

    @ForeignKey(() => Category)
    @AllowNull(false)
    @Column(DataType.UUID)
    categoryId !: string;

    @ForeignKey(() => User)
    @Column({
    type: DataType.UUID,
    allowNull: false,
    })
    userId!: string;
    
    @BelongsTo(() => Category)
    category !: Category;

     // Relación M:N con proyectos
    @BelongsToMany(() => Project, () => ProjectTechnology)
    projects!: Project[];

}