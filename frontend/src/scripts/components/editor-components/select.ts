import { EditorSelectOptionsType, EditorSelectType } from "../../types/editor.type";

export class Select {

    public id: EditorSelectType;
    public element: HTMLSelectElement =  document.createElement('select');

    constructor (options: Array<EditorSelectOptionsType>, selected: string | null = null, id: EditorSelectType) {
        this.id = id;
        this.fillOptions(options, selected)
    }

    public fillOptions(options: Array<EditorSelectOptionsType>, selected: string | null = null): void {
        this.element.innerHTML = ''
        options.forEach(option => {
            const selectOption = document.createElement('option');
            selectOption.setAttribute('value', option.id);
            selectOption.innerText = option.title;

            if (selected && option.id === selected) selectOption.selected = true;

            this.element.appendChild(selectOption);
        });
    }
}