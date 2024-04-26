import { Config } from "../config";
import { CustomHttp } from "../services/custom-http";

export class Timebar {
    constructor (cb) {
        this.cb = cb;
        document.getElementsByName('date').forEach(button => {
            button.addEventListener('click', () => {
                this.getTransactions(button.value)
            })
        });

        this.getTransactions('today')
    }


    async getTransactions (period) {
        const response = await CustomHttp.request(Config.host + 'operations?period=' + period );
        if(response.length === 0) {
            this.cb(false)
        }
        response.sort(function (a, b) {
            return a.id - b.id;
        });
        this.cb(response)
    }
}