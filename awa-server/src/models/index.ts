import User from './user'
import Folder from './folder'
import File from './file'
import UserFiles from './userFiles'

User.belongsToMany(File, { through: UserFiles, foreignKey: 'userId' });
File.belongsToMany(User, { through: UserFiles, foreignKey: 'fileId' });
Folder.hasMany(File, { foreignKey: 'folderId', as: 'files' });
File.belongsTo(Folder, { foreignKey: 'folderId', as: 'folder' });
Folder.belongsTo(Folder, { foreignKey: 'parentFolder', as: 'parent' });
Folder.hasMany(Folder, { foreignKey: 'parentFolder', as: 'subFolders' });
User.hasMany(Folder, { foreignKey: 'userId', as: 'folders' });
Folder.belongsTo(User, { foreignKey: 'userId', as: 'user' });



export {
  User,
  Folder,
  File,
  UserFiles
}