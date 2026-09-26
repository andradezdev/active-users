/*
*  Frappe Active Users © 2023
*  Author:  Ameen Ahmed
*  Company: Level Up Marketing & Software Development Services
*  Licence: Please refer to LICENSE file
*/

frappe.provide('frappe._active_users');
frappe.provide('frappe.dom');

class ActiveUsers {
    constructor() {
        if (frappe.desk == null) {
            frappe.throw(__('Active Users plugin can not be used outside Desk.'));
            return;
        }
        this.is_online = frappe.is_online ? frappe.is_online() : false;
        this.on_online = null;
        this.on_offline = null;
        
        var me = this;
        $(window).on('online', function() {
            me.is_online = true;
            me.on_online && me.on_online.call(me);
            me.on_online = null;
        });
        $(window).on('offline', function() {
            me.is_online = false;
            me.on_offline && me.on_offline.call(me);
            me.on_offline = null;
        });
        
        this.settings = {};
        this.data = [];
        
        this.setup();
    }
    destroy() {
        this.clear_sync();
        if (this.$loading) this.$loading.hide();
        if (this.$reload) this.$reload.off('click').hide();
        if (this.$app) this.$app.remove();
        this.data = this._on_online = this._on_offline = this._syncing = null;
        this.$app = this.$body = this.$loading = this.$footer = this.$reload = null;
    }
    error(msg, args) {
        this.destroy();
        frappe.throw(__(msg, args));
    }
    request(method, callback, type) {
        var me = this;
        return new Promise(function(resolve, reject) {
            let data = {
                method: 'active_users.utils.api.' + method,
                'async': true,
                freeze: false,
                callback: function(res) {
                    if (res && $.isPlainObject(res)) res = res.message || res;
                    if (!$.isPlainObject(res)) {
                        me.error('Active Users plugin received invalid ' + type + '.');
                        reject();
                        return;
                    }
                    if (res.error) {
                        me.error(res.message);
                        reject();
                        return;
                    }
                    let val = callback && callback.call(me, res);
                    resolve(val || res);
                }
            };
            try {
                frappe.call(data);
            } catch(e) {
                (console.error || console.log)('[Active Users]', e);
                this.error('An error has occurred while sending a request.');
                reject();
            }
        });
    }
    setup() {
        if (!this.is_online) {
            this.on_online = this.setup;
            return;
        }
        var me = this;
        this.sync_settings()
        .then(function() {
            if (!me.settings.enabled) return;
            Promise.resolve()
                .then(function() { me.setup_display(); })
                .then(function() { me.sync_reload(); });
        });
    }
    sync_settings() {
        return this.request(
            'get_settings',
            function(res) {
                res.enabled = cint(res.enabled);
                res.refresh_interval = cint(res.refresh_interval) * 60000;
                res.allow_manual_refresh = cint(res.allow_manual_refresh);
                this.settings = res;
            },
            'settings'
        );
    }
    mount() {
        if (!this.$app) return;
        // Check if already attached and visible in body
        if (this.$app.parent().length && document.body.contains(this.$app.get(0))) {
            return;
        }

        // 1. Frappe v16 Desktop navbar (/desk)
        let $desktopNotif = $('.desktop-navbar .desktop-notifications');
        if ($desktopNotif.length) {
            $desktopNotif.before(this.$app);
            return;
        }

        // 2. Frappe v16 page head actions (/app/...)
        let $pageActions = $('.page-head .standard-items-section .standard-actions');
        if ($pageActions.length) {
            $pageActions.prepend(this.$app);
            return;
        }

        let $pageSection = $('.page-head .standard-items-section');
        if ($pageSection.length) {
            $pageSection.prepend(this.$app);
            return;
        }

        // 3. Frappe classic header navbar
        let $classicNav = $('header.navbar > .container > .navbar-collapse > ul.navbar-nav');
        if ($classicNav.length) {
            $classicNav.prepend(this.$app);
            return;
        }

        let $navRight = $('.navbar-right, .navbar-nav').first();
        if ($navRight.length) {
            $navRight.prepend(this.$app);
        }
    }
    setup_display() {
        let title = __('Active Users');
        let iconHtml = frappe.utils && frappe.utils.icon
            ? frappe.utils.icon('users', 'md')
            : '<span class="fa fa-user fa-lg fa-fw"></span>';

        let reloadIconHtml = frappe.utils && frappe.utils.icon
            ? frappe.utils.icon('refresh-cw', 'sm')
            : '<span class="fa fa-refresh fa-md fa-fw"></span>';

        let isSystemManager = frappe.user_roles && (frappe.user_roles.includes('System Manager') || frappe.user_roles.includes('Administrator'));
        let settingsBtn = isSystemManager
            ? `<a href="#" class="active-users-header-settings text-muted ml-2" title="${__('Settings')}"><span class="fa fa-cog fa-md"></span></a>`
            : '';

        this.$app = $(`
            <div class="dropdown dropdown-notifications dropdown-mobile active-users-navbar-item" title="${title}" style="display: inline-flex; align-items: center;">
                <button class="btn-reset nav-link active-users-navbar-icon text-muted"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-persist="true"
                    type="button" style="cursor: pointer; padding: 4px 8px; display: inline-flex; align-items: center;">
                    ${iconHtml}
                </button>
                <div class="dropdown-menu dropdown-menu-right active-users-list" role="menu" style="min-width: 280px; z-index: 1050; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.12);">
                    <div class="active-users-list-header px-3 py-2 border-bottom d-flex justify-content-between align-items-center">
                        <span class="font-weight-bold" style="font-size: 0.85rem;">${title}</span>
                        ${settingsBtn}
                    </div>
                    <div class="active-users-list-body" style="max-height: 280px; overflow-y: auto;">
                        <div class="active-users-list-loading p-3 text-center">
                            <div class="active-users-list-loading-box"></div>
                        </div>
                    </div>
                    <div class="active-users-list-footer px-3 py-2 border-top d-flex justify-content-between align-items-center">
                        <div class="active-users-footer-text text-muted small"></div>
                        <div class="active-users-footer-icon">
                            <a href="#" class="active-users-footer-reload text-muted" title="${__('Refresh')}">
                                ${reloadIconHtml}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `);

        this.mount();

        var me = this;
        $(document).on('page-change toolbar_setup', function() {
            setTimeout(function() { me.mount(); }, 150);
        });

        this.$body = this.$app.find('.active-users-list-body').first();
        this.$loading = this.$body.find('.active-users-list-loading').first().hide();
        this.$footer = this.$app.find('.active-users-footer-text').first();
        this.$reload = this.$app.find('.active-users-footer-reload').first();

        this.$app.find('.active-users-header-settings').on('click', function(e) {
            e.preventDefault();
            frappe.set_route('Form', 'Active Users Settings');
        });

        this.setup_manual_sync();
    }
    setup_manual_sync() {
        if (!this.settings.allow_manual_refresh) {
            this.$reload.off('click').hide();
            return;
        }
        var me = this;
        this.$reload.show().click(function(e) {
            e.preventDefault();
            if (!me._syncing) me.sync_reload();
        });
    }
    sync_reload() {
        if (!this.is_online) return;
        this.clear_sync();
        var me = this;
        Promise.resolve()
            .then(function() { me.sync_data(); })
            .then(function() { me.setup_sync(); });
    }
    clear_sync() {
        if (this.sync_timer) {
            window.clearInterval(this.sync_timer);
            this.sync_timer = null;
        }
    }
    sync_data() {
        this._syncing = true;
        if (this.data.length) {
            this.$footer.html('');
            this.$body.empty();
        }
        this.$loading.show();
        this.request(
            'get_users',
            function(res) {
                this.data = res.users && Array.isArray(res.users) ? res.users : [];
                this.$loading.hide();
                this.update_list();
                this._syncing = null;
            },
            'users list'
        );
    }
    setup_sync() {
        var me = this;
        this.sync_timer = window.setInterval(function() {
            me.sync_data();
        }, this.settings.refresh_interval);
    }
    update_settings() {
        if (!this.is_online) {
            this.on_online = this.update_settings;
            return;
        }
        var me = this;
        this.sync_settings()
        .then(function() {
            if (!me.settings.enabled) {
                me.destroy();
                return;
            }
            Promise.resolve()
                .then(function() { me.setup_manual_sync(); })
                .then(function() { me.sync_reload(); });
        });
    }
    update_list() {
        var me = this;
        this.$body.empty();
        if (!this.data || !this.data.length) {
            this.$body.html(`
                <div class="text-muted text-center py-4 px-3 small">
                    ${__('No other active users online')}
                </div>
            `);
            this.$footer.html(__('Total') + ': 0');
            return;
        }
        this.data.forEach(function(v) {
            let avatar = frappe.get_avatar(null, v.full_name, v.user_image),
            name = v.full_name,
            item = $(`
                <div class="row active-users-list-item px-3 py-2 align-items-center border-bottom m-0">
                    <div class="col-auto p-0 mr-2">${avatar}</div>
                    <div class="col p-0 ellipsis text-truncate font-weight-500" style="font-size: 0.85rem;">${name}</div>
                </div>
            `);
            me.$body.append(item.get(0));
        });
        this.$footer.html(__('Total') + ': ' + this.data.length);
    }
}

frappe._active_users.init = function() {
    if (frappe._active_users._init) frappe._active_users._init.destroy();
    if (frappe.desk == null) return;
    frappe._active_users._init = new ActiveUsers();
};

$(document).ready(function() {
    frappe._active_users.init();
});
