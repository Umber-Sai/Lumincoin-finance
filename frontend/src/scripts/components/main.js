import Chart from 'chart.js/auto'
import { Timebar } from '../common/timebar';

export class Main {
    constructor () {
      this.timebar = new Timebar(this.fillGraphs.bind(this));
      this.incomeChart = null;
      this.expenseChart = null;

    }

    fillGraphs(transactions) {
      if(this.incomeChart) this.incomeChart.destroy()
      if(this.expenseChart) this.expenseChart.destroy()


      const Allincome = transactions.filter(item => item.type === 'income');
      let incomeData = this.compress(Allincome);
      if(incomeData.length === 0) {
        incomeData = [{category : 'У вас нет доходов', amount : 1}]
      }


      this.incomeChart = new Chart(
        document.getElementById('income'),
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


      const allExpense = transactions.filter(item => item.type === 'expense');
      let expenseData = this.compress(allExpense);
      if(expenseData.length === 0) {
        expenseData = [{category : 'У вас нет расходов', amount : 1}]
      }

      this.expenseChart = new Chart(
        document.getElementById('expense'),
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

    compress (compressedArray) {
      let outputArray = []
      compressedArray.forEach(element => {
        const category = outputArray.find(item => item.category === element.category);
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

