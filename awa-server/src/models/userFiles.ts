import { Model, DataTypes, Optional } from 'sequelize';

import { sequelize } from '../configs/database';

interface IUserFileAttributes {
  id: number;
  fileId: number;
  userId: number;
  role: string;
  activated?: boolean;
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
  declare fileId: number;
  declare userId: number;
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
    fileId: {
      type: DataTypes.NUMBER,
      references: {
        model: 'file',
        key: 'id',
      },
      allowNull: false,
    },
    userId: {
      type: DataTypes.NUMBER,
      references: {
        model: 'user',
        key: 'id',
      },
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM,
      values: ['OWNER','EDITOR','VIEWER'],
      defaultValue: 'OWNER',
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