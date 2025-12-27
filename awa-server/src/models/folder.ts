import { Model, DataTypes, Optional } from 'sequelize';

import { sequelize } from '../configs/database';

interface IFolderAttributes {
  id: number;
  folderName: string;
  userId: number;
  parentFolder?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface IFolderCreationAttributes extends Optional<IFolderAttributes, 'id' | 'createdAt' | 'updatedAt'> {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

class Folder extends Model<IFolderAttributes, IFolderCreationAttributes> implements IFolderAttributes {
  declare id: number;
  declare folderName: string;
  declare userId: number;
  declare parentFolder: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Folder.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    folderName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
      },
      allowNull: false,
    },
    parentFolder: {
      type: DataTypes.NUMBER,
      references: {
        model: 'folder',
        key: 'id',
      },
      allowNull: true,
      defaultValue: null,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Date.now(),
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: Date.now(),
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'folder',
  }
);

export default Folder;