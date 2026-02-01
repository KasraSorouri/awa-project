import User from './user'
import Folder from './folder'
import File from './file'
import UserFiles from './userFiles'
import Share from './share'

User.belongsToMany(File, { through: UserFiles, foreignKey: 'userId', as:'sharedFiles' });
File.belongsToMany(User, { through: UserFiles, foreignKey: 'fileId' });

File.belongsTo(User, { foreignKey: 'userId', as: 'fileOwner' })
User.hasMany(File, { foreignKey: 'userId', as: 'ownedFiles' });

File.belongsTo(User, { foreignKey: 'currentUser', as: 'activeUser' });
User.hasMany(File, { foreignKey: 'currentUser', as: 'checkoutFile' });

Folder.hasMany(File, { foreignKey: 'folderId', as: 'files' });
File.belongsTo(Folder, { foreignKey: 'folderId', as: 'folder' });

Folder.belongsTo(Folder, { foreignKey: 'parentFolder', as: 'parent' });
Folder.hasMany(Folder, { foreignKey: 'parentFolder', as: 'subFolders' });

User.hasMany(Folder, { foreignKey: 'userId', as: 'folders' });
Folder.belongsTo(User, { foreignKey: 'userId', as: 'folderOwner' });

//Share.belongsTo(File, { foreignKey: 'fileId', as: 'file' });
//File.hasMany(Share, { foreignKey: 'fileId', as: 'share' })

export {
  User,
  Folder,
  File,
  UserFiles,
  Share
}