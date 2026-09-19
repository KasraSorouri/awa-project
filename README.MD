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
2. Install dependencies: ```npm install```

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

## **Pictures of the App:**

## **Folder View:**
![folder view](https://raw.githubusercontent.com/KasraSorouri/public_images/main/Screenshot%202026-02-21%20113315.png)

## **File View:**
![File View](https://raw.githubusercontent.com/KasraSorouri/public_images/main/Screenshot%202026-02-21%20113358.png)

## **Share Form:**
![Share Form](https://raw.githubusercontent.com/KasraSorouri/public_images/main/Screenshot%202026-02-21%20113540.png)

## **Recyclebin:**
![Recyclebin](https://raw.githubusercontent.com/KasraSorouri/public_images/main/Screenshot%202026-02-21%20113449.png)
