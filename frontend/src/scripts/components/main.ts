import Chart from 'chart.js/auto';
import { Timebar } from '../common/timebar';
import { CompressedTransactions, TransactionInfoType } from '../types/transaction.type';

export class Main {

    private incomeChart: Chart | null = null;
    private expenseChart: Chart | null = null;
    constructor () {
      new Timebar(this.fillGraphs.bind(this));
    }

    private fillGraphs(transactions: Array<TransactionInfoType>): void {
      if(this.incomeChart) this.incomeChart.destroy()
      if(this.expenseChart) this.expenseChart.destroy()


      const Allincome: Array<TransactionInfoType> = transactions.filter(item => item.type === 'income');
      let incomeData: Array<CompressedTransactions> = this.compress(Allincome);
      if(incomeData.length === 0) {
        incomeData = [{category : 'У вас нет доходов', amount : 1}]
      }


      this.incomeChart = new Chart(
        document.getElementById('income_canvas'),
        {
          type: 'pie',
          data: {
            labels: incomeData.map(row => row.category),
            datasets: [
              {
                label: 'Доходы',
                data: incomeData.map(row => row.amount)
              }
            ]
          }
        }
      );


      const allExpense: Array<TransactionInfoType> = transactions.filter(item => item.type === 'expense');
      let expenseData: Array<CompressedTransactions> = this.compress(allExpense);
      if(expenseData.length === 0) {
        expenseData = [{category : 'У вас нет расходов', amount : 1}]
      }

      this.expenseChart = new Chart(
        document.getElementById('expense_canvas'),
        {
          type: 'pie',
          data: {
            labels: expenseData.map(row => row.category),
            datasets: [
              {
                label: 'Расходы',
                data: expenseData.map(row => row.amount)
              }
            ]
          }
        }
      );
    }

    private compress (arrayToCompress: Array<TransactionInfoType>): Array<CompressedTransactions>  {
      let outputArray: Array<CompressedTransactions> = [];
      arrayToCompress.forEach(element => {
        const category: CompressedTransactions | undefined = outputArray.find(item => item.category === element.category);
        if(!category) {
          outputArray.push({
            category : element.category,
            amount : element.amount
          })
        } else {
          category.amount += element.amount
        }
      });
      return outputArray
    }
}

