import { JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';
import { ICommandPalette } from '@jupyterlab/apputils';
import { INotebookTracker } from '@jupyterlab/notebook';
import { Cell, ICellModel } from '@jupyterlab/cells';

let showcaseModeEnabled = false;
let cellChangeTracker: any = null;

function hideCellsOutsideCurrentChapter(tracker: INotebookTracker, cell: Cell<ICellModel> | null) {
    // Iterate over all siblings cells (incl. the current cell) upwards until a
    // header cell is found. For each of these cells, add class
    // 'in-current-chapter' and store handles to them. After that, search for
    // all cells with class 'in-current-chapter' and remove the class from the
    // set difference.
    let previousSibling = cell?.node.previousElementSibling as HTMLElement | null;
    let headerFound = cell?.node.querySelector('h1, h2, h3, h4, h5, h6') ? true : false;
    const nodesInChapterOld: Set<HTMLElement> = new Set(document.querySelectorAll('.in-current-chapter') as NodeListOf<HTMLElement>);
    const nodesInChapterNow: Set<HTMLElement> = new Set();

    console.log("Current cell: ", cell?.node);
    console.log("Previous sibling: ", previousSibling);
    console.log("Header found: ", headerFound);

    // If the current cell is a header, scroll so it's shown at the window top
    // if (headerFound) {
    //     console.log("Scrolling to header ", cell?.node);
    //     const notebookArea = document.querySelector('.jp-NotebookPanel-notebook');
    //     if (notebookArea && cell?.node) {
    //         const boundingRect = cell.node.getBoundingClientRect();
    //         const notebookAreaRect = notebookArea.getBoundingClientRect();
    //         const ytop = boundingRect.top - notebookAreaRect.top;
    //         notebookArea.scrollBy({ top: ytop, behavior: 'smooth' });
    //     }
    // }

    // Always add the current node to the current chapter
    if (cell?.node) {
        console.log("Adding current node", cell?.node, " to current chapter");
        cell?.node.classList.add('in-current-chapter');
        nodesInChapterNow.add(cell?.node);
    }

    // If the current node was no heading and has previous siblings, add these
    // siblings to the current chapter as well, until a heading is found
    while (!headerFound && previousSibling) {
        console.log("Adding previous sibling", previousSibling, " to current chapter");
        previousSibling.classList.add('in-current-chapter');
        nodesInChapterNow.add(previousSibling);
        if (previousSibling.querySelector('h1, h2, h3, h4, h5, h6')) {
            console.log("Found header in ", previousSibling);    
            headerFound = true;
        }
        previousSibling = previousSibling.previousElementSibling as HTMLElement | null;
        console.log("Sibling node: ", previousSibling);
    }

    // Check if the current chapter has changed and if yes, remove nodes from
    // the old chapter. Do this only if we have sibling headings, otherwise
    // we are at the top of document OR the function was triggered by a cell
    // creation and in this case we dont won't to remove the previous cells.
    if (previousSibling) {
        const difference = new Set([...nodesInChapterOld].filter(x => !nodesInChapterNow.has(x)));
        difference.forEach((element) => {
            console.log("Removing ", element, " from current chapter");
            element.classList.remove('in-current-chapter');
        });
    }

}

function activate(
    app: JupyterFrontEnd,
    palette: ICommandPalette,
    notebookTracker: INotebookTracker
) {
    console.log('JupyterLab extension toscmode is activated!');
    const showcaseCommand: string = 'showcase:toggle';
    app.commands.addCommand(showcaseCommand, {
        label: 'Toggle Showcase Mode',
        execute: () => {
            showcaseModeEnabled = !showcaseModeEnabled;
            document.body.classList.toggle('showcase-mode');
            if (showcaseModeEnabled) {
                cellChangeTracker = notebookTracker.activeCellChanged;
                cellChangeTracker.connect(hideCellsOutsideCurrentChapter);
            } else {
                if (cellChangeTracker) {
                    cellChangeTracker.disconnect(hideCellsOutsideCurrentChapter);
                    cellChangeTracker = null;
                }
            }
        }
    });
    palette.addItem({ command: showcaseCommand, category: 'View' });
}

const plugin: JupyterFrontEndPlugin<void> = {
    id: 'toscmode',
    description: 'Adds a Showcase Mode to Jupyter Lab',
    autoStart: true,
    requires: [ICommandPalette, INotebookTracker],
    activate: activate,
};

export default plugin;
