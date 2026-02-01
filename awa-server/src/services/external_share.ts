import crypto from 'crypto';


import { File, Share } from '../models';
import { IShare } from '../types/fileTypes';
import { SERVER_URL } from '../configs/config';
import storeFile from '../utils/storeFile';



const externalShareFile = async (fileId: number, userId: number, expires_at:Date) => {
  try {
    const file = await File.findByPk(fileId);
    if (!file) {
      throw new Error('File not found');
    }
    if (file.userId !== userId) {
      throw new Error('User does not have permission to share this file');
    }

    // Create link 
    const link = crypto.randomBytes(16).toString("base64url");

    console.log('link ->', link)

    const share = new Share({
      link,
      fileId,
      expires_at: expires_at ? expires_at : new Date(Date.now() + 30*24*60*60*1000)
    })

    await share.save();

    return {link: `${SERVER_URL}/external_share/link/${link}`};

  } catch (error) {
    if (error instanceof Error) {

      console.log('error in share file service: ', error.message);
      throw new Error(error.message);
    }
    console.log('Error sharing file');

    throw new Error('Error sharing file');
  }
}

// Get External Share
const getExternalShare = async (link: string) => {
  try {

    const share : IShare | null = await Share.findOne({where:{link}});
    if (!share) {
      throw new Error('Invalid link');
    }
    if (share.expires_at < new Date()) {
      throw new Error('Link has expired');
    }
    return true

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Error getting shared file');
  }
}

// Get the File 
const getFile = async (link: string) => {
  try {

    const share : IShare | null = await Share.findOne({where:{link}});
    if (!share) {
      throw new Error('Invalid link');
    }
    if (share.expires_at < new Date()) {
      throw new Error('Link has expired');
    }

    const file = await File.findByPk(share.fileId);
    if (!file) {
      throw new Error('File not found');
    }
    const fileContent = await storeFile.openFile(file.address);
    
    return {
      file,
      fileContent
    };

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Error getting shared file');
  }
}

export default {
  externalShareFile,
  getExternalShare,
  getFile
}