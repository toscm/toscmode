/*Presentation Mode Script for Jupyter Notebook

This script enables a presentation mode in Jupyter Notebook, which hides
certain UI elements and only displays the currently selected cell.
The presentation mode can be toggled on and off using the keybinding
Ctrl+Shift+Alt+M.

Features:
- Hides the menu panel, top panel, and toolbars.
- Adjusts the layout to use the full height of the viewport.
- Only displays the currently selected cell.
- Adds a keybinding (Ctrl+Shift+Alt+M) to toggle presentation mode.

Usage:
- Include this script in your Jupyter Notebook environment.
- Press Ctrl+Shift+Alt+M to toggle presentation mode.

Implementation Details:
- Uses a MutationObserver to monitor changes to the class attribute of cells.
- Injects CSS styles to hide UI elements and adjust the layout.
- Ensures that the keybinding is only added once by checking a global flag.*/

function enablePresentationMode() {
    // Clean up any previous instances
    if (window.presentationModeListenerAdded) {
        document.removeEventListener(
            'keydown',
            window.presentationModeToggleListener
        )
        if (window.presentationModeObserver) {
            window.presentationModeObserver.disconnect()
        }
        const existingStyleElement = document.getElementById(
            'presentationModeStyles'
        )
        if (existingStyleElement) {
            document.head.removeChild(existingStyleElement)
        }
    }
    let isPresentationMode = false
    let cellObserver = null
    let styleElement = null
    const presentationModeCSS = `
        #jp-menu-panel,
        #jp-top-panel,
        jp-toolbar.jp-Toolbar.jp-NotebookPanel-toolbar,
        jp-toolbar.lm-Widget.jp-Toolbar.jp-cell-menu.jp-cell-toolbar
        {
            display: none !important;
        }

        #main,
        #jp-main-content-panel,
        #jp-main-vsplit-panel,
        #jp-main-split-panel,
        #jp-left-stack,
        #jp-left-stack > div,
        #jp-main-dock-panel,
        #jp-main-dock-panel > div.jp-MainAreaWidget,
        #jp-main-dock-panel > div.jp-MainAreaWidget > div.jp-WindowedPanel,
        #jp-main-dock-panel > div.jp-MainAreaWidget > div.jp-WindowedPanel-scrollbar,
        #jp-main-dock-panel > div.jp-MainAreaWidget > div.jp-WindowedPanel-outer,
        #jp-right-stack,
        #jp-right-stack > div
        {
            top: 0px !important;
            height: 100vh !important;
        }`

    function showCurrentCell(cell) {
        console.log('Showing', cell)
        cell.style.display = ''
    }

    function hideCellsFromPreviousChapter(cell) {
        let currentCell = cell
        let previousChapterReached = cell.querySelector(
            'h1, h2, h3, h4, h5, h6'
        )
            ? true
            : false
        console.log('hideCellsFromPreviousChapter')
        console.log('currentCell:', currentCell)
        console.log(
            'currentCell.previousElementSibling:',
            currentCell.previousElementSibling
        )
        while (currentCell.previousElementSibling) {
            currentCell = currentCell.previousElementSibling
            if (previousChapterReached) {
                currentCell.style.display = 'none'
            } else if (currentCell.querySelector('h1, h2, h3, h4, h5, h6')) {
                currentCell.style.display = ''
                previousChapterReached = true
            } else {
                currentCell.style.display = ''
            }
        }
    }

    function hideFollowingCells(cell) {
        let currentCell = cell
        let nextHeadingReched = false
        console.log('hideFollowingCells')
        console.log('currentCell:', currentCell)
        console.log(
            'currentCell.nextElementSibling:',
            currentCell.nextElementSibling
        )
        while (currentCell.nextElementSibling) {
            currentCell = currentCell.nextElementSibling
            currentCell.style.display = 'none'
        }
    }

    function activatePresentationMode() {
        // Hide all cells except the currently selected cell
        const cells = document.querySelectorAll('div.jp-Cell')
        cells.forEach(
            (cell) =>
                (cell.style.display = cell.classList.contains('jp-mod-selected')
                    ? ''
                    : 'none')
        )

        // Observe changes to the class attribute of each cell
        cellObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (
                    mutation.type === 'attributes' &&
                    mutation.attributeName === 'class'
                ) {
                    if (mutation.target.classList.contains('jp-mod-selected')) {
                        showCurrentCell(mutation.target)
                        hideCellsFromPreviousChapter(mutation.target)
                        hideFollowingCells(mutation.target)
                    }
                }
            })
        })

        // Attach the observer to each cell
        cells.forEach((cell) =>
            cellObserver.observe(cell, { attributes: true })
        )

        // Inject CSS styles to hide certain UI elements
        styleElement = document.createElement('style')
        styleElement.id = 'presentationModeStyles'
        styleElement.innerHTML = presentationModeCSS
        document.head.appendChild(styleElement)
        isPresentationMode = true
        console.log('Presentation mode enabled.')
    }

    // Function to disable presentation mode
    function deactivatePresentationMode() {
        // Show all cells
        document
            .querySelectorAll('div.jp-Cell')
            .forEach((cell) => (cell.style.display = ''))

        // Disconnect the cell observer
        if (cellObserver) cellObserver.disconnect()
        cellObserver = null

        // Remove injected CSS styles using the style tag's ID
        const existingStyleElement = document.getElementById(
            'presentationModeStyles'
        )
        if (existingStyleElement) {
            document.head.removeChild(existingStyleElement)
        }
        isPresentationMode = false
        console.log('Presentation mode disabled.')
    }

    // Function to toggle presentation mode
    function togglePresentationMode() {
        isPresentationMode
            ? deactivatePresentationMode()
            : activatePresentationMode()
    }

    // Add event listener for toggling presentation mode
    const presentationModeToggleListener = (event) => {
        if (
            (event.ctrlKey &&
                event.shiftKey &&
                event.altKey &&
                event.key === 'M') ||
            event.key === 'F8'
        ) {
            togglePresentationMode()
        }
    }
    document.addEventListener('keydown', presentationModeToggleListener)

    // Store references to the observer and listener for cleanup
    window.presentationModeObserver = cellObserver
    window.presentationModeToggleListener = presentationModeToggleListener
    window.presentationModeListenerAdded = true

    console.log('Keybindings for presentation mode set: F8 or Ctrl+Shift+Alt+M')
}

enablePresentationMode()
