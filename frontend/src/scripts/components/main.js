import Chart from 'chart.js/auto'
import { Auth } from '../services/auth';
import { CustomHttp } from '../services/custom-http';

export class Main {
    constructor () {
      // this.incomeElement = document.getElementById('')
      this.fillGraphs()





        (async function () {
          const data = [
            { year: 2010, count: 10 },
            { year: 2011, count: 20 },
            { year: 2012, count: 15 },
            { year: 2013, count: 25 },
            { year: 2014, count: 22 },
            { year: 2015, count: 30 },
            { year: 2016, count: 28 },
          ];

          new Chart(
            document.getElementById('income'),
            {
              type: 'pie',
              data: {
                labels: data.map(row => row.year),
                datasets: [
                  {
                    label: 'Acquisitions by year',
                    data: data.map(row => row.count)
                  }
                ]
              }
            }
          );
          new Chart(
            document.getElementById('acquisitions2'),
            {
              type: 'pie',
              data: {
                labels: data.map(row => row.year),
                datasets: [
                  {
                    label: 'Acquisitions by year',
                    data: data.map(row => row.count)
                  }
                ]
              }
            }
          );
        })();
    }

    fillGraphs() {
      try {
        CustomHttp.request()
      } catch (error) {
        
      }
    }
}

