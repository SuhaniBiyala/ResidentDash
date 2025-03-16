document.addEventListener("DOMContentLoaded", function () {
    //ENSURE INPUT FIELDS ARE ENABLED 
    const nameField = document.getElementById("name");
    const contactField = document.getElementById("contact_number");
    const emailField = document.getElementById("email_id");
    const statusField = document.getElementById("status");

    if (nameField) nameField.removeAttribute("disabled");
    if (contactField) contactField.removeAttribute("disabled");
    if (emailField) emailField.removeAttribute("disabled");
    if (statusField) statusField.removeAttribute("disabled");

    // ADD FLAT 
    const addForm = document.getElementById("addFlatForm");
    if (addForm) {
        addForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const block = document.getElementById("block").value;
            const flat_number = document.getElementById("flat_number").value;
            const name = document.getElementById("name").value || null;
            const contact_number = document.getElementById("contact_number").value || null;
            const email_id = document.getElementById("email_id").value || null;
            const status = document.getElementById("status").value;

            const requestData = { block, flat_number, name, contact_number, email_id, status };
            console.log("Sending data to backend:", requestData);

            fetch("http://localhost:5001/api/residents/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData)
            })
            .then(response => response.json())
            .then(result => {
                console.log("Response from backend:", result);
                if (result.error) {
                    alert(result.error);
                } else {
                    alert("Flat added successfully!");
                    addForm.reset();
                    loadResidentsTable(); 
                }
            })
            .catch(error => console.error("Error adding flat:", error));
        });
    }

    //EDIT FLAT 
    const searchBtn = document.getElementById("searchBtn");
    const editForm = document.getElementById("editFlatForm");

    if (searchBtn && editForm) {
        searchBtn.addEventListener("click", function () {
            const block = document.getElementById("block").value.trim();
            const flat_number = document.getElementById("flat_number").value.trim();

            if (!block || !flat_number) {
                alert("Please enter Block and Flat Number.");
                return;
            }

            fetch(`http://localhost:5001/api/residents/search?block=${block}&flat_number=${flat_number}`)
                .then(response => response.json())
                .then(data => {
                    if (data.message) {
                        alert(data.message); // Show "Flat not found" message
                        editForm.reset();
                    } else {
                        document.getElementById("name").value = data.name || "";
                        document.getElementById("contact_number").value = data.contact_number || "";
                        document.getElementById("email_id").value = data.email_id || "";
                        document.getElementById("status").value = data.status;
                    }
                })
                .catch(error => {
                    console.error("Error fetching flat details:", error);
                    alert("Error fetching flat details. Please check console.");
                });
        });

        // to Save Changes
        editForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const block = document.getElementById("block").value.trim();
            const flat_number = document.getElementById("flat_number").value.trim();
            const name = document.getElementById("name").value.trim();
            const contact_number = document.getElementById("contact_number").value.trim();
            const email_id = document.getElementById("email_id").value.trim();
            const status = document.getElementById("status").value;

            if (!block || !flat_number) {
                alert("Block and Flat Number are required.");
                return;
            }

            fetch("http://localhost:5001/api/residents/edit", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ block, flat_number, name, contact_number, email_id, status })
            })
            .then(response => response.json())
            .then(result => {
                if (result.message) {
                    alert("Flat details updated successfully!");
                    window.location.href = "admin.html"; 
                } else {
                    alert("Error: " + (result.error || "Unknown error occurred"));
                }
            })
            .catch(error => console.error("Error updating flat details:", error));
        });
    }

    //DELETE FLAT 
    const deleteForm = document.getElementById("deleteFlatForm");
    if (deleteForm) {
        deleteForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const block = document.getElementById("block").value.trim();
            const flat_number = document.getElementById("flat_number").value.trim();

            if (!block || !flat_number) {
                alert("Please enter Block and Flat Number.");
                return;
            }

            if (confirm("Are you sure you want to delete this flat's details?")) {
                fetch("http://localhost:5001/api/residents/delete", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ block, flat_number })
                })
                .then(response => response.json())
                .then(result => {
                    if (result.message) {
                        alert(result.message);
                        loadResidentsTable(); 
                    } else {
                        alert("Error: " + (result.error || "Unknown error occurred"));
                    }
                })
                .catch(error => console.error("Error deleting flat details:", error));
            }
        });
    }

    //RESIDENTS TABLE 
    function loadResidentsTable() {
        const residentsTable = document.getElementById("residents-table-body");
        if (residentsTable) {
            fetch("http://localhost:5001/api/residents/show")
                .then(response => response.json())
                .then(data => {
                    let tableHTML = "";
                    data.forEach(resident => {
                        tableHTML += `<tr>
                            <td>${resident.block}</td>
                            <td>${resident.flat_number}</td>
                            <td>${resident.name || "-"}</td>
                            <td>${resident.contact_number || "-"}</td>
                            <td>${resident.email_id || "-"}</td>
                            <td>${resident.status}</td>
                        </tr>`;
                    });
                    residentsTable.innerHTML = tableHTML;
                })
                .catch(error => console.error("Error loading residents:", error));
        }
    }

    // Auto-load 
    loadResidentsTable();
});
