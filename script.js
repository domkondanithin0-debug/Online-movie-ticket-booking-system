"use strict";

/* =========================================================
   CINEBOOK - ONLINE MOVIE TICKET BOOKING SYSTEM
   Frontend demonstration using HTML, CSS and vanilla JS.
   Storage: localStorage. No real payment or backend.
========================================================= */

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const STORAGE = {
    users: "cinebook_users_v1",
    bookings: "cinebook_bookings_v1",
    session: "cinebook_session_v1",
    preferences: "cinebook_preferences_v1"
};

const REGULAR_PRICE = 180;
const PREMIUM_PRICE = 280;
const CONVENIENCE_FEE = 25;
const MAX_SEATS = 10;

/*
 * Images use publicly accessible movie-poster URLs.
 * If an image is unavailable, a fallback is displayed.
 * The sample titles and showtimes are demonstration data.
 */
const movies = [
    {
        id: "m1",
        title: "Interstellar",
        genre: "Science Fiction",
        language: "English",
        duration: "2h 49m",
        release: "2014-11-07",
        rating: 8.7,
        status: "now",
        poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        description: "A team of explorers travels beyond this galaxy to discover whether mankind has a future among the stars.",
        cast: "Matthew McConaughey, Anne Hathaway, Jessica Chastain"
    },
    {
        id: "m2",
        title: "The Dark Knight",
        genre: "Action",
        language: "English",
        duration: "2h 32m",
        release: "2008-07-18",
        rating: 9.0,
        status: "now",
        poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        description: "Batman faces a criminal mastermind whose chaotic plans challenge Gotham City's sense of order.",
        cast: "Christian Bale, Heath Ledger, Aaron Eckhart"
    },
    {
        id: "m3",
        title: "3 Idiots",
        genre: "Comedy",
        language: "Hindi",
        duration: "2h 50m",
        release: "2009-12-25",
        rating: 8.4,
        status: "now",
        poster: "https://image.tmdb.org/t/p/w500/66A9MqXOyVFCssoloscw79z8Tew.jpg",
        description: "Three engineering students discover friendship, ambition, and the importance of learning beyond exams.",
        cast: "Aamir Khan, R. Madhavan, Sharman Joshi"
    },
    {
        id: "m4",
        title: "RRR",
        genre: "Action",
        language: "Telugu",
        duration: "3h 2m",
        release: "2022-03-25",
        rating: 7.8,
        status: "now",
        poster: "https://image.tmdb.org/t/p/w500/wE0I6efAW4cDDmZQWtwZMOW44EJ.jpg",
        description: "Two extraordinary men and their paths of friendship, courage, and rebellion collide in a fictional historical adventure.",
        cast: "N. T. Rama Rao Jr., Ram Charan, Alia Bhatt"
    },
    {
        id: "m5",
        title: "Inception",
        genre: "Science Fiction",
        language: "English",
        duration: "2h 28m",
        release: "2010-07-16",
        rating: 8.8,
        status: "now",
        poster: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
        description: "A skilled thief enters people's dreams and faces an extraordinary challenge involving an idea planted in the mind.",
        cast: "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page"
    },
    {
        id: "m6",
        title: "La La Land",
        genre: "Romance",
        language: "English",
        duration: "2h 8m",
        release: "2016-12-09",
        rating: 8.0,
        status: "now",
        poster: "https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg",
        description: "An aspiring actress and a jazz musician pursue their dreams while navigating love and difficult choices.",
        cast: "Ryan Gosling, Emma Stone, John Legend"
    },
    {
        id: "m7",
        title: "Drishyam",
        genre: "Thriller",
        language: "Hindi",
        duration: "2h 43m",
        release: "2015-07-31",
        rating: 8.2,
        status: "now",
        poster: "https://image.tmdb.org/t/p/w500/3tWw3G3e9Q7M3p7m8dV4k0V0.jpg",
        description: "A family man uses his resourcefulness to protect his family when they become entangled in a troubling mystery.",
        cast: "Ajay Devgn, Tabu, Shriya Saran"
    },
    {
        id: "m8",
        title: "Vikram",
        genre: "Action",
        language: "Tamil",
        duration: "2h 54m",
        release: "2022-06-03",
        rating: 8.3,
        status: "now",
        poster: "https://image.tmdb.org/t/p/w500/774UV1aCURu6MXVhMj8V6X0C1gC.jpg",
        description: "A series of dangerous events leads an undercover team into a world of crime and hidden identities.",
        cast: "Kamal Haasan, Vijay Sethupathi, Fahadh Faasil"
    },
    {
        id: "m9",
        title: "Project Tomorrow",
        genre: "Science Fiction",
        language: "English",
        duration: "2h 5m",
        release: "2026-12-18",
        rating: 0,
        status: "upcoming",
        poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
        description: "A fictional upcoming science-fiction adventure about humanity's next great technological leap.",
        cast: "Sample cast for this fictional listing"
    },
    {
        id: "m10",
        title: "The Last Journey",
        genre: "Drama",
        language: "Hindi",
        duration: "2h 10m",
        release: "2027-01-15",
        rating: 0,
        status: "upcoming",
        poster: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
        description: "A fictional drama about family, new beginnings, and a journey that changes everything.",
        cast: "Sample cast for this fictional listing"
    }
];

const theatres = [
    {
        id: "t1",
        name: "CineBook Grand Cinemas",
        location: "Madhapur, Hyderabad",
        type: "Premium Multiplex"
    },
    {
        id: "t2",
        name: "Galaxy Movie Palace",
        location: "Kukatpally, Hyderabad",
        type: "Modern Multiplex"
    },
    {
        id: "t3",
        name: "Starlight Cinema",
        location: "Secunderabad, Hyderabad",
        type: "Family Cinema"
    }
];

const showtimes = [
    { time: "10:00", label: "10:00 AM", period: "Morning" },
    { time: "13:30", label: "1:30 PM", period: "Afternoon" },
    { time: "16:30", label: "4:30 PM", period: "Evening" },
    { time: "19:30", label: "7:30 PM", period: "Evening" },
    { time: "21:30", label: "9:30 PM", period: "Night" }
];

/* Application state */
let currentUser = null;
let currentMovie = null;
let currentBooking = null;
let selectedSeats = [];
let currentHistoryTicketId = null;
let lastConfirmationId = null;
let pendingPage = "home";
let navigationHistory = [];
let toastCounter = 0;

/* =========================================================
   SAFE LOCAL STORAGE HELPERS
========================================================= */

function readStorage(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        if (raw === null) return fallback;
        return JSON.parse(raw);
    } catch (error) {
        console.error("Unable to read storage:", key, error);
        return fallback;
    }
}

function writeStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error("Unable to save storage:", key, error);
        showToast("Unable to save data. Check your browser storage.", "error");
        return false;
    }
}

function getUsers() {
    const users = readStorage(STORAGE.users, []);
    return Array.isArray(users) ? users : [];
}

function getBookings() {
    const bookings = readStorage(STORAGE.bookings, []);
    return Array.isArray(bookings) ? bookings : [];
}

function saveBookings(bookings) {
    return writeStorage(STORAGE.bookings, bookings);
}

function getPreferences() {
    return readStorage(STORAGE.preferences, {});
}

/* =========================================================
   UTILITIES
========================================================= */

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function formatMoney(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(Number(amount) || 0);
}

function formatDate(dateString) {
    if (!dateString) return "Not selected";

    const date = new Date(`${dateString}T12:00:00`);

    if (Number.isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

function formatDateTime(dateString) {
    if (!dateString) return "Not available";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return dateString;

    return date.toLocaleString("en-IN");
}

function createId(prefix) {
    const randomPart = window.crypto?.randomUUID
        ? crypto.randomUUID().replaceAll("-", "").slice(0, 12).toUpperCase()
        : `${Date.now().toString(36).toUpperCase()}${Math.random()
            .toString(36).slice(2, 8).toUpperCase()}`;

    return `${prefix}-${randomPart}`;
}

function getMovie(movieId) {
    return movies.find(movie => movie.id === movieId);
}

function getTheatre(theatreId) {
    return theatres.find(theatre => theatre.id === theatreId);
}

function getActiveUserBookings() {
    if (!currentUser) return [];

    return getBookings().filter(booking =>
        booking.userEmail === currentUser.email
    );
}

function setMessage(element, message, type = "") {
    if (!element) return;
    element.textContent = message;
    element.className = `form-message ${type}`.trim();
}

function showToast(message, type = "success") {
    const container = $("#toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type === "error" ? "error" : ""}`;
    toast.setAttribute("role", "status");
    toast.textContent = message;

    container.appendChild(toast);

    window.setTimeout(() => toast.remove(), 3500);
}

function normalizeEmail(email) {
    return String(email || "").trim().toLowerCase();
}

function validMobile(mobile) {
    return /^[0-9]{10}$/.test(String(mobile || ""));
}

function escapeAttribute(value) {
    return escapeHTML(value);
}

/* =========================================================
   NAVIGATION
========================================================= */

function navigate(pageId, options = {}) {
    const target = document.getElementById(pageId);

    if (!target || !target.classList.contains("page")) {
        pageId = "home";
    }

    if (!options.replace && !options.fromPopstate) {
        navigationHistory.push(getCurrentPage());
    }

    $$(".page").forEach(page => page.classList.remove("active"));
    $(`#${pageId}`)?.classList.add("active");

    $("#navigation")?.classList.remove("open");
    $("#menuToggle")?.setAttribute("aria-expanded", "false");

    updateNavigationState();
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (pageId === "myBookings") renderBookingHistory();
    if (pageId === "home") renderMovies();
    if (pageId === "login") setMessage($("#loginMessage"), "");
    if (pageId === "register") setMessage($("#registerMessage"), "");
    if (pageId === "forgotPassword") setMessage($("#forgotMessage"), "");

    if (options.updateHash !== false) {
        history.replaceState({ pageId }, "", `#${pageId}`);
    }
}

function getCurrentPage() {
    return $(".page.active")?.id || "home";
}

function updateNavigationState() {
    const pageId = getCurrentPage();

    $$(".nav-link").forEach(link => {
        const target = link.getAttribute("href")?.slice(1);
        link.classList.toggle(
            "active",
            target === pageId ||
            (pageId === "booking" && target === "movies") ||
            (pageId === "confirmation" && target === "myBookings")
        );
    });

    const actions = $("#headerActions");
    if (!actions) return;

    if (currentUser) {
        actions.innerHTML = `
            <span class="muted user-greeting">Hi, ${escapeHTML(currentUser.name.split(" ")[0])}</span>
            <button class="btn btn-outline btn-small" data-page="myBookings">My Tickets</button>
            <button class="btn btn-primary btn-small" id="logoutButton">Logout</button>
        `;
        $("#logoutButton")?.addEventListener("click", logout);
    } else {
        actions.innerHTML = `
            <button class="btn btn-outline btn-small" data-page="login">Login</button>
            <button class="btn btn-primary btn-small" data-page="register">Sign Up</button>
        `;
    }
}

function requireLogin() {
    if (currentUser) return true;

    pendingPage = "booking";
    showToast("Please log in to book tickets.", "error");
    navigate("login");
    return false;
}

/* =========================================================
   MOVIE LISTINGS, SEARCH AND FILTERS
========================================================= */

function renderMovies() {
    const search = ($("#movieSearch")?.value || "").trim().toLowerCase();
    const genre = $("#genreFilter")?.value || "";
    const language = $("#languageFilter")?.value || "";
    const sort = $("#sortMovies")?.value || "default";

    let filtered = movies.filter(movie => {
        const matchesSearch = movie.title.toLowerCase().includes(search);
        const matchesGenre = !genre || movie.genre === genre;
        const matchesLanguage = !language || movie.language === language;

        return matchesSearch && matchesGenre && matchesLanguage;
    });

    if (sort === "rating") {
        filtered.sort((a, b) => b.rating - a.rating);
    } else if (sort === "title") {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    const nowShowing = filtered.filter(movie => movie.status === "now");
    const upcoming = filtered.filter(movie => movie.status === "upcoming");

    $("#nowShowing").innerHTML = nowShowing.map(renderMovieCard).join("");
    $("#upcomingMovies").innerHTML = upcoming.map(renderMovieCard).join("");

    $("#movieCount").textContent =
        `${filtered.length} movie${filtered.length === 1 ? "" : "s"}`;

    $("#emptyMovies").classList.toggle("hidden", filtered.length !== 0);
}

function renderMovieCard(movie) {
    const rating = movie.rating > 0
        ? `★ ${movie.rating.toFixed(1)}`
        : "Coming Soon";

    const buttonText = movie.status === "upcoming"
        ? "View Details"
        : "Book Tickets";

    return `
        <article class="movie-card">
            <div class="poster-wrap">
                <img class="movie-poster"
                    src="${escapeAttribute(movie.poster)}"
                    alt="${escapeAttribute(movie.title)} poster"
                    loading="lazy">
                <span class="rating-badge">${rating}</span>
                <span class="poster-tag">${movie.status === "now" ? "Now Showing" : "Upcoming"}</span>
            </div>
            <div class="movie-info">
                <h4>${escapeHTML(movie.title)}</h4>
                <p class="movie-meta">
                    ${escapeHTML(movie.genre)} · ${escapeHTML(movie.language)}<br>
                    ${escapeHTML(movie.duration)}
                </p>
                <button class="btn btn-primary" data-movie-details="${movie.id}">
                    ${buttonText}
                </button>
            </div>
        </article>
    `;
}

function renderTheatres() {
    $("#theatreCards").innerHTML = theatres.map(theatre => `
        <article class="theatre-card">
            <div class="theatre-icon" aria-hidden="true">🎬</div>
            <h3>${escapeHTML(theatre.name)}</h3>
            <p>📍 ${escapeHTML(theatre.location)}</p>
            <p>${escapeHTML(theatre.type)}</p>
            <button class="btn btn-outline btn-small" data-theatre-book="${theatre.id}">
                Browse Shows →
            </button>
        </article>
    `).join("");
}

function openMovieDetails(movieId) {
    const movie = getMovie(movieId);
    if (!movie) return;

    const dialog = $("#movieDialog");

    $("#movieDialogContent").innerHTML = `
        <div class="movie-detail-layout">
            <img src="${escapeAttribute(movie.poster)}"
                alt="${escapeAttribute(movie.title)} poster">
            <div>
                <span class="eyebrow">${movie.status === "now" ? "NOW SHOWING" : "COMING SOON"}</span>
                <h2>${escapeHTML(movie.title)}</h2>
                <p>★ ${movie.rating ? movie.rating.toFixed(1) : "Not rated"} ·
                    ${escapeHTML(movie.genre)} · ${escapeHTML(movie.language)}</p>
                <p>Duration: ${escapeHTML(movie.duration)}</p>
                <p>Release date: ${formatDate(movie.release)}</p>
                <p>${escapeHTML(movie.description)}</p>
                <p><strong>Cast:</strong> ${escapeHTML(movie.cast)}</p>
                ${movie.status === "now"
                    ? `<button class="btn btn-primary" data-dialog-book="${movie.id}">
                        Book Tickets
                       </button>`
                    : `<p class="muted">This sample movie is not currently available for booking.</p>`
                }
            </div>
        </div>
    `;

    if (typeof dialog.showModal === "function") {
        dialog.showModal();
    } else {
        showToast("Your browser does not support this movie details dialog.", "error");
    }
}

function openBooking(movieId, theatreId = "") {
    const movie = getMovie(movieId);

    if (!movie || movie.status !== "now") {
        showToast("This movie is not currently available for booking.", "error");
        return;
    }

    if (!requireLogin()) {
        pendingPage = "booking";
        return;
    }

    currentMovie = movie;
    currentBooking = {
        movieId: movie.id,
        theatreId: theatreId || theatres[0].id,
        date: "",
        time: "",
        timeLabel: "",
        seats: [],
        subtotal: 0,
        fee: CONVENIENCE_FEE,
        total: 0
    };

    selectedSeats = [];

    $("#bookingMovieTitle").textContent = `Book: ${movie.title}`;

    $("#theatreSelect").innerHTML = theatres.map(theatre => `
        <option value="${theatre.id}">
            ${escapeHTML(theatre.name)} — ${escapeHTML(theatre.location)}
        </option>
    `).join("");

    $("#theatreSelect").value = currentBooking.theatreId;

    const today = new Date();
    const todayString = getLocalDateString(today);
    const lastDate = new Date(today);
    lastDate.setDate(lastDate.getDate() + 7);

    $("#showDate").min = todayString;
    $("#showDate").max = getLocalDateString(lastDate);
    $("#showDate").value = todayString;

    currentBooking.date = todayString;

    populateShowtimes();
    showBookingStep(1);
    navigate("booking");
}

function getLocalDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

/* =========================================================
   THEATRE AND SHOWTIME SELECTION
========================================================= */

function populateShowtimes() {
    if (!currentBooking) return;

    const date = $("#showDate").value;
    const theatreId = $("#theatreSelect").value;
    const select = $("#showtimeSelect");

    const now = new Date();

    const options = showtimes.filter(show => {
        const [hours, minutes] = show.time.split(":").map(Number);
        const showDate = new Date(`${date}T00:00:00`);
        showDate.setHours(hours, minutes, 0, 0);

        return showDate.getTime() > now.getTime();
    });

    select.innerHTML = `
        <option value="">Select a showtime</option>
        ${options.map(show => `
            <option value="${show.time}">${show.label} · ${show.period}</option>
        `).join("")}
    `;

    currentBooking.date = date;
    currentBooking.theatreId = theatreId;
    currentBooking.time = "";
    currentBooking.timeLabel = "";

    $("#showtimeInfo").textContent = options.length
        ? `${options.length} sample showtimes available. Regular seats: ${formatMoney(REGULAR_PRICE)} · Premium seats: ${formatMoney(PREMIUM_PRICE)}.`
        : "No future showtimes remain for this date. Please select another date.";

    if (!options.length) {
        select.innerHTML = '<option value="">No showtimes available</option>';
    }
}

function getShowKey(booking) {
    return [
        booking.movieId,
        booking.theatreId,
        booking.date,
        booking.time
    ].join("|");
}

function getBookedSeats(showKey, excludeBookingId = "") {
    const booked = new Set();

    getBookings().forEach(booking => {
        if (
            booking.id !== excludeBookingId &&
            booking.status === "Confirmed" &&
            booking.showKey === showKey
        ) {
            booking.seats.forEach(seat => booked.add(seat));
        }
    });

    return booked;
}

function showBookingStep(step) {
    $("#showtimeStep").classList.toggle("hidden", step !== 1);
    $("#seatStep").classList.toggle("hidden", step !== 2);
    $("#checkoutStep").classList.toggle("hidden", step !== 3);

    $$(".step").forEach(item => {
        const number = Number(item.dataset.stepLabel);
        item.classList.toggle("active", number === step);
        item.classList.toggle("completed", number < step);
    });

    if (step === 2) renderSeatMap();
    if (step === 3) renderCheckoutSummary();
}

/* =========================================================
   INTERACTIVE SEAT MAP
========================================================= */

function getSeatPrice(seat) {
    return seat.endsWith("5") || seat.endsWith("6")
        ? PREMIUM_PRICE
        : REGULAR_PRICE;
}

function generateSeatNames() {
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const seats = [];

    rows.forEach(row => {
        for (let number = 1; number <= 10; number++) {
            seats.push(`${row}${number}`);
        }
    });

    return seats;
}

function renderSeatMap() {
    if (!currentBooking) return;

    const showKey = getShowKey(currentBooking);
    const bookedSeats = getBookedSeats(showKey);
    const seatMap = $("#seatMap");

    seatMap.innerHTML = "";

    const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];

    rows.forEach(row => {
        const rowElement = document.createElement("div");
        rowElement.className = "seat-row";

        const rowLabel = document.createElement("span");
        rowLabel.className = "row-label";
        rowLabel.textContent = row;
        rowElement.appendChild(rowLabel);

        for (let number = 1; number <= 10; number++) {
            const seatName = `${row}${number}`;
            const button = document.createElement("button");

            button.type = "button";
            button.className = "seat";
            button.textContent = number;
            button.dataset.seat = seatName;
            button.setAttribute("aria-label", `Seat ${seatName}`);
            button.setAttribute("aria-pressed", "false");

            const isPremium = number === 5 || number === 6;

            if (isPremium) button.classList.add("premium");

            if (bookedSeats.has(seatName)) {
                button.classList.add("booked");
                button.disabled = true;
                button.setAttribute("aria-label", `Seat ${seatName}, booked`);
            } else if (selectedSeats.includes(seatName)) {
                button.classList.add("selected");
                button.setAttribute("aria-pressed", "true");
            }

            rowElement.appendChild(button);

            // A small aisle in the middle of each row.
            if (number === 5) {
                const aisle = document.createElement("span");
                aisle.style.width = "12px";
                aisle.setAttribute("aria-hidden", "true");
                rowElement.appendChild(aisle);
            }
        }

        seatMap.appendChild(rowElement);
    });

    updateSeatSummary();
}

function updateSeatSummary() {
    const seats = [...selectedSeats].sort((a, b) => {
        const rowCompare = a[0].localeCompare(b[0]);
        return rowCompare || Number(a.slice(1)) - Number(b.slice(1));
    });

    const subtotal = seats.reduce((sum, seat) => sum + getSeatPrice(seat), 0);

    $("#seatCount").textContent =
        `${seats.length} selected`;

    $("#selectedSeatNames").textContent =
        seats.length ? seats.join(", ") : "None";

    $("#seatSubtotal").textContent = formatMoney(subtotal);

    if (currentBooking) {
        currentBooking.seats = seats;
        currentBooking.subtotal = subtotal;
        currentBooking.fee = seats.length ? CONVENIENCE_FEE : 0;
        currentBooking.total = subtotal + currentBooking.fee;
    }
}

function toggleSeat(seatName) {
    if (!currentBooking) return;

    const bookedSeats = getBookedSeats(getShowKey(currentBooking));

    if (bookedSeats.has(seatName)) {
        showToast("This seat has already been booked.", "error");
        return;
    }

    if (selectedSeats.includes(seatName)) {
        selectedSeats = selectedSeats.filter(seat => seat !== seatName);
    } else {
        if (selectedSeats.length >= MAX_SEATS) {
            showToast(`You can select a maximum of ${MAX_SEATS} seats.`, "error");
            return;
        }

        selectedSeats.push(seatName);
    }

    updateSeatSummary();
    renderSeatMap();
}

/* =========================================================
   CHECKOUT AND PRICE CALCULATION
========================================================= */

function renderCheckoutSummary() {
    if (!currentBooking || !currentMovie) return;

    const theatre = getTheatre(currentBooking.theatreId);

    const lines = [
        ["Movie", currentMovie.title],
        ["Theatre", theatre?.name || "Unknown theatre"],
        ["Location", theatre?.location || "Unknown location"],
        ["Date", formatDate(currentBooking.date)],
        ["Showtime", currentBooking.timeLabel],
        ["Selected Seats", currentBooking.seats.join(", ")],
        ["Number of Tickets", String(currentBooking.seats.length)],
        ["Regular Tickets", String(currentBooking.seats.filter(
            seat => getSeatPrice(seat) === REGULAR_PRICE
        ).length)],
        ["Premium Tickets", String(currentBooking.seats.filter(
            seat => getSeatPrice(seat) === PREMIUM_PRICE
        ).length)],
        ["Ticket Subtotal", formatMoney(currentBooking.subtotal)],
        ["Convenience Fee", formatMoney(currentBooking.fee)]
    ];

    $("#checkoutSummary").innerHTML = `
        ${lines.map(([label, value]) => `
            <div class="summary-line">
                <span>${escapeHTML(label)}</span>
                <strong>${escapeHTML(value)}</strong>
            </div>
        `).join("")}
        <div class="summary-line summary-total">
            <span>Total Amount</span>
            <strong>${formatMoney(currentBooking.total)}</strong>
        </div>
    `;

    if (currentUser) {
        $("#customerName").value = currentUser.name || "";
        $("#customerEmail").value = currentUser.email || "";
        $("#customerMobile").value = currentUser.mobile || "";
    }
}

function validateBookingStillAvailable() {
    if (!currentBooking || !currentMovie) {
        showToast("Please start a booking first.", "error");
        return false;
    }

    const validDate = /^\d{4}-\d{2}-\d{2}$/.test(currentBooking.date);
    const validTime = showtimes.some(show => show.time === currentBooking.time);
    const validTheatre = Boolean(getTheatre(currentBooking.theatreId));

    if (!validDate || !validTime || !validTheatre) {
        showToast("Please select a valid theatre, date and showtime.", "error");
        return false;
    }

    const selectedShow = showtimes.find(show => show.time === currentBooking.time);
    const [hours, minutes] = selectedShow.time.split(":").map(Number);
    const start = new Date(`${currentBooking.date}T00:00:00`);
    start.setHours(hours, minutes, 0, 0);

    if (start <= new Date()) {
        showToast("This showtime has passed. Please choose a future show.", "error");
        return false;
    }

    return true;
}

/* =========================================================
   DEMO AUTHENTICATION
   Passwords are hashed with Web Crypto where available.
   This is still NOT production-grade authentication.
========================================================= */

async function hashPassword(password) {
    if (window.crypto?.subtle && window.isSecureContext) {
        const data = new TextEncoder().encode(password);
        const digest = await crypto.subtle.digest("SHA-256", data);

        return Array.from(new Uint8Array(digest))
            .map(byte => byte.toString(16).padStart(2, "0"))
            .join("");
    }

    /*
     * Fallback for local demo environments without Web Crypto.
     * This is not a secure password hash.
     */
    let hash = 2166136261;

    for (let index = 0; index < password.length; index++) {
        hash ^= password.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }

    return `demo-${(hash >>> 0).toString(16)}`;
}

function saveSession(user, remember) {
    const session = {
        email: user.email,
        remember: Boolean(remember)
    };

    try {
        if (remember) {
            localStorage.setItem(STORAGE.session, JSON.stringify(session));
            sessionStorage.removeItem(STORAGE.session);
        } else {
            sessionStorage.setItem(STORAGE.session, JSON.stringify(session));
            localStorage.removeItem(STORAGE.session);
        }
    } catch (error) {
        showToast("Unable to save your demo session.", "error");
    }
}

function restoreSession() {
    try {
        const saved = localStorage.getItem(STORAGE.session) ||
            sessionStorage.getItem(STORAGE.session);

        if (!saved) return;

        const session = JSON.parse(saved);
        const user = getUsers().find(
            item => item.email === normalizeEmail(session.email)
        );

        if (user) currentUser = user;
    } catch (error) {
        console.warn("Could not restore session.", error);
    }
}

function logout() {
    currentUser = null;

    try {
        localStorage.removeItem(STORAGE.session);
        sessionStorage.removeItem(STORAGE.session);
    } catch (error) {
        console.warn("Could not clear session.", error);
    }

    currentBooking = null;
    currentMovie = null;
    selectedSeats = [];

    updateNavigationState();
    showToast("You have been logged out.");
    navigate("home");
}

/* =========================================================
   LOGIN, REGISTRATION AND FORGOT PASSWORD
========================================================= */

async function handleRegistration(event) {
    event.preventDefault();

    const name = $("#registerName").value.trim();
    const email = normalizeEmail($("#registerEmail").value);
    const mobile = $("#registerMobile").value.trim();
    const password = $("#registerPassword").value;
    const confirmPassword = $("#confirmPassword").value;

    const message = $("#registerMessage");
    setMessage(message, "");

    if (name.length < 2) {
        setMessage(message, "Please enter your full name.", "error");
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setMessage(message, "Please enter a valid email address.", "error");
        return;
    }

    if (!validMobile(mobile)) {
        setMessage(message, "Enter a valid 10-digit mobile number.", "error");
        return;
    }

    if (password.length < 8) {
        setMessage(message, "Password must contain at least 8 characters.", "error");
        return;
    }

    if (password !== confirmPassword) {
        setMessage(message, "Passwords do not match.", "error");
        return;
    }

    if (getUsers().some(user => user.email === email)) {
        setMessage(message, "An account with this email already exists.", "error");
        return;
    }

    const submitButton = event.submitter;
    if (submitButton) submitButton.disabled = true;

    try {
        const passwordHash = await hashPassword(password);

        const user = {
            id: createId("USR"),
            name,
            email,
            mobile,
            passwordHash,
            createdAt: new Date().toISOString()
        };

        const users = getUsers();
        users.push(user);

        if (!writeStorage(STORAGE.users, users)) {
            setMessage(message, "Could not save your account. Check browser storage.", "error");
            return;
        }

        $("#registerForm").reset();
        setMessage(message, "Registration successful! You can now log in.", "success");
        showToast("Your demo account has been created.");

        window.setTimeout(() => navigate("login"), 900);
    } catch (error) {
        console.error(error);
        setMessage(message, "Registration failed. Please try again.", "error");
    } finally {
        if (submitButton) submitButton.disabled = false;
    }
}

async function handleLogin(event) {
    event.preventDefault();

    const email = normalizeEmail($("#loginEmail").value);
    const password = $("#loginPassword").value;
    const message = $("#loginMessage");
    const submitButton = event.submitter;

    setMessage(message, "");

    if (!email || !password) {
        setMessage(message, "Enter your email and password.", "error");
        return;
    }

    if (submitButton) submitButton.disabled = true;

    try {
        const passwordHash = await hashPassword(password);
        const user = getUsers().find(item =>
            item.email === email && item.passwordHash === passwordHash
        );

        if (!user) {
            setMessage(message, "Incorrect email or password.", "error");
            return;
        }

        currentUser = user;
        saveSession(user, $("#rememberMe").checked);

        updateNavigationState();
        showToast(`Welcome back, ${user.name.split(" ")[0]}!`);

        if (pendingPage === "booking" && currentMovie) {
            navigate("booking");
        } else {
            navigate("home");
        }

        pendingPage = "home";
        $("#loginForm").reset();
    } catch (error) {
        console.error(error);
        setMessage(message, "Login failed. Please try again.", "error");
    } finally {
        if (submitButton) submitButton.disabled = false;
    }
}

function handleForgotPassword(event) {
    event.preventDefault();

    const email = normalizeEmail($("#forgotEmail").value);
    const user = getUsers().find(item => item.email === email);

    /*
     * Do not disclose whether an email is registered.
     * This demo does not send emails or reset passwords.
     */
    const message = user
        ? "Demo account found. No email was sent and your password has not changed."
        : "If this were a real service, reset instructions would be sent when an account exists.";

    setMessage($("#forgotMessage"), message, "success");
}

/* =========================================================
   BOOKING CREATION AND CONFIRMATION
========================================================= */

function handleCheckout(event) {
    event.preventDefault();

    if (!currentUser) {
        showToast("Please log in before confirming a booking.", "error");
        pendingPage = "booking";
        navigate("login");
        return;
    }

    if (!currentBooking || !currentMovie || selectedSeats.length === 0) {
        showToast("Please select at least one seat.", "error");
        showBookingStep(2);
        return;
    }

    if (!validateBookingStillAvailable()) {
        showBookingStep(1);
        return;
    }

    const name = $("#customerName").value.trim();
    const email = normalizeEmail($("#customerEmail").value);
    const mobile = $("#customerMobile").value.trim();

    if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        !validMobile(mobile)) {
        showToast("Please enter valid customer details.", "error");
        return;
    }

    const showKey = getShowKey(currentBooking);
    const seatsNowBooked = getBookedSeats(showKey);
    const conflict = selectedSeats.some(seat => seatsNowBooked.has(seat));

    if (conflict) {
        showToast("One or more seats were just booked. Please select again.", "error");
        selectedSeats = selectedSeats.filter(seat => !seatsNowBooked.has(seat));
        showBookingStep(2);
        return;
    }

    updateSeatSummary();

    const theatre = getTheatre(currentBooking.theatreId);

    const booking = {
        id: createId("CB"),
        userEmail: currentUser.email,
        customer: { name, email, mobile },
        movieId: currentMovie.id,
        movieTitle: currentMovie.title,
        poster: currentMovie.poster,
        theatreId: theatre.id,
        theatreName: theatre.name,
        theatreLocation: theatre.location,
        date: currentBooking.date,
        time: currentBooking.time,
        timeLabel: currentBooking.timeLabel,
        showKey,
        seats: [...selectedSeats],
        subtotal: currentBooking.subtotal,
        fee: currentBooking.fee,
        total: currentBooking.total,
        status: "Confirmed",
        paymentMode: "Demo payment",
        createdAt: new Date().toISOString()
    };

    const bookings = getBookings();
    bookings.unshift(booking);

    if (!saveBookings(bookings)) return;

    lastConfirmationId = booking.id;

    renderConfirmation(booking);
    navigate("confirmation");
    showToast("Booking confirmed! Your demo ticket is ready.");
}

function renderConfirmation(booking) {
    $("#confirmationTicket").innerHTML = renderTicket(booking, true);
}

function renderTicket(booking, printable = false) {
    const movie = getMovie(booking.movieId);
    const poster = movie?.poster || booking.poster || "";
    const movieTitle = movie?.title || booking.movieTitle || "Movie";

    return `
        <article class="ticket" id="${printable ? "printArea" : ""}">
            <div class="ticket-top">
                <a class="logo" href="#home">
                    <span class="logo-icon">▶</span> Cine<span>Book</span>
                </a>
                <h2>${escapeHTML(movieTitle)}</h2>
                <p>${escapeHTML(booking.theatreName)} · ${escapeHTML(booking.theatreLocation)}</p>
            </div>

            <div class="ticket-body">
                <div class="ticket-movie">
                    <img class="ticket-poster" src="${escapeAttribute(poster)}"
                        alt="${escapeAttribute(movieTitle)} poster">
                    <div>
                        <h3>${escapeHTML(movieTitle)}</h3>
                        <p class="muted">${escapeHTML(movie?.genre || "Movie")} ·
                            ${escapeHTML(movie?.language || "")}</p>
                        <p class="muted">Booking ID: ${escapeHTML(booking.id)}</p>
                    </div>
                </div>

                <div class="ticket-grid">
                    <div class="ticket-field">
                        <small>Show Date</small>
                        <strong>${escapeHTML(formatDate(booking.date))}</strong>
                    </div>
                    <div class="ticket-field">
                        <small>Showtime</small>
                        <strong>${escapeHTML(booking.timeLabel)}</strong>
                    </div>
                    <div class="ticket-field">
                        <small>Seats</small>
                        <strong>${escapeHTML(booking.seats.join(", "))}</strong>
                    </div>
                    <div class="ticket-field">
                        <small>Tickets</small>
                        <strong>${booking.seats.length}</strong>
                    </div>
                    <div class="ticket-field">
                        <small>Customer</small>
                        <strong>${escapeHTML(booking.customer.name)}</strong>
                    </div>
                    <div class="ticket-field">
                        <small>Status</small>
                        <strong>${escapeHTML(booking.status)}</strong>
                    </div>
                </div>

                <div class="ticket-footer">
                    <span>Demo ticket · Not valid for real admission</span>
                    <strong>${formatMoney(booking.total)}</strong>
                </div>
            </div>
        </article>
    `;
}

/* =========================================================
   BOOKING HISTORY, TICKET VIEW AND CANCELLATION
========================================================= */

function renderBookingHistory() {
    const container = $("#bookingHistory");

    if (!currentUser) {
        container.innerHTML = `
            <div class="empty-bookings">
                <h3>Please log in to view your bookings</h3>
                <p>Your demo booking history is associated with your account.</p>
                <br>
                <button class="btn btn-primary" data-page="login">Login</button>
                <button class="btn btn-outline" data-page="register">Sign Up</button>
            </div>
        `;
        return;
    }

    const bookings = getActiveUserBookings();

    if (!bookings.length) {
        container.innerHTML = `
            <div class="empty-bookings">
                <h3>No bookings yet 🎬</h3>
                <p>Discover a movie and book your first demo ticket.</p>
                <br>
                <button class="btn btn-primary" data-page="home">Explore Movies</button>
            </div>
        `;
        return;
    }

    container.innerHTML = bookings.map(booking => `
        <article class="history-card">
            <img class="history-poster"
                src="${escapeAttribute(booking.poster || getMovie(booking.movieId)?.poster || "")}"
                alt="${escapeAttribute(booking.movieTitle)} poster"
                loading="lazy">

            <div class="history-details">
                <h3>${escapeHTML(booking.movieTitle)}</h3>
                <p><strong>Booking ID:</strong> ${escapeHTML(booking.id)}</p>
                <p>📍 ${escapeHTML(booking.theatreName)}</p>
                <p>📅 ${escapeHTML(formatDate(booking.date))} · ${escapeHTML(booking.timeLabel)}</p>
                <p>💺 ${escapeHTML(booking.seats.join(", "))} ·
                    ${booking.seats.length} ticket(s)</p>
                <p><strong>Total:</strong> ${formatMoney(booking.total)}</p>
                <span class="status ${booking.status === "Cancelled" ? "cancelled" : ""}">
                    ${escapeHTML(booking.status)}
                </span>
            </div>

            <div class="history-actions">
                <button class="btn btn-outline" data-view-ticket="${booking.id}">View Ticket</button>
                <button class="btn btn-outline" data-print-ticket="${booking.id}"
                    ${booking.status === "Cancelled" ? "disabled" : ""}>Print</button>
                ${booking.status === "Confirmed"
                    ? `<button class="btn btn-outline" data-cancel-booking="${booking.id}">
                        Cancel Booking
                       </button>`
                    : ""
                }
            </div>
        </article>
    `).join("");
}

function findOwnBooking(bookingId) {
    if (!currentUser) return null;

    return getBookings().find(booking =>
        booking.id === bookingId &&
        booking.userEmail === currentUser.email
    ) || null;
}

function viewTicket(bookingId) {
    const booking = findOwnBooking(bookingId);

    if (!booking) {
        showToast("Booking not found.", "error");
        return;
    }

    currentHistoryTicketId = bookingId;
    $("#ticketDialogContent").innerHTML = renderTicket(booking);

    const dialog = $("#ticketDialog");
    if (typeof dialog.showModal === "function") {
        dialog.showModal();
    }
}

function cancelBooking(bookingId) {
    const booking = findOwnBooking(bookingId);

    if (!booking) {
        showToast("Booking not found.", "error");
        return;
    }

    if (booking.status !== "Confirmed") {
        showToast("This booking is already cancelled.", "error");
        return;
    }

    const accepted = window.confirm(
        `Cancel booking ${booking.id} for ${booking.movieTitle}?\n\n` +
        "The selected seats will become available again in this browser."
    );

    if (!accepted) return;

    const bookings = getBookings();
    const index = bookings.findIndex(item =>
        item.id === bookingId && item.userEmail === currentUser.email
    );

    if (index < 0) {
        showToast("Booking not found.", "error");
        return;
    }

    bookings[index] = {
        ...bookings[index],
        status: "Cancelled",
        cancelledAt: new Date().toISOString()
    };

    if (!saveBookings(bookings)) return;

    renderBookingHistory();

    if (currentBooking && currentBooking.date === booking.date &&
        getShowKey(currentBooking) === booking.showKey) {
        renderSeatMap();
    }

    showToast("Booking cancelled. Seats are available again.");
}

function printBooking(bookingId) {
    const booking = findOwnBooking(bookingId);

    if (!booking) {
        showToast("Booking not found.", "error");
        return;
    }

    if (booking.status === "Cancelled") {
        showToast("Cancelled tickets cannot be printed as valid tickets.", "error");
        return;
    }

    const printContainer = document.createElement("div");
    printContainer.id = "printArea";
    printContainer.innerHTML = renderTicket(booking, true);

    document.body.appendChild(printContainer);

    window.print();

    printContainer.remove();
}

/* =========================================================
   CONTACT DEMO
========================================================= */

function handleContact(event) {
    event.preventDefault();

    $("#contactFeedback").textContent =
        "Thank you! Your sample message was validated locally. No email was sent.";

    $("#contactFeedback").className = "form-message success";
    $("#contactForm").reset();

    showToast("Demo message submitted.");
}

/* =========================================================
   INITIALIZATION AND EVENT HANDLERS
========================================================= */

function bindEvents() {
    // Global navigation, including buttons rendered dynamically.
    document.addEventListener("click", event => {
        const pageButton = event.target.closest("[data-page]");

        if (pageButton) {
            event.preventDefault();
            const pageId = pageButton.dataset.page;

            if (pageId === "myBookings" && !currentUser) {
                pendingPage = "home";
                navigate("login");
                showToast("Log in to view your bookings.", "error");
                return;
            }

            navigate(pageId);
            return;
        }

        const movieButton = event.target.closest("[data-movie-details]");
        if (movieButton) {
            openMovieDetails(movieButton.dataset.movieDetails);
            return;
        }

        const dialogBookButton = event.target.closest("[data-dialog-book]");
        if (dialogBookButton) {
            const movieId = dialogBookButton.dataset.dialogBook;
            $("#movieDialog").close();
            openBooking(movieId);
            return;
        }

        const theatreButton = event.target.closest("[data-theatre-book]");
        if (theatreButton) {
            const firstMovie = movies.find(movie => movie.status === "now");
            if (firstMovie) openBooking(firstMovie.id, theatreButton.dataset.theatreBook);
            return;
        }

        const seatButton = event.target.closest("[data-seat]");
        if (seatButton && !seatButton.disabled) {
            toggleSeat(seatButton.dataset.seat);
            return;
        }

        const viewButton = event.target.closest("[data-view-ticket]");
        if (viewButton) {
            viewTicket(viewButton.dataset.viewTicket);
            return;
        }

        const printButton = event.target.closest("[data-print-ticket]");
        if (printButton) {
            printBooking(printButton.dataset.printTicket);
            return;
        }

        const cancelButton = event.target.closest("[data-cancel-booking]");
        if (cancelButton) {
            cancelBooking(cancelButton.dataset.cancelBooking);
            return;
        }
    });

    // In-page navigation.
    $$(".nav-link").forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();

            const pageId = link.getAttribute("href").slice(1);

            if (pageId === "myBookings" && !currentUser) {
                pendingPage = "home";
                navigate("login");
                showToast("Log in to view your bookings.", "error");
                return;
            }

            navigate(pageId);
        });
    });

    $("#menuToggle").addEventListener("click", () => {
        const nav = $("#navigation");
        nav.classList.toggle("open");
        $("#menuToggle").setAttribute(
            "aria-expanded",
            String(nav.classList.contains("open"))
        );
    });

    // Movie filters.
    ["movieSearch", "genreFilter", "languageFilter", "sortMovies"].forEach(id => {
        $(`#${id}`).addEventListener(
            id === "movieSearch" ? "input" : "change",
            renderMovies
        );
    });

    // Image fallback when a remote poster is unavailable.
    document.addEventListener("error", event => {
        if (event.target.matches("img.movie-poster, img.ticket-poster, img.history-poster, .movie-detail-layout img")) {
            event.target.removeAttribute("src");
            event.target.alt = `${event.target.alt} (image unavailable)`;
            event.target.style.background = "#303044";
            event.target.style.minHeight = "120px";
        }
    }, true);

    // Authentication forms.
    $("#registerForm").addEventListener("submit", handleRegistration);
    $("#loginForm").addEventListener("submit", handleLogin);
    $("#forgotForm").addEventListener("submit", handleForgotPassword);
    $("#checkoutForm").addEventListener("submit", handleCheckout);
    $("#contactForm").addEventListener("submit", handleContact);

    // Show/hide password buttons.
    $$(".password-toggle").forEach(button => {
        button.addEventListener("click", () => {
            const input = document.getElementById(button.dataset.toggle);
            const isPassword = input.type === "password";

            input.type = isPassword ? "text" : "password";
            button.textContent = isPassword ? "Hide" : "Show";
            button.setAttribute(
                "aria-label",
                isPassword ? "Hide password" : "Show password"
            );
        });
    });

    // Password strength feedback.
    $("#registerPassword").addEventListener("input", event => {
        const password = event.target.value;
        const strength = $("#passwordStrength");

        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        const labels = [
            "",
            "Very weak",
            "Weak",
            "Fair",
            "Good",
            "Strong"
        ];

        strength.textContent = password
            ? `Password strength: ${labels[score]}`
            : "";
    });

    // Showtime selection.
    $("#theatreSelect").addEventListener("change", () => {
        if (!currentBooking) return;
        currentBooking.theatreId = $("#theatreSelect").value;
        populateShowtimes();
    });

    $("#showDate").addEventListener("change", () => {
        if (!currentBooking) return;
        populateShowtimes();
    });

    $("#showtimeSelect").addEventListener("change", () => {
        if (!currentBooking) return;

        const selected = showtimes.find(show =>
            show.time === $("#showtimeSelect").value
        );

        currentBooking.time = selected?.time || "";
        currentBooking.timeLabel = selected?.label || "";

        $("#showtimeInfo").textContent = selected
            ? `${selected.label} · ${selected.period}. Regular ${formatMoney(REGULAR_PRICE)}, premium ${formatMoney(PREMIUM_PRICE)} per ticket.`
            : "Select a showtime to continue.";
    });

    // Booking step buttons.
    $("#continueToSeats").addEventListener("click", () => {
        if (!currentBooking) return;

        currentBooking.theatreId = $("#theatreSelect").value;
        currentBooking.date = $("#showDate").value;

        const selected = showtimes.find(show =>
            show.time === $("#showtimeSelect").value
        );

        if (!selected || !validateBookingStillAvailable()) {
            showToast("Please choose a valid future showtime.", "error");
            return;
        }

        currentBooking.time = selected.time;
        currentBooking.timeLabel = selected.label;

        selectedSeats = [];
        showBookingStep(2);
    });

    $("#backToShowtime").addEventListener("click", () => showBookingStep(1));

    $("#continueToCheckout").addEventListener("click", () => {
        if (!selectedSeats.length) {
            showToast("Please select at least one seat.", "error");
            return;
        }

        if (selectedSeats.length > MAX_SEATS) {
            showToast(`You can select a maximum of ${MAX_SEATS} seats.`, "error");
            return;
        }

        if (!validateBookingStillAvailable()) {
            showBookingStep(1);
            return;
        }

        showBookingStep(3);
    });

    $("#backToSeats").addEventListener("click", () => showBookingStep(2));

    $("#bookingBack").addEventListener("click", () => {
        if (getCurrentPage() !== "booking") return;

        const step2Visible = !$("#seatStep").classList.contains("hidden");
        const step3Visible = !$("#checkoutStep").classList.contains("hidden");

        if (step3Visible) {
            showBookingStep(2);
        } else if (step2Visible) {
            showBookingStep(1);
        } else {
            navigate("home");
        }
    });

    // Dialogs.
    $("#closeMovieDialog").addEventListener("click", () => $("#movieDialog").close());
    $("#closeTicketDialog").addEventListener("click", () => $("#ticketDialog").close());

    $("#movieDialog").addEventListener("click", event => {
        if (event.target === $("#movieDialog")) $("#movieDialog").close();
    });

    $("#ticketDialog").addEventListener("click", event => {
        if (event.target === $("#ticketDialog")) $("#ticketDialog").close();
    });

    $("#printConfirmation").addEventListener("click", () => {
        if (lastConfirmationId) printBooking(lastConfirmationId);
    });

    $("#printHistoryTicket").addEventListener("click", () => {
        if (currentHistoryTicketId) printBooking(currentHistoryTicketId);
    });

    // Keep the year current.
    $("#currentYear").textContent = new Date().getFullYear();

    // If the user changes tabs or another demo booking is made,
    // refresh the visible seat map to reflect current local storage.
    window.addEventListener("focus", () => {
        if (getCurrentPage() === "booking" &&
            !$("#seatStep").classList.contains("hidden")) {
            renderSeatMap();
        }
    });

    window.addEventListener("storage", event => {
        if (event.key === STORAGE.bookings) {
            if (getCurrentPage() === "myBookings") renderBookingHistory();

            if (getCurrentPage() === "booking" &&
                !$("#seatStep").classList.contains("hidden")) {
                renderSeatMap();
            }
        }
    });

    // Basic back-button support.
    window.addEventListener("popstate", () => {
        const page = location.hash.replace("#", "") || "home";
        const allowed = ["home", "login", "register", "forgotPassword",
            "booking", "confirmation", "myBookings", "contact"];

        navigate(allowed.includes(page) ? page : "home", {
            fromPopstate: true,
            updateHash: false
        });
    });
}

/* =========================================================
   START APPLICATION
========================================================= */

function initializeApp() {
    restoreSession();

    renderMovies();
    renderTheatres();
    updateNavigationState();
    bindEvents();

    // Restore a known page if the browser opens with a valid hash.
    const requestedPage = location.hash.replace("#", "") || "home";
    const allowedPages = [
        "home", "login", "register", "forgotPassword",
        "booking", "confirmation", "myBookings", "contact"
    ];

    navigate(
        allowedPages.includes(requestedPage) ? requestedPage : "home",
        { replace: true, updateHash: false }
    );

    // Preserve the user's filter choices during the current browser session.
    const preferences = getPreferences();

    if (preferences.genre) $("#genreFilter").value = preferences.genre;
    if (preferences.language) $("#languageFilter").value = preferences.language;
    if (preferences.sort) $("#sortMovies").value = preferences.sort;

    renderMovies();

    ["genreFilter", "languageFilter", "sortMovies"].forEach(id => {
        $(`#${id}`).addEventListener("change", () => {
            const prefs = {
                genre: $("#genreFilter").value,
                language: $("#languageFilter").value,
                sort: $("#sortMovies").value
            };

            writeStorage(STORAGE.preferences, prefs);
        });
    });
}

document.addEventListener("DOMContentLoaded", initializeApp);