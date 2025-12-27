import { Model, DataTypes, Optional } from 'sequelize';

import { sequelize } from '../configs/database';

interface IUserFileAttributes {
  id: number;
  file: number;
  user: number;
  role: string;
  activated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface IUserFileCreationAttributes extends Optional<IUserFileAttributes, 'id' | 'createdAt' | 'updatedAt'> {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

class UserFiles extends Model<IUserFileAttributes, IUserFileCreationAttributes> implements IUserFileAttributes {
  declare id: number;
  declare file: number;
  declare user: number;
  declare role: string;
  declare activated: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

UserFiles.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    file: {
      type: DataTypes.NUMBER,
      references: {
        model: 'file',
        key: 'id',
      },
      allowNull: false,
    },
    user: {
      type: DataTypes.NUMBER,
      references: {
        model: 'user',
        key: 'id',
      },
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM,
      values: ['owner','edit','view'],
      defaultValue: 'owner',
      allowNull: false,
    },
    activated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    modelName: 'user_file',
  }
);

export default UserFiles;