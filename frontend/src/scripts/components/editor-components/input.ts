import { ERT } from "../../types/editor.type";

export class Input {

    public id: ERT;
    public element: HTMLInputElement = document.createElement('input');

    constructor (placeholder: string, type: string, id: ERT) {
        this.id = id;
        this.element.setAttribute('type', type);
        this.element.setAttribute('placeholder', placeholder);

        this.element.addEventListener('focus', () => {
            this.element.classList.remove('noValid')
        })
    }

    public valid (): boolean {
        // if(this.id === 'comment') return true;
        if(this.element.value) {
            return true;
        }
        this.element.classList.add('noValid')
        return false;
    }
}