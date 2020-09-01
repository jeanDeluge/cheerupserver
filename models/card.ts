import { Model, DataTypes } from "sequelize";
import { dbType } from "./index";
import { sequelize } from "./sequelize";

class Card extends Model {
  public id!: number;
  public text!: string;
  // public tags!: string;
  public cheered!: number;
  public done!: boolean;
  public DLC!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Card.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    text: {
      type: new DataTypes.STRING(),
      allowNull: false,
    },
    // tags: {
    //   type: new DataTypes.STRING(),
    //   allowNull: false,
    // },
    cheered: {
      type: new DataTypes.INTEGER(),
      allowNull: false,
    },
    // done: {
    //   type: new DataTypes.BOOLEAN(),
    //   allowNull: false,
    // },
    DLC: {
      type: new DataTypes.STRING(),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Card",
    tableName: "card",
    charset: "utf8",
    collate: "utf8_general_ci",
  }
);

export const associate = (db: dbType) => {};

export default Card;
