export class Datepicker {
    static mask (element) {
        element.onkeydown = (event) => {
            if(isNaN(parseInt(event.key)) && event.key != 'Backspace') {
                return false;
            } 
        }

        element.onkeyup = (event) => {
            const x = (event.target.value).match(/(\d{1,2})+/g);
            console.log(x)
            if(x.length < 3 ) {
                event.target.value = x;
            } else if(x[2]) {
                event.target.value = x[1] + '/' + x[2]
            }

        }
    }
}