# **AWA Project (Cloud Drive)**

An application that allows users to create text files or upload any type of file. Users can also share and download files.

## **Overview**

When a user signs up, they receive a personal drive where they can create **folders** and **files**. Users can create as many folders as they need, upload files, rename items, move files between folders, copy files to other folders, or share files with other users. Shared users can be granted permission to edit or reshare the file. Files can also be shared with non-authenticated users through a secure view‑only link. Users may download any file or export created text files as **PDF**.  
Users can view the contents of the active folder with pagination. On Desktop, the folder structure is displayed alongside the content window for easier navigation.  
A built-in text editor allows users to quickly create text files with basic formatting options.  
Users can delete files and empty folders. Deleted files are hidden from the main drive but remain stored on the server. They can be restored or permanently removed through the **Recycle Bin**.  
Files shared with the user appear in the **Shared** folder.  
Users can also update their profile information, including their name and profile icon.  
On the server side, each user has a dedicated directory inside the storage folder where their files are stored. All metadata and application data are managed through the database.

## **Key Features**

* **User Authentication:** Secure signup and login using \[JWT\].   
* **Responsive Design:** Works on both desktop and mobile devices.  
* **Text Editor:** Create instant text files with an integrated QuillJS editor.  
* **File Sharing:** Share files with other users or generate secure external links.  
* **Organizing Files:** Arrange files inside folders for better structure.  
* **Download Options:** Download uploaded files or export text files as PDF

## 

## **Teck Stack**

| Component | Technologies |
| :---- | :---- |
| Frontend | React, MUI |
| Backend | Node.js, Express |
| Database | PostgreSQL |

 

## **Prerequisites**

For running the app you will need:

* **Node.js**  (v24.0 or higher)  
* **npm**  
* **Database:** Access to a PostgreSQL instance.

## **App Setup:**

## **Backend Setup:**

1. Navigate to the backend directory: ```cd awa-server```
2. Install dependencies: ```npm install``` 
3. Create a “.env” file and add the following to the file:  
   

```.env 
PORT = 3000
DATABASE_URL =  your postgreSQL Connection Credentials.
DATABASE_NAME = 'awa'
STORAGE_DIR = 'storage'
SECRET  = 'secret*secret*secret'
FRONTEND_URL = 'http://localhost:5173'
SERVER_URL = 'localhost:3000/api'
```
## **Frontend Setup:**

1. Navigate to the Client directory: ```cd awa-client```
2. Install dependencies: ```npm install”```

## **Run Application:**

You can run the application in two ways:

**Option 1: Run frontend and backend separately**

From the project root, run each command in its own terminal:  
```
npm run dev:client  
npm run dev:server
```
**Option 2: Run both server and client together**  
```  
npm run dev:all
```

## **Folder Structure** 

.  
├── awa-server/    
│   ├─   migrations/             \# Database migration files  
│   ├─   src/ 		        \# Express/Node server  
│   │     ├─routes/                \# API Endpoints  
│   │     ├─ services/            \# Route logic  
│   │     ├─ Models/    	        \# DB Schema  
│   │     ├─ middlewares/  \# middlewares  
│   │     └─ utils/     	        \# Utility Functions  
│   └─   storage/	        \# storage directory for user files  
│  
├── awa-client/          	        \# React files  
│   ├── src/  
│   │   ├── components/ \# UI components  
│   │   ├── services/          \# service files for server connections  
│   │   └── configs/            \# Configurations  
└── README.md

| Feature | points |
| :---- | :---- |
| User authentication (register and login) Add, remove, and rename files and folders Create a text document Share files with other users or with non-authenticated users via link Prevent simultaneous editing: other users cannot edit an open file and receive a notification stating the file is currently open by a specific user Fully usable on both desktop and mobile browsers | 25 |
| Frontend built with React | 3 |
| WYSIWYG document editor using QuillJS  | 2 |
| Documents can be downloaded as PDF.  | 3 |
| Displays document name, creation timestamp, and last updated timestamp | 1 |
| Users can select a profile picture, stored on the server | 2 |
| Files can be organized into folders; users can move files within the folder hierarchy | 4 |
| Deleted documents go to the recycle bin; users can restore or permanently remove them | 2 |
| Users can clone an existing document | 1 |
| Users can upload any file to their drive | 2 |
| Pagination implemented | 2 |
| Users can search for the filename | 2 |
| Users can view the number of their files, number of files in the recycle bin, and number of files shared with the | 1 |

## **Use of AI:**

Gemini was used to compare and evaluate different text editor options for the frontend, as well as to review various approaches for implementing PDF conversion (server‑side vs. client‑side). Based on its suggestions, I chose a Puppeteer‑based solution, and Gemini also assisted in implementing the PDF converter.  
I also used Gemini for debugging parts of the code.  
GitHub Copilot was used occasionally while writing the code.  
For proofreading, spell‑checking, and grammar improvements of this document, Copilot was used.

## **Pictures of the App:**

## **Folder View **
![folder view](https://raw.githubusercontent.com/KasraSorouri/public_images/main/Screenshot%202026-02-21%20113315.png)

## ** File View **
![File View](https://raw.githubusercontent.com/KasraSorouri/public_images/main/Screenshot%202026-02-21%20113358.png)

## ** Share Form **
![Share Form](ttps://raw.githubusercontent.com/KasraSorouri/public_images/main/Screenshot%202026-02-21%20113540.png)

## ** Recyclebin **
![Recyclebin](https://raw.githubusercontent.com/KasraSorouri/public_images/main/Screenshot%202026-02-21%20113449.png)
