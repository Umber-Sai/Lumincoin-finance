import { Config } from "../config";
import { CustomHttp } from "../services/custom-http";

export class Timebar {
    constructor (cb) {
        this.cb = cb;
        this.inputs = [
            document.getElementById('fromDate'),
            document.getElementById('toDate')
        ]
        document.getElementsByName('date').forEach(button => {
            button.addEventListener('click', () => {
                if (button.value === 'interval') {
                    this.intervalCheck()
                    this.inputs.forEach(item => {
                        item.oninput = () => {
                           this.intervalCheck()
                        }
                    })
                } else {
                    this.getTransactions(button.value)
                }
            })
        });

        this.getTransactions('today')
    }

    intervalCheck() {
        const from = this.inputs[0].value;
        const to = this.inputs[1].value;
        if( from.length > 7 && to.length > 7) {
            this.getTransactions('interval', from, to);
        }
    }


    async getTransactions (period, dateFrom = null, dateTo = null) {
        let url = Config.host + 'operations?period=' + period;
        if(dateFrom && dateTo) {
            url = url + '&dateFrom=' + dateFrom + '&dateTo=' + dateTo;
        }

        const response = await CustomHttp.request(url);

        if(response.length === 0) this.cb([])
        response.sort(function (a, b) {
            return a.id - b.id;
        });
        this.cb(response)
    }
}