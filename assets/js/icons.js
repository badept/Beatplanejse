/* Sprite nội tuyến để các trang HTML mở trực tiếp vẫn hiển thị icon. */
(() => {
    const app = (window.ViewMap ||= {});

    function initIcons() {
        const iconSprite = `
        <svg aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">
        <symbol id="back" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
        <symbol id="filter" viewBox="0 0 24 24"><path d="M4 5h16l-6.2 7v5.2l-3.6 1.8v-7L4 5Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></symbol>
        <symbol id="refresh" viewBox="0 0 24 24"><path d="M20 7v5h-5M4 17v-5h5M18.2 9A7 7 0 0 0 6.1 6.3L4 9m2 6a7 7 0 0 0 12.1 2.7L20 15" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></symbol>
        <symbol id="target" viewBox="0 0 24 24"><circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="3" fill="currentColor"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3" stroke="currentColor" stroke-width="1.7"/></symbol>
        <symbol id="chart" viewBox="0 0 24 24"><path d="M5 19V9m5 10V5m5 14v-7m4 7V3" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></symbol>
        <symbol id="list" viewBox="0 0 24 24"><path d="M9 6h11M9 12h11M9 18h11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="4.5" cy="6" r="1.3" fill="currentColor"/><circle cx="4.5" cy="12" r="1.3" fill="currentColor"/><circle cx="4.5" cy="18" r="1.3" fill="currentColor"/></symbol>
        <symbol id="person" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" fill="currentColor"/><path d="M4.5 21c.4-5 3.2-7.5 7.5-7.5s7.1 2.5 7.5 7.5" fill="currentColor"/></symbol>
        <symbol id="users" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.2" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="16.5" cy="9" r="2.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M2.5 20c.3-4.3 2.5-6.5 6.5-6.5s6.2 2.2 6.5 6.5M15 14.3c3.7.1 5.8 2 6 5.7" fill="none" stroke="currentColor" stroke-width="1.7"/></symbol>
        <symbol id="store" viewBox="0 0 24 24"><path d="M4 9h16v11H4zM3 9l2-5h14l2 5M3 9c0 2 3.5 2 3.5 0 0 2 3.5 2 3.5 0 0 2 4 2 4 0 0 2 3.5 2 3.5 0 0 2 3.5 2 3.5 0M9 20v-5h6v5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></symbol>
        <symbol id="search" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6" fill="none" stroke="currentColor" stroke-width="2"/><path d="m15 15 5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></symbol>
        <symbol id="pin" viewBox="0 0 24 24"><path d="M12 22s7-6.4 7-13a7 7 0 1 0-14 0c0 6.6 7 13 7 13Z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="9" r="2.5" fill="currentColor"/></symbol>
        <symbol id="clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 7v5l3.5 2" fill="none" stroke="currentColor" stroke-width="1.8"/></symbol>
        <symbol id="report" viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M8.5 8h7M8.5 12h7M8.5 16h4" stroke="currentColor" stroke-width="1.7"/></symbol>
        <symbol id="route" viewBox="0 0 24 24"><circle cx="6" cy="18" r="2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="18" cy="6" r="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 18h2.5c5 0 1-12 5.5-12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-dasharray="2.5 2.5"/></symbol>
        <symbol id="info" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 10v7" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="7" r="1.2" fill="currentColor"/></symbol>
        <symbol id="warning" viewBox="0 0 24 24"><path d="M12 3 2.5 20h19L12 3Z" fill="currentColor"/><path d="M12 8v6" stroke="#fff" stroke-width="2"/><circle cx="12" cy="17" r="1" fill="#fff"/></symbol>
        <symbol id="play" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="m10 8 6 4-6 4V8Z" fill="currentColor"/></symbol>
        <symbol id="check" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
        <symbol id="star" viewBox="0 0 24 24"><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6-5.4-2.9-5.4 2.9 1-6-4.4-4.3 6.1-.9L12 3Z" fill="currentColor"/></symbol>
        <symbol id="close" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="2"/></symbol>
        <symbol id="camera" viewBox="0 0 24 24"><path d="M4 7h3l1.5-2h7L17 7h3v12H4V7Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="12" cy="13" r="3.5" fill="none" stroke="currentColor" stroke-width="1.8"/></symbol>
        <symbol id="chevron" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2"/></symbol>
        <symbol id="briefcase" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9 7V4h6v3M3 12h18" fill="none" stroke="currentColor" stroke-width="1.8"/></symbol>
        <symbol id="pulse" viewBox="0 0 24 24"><path d="M2 13h5l2-7 4 13 2.5-8 1.5 2h5" fill="none" stroke="currentColor" stroke-width="1.8"/></symbol>
        </svg>`;

        document.body.insertAdjacentHTML("afterbegin", iconSprite);
        document.querySelectorAll('use[href*="icons.svg#"]').forEach((use) => {
            use.setAttribute("href", `#${use.getAttribute("href").split("#")[1]}`);
        });
    }

    Object.assign(app, { initIcons });
})();
