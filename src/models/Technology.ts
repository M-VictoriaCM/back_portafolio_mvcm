import { Model } from "sequelize-typescript";
import { AllowNull, Column, DataType, Default, ForeignKey, IsUUID, Length, PrimaryKey, Table, BelongsTo } from "sequelize-typescript";
import { Category } from "./Category";



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
    
    @BelongsTo(() => Category)
    category !: Category;

}