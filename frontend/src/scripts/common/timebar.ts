import { Input } from "../components/form";
import { Config } from "../config";
import { CustomHttp } from "../services/custom-http";
import { DefaultResponseType } from "../types/default-response.type";
import { TransactionInfoType } from "../types/transaction.type";

type CallBack = {
    (arg: Array<TransactionInfoType>): void;
}
export class Timebar {

    cb: CallBack;
    inputs: Array<HTMLInputElement | null>

    constructor (cb: CallBack) {
        this.cb = cb;
        this.inputs = [
            document.getElementById('fromDate') as HTMLInputElement | null,
            document.getElementById('toDate') as HTMLInputElement | null
        ];
        const dateButtons = document.getElementsByName('date') as NodeListOf<HTMLInputElement>;

        dateButtons.forEach((button: HTMLInputElement) => {
            button.addEventListener('click', () => {
                if (button.value === 'interval') {
                    this.intervalCheck()
                    this.inputs.forEach(item => {
                        if(item) {
                            item.oninput = () => {
                               this.intervalCheck();
                            }
                        } 
                    });
                } else {
                    this.getTransactions(button.value)
                }
            })
        });

        this.getTransactions('today')
    }

    private intervalCheck(): void {
        const from: string | undefined = this.inputs[0]?.value;
        const to: string | undefined = this.inputs[1]?.value;
        if(from && to) {
            if(from.length > 7 && to.length > 7) {
                this.getTransactions('interval', from, to);
        }
        }
    }


    private async getTransactions (period: string, dateFrom: string | null = null, dateTo: string | null = null): Promise<void> {
        let url: string = Config.host + 'operations?period=' + period;
        if(dateFrom && dateTo) {
            url = url + '&dateFrom=' + dateFrom + '&dateTo=' + dateTo;
        }

        const response: DefaultResponseType | Array<TransactionInfoType> = await CustomHttp.request(url);

        if((response as DefaultResponseType).error) {
            this.cb([]);
            return
        }
        (response as Array<TransactionInfoType>).sort(function (a, b) {
            return a.id - b.id;
        });
        this.cb(response as Array<TransactionInfoType>)
    }
}