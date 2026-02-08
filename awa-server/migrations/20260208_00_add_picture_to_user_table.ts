import { DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: any) => {
    await queryInterface.addColumn('users', 'picture', {
      type: DataTypes.STRING,
      allowNull: true,
    });
  };

export const down = async ({ context: queryInterface }: any) => {
    await queryInterface.removeColumn('users', 'picture');
  };  
  