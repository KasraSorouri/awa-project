import app from './src/app'

import { PORT } from './src/configs/config'
import { connectToDatabase } from './src/configs/database'

const start = async () : Promise<void> => {
    try {
        await connectToDatabase();
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`)
        });
    } catch (error) {
        console.log('Error connecting to database', error);
        return process.exit(1);
    }
}
start().catch((error) => {
    console.log('Error starting server', error);
    return process.exit(1);
})
