/**
 * Ultimate Context Menu Library
 * Version: 2.1 (Fixed Navigation & Persistence)
 */
class RightMenu {
    static activeInstance = null; // Static property to track the single open menu globally

    /**
     * @param {Object} options Configuration options
     */
    constructor(options = {}) {
        this.options = Object.assign({
            selector: null,
            theme: 'light', // 'light' | 'dark' | 'custom'
            items: [],
            minWidth: 200,
            className: '',
            onShow: null,
            onHide: null,
            onSelect: null
        }, options);

        this.rootMenu = null; // The root DOM element
        this.activeStack = []; // Stack of currently visible menu levels for keyboard navigation
        this.activeTarget = null; // The element that triggered the menu
        
        this.init();
    }

    init() {
        if (!this.options.selector && !this.options.triggers) {
            console.error('RightMenu: No selector provided.');
            return;
        }

        // Event delegation for right-click
        $(document).on('contextmenu', this.options.selector, (e) => this.handleRightMenu(e));
        
        // Global events (only need to bind these once, but doing it per instance is safer for teardown if we implemented it)
        // To avoid duplicate handling, we check if this instance is the active one inside the handler
        $(document).on('click', (e) => this.handleClickOutside(e));
        $(document).on('keydown', (e) => this.handleKeyDown(e));
    }

    /**
     * Handles the right-click event
     */
    handleRightMenu(e) {
        e.preventDefault();
        e.stopPropagation();

        // 1. Close ANY other open instance globally
        if (RightMenu.activeInstance && RightMenu.activeInstance !== this) {
            RightMenu.activeInstance.hideAll();
        }
        
        // 2. Close my own if open (reset state)
        this.hideAll();

        this.activeTarget = e.currentTarget;

        // Fire lifecycle hook
        if (typeof this.options.onShow === 'function') {
            const shouldShow = this.options.onShow(this.activeTarget);
            if (shouldShow === false) return;
        }

        // Set as active global instance
        RightMenu.activeInstance = this;

        // Create and show the root menu
        this.rootMenu = this.createMenu(this.options.items, true);
        this.activeStack = [this.rootMenu]; // Initialize stack with root
        this.showMenu(this.rootMenu, e.pageX, e.pageY);
    }

    /**
     * Recursively creates menu DOM elements
     * @param {Array} items Menu items configuration
     * @param {boolean} isRoot Is this the root menu?
     */
    createMenu(items, isRoot = false) {
        const menuEl = $('<ul>')
            .addClass('right-menu-plugin')
            .addClass(this.options.theme === 'dark' ? 'cm-theme-dark' : 'cm-theme-light')
            .addClass(this.options.className)
            .css('min-width', this.options.minWidth + 'px');

        if (!isRoot) {
            menuEl.addClass('rightmenu-submenu');
        }

        items.forEach(item => {
            if (item.separator) {
                menuEl.append($('<li>').addClass('right-menu-separator'));
                return;
            }

            if (item.header) {
                menuEl.append($('<li>').addClass('right-menu-header').text(item.header));
                return;
            }

            // Determine visibility
            let isVisible = true;
            if (typeof item.visible === 'function') isVisible = item.visible(this.activeTarget);
            else if (item.visible === false) isVisible = false;

            if (!isVisible) return;

            // Determine disabled state
            let isDisabled = false;
            if (typeof item.disabled === 'function') isDisabled = item.disabled(this.activeTarget);
            else if (item.disabled === true) isDisabled = true;

            const li = $('<li>').addClass('right-menu-item');
            if (isDisabled) li.addClass('disabled');

            // Icon
            const iconSpan = $('<span>').addClass('right-menu-icon');
            if (item.icon) iconSpan.append($('<i>').addClass(item.icon));
            li.append(iconSpan);

            // Label
            const labelSpan = $('<span>').addClass('right-menu-label').text(item.label);
            li.append(labelSpan);

            // Shortcut
            if (item.shortcut) {
                li.append($('<span>').addClass('right-menu-shortcut').text(item.shortcut));
            }

            // Submenu handling
            if (item.items && item.items.length > 0) {
                li.addClass('has-submenu');
                li.append($('<span>').addClass('right-menu-submenu-arrow'));
                
                // Recursively create submenu, but DON'T append to activeStack yet
                const submenu = this.createMenu(item.items, false);
                li.append(submenu);
            } else {
                // Click action
                li.on('click', (e) => {
                    if (isDisabled) return;
                    e.stopPropagation();
                    
                    const data = this.activeTarget ? $(this.activeTarget).data() : {};
                    
                    if (item.action) {
                        item.action(data, this.activeTarget);
                    }
                    
                    if (this.options.onSelect) {
                        this.options.onSelect(item, this.activeTarget);
                    }

                    this.hideAll();
                });
            }

            menuEl.append(li);
        });

        if (isRoot) {
             $('body').append(menuEl);
        }
        
        return menuEl;
    }

    /**
     * Smart positioning for the menu
     */
    showMenu(menuEl, x, y) {
        menuEl.addClass('visible');
        
        // Calculate collision with viewport
        const winW = $(window).width();
        const winH = $(window).height();
        const menuW = menuEl.outerWidth();
        const menuH = menuEl.outerHeight();

        // Horizontal check
        let finalX = x;
        if (x + menuW > winW) {
            finalX = winW - menuW - 10;
        }

        // Vertical check
        let finalY = y;
        if (y + menuH > winH) {
            finalY = winH - menuH - 10;
        }

        menuEl.css({ top: finalY, left: finalX });
    }

    /**
     * Hides all menus for this instance and clears global state if active
     */
    hideAll() {
        if (this.rootMenu) {
            this.rootMenu.removeClass('visible');
            const menuToRemove = this.rootMenu;
            setTimeout(() => menuToRemove.remove(), 200); 
            this.rootMenu = null;
        }
        
        this.activeStack = [];
        
        if (typeof this.options.onHide === 'function' && RightMenu.activeInstance === this) {
            this.options.onHide(this.activeTarget);
        }

        if (RightMenu.activeInstance === this) {
            RightMenu.activeInstance = null;
        }
    }

    handleClickOutside(e) {
        // Only handle if this is the active instance
        if (RightMenu.activeInstance !== this) return;

        if (this.rootMenu && !$(e.target).closest('.right-menu-plugin').length) {
            this.hideAll();
        }
    }

    handleKeyDown(e) {
        if (RightMenu.activeInstance !== this) return;
        if (this.activeStack.length === 0) return;

        const currentMenu = this.activeStack[this.activeStack.length - 1]; // Top of stack
        const items = currentMenu.children('li.right-menu-item:not(.disabled)');
        let activeItem = currentMenu.children('li.right-menu-item.active');
        let index = items.index(activeItem);

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                index++;
                if (index >= items.length) index = 0;
                this.focusItem(currentMenu, items.eq(index));
                break;
            
            case 'ArrowUp':
                e.preventDefault();
                index--;
                if (index < 0) index = items.length - 1;
                this.focusItem(currentMenu, items.eq(index));
                break;

            case 'ArrowRight':
                e.preventDefault();
                if (activeItem.length && activeItem.hasClass('has-submenu')) {
                    const submenu = activeItem.children('.rightmenu-submenu');
                    if (submenu.length) {
                        this.activeStack.push(submenu);
                        // Focus first item of active submenu
                        const firstSubItem = submenu.children('li.right-menu-item:not(.disabled)').first();
                        this.focusItem(submenu, firstSubItem);
                    }
                }
                break;

            case 'ArrowLeft':
                e.preventDefault();
                if (this.activeStack.length > 1) {
                    // Remove current active class from the parent item to simulate 'leaving'
                    // Actually we might want to keep parent selected. Design choice.
                    // Let's pop back to parent menu.
                    
                    // We need to 'unfocus' the submenu items? 
                    // No, CSS handles visibility based on Parent .active.
                    // If we remove active from Parent, submenu hides.
                    
                    this.activeStack.pop();
                    const parentMenu = this.activeStack[this.activeStack.length - 1];
                    // Focus returns to the parent item, which is ALREADY active.
                    // So we don't need to do anything else, just popping stack changes 'currentMenu' context for Up/Down keys.
                }
                break;

            case 'Enter':
                e.preventDefault();
                if (activeItem.length) {
                    if (activeItem.hasClass('has-submenu')) {
                         // Enter on submenu parent -> Open it (same as Right)
                        const submenu = activeItem.children('.rightmenu-submenu');
                        if (submenu.length) {
                            this.activeStack.push(submenu);
                            const firstSubItem = submenu.children('li.right-menu-item:not(.disabled)').first();
                            this.focusItem(submenu, firstSubItem);
                        }
                    } else {
                        activeItem.trigger('click');
                    }
                }
                break;

            case 'Escape':
                e.preventDefault();
                this.hideAll();
                break;
        }
    }

    focusItem(menu, item) {
        // Remove active class from ALL siblings in this specific menu
        menu.children('.right-menu-item').removeClass('active');
        item.addClass('active');
    }
}
