document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("searchBtn");
    const resetButton = document.getElementById("resetBtn");
    const filterButton = document.getElementById("filterBtn");
    const filterBlock = document.getElementById("filterBlock");
    const filterStatus = document.getElementById("filterStatus");
    const searchBlockInput = document.getElementById("searchBlock");
    const searchFlatInput = document.getElementById("searchFlat");
    const tableBody = document.getElementById("residents-table-body");

    // Function to fetch and display all flats
    async function fetchResidents() {
        try {
            const response = await fetch("http://localhost:5001/api/residents/show");
            const data = await response.json();
            renderTable(data);
        } catch (error) {
            console.error("Error fetching residents:", error);
        }
    }

    // Function to render table rows
    function renderTable(residents) {
        tableBody.innerHTML = ""; // Clear existing data
        residents.forEach(resident => {
            const row = document.createElement("tr");
            row.dataset.block = resident.block;
            row.dataset.flat = resident.flat_number;
            row.innerHTML = `
                <td>${resident.block}</td>
                <td>${resident.flat_number}</td>
                <td>${resident.name || "-"}</td>
                <td>${resident.contact_number || "-"}</td>
                <td>${resident.email_id || "-"}</td>
                <td>${resident.status}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Function to search and highlight the desired flat
    async function searchFlat() {
        const block = searchBlockInput.value.trim();
        const flat_number = searchFlatInput.value.trim();

        if (!block || !flat_number) {
            alert("Please enter both Block and Flat Number.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5001/api/residents/search?block=${block}&flat_number=${flat_number}`);
            const data = await response.json();

            if (data.message) {
                alert("Flat not found.");
                return;
            }

            // Apply filter and highlight the searched flat
            applyFilters();
            setTimeout(() => {
                highlightAndScroll(block, flat_number);
            }, 500);
        } catch (error) {
            console.error("Error searching resident:", error);
        }
    }

    // Function to highlight and scroll to the searched flat
    function highlightAndScroll(block, flat_number) {
        const rows = document.querySelectorAll("#residents-table-body tr");
        let found = false;

        rows.forEach(row => {
            row.classList.remove("highlight"); // Remove previous highlights
            if (row.dataset.block === block && row.dataset.flat === flat_number) {
                row.classList.add("highlight");
                row.scrollIntoView({ behavior: "smooth", block: "center" });
                found = true;
            }
        });

        if (!found) {
            alert("Flat not found in the displayed list.");
        }
    }
    // Function to fetch unique blocks for the dropdown
async function fetchBlocks() {
    try {
        const response = await fetch("http://localhost:5001/api/residents/blocks"); // Make sure this matches your backend route
        if (!response.ok) throw new Error("Failed to fetch blocks");

        const data = await response.json();

        filterBlock.innerHTML = '<option value="">All Blocks</option>'; // Default option

        data.forEach(block => {
            let option = document.createElement("option");
            option.value = block.block;
            option.textContent = block.block;
            filterBlock.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching blocks:", error);
        filterBlock.innerHTML = '<option value="">Error Loading Blocks</option>'; // Show error in dropdown
    }
}

// Call function when page loads
fetchBlocks();


    // Function to filter residents
    async function applyFilters() {
        const block = filterBlock.value;
        const status = filterStatus.value;
        let url = "http://localhost:5001/api/residents/filter";

        if (block || status) {
            url += `?block=${block}&status=${status}`;
        }

        try {
            const response = await fetch(url);
            const data = await response.json();
            renderTable(data);
        } catch (error) {
            console.error("Error filtering residents:", error);
        }
    }

    // Function to reset filters and show all flats
    async function resetFilters() {
        filterBlock.value = "";
        filterStatus.value = "";
        searchBlockInput.value = "";
        searchFlatInput.value = "";
        fetchResidents();
    }

    searchButton.addEventListener("click", searchFlat);
    resetButton.addEventListener("click", resetFilters);
    filterButton.addEventListener("click", applyFilters);

    fetchResidents(); // Load all residents initially
});
