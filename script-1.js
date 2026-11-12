"use strict";

document.addEventListener("DOMContentLoaded", function () {

    const searchInput =
        document.getElementById("service-search");

    const categoryFilter =
        document.getElementById("category-filter");

    const servicesGrid =
        document.getElementById("services-grid");

    const serviceCards =
        Array.from(
            servicesGrid.querySelectorAll(".service-card")
        );

    const servicesCount =
        document.getElementById("services-count");

    const emptyState =
        document.getElementById("empty-state");

    const resetButton =
        document.getElementById("reset-search");

    const privacyLink =
        document.getElementById("privacy-link");

    const serviceLinks =
        document.querySelectorAll(".service-link");

    /*
     * Convierte el texto a minúsculas y elimina los acentos
     * para que búsquedas como "gestion" encuentren "gestión".
     */
    function normalizeText(text) {
        return text
            .toLocaleLowerCase("es-MX")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
    }

    /*
     * Filtra las tarjetas según el texto y la categoría.
     */
    function filterServices() {

        const searchTerm =
            normalizeText(searchInput.value);

        const selectedCategory =
            categoryFilter.value;

        let visibleCount = 0;

        serviceCards.forEach(function (card) {

            const title =
                card.querySelector(".card-title").textContent;

            const description =
                card.querySelector(".card-description").textContent;

            const searchKeywords =
                card.dataset.search || "";

            const searchableText = normalizeText(
                title + " " +
                description + " " +
                searchKeywords
            );

            const categoryMatches =
                selectedCategory === "todas" ||
                card.dataset.category === selectedCategory;

            const textMatches =
                searchTerm === "" ||
                searchableText.includes(searchTerm);

            const shouldShow =
                categoryMatches && textMatches;

            card.hidden = !shouldShow;

            if (shouldShow) {
                visibleCount++;
            }
        });

        /*
         * Actualiza el contador de servicios visibles.
         */
        servicesCount.textContent =
            visibleCount +
            (visibleCount === 1
                ? " servicio"
                : " servicios");

        /*
         * Muestra el mensaje cuando no hay coincidencias.
         */
        emptyState.hidden = visibleCount !== 0;
    }

    /*
     * Restaura el buscador y los filtros.
     */
    function resetFilters() {

        searchInput.value = "";
        categoryFilter.value = "todas";

        filterServices();
        searchInput.focus();
    }

    searchInput.addEventListener(
        "input",
        filterServices
    );

    categoryFilter.addEventListener(
        "change",
        filterServices
    );

    resetButton.addEventListener(
        "click",
        resetFilters
    );

    /*
     * Evita que los enlaces de servicios sin URL real
     * lleven al usuario al inicio de la página.
     *
     * IMPORTANTE:
     * Sustituye href="#" por la URL correspondiente
     * antes de publicar. Después puedes eliminar este bloque.
     */
    serviceLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            if (link.getAttribute("href") === "#") {
                event.preventDefault();

                const serviceName =
                    link.dataset.service || "este servicio";

                alert(
                    "El enlace de " + serviceName +
                    " todavía debe configurarse con la dirección " +
                    "del sistema correspondiente."
                );
            }
        });
    });

    /*
     * Evita una navegación vacía mientras se configura
     * la URL oficial del aviso de privacidad.
     */
    privacyLink.addEventListener("click", function (event) {

        if (privacyLink.getAttribute("href") === "#") {
            event.preventDefault();

            alert(
                "Agrega la dirección oficial del aviso de privacidad " +
                "antes de publicar esta página."
            );
        }
    });

    /*
     * Actualiza automáticamente el año del pie de página.
     */
    document.getElementById("current-year").textContent =
        new Date().getFullYear();

    /*
     * Inicializa la página con todos los servicios visibles.
     */
    filterServices();

});