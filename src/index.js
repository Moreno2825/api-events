
import { connectToDb } from "./db.js";
import app from "./app.js";

async function main(){
    await connectToDb();
    //! mandar el puerto de configuracion
    app.listen(3000);
    //!
    console.log('Server on port: ', 3000);
    console.log('http://localhost:3000/');

}

main();