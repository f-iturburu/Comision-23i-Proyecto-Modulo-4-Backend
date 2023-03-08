
import { connect } from "mongoose";

(async () => {
    try
    {
        // !DATOS DE LA BASE DE DATOS PASARLOS A VARIABLES DE ENTORNO
        const db = await connect('mongodb://localhost:27017/RegistroDb');
        console.log('DB connected to',db.connection.name);
    }
    catch(error)
    {
        console.log("Error!!!!");
        console.log(error);
    }
})();