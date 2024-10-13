import {
    ILayoutRestorer,
    JupyterFrontEnd,
    JupyterFrontEndPlugin,
} from '@jupyterlab/application'

import {
    ICommandPalette,
    MainAreaWidget,
    WidgetTracker,
} from '@jupyterlab/apputils'

import { Widget } from '@lumino/widgets'

interface APODResponse {
    copyright: string
    date: string
    explanation: string
    media_type: 'video' | 'image'
    title: string
    url: string
}

class APODWidget extends Widget {
    constructor() {
        super()
        this.addClass('my-apodWidget')
        this.img = document.createElement('img')
        this.node.appendChild(this.img)
        this.summary = document.createElement('p')
        this.node.appendChild(this.summary)
    }
    readonly img: HTMLImageElement
    readonly summary: HTMLParagraphElement
    async updateAPODImage(): Promise<void> {
        const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${this.randomDate()}`)
        if (!response.ok) {
            const data = await response.json()
            this.summary.innerText = data.error ? data.error.message : response.statusText;
            return
        }
        const data = (await response.json()) as APODResponse
        if (data.media_type === 'image') {
            this.img.src = data.url
            this.img.title = data.title
            this.summary.innerText = data.title
            if (data.copyright) { this.summary.innerText += ` (Copyright ${data.copyright})` }
        } else {
            this.summary.innerText = 'Random APOD fetched was not an image.'
        }
    }

    randomDate(): string {
        const start = new Date(2010, 1, 1)
        const end = new Date()
        const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
        return randomDate.toISOString().slice(0, 10)
    }
}

function activate(
    app: JupyterFrontEnd,
    palette: ICommandPalette,
    restorer: ILayoutRestorer | null
) {
    console.log('JupyterLab extension toscmode is activated!')

    // Random Astronomy Picture
    let widget: MainAreaWidget<APODWidget>
    const command: string = 'apod:open'
    app.commands.addCommand(command, {
        label: 'Random Astronomy Picture',
        execute: () => {
            if (!widget || widget.isDisposed) {
                const content = new APODWidget()
                widget = new MainAreaWidget({ content })
                widget.id = 'apod-jupyterlab'
                widget.title.label = 'Astronomy Picture'
                widget.title.closable = true
            }
            if (!tracker.has(widget)) { tracker.add(widget) } // Track the state of the widget for later restoration
            if (!widget.isAttached) { app.shell.add(widget, 'main') } // Attach the widget to the main work area if it's not there
            widget.content.updateAPODImage() // Activate the widget
            app.shell.activateById(widget.id)
        }
    })
    palette.addItem({ command, category: 'Tutorial' }) // Add the command to the palette.
    let tracker = new WidgetTracker<MainAreaWidget<APODWidget>>({ namespace: 'apod' }) // Track and restore the widget state
    if (restorer) { restorer.restore(tracker, { command, name: () => 'apod'}) }

    // Tobias Showcase Mode (Toscmode)
    const showcaseCommand: string = 'showcase:toggle'
    app.commands.addCommand(showcaseCommand, {
        label: 'Toggle Showcase Mode',
        execute: () => {
            document.body.classList.toggle('showcase-mode')
        }
    })
    palette.addItem({ command: showcaseCommand, category: 'View' }) // Add the command to the palette.

}

const plugin: JupyterFrontEndPlugin<void> = {
    id: 'toscmode',
    description: 'Adds a Showcase Mode to Jupyter Lab',
    autoStart: true,
    requires: [ICommandPalette],
    optional: [ILayoutRestorer],
    activate: activate,
}

export default plugin
