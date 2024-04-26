import { Config } from "../config";
import { CustomHttp } from "../services/custom-http";

export class Timebar {
    static async getTransactions (period) {
        const response = await CustomHttp.request(Config.host + 'operations?period=' + period );
        console.log(response)
        if(!response) {
            console.log(1)
        }
        // transactions.sort(function (a, b) {
        //     return a.id - b.id;
        // });
        return response
    }
}